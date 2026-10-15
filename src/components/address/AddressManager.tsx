'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Address } from '@/types';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import { Plus, X } from 'lucide-react';

interface AddressManagerProps {
  mode?: 'manage' | 'select';
  onSelectAddress?: (address: Address) => void;
  selectedAddressId?: string;
}

export default function AddressManager({ 
  mode = 'manage',
  onSelectAddress,
  selectedAddressId 
}: AddressManagerProps) {
  const { user, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addresses = user?.addresses || [];

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address. Please try again.');
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address. Please try again.');
    }
  };

  const handleSubmit = async (addressData: Partial<Address>) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressData);
      } else {
        // Ensure all required fields are present for new address
        const completeAddressData = {
          firstName: addressData.firstName!,
          lastName: addressData.lastName!,
          address1: addressData.address1!,
          address2: addressData.address2 || '',
          city: addressData.city!,
          state: addressData.state!,
          postcode: addressData.postcode!,
          phone: addressData.phone!,
          email: addressData.email || '',
          label: addressData.label || '',
          isDefault: false,
        };
        await addAddress(completeAddressData);
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSelectAddress = (addressId: string) => {
    if (mode === 'select' && onSelectAddress) {
      const address = addresses.find(a => a.id === addressId);
      if (address) {
        onSelectAddress(address);
      }
    }
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <AddressForm
          address={editingAddress}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          asNestedForm={mode === 'select'} // Use div instead of form when nested in checkout form
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {mode === 'select' ? 'Select Delivery Address' : 'Saved Addresses'}
        </h3>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No addresses saved yet</p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses
            .sort((a, b) => {
              // Default address first
              if (a.isDefault && !b.isDefault) return -1;
              if (!a.isDefault && b.isDefault) return 1;
              // Then by usage count
              return (b.usageCount || 0) - (a.usageCount || 0);
            })
            .map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={mode === 'manage' ? handleEdit : undefined}
                onDelete={mode === 'manage' ? handleDelete : undefined}
                onSetDefault={mode === 'manage' ? handleSetDefault : undefined}
                selectable={mode === 'select'}
                selected={mode === 'select' && selectedAddressId === address.id}
                onSelect={mode === 'select' ? handleSelectAddress : undefined}
              />
            ))}
        </div>
      )}

      {mode === 'select' && addresses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Click on an address card to select it for delivery.
            {!selectedAddressId && ' You must select an address to proceed.'}
          </p>
        </div>
      )}
    </div>
  );
}
