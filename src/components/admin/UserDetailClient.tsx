'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Shield,
  BookOpen,
  Laptop,
  CheckCircle2,
  Lock,
  Unlock,
  Package,
  MapPin,
  MessageCircle,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  item_total: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  order_total_amount: number;
  has_physical_books: boolean;
  has_digital_books: boolean;
  order_items?: OrderItem[];
}

interface Address {
  id: string;
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  is_default: boolean;
}

interface DigitalBookPermission {
  id: string;
  title: string;
  gradeClass: number;
  subject: string;
  isOwned: boolean;
}

interface UserData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  created_at: string;
  isAdmin: boolean;
  addresses: Address[];
  orders: Order[];
  availableDigitalBooks: DigitalBookPermission[];
}

export const UserDetailClient: React.FC<{ initialUser: UserData }> = ({
  initialUser,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<UserData>(initialUser);
  const [updatingBookId, setUpdatingBookId] = useState<string | null>(null);

  const toggleBookAccess = async (bookId: string, currentOwned: boolean) => {
    setUpdatingBookId(bookId);
    const action = currentOwned ? 'revoke_digital' : 'grant_digital';

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, bookId }),
      });
      const data = await res.json();
      if (data.success) {
        setUser((prev) => ({
          ...prev,
          availableDigitalBooks: prev.availableDigitalBooks.map((b) =>
            b.id === bookId ? { ...b, isOwned: !currentOwned } : b
          ),
        }));
        toast.success(
          currentOwned
            ? 'Access revoked successfully'
            : 'Access granted successfully!'
        );
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to update book access');
      }
    } catch {
      toast.error('Network error updating access');
    } finally {
      setUpdatingBookId(null);
    }
  };

  const cleanPhone = user.phone.replace(/^\+91/, '').trim();
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(
    user.name || 'Student'
  )},%20this%20is%20Belesu%20Support.`;

  return (
    <div className="space-y-6">
      {/* Back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {user.name || 'Anonymous User'}
              </h2>
              {user.isAdmin && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <Shield className="w-3 h-3 text-amber-600" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer since{' '}
              {new Date(user.created_at).toLocaleDateString('en-IN', {
                dateStyle: 'medium',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
              Phone Number
            </span>
            <span className="text-sm font-bold font-mono text-slate-900">
              📞 {user.phone}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
              Email Address
            </span>
            <span className="text-sm font-medium text-slate-700">
              {user.email || 'Not provided'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
              User ID
            </span>
            <span className="text-xs font-mono text-slate-500 break-all">
              {user.id}
            </span>
          </div>
        </div>
      </div>

      {/* Digital Access Matrix (Classes 6–10) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-indigo-600" />
              <h3 className="font-black text-slate-900 text-base">
                Digital Guidebook Access Permissions
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click &quot;Grant Access&quot; to instantly unlock digital guidebooks for this student without requiring payment.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full w-fit">
            {user.availableDigitalBooks.filter((b) => b.isOwned).length} of{' '}
            {user.availableDigitalBooks.length} unlocked
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {user.availableDigitalBooks.map((book) => {
            const isProcessing = updatingBookId === book.id;
            return (
              <div
                key={book.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {book.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      Class {book.gradeClass}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 block">
                    Subject: {book.subject} • ID: <span className="font-mono">{book.id}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {book.isOwned ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  )}

                  <button
                    onClick={() => toggleBookAccess(book.id, book.isOwned)}
                    disabled={isProcessing}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 ${
                      book.isOwned
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    } disabled:opacity-50`}
                  >
                    {book.isOwned ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isProcessing ? 'Revoking...' : 'Revoke Access'}</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{isProcessing ? 'Granting...' : 'Grant Access'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders & Delivery Addresses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Past Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">Purchase History</h3>
            <span className="text-xs font-semibold text-slate-500">
              {user.orders.length} orders
            </span>
          </div>

          {user.orders.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No orders placed by this customer yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {user.orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {o.order_number}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(o.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {formatPrice(o.order_total_amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {o.order_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Saved Addresses (1 col) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-base">Saved Addresses</h3>
            <p className="text-xs text-slate-500">Saved shipping locations</p>
          </div>

          <div className="p-5 space-y-4">
            {user.addresses.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No addresses saved.</p>
            ) : (
              user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1 text-slate-700"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>
                      {addr.first_name} {addr.last_name}
                    </span>
                    {addr.is_default && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p>{addr.address1}</p>
                  {addr.address2 && <p>{addr.address2}</p>}
                  <p>
                    {addr.city}, {addr.state} -{' '}
                    <span className="font-mono font-bold">{addr.postcode}</span>
                  </p>
                  <p className="font-mono text-slate-500 pt-1">📞 {addr.phone}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
