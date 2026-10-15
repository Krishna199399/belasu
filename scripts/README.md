# Data Migration Scripts

This directory contains scripts for importing and migrating data from the old Belesu system.

## Excel Order Import

The `import-excel-data.ts` script imports historical order data from Excel files into the new database structure while maintaining backward compatibility.

### Prerequisites

Install the required dependencies:

```bash
npm install xlsx
npm install --save-dev @types/node ts-node
```

### Excel File Format

The script expects an Excel file with the following columns (matching your old database export):

- **Order Number** - Unique order identifier (e.g., "16131", "16164")
- **Order Status** - Order status (Pending, Processing, Completed, Cancelled, Refunded)
- **Order Date** - Order date
- **First Name (Billing)** - Customer first name
- **Last Name (Billing)** - Customer last name
- **Address 1 (Billing)** - Street address
- **Address 2 (Billing)** - Apartment/suite (optional)
- **City (Billing)** - City name
- **Postcode (Billing)** - Postal code
- **Email (Billing)** - Customer email
- **Phone (Billing)** - Customer phone number
- **Payment Method Title** - Payment method used
- **Order Subtotal Amount** - Subtotal amount
- **Shipping Method Title** - Shipping method
- **Order Shipping Amount** - Shipping cost
- **Order Refund Amount** - Refund amount (if any)
- **Order Total Amount** - Total order amount
- **Order Total Tax Amount** - Tax amount
- **Item (SKU)** - Product SKU (SK1, SK2, SD6-KN, etc.)
- **Item Name** - Product name
- **Quantity** - Quantity ordered
- **Item Cost** - Unit price

### Usage

#### 1. Dry Run (Validation Only)

Test the import without saving to database:

```bash
npx ts-node scripts/import-excel-data.ts path/to/orders.xlsx --dry-run --output output.json
```

This will:
- Parse and validate the Excel file
- Transform data to new format
- Save transformed data to `output.json`
- NOT save to database

#### 2. Full Import

Import data into the database:

```bash
npx ts-node scripts/import-excel-data.ts path/to/orders.xlsx
```

#### 3. Specify Sheet Name

If your Excel file has multiple sheets:

```bash
npx ts-node scripts/import-excel-data.ts path/to/orders.xlsx --sheet "Orders 2024"
```

#### 4. Match to Existing Users

Try to link historical orders to existing user accounts by phone/email:

```bash
npx ts-node scripts/import-excel-data.ts path/to/orders.xlsx --match-users
```

### Options

- `--dry-run` - Validate and transform data without saving to database
- `--sheet <name>` - Specify Excel sheet name (default: first sheet)
- `--output <path>` - Save transformed JSON to file
- `--match-users` - Try to match orders to existing users by phone/email

### SKU to Product Mapping

The script automatically maps SKUs to product IDs:

**Physical Books:**
- SK1 → Savi Class 1
- SK2 → Savi Class 2
- SK3 → Savi Class 3
- SK4 → Savi Class 4
- KK1 → Kali Class 1
- KK2 → Kali Class 2
- KK3 → Kali Class 3
- KK4 → Kali Class 4
- SR5 → Siri Class 5
- TL5 → Tili Class 5

**Digital Books:**
- SD6-KN → Digital Kannada Class 6
- SD6-SC → Digital Science Class 6
- SD7-KN → Digital Kannada Class 7
- SD7-MA → Digital Math Class 7
- ... and so on

### Output Format

The transformed JSON output will have this structure:

```json
{
  "orderNumber": "16131",
  "orderStatus": "Completed",
  "orderDate": "2024-01-15",
  "userId": null,
  "billing": {
    "firstName": "Priya",
    "lastName": "Kumar",
    "address1": "123 Main Street",
    "city": "Bengaluru",
    "postcode": "560001",
    "phone": "9876543210",
    "email": "priya@example.com"
  },
  "items": [
    {
      "itemSKU": "SK1",
      "itemName": "Savi Kannada Class 1",
      "quantity": 1,
      "itemCost": 250,
      "productType": "physical",
      "productId": "15926"
    }
  ],
  "orderTotalAmount": 290,
  "hasPhysicalProducts": true,
  "hasDigitalProducts": false
}
```

### Troubleshooting

**Error: Excel file not found**
- Check the file path is correct
- Use absolute path if relative path doesn't work

**Error: Sheet not found**
- Verify sheet name with `--sheet` option
- Check Excel file has data in the sheet

**Missing SKU mappings**
- Update `mapSkuToProductId()` function in script
- Add new SKU mappings as needed

**Database connection issues**
- Uncomment and configure database save logic
- Ensure database credentials are set in `.env.local`

### Next Steps After Import

1. Verify imported orders in database
2. Check user-order associations
3. Validate order totals match Excel
4. Test order display in user profiles
5. Verify digital book access for digital orders

### Notes

- Orders without matching users will have `userId: null`
- The script preserves all old database fields
- Multiple items per order are properly grouped
- SKU patterns determine product type automatically
- All amounts are parsed from various formats (₹, $, etc.)
