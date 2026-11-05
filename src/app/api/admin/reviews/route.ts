import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import {
  getAllReviewsForAdmin,
  updateReviewApproval,
  deleteReviewById,
} from '@/lib/reviewsStorage';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const reviews = await getAllReviewsForAdmin();
    return NextResponse.json({ success: true, reviews });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error loading reviews';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, is_approved } = body || {};

    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID is required.' }, { status: 400 });
    }

    if (typeof is_approved !== 'boolean') {
      return NextResponse.json({ success: false, error: 'is_approved boolean is required.' }, { status: 400 });
    }

    const updated = await updateReviewApproval(id, is_approved);
    return NextResponse.json({
      success: true,
      updated,
      message: is_approved ? 'Review approved and published live!' : 'Review unpublished and set to pending.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating review status';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body?.id;
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID is required.' }, { status: 400 });
    }

    await deleteReviewById(id);
    return NextResponse.json({ success: true, message: 'Review deleted successfully.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error deleting review';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

