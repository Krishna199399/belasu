'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Search,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RefreshCw,
  ArrowUpRight,
  Package,
  Calendar,
  CalendarDays,
  CalendarRange,
  X,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { formatOrderDate, getAvailableMonths } from '@/lib/orderDateUtils';
import { monthsSinceFirstOrder, type SalesSummary } from '@/lib/salesRules';

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
  order_date?: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  order_total_amount: number;
  has_physical_books: boolean;
  has_digital_books: boolean;
  billing_first_name: string;
  billing_last_name: string;
  billing_phone: string;
  billing_email?: string;
  billing_address1?: string;
  billing_city: string;
  billing_state?: string;
  billing_postcode?: string;
  order_items?: OrderItem[];
}

function SummaryStat({ label, value, tone }: { label: string; value: string; tone?: 'rose' | 'amber' }) {
  const color = tone === 'rose' ? 'text-rose-300' : tone === 'amber' ? 'text-amber-300' : 'text-white';
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className={`font-bold text-sm mt-0.5 ${color}`}>{value}</dd>
    </div>
  );
}

interface PeriodMetrics {
  count: number;
  revenue: number;
}

interface Metrics {
  today: PeriodMetrics;
  thisWeek: PeriodMetrics;
  thisMonth: PeriodMetrics;
}

