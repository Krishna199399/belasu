'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Address } from '@/types';
import { MapPin, Loader, Sparkles, X, Check, Search, Home } from 'lucide-react';
import { searchLocalities, LocalitySuggestion } from '@/lib/addressAutocomplete';
import { lookupPincode } from '@/lib/pincodeLookup';

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (addressData: Partial<Address>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  asNestedForm?: boolean; // Flag to render as div instead of form when nested
}

interface AddressFormData {
  firstName: string;
  lastName: string;
  houseNo: string;
  street: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
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

function parseInitialAddress(addr?: Address | null): AddressFormData {
  if (!addr) {
    return {
      firstName: '',
      lastName: '',
      houseNo: '',
      street: '',
      area: '',
      landmark: '',
      city: '',
      state: 'Karnataka',
      postcode: '',
      phone: '',
      email: '',
    };
  }

  let houseNo = addr.houseNo || '';
  let street = addr.street || '';
  let area = addr.area || '';
  let landmark = addr.landmark || '';

  // If granular fields aren't already set, parse them intelligently from address1 & address2
  if (!houseNo && !street && addr.address1) {
    const parts = addr.address1.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      houseNo = parts[0];
      street = parts.slice(1).join(', ');
    } else {
      houseNo = addr.address1;
      street = '';
    }
  }

  if (!area && !landmark && addr.address2) {
    if (/landmark:\s*/i.test(addr.address2)) {
      const [before, after] = addr.address2.split(/landmark:\s*/i);
      area = before.replace(/,\s*$/, '').trim();
      landmark = after ? after.trim() : '';
    } else {
      area = addr.address2;
      landmark = '';
    }
  }

