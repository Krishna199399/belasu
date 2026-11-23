'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function DispatchLogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await logout();
        router.replace('/auth/login?redirect=/dispatch/');
        router.refresh();
      }}
      className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
      title="Log out"
      aria-label="Log out"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
