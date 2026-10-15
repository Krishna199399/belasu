'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { AuthPayload } from '@/lib/auth';

interface AdminHeaderProps {
  authUser: AuthPayload;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ authUser }) => {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard Overview';
    if (pathname.startsWith('/admin/orders/')) return 'Order Details';
    if (pathname.startsWith('/admin/orders')) return 'Orders Management';
    if (pathname.startsWith('/admin/users/')) return 'Customer Profile';
    if (pathname.startsWith('/admin/users')) return 'Customer Directory';
    if (pathname.startsWith('/admin/products')) return 'Hard Copy Book Catalog (Classes 1–5)';
    if (pathname.startsWith('/admin/digital')) return 'Digital Reader Manager (Classes 6–10)';
    if (pathname.startsWith('/admin/analytics')) return 'Analytics & Reports';
    if (pathname.startsWith('/admin/settings')) return 'Store Settings';
    return 'Admin Portal';
  };

  const todayStr = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">Belesu Management Console</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {todayStr}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Store Live</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 text-xs font-bold transition shadow-xs"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </header>
  );
};
