'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { AuthUser, Address } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  sendOtp: (phone: string, name?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // Address Management
  addAddress: (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<Address | null>;
  updateAddress: (addressId: string, updates: Partial<Address>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  setDefaultAddress: (addressId: string) => Promise<boolean>;
  
  // User Profile Updates
  updateProfile: (updates: { name?: string; email?: string; emailOptIn?: boolean; smsOptIn?: boolean }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const sendOtp = useCallback(async (phone: string, name?: string) => {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name }),
    });
    return res.json();
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string, name?: string) => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, name }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}! 🎉`);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  // Address Management Methods
  const addAddress = useCallback(async (addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    if (!user) {
      toast.error('Please login to add address');
      return null;
    }

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      });

      const data = await res.json();
      
      if (data.success) {
        await refreshUser();
        toast.success('Address added successfully');
        return data.address;
      } else {
        toast.error(data.error || 'Failed to add address');
        return null;
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      return null;
    }
  }, [user, refreshUser]);

  const updateAddress = useCallback(async (addressId: string, updates: Partial<Address>) => {
    if (!user) return false;

    try {
      const res = await fetch(`/api/addresses/${addressId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      
      if (data.success) {
        await refreshUser();
        toast.success('Address updated successfully');
        return true;
      } else {
        toast.error(data.error || 'Failed to update address');
        return false;
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      return false;
    }
  }, [user, refreshUser]);

  const deleteAddress = useCallback(async (addressId: string) => {
    if (!user) return false;

    try {
      const res = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      
      if (data.success) {
        await refreshUser();
        toast.success('Address deleted successfully');
        return true;
      } else {
        toast.error(data.error || 'Failed to delete address');
        return false;
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      return false;
    }
  }, [user, refreshUser]);

  const setDefaultAddress = useCallback(async (addressId: string) => {
    if (!user) return false;

    try {
      const res = await fetch('/api/addresses/set-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId }),
      });

      const data = await res.json();
      
      if (data.success) {
        await refreshUser();
        toast.success('Default address updated');
        return true;
      } else {
        toast.error(data.error || 'Failed to set default address');
        return false;
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      return false;
    }
  }, [user, refreshUser]);

  const updateProfile = useCallback(async (updates: { name?: string; email?: string; emailOptIn?: boolean; smsOptIn?: boolean }) => {
    if (!user) return false;

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      
      if (data.success) {
        await refreshUser();
        toast.success('Profile updated successfully');
        return true;
      } else {
        toast.error(data.error || 'Failed to update profile');
        return false;
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      return false;
    }
  }, [user, refreshUser]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      sendOtp, 
      verifyOtp, 
      logout, 
      refreshUser,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
