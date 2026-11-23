'use client';

import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Printer,
  PackageCheck,
  Inbox,
  CalendarDays,
  Search,
  RefreshCw,
  Loader2,
  FileText,
  X,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
} from 'lucide-react';
import { OrdersTable } from './OrdersTable';
import { BatchHistory, Pager } from './BatchHistory';
import { PrintConfirmModal } from './PrintConfirmModal';
import type {
  DispatchKpis,
  DispatchListOrder,
  DispatchPeriod,
  DispatchTab,
  PrintPreview,
  PrintTarget,
} from './types';
import { saveDocxResponse } from './types';
import { DISPATCH_START_LABEL } from '@/lib/dispatch';

const PAGE_SIZE = 100;

interface OrdersResponse {
  orders: DispatchListOrder[];
  kpis: DispatchKpis;
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

interface OrdersResult {
  key: string;
  /** Which tab this response belongs to — rows from another tab are never shown */
  tab: DispatchTab;
  data?: OrdersResponse;
  /** Last known counters, kept across failed requests */
  kpis?: DispatchKpis;
  error?: string;
}

const TABS: { id: DispatchTab; label: string }[] = [
  { id: 'to_print', label: 'To Print' },
  { id: 'printed', label: 'Printed' },
  { id: 'all', label: 'All Orders' },
  { id: 'batches', label: 'Printed Sheets' },
];

const PERIODS: { id: DispatchPeriod; label: string }[] = [
  { id: 'all', label: 'Any date' },
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this_week', label: 'This week' },
];

function targetBody(target: PrintTarget) {
  return target.kind === 'selection'
    ? { orderIds: target.orderIds, includePrinted: true }
    : { fromOrder: target.fromOrder, toOrder: target.toOrder, includePrinted: target.includePrinted };
}

export function DispatchDashboard() {
  const [tab, setTab] = useState<DispatchTab>('to_print');
  const [period, setPeriod] = useState<DispatchPeriod>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [fromOrder, setFromOrder] = useState('');
  const [toOrder, setToOrder] = useState('');
  const [includePrinted, setIncludePrinted] = useState(false);
  const [page, setPage] = useState(1);
  // Ascending = oldest first. Every tab defaults to descending (newest first).
  const [sortAsc, setSortAsc] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);
  const [result, setResult] = useState<OrdersResult | null>(null);

  const [printTarget, setPrintTarget] = useState<PrintTarget | null>(null);
  const [preview, setPreview] = useState<PrintPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [printing, setPrinting] = useState(false);

  /** Every filter change returns to page 1 and clears the selection */
  const resetPaging = () => {
    setPage(1);
    setSelectedIds(new Set());
  };

