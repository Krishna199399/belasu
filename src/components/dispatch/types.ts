import type { DispatchOrder, SkippedOrder } from '@/lib/dispatch';

export type DispatchTab = 'to_print' | 'printed' | 'all' | 'batches';
export type DispatchPeriod = 'all' | 'today' | 'yesterday' | 'this_week';

export interface DispatchListOrder extends DispatchOrder {
  batchName: string | null;
}

export interface DispatchKpis {
  toPrint: number;
  receivedToday: number;
  printedToday: number;
}

export interface DispatchBatch {
  id: string;
  batch_name: string;
  start_order_number: string;
  end_order_number: string;
  order_count: number;
  total_books: number;
  order_numbers: string[];
  skipped: SkippedOrder[];
  created_by_name: string | null;
  created_by_phone: string | null;
  created_at: string;
}

export interface PrintPreview {
  orderCount: number;
  totalBooks: number;
  startOrder: string | null;
  endOrder: string | null;
  orderNumbers: string[];
  skipped: SkippedOrder[];
}

/** What the user asked to print: explicit selection or a from–to range */
export type PrintTarget =
  | { kind: 'selection'; orderIds: string[] }
  | { kind: 'range'; fromOrder: string; toOrder: string; includePrinted: boolean };

/** Downloads a binary Response as a file using the server-provided batch name */
export async function saveDocxResponse(res: Response, fallbackName: string): Promise<string> {
  const encoded = res.headers.get('X-Batch-Name');
  const filename = encoded ? decodeURIComponent(encoded) : fallbackName;
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return filename;
}

export function formatIST(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}
