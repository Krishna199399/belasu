'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarRange, Download, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { SalesSummary } from '@/lib/salesRules';

interface MonthRow extends SalesSummary {
  month: string;
  changePercent: number | null;
}

interface ReportResponse {
  year: number;
  years: number[];
  months: MonthRow[];
  total: SalesSummary;
}

type ProductType = 'all' | 'physical' | 'digital';

function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function downloadCsv(report: ReportResponse, type: ProductType) {
  const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const header = ['Month', 'Paid orders', 'Sales (INR)', 'Avg order (INR)', 'Hard copy', 'Digital', 'Cancelled', 'Cancelled value (INR)', 'Refunds (INR)', 'Awaiting payment', 'vs last month (%)'];
  const row = (label: string, r: SalesSummary, change: number | null) =>
    [cell(label), r.salesCount, r.salesAmount, r.averageOrderValue, r.hardCopyCount, r.digitalCount, r.cancelledCount, r.cancelledAmount, r.refundAmount, r.unpaidCount, change ?? ''].join(',');
  const lines = [
    header.map(cell).join(','),
    ...report.months.map((m) => row(monthLabel(m.month), m, m.changePercent)),
    row(`TOTAL ${report.year}`, report.total, null),
  ];
  const url = URL.createObjectURL(new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `belesu_sales_report_${report.year}${type === 'all' ? '' : `_${type}`}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Month-by-month sales for a year. Uses the shared sale rule (src/lib/salesRules.ts). */
export function MonthlySalesReport() {
  const [year, setYear] = useState<number | null>(null); // null = current year (server default)
  const [type, setType] = useState<ProductType>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [result, setResult] = useState<{ key: string; data?: ReportResponse; error?: string } | null>(null);

  const query = `${year ? `year=${year}&` : ''}type=${type}`;
  const requestKey = `${query}#${refreshKey}`;

  // Results are tagged with the request they answer, so a slow stale response
  // never overwrites a newer one; "loading" = latest result is for another key.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/sales-report?${query}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) throw new Error(data.error || 'Could not load the sales report');
        setResult({ key: requestKey, data });
      })
      .catch((e) => {
        if (!cancelled) setResult({ key: requestKey, error: e instanceof Error ? e.message : 'Could not load the sales report' });
      });
    return () => {
      cancelled = true;
    };
  }, [query, requestKey]);

  const loading = result?.key !== requestKey;
  const report = result?.data;
  const months = report ? [...report.months].reverse() : []; // newest month first

  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
            <CalendarRange className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-black text-slate-900">Monthly Sales Report</h3>
            <p className="text-[11px] text-slate-500">Paid orders only · amounts incl. shipping, minus refunds · click a month to see its orders</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={report?.year ?? year ?? ''}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            aria-label="Year"
          >
            {(report?.years ?? (year ? [year] : [])).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ProductType)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            aria-label="Product type"
          >
            <option value="all">All products</option>
            <option value="physical">Hard copy</option>
            <option value="digital">Digital</option>
          </select>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900"
            aria-label="Refresh report"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => report && downloadCsv(report, type)}
            disabled={!report || loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      {result?.error && !loading ? (
        <div className="p-10 text-center text-sm text-rose-600">{result.error}</div>
      ) : !report ? (
        <div className="p-10 text-center text-xs text-slate-500">
          <RefreshCw className="w-5 h-5 text-amber-500 animate-spin mx-auto mb-2" />
          Building report…
        </div>
      ) : (
        <div className={`overflow-x-auto ${loading ? 'opacity-50' : ''}`}>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4 text-right">Paid orders</th>
                <th className="py-3 px-4 text-right">Sales</th>
                <th className="py-3 px-4 text-right">vs last month</th>
                <th className="py-3 px-4 text-right">Avg order</th>
                <th className="py-3 px-4 text-right">Hard copy / Digital</th>
                <th className="py-3 px-4 text-right">Cancelled</th>
                <th className="py-3 px-4 text-right">Refunds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {months.map((m) => (
                <tr key={m.month} className="hover:bg-amber-50/40 transition">
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/orders/?month=${m.month}`}
                      className="font-bold text-slate-900 hover:text-amber-600 inline-flex items-center gap-1"
                    >
                      {monthLabel(m.month)} <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-700">{m.salesCount}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">{formatPrice(m.salesAmount)}</td>
                  <td className="py-3 px-4 text-right">
                    {m.changePercent === null ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-0.5 font-bold ${
                          m.changePercent >= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {m.changePercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(m.changePercent)}%
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600">{formatPrice(m.averageOrderValue)}</td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    {m.hardCopyCount} / {m.digitalCount}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    {m.cancelledCount > 0 ? (
                      <span className="text-rose-600">
                        {m.cancelledCount} · {formatPrice(m.cancelledAmount)}
                      </span>
                    ) : (
                      '0'
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    {m.refundAmount > 0 ? formatPrice(m.refundAmount) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900 text-white">
              <tr>
                <td className="py-3 px-4 font-black">Total {report.year}</td>
                <td className="py-3 px-4 text-right font-bold">{report.total.salesCount}</td>
                <td className="py-3 px-4 text-right font-black text-amber-400">{formatPrice(report.total.salesAmount)}</td>
                <td className="py-3 px-4" />
                <td className="py-3 px-4 text-right">{formatPrice(report.total.averageOrderValue)}</td>
                <td className="py-3 px-4 text-right">
                  {report.total.hardCopyCount} / {report.total.digitalCount}
                </td>
                <td className="py-3 px-4 text-right">
                  {report.total.cancelledCount} · {formatPrice(report.total.cancelledAmount)}
                </td>
                <td className="py-3 px-4 text-right">
                  {report.total.refundAmount > 0 ? formatPrice(report.total.refundAmount) : '—'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  );
}
