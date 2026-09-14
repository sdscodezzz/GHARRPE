"use client";

import { useState, useMemo, useCallback } from "react";
import {
  MapPin, Calendar, CheckCircle, Shield, ArrowLeft,
  Clock, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import Badge from "@/components/Badge";
import RatingStars from "@/components/RatingStars";
import { workers, serviceCategories, cooperatives, type Worker, reviews } from "@/data/workers";
import { Reveal, StaggerReveal } from "@/hooks/useScrollReveal";

// ── Booking Helpers ──

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(date: Date): string {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function getStoredBookings(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("gharpe_bookings") || "{}");
  } catch { return {}; }
}

function storeBooking(dateStr: string, slot: string) {
  const all = getStoredBookings();
  if (!all[dateStr]) all[dateStr] = [];
  if (!all[dateStr].includes(slot)) all[dateStr].push(slot);
  localStorage.setItem("gharpe_bookings", JSON.stringify(all));
}

// ── Booking Modal ──

function BookingModal({
  worker, onClose,
}: { worker: Worker; onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const cat = serviceCategories.find((c) => c.id === worker.category);
  const coop = cooperatives.find((c) => c.id === worker.cooperativeId);

  // Generate 30 days of calendar
  const calendarDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    return days;
  }, [calendarMonth]);

  const isDateDisabled = useCallback((date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    if (date < today || date > maxDate) return true;
    return !worker.availability.workingDays.includes(date.getDay());
  }, [worker.availability.workingDays]);

  // Merge stored bookings with worker's static bookedSlots
  const getBookedSlots = useCallback((dateStr: string): string[] => {
    const stored = getStoredBookings();
    const staticBooked = worker.availability.bookedSlots[dateStr] || [];
    const dynamicBooked = stored[dateStr] || [];
    return [...new Set([...staticBooked, ...dynamicBooked])];
  }, [worker.availability.bookedSlots]);

  const isSlotBooked = useCallback((dateStr: string, slot: string): boolean => {
    return getBookedSlots(dateStr).includes(slot);
  }, [getBookedSlots]);

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot) return;
    const dateStr = formatDate(selectedDate);
    storeBooking(dateStr, selectedSlot);
    setConfirmed(true);
  };

  // ── Success Screen ──
  if (confirmed && selectedDate && selectedSlot) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-surface-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-accent-green/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-accent-green" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">Booking Confirmed!</h3>
            <p className="text-sm text-ink-secondary mb-6">Your service has been booked successfully.</p>
            <div className="bg-surface-alt rounded-xl p-4 text-left space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-brand-300">{worker.avatarInitials}</span>
                </div>
                <div>
                  <div className="font-semibold text-ink text-sm">{worker.name}</div>
                  <div className="text-xs text-ink-muted">{cat?.label}</div>
                </div>
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Date</span>
                  <span className="text-ink font-medium">{formatDisplayDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Time</span>
                  <span className="text-ink font-medium">{selectedSlot}</span>
                </div>
                {note && (
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-muted">Note</span>
                    <span className="text-ink font-medium text-right max-w-[200px] truncate">{note}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Starting Price</span>
                  <span className="text-ink font-bold">₹{worker.startingPrice}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-full px-4 py-3 rounded-xl gradient-brand text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all cursor-pointer">
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Booking Form ──
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface-card rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-brand-300">{worker.avatarInitials}</span>
            </div>
            <div>
              <div className="font-semibold text-ink text-sm">{worker.name}</div>
              <div className="text-xs text-ink-muted flex items-center gap-2">
                {cat?.label}
                {coop && <span className="flex items-center gap-0.5"><Shield size={10} className="text-brand-400" />{coop.name}</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-white/10 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Worker Info */}
          <div className="flex items-center justify-between">
            <RatingStars rating={worker.rating} size={14} showValue />
            <span className="text-xs text-ink-muted">{worker.reviewCount} reviews</span>
          </div>

          {/* Calendar */}
          <div>
            <h4 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2"><Calendar size={14} /> Select a Date</h4>
            <div className="bg-surface-alt rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-white/5 transition-colors cursor-pointer"><ChevronLeft size={16} /></button>
                <span className="text-sm font-semibold text-ink">{MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}</span>
                <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-white/5 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} className="text-center text-xs text-ink-muted font-medium py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, i) => {
                  if (!date) return <div key={`empty-${i}`} />;
                  const disabled = isDateDisabled(date);
                  const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);
                  const isToday = formatDate(date) === formatDate(new Date());
                  return (
                    <button
                      key={i}
                      disabled={disabled}
                      onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                      className={`h-9 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        disabled
                          ? "text-ink-muted/30 cursor-not-allowed"
                          : isSelected
                            ? "bg-brand-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                            : isToday
                              ? "bg-brand-500/15 text-brand-300 hover:bg-brand-500/25"
                              : "text-ink hover:bg-white/10"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <h4 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2"><Clock size={14} /> Select a Time Slot</h4>
              <div className="grid grid-cols-3 gap-2">
                {worker.availability.slots.map((slot) => {
                  const dateStr = formatDate(selectedDate);
                  const booked = isSlotBooked(dateStr, slot);
                  const isSelected = selectedSlot === slot;
                  const displayTime = (() => {
                    const [h, m] = slot.split(":");
                    const hour = parseInt(h);
                    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
                  })();
                  return (
                    <button
                      key={slot}
                      disabled={booked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        booked
                          ? "bg-white/3 text-ink-muted/40 border-border cursor-not-allowed line-through"
                          : isSelected
                            ? "bg-brand-500 text-white border-brand-500 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                            : "bg-surface-alt text-ink-secondary border-border hover:border-brand-500/40 hover:text-ink"
                      }`}
                    >
                      {displayTime}
                      {booked && <span className="block text-[10px] font-normal mt-0.5 opacity-60">Booked</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <h4 className="text-sm font-semibold text-ink mb-2">Describe Your Work <span className="text-ink-muted font-normal">(optional)</span></h4>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="E.g. Need wiring for 2 new ceiling fans in the living room..."
              rows={3}
              maxLength={300}
              className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand-500/50 resize-none transition-colors"
            />
            <div className="text-right text-xs text-ink-muted mt-1">{note.length}/300</div>
          </div>

          {/* Price & Confirm */}
          <div className="bg-surface-alt rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-ink-muted">Starting price</div>
              <div className="text-xl font-bold text-ink">₹{worker.startingPrice}</div>
            </div>
            <button
              disabled={!selectedDate || !selectedSlot}
              onClick={handleConfirm}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer min-h-[44px] ${
                selectedDate && selectedSlot
                  ? "gradient-brand text-white hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                  : "bg-white/5 text-ink-muted/50 cursor-not-allowed"
              }`}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Worker Card ──

function WorkerCard({ worker, onView, onBook }: { worker: Worker; onView: (w: Worker) => void; onBook: (w: Worker) => void }) {
  const coop = cooperatives.find((c) => c.id === worker.cooperativeId);
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-5 hover:border-brand-500/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.06)] transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-brand-300">{worker.avatarInitials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => onView(worker)} className="font-semibold text-ink hover:text-brand-400 transition-colors cursor-pointer text-left">{worker.name}</button>
            {worker.verified && <Badge variant="verified" icon>Verified</Badge>}
          </div>
          <div className="text-sm text-ink-secondary mt-0.5">{serviceCategories.find((c) => c.id === worker.category)?.label}</div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-muted">
            <span className="flex items-center gap-1"><MapPin size={12} />{worker.location}</span>
            <span>{worker.yearsExperience} yrs exp</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold text-ink">₹{worker.startingPrice}</div>
          <div className="text-xs text-ink-muted">starting</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {worker.skills.slice(0, 3).map((s) => (
          <span key={s} className="px-2 py-0.5 text-xs bg-brand-500/10 rounded-full text-ink-secondary border border-brand-500/15">{s}</span>
        ))}
        {worker.skills.length > 3 && <span className="px-2 py-0.5 text-xs bg-white/5 rounded-full text-ink-muted">+{worker.skills.length - 3}</span>}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          {coop && <span className="text-xs text-ink-muted flex items-center gap-1"><Shield size={12} className="text-brand-400" />{coop.name}</span>}
        </div>
        <div className="flex items-center gap-2">
          <RatingStars rating={worker.rating} size={12} />
          <span className="text-xs text-ink-muted">({worker.reviewCount})</span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onBook(worker)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 gradient-brand text-white hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] cursor-pointer min-h-[36px]"
        >
          <Calendar size={14} /> Book Now
        </button>
        <button className="px-3.5 py-2 text-xs font-semibold rounded-xl text-ink-secondary hover:text-ink hover:bg-white/5 transition-all duration-200 cursor-pointer" onClick={() => onView(worker)}>View Profile</button>
      </div>
    </div>
  );
}

// ── Worker Profile ──

function WorkerProfile({ worker, onBack, onBook }: { worker: Worker; onBack: () => void; onBook: (w: Worker) => void }) {
  const coop = cooperatives.find((c) => c.id === worker.cooperativeId);
  const workerReviews = reviews.filter((r) => r.workerId === worker.id);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-ink-secondary hover:text-ink transition-colors cursor-pointer"><ArrowLeft size={18} /> Back to results</button>
      <div className="bg-surface-card border border-border rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-brand-300">{worker.avatarInitials}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-2xl font-bold text-ink">{worker.name}</h2>
              {worker.verified && <Badge variant="verified" icon>Verified</Badge>}
            </div>
            <p className="text-ink-secondary mb-2">{serviceCategories.find((c) => c.id === worker.category)?.label}</p>
            <div className="flex items-center gap-4 text-sm text-ink-muted mb-3 flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={14} />{worker.location}</span>
              <span>{worker.yearsExperience} years experience</span>
              {worker.emergencyAvailable && <Badge variant="warning" icon><Clock size={12} /> Emergency Available</Badge>}
            </div>
            <RatingStars rating={worker.rating} size={16} showValue />
            <span className="text-sm text-ink-muted ml-1">({worker.reviewCount} reviews)</span>
            {coop && <div className="mt-2 text-sm text-ink-muted flex items-center gap-1"><Shield size={14} className="text-brand-400" /> {coop.name}</div>}
          </div>
          <div className="md:text-right shrink-0">
            <div className="text-3xl font-bold text-ink">₹{worker.startingPrice}</div>
            <div className="text-sm text-ink-muted mb-3">starting price</div>
            <button
              onClick={() => onBook(worker)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 gradient-brand text-white glow-purple-strong hover:shadow-[0_0_50px_rgba(124,58,237,0.4)] cursor-pointer min-h-[48px]"
            >
              <Calendar size={18} /> Book Now
            </button>
          </div>
        </div>
      </div>
      <div className="bg-surface-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-ink mb-3">About</h3>
        <p className="text-sm text-ink-secondary leading-relaxed">{worker.bio}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-ink mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((s) => <span key={s} className="px-3 py-1.5 text-sm bg-brand-500/10 text-brand-300 rounded-lg border border-brand-500/15">{s}</span>)}
          </div>
        </div>
        <div className="bg-surface-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-ink mb-3">Certifications</h3>
          <ul className="space-y-2">
            {worker.certifications.map((c) => <li key={c} className="flex items-center gap-2 text-sm text-ink-secondary"><CheckCircle size={14} className="text-accent-green shrink-0" /> {c}</li>)}
          </ul>
        </div>
      </div>
      <div className="bg-surface-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-ink mb-3">Availability</h3>
        <div className="flex flex-wrap gap-2">
          {worker.availableDays.map((d) => <span key={d} className="px-3 py-1.5 text-sm bg-accent-green/10 text-accent-green rounded-lg border border-accent-green/20">{d}</span>)}
        </div>
      </div>
      {workerReviews.length > 0 && (
        <div className="bg-surface-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-ink mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {workerReviews.map((rev) => (
              <div key={rev.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-ink text-sm">{rev.author}</span>
                  <RatingStars rating={rev.rating} size={12} />
                </div>
                <p className="text-sm text-ink-secondary">{rev.text}</p>
                <span className="text-xs text-ink-muted mt-1 block">{rev.location} · {rev.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──

export default function ServicesPage() {
  const [viewingWorker, setViewingWorker] = useState<Worker | null>(null);
  const [bookingWorker, setBookingWorker] = useState<Worker | null>(null);

  if (viewingWorker) {
    return (
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <WorkerProfile worker={viewingWorker} onBack={() => setViewingWorker(null)} onBook={(w) => { setViewingWorker(null); setBookingWorker(w); }} />
        </div>
        {bookingWorker && <BookingModal worker={bookingWorker} onClose={() => setBookingWorker(null)} />}
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden py-10 md:py-14">
        <div className="absolute inset-0 bg-[#08090D]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-ink">Find a Verified Worker</h1>
          <p className="text-ink-secondary max-w-xl">Browse cooperative-verified professionals for all your household and institutional needs.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-alt to-transparent" />
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-ink-secondary"><strong className="text-ink">{workers.length}</strong> verified workers available</p>
          </div>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((w) => <WorkerCard key={w.id} worker={w} onView={(worker) => setViewingWorker(worker)} onBook={(worker) => setBookingWorker(worker)} />)}
          </StaggerReveal>
        </div>
      </section>

      {bookingWorker && <BookingModal worker={bookingWorker} onClose={() => setBookingWorker(null)} />}
    </>
  );
}
