import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  BorderStyle,
  WidthType,
} from 'docx';
import type { DispatchOrder } from '@/lib/dispatch';

/*
 * Matches Belesu's existing hand-made dispatch sheet (e.g. "Orders-1-Dec-25-19682-19683.docx"):
 * one centred, bordered table; each order is one row; every line bold and centred.
 *
 *   Order ID:- 19682
 *   Book ID:- KK3   QTY:- 1
 *
 *   Address:
 *   Suhaib cherukunnon
 *   G5, Ground Floor, Alpine Square,
 *   Diddanagamanagala road, Rayasandra,
 *   BANGALORE - 560100  Karnataka
 *   Mobile No: 8050004161
 */

const FONT = 'Calibri';
const SIZE = 24; // 12pt
const TABLE_WIDTH = 7800; // ~5.4 inches, centred on A4
const border = { style: BorderStyle.SINGLE, size: 6, color: '000000' };

function line(value: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0, line: 259 }, // single spacing (Word default 1.08)
    children: [new TextRun({ text: value, bold: true, font: FONT, size: SIZE })],
  });
}

function slipLines(order: DispatchOrder): Paragraph[] {
  const books =
    order.items.length > 0
      ? order.items.map((it) => `Book ID:- ${it.sku}   QTY:- ${it.quantity}`)
      : ['Book ID:- HARD COPY   QTY:- 1'];

  const cityLine = [order.city, order.pincode].filter(Boolean).join(' - ');
  const lines = [
    `Order ID:- ${order.orderNumber}`,
    ...books,
    '',
    'Address:',
    order.customerName,
    order.address1,
    order.address2,
    `${cityLine}${order.state ? `  ${order.state}` : ''}`.trim(),
    `Mobile No: ${order.phone}`,
  ];

  // Keep the blank spacer line after the book lines; drop empty address parts
  return lines
    .filter((text, i) => text !== '' || i === books.length + 1)
    .map(line);
}

function slipRow(order: DispatchOrder): TableRow {
  return new TableRow({
    cantSplit: true, // never split one customer's slip across two pages
    children: [
      new TableCell({
        width: { size: TABLE_WIDTH, type: WidthType.DXA },
        margins: { top: 40, bottom: 120, left: 115, right: 115 },
        children: slipLines(order),
      }),
    ],
  });
}

/** Builds the dispatch Word (.docx) sheet: one bordered row per order, in order-number order. */
export async function generateDispatchDocx(orders: DispatchOrder[]): Promise<Buffer> {
  if (orders.length === 0) throw new Error('Cannot generate a dispatch sheet with no orders');

  const table = new Table({
    alignment: AlignmentType.CENTER,
    width: { size: TABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [TABLE_WIDTH],
    borders: {
      top: border,
      bottom: border,
      left: border,
      right: border,
      insideHorizontal: border,
      insideVertical: border,
    },
    rows: orders.map(slipRow),
  });

  const doc = new Document({
    creator: 'Belesu Dispatch',
    title: 'Belesu Dispatch Sheet',
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [table],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
