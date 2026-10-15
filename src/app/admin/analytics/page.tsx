'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  PieChart,
  MapPin,
  RefreshCw,
  BookOpen,
  Laptop,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
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
  payment_method: string;
  order_total_amount: number;
  billing_city: string;
  has_physical_books: boolean;
  has_digital_books: boolean;
  order_items?: OrderItem[];
}

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/orders?limit=200');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Failed to load analytics orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute metrics
  let totalRevenue = 0;
  let codRevenue = 0;
  let onlineRevenue = 0;
  let physicalRevenue = 0;
  let digitalRevenue = 0;

  const citySalesMap: Record<string, { count: number; total: number }> = {};
  const statusMap: Record<string, number> = {};
  const productMap: Record<string, { name: string; type: string; qty: number; total: number }> = {};

  orders.forEach((o) => {
    const amt = Number(o.order_total_amount) || 0;
    const isPaidOrCompleted = o.payment_status === 'Paid' || o.order_status === 'Completed';

    if (isPaidOrCompleted) {
      totalRevenue += amt;
      if (o.payment_method?.toLowerCase().includes('cash')) {
        codRevenue += amt;
      } else {
        onlineRevenue += amt;
      }
    }

    // Status distribution
    statusMap[o.order_status] = (statusMap[o.order_status] || 0) + 1;

    // City distribution
    const city = (o.billing_city || 'Karnataka').trim();
    if (city) {
      if (!citySalesMap[city]) citySalesMap[city] = { count: 0, total: 0 };
      citySalesMap[city].count += 1;
      if (isPaidOrCompleted) {
        citySalesMap[city].total += amt;
      }
    }

    // Product items
    (o.order_items || []).forEach((item) => {
      const rev = Number(item.item_total) || 0;
      if (isPaidOrCompleted) {
        if (item.item_type === 'digital') {
          digitalRevenue += rev;
        } else {
          physicalRevenue += rev;
        }
      }

      const key = item.item_sku || item.item_name;
      if (!productMap[key]) {
        productMap[key] = {
          name: item.item_name,
          type: item.item_type,
          qty: 0,
          total: 0,
        };
      }
      productMap[key].qty += item.quantity || 1;
      if (isPaidOrCompleted) {
        productMap[key].total += rev;
      }
    });
  });

  const formatTotalRevenue = physicalRevenue + digitalRevenue;
  const physicalPercent =
    formatTotalRevenue > 0
      ? Math.round((physicalRevenue / formatTotalRevenue) * 100)
      : 0;
  const digitalPercent =
    formatTotalRevenue > 0
      ? Math.round((digitalRevenue / formatTotalRevenue) * 100)
      : 0;

  const aov = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const topCities = Object.entries(citySalesMap)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  const topProducts = Object.values(productMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 6);

  const maxProductQty = topProducts[0]?.qty || 1;

  if (loading) {
    return (
      <div className="p-12 text-center">
        <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500">Calculating analytics & sales trends...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Analytics & Performance Reports
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Financial breakdowns, delivery destinations, and popular curricula demand
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Net Revenue
          </span>
          <span className="text-3xl font-black text-slate-900 tracking-tight mt-1 block">
            {formatPrice(totalRevenue)}
          </span>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            Across {orders.length} total orders
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Average Order Value (AOV)
          </span>
          <span className="text-3xl font-black text-slate-900 tracking-tight mt-1 block">
            {formatPrice(aov)}
          </span>
          <span className="text-xs text-slate-500 font-medium mt-1 block">
            Average basket checkout size
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Payment Preference
          </span>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Online (Razorpay / UPI):</span>
              <span className="font-bold text-slate-900">{formatPrice(onlineRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Cash on Delivery (COD):</span>
              <span className="font-bold text-slate-900">{formatPrice(codRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Revenue Mix & Top Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Mix Breakdown (Hard Copy vs Digital) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-slate-900 text-base">
              Revenue by Format (Hard Copy vs Digital)
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  Hard Copy Printed Guidebooks
                </span>
                <span className="flex items-center gap-1.5">
                  {formatTotalRevenue > 0 && (
                    <span className="text-[11px] font-medium text-slate-400">({physicalPercent}%)</span>
                  )}
                  <span>{formatPrice(physicalRevenue)}</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${physicalPercent}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                  Digital E-Reader Guidebooks
                </span>
                <span className="flex items-center gap-1.5">
                  {formatTotalRevenue > 0 && (
                    <span className="text-[11px] font-medium text-slate-400">({digitalPercent}%)</span>
                  )}
                  <span>{formatPrice(digitalRevenue)}</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${digitalPercent}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Delivery Locations */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-slate-900 text-base">
              Top Delivery Cities in Karnataka
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {topCities.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No location data available yet.</p>
            ) : (
              topCities.map(([city, data], idx) => (
                <div key={city} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900">{city}</span>
                    <span className="text-[11px] text-slate-400">({data.count} orders)</span>
                  </div>
                  <span className="font-bold text-slate-800 font-mono">
                    {formatPrice(data.total)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Demand Products Ranking */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-slate-900 text-base">
              Book Popularity & Units Sold Ranking
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {topProducts.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No product sales yet.</p>
          ) : (
            topProducts.map((p, idx) => {
              const pct = Math.max(10, Math.round((p.qty / maxProductQty) * 100));
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      {idx + 1}. {p.name}
                      <span className="ml-2 font-normal text-slate-400 uppercase text-[10px]">
                        [{p.type}]
                      </span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {p.qty} sold • {formatPrice(p.total)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        p.type === 'digital' ? 'bg-indigo-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