export default function AdminOrdersPage() {
  // ?month=YYYY-MM (from the monthly sales report) opens the page filtered to that month
  const searchParams = useSearchParams();
  const linkedMonth = /^\d{4}-\d{2}$/.test(searchParams.get('month') || '') ? searchParams.get('month')! : '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>(linkedMonth ? 'month_year' : 'all'); // 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'month_year'
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(linkedMonth); // e.g. "2026-11"
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Every month back to the first order (May 2024), not just the last 24
  const availableMonths = useMemo(() => getAvailableMonths(monthsSinceFirstOrder()), []);

  /** Query params for the current filters — shared by the list and the CSV export */
  const buildFilterParams = () => {
    const params = new URLSearchParams();
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (selectedType !== 'all') params.set('type', selectedType);
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedPeriod !== 'all') {
      params.set('period', selectedPeriod);
      if (selectedPeriod === 'month_year' && selectedMonthYear) {
        const [y, m] = selectedMonthYear.split('-');
        params.set('year', y);
        params.set('month', m);
      }
    }
    return params;
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = buildFilterParams();
      params.set('page', String(page));
      params.set('limit', '25');

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalCount(data.pagination.total || 0);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
        // Summary only comes with page 1 — later pages keep the same filter's summary
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, selectedType, selectedPeriod, selectedMonthYear, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const clearFilters = () => {
    setSelectedPeriod('all');
    setSelectedMonthYear('');
    setSelectedStatus('all');
    setSelectedType('all');
    setSearchTerm('');
    setPage(1);
  };

  const isFiltered =
    selectedPeriod !== 'all' ||
    selectedMonthYear !== '' ||
    selectedStatus !== 'all' ||
    selectedType !== 'all' ||
    searchTerm.trim() !== '';

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

  // Export orders to CSV with complete day, date, time breakdown
  // Exports EVERY order matching the current filters (not just this page), with a totals block
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/admin/orders/export?${buildFilterParams().toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Export failed');
      }
      const disposition = res.headers.get('Content-Disposition') || '';
      const filename = /filename="([^"]+)"/.exec(disposition)?.[1] || 'belesu_orders.csv';
      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  /** Human label for the active filter, e.g. "December 2025" or "This Week" */
  const periodLabel =
    selectedPeriod === 'month_year' && selectedMonthYear
      ? availableMonths.find((m) => m.value === selectedMonthYear)?.label || selectedMonthYear
      : { all: 'All time', today: 'Today', yesterday: 'Yesterday', this_week: 'This week', this_month: 'This month' }[
          selectedPeriod
        ] || 'Selected period';

  const periodTabs = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Month', value: 'this_month' },
  ];

  const statusTabs = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Refunded', value: 'Refunded' },
    { label: 'Failed', value: 'Failed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Order Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Total {totalCount} orders found • Track fulfillment, print invoices, and update status
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
          <button
            onClick={handleExportCSV}
            disabled={totalCount === 0 || exporting}
            title={`Download all ${totalCount} orders in this view`}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 transition shadow-xs disabled:opacity-50"
          >
            {exporting ? (
              <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>{exporting ? 'Exporting…' : `Export CSV (${totalCount})`}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards: Today, This Week, This Month, All Time */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today */}
        <button
          type="button"
          onClick={() => {
            setSelectedPeriod((prev) => (prev === 'today' ? 'all' : 'today'));
            setSelectedMonthYear('');
            setPage(1);
          }}
          className={`p-5 rounded-2xl border text-left transition cursor-pointer active:scale-98 ${
            selectedPeriod === 'today'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today&apos;s Sales
            </span>
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CalendarDays className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {metrics?.today?.count ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span className="font-semibold text-emerald-700">
              {formatPrice(metrics?.today?.revenue ?? 0)}
            </span>
            {selectedPeriod === 'today' && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                Filtered
              </span>
            )}
          </div>
        </button>

        {/* Card 2: This Week */}
        <button
          type="button"
          onClick={() => {
            setSelectedPeriod((prev) => (prev === 'this_week' ? 'all' : 'this_week'));
            setSelectedMonthYear('');
            setPage(1);
          }}
          className={`p-5 rounded-2xl border text-left transition cursor-pointer active:scale-98 ${
            selectedPeriod === 'this_week'
              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              This Week
            </span>
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <CalendarRange className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {metrics?.thisWeek?.count ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span className="font-semibold text-blue-700">
              {formatPrice(metrics?.thisWeek?.revenue ?? 0)}
            </span>
            {selectedPeriod === 'this_week' && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                Filtered
              </span>
            )}
          </div>
        </button>

        {/* Card 3: This Month */}
        <button
          type="button"
          onClick={() => {
            setSelectedPeriod((prev) => (prev === 'this_month' ? 'all' : 'this_month'));
            setSelectedMonthYear('');
            setPage(1);
          }}
          className={`p-5 rounded-2xl border text-left transition cursor-pointer active:scale-98 ${
            selectedPeriod === 'this_month'
              ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              This Month
            </span>
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {metrics?.thisMonth?.count ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span className="font-semibold text-purple-700">
              {formatPrice(metrics?.thisMonth?.revenue ?? 0)}
            </span>
            {selectedPeriod === 'this_month' && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                Filtered
              </span>
            )}
          </div>
        </button>

        {/* Card 4: All Time */}
        <button
          type="button"
          onClick={() => {
            setSelectedPeriod('all');
            setSelectedMonthYear('');
            setPage(1);
          }}
          className={`p-5 rounded-2xl border text-left transition cursor-pointer active:scale-98 ${
            selectedPeriod === 'all' && !selectedMonthYear
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isFiltered ? 'Filtered Result' : 'All Time'}
            </span>
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {totalCount}
            <span className="text-xs font-bold text-slate-400 ml-1">orders</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span className="font-semibold text-amber-700">
              {formatPrice(summary?.salesAmount ?? 0)} sales
            </span>
            {isFiltered && <span>Click to view all</span>}
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-4">
        {/* Row 1: Period Tabs (Day / Week / Month) & Month/Year Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Period:</span>
            {periodTabs.map((tab) => {
              const isActive = selectedPeriod === tab.value && !selectedMonthYear;
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setSelectedPeriod(tab.value);
                    setSelectedMonthYear('');
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Month & Year Select */}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-400 shrink-0">Month:</span>
            <select
              value={selectedMonthYear}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedMonthYear(val);
                if (val) {
                  setSelectedPeriod('month_year');
                } else {
                  setSelectedPeriod('all');
                }
                setPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:border-amber-500"
            >
              <option value="">All Months</option>
              {availableMonths.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Status Tabs & Search/Type Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {statusTabs.map((tab) => {
              const isActive = selectedStatus === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setSelectedStatus(tab.value);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Type filter */}
          <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-xl">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order #, phone, customer, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-20 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:border-amber-500"
            >
              <option value="all">All Products</option>
              <option value="physical">Hard Copy Books</option>
              <option value="digital">Digital Guides</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales summary for the current filters (all pages, not just this one) */}
      {summary && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <div className="shrink-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sales · {periodLabel}
                {selectedStatus !== 'all' && ` · ${selectedStatus}`}
                {selectedType !== 'all' && ` · ${selectedType === 'physical' ? 'Hard copy' : 'Digital'}`}
                {searchTerm.trim() && ` · "${searchTerm.trim()}"`}
              </div>
              <div className="text-3xl font-black text-amber-400 mt-1">{formatPrice(summary.salesAmount)}</div>
              <div className="text-[11px] text-slate-400">incl. shipping, minus refunds</div>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-3 flex-1 text-xs">
              <SummaryStat label="Paid orders" value={`${summary.salesCount} of ${summary.totalOrders}`} />
              <SummaryStat label="Avg order value" value={formatPrice(summary.averageOrderValue)} />
              <SummaryStat
                label="Hard copy / Digital"
                value={`${summary.hardCopyCount} / ${summary.digitalCount}`}
              />
              <SummaryStat
                label="Cancelled / Failed"
                value={`${summary.cancelledCount} · ${formatPrice(summary.cancelledAmount)}`}
                tone={summary.cancelledCount > 0 ? 'rose' : undefined}
              />
              <SummaryStat
                label="Awaiting payment"
                value={String(summary.unpaidCount)}
                tone={summary.unpaidCount > 0 ? 'amber' : undefined}
              />
              {summary.refundAmount > 0 && (
                <SummaryStat label="Refunds" value={formatPrice(summary.refundAmount)} tone="rose" />
              )}
            </dl>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading orders data...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">No orders found</h3>
            <p className="text-xs text-slate-500 mt-1">Try changing your date period or search query</p>
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold transition hover:bg-slate-800"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Order # & Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const customerName =
                    `${order.billing_first_name || ''} ${order.billing_last_name || ''}`.trim() ||
                    'Customer';

                  const {
                    dateStr,
                    dayName,
                    timeStr,
                    relativeBadge,
                    weekNumber,
                  } = formatOrderDate(order.order_date || order.created_at);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition">
                      {/* ORDER # & TIMESTAMP CELL: Day, Week, Month, Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-mono font-bold text-slate-900 hover:text-amber-600 transition text-sm"
                          >
                            #{order.order_number}
                          </Link>
                          {relativeBadge && (
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${relativeBadge.color}`}
                            >
                              {relativeBadge.label}
                            </span>
                          )}
                        </div>

                        {/* Day of week and date */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-sans font-medium mt-1">
                          <span className="font-bold text-slate-800 bg-slate-100 px-1 py-0.2 rounded text-[10px] uppercase">
                            {dayName}
                          </span>
                          <span>{dateStr}</span>
                        </div>

                        {/* Exact Time & Calendar Week */}
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-sans mt-0.5">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            {timeStr}
                          </span>
                          {weekNumber > 0 && (
                            <span className="text-slate-400 font-mono text-[9px] bg-slate-50 px-1 rounded border border-slate-200">
                              W{weekNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{customerName}</span>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          📞 {order.billing_phone}
                        </span>
                        {order.billing_city && (
                          <span className="text-[10px] text-slate-400 block">
                            📍 {order.billing_city}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {order.has_physical_books && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 w-fit">
                              📦 Hard Copy
                            </span>
                          )}
                          {order.has_digital_books && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 w-fit">
                              📱 Digital
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          {(order.order_items || []).map((item, idx) => (
                            <div key={idx} className="truncate text-slate-700">
                              <span className="font-semibold">{item.quantity}x</span> {item.item_name}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                        {formatPrice(order.order_total_amount)}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {order.payment_method}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.payment_status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(order.order_status)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition"
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
