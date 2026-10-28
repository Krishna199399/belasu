'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Address } from '@/types';
import { MapPin, Loader, Sparkles, X, Check, Search } from 'lucide-react';
import { searchLocalities, LocalitySuggestion } from '@/lib/addressAutocomplete';
import { lookupPincode } from '@/lib/pincodeLookup';

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (addressData: Partial<Address>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  asNestedForm?: boolean; // Flag to render as div instead of form when nested
}

const INDIAN_STATES = [
  'Karnataka',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
  'Chandigarh',
];

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  isSubmitting = false,
  asNestedForm = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState(() => ({
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    address1: address?.address1 || '',
    address2: address?.address2 || '',
    city: address?.city || '',
    state: address?.state || 'Karnataka',
    postcode: address?.postcode || '',
    phone: address?.phone || '',
    email: address?.email || '',
    label: address?.label || '',
  }));

  const [prevAddressId, setPrevAddressId] = useState(address?.id);

  if (address?.id !== prevAddressId) {
    setPrevAddressId(address?.id);
    setFormData({
      firstName: address?.firstName || '',
      lastName: address?.lastName || '',
      address1: address?.address1 || '',
      address2: address?.address2 || '',
      city: address?.city || '',
      state: address?.state || 'Karnataka',
      postcode: address?.postcode || '',
      phone: address?.phone || '',
      email: address?.email || '',
      label: address?.label || '',
    });
  }

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Smart Autocomplete States
  const [suggestions, setSuggestions] = useState<LocalitySuggestion[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);

  const address1ContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Handle clicking outside the suggestions popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        address1ContainerRef.current &&
        !address1ContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup pending network calls on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address1.trim()) newErrors.address1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required';
    else if (!/^\d{6}$/.test(formData.postcode)) newErrors.postcode = 'Invalid postcode (6 digits)';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, '')))
      newErrors.phone = 'Invalid phone number (10 digits)';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email address';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  /**
   * Smart select suggestion (Swiggy / Zepto style)
   */
  const handleSelectSuggestion = useCallback((suggestion: LocalitySuggestion) => {
    setFormData((prev) => ({
      ...prev,
      address1: suggestion.address1 || suggestion.mainText,
      city: suggestion.city || prev.city,
      state: suggestion.state || prev.state,
      postcode: suggestion.postcode || prev.postcode,
    }));

    setShowSuggestions(false);
    setSuggestions([]);
    setHighlightedIndex(-1);

    // Clear any validation errors for populated fields
    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors.address1;
      if (suggestion.city) delete nextErrors.city;
      if (suggestion.state) delete nextErrors.state;
      if (suggestion.postcode) delete nextErrors.postcode;
      return nextErrors;
    });
  }, []);

  /**
   * Search localities with debouncing
   */
  const triggerLocalitySearch = (query: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    if (query.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearchingAddress(false);
      return;
    }

    setIsSearchingAddress(true);

    debounceTimerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const results = await searchLocalities(query, controller.signal);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setHighlightedIndex(-1);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.warn('Locality search failed:', err);
        }
      } finally {
        setIsSearchingAddress(false);
      }
    }, 300);
  };

  /**
   * 6-Digit PIN Code Auto-Lookup (India Post API)
   */
  const triggerPincodeLookup = async (pincode: string) => {
    const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);
    if (cleanPin.length !== 6) return;

    setIsLookingUpPin(true);
    try {
      const details = await lookupPincode(cleanPin);
      if (details) {
        setFormData((prev) => ({
          ...prev,
          city: details.city || prev.city,
          state: details.state || prev.state,
          postcode: cleanPin,
        }));

        setErrors((prev) => {
          const nextErrors = { ...prev };
          delete nextErrors.postcode;
          if (details.city) delete nextErrors.city;
          if (details.state) delete nextErrors.state;
          return nextErrors;
        });
      }
    } catch (err) {
      console.warn('Pincode lookup error:', err);
    } finally {
      setIsLookingUpPin(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'address1') {
      setFormData((prev) => ({ ...prev, address1: value }));
      if (errors.address1) setErrors((prev) => ({ ...prev, address1: '' }));
      triggerLocalitySearch(value);
      return;
    }

    if (name === 'postcode') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev) => ({ ...prev, postcode: digitsOnly }));
      if (errors.postcode) setErrors((prev) => ({ ...prev, postcode: '' }));
      if (digitsOnly.length === 6) {
        triggerPincodeLookup(digitsOnly);
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Keyboard navigation for suggestions dropdown
  const handleAddress1KeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearAddress1 = () => {
    setFormData((prev) => ({ ...prev, address1: '' }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const FormContainer = asNestedForm ? 'div' : 'form';
  const submitHandler = asNestedForm ? undefined : handleSubmit;

  return (
    <FormContainer onSubmit={submitHandler} className="space-y-4">
      {/* Name fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Address Line 1 with Smart Locality Autocomplete */}
      <div ref={address1ContainerRef} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 1 <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <input
            type="text"
            name="address1"
            value={formData.address1}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onKeyDown={handleAddress1KeyDown}
            placeholder="Type locality/colony (e.g. Samarth Nagar, Indiranagar, Tilakwadi)..."
            autoComplete="off"
            className={`w-full px-3.5 py-2.5 pr-16 min-h-[44px] text-base sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.address1 ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />

          {/* Right Icons: Clear button and Spinner */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400">
            {isSearchingAddress && <Loader className="w-4 h-4 animate-spin text-orange-500" />}
            {formData.address1 && !isSearchingAddress && (
              <button
                type="button"
                onClick={clearAddress1}
                className="p-1 hover:text-gray-600 text-gray-400 rounded-full hover:bg-gray-100 transition-colors"
                title="Clear address"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {errors.address1 && <p className="text-red-500 text-xs mt-1">{errors.address1}</p>}

        {/* Suggestions Dropdown (Swiggy / Zepto Style) */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-100 animate-in fade-in duration-150">
            <div className="px-3.5 py-2 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-between text-[11px] font-semibold text-orange-900 border-b border-orange-100">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                Select Locality to Auto-fill City &amp; PIN
              </span>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowSuggestions(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100 overscroll-contain touch-pan-y">
              {suggestions.map((item, index) => {
                const isSelected = highlightedIndex === index;
                return (
                  <li
                    key={item.id}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleSelectSuggestion(item);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-3.5 py-2.5 flex items-start gap-3 cursor-pointer transition-colors active:bg-orange-100/80 ${
                      isSelected ? 'bg-orange-50/80 text-orange-950' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {item.mainText}
                      </div>
                      {item.secondaryText && (
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          {item.secondaryText}
                        </div>
                      )}
                    </div>

                    {item.postcode && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0 self-center">
                        {item.postcode}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="px-3.5 py-1.5 bg-gray-50 text-[11px] text-gray-500 text-center">
              Tap any location to auto-fill City, State and Pincode
            </div>
          </div>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 2 (Flat / House / Apartment / Landmark)
        </label>
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={handleInputChange}
          placeholder="Flat / Door / House No., Apartment, Landmark (optional)"
          className="w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={isSubmitting}
        />
      </div>

      {/* City, State, Postcode Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="e.g. Belagavi"
            className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Postcode <span className="text-red-500">*</span>
            </label>
            {isLookingUpPin && (
              <span className="text-[11px] text-orange-600 flex items-center gap-1">
                <Loader className="w-3 h-3 animate-spin" />
                Finding city...
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleInputChange}
              placeholder="e.g. 590001"
              maxLength={6}
              className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.postcode ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {formData.postcode.length === 6 && !isLookingUpPin && !errors.postcode && (
              <Check className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            )}
          </div>
          {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode}</p>}
        </div>
      </div>

      {/* Phone Number & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="9876543210"
            maxLength={10}
            className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com (optional)"
            className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Label (Optional)</label>
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={handleInputChange}
          placeholder="Home, Office, Parents, etc."
          className="w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={isSubmitting}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 active:scale-98 cursor-pointer text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type={asNestedForm ? 'button' : 'submit'}
          onClick={
            asNestedForm
              ? () => {
                  if (validateForm()) onSubmit(formData);
                }
              : undefined
          }
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98 cursor-pointer text-sm font-semibold shadow-md"
        >
          {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
          {address ? 'Update Address' : 'Save Address'}
        </button>
      </div>
    </FormContainer>
  );
}
