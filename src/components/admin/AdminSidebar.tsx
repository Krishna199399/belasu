'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BookOpen,
  Laptop,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
  Boxes,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthPayload } from '@/lib/auth';

interface AdminSidebarProps {
  authUser: AuthPayload;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ authUser }) => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Inventory (Stock)', href: '/admin/inventory', icon: Boxes },
    { label: 'Hard Copy Books', href: '/admin/products', icon: BookOpen },
    { label: 'Digital Reader', href: '/admin/digital', icon: Laptop },
    { label: 'Customers', href: '/admin/users', icon: Users },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black">
            B
          </div>
          <div>
            <span className="font-black text-white text-base tracking-tight block">
              Belesu
            </span>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">
              Admin Portal
            </span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Footer */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <div className="px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-slate-200 truncate block">
                {authUser.name || 'Admin'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono block">
              {authUser.phone}
            </span>
          </div>
          <button
            onClick={() => logout()}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold text-slate-400 hover:text-amber-400 hover:bg-slate-800/40 rounded-lg transition"
        >
          <span>View Public Store</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Mobile hamburger button exposed via event or floating if needed */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-5 left-5 z-40 p-3 rounded-full bg-slate-900 text-amber-400 border border-slate-700 shadow-xl flex items-center justify-center"
        aria-label="Open Admin Menu"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
};
