'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Star,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

interface StoredReview {
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

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<StoredReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    setActionLoadingId(id);
    setMessage(null);
    const newStatus = !currentStatus;

    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_approved: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update review status.');
      }

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_approved: newStatus } : r))
      );

      setMessage({
        type: 'success',
        text: newStatus
          ? 'Review approved and published live to /reviews!'
          : 'Review unpublished and moved back to pending queue.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating review';
      setMessage({ type: 'error', text: msg });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;

    setActionLoadingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete review.');
      }

      setReviews((prev) => prev.filter((r) => r.id !== id));
      setMessage({ type: 'success', text: 'Review deleted successfully.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting review';
      setMessage({ type: 'error', text: msg });
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingCount = reviews.filter((r) => !r.is_approved).length;
  const approvedCount = reviews.filter((r) => r.is_approved).length;

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return !r.is_approved;
    if (filter === 'approved') return r.is_approved;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Parent Reviews & Feedback
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Moderate parent submissions, approve feedback to go live on /reviews, or manage existing testimonials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReviews}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 transition shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/reviews/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition shadow-xs"
          >
            <span>View Public /reviews</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-[11px] underline font-bold cursor-pointer opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Submissions
          </span>
          <span className="text-3xl font-black text-slate-900 tracking-tight mt-1 block">
            {reviews.length}
          </span>
          <span className="text-xs text-slate-500 font-medium mt-1 block">
            All user-submitted reviews
          </span>
        </div>

        <div className="bg-white border border-amber-200/90 rounded-2xl p-5 shadow-xs bg-gradient-to-br from-white to-amber-50/30">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Pending Approval
          </span>
          <span className="text-3xl font-black text-amber-600 tracking-tight mt-1 block">
            {pendingCount}
          </span>
          <span className="text-xs text-amber-700/80 font-medium mt-1 block">
            {pendingCount === 1 ? '1 review awaiting review' : `${pendingCount} reviews awaiting review`}
          </span>
        </div>

        <div className="bg-white border border-emerald-200/90 rounded-2xl p-5 shadow-xs bg-gradient-to-br from-white to-emerald-50/30">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved & Live
          </span>
          <span className="text-3xl font-black text-emerald-600 tracking-tight mt-1 block">
            {approvedCount}
          </span>
          <span className="text-xs text-emerald-700/80 font-medium mt-1 block">
            Currently visible to store visitors
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filter === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Pending Approval</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                filter === 'pending' ? 'bg-slate-950 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('approved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filter === 'approved'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Approved & Live</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                filter === 'approved' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All ({reviews.length})</span>
          </button>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading parent reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">
              {filter === 'pending'
                ? '🎉 Great job! No pending reviews to approve.'
                : filter === 'approved'
                ? 'No approved reviews yet.'
                : 'No reviews found.'}
            </p>
            <p className="text-xs text-slate-400">
              When parents submit feedback on /reviews, they will appear here for your moderation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((r) => {
              const isBusy = actionLoadingId === r.id;
              return (
                <div
                  key={r.id}
                  className={`p-4 sm:p-5 rounded-xl border transition ${
                    r.is_approved
                      ? 'bg-white border-slate-200'
                      : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{r.parent_name}</span>

                        <span className="text-xs text-slate-500">
                          • {r.child_grade} {r.location ? `• ${r.location}` : ''}
                        </span>

                        {r.is_approved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Live on /reviews
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" /> Pending Approval
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 py-0.5">
                        {Array.from({ length: r.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-xs font-semibold text-slate-400 ml-1.5">
                          {new Date(r.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-white/70 p-3 rounded-lg border border-slate-100 mt-2">
                        "{r.review_text}"
                      </p>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                      {r.is_approved ? (
                        <button
                          onClick={() => handleToggleApproval(r.id, r.is_approved)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Unpublish</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleApproval(r.id, r.is_approved)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-xs disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Make Live</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

