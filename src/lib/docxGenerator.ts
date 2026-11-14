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

export interface DispatchOrderItem {
  name: string;
  sku?: string;
  quantity: number;
}

export interface DispatchOrder {
  id: string;
  orderNumber: string;
  orderDate?: string;
  customerName: string;
  phone: string;
  address1?: string;
  address2?: string;
  city: string;
  state?: string;
  pincode?: string;
  items: DispatchOrderItem[];
}

/**
 * Derives the canonical Belesu Book ID / SKU shorthand (e.g. KK3, SK4)
 * from SKU or item title if not explicitly set.
 */
export function resolveBookSku(item: DispatchOrderItem): string {
  if (item.sku && item.sku.trim()) {
    return item.sku.trim().toUpperCase();
  }

  const name = (item.name || '').toLowerCase();
  if (name.includes('savi')) {
    if (name.includes('class 1') || name.includes('grade 1')) return 'SK1';
    if (name.includes('class 2') || name.includes('grade 2')) return 'SK2';
    if (name.includes('class 3') || name.includes('grade 3')) return 'SK3';
    if (name.includes('class 4') || name.includes('grade 4')) return 'SK4';
    return 'SK';
  }
  if (name.includes('kali')) {
    if (name.includes('class 1') || name.includes('grade 1')) return 'KK1';
    if (name.includes('class 2') || name.includes('grade 2')) return 'KK2';
    if (name.includes('class 3') || name.includes('grade 3')) return 'KK3';
    if (name.includes('class 4') || name.includes('grade 4')) return 'KK4';
    return 'KK';
  }
  if (name.includes('siri')) return 'SIRI5';
  if (name.includes('tili')) return 'TILI5';
  if (name.includes('destination') || name.includes('speak kannada')) return 'DSK';
  if (name.includes('mathadi')) return 'KM';

  return item.name.slice(0, 10).toUpperCase();
}

/**
 * Builds standard Belesu filename: Order Id-<DD>-<MMM>-<YY>-<Start>-<End>.docx
 * e.g. "Order Id-15-Nov-26-20044-20064.docx"
 */
export function generateBatchFilename(
  startOrderNumber: string,
  endOrderNumber: string,
  date: Date = new Date()
): string {
  // Format DD-MMM-YY in IST
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2); // e.g. "26"

  const range =
    startOrderNumber === endOrderNumber
      ? startOrderNumber
      : `${startOrderNumber}-${endOrderNumber}`;

  return `Order Id-${day}-${month}-${year}-${range}.docx`;
}

/**
 * Generates the Word (.docx) document with 2 centered bordered boxes per page
 * matching the Belesu packaging slip template.
 */
export async function generateDispatchDocx(orders: DispatchOrder[]): Promise<Buffer> {
  const children: (Table | Paragraph)[] = [];

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    // Format Book IDs & Qty lines
    const bookLines = (order.items || []).map((it) => {
      const sku = resolveBookSku(it);
      return `Book ID:- ${sku}  QTY:- ${it.quantity}`;
    });
    const bookLineText = bookLines.length > 0 ? bookLines.join(', ') : 'Book ID:- HARD COPY  QTY:- 1';

    // Format Address lines
    const cleanAddress1 = (order.address1 || '').trim();
    const cleanAddress2 = (order.address2 || '').trim();
    const cleanCity = (order.city || '').trim().toUpperCase();
    const cleanState = (order.state || 'Karnataka').trim();
    const cleanPincode = (order.pincode || '').trim();
    const cityLine = `${cleanCity}${cleanPincode ? ` - ${cleanPincode}` : ''} ${cleanState}`.trim();

    const cellParagraphs: Paragraph[] = [
      // Spacing at top of box
      new Paragraph({ spacing: { before: 100 } }),

      // Order ID line
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Order ID:- ${order.orderNumber}`,
            bold: true,
            size: 24, // 12pt
            font: 'Arial',
          }),
        ],
        spacing: { after: 60 },
      }),

      // Book ID & Qty line
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: bookLineText,
            bold: true,
            size: 24, // 12pt
            font: 'Arial',
          }),
        ],
        spacing: { after: 180 },
      }),

      // Address Header
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'Address:',
            bold: true,
            size: 22, // 11pt
            font: 'Arial',
          }),
        ],
        spacing: { after: 60 },
      }),

      // Customer Name
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: order.customerName,
            bold: true,
            size: 22, // 11pt
            font: 'Arial',
          }),
        ],
        spacing: { after: 40 },
      }),
    ];

    // Address line 1
    if (cleanAddress1) {
      cellParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: cleanAddress1,
              size: 21, // 10.5pt
              font: 'Arial',
            }),
          ],
          spacing: { after: 30 },
        })
      );
    }

    // Address line 2
    if (cleanAddress2) {
      cellParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: cleanAddress2,
              size: 21, // 10.5pt
              font: 'Arial',
            }),
          ],
          spacing: { after: 30 },
        })
      );
    }

    // City, Pincode & State
    if (cityLine) {
      cellParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: cityLine,
              bold: true,
              size: 22, // 11pt
              font: 'Arial',
            }),
          ],
          spacing: { after: 40 },
        })
      );
    }

    // Mobile Number
    cellParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Mobile No: ${order.phone}`,
            bold: true,
            size: 22, // 11pt
            font: 'Arial',
          }),
        ],
        spacing: { after: 120 },
      })
    );

    // Create the bordered box table (1 column, 1 row)
    const boxTable = new Table({
      alignment: AlignmentType.CENTER,
      width: {
        size: 7800, // ~5.4 inches width
        type: WidthType.DXA,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
                bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
                left: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
                right: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
              },
              margins: {
                top: 140,
                bottom: 140,
                left: 200,
                right: 200,
              },
              children: cellParagraphs,
            }),
          ],
        }),
      ],
    });

    children.push(boxTable);

    // After every 2 boxes, insert page break so 2 boxes print per A4 sheet
    if ((i + 1) % 2 === 0 && i < orders.length - 1) {
      children.push(
        new Paragraph({
          pageBreakBefore: true,
          spacing: { before: 0, after: 0 },
        })
      );
    } else if (i < orders.length - 1) {
      // Space between box 1 and box 2 on same page
      children.push(
        new Paragraph({
          spacing: { before: 180, after: 180 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
