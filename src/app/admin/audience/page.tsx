'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Download,
  Filter,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ProductOption {
  id: string;
  sku: string;
  title: string;
  gradeClass?: number;
  type: string;
}

interface BatchInfo {
  batchIndex: number;
  count: number;
  range: string;
}

interface ContactPreview {
  phone: string;
  name: string;
  email?: string;
  orderCount: number;
  lastOrderNumber: string;
  lastOrderDate: string;
  purchasedBooks: string[];
}

export default function AdminAudiencePage() {
  const [loading, setLoading] = useState(true);
  const [totalContacts, setTotalContacts] = useState(0);
  const [batchSize, setBatchSize] = useState(300);
  const [totalBatches, setTotalBatches] = useState(1);
  const [batches, setBatches] = useState<BatchInfo[]>([]);
  const [contacts, setContacts] = useState<ContactPreview[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);

  // Filter states
  const [selectedProductId, setSelectedProductId] = useState('all');
  const [excludeProductId, setExcludeProductId] = useState('none');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAudience = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('productId', selectedProductId);
      params.set('excludeProductId', excludeProductId);
      params.set('batchSize', String(batchSize));
      if (searchTerm.trim()) params.set('search', searchTerm.trim());

      const res = await fetch(`/api/admin/audience?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTotalContacts(data.totalContacts);
        setTotalBatches(data.totalBatches);
        setBatches(data.batches || []);
        setContacts(data.contactsPreview || []);
        if (data.availableProducts && products.length === 0) {
          setProducts(data.availableProducts);
        }
      }
    } catch (err) {
      console.error('Failed to load audience:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudience();
  }, [selectedProductId, excludeProductId, batchSize]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAudience();
  };

  const handleExportCsv = (batchIdx: number) => {
    const params = new URLSearchParams();
    params.set('productId', selectedProductId);
    params.set('excludeProductId', excludeProductId);
    params.set('batchSize', String(batchSize));
    params.set('batchIndex', String(batchIdx));
    params.set('format', 'csv');
    if (searchTerm.trim()) params.set('search', searchTerm.trim());

    // Trigger browser file download
    window.location.href = `/api/admin/audience?${params.toString()}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
              WhatsApp Broadcast Engine
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Targeted Audience & Anti-Spam Batching
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Filter 4,000+ customer phone numbers by purchased books, split into safe Meta batches, and export directly for WACRM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://crm.belesu.in/broadcasts/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm transition"
          >
            <span>Open WACRM Wizard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Meta Anti-Spam Strategy Guide */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-100 rounded-2xl p-5 shadow-sm border border-slate-700/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700/70 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Meta WhatsApp Anti-Spam Protocol</h3>
              <p className="text-xs text-slate-400">
                Protect your WhatsApp quality rating by using laser-targeted upsells and staggered daily batches.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tier 1 Limit: Max 1,000 Contacts / 24h</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
            <p className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              1. Laser-Targeted Upsells
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Customers who already bought Savi Class 1 want Class 2. Targeting past buyers gets highest conversion and <strong>zero spam reports</strong>.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
            <p className="font-bold text-sky-400 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              2. Staggered Batch Pacing
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Send <strong>250–300 messages per day</strong>. After 7 days of green quality rating, Meta automatically upgrades your number to 10,000/day.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
            <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              3. Automatic Number Formatting
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              All exported customer phones are automatically formatted with <strong>+91</strong> (E.164) and de-duplicated to eliminate sending errors.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Book Filter (Inclusion) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target: Customers Who Purchased
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
            >
              <option value="all">⭐ All Books (All Store Customers)</option>
              <optgroup label="Savi Kannada Physical Books">
                {products
                  .filter((p) => p.type === 'physical')
                  .map((b) => (
                    <option key={b.id} value={b.sku || b.id}>
                      Class {b.gradeClass || ''} — {b.title} ({b.sku})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Digital Reader Editions">
                {products
                  .filter((p) => p.type === 'digital')
                  .map((d) => (
                    <option key={d.id} value={d.sku || d.id}>
                      Class {d.gradeClass || ''} — {d.title}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Exclusion Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Exclusion: Exclude If Already Bought
            </label>
            <select
              value={excludeProductId}
              onChange={(e) => setExcludeProductId(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
            >
              <option value="none">None (Do not exclude anyone)</option>
              <optgroup label="Physical Books to Exclude">
                {products
                  .filter((p) => p.type === 'physical')
                  .map((b) => (
                    <option key={b.id} value={b.sku || b.id}>
                      Class {b.gradeClass || ''} — {b.title} ({b.sku})
                    </option>
                  ))}
              </optgroup>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              e.g. When promoting Class 2 to Class 1 buyers, select Class 2 to skip repeat owners.
            </p>
          </div>

          {/* Batch Size Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Anti-Spam Batch Size
            </label>
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value, 10))}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
            >
              <option value={250}>250 Contacts (Safest for Meta Tier 1 - Recommended)</option>
              <option value={300}>300 Contacts (Standard Safe Batch)</option>
              <option value={500}>500 Contacts (High Volume Batch)</option>
              <option value={1000}>1,000 Contacts (Max Daily Tier 1 Limit)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              Splits large lists so you can broadcast 1 batch per day safely.
            </p>
          </div>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative pt-2 border-t border-slate-100 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search in this filtered audience by name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-500 transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Audience Stats & Download Action Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">
                {totalContacts.toLocaleString()} Eligible Customers Found
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Split into <strong className="text-slate-800">{totalBatches} batch{totalBatches === 1 ? '' : 'es'}</strong> of up to {batchSize} contacts each.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportCsv(0)}
              disabled={totalContacts === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All ({totalContacts}) CSV</span>
            </button>
          </div>
        </div>

        {/* Batch Cards Grid */}
        {totalContacts === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No customers match the current book filters. Try selecting a different book or removing exclusion.
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              Download Batch-Wise CSV Files (Ready for WACRM):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {batches.map((batch) => (
                <div
                  key={batch.batchIndex}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 hover:bg-white hover:border-amber-400 hover:shadow-xs transition flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900">
                      Batch #{batch.batchIndex}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {batch.count} contacts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3 font-mono">
                    Contacts {batch.range}
                  </p>
                  <button
                    onClick={() => handleExportCsv(batch.batchIndex)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Batch #{batch.batchIndex}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Audience Preview Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            Audience Sample Preview (First {Math.min(25, contacts.length)} Contacts)
          </h4>
          <span className="text-[11px] text-slate-400">
            CSV columns: <code className="font-mono text-slate-600">phone,name</code>
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Querying segmented customer database...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No contacts to preview.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Phone (WhatsApp)</th>
                  <th className="py-3 px-4">Books Purchased</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-right">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{c.name}</td>
                    <td className="py-3 px-4 font-mono text-emerald-600 font-semibold">{c.phone}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {c.purchasedBooks && c.purchasedBooks.length > 0 ? (
                        <span className="inline-block max-w-xs truncate" title={c.purchasedBooks.join(', ')}>
                          {c.purchasedBooks.join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Store Customer</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">{c.orderCount}</td>
                    <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                      {new Date(c.lastOrderDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

