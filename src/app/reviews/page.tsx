'use client';

import React, { useState } from 'react';
import { PARENT_REVIEWS } from '@/data/mockData';
import { ParentReview } from '@/types';
import { Star, CheckCircle, Quote, Send, ShieldCheck } from 'lucide-react';

export default function ReviewsPage() {
  const [reviewsList, setReviewsList] = useState<ParentReview[]>(PARENT_REVIEWS);
  const [formData, setFormData] = useState({
    parentName: '',
    location: '',
    childGrade: 'Class 4 Parent',
    rating: 5,
    reviewText: '',
    isHuman: false,
  });
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.isHuman) {
      alert('Please check the box to confirm you are human.');
      return;
    }

    const newReview: ParentReview = {
      id: `r-${Date.now()}`,
      parentName: formData.parentName,
      location: formData.location || 'Karnataka',
      childGrade: formData.childGrade,
      rating: formData.rating,
      reviewText: formData.reviewText,
      date: 'Just now',
      verifiedPurchase: true,
    };

    setReviewsList([newReview, ...reviewsList]);
    setSubmittedMessage(true);
    setFormData({
      parentName: '',
      location: '',
      childGrade: 'Class 4 Parent',
      rating: 5,
      reviewText: '',
      isHuman: false,
    });
  };

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Verified Community Feedback
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Parents <span className="text-amber-600">Feedback & Reviews</span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Read real stories from non-Kannadiga and native parents across Karnataka who use Belesu guidebooks to simplify daily study.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Reviews Stream (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Quote className="w-5 h-5 text-amber-500" /> Recent Testimonials ({reviewsList.length})
            </h3>

            {reviewsList.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">{review.date}</span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  "{review.reviewText}"
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                      {review.parentName}
                      <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    </h4>
                    <p className="text-[11px] text-slate-500">{review.childGrade} • {review.location}</p>
                  </div>
                  {review.bookTitle && (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full hidden sm:inline-block">
                      {review.bookTitle}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Review Submission Form (Right 5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-xl sticky top-28 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Your Feedback is Important</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Have you used Belesu books? Share your experience with other parents!
                </p>
              </div>

              {submittedMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Thank you! Your feedback has been published successfully.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Irin Gladia"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Karnataka"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">Child's Class</label>
                  <select
                    value={formData.childGrade}
                    onChange={(e) => setFormData({ ...formData, childGrade: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Class 1 Parent">Class 1 Parent</option>
                    <option value="Class 2 Parent">Class 2 Parent</option>
                    <option value="Class 3 Parent">Class 3 Parent</option>
                    <option value="Class 4 Parent">Class 4 Parent</option>
                    <option value="Class 5 Parent">Class 5 Parent</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Star Rating</label>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formData.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Review Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe how Belesu guidebooks helped your child with homework or exams..."
                    value={formData.reviewText}
                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="isHuman"
                    checked={formData.isHuman}
                    onChange={(e) => setFormData({ ...formData, isHuman: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="isHuman" className="text-slate-600 font-medium">
                    Check this box to confirm you are human.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" /> Submit Feedback
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