  // Debounce search typing
  useEffect(() => {
    const next = searchInput.trim();
    if (next === search) return;
    const t = setTimeout(() => {
      setSearch(next);
      resetPaging();
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput, search]);

  const query = useMemo(() => {
    const params = new URLSearchParams({
      status: tab,
      period,
      page: String(page),
      limit: String(PAGE_SIZE),
      sort: sortAsc ? 'asc' : 'desc',
    });
    if (search) params.set('search', search);
    if (/^\d+$/.test(fromOrder)) params.set('fromOrder', fromOrder);
    if (/^\d+$/.test(toOrder)) params.set('toOrder', toOrder);
    return params.toString();
  }, [tab, period, page, sortAsc, search, fromOrder, toOrder]);

  // Results are tagged with the request they answer, so a slow stale response
  // can never overwrite a newer one, and "loading" is simply "result is for another key".
  const requestKey = `${query}#${refreshKey}`;

  useEffect(() => {
    if (tab === 'batches') return;
    let cancelled = false;
    fetch(`/api/dispatch/orders?${query}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) throw new Error(data.error || 'Could not load orders');
        setResult({ key: requestKey, tab, data, kpis: data.kpis });
      })
      .catch((e) => {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : 'Could not load orders';
        setResult((prev) => ({ key: requestKey, tab, error: message, kpis: prev?.kpis }));
      });
    return () => {
      cancelled = true;
    };
  }, [tab, query, requestKey]);

  const loading = tab !== 'batches' && result?.key !== requestKey;
  const error = !loading ? result?.error || '' : '';
  // While a new page/filter loads, the previous rows of the SAME tab stay visible (dimmed).
  // Rows from a different tab are never shown under this tab's heading.
  const current = result?.tab === tab ? result.data : undefined;
  const orders: DispatchListOrder[] = current?.orders ?? [];
  const kpis: DispatchKpis = result?.kpis ?? { toPrint: 0, receivedToday: 0, printedToday: 0 };
  const total = current?.pagination.total ?? 0;
  const totalPages = current?.pagination.totalPages ?? 1;

  const changeTab = (t: DispatchTab) => {
    setTab(t);
    setSortAsc(false);
    resetPaging();
  };

  const toggle = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelectedIds((prev) => {
      const allOnPage = orders.length > 0 && orders.every((o) => prev.has(o.id));
      const next = new Set(prev);
      for (const o of orders) {
        if (allOnPage) next.delete(o.id);
        else next.add(o.id);
      }
      return next;
    });

  /* ── Print flow: preview → confirm → download ── */

  const openPrint = async (target: PrintTarget) => {
    setPrintTarget(target);
    setPreview(null);
    setPreviewLoading(true);
    try {
      const res = await fetch('/api/dispatch/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...targetBody(target), preview: true }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Could not check orders');
      setPreview(data.preview);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not check orders');
      setPrintTarget(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const confirmPrint = async () => {
    if (!printTarget) return;
    setPrinting(true);
    try {
      const res = await fetch('/api/dispatch/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetBody(printTarget)),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not generate the sheet');
      }
      const count = res.headers.get('X-Orders-Count');
      const start = res.headers.get('X-Start-Order');
      const end = res.headers.get('X-End-Order');
      await saveDocxResponse(res, 'Dispatch sheet.docx');
      toast.success(`Downloaded ${count} orders (${start === end ? start : `${start} → ${end}`})`);
      setPrintTarget(null);
      setPreview(null);
      setSelectedIds(new Set());
      setRefreshKey((k) => k + 1);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not generate the sheet');
    } finally {
      setPrinting(false);
    }
  };

  const rangeValid = /^\d+$/.test(fromOrder) && /^\d+$/.test(toOrder);

  return (
    <div className="space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Kpi icon={Inbox} label="Waiting to print" value={kpis.toPrint} tone="amber" onClick={() => changeTab('to_print')} />
        <Kpi icon={CalendarDays} label="Orders received today" value={kpis.receivedToday} tone="slate" />
        <Kpi icon={PackageCheck} label="Printed today" value={kpis.printedToday} tone="emerald" />
      </div>

      {/* Print by range */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex flex-col lg:flex-row lg:items-end gap-3">
          <div className="flex items-end gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">From order</span>
              <input
                inputMode="numeric"
                value={fromOrder}
                onChange={(e) => {
                  setFromOrder(e.target.value.replace(/\D/g, ''));
                  resetPaging();
                }}
                placeholder="23472"
                className="w-28 px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </label>
            <span className="pb-2.5 text-slate-400">→</span>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">To order</span>
              <input
                inputMode="numeric"
                value={toOrder}
                onChange={(e) => {
                  setToOrder(e.target.value.replace(/\D/g, ''));
                  resetPaging();
                }}
                placeholder="23490"
                className="w-28 px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </label>
            {(fromOrder || toOrder) && (
              <button
                onClick={() => {
                  setFromOrder('');
                  setToOrder('');
                  resetPaging();
                }}
                className="mb-1 p-2 text-slate-400 hover:text-slate-700 rounded-lg"
                aria-label="Clear range"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 pb-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includePrinted}
              onChange={(e) => setIncludePrinted(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            Include already printed (reprint)
          </label>
          <button
            onClick={() => openPrint({ kind: 'range', fromOrder, toOrder, includePrinted })}
            disabled={!rangeValid}
            className="lg:ml-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" /> Print range
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          Showing orders placed from {DISPATCH_START_LABEL}. Enter the first and last order number — cancelled, unpaid
          and already-printed orders are skipped automatically.
        </p>
      </section>

      {/* Tabs + table */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between px-4 pt-3 border-b border-slate-200">
          <div className="flex gap-1 overflow-x-auto -mb-px">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => changeTab(t.id)}
                className={`px-3.5 py-2.5 text-sm font-bold whitespace-nowrap border-b-2 transition ${
                  tab === t.id ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.label}
                {t.id === 'to_print' && kpis.toPrint > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px]">{kpis.toPrint}</span>
                )}
              </button>
            ))}
          </div>

