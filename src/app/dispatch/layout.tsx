import React from 'react';
import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import { requireDispatchStaff } from '@/lib/dispatchAuth';
import {
  Truck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Package,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export const metadata = {
  title: 'Packing & Dispatch Console | Belesu',
  description: 'Order fulfillment, Word packaging sheets, and dispatch batch archive for Belesu',
};

export default async function DispatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staffUser = await requireDispatchStaff();

  // If not logged in or unauthorized as staff/admin, display access gate
  if (!staffUser) {
    const currentAuth = await getAuthUser();

    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2">
            Dispatch Portal Access Required
          </h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {currentAuth
              ? `You are signed in as ${currentAuth.phone}, but this account is not registered as an authorized dispatch staff member.`
              : 'Please log in with an authorized Belesu packaging & dispatch staff account.'}
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/login?redirect=/dispatch"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              <span>{currentAuth ? 'Switch Account' : 'Log In with Phone OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
            >
              <span>Return to Belesu Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700/60 text-[11px] text-slate-400">
            For access approval, contact Belesu administrator at <span className="font-mono text-slate-300">91481 55350</span>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
              <Truck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">Belesu</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Dispatch Console
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Order Collection, Word Packaging Slips & Dispatch Archive
              </p>
            </div>
          </div>

          {/* Right Profile & Navigation */}
          <div className="flex items-center gap-3">
            {staffUser.isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Portal</span>
              </Link>
            )}

            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-mono text-[11px]">{staffUser.phone}</span>
            </div>

            <Link
              href="/api/auth/logout"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
