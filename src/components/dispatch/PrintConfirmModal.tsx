'use client';

import React from 'react';
import { FileText, Loader2, X, AlertTriangle, Download } from 'lucide-react';
import type { PrintPreview } from './types';
import { formatIST } from './types';

interface Props {
  preview: PrintPreview | null;
  loading: boolean;
  printing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PrintConfirmModal({ preview, loading, printing, onCancel, onConfirm }: Props) {
  const nothingToPrint = !loading && preview && preview.orderCount === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60" onClick={printing ? undefined : onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-confirm-title"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 id="print-confirm-title" className="font-black text-slate-900">
              Print dispatch sheet
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={printing}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto">
          {loading || !preview ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Checking orders…
            </div>
          ) : (
            <>
              <dl className="grid grid-cols-2 gap-3 mb-4">
                <Stat label="Date" value={formatIST(new Date().toISOString()).split(',')[0]} />
                <Stat
                  label="Order range"
                  value={
                    preview.startOrder
                      ? preview.startOrder === preview.endOrder
                        ? preview.startOrder
                        : `${preview.startOrder} → ${preview.endOrder}`
                      : '—'
                  }
                />
                <Stat label="Orders to print" value={String(preview.orderCount)} highlight />
                <Stat label="Total books" value={String(preview.totalBooks)} />
              </dl>

              {preview.orderCount > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Orders included</p>
                  <p className="text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2.5 leading-relaxed break-words">
                    {preview.orderNumbers.join(', ')}
                  </p>
                </div>
              )}

              {preview.skipped.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Skipped ({preview.skipped.length})
                  </p>
                  <ul className="text-xs border border-amber-200 bg-amber-50/60 rounded-lg divide-y divide-amber-100 max-h-40 overflow-y-auto">
                    {preview.skipped.map((s) => (
                      <li key={s.orderNumber} className="flex justify-between gap-3 px-2.5 py-1.5">
                        <span className="font-mono font-semibold text-slate-800">{s.orderNumber}</span>
                        <span className="text-amber-800 text-right">{s.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {nothingToPrint && (
                <p className="mt-4 text-sm text-slate-600">
                  Nothing to print. Tick <b>Include already printed</b> to reprint orders from an earlier sheet.
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
          <button
            onClick={onCancel}
            disabled={printing}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || printing || !preview || preview.orderCount === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {printing ? 'Generating…' : 'Download Word sheet'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${highlight ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}>
      <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</dt>
      <dd className={`font-black mt-0.5 ${highlight ? 'text-amber-800 text-xl' : 'text-slate-900 text-sm'}`}>{value}</dd>
    </div>
  );
}
