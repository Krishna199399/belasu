'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Download, Loader2, FileText, AlertTriangle } from 'lucide-react';
import type { DispatchBatch } from './types';
import { formatIST, saveDocxResponse } from './types';

export function BatchHistory({ refreshKey }: { refreshKey: number }) {
  const [page, setPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [result, setResult] = useState<{
    key: string;
    batches?: DispatchBatch[];
    totalPages?: number;
    error?: string;
  } | null>(null);

  const requestKey = `${page}#${refreshKey}`;

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/dispatch/batches?page=${page}&limit=25`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) throw new Error(data.error || 'Could not load batches');
        setResult({ key: requestKey, batches: data.batches, totalPages: data.pagination.totalPages });
      })
      .catch((e) => {
        if (!cancelled) setResult({ key: requestKey, error: e instanceof Error ? e.message : 'Could not load batches' });
      });
    return () => {
      cancelled = true;
    };
  }, [page, requestKey]);

  const loading = result?.key !== requestKey;
  const error = result?.error || '';
  const batches = result?.batches ?? [];
  const totalPages = result?.totalPages ?? 1;

  const redownload = async (batch: DispatchBatch) => {
    setDownloadingId(batch.id);
    try {
      const res = await fetch(`/api/dispatch/batches/${batch.id}/download`, { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Download failed');
      }
      await saveDocxResponse(res, batch.batch_name);
      toast.success('Sheet downloaded again');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Download failed');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading batches…
      </div>
    );
  }

  if (error) {
    return <div className="py-16 text-center text-sm text-rose-600">{error}</div>;
  }

  if (batches.length === 0) {
    return (
      <div className="py-16 text-center">
        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600">No dispatch sheets printed yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wide text-[11px] border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 font-bold">Printed on</th>
              <th className="px-3 py-3 font-bold">Order range</th>
              <th className="px-3 py-3 font-bold text-right">Orders</th>
              <th className="px-3 py-3 font-bold text-right">Books</th>
              <th className="px-3 py-3 font-bold">Printed by</th>
              <th className="px-3 py-3 font-bold text-right">File</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {batches.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="px-3 py-3 whitespace-nowrap font-semibold text-slate-800">{formatIST(b.created_at)}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className="font-mono font-black text-slate-900">
                    {b.start_order_number === b.end_order_number
                      ? b.start_order_number
                      : `${b.start_order_number} → ${b.end_order_number}`}
                  </span>
                  {b.skipped?.length > 0 && (
                    <span
                      className="ml-2 inline-flex items-center gap-1 text-[11px] text-amber-700"
                      title={b.skipped.map((s) => `${s.orderNumber}: ${s.reason}`).join('\n')}
                    >
                      <AlertTriangle className="w-3 h-3" /> {b.skipped.length} skipped
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-right font-black text-slate-900">{b.order_count}</td>
                <td className="px-3 py-3 text-right text-slate-700">{b.total_books}</td>
                <td className="px-3 py-3 text-slate-700">{b.created_by_name || b.created_by_phone || '—'}</td>
                <td className="px-3 py-3 text-right">
                  <button
                    onClick={() => redownload(b)}
                    disabled={downloadingId === b.id}
                    title={b.batch_name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-white font-bold disabled:opacity-50"
                  >
                    {downloadingId === b.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    .docx
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pager page={page} totalPages={totalPages} onChange={setPage} />
      )}
    </div>
  );
}

export function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-slate-500">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