  return {
    firstName: addr.firstName || '',
    lastName: addr.lastName || '',
    houseNo,
    street,
    area,
    landmark,
    city: addr.city || '',
    state: addr.state || 'Karnataka',
    postcode: addr.postcode || '',
    phone: addr.phone || '',
    email: addr.email || '',
  };
}

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  isSubmitting = false,
  asNestedForm = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>(() => parseInitialAddress(address));
  const [prevAddressId, setPrevAddressId] = useState(address?.id);

  if (address?.id !== prevAddressId) {
    setPrevAddressId(address?.id);
    setFormData(parseInitialAddress(address));
  }

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Smart Autocomplete States
  const [suggestions, setSuggestions] = useState<LocalitySuggestion[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);

  const areaContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Handle clicking outside the suggestions popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        areaContainerRef.current &&
        !areaContainerRef.current.contains(event.target as Node)
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.houseNo.trim()) {
      newErrors.houseNo = 'Flat / House / Door / Building number is required';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'Road / Street / Cross / Main name is required';
    }
    if (!formData.area.trim()) {
      newErrors.area = 'Area / Locality / Layout name is required';
    }
    if (!formData.landmark.trim()) {
      newErrors.landmark = 'Landmark is required (e.g. Near Temple / Opp. Bank)';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    const cleanPin = formData.postcode.trim();
    if (!cleanPin) {
      newErrors.postcode = 'Postcode is required';
    } else if (!/^\d{6}$/.test(cleanPin)) {
      newErrors.postcode = 'Invalid postcode (must be 6 digits)';
    }

    const cleanDigits = formData.phone.replace(/\D/g, '');
    const phoneDigits = cleanDigits.length === 12 && cleanDigits.startsWith('91')
      ? cleanDigits.slice(2)
      : cleanDigits;
    if (!formData.phone.trim()) {
      newErrors.phone = '10-digit mobile number is required';
    } else if (phoneDigits.length !== 10) {
      newErrors.phone = 'Invalid phone number (must be 10 digits)';
    }

    const cleanEmail = formData.email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      const fullAddress1 = [formData.houseNo.trim(), formData.street.trim()].filter(Boolean).join(', ');
      const fullAddress2 = [
        formData.area.trim(),
        `Landmark: ${formData.landmark.trim()}`
      ].filter(Boolean).join(', ');

      const cleanDigits = formData.phone.replace(/\D/g, '');
      const phoneDigits = cleanDigits.length === 12 && cleanDigits.startsWith('91')
        ? cleanDigits.slice(2)
        : cleanDigits;

      onSubmit({
        ...formData,
        address1: fullAddress1,
        address2: fullAddress2,
        houseNo: formData.houseNo.trim(),
        street: formData.street.trim(),
        area: formData.area.trim(),
        landmark: formData.landmark.trim(),
        phone: phoneDigits,
        email: formData.email.trim(),
        postcode: formData.postcode.trim(),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmit();
  };

  /**
   * Smart select suggestion (Swiggy / Zepto style)
   */
  const handleSelectSuggestion = useCallback((suggestion: LocalitySuggestion) => {
    setFormData((prev) => ({
      ...prev,
      area: suggestion.address1 || suggestion.mainText,
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
      delete nextErrors.area;
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

    if (name === 'area') {
      setFormData((prev) => ({ ...prev, area: value }));
      if (errors.area) setErrors((prev) => ({ ...prev, area: '' }));
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

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Keyboard navigation for suggestions dropdown
  const handleAreaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const clearArea = () => {
    setFormData((prev) => ({ ...prev, area: '' }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const FormContainer = asNestedForm ? 'div' : 'form';
  const submitHandler = asNestedForm ? undefined : handleSubmit;

  return (
    <FormContainer onSubmit={submitHandler} className="space-y-4">
      {/* Informative Guidance Banner */}
      <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 sm:p-3.5 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed shadow-2xs">
        <Home className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-950">Accurate Doorstep Delivery:</span> Please provide your complete Flat/House number, Road/Street, Area, and Landmark so courier partners can deliver directly to your door without delays.
        </div>
      </div>

      {/* 1. Name Fields Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First name"
            className={`w-full px-3 py-2 min-h-[42px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.firstName ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last name"
            className={`w-full px-3 py-2 min-h-[42px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.lastName ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* 2. Flat / House No. and Road / Street (Small dedicated fields) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Flat / House No. / Building Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="houseNo"
            value={formData.houseNo}
            onChange={handleInputChange}
            placeholder="e.g. Flat 302, Sai Residency / House #45"
            className={`w-full px-3 py-2 min-h-[42px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.houseNo ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.houseNo && <p className="text-red-500 text-xs mt-1">{errors.houseNo}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Road / Street / Cross / Main <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            placeholder="e.g. 5th Main Road, 2nd Cross"
            className={`w-full px-3 py-2 min-h-[42px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.street ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
        </div>
      </div>

      {/* 3. Area / Locality (with Autocomplete) and Landmark */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div ref={areaContainerRef} className="relative">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Area / Locality / Layout <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onKeyDown={handleAreaKeyDown}
              placeholder="e.g. Jayanagar 4th Block, Indiranagar"
              autoComplete="off"
              className={`w-full px-3 py-2 pr-14 min-h-[42px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.area ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {/* Right Icons: Clear button and Spinner / Search */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
              {isSearchingAddress && <Loader className="w-4 h-4 animate-spin text-orange-500" />}
              {formData.area && !isSearchingAddress && (
                <button
                  type="button"
                  onClick={clearArea}
                  className="p-1 hover:text-gray-600 text-gray-400 rounded-full hover:bg-gray-100 transition-colors"
                  title="Clear area"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <Search className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>
          {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}

          {/* Locality Autocomplete dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-100 animate-in fade-in duration-150">
              <div className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-between text-[11px] font-semibold text-orange-900 border-b border-orange-100">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  Select Area to Auto-fill City &amp; PIN
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

              <ul className="max-h-56 overflow-y-auto divide-y divide-gray-100 overscroll-contain touch-pan-y">
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
                      className={`px-3 py-2 flex items-start gap-2.5 cursor-pointer transition-colors active:bg-orange-100/80 ${
                        isSelected ? 'bg-orange-50 text-orange-950' : 'hover:bg-gray-50 text-gray-800'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'
                        }`}
                      >
                        <MapPin className="w-3 h-3" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          {item.mainText}
                        </div>
                        {item.secondaryText && (
                          <div className="text-[11px] text-gray-500 truncate mt-0.5">
                            {item.secondaryText}
                          </div>
                        )}
                      </div>

                      {item.postcode && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0 self-center">
                          {item.postcode}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Landmark <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleInputChange}
            placeholder="e.g. Near Ganapathi Temple / Opp. Post Office"
            className={`w-full px-3 py-2 min-h-[42px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.landmark ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.landmark && <p className="text-red-500 text-xs mt-1">{errors.landmark}</p>}
        </div>
      </div>

      {/* 4. City, State, Postcode */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            City / Town <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            className={`w-full px-3 py-2 min-h-[42px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.city ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 min-h-[42px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white ${
              errors.state ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
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
            <label className="block text-xs font-semibold text-slate-700">
              Postcode (PIN) <span className="text-red-500">*</span>
            </label>
            {isLookingUpPin && (
              <span className="text-[10px] text-orange-600 flex items-center gap-1">
                <Loader className="w-2.5 h-2.5 animate-spin" />
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
              placeholder="6-digit PIN code"
              maxLength={6}
              className={`w-full px-3 py-2 min-h-[42px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.postcode ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
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

      {/* 5. Phone Number & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="10-digit mobile number"
            maxLength={10}
            className={`w-full px-3 py-2 min-h-[42px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.phone ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address (for order updates)"
            className={`w-full px-3 py-2 min-h-[42px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.email ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* 6. Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-5 py-2 min-h-[42px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 active:scale-98 cursor-pointer text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type={asNestedForm ? 'button' : 'submit'}
          onClick={asNestedForm ? () => handleFormSubmit() : undefined}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2 min-h-[42px] bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98 cursor-pointer text-sm font-semibold shadow-sm"
        >
          {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
          {address ? 'Update Address' : 'Save Address'}
        </button>
      </div>
    </FormContainer>
  );
}
