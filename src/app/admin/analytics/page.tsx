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

interface TopProduct {
  name: string;
  sku: string;
  type?: string;
  totalQty: number;
  totalRevenue: number;
}

interface AnalyticsStats {
  totalRevenue: number;
  codRevenue: number;
  onlineRevenue: number;
  totalOrders: number;
  physicalCount: number;
  digitalCount: number;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats>({
    totalRevenue: 0,
    codRevenue: 0,
    onlineRevenue: 0,
    totalOrders: 0,
    physicalCount: 0,
    digitalCount: 0,
  });
  const [citySalesMap, setCitySalesMap] = useState<Record<string, { count: number; total: number }>>({});
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData(forceRefresh = false) {
    setLoading(true);
    try {
      const url = forceRefresh ? '/api/admin/stats?refresh=true' : '/api/admin/stats';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.stats) {
        setStats({
          totalRevenue: data.stats.totalRevenue || 0,
          codRevenue: data.stats.codRevenue || 0,
          onlineRevenue: data.stats.onlineRevenue || 0,
          totalOrders: data.stats.totalOrders || 0,
          physicalCount: data.stats.physicalCount || 0,
          digitalCount: data.stats.digitalCount || 0,
        });

        if (data.citySalesMap) {
          setCitySalesMap(data.citySalesMap);
        }

        if (Array.isArray(data.topSellingProducts)) {
          setTopProducts(
            data.topSellingProducts.map((p: any) => ({
              name: p.name,
              sku: p.sku,
              type: p.sku?.startsWith('SD') ? 'digital' : 'physical',
              totalQty: p.totalQty,
              totalRevenue: p.totalRevenue,
            }))
          );
        }
      }
    } catch (err) {
      console.error('Failed to load analytics stats:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const totalFormatCount = stats.physicalCount + stats.digitalCount;
  const physicalPercent = totalFormatCount > 0 ? Math.round((stats.physicalCount / totalFormatCount) * 100) : 99;
  const digitalPercent = totalFormatCount > 0 ? Math.round((stats.digitalCount / totalFormatCount) * 100) : 1;

  const aov = stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0;
  const topCities = Object.entries(citySalesMap)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  const maxProductQty = topProducts[0]?.totalQty || 1;

  if (loading) {
    return (
      <div className="p-12 text-center">
        <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500">Calculating analytics & sales trends across all 5,000+ orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Analytics & Performance Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time financial breakdowns, delivery destinations, and popular curricula demand across all {stats.totalOrders} orders
          </p>
        </div>
        <button
          onClick={() => loadData(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition shadow-xs self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Net Revenue
          </span>
          <span className="text-3xl font-black text-slate-900 tracking-tight mt-1 block">
            {formatPrice(stats.totalRevenue)}
          </span>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            Across {stats.totalOrders} lifetime orders
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
              <span className="font-bold text-slate-900">{formatPrice(stats.onlineRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Cash on Delivery (COD):</span>
              <span className="font-bold text-slate-900">{formatPrice(stats.codRevenue)}</span>
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
              Order Volume by Format (Hard Copy vs Digital)
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
                  <span className="text-[11px] font-medium text-slate-400">({physicalPercent}%)</span>
                  <span>{stats.physicalCount} orders</span>
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
                  <span className="text-[11px] font-medium text-slate-400">({digitalPercent}%)</span>
                  <span>{stats.digitalCount} orders</span>
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
              Lifetime Book Popularity & Units Sold Ranking
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {topProducts.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No product sales yet.</p>
          ) : (
            topProducts.map((p, idx) => {
              const pct = Math.max(10, Math.round((p.totalQty / maxProductQty) * 100));
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      {idx + 1}. {p.name}
                      <span className="ml-2 font-normal text-slate-400 uppercase text-[10px]">
                        [{p.type || 'physical'}]
                      </span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {p.totalQty} sold • {formatPrice(p.totalRevenue)}
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
