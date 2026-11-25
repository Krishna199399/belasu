import { NextResponse } from 'next/server';
import { getPublicApprovedReviews, submitParentReview } from '@/lib/reviewsStorage';
import { clientIp, hitRateLimit, tooManyRequests } from '@/lib/rateLimit';

export async function GET() {
  try {
    const reviews = await getPublicApprovedReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (err: unknown) {
    console.error('[reviews] fetch error:', err);
    return NextResponse.json({ success: false, error: 'Could not load reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const limit = hitRateLimit(`review:${clientIp(req.headers)}`, 5, 60 * 60 * 1000);
    if (!limit.ok) return tooManyRequests(limit.retryAfter, 'Too many reviews submitted. Please try again later.');

    const body = (await req.json()) || {};
    const cap = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : undefined);
    const isHuman = body.isHuman;
    const parentName = cap(body.parentName, 100);
    const location = cap(body.location, 100);
    const childGrade = cap(body.childGrade, 30);
    const reviewText = cap(body.reviewText, 3000);
    const bookTitle = cap(body.bookTitle, 200);
    const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 5)));

    if (!isHuman) {
      return NextResponse.json(
        { success: false, error: 'Please check the box confirming you are human.' },
        { status: 400 }
      );
    }

    if (!parentName || typeof parentName !== 'string' || !parentName.trim()) {
      return NextResponse.json({ success: false, error: 'Your name is required.' }, { status: 400 });
    }

    if (!reviewText || typeof reviewText !== 'string' || !reviewText.trim()) {
      return NextResponse.json({ success: false, error: 'Please enter your review experience.' }, { status: 400 });
    }

    const review = await submitParentReview({
      parentName,
      location,
      childGrade,
      rating,
      reviewText,
      bookTitle,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your feedback has been submitted for review and will be published once approved by our team.',
      reviewId: review.id,
    });
  } catch (err: unknown) {
    console.error('[reviews] submit error:', err);
    return NextResponse.json({ success: false, error: 'Could not save your review. Please try again.' }, { status: 500 });
  }
}

