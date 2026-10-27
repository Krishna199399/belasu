export type BookSeries = 'Kali' | 'Savi' | 'Siri' | 'Tili' | 'Spoken';

export type SamplePageCategory = 'Index' | 'Poem' | 'Exercises' | 'Textbook';

export interface SamplePage {
  pageNumber: number;
  title: string;
  imageUrl: string;
  category?: SamplePageCategory;
  kannadaText?: string;
  englishTranslation?: string;
}

export interface BookProduct {
  id: string;
  title: string;
  slug: string;
  series: BookSeries;
  gradeClass: number; // 1, 2, 3, 4, 5
  sku: string; // NEW: "SK1", "SK2", etc. for order items
  price: number; // e.g. 280
  originalPrice?: number;
  badge?: string;
  description: string;
  features: string[];
  tableOfContents: string[];
  coverImage: string;
  karnatakaTextbookCover?: string;
  karnatakaTextbookPart2Cover?: string;
  samplePages: SamplePage[];
  inStock: boolean;
  stockQuantity: number;
  rating: number; // e.g. 4.9
  reviewCount: number;
}

export interface CartItem {
  product: BookProduct;
  quantity: number;
}

export interface ParentReview {
  id: string;
  parentName: string;
  location: string;
  childGrade: string;
  rating: number;
  reviewText: string;
  date: string;
  verifiedPurchase: boolean;
  bookTitle?: string;
  avatarUrl?: string;
}

export interface VideoReel {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  highlights: string[];
}

export interface OrderDetails {
  customerName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'UPI' | 'Card' | 'COD';
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

// ─── Digital Platform (Classes 6–10) ───────────────────────────────────────

export type DigitalSubject = 'Kannada';

export interface DigitalBookChapter {
  chapter: string;
  startPage: number;
}

export interface DigitalBook {
  id: string;
  slug: string;
  title: string;
  subject: DigitalSubject;
  gradeClass: number; // 6, 7, 8, 9, 10
  sku: string; // NEW: "SD6", "SD7", etc. for order items
  price: number;
  originalPrice?: number;
  coverImage: string;
  totalPages: number;
  description: string;
  features: string[];
  tableOfContents: DigitalBookChapter[];
  badge?: string;
  isFreePreviewPages: number; // how many pages are free (e.g. 5)
  rating: number;
  reviewCount: number;
  author: string;
  language: string; // 'English with Kannada' etc.
}

export interface DigitalOrder {
  id: string;
  userId: string;
  bookId: string;
  amount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  purchasedAt: string;
}

export interface ReadProgress {
  userId: string;
  bookId: string;
  lastPage: number;
  totalPages: number;
  updatedAt: string;
}

// ─── Enhanced User System with Address Management ──────────────────────────

export interface Address {
  id: string;
  userId: string;
  
  // Address details (matching old system structure)
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email?: string;
  
  // New features
  label?: string; // "Home", "Office", "Parents House", etc.
  isDefault: boolean;
  
  // Location data (optional)
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Usage tracking
  usageCount: number;
  lastUsedAt?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  email?: string;
  isAdmin?: boolean;
  
  // Address management
  addresses: Address[];
  defaultAddressId?: string;
  
  // Purchase tracking
  purchasedBooks: {
    physical: string[];   // Physical book IDs
    digital: string[];    // Digital book IDs
  };
  orders: string[];       // Order IDs
  
  // User preferences
  emailOptIn: boolean;
  smsOptIn: boolean;
  
  // Migration support
  legacyOrderEmails?: string[];  // For linking old orders
  legacyOrderPhones?: string[];
  
  // Analytics
  totalSpent: number;
  lastPurchaseDate?: string;
  
  createdAt: string;
  lastLoginAt: string;
}

// ─── Enhanced Order System (Backward Compatible) ────────────────────────────

export type OrderStatus = 
  | 'Pending' 
  | 'Processing' 
  | 'Completed' 
  | 'Cancelled' 
  | 'Refunded'
  | 'Shipped'
  | 'Delivered';

export type PaymentMethod = 
  | 'UPI' 
  | 'Card' 
  | 'NetBanking' 
  | 'PayU/Bc'
  | 'Credit Card/Debit Card/NetBanking';

export interface BillingInfo {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postcode: string;
  phone: string;
  email: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  
  // Product info (matching old system)
  itemSKU: string;              // "SK1", "SK2", etc.
  itemName: string;             // "Savi Kannada Class 1"
  quantity: number;
  itemCost: number;
  
  // New: Product type
  productType: 'physical' | 'digital';
  productId: string;
  
  // Product details (for display)
  product: BookProduct | DigitalBook;
  
  // Digital book specific
  digitalBookDelivered?: boolean;
  digitalBookDeliveredAt?: string;
  
  // Refund support (from old system)
  quantityRefunded?: number;
  
  // Shipping (from old system)
  shippingAmount: number;
  
  createdAt: string;
}

export interface Order {
  // Core fields (matching old system)
  id: string;
  orderNumber: string;          // "16131", "16164", etc.
  orderStatus: OrderStatus;
  orderDate: string;
  
  // User link (NEW - null for migrated old orders)
  userId?: string;
  
  // Billing info (preserved from old system)
  billing: BillingInfo;
  
  // Shipping info (can be different from billing)
  shippingAddressId?: string;   // FK to Address
  shipping: BillingInfo;
  
  // Payment (matching old system)
  paymentMethodTitle: PaymentMethod;
  paymentId?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  
  // Order items
  items: OrderItem[];
  itemsBreakdown: {
    physicalBooks: OrderItem[];
    digitalBooks: OrderItem[];
  };
  
  // Amounts (matching old system)
  orderSubtotalAmount: number;
  shippingMethodTitle: string;  // "Flat rate"
  orderShippingAmount: number;
  orderRefundAmount: number;
  orderTotalAmount: number;
  orderTotalTaxAmount: number;
  
  // Product type flags
  hasPhysicalProducts: boolean;
  hasDigitalProducts: boolean;
  
  // Tracking (NEW)
  trackingNumber?: string;
  
  // Timestamps
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

// ─── User Digital Library ───────────────────────────────────────────────────

export interface UserDigitalLibrary {
  id: string;
  userId: string;
  digitalBookId: string;
  
  // Purchase info
  orderId: string;
  orderItemId: string;
  purchasedAt: string;
  
  // Reading progress
  lastReadPage: number;
  totalPages: number;
  progressPercent: number;
  lastReadAt?: string;
  
  // Access control
  accessToken: string;
  expiresAt?: string;
}

// ─── Enhanced Cart System ───────────────────────────────────────────────────

export type ProductType = 'physical' | 'digital';

export interface EnhancedCartItem {
  product: BookProduct | DigitalBook;
  productType: ProductType;
  quantity: number;
}

// Keep old CartItem for backward compatibility
export interface CartItem {
  product: BookProduct;
  quantity: number;
}

// ─── Physical Inventory Management ──────────────────────────────────────────

export interface PhysicalBookInventory {
  bookId: string;
  sku: string;
  title: string;
  series: BookSeries;
  gradeClass: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isInStock: boolean;
  coverImage: string;
  price: number;
  originalPrice?: number;
  unitsSold: number;
  revenue: number;
  updatedAt?: string;
}

export interface InventoryLogItem {
  id: string;
  bookId: string;
  changeAmount: number;
  remainingStock: number;
  reason: string;
  createdAt: string;
  bookTitle?: string;
  sku?: string;
}