          {tab !== 'batches' && (
            <div className="flex items-center gap-2 pb-3 md:pb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Order, name, phone, city"
                  className="w-48 pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <select
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value as DispatchPeriod);
                  resetPaging();
                }}
                className="px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                aria-label="Filter by date"
              >
                {PERIODS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setRefreshKey((k) => k + 1)}
                className="p-2 rounded-xl border border-slate-300 text-slate-500 hover:text-slate-900"
                aria-label="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {tab === 'batches' ? (
          <BatchHistory refreshKey={refreshKey} />
        ) : (
          <>
            {selectedIds.size > 0 && (
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-50 border-b border-amber-200">
                <span className="text-xs font-bold text-amber-900">{selectedIds.size} selected</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white rounded-lg"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => openPrint({ kind: 'selection', orderIds: [...selectedIds] })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print selected
                  </button>
                </div>
              </div>
            )}

            {loading && orders.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading orders…
              </div>
            ) : error ? (
              <div className="py-16 text-center text-sm text-rose-600">{error}</div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">
                  {tab === 'to_print' ? 'All caught up — nothing waiting to print' : 'No orders match these filters'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-2 text-[11px] text-slate-500 border-b border-slate-100">
                  <span>
                    {total} {total === 1 ? 'order' : 'orders'}
                  </span>
                  <button
                    onClick={() => {
                      setSortAsc((v) => !v);
                      resetPaging();
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50"
                    title="Change sort order"
                  >
                    {sortAsc ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />}
                    {sortAsc ? 'Oldest first (ascending)' : 'Newest first (descending)'}
                  </button>
                </div>
                <div className={loading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
                  <OrdersTable orders={orders} selectedIds={selectedIds} onToggle={toggle} onToggleAll={toggleAll} />
                </div>
                {totalPages > 1 && <Pager page={page} totalPages={totalPages} onChange={setPage} />}
              </>
            )}
          </>
        )}
      </section>

      {printTarget && (
        <PrintConfirmModal
          preview={preview}
          loading={previewLoading}
          printing={printing}
          onCancel={() => {
            setPrintTarget(null);
            setPreview(null);
          }}
          onConfirm={confirmPrint}
        />
      )}
    </div>
  );
}

const TONES = {
  amber: 'bg-amber-50 border-amber-200 text-amber-800',
  slate: 'bg-white border-slate-200 text-slate-800',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
} as const;

function Kpi({
  icon: Icon,
  label,
  value,
  tone,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  tone: keyof typeof TONES;
  onClick?: () => void;
}) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`text-left rounded-2xl border p-4 flex items-center gap-3 ${TONES[tone]} ${onClick ? 'hover:shadow-sm transition cursor-pointer' : ''}`}
    >
      <div className="w-10 h-10 rounded-xl bg-white/70 border border-current/10 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-black leading-none">{value}</div>
        <div className="text-xs font-semibold mt-1 opacity-80">{label}</div>
      </div>
    </Comp>
  );
}
