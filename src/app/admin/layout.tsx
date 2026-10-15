import React from 'react';
import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BookOpen,
  Laptop,
  BarChart3,
  Settings,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Admin Portal | Belesu',
  description: 'Belesu E-commerce & Digital Reader Admin Portal',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await getAuthUser();

  // If not logged in or not an admin, show a high-security lock screen
  if (!authUser || !authUser.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2">
            Admin Access Required
          </h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {authUser
              ? `You are logged in as ${authUser.phone}, but this account does not have administrator privileges.`
              : 'Please log in with an authorized Belesu administrator account to access the control panel.'}
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/login?redirect=/admin"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              <span>{authUser ? 'Switch Account' : 'Log In to Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
            >
              <span>Return to Public Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700/60 text-[11px] text-slate-400">
            Authorized administrator phone: <span className="font-mono text-slate-400 font-semibold">8105829199</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Desktop & Mobile Admin Sidebar */}
      <AdminSidebar authUser={authUser} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <AdminHeader authUser={authUser} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
