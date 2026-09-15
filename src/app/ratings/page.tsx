"use client";

import { useState } from "react";
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Filter, TrendingUp, Award, Users, CheckCircle2, BarChart3, ChevronDown } from "lucide-react";

const MOCK_REVIEWS = [
  { id: 1, customer: "Rahul Mehta", worker: "Rajesh Kumar Singh", profession: "Electrician", rating: 5, date: "2026-09-14", text: "Excellent work! Rajesh arrived on time, diagnosed the issue quickly, and fixed our wiring problem efficiently. Very professional and knowledgeable.", service: "Electrical Wiring", helpful: 12 },
  { id: 2, customer: "Neha Gupta", worker: "Sunita Devi Sharma", profession: "Plumber", rating: 4, date: "2026-09-12", text: "Good service overall. Sunita fixed the leak in our bathroom pipe. Only minor issue was she arrived 15 minutes late, but the work quality was great.", service: "Pipe Repair", helpful: 8 },
  { id: 3, customer: "Arun Singh", worker: "Arjun Menon", profession: "Carpenter", rating: 5, date: "2026-09-10", text: "Arjun built custom kitchen cabinets for us and they look amazing! Perfect measurements, great finish, and very reasonable pricing.", service: "Kitchen Cabinets", helpful: 15 },
  { id: 4, customer: "Meera Nair", worker: "Priya Nair", profession: "Painter", rating: 5, date: "2026-09-08", text: "Our apartment looks brand new after Priya's interior painting work. Clean, precise, and exactly what we wanted. Highly recommended!", service: "Interior Painting", helpful: 10 },
  { id: 5, customer: "Vikash Kumar", worker: "Deepak Verma", profession: "Technician", rating: 4, date: "2026-09-06", text: "Deepak repaired our washing machine quickly. He had the right parts and tools. Fair pricing and good communication throughout.", service: "Washing Machine Repair", helpful: 6 },
  { id: 6, customer: "Shalini Verma", worker: "Meena Kumari", profession: "Domestic Help", rating: 5, date: "2026-09-04", text: "Meena has been helping us with household chores for a month now. Very reliable, thorough, and trustworthy. Our family loves her work.", service: "House Cleaning", helpful: 18 },
];

const RATING_DISTRIBUTION = [
  { stars: 5, count: 342, pct: 65 },
  { stars: 4, count: 124, pct: 24 },
  { stars: 3, count: 42, pct: 8 },
  { stars: 2, count: 12, pct: 2 },
  { stars: 1, count: 5, pct: 1 },
];

export default function RatingsPage() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [filterRating, setFilterRating] = useState(0);

  const filteredReviews = filterRating === 0 ? MOCK_REVIEWS : MOCK_REVIEWS.filter(r => r.rating === filterRating);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="py-12 sm:py-16 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-80 h-80 bg-accent-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-sm font-medium mb-6">
            <Star size={16} />
            Rating & Feedback
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4">
            Ratings & <span className="gradient-brand-text">Reviews</span>
          </h1>
          <p className="text-ink-secondary text-lg max-w-2xl mx-auto">
            Transparent feedback system helping customers choose reliable workers and workers improve their services. Every review matters.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Average Rating", value: "4.7★", icon: <Star size={20} />, color: "text-accent-orange" },
            { label: "Total Reviews", value: "525", icon: <MessageSquare size={20} />, color: "text-brand-400" },
            { label: "Satisfaction Rate", value: "98%", icon: <ThumbsUp size={20} />, color: "text-accent-green" },
            { label: "Workers Rated", value: "480+", icon: <Users size={20} />, color: "text-accent-blue" },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-card rounded-2xl border border-border p-4 text-center">
              <div className={`${stat.color} mb-2 flex justify-center`}>{stat.icon}</div>
              <div className="text-xl font-bold text-ink">{stat.value}</div>
              <div className="text-xs text-ink-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Rating Distribution + Write Review */}
          <div className="space-y-4">
            {/* Rating Distribution */}
            <div className="bg-surface-card rounded-2xl border border-border p-6">
              <h3 className="text-sm font-semibold text-ink mb-4">Rating Distribution</h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-ink">4.7</div>
                <div className="flex items-center justify-center gap-1 my-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={18} className={s <= 4 ? "text-accent-orange fill-accent-orange" : "text-accent-orange/50 fill-accent-orange/50"} />)}
                </div>
                <div className="text-xs text-ink-secondary">Based on 525 reviews</div>
              </div>
              <div className="space-y-2">
                {RATING_DISTRIBUTION.map((r) => (
                  <div key={r.stars} className="flex items-center gap-2">
                    <span className="text-xs text-ink-muted w-8">{r.stars}★</span>
                    <div className="flex-1 h-2 rounded-full bg-surface-muted overflow-hidden">
                      <div className="h-full rounded-full bg-accent-orange" style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="text-xs text-ink-muted w-8 text-right">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Button */}
            <div className="bg-surface-card rounded-2xl border border-border p-6">
              <h3 className="text-sm font-semibold text-ink mb-3">Share Your Experience</h3>
              <p className="text-xs text-ink-secondary mb-4">Your review helps other customers and workers in the cooperative network.</p>
              <button onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full px-4 py-3 rounded-xl gradient-brand text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90">
                <MessageSquare size={16} /> Write a Review
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-surface-card rounded-2xl border border-brand-400/30 p-6 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                <h3 className="text-sm font-semibold text-ink mb-4">New Review</h3>
                <div className="mb-4">
                  <label className="text-xs text-ink-secondary mb-2 block">Your Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setSelectedRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer">
                        <Star size={24} className={`${(hoverRating || selectedRating) >= s ? "text-accent-orange fill-accent-orange" : "text-ink-muted"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea placeholder="Share your experience with this worker..." rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-ink text-sm outline-none focus:border-brand-400 resize-none mb-3" />
                <button className="w-full px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold cursor-pointer hover:opacity-90">Submit Review</button>
              </div>
            )}
          </div>

          {/* Right: Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-ink-secondary">Filter:</span>
              {[0, 5, 4, 3, 2, 1].map(r => (
                <button key={r} onClick={() => setFilterRating(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${filterRating === r ? "gradient-brand text-white" : "bg-surface-card border border-border text-ink-secondary"}`}>
                  {r === 0 ? "All" : `${r}★`}
                </button>
              ))}
            </div>

            {/* Reviews */}
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-surface-card rounded-2xl border border-border p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white text-sm font-bold">
                      {review.customer.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{review.customer}</div>
                      <div className="text-xs text-ink-secondary">Review for {review.worker} ({review.profession})</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= review.rating ? "text-accent-orange fill-accent-orange" : "text-ink-muted"} />)}
                    </div>
                    <div className="text-xs text-ink-muted mt-0.5">{review.date}</div>
                  </div>
                </div>
                <p className="text-sm text-ink-secondary mb-3">{review.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-muted bg-surface-muted px-2 py-1 rounded-md">{review.service}</span>
                  <button className="flex items-center gap-1 text-xs text-ink-muted hover:text-brand-400 cursor-pointer">
                    <ThumbsUp size={12} /> Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
