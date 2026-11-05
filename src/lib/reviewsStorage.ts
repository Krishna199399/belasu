import fs from 'fs';
import path from 'path';
import { createAdminClient } from '@/lib/supabase';
import { PARENT_REVIEWS } from '@/data/mockData';
import { ParentReview } from '@/types';

export interface StoredReview {
  id: string;
  parent_name: string;
  location: string;
  child_grade: string;
  rating: number;
  review_text: string;
  book_title?: string;
  is_approved: boolean;
  created_at: string;
}

const JSON_STORE_PATH = path.join(process.cwd(), 'src', 'data', 'parent_reviews.json');

function readJsonReviews(): StoredReview[] {
  try {
    if (!fs.existsSync(JSON_STORE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(JSON_STORE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[reviewsStorage] Error reading local JSON fallback:', err);
    return [];
  }
}

function writeJsonReviews(reviews: StoredReview[]): void {
  try {
    const dir = path.dirname(JSON_STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (err) {
    console.error('[reviewsStorage] Error writing local JSON fallback:', err);
  }
}

/**
 * Fetch all approved reviews for public display on /reviews.
 * Merges approved user-submitted reviews with baseline PARENT_REVIEWS.
 */
export async function getPublicApprovedReviews(): Promise<ParentReview[]> {
  const supabase = createAdminClient();
  let dbReviews: StoredReview[] = [];

  try {
    const { data, error } = await supabase
      .from('parent_reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      dbReviews = data;
    } else {
      // Fallback to local JSON store
      dbReviews = readJsonReviews().filter((r) => r.is_approved);
    }
  } catch {
    dbReviews = readJsonReviews().filter((r) => r.is_approved);
  }

  // Format database reviews into ParentReview UI shape
  const formattedUserReviews: ParentReview[] = dbReviews.map((r) => ({
    id: r.id,
    parentName: r.parent_name,
    location: r.location || 'Karnataka',
    childGrade: r.child_grade || 'Class 4 Parent',
    rating: r.rating || 5,
    reviewText: r.review_text,
    date: new Date(r.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    verifiedPurchase: true,
    bookTitle: r.book_title,
  }));

  // New approved user reviews appear first, followed by original baseline reviews
  return [...formattedUserReviews, ...PARENT_REVIEWS];
}

/**
 * Fetch all reviews (both pending and approved) for Admin review portal.
 */
export async function getAllReviewsForAdmin(): Promise<StoredReview[]> {
  const supabase = createAdminClient();
  try {
    const { data, error } = await supabase
      .from('parent_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    console.warn('[reviewsStorage] Supabase fetch failed, falling back to local JSON:', err);
  }

  return readJsonReviews();
}

/**
 * Submit a new review from a parent. Always stored with is_approved = false pending admin review.
 */
export async function submitParentReview(payload: {
  parentName: string;
  location?: string;
  childGrade?: string;
  rating: number;
  reviewText: string;
  bookTitle?: string;
}): Promise<StoredReview> {
  const supabase = createAdminClient();
  const id = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const newReview: StoredReview = {
    id,
    parent_name: payload.parentName.trim(),
    location: (payload.location || 'Karnataka').trim(),
    child_grade: (payload.childGrade || 'Class 4 Parent').trim(),
    rating: Math.min(5, Math.max(1, payload.rating || 5)),
    review_text: payload.reviewText.trim(),
    book_title: payload.bookTitle?.trim() || undefined,
    is_approved: false, // ALWAYS false until approved by admin
    created_at: now,
  };

  try {
    const { data, error } = await supabase
      .from('parent_reviews')
      .insert({
        id: newReview.id,
        parent_name: newReview.parent_name,
        location: newReview.location,
        child_grade: newReview.child_grade,
        rating: newReview.rating,
        review_text: newReview.review_text,
        book_title: newReview.book_title,
        is_approved: false,
      })
      .select()
      .maybeSingle();

    if (!error && data) {
      // Also sync to JSON store as backup
      const current = readJsonReviews();
      writeJsonReviews([newReview, ...current.filter((r) => r.id !== newReview.id)]);
      return data;
    }
  } catch (err) {
    console.warn('[reviewsStorage] Supabase insert failed, saving to local JSON:', err);
  }

  // Fallback to local JSON store
  const current = readJsonReviews();
  writeJsonReviews([newReview, ...current.filter((r) => r.id !== newReview.id)]);
  return newReview;
}

/**
 * Approve or unapprove a review by ID.
 */
export async function updateReviewApproval(id: string, is_approved: boolean): Promise<boolean> {
  const supabase = createAdminClient();
  let updatedInDb = false;

  try {
    const { error } = await supabase
      .from('parent_reviews')
      .update({ is_approved, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      updatedInDb = true;
    }
  } catch (err) {
    console.warn('[reviewsStorage] Supabase update failed:', err);
  }

  // Update in JSON store
  const current = readJsonReviews();
  const updated = current.map((r) => (r.id === id ? { ...r, is_approved } : r));
  writeJsonReviews(updated);

  return updatedInDb || current.some((r) => r.id === id);
}

/**
 * Delete a review by ID.
 */
export async function deleteReviewById(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  try {
    await supabase.from('parent_reviews').delete().eq('id', id);
  } catch (err) {
    console.warn('[reviewsStorage] Supabase delete failed:', err);
  }

  // Remove from JSON store
  const current = readJsonReviews();
  writeJsonReviews(current.filter((r) => r.id !== id));
  return true;
}

