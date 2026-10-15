'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  BookOpen,
  Laptop,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  item_name: string;
  item_sku?: string;
  item_type: string;
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
  billing_first_name: string;
  billing_last_name: string;
  billing_phone: string;
  billing_city: string;
  order_items?: OrderItem[];
}

interface TopProduct {
  name: string;
  sku: string;
  type: string;
  totalQty: number;
  totalRevenue: number;
}

interface StatsData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  totalUsers: number;
  physicalCount: number;
  digitalCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setTopProducts(data.topSellingProducts);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> {status}
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <RefreshCw className="w-3 h-3 animate-spin" /> Processing
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
            <Truck className="w-3 h-3" /> Shipped
          </span>
        );
      case 'Cancelled':
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <AlertCircle className="w-3 h-3" /> {status}
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 p-5 animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Store Performance Overview
          </h2>
          <p className="text-sm text-slate-500">
            Real-time orders, revenue, and customer activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition shadow-sm shadow-amber-500/20"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatPrice(stats?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span>Paid & Completed sales</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stats?.totalOrders || 0}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="font-bold text-amber-600">{stats?.pendingOrders || 0} pending</span>
              <span>•</span>
              <span className="font-bold text-emerald-600">{stats?.completedOrders || 0} fulfilled</span>
            </div>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Users</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stats?.totalUsers || 0}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Parent & student accounts
            </p>
          </div>
        </div>

        {/* Catalog Sales Split */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Product Mix</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">{stats?.physicalCount || 0}</span>
              <span className="text-xs text-slate-500 font-semibold">Hard Copy</span>
              <span className="text-slate-300">/</span>
              <span className="text-xl font-black text-indigo-600">{stats?.digitalCount || 0}</span>
              <span className="text-xs text-slate-500 font-semibold">Digital</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Orders containing hard copy / digital
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/orders?status=Pending"
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Needs Action</span>
            <span className="text-sm font-black text-slate-900">Pending Orders ({stats?.pendingOrders || 0})</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-amber-700 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <Link
          href="/admin/users"
          className="p-4 rounded-xl bg-purple-50 border border-purple-200/60 hover:bg-purple-100/60 transition flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">Directory</span>
            <span className="text-sm font-black text-slate-900">Customer Lookup</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-purple-700 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <Link
          href="/admin/products"
          className="p-4 rounded-xl bg-blue-50 border border-blue-200/60 hover:bg-blue-100/60 transition flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Classes 1–5</span>
            <span className="text-sm font-black text-slate-900">Hard Copy Catalog</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-blue-700 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <Link
          href="/admin/digital"
          className="p-4 rounded-xl bg-indigo-50 border border-indigo-200/60 hover:bg-indigo-100/60 transition flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">Classes 6–10</span>
            <span className="text-sm font-black text-slate-900">Digital Reader</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-indigo-700 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Main Grid: Recent Orders (2 cols) & Top Selling Items (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-base">Recent Orders</h3>
              <p className="text-xs text-slate-500">Latest customer purchases across hard copy and digital</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No orders found yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => {
                    const customerName =
                      `${order.billing_first_name || ''} ${order.billing_last_name || ''}`.trim() ||
                      'Customer';
                    const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    });

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {order.order_number}
                          <span className="block text-[10px] text-slate-400 font-sans font-normal">
                            {dateStr}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{customerName}</span>
                          <span className="text-[11px] text-slate-500 font-mono block">
                            {order.billing_phone}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {order.has_physical_books && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                Hard Copy
                              </span>
                            )}
                            {order.has_digital_books && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                                Digital
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {formatPrice(order.order_total_amount)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(order.order_status)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition"
                          >
                            <span>Manage</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Selling Books Widget */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Top Selling Books</h3>
              <p className="text-xs text-slate-500">Most popular guidebooks by units sold</p>
            </div>

            <div className="p-5 space-y-4">
              {topProducts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No sales recorded yet.</p>
              ) : (
                topProducts.map((p, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 font-black flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 truncate block">
                          {p.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono">{p.sku}</span>
                          <span>•</span>
                          <span className="capitalize">{p.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-slate-900 block">{p.totalQty} sold</span>
                      <span className="text-[11px] text-emerald-600 font-semibold block">
                        {formatPrice(p.totalRevenue)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <Link
              href="/admin/analytics"
              className="text-xs font-bold text-slate-700 hover:text-amber-600 flex items-center justify-center gap-1"
            >
              <span>View Detailed Sales Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
