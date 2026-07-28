export type BookSeries = 'Kali' | 'Savi' | 'Siri' | 'Tili';

export interface SamplePage {
  pageNumber: number;
  title: string;
  imageUrl: string;
  kannadaText: string;
  englishTranslation: string;
}

export interface BookProduct {
  id: string;
  title: string;
  slug: string;
  series: BookSeries;
  gradeClass: number; // 1, 2, 3, 4, 5
  price: number; // e.g. 280
  originalPrice?: number;
  badge?: string;
  description: string;
  features: string[];
  tableOfContents: string[];
  coverImage: string;
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

export interface TuitionCourse {
  id: string;
  slug: string;
  series: BookSeries;
  gradeClass: number;
  title: string;
  shortDescription: string;
  description: string;
  syllabus: string[];
  teacherName: string;
  teacherBio: string;
  teacherImage: string;
  schedule: string;
  platform: 'Google Meet' | 'Zoom';
  batchSize: number;
  slotsLeft: number;
  durationMonths: number;
  monthlyFee: number;
  termFee: number;
  linkedBookSlug: string;
  coverImage: string;
  badge?: string;
  highlights: string[];
}

export interface EnrollmentFormData {
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  courseId: string;
  gradeClass: string;
  batchPreference: 'Morning' | 'Evening' | 'Weekend';
  message: string;
}

