'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  Package,
  Search,
  RefreshCw,
  AlertCircle,
  Truck,
  CheckSquare,
  Square,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { formatOrderDate } from '@/lib/orderDateUtils';
import { resolveBookSku, DispatchOrder } from '@/lib/docxGenerator';

interface OrderItem {
  id: string;
  item_name: string;
  item_sku?: string;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  order_date?: string;
  created_at: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_phone: string;
  billing_address1?: string;
  billing_address2?: string;
  billing_city: string;
  billing_state?: string;
  billing_postcode?: string;
  is_printed?: boolean;
  printed_at?: string;
  dispatch_batch_name?: string;
  order_items?: OrderItem[];
}

interface BatchRecord {
  id: string;
  batch_name: string;
  start_order_number: string;
  end_order_number: string;
  order_count: number;
  order_ids: string[];
  order_numbers: string[];
  created_by_phone?: string;
  status: string;
  created_at: string;
}

export default function DispatchPortalPage() {
  const [activeTab, setActiveTab] = useState<'unprinted' | 'today' | 'all' | 'batches'>('unprinted');
  const [orders, setOrders] = useState<Order[]>([]);
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [tableExists, setTableExists] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [fromRange, setFromRange] = useState('');
  const [toRange, setToRange] = useState('');

  // KPIs
  const [kpis, setKpis] = useState({
    totalPendingUnprinted: 0,
    todayPhysicalCount: 0,
    todayPrintedCount: 0,
  });

  // Fetch orders based on tab
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab === 'unprinted') {
        params.set('printStatus', 'unprinted');
      } else if (activeTab === 'today') {
        params.set('period', 'today');
      }
      if (search.trim()) params.set('search', search.trim());
      params.set('limit', '100');

      const res = await fetch(`/api/dispatch/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        if (data.kpis) setKpis(data.kpis);
      } else {
        toast.error(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error fetching orders');
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  // Fetch batches history
  const fetchBatches = useCallback(async () => {
    try {
      const res = await fetch('/api/dispatch/batches');
      const data = await res.json();
      if (data.success) {
        setBatches(data.batches || []);
        setTableExists(data.tableExists !== false);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'batches') {
      fetchBatches();
    } else {
      fetchOrders();
    }
  }, [activeTab, fetchOrders, fetchBatches]);

  // Select / Deselect handlers
  const toggleSelectOrder = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o) => o.id));
    }
  };

  const selectQuick = (count: number) => {
    const toSelect = orders.slice(0, count).map((o) => o.id);
    setSelectedIds(toSelect);
  };

  const applyRangeSelection = () => {
    if (!fromRange || !toRange) {
      toast.error('Enter both start and end order numbers');
      return;
    }
    const min = Math.min(parseInt(fromRange, 10), parseInt(toRange, 10));
    const max = Math.max(parseInt(fromRange, 10), parseInt(toRange, 10));

    const matched = orders
      .filter((o) => {
        const num = parseInt(o.order_number, 10);
        return !isNaN(num) && num >= min && num <= max;
      })
      .map((o) => o.id);

    if (matched.length === 0) {
      toast.error(`No orders found in range #${min} to #${max}`);
    } else {
      setSelectedIds(matched);
      toast.success(`Selected ${matched.length} orders in range #${min} to #${max}`);
    }
  };

  // Generate Word Sheet (.docx)
  const handleGenerateWordSheet = async (orderIdList?: string[]) => {
    const targetIds = orderIdList || selectedIds;
    if (targetIds.length === 0) {
      toast.error('Please select at least 1 order to generate packaging sheets.');
      return;
    }

    setGenerating(true);
    const toastId = toast.loading(`Generating Word packaging sheet for ${targetIds.length} orders...`);

    try {
      const res = await fetch('/api/dispatch/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: targetIds,
          markAsPrinted: true,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to generate Word document');
      }

      // Read filename from response header or compute
      const filename =
        res.headers.get('X-Batch-Name') ||
        `Belesu_Packing_Orders_${new Date().toISOString().slice(0, 10)}.docx`;

      // Trigger automatic browser file download
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`Word sheet downloaded: ${filename}`, { id: toastId });
      setSelectedIds([]);
      fetchOrders();
      fetchBatches();
    } catch (err: any) {
      toast.error(err.message || 'Error generating Word file', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  // Re-download past batch
  const handleReDownloadBatch = async (batch: BatchRecord) => {
    if (!batch.order_ids || batch.order_ids.length === 0) {
      toast.error('No order records in this batch');
      return;
    }
    await handleGenerateWordSheet(batch.order_ids);
  };

  // Print Preview directly in Browser
  const handleBrowserPrint = () => {
    const targetOrders = orders.filter((o) => selectedIds.includes(o.id));
    if (targetOrders.length === 0) {
      toast.error('Select orders to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Belesu Packaging Slips</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #000;
              background: #fff;
            }
            .page-container {
              page-break-after: always;
            }
            .box {
              border: 1.5px solid #000;
              margin-bottom: 12mm;
              padding: 12mm 8mm;
              text-align: center;
              box-sizing: border-box;
            }
            .order-id {
              font-size: 16pt;
              font-weight: bold;
              margin-bottom: 2mm;
            }
            .book-id {
              font-size: 16pt;
              font-weight: bold;
              margin-bottom: 6mm;
            }
            .address-header {
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 2mm;
            }
            .customer-name {
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 2mm;
            }
            .address-line {
              font-size: 13pt;
              margin-bottom: 1.5mm;
            }
            .city-line {
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 2mm;
            }
            .mobile-line {
              font-size: 14pt;
              font-weight: bold;
              margin-top: 4mm;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${targetOrders
            .map((order, idx) => {
              const bookLines = (order.order_items || []).map((it) => {
                const sku = resolveBookSku({ name: it.item_name, sku: it.item_sku, quantity: it.quantity });
                return `Book ID:- ${sku}  QTY:- ${it.quantity}`;
              });
              const bookText = bookLines.length > 0 ? bookLines.join(', ') : 'Book ID:- HARD COPY  QTY:- 1';

              const customerName = `${order.billing_first_name || ''} ${order.billing_last_name || ''}`.trim() || 'Customer';
              const cleanCity = (order.billing_city || '').trim().toUpperCase();
              const cleanPincode = (order.billing_postcode || '').trim();
              const cleanState = (order.billing_state || 'Karnataka').trim();

              const boxHtml = `
                <div class="box">
                  <div class="order-id">Order ID:- ${order.order_number}</div>
                  <div class="book-id">${bookText}</div>
                  <div class="address-header">Address:</div>
                  <div class="customer-name">${customerName}</div>
                  ${order.billing_address1 ? `<div class="address-line">${order.billing_address1}</div>` : ''}
                  ${order.billing_address2 ? `<div class="address-line">${order.billing_address2}</div>` : ''}
                  <div class="city-line">${cleanCity} - ${cleanPincode} ${cleanState}</div>
                  <div class="mobile-line">Mobile No: ${order.billing_phone}</div>
                </div>
              `;

              if ((idx + 1) % 2 === 0) {
                return boxHtml + '<div style="page-break-after: always;"></div>';
              }
              return boxHtml;
            })
            .join('')}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Unprinted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Packing
            </span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
            {kpis.totalPendingUnprinted}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Orders awaiting Word sheet</p>
        </div>

        {/* Card 2: Today's Total Physical */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Orders
            </span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {kpis.todayPhysicalCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Physical orders received today</p>
        </div>

        {/* Card 3: Ready / Printed Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Packed / Printed Today
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {kpis.todayPrintedCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Slips printed & ready</p>
        </div>

        {/* Card 4: Word Files Archive */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stored Word Files
            </span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {batches.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Archived in-app batches</p>
        </div>
      </div>

      {/* Database Table Notice if not created yet */}
      {!tableExists && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                Cloud Batch Archive Setup Available
              </h4>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Word sheets can be generated immediately. To save batch history records in the app, run <code className="bg-amber-100 px-1 py-0.2 rounded font-mono text-[10px]">scripts/create-dispatch-batches-table.sql</code> in your Supabase SQL editor.
              </p>
            </div>
          </div>
          <a
            href="https://supabase.com/dashboard/project/sjqccpysjxkmnfttoqgf/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 transition"
          >
            <span>Supabase SQL</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Tab Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('unprinted')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'unprinted'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
              }`}
            >
              📦 Pending Print ({kpis.totalPendingUnprinted})
            </button>
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
              }`}
            >
              📅 Today's Orders
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
              }`}
            >
              All Physical Orders
            </button>
            <button
              onClick={() => setActiveTab('batches')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'batches'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
              }`}
            >
              📁 Word Files Archive ({batches.length})
            </button>
          </div>

          <button
            onClick={() => (activeTab === 'batches' ? fetchBatches() : fetchOrders())}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition border border-slate-200 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Action Bar (When in Orders View) */}
        {activeTab !== 'batches' && (
          <div className="space-y-3">
            {/* Row 1: Quick Select Tools & Range Picker */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              {/* Quick Select Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-400 mr-1">Select:</span>
                <button
                  type="button"
                  onClick={selectAllVisible}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  {selectedIds.length === orders.length && orders.length > 0
                    ? 'Deselect All'
                    : `All Visible (${orders.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => selectQuick(5)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Next 5
                </button>
                <button
                  type="button"
                  onClick={() => selectQuick(10)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Next 10
                </button>
                {selectedIds.length > 0 && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    {selectedIds.length} Selected
                  </span>
                )}
              </div>

              {/* Order Number Range Picker */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-400">Order Range:</span>
                <input
                  type="text"
                  placeholder="From # (e.g. 19682)"
                  value={fromRange}
                  onChange={(e) => setFromRange(e.target.value)}
                  className="w-32 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                />
                <span className="text-slate-400 text-xs font-bold">to</span>
                <input
                  type="text"
                  placeholder="To # (e.g. 19683)"
                  value={toRange}
                  onChange={(e) => setToRange(e.target.value)}
                  className="w-32 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                />
                <button
                  type="button"
                  onClick={applyRangeSelection}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Select Range
                </button>
              </div>
            </div>

            {/* Row 2: Search & Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter order #, phone, customer, city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
                />
              </div>

              {/* Generation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBrowserPrint}
                  disabled={selectedIds.length === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 transition disabled:opacity-40 cursor-pointer"
                  title="Direct print to printer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerateWordSheet()}
                  disabled={selectedIds.length === 0 || generating}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition shadow-xs disabled:opacity-40 cursor-pointer active:scale-98"
                >
                  <FileText className="w-4 h-4 text-slate-950" />
                  <span>
                    {generating
                      ? 'Generating Word Doc...'
                      : `Generate Word Sheet (.docx) (${selectedIds.length})`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders List / Batches List Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {/* VIEW 1: ORDERS TABLE */}
        {activeTab !== 'batches' ? (
          loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading orders to pack...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-sm">No orders in this view</h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === 'unprinted'
                  ? 'All physical orders have been printed and packed!'
                  : 'Try selecting another tab or clearing search filter'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <button
                        type="button"
                        onClick={selectAllVisible}
                        className="cursor-pointer text-slate-400 hover:text-slate-600"
                        title="Toggle all"
                      >
                        {selectedIds.length === orders.length ? (
                          <CheckSquare className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3.5 px-3">Order # & Time</th>
                    <th className="py-3.5 px-3">Books to Pack (Book ID)</th>
                    <th className="py-3.5 px-3">Customer & Phone</th>
                    <th className="py-3.5 px-3">Delivery Address</th>
                    <th className="py-3.5 px-3">Packing Status</th>
                    <th className="py-3.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => {
                    const isSelected = selectedIds.includes(order.id);
                    const { dateStr, dayName, timeStr, relativeBadge } = formatOrderDate(
                      order.order_date || order.created_at
                    );

                    const customerName =
                      `${order.billing_first_name || ''} ${order.billing_last_name || ''}`.trim() ||
                      'Customer';

                    const cleanAddress = [
                      order.billing_address1,
                      order.billing_address2,
                      order.billing_city,
                      order.billing_postcode,
                    ]
                      .filter(Boolean)
                      .join(', ');

                    return (
                      <tr
                        key={order.id}
                        className={`transition ${
                          isSelected ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelectOrder(order.id)}
                            className="cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-amber-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                            )}
                          </button>
                        </td>

                        {/* Order Number & Timestamp */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              #{order.order_number}
                            </span>
                            {relativeBadge && (
                              <span
                                className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold border ${relativeBadge.color}`}
                              >
                                {relativeBadge.label}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                            <span className="font-semibold text-slate-700">{dayName}</span>, {dateStr}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{timeStr}</span>
                          </div>
                        </td>

                        {/* Book IDs / SKUs to Pack */}
                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="flex flex-wrap gap-1.5">
                            {(order.order_items || []).map((it, idx) => {
                              const sku = resolveBookSku({
                                name: it.item_name,
                                sku: it.item_sku,
                                quantity: it.quantity,
                              });
                              return (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono font-bold bg-slate-900 text-amber-400 shadow-xs"
                                >
                                  <span>{sku}</span>
                                  <span className="text-white text-[10px]">x{it.quantity}</span>
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* Customer & Phone */}
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-900 block">{customerName}</span>
                          <a
                            href={`tel:${order.billing_phone}`}
                            className="font-mono text-slate-500 text-[11px] hover:text-indigo-600 block mt-0.5"
                          >
                            📞 {order.billing_phone}
                          </a>
                        </td>

                        {/* Delivery Address */}
                        <td className="py-3.5 px-3 max-w-sm">
                          <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                            {cleanAddress || '—'}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                            📍 {order.billing_city} {order.billing_postcode ? `- ${order.billing_postcode}` : ''}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {order.is_printed ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3 h-3" /> Printed
                              </span>
                              {order.dispatch_batch_name && (
                                <span className="block text-[9px] font-mono text-slate-400 truncate max-w-[140px] mt-0.5" title={order.dispatch_batch_name}>
                                  {order.dispatch_batch_name}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              <Clock className="w-3 h-3" /> Ready to Print
                            </span>
                          )}
                        </td>

                        {/* Action: Single Order Print */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleGenerateWordSheet([order.id])}
                            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            <FileText className="w-3 h-3 text-amber-600" />
                            <span>Word Slip</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* VIEW 2: BATCH HISTORY & WORD ARCHIVE (Image 2 representation in app) */
          <div>
            <div className="p-4 bg-slate-50/75 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Application Word Batch Archive
                </h3>
                <p className="text-xs text-slate-500">
                  Every generated packaging sheet is permanently archived here. Both Admin and Staff can re-download any Word file anytime.
                </p>
              </div>
            </div>

            {batches.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-sm">No batch files archived yet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  When you select orders and click "Generate Word Sheet", the batch files will be recorded and stored here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Batch Filename (.docx)</th>
                      <th className="py-3.5 px-4">Order Range</th>
                      <th className="py-3.5 px-4 text-center">Orders Count</th>
                      <th className="py-3.5 px-4">Generated Date & Time</th>
                      <th className="py-3.5 px-4">Generated By</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batches.map((batch) => {
                      const { dateStr, timeStr } = formatOrderDate(batch.created_at);

                      return (
                        <tr key={batch.id} className="hover:bg-slate-50/60 transition">
                          {/* Batch Name */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                                <FileText className="w-4 h-4" />
                              </span>
                              <span>{batch.batch_name}</span>
                            </div>
                          </td>

                          {/* Order Range */}
                          <td className="py-3.5 px-4 font-mono text-slate-700">
                            #{batch.start_order_number} — #{batch.end_order_number}
                          </td>

                          {/* Count */}
                          <td className="py-3.5 px-4 text-center font-bold">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                              {batch.order_count} orders
                            </span>
                          </td>

                          {/* Date & Time */}
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            <span>{dateStr}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {timeStr}
                            </span>
                          </td>

                          {/* Created By */}
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {batch.created_by_phone || 'Staff'}
                          </td>

                          {/* Re-download action */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleReDownloadBatch(batch)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download .docx</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
