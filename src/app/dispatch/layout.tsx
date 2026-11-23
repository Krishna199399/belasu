import React from 'react';
import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import { Truck, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { DispatchLogoutButton } from '@/components/dispatch/DispatchLogoutButton';

export const metadata = {
  title: 'Packing & Dispatch | Belesu',
  description: 'Belesu order packing and dispatch console',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function DispatchLayout({ children }: { children: React.ReactNode }) {
  const authUser = await getAuthUser();
  const allowed = Boolean(authUser && (authUser.isAdmin || authUser.isDispatch));

  if (!authUser || !allowed) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2">Dispatch Access Required</h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {authUser
              ? `You are logged in as ${authUser.phone}, but this number is not registered as dispatch staff.`
              : 'Log in with your registered dispatch staff phone number.'}
          </p>
          <div className="space-y-3">
            <Link
              href="/auth/login?redirect=/dispatch/"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
            >
              <span>{authUser ? 'Switch Account' : 'Log In with Phone OTP'}</span>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">Belesu</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Dispatch
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Print dispatch sheets &amp; track packed orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {authUser.isAdmin && (
              <Link
                href="/admin/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Portal</span>
              </Link>
            )}
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-xs font-bold text-slate-200">{authUser.name || 'Staff'}</span>
              <span className="text-[11px] text-slate-400 font-mono">{authUser.phone}</span>
            </div>
            <DispatchLogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
  );
}
