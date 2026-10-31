'use client';

import React from 'react';
import {
  Shield,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { formatPrice, SHIPPING_FEE } from '@/lib/utils';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Store Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Delivery tariffs and authorized administrators
        </p>
      </div>

      {/* Shipping & Delivery Configuration */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-600" />
          <h3 className="font-black text-slate-900 text-base">
            Shipping & Delivery Tariffs
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Standard flat-rate courier fee applied across all districts in Karnataka.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Standard Courier Rate
            </span>
            <span className="text-xl font-black text-slate-900 block">
              {formatPrice(SHIPPING_FEE)} per order
            </span>
            <span className="text-xs text-slate-500">Applied automatically at checkout for hard copy books</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Digital E-Reader Delivery
            </span>
            <span className="text-xl font-black text-indigo-600 block">
              Instant Access (₹0)
            </span>
            <span className="text-xs text-slate-500">Digital guidebooks unlock immediately upon payment</span>
          </div>
        </div>
      </div>

      {/* Administrator Access Management */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h3 className="font-black text-slate-900 text-base">
            Authorized Administrators
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          The following phone numbers have full administrative privileges to manage orders, grant reader access, and update catalog prices:
        </p>

        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
              👑
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm block">Primary Administrator</span>
              <span className="font-mono text-xs text-slate-600">📞 +91 8105829199</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active
          </span>
        </div>
      </div>
    </div>
  );
}
