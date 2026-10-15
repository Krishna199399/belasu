'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Boxes,
  Package,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  History,
  X,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { PhysicalBookInventory, InventoryLogItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<PhysicalBookInventory[]>([]);
  const [stats, setStats] = useState({
    totalUnitsInStock: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalUnitsSold: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'healthy' | 'low' | 'out'>('all');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Restock modal state
  const [restockModalBook, setRestockModalBook] = useState<PhysicalBookInventory | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(25);
  const [restockReason, setRestockReason] = useState('New Print Batch Received');
  const [customThreshold, setCustomThreshold] = useState<number>(10);
  const [restockLoading, setRestockLoading] = useState(false);

  // Audit Logs modal state
  const [logsModalBook, setLogsModalBook] = useState<PhysicalBookInventory | null>(null);
  const [logs, setLogs] = useState<InventoryLogItem[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
        setStats(data.stats);
      } else {
        toast.error(data.error || 'Failed to load inventory data');
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
      toast.error('Network error loading inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeries = selectedSeries === 'all' || item.series === selectedSeries;
      const matchesGrade = selectedGrade === 'all' || item.gradeClass === Number(selectedGrade);

      let matchesStatus = true;
      if (selectedStatus === 'healthy') {
        matchesStatus = item.stockQuantity > item.lowStockThreshold;
      } else if (selectedStatus === 'low') {
        matchesStatus = item.stockQuantity > 0 && item.stockQuantity <= item.lowStockThreshold;
      } else if (selectedStatus === 'out') {
        matchesStatus = item.stockQuantity <= 0;
      }

      return matchesSearch && matchesSeries && matchesGrade && matchesStatus;
    });
  }, [items, searchTerm, selectedStatus, selectedSeries, selectedGrade]);

  const handleOpenRestock = (book: PhysicalBookInventory) => {
    setRestockModalBook(book);
    setRestockAmount(25);
    setRestockReason('New Print Batch Received');
    setCustomThreshold(book.lowStockThreshold);
  };

  const handleConfirmRestock = async () => {
    if (!restockModalBook) return;
    if (restockAmount === 0) {
      toast.error('Please specify a restock quantity');
      return;
    }

    setRestockLoading(true);
    try {
      const res = await fetch('/api/admin/inventory/restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: restockModalBook.bookId,
          changeAmount: Number(restockAmount),
          reason: restockReason.trim() || 'Admin Restock Adjustment',
          newThreshold: Number(customThreshold),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          `Successfully updated ${restockModalBook.sku}! New stock: ${data.remainingStock} units`
        );
        setRestockModalBook(null);
        await fetchInventory();
      } else {
        toast.error(data.error || 'Failed to update stock');
      }
    } catch (err) {
      toast.error('Network error during restock');
    } finally {
      setRestockLoading(false);
    }
  };

  const handleOpenLogs = async (book?: PhysicalBookInventory) => {
    setLogsModalBook(book || null);
    setLogsLoading(true);
    try {
      const url = book
        ? `/api/admin/inventory/logs?bookId=${book.bookId}`
        : '/api/admin/inventory/logs';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      } else {
        toast.error('Failed to load activity logs');
      }
    } catch (err) {
      toast.error('Network error loading logs');
    } finally {
      setLogsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              Real-Time Stock
            </span>
            <span className="text-xs text-slate-400 font-medium">Classes 1–5 Hard Copy Books</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Hard Copy Books Inventory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track exact copies remaining in warehouse • Auto-deducted on checkout • Quick restock & audit history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenLogs()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Global Stock Logs</span>
          </button>
          <button
            onClick={fetchInventory}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Stock</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Units In Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2 block">
            {stats.totalUnitsInStock}
          </span>
          <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
            Across all 10 hard copy titles
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'low' ? 'all' : 'low')}
          className={`border rounded-2xl p-4 shadow-xs cursor-pointer transition ${
            stats.lowStockCount > 0
              ? 'bg-amber-50/50 border-amber-200 hover:bg-amber-50'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Low Stock Warnings
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-900 tracking-tight mt-2 block">
            {stats.lowStockCount}
          </span>
          <span className="text-[11px] font-medium text-amber-700 block mt-0.5">
            {stats.lowStockCount > 0 ? 'Titles below threshold (≤10 copies)' : 'All titles healthy'}
          </span>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'out' ? 'all' : 'out')}
          className={`border rounded-2xl p-4 shadow-xs cursor-pointer transition ${
            stats.outOfStockCount > 0
              ? 'bg-rose-50/60 border-rose-200 hover:bg-rose-50'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Out of Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-rose-900 tracking-tight mt-2 block">
            {stats.outOfStockCount}
          </span>
          <span className="text-[11px] font-medium text-rose-700 block mt-0.5">
            {stats.outOfStockCount > 0 ? 'Zero copies available' : 'No stockouts detected'}
          </span>
        </div>

        {/* Units Sold */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Copies Sold
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight mt-2 block">
            {stats.totalUnitsSold}
          </span>
          <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
            Fulfilled from online orders
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or SKU (e.g. SK1)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="healthy">In Stock (Healthy &gt; 10)</option>
            <option value="low">Low Stock (≤ 10)</option>
            <option value="out">Out of Stock (0)</option>
          </select>

          {/* Series filter */}
          <select
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Series</option>
            <option value="Savi">Savi Kannada</option>
            <option value="Kali">Kali Kannada</option>
            <option value="Siri">Siri Kannada</option>
            <option value="Tili">Tili Kannada</option>
          </select>

          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Classes</option>
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
            <option value="3">Class 3</option>
            <option value="4">Class 4</option>
            <option value="5">Class 5</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Checking warehouse inventory...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No hard copy books match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Book Title & SKU</th>
                  <th className="py-3.5 px-4">Series & Grade</th>
                  <th className="py-3.5 px-4 text-center">Stock Health</th>
                  <th className="py-3.5 px-4 text-center">Copies Left</th>
                  <th className="py-3.5 px-4 text-center">Alert At</th>
                  <th className="py-3.5 px-4 text-center">Total Sold</th>
                  <th className="py-3.5 px-4 text-right">Revenue</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((book) => {
                  const isOutOfStock = book.stockQuantity <= 0;
                  const isLowStock = !isOutOfStock && book.stockQuantity <= book.lowStockThreshold;

                  return (
                    <tr
                      key={book.bookId}
                      className={`hover:bg-slate-50/50 transition ${
                        isOutOfStock
                          ? 'bg-rose-50/20'
                          : isLowStock
                          ? 'bg-amber-50/20'
                          : ''
                      }`}
                    >
                      {/* Title & Cover */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded shadow-xs border border-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate max-w-xs sm:max-w-sm">
                              {book.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono font-bold text-amber-700 text-[11px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                                SKU: {book.sku}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ID: {book.bookId}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Series & Grade */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {book.series}
                          </span>
                          <span className="text-slate-600 font-medium">Class {book.gradeClass}</span>
                        </div>
                      </td>

                      {/* Health Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <AlertCircle className="w-3 h-3 text-rose-600" /> Out of stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock
                          </span>
                        )}
                      </td>

                      {/* Copies Left */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-base font-black tracking-tight ${
                            isOutOfStock
                              ? 'text-rose-600'
                              : isLowStock
                              ? 'text-amber-700'
                              : 'text-slate-900'
                          }`}
                        >
                          {book.stockQuantity}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          copies left
                        </span>
                      </td>

                      {/* Alert Threshold */}
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-xs">
                        ≤ {book.lowStockThreshold}
                      </td>

                      {/* Total Sold */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-900">{book.unitsSold}</span>
                        <span className="text-[10px] text-slate-400 block">ordered</span>
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                        {formatPrice(book.revenue)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenRestock(book)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition shadow-xs cursor-pointer"
                            title="Restock book"
                          >
                            <PlusCircle className="w-3 h-3" />
                            <span>Restock</span>
                          </button>
                          <button
                            onClick={() => handleOpenLogs(book)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="View stock history & orders"
                          >
                            <History className="w-4 h-4" />
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

      {/* ─── RESTOCK MODAL ────────────────────────────────────────────────── */}
      {restockModalBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Restock Hard Copies
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    SKU: {restockModalBook.sku}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setRestockModalBook(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="font-bold text-slate-800 text-xs block truncate">
                  {restockModalBook.title}
                </span>
                <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">Current Stock Left:</span>
                  <span className="font-black text-slate-900">
                    {restockModalBook.stockQuantity} copies
                  </span>
                </div>
              </div>

              {/* Quantity Preset Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Quick Add Units
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRestockAmount(preset)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-black border transition cursor-pointer ${
                        restockAmount === preset
                          ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Quantity Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Or Custom Quantity to Add / Deduct
                </label>
                <input
                  type="number"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  placeholder="e.g. 50"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Positive number adds stock; negative number subtracts for damaged copies.
                </span>
              </div>

              {/* Reason / Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason / Reference Note *
                </label>
                <input
                  type="text"
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                  placeholder="e.g. New print batch from Bangalore press"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Low Stock Threshold */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  value={customThreshold}
                  onChange={(e) => setCustomThreshold(Number(e.target.value))}
                  placeholder="10"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  System triggers low-stock warning when copies fall below this number.
                </span>
              </div>

              {/* Projected Stock Preview */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs">
                <span className="font-medium text-amber-900">Projected Remaining Stock:</span>
                <span className="font-black text-amber-950 text-sm">
                  {Math.max(0, restockModalBook.stockQuantity + restockAmount)} copies
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRestockModalBook(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={restockLoading}
                onClick={handleConfirmRestock}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {restockLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Save Stock Update</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── AUDIT LOGS MODAL ─────────────────────────────────────────────── */}
      {logsModalBook !== undefined && logsModalBook !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[80vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Stock Movement History
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {logsModalBook ? `${logsModalBook.title} (${logsModalBook.sku})` : 'All Books'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setLogsModalBook(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Logs List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3">
              {logsLoading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="w-5 h-5 text-amber-500 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Loading audit history...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No movement logs recorded yet for this book.
                </div>
              ) : (
                logs.map((log) => {
                  const isPositive = log.changeAmount > 0;
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-black px-2 py-0.5 rounded text-[11px] ${
                              isPositive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {isPositive ? `+${log.changeAmount}` : log.changeAmount}
                          </span>
                          <span className="font-bold text-slate-800">{log.reason}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {new Date(log.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-black text-slate-900 block">
                          {log.remainingStock} left
                        </span>
                        <span className="text-[10px] text-slate-400">balance</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setLogsModalBook(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
