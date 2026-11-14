'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShoppingCart,
  Phone,
  MessageCircle,
  Clock,
  ArrowUpRight,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Copy,
  DollarSign,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  productType?: string;
  coverImage?: string;
  sku?: string;
  gradeClass?: number;
}

interface AbandonedCart {
  id: string;
  session_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  cart_items: CartItem[];
  item_count: number;
  subtotal: number;
  shipping_fee: number;
  grand_total: number;
  status: 'active' | 'abandoned' | 'recovered' | 'expired';
  recovery_url: string;
  whatsapp_sent_count: number;
  last_whatsapp_sent_at?: string;
  last_active_at: string;
  created_at: string;
}

interface Metrics {
  totalAbandoned: number;
  totalLostRevenue: number;
  totalRecovered: number;
  totalRecoveredRevenue: number;
  recoveryRate: number;
}

/** Formats a relative timestamp (e.g. '12m ago', '3h ago') */
function timeAgo(dateStr: string): string {
  if (!dateStr) return 'Just now';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalAbandoned: 0,
    totalLostRevenue: 0,
    totalRecovered: 0,
    totalRecoveredRevenue: 0,
    recoveryRate: 0,
  });
  const [tableExists, setTableExists] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'abandoned' | 'contacted' | 'recovered'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchCarts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/abandoned-carts?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setCarts(data.carts || []);
        if (data.metrics) setMetrics(data.metrics);
        setTableExists(data.tableExists !== false);
      } else {
        toast.error(data.error || 'Failed to load abandoned carts');
      }
    } catch (err: any) {
      toast.error('Network error loading carts');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  // Handle 1-Click WhatsApp Direct Chat (WACRM or WhatsApp Web)
  const handleOpenWhatsAppChat = async (cart: AbandonedCart, target: 'wacrm' | 'wa_me' = 'wacrm') => {
    const rawDigits = cart.customer_phone.replace(/\D/g, '');
    const cleanPhoneWithPlus = rawDigits.startsWith('91') && rawDigits.length === 12
      ? `+${rawDigits}`
      : `+91${rawDigits.slice(-10)}`;
    const cleanDigits = cleanPhoneWithPlus.replace(/\D/g, '');
    const booksList = cart.cart_items.map((i) => i.title).join(', ');
    const recoveryLink = cart.recovery_url || `https://belesu.in/cart?recover=${cart.session_id}`;

    const message = `Namaskara ${cart.customer_name || 'Sir/Madam'}! 🙏
We noticed you added *${booksList}* to your Belesu cart, but didn't get a chance to complete your order.

We have temporarily reserved your guidebooks for your child's class! 📚

You can complete your order directly with instant delivery here:
👉 ${recoveryLink}

Please let us know if you have any questions or need help with Kannada guidebooks!
– Belesu Bookstore Team`;

    if (target === 'wacrm') {
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const wacrmBase = isLocal ? 'http://localhost:3001' : 'https://crm.belesu.in';
      const wacrmUrl = `${wacrmBase}/inbox?phone=${encodeURIComponent(cleanPhoneWithPlus)}&name=${encodeURIComponent(cart.customer_name || '')}&text=${encodeURIComponent(message)}`;
      window.open(wacrmUrl, '_blank');
    } else {
      const waUrl = `https://wa.me/${cleanDigits}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    }

    // Automatically record WhatsApp contact in backend
    try {
      await fetch('/api/admin/abandoned-carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'record_whatsapp_sent', cartId: cart.id }),
      });
      // Increment local count
      setCarts((prev) =>
        prev.map((c) =>
          c.id === cart.id
            ? { ...c, whatsapp_sent_count: (c.whatsapp_sent_count || 0) + 1, last_whatsapp_sent_at: new Date().toISOString() }
            : c
        )
      );
      toast.success(target === 'wacrm' ? 'Opening WACRM Inbox...' : 'WhatsApp Web opened & reminder recorded!');
    } catch {}
  };

  // Mark recovered manually
  const handleMarkRecovered = async (cartId: string) => {
    setActionLoadingId(cartId);
    try {
      const res = await fetch('/api/admin/abandoned-carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_recovered', cartId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Cart marked as recovered! 🎉');
        fetchCarts();
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete cart
  const handleDeleteCart = async (cartId: string) => {
    if (!confirm('Are you sure you want to remove this cart record?')) return;
    setActionLoadingId(cartId);
    try {
      const res = await fetch('/api/admin/abandoned-carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', cartId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Cart removed');
        setCarts((prev) => prev.filter((c) => c.id !== cartId));
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Copy recovery link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Recovery link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Abandoned Cart Recovery
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Real-time tracking of shoppers who added books to cart but left before checkout. Follow up via WhatsApp to recover lost revenue.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchCarts()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <a
            href="/api/admin/abandoned-carts?format=csv"
            download="belesu_abandoned_carts.csv"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV for WACRM
          </a>
        </div>
      </div>

      {/* Setup Notice if Table Not Yet Created */}
      {!tableExists && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">Database Table Setup Required</h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Run the SQL script <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[11px]">scripts/create-abandoned-carts-table.sql</code> in your Supabase SQL Editor to enable abandoned cart saving.
              </p>
            </div>
          </div>
          <a
            href="https://supabase.com/dashboard/project/sjqccpysjxkmnfttoqgf/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 transition"
          >
            Open Supabase SQL <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Abandoned Carts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Abandoned Carts</span>
            <span className="p-2 rounded-xl bg-red-50 text-red-600">
              <ShoppingCart className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {metrics.totalAbandoned}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Unfinished purchases</p>
        </div>

        {/* Card 2: Revenue at Risk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue at Risk</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
            {formatPrice(metrics.totalLostRevenue)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Potential sales to recover</p>
        </div>

        {/* Card 3: Recovered Carts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recovered Orders</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {metrics.totalRecovered}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            {formatPrice(metrics.totalRecoveredRevenue)} recovered
          </p>
        </div>

        {/* Card 4: Recovery Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recovery Rate</span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-2">
            {metrics.recoveryRate}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Conversion via follow-up</p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Carts' },
            { id: 'abandoned', label: 'Unfinished' },
            { id: 'contacted', label: 'Reminder Sent' },
            { id: 'recovered', label: 'Recovered ✅' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, or book..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Abandoned Carts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
            Loading abandoned carts...
          </div>
        ) : carts.length === 0 ? (
          <div className="py-20 text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No abandoned carts found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When shoppers add books to their cart and enter their phone number or log in, their incomplete orders will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Books in Cart</th>
                  <th className="py-3.5 px-4">Cart Value</th>
                  <th className="py-3.5 px-4">Last Active</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {carts.map((cart) => {
                  const isRecovered = cart.status === 'recovered';
                  const hasContacted = (cart.whatsapp_sent_count || 0) > 0;

                  return (
                    <tr key={cart.id} className="hover:bg-slate-50/50 transition">
                      {/* Customer Info */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-900">{cart.customer_name || 'Customer'}</div>
                        <div className="text-[11px] font-mono text-slate-600 mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {cart.customer_phone}
                        </div>
                        {cart.customer_email && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {cart.customer_email}
                          </div>
                        )}
                      </td>

                      {/* Books in Cart */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-2 max-w-xs">
                          {cart.cart_items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {item.coverImage ? (
                                <img
                                  src={item.coverImage}
                                  alt={item.title}
                                  className="w-7 h-9 object-contain bg-slate-50 rounded border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-7 h-9 bg-slate-100 rounded border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                                  <Package className="w-3.5 h-3.5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-800 text-[11px] truncate leading-tight">
                                  {item.title}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  Qty: {item.quantity || 1} • {formatPrice(item.price)}
                                  {item.productType === 'digital' ? ' (Digital)' : ''}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Cart Value */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-black text-amber-600 text-sm">
                          {formatPrice(cart.grand_total)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {cart.item_count} {cart.item_count === 1 ? 'item' : 'items'}
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="font-medium text-slate-700 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {timeAgo(cart.last_active_at)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(cart.last_active_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        {isRecovered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Recovered
                          </span>
                        ) : hasContacted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <MessageCircle className="w-3 h-3" /> Sent ({cart.whatsapp_sent_count}x)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                            <AlertCircle className="w-3 h-3" /> Abandoned
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* 1-Click WACRM Chat Button */}
                          <button
                            onClick={() => handleOpenWhatsAppChat(cart, 'wacrm')}
                            title="Open chat & send via WACRM Inbox (Official WhatsApp API)"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition cursor-pointer active:scale-95"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                            <span className="text-[9px] bg-emerald-800/80 px-1 py-0.5 rounded font-black tracking-wider uppercase">CRM</span>
                          </button>

                          {/* Quick WhatsApp Web (wa.me) shortcut */}
                          <button
                            onClick={() => handleOpenWhatsAppChat(cart, 'wa_me')}
                            title="Open in personal WhatsApp Web / App (wa.me)"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          {/* Copy Recovery Link */}
                          <button
                            onClick={() => handleCopyLink(cart.recovery_url)}
                            title="Copy 1-Click recovery URL"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Mark as Recovered */}
                          {!isRecovered && (
                            <button
                              onClick={() => handleMarkRecovered(cart.id)}
                              disabled={actionLoadingId === cart.id}
                              title="Mark as paid / recovered"
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete Cart */}
                          <button
                            onClick={() => handleDeleteCart(cart.id)}
                            disabled={actionLoadingId === cart.id}
                            title="Delete record"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

