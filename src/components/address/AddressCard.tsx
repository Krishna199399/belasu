'use client';

import { Address } from '@/types';
import { MapPin, Phone, Mail, Star, Edit, Trash2 } from 'lucide-react';

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
  onDelete?: (addressId: string) => void;
  onSetDefault?: (addressId: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (addressId: string) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  selectable = false,
  selected = false,
  onSelect,
}: AddressCardProps) {
  const handleCardClick = () => {
    if (selectable && onSelect) {
      onSelect(address.id);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        selectable ? 'cursor-pointer hover:border-orange-500' : ''
      } ${selected ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500' : 'border-gray-200'} ${
        address.isDefault ? 'bg-amber-50' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">
            {address.firstName} {address.lastName}
          </h3>
          {address.isDefault && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              <Star className="w-3 h-3 fill-current" />
              Default
            </span>
          )}
          {address.label && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              {address.label}
            </span>
          )}
        </div>
        
        {!selectable && (
          <div className="flex gap-1">
            {!address.isDefault && onSetDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSetDefault(address.id);
                }}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer active:scale-95"
                title="Set as default"
              >
                <Star className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(address);
                }}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer active:scale-95"
                title="Edit address"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(address.id);
                }}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer active:scale-95"
                title="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
          <div>
            <p>{address.address1}</p>
            {address.address2 && <p>{address.address2}</p>}
            <p>
              {address.city}, {address.state} - {address.postcode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
          <p>{address.phone}</p>
        </div>

        {address.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <p>{address.email}</p>
          </div>
        )}
      </div>

      {selected && selectable && (
        <div className="mt-3 pt-3 border-t border-orange-200">
          <p className="text-xs text-orange-700 font-medium">✓ Delivering to this address</p>
        </div>
      )}

      {address.usageCount && address.usageCount > 0 && !selectable && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Used {address.usageCount} time{address.usageCount > 1 ? 's' : ''}
            {address.lastUsedAt && ` • Last used ${new Date(address.lastUsedAt).toLocaleDateString()}`}
          </p>
        </div>
      )}
    </div>
  );
}
