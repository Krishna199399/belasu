'use client';

import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import type { DispatchListOrder } from './types';
import { formatIST } from './types';

interface Props {
  orders: DispatchListOrder[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}

export function OrdersTable({ orders, selectedIds, onToggle, onToggleAll }: Props) {
  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.has(o.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wide text-[11px] border-b border-slate-200">
          <tr>
            <th className="px-3 py-3 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleAll}
                aria-label="Select all orders on this page"
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </th>
            <th className="px-3 py-3 font-bold">Order</th>
            <th className="px-3 py-3 font-bold">Customer</th>
            <th className="px-3 py-3 font-bold">Ship to</th>
            <th className="px-3 py-3 font-bold">Books</th>
            <th className="px-3 py-3 font-bold">Print status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((o) => {
            const selected = selectedIds.has(o.id);
            return (
              <tr
                key={o.id}
                onClick={() => onToggle(o.id)}
                className={`cursor-pointer transition ${selected ? 'bg-amber-50' : 'hover:bg-slate-50'}`}
              >
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggle(o.id)}
                    aria-label={`Select order ${o.orderNumber}`}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="font-mono font-black text-slate-900 text-sm">{o.orderNumber}</div>
                  <div className="text-[11px] text-slate-500">{formatIST(o.orderDate)}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="font-semibold text-slate-800">{o.customerName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{o.phone}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="font-semibold text-slate-700">{o.city || '—'}</div>
                  <div className="text-[11px] text-slate-500">{o.pincode}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {o.items.map((it, idx) => (
                      <span
                        key={`${it.sku}-${idx}`}
                        title={it.name}
                        className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-mono font-bold text-[11px] text-slate-700"
                      >
                        {it.sku} × {it.quantity}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {o.isPrinted ? (
                    <div>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Printed
                      </span>
                      <div className="text-[11px] text-slate-500">{formatIST(o.printedAt)}</div>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                      <Clock className="w-3.5 h-3.5" /> To print
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
