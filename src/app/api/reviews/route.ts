import { NextResponse } from 'next/server';
import { getPublicApprovedReviews, submitParentReview } from '@/lib/reviewsStorage';

export async function GET() {
  try {
    const reviews = await getPublicApprovedReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching reviews';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parentName, location, childGrade, rating, reviewText, bookTitle, isHuman } = body || {};

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
      rating: Number(rating) || 5,
      reviewText,
      bookTitle,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your feedback has been submitted for review and will be published once approved by our team.',
      reviewId: review.id,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error saving review';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

