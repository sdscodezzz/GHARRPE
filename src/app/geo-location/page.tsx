"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Search, Filter, Star, Phone, ChevronRight, Locate, Layers, ZoomIn, ZoomOut } from "lucide-react";

const MOCK_WORKERS = [
  { id: 1, name: "Rajesh Kumar Singh", profession: "Electrician", rating: 4.8, reviews: 142, distance: 1.2, lat: 19.0760, lng: 72.8777, verified: true, price: 350, cooperative: "Mumbai Labour Cooperative Federation", skills: ["Wiring", "Inverter Setup", "MCB Replacement"] },
  { id: 2, name: "Sunita Devi Sharma", profession: "Plumber", rating: 4.6, reviews: 98, distance: 2.5, lat: 19.0780, lng: 72.8800, verified: true, price: 300, cooperative: "Delhi Workers Cooperative Society", skills: ["Pipe Fitting", "Leak Repair", "Bathroom Renovation"] },
  { id: 3, name: "Arjun Menon", profession: "Carpenter", rating: 4.9, reviews: 76, distance: 3.1, lat: 19.0745, lng: 72.8750, verified: true, price: 500, cooperative: "Bangalore Urban Cooperative Federation", skills: ["Furniture Making", "Kitchen Cabinets", "Door Installation"] },
  { id: 4, name: "Priya Nair", profession: "Painter", rating: 4.7, reviews: 113, distance: 1.8, lat: 19.0770, lng: 72.8790, verified: true, price: 280, cooperative: "Pune Labour Cooperative Society", skills: ["Interior Painting", "Exterior Painting", "Texture Work"] },
  { id: 5, name: "Meena Kumari", profession: "Domestic Help", rating: 4.5, reviews: 201, distance: 0.8, lat: 19.0755, lng: 72.8765, verified: true, price: 250, cooperative: "Mumbai Labour Cooperative Federation", skills: ["Cooking", "Laundry", "House Cleaning"] },
  { id: 6, name: "Anand Rajan", profession: "Caregiver", rating: 4.8, reviews: 67, distance: 4.2, lat: 19.0790, lng: 72.8810, verified: true, price: 600, cooperative: "Chennai Workers Federation", skills: ["Elderly Care", "Patient Handling", "Physiotherapy Support"] },
  { id: 7, name: "Vikram Patel", profession: "Driver", rating: 4.4, reviews: 189, distance: 2.9, lat: 19.0735, lng: 72.8740, verified: true, price: 200, cooperative: "Hyderabad Labour Cooperative", skills: ["Personal Driving", "Long Distance", "Office Commute"] },
  { id: 8, name: "Lakshmi Iyer", profession: "Gardener", rating: 4.6, reviews: 54, distance: 5.1, lat: 19.0800, lng: 72.8820, verified: true, price: 350, cooperative: "Bangalore Urban Cooperative Federation", skills: ["Lawn Maintenance", "Landscaping", "Plant Care"] },
];

const PROFESSIONS = ["All", "Electrician", "Plumber", "Carpenter", "Painter", "Domestic Help", "Caregiver", "Driver", "Gardener", "Cleaner", "Technician"];

export default function GeoLocationPage() {
  const [selectedWorker, setSelectedWorker] = useState<typeof MOCK_WORKERS[0] | null>(null);
  const [selectedProfession, setSelectedProfession] = useState("All");
  const [searchRadius, setSearchRadius] = useState(5);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [isLocating, setIsLocating] = useState(false);

  const filteredWorkers = MOCK_WORKERS.filter(
    (w) => (selectedProfession === "All" || w.profession === selectedProfession) && w.distance <= searchRadius
  );

  const handleUseLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
        },
        () => {
          setUserLocation({ lat: 19.0760, lng: 72.8777 });
          setIsLocating(false);
        }
      );
    } else {
      setUserLocation({ lat: 19.0760, lng: 72.8777 });
      setIsLocating(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="relative py-12 sm:py-16 bg-surface overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
            <MapPin size={16} />
            Geo-Spatial Technology
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4">
            Find Workers <span className="gradient-brand-text">Near You</span>
          </h1>
          <p className="text-ink-secondary text-lg max-w-2xl mx-auto mb-8">
            Our geo-location matching system connects you with verified cooperative workers in your area. Real-time proximity matching ensures quick, reliable service.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={handleUseLocation} disabled={isLocating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
              <Locate size={18} />
              {isLocating ? "Detecting..." : "Use My Location"}
            </button>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-card border border-border">
              <Search size={16} className="text-ink-muted" />
              <input type="text" placeholder="Search by area or pincode..." className="bg-transparent outline-none text-ink text-sm w-48" />
            </div>
          </div>
        </div>
      </section>

      {/* Map + Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-3 bg-surface-card rounded-2xl border border-border overflow-hidden relative" style={{ minHeight: "500px" }}>
            {/* Simulated Map */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 via-slate-900/30 to-slate-800/20 dark:from-slate-900/40 dark:via-slate-800/50 dark:to-slate-900/40">
              {/* Grid lines simulating map */}
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ink-muted" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Road lines */}
              <div className="absolute top-1/3 left-0 right-0 h-px bg-ink-muted/20" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-ink-muted/20" />
              <div className="absolute top-0 bottom-0 left-1/3 w-px bg-ink-muted/20" />
              <div className="absolute top-0 bottom-0 left-2/3 w-px bg-ink-muted/20" />
              <div className="absolute top-1/4 left-1/4 right-1/2 h-px bg-ink-muted/10 rotate-12" />

              {/* Worker pins */}
              {filteredWorkers.map((worker, i) => {
                const positions = [
                  { top: "25%", left: "30%" }, { top: "35%", left: "55%" }, { top: "45%", left: "20%" },
                  { top: "30%", left: "70%" }, { top: "55%", left: "45%" }, { top: "60%", left: "65%" },
                  { top: "40%", left: "40%" }, { top: "50%", left: "75%" },
                ];
                const pos = positions[i % positions.length];
                return (
                  <button key={worker.id} onClick={() => setSelectedWorker(worker)}
                    className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 hover:scale-125 z-10 cursor-pointer ${selectedWorker?.id === worker.id ? "scale-125 z-20" : ""}`}
                    style={{ top: pos.top, left: pos.left }}>
                    <div className={`flex flex-col items-center ${selectedWorker?.id === worker.id ? "" : ""}`}>
                      <div className={`px-2 py-1 rounded-lg text-xs font-bold text-white mb-1 whitespace-nowrap ${selectedWorker?.id === worker.id ? "gradient-brand" : "bg-brand-600"}`}>
                        ₹{worker.price}
                      </div>
                      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${selectedWorker?.id === worker.id ? "bg-accent-green" : "bg-brand-400"}`} />
                    </div>
                  </button>
                );
              })}

              {/* User location */}
              {userLocation && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-accent-blue border-2 border-white shadow-lg" />
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-accent-blue/30 animate-ping" />
                  </div>
                </div>
              )}
            </div>

            {/* Map controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              <button onClick={() => setMapZoom(Math.min(mapZoom + 0.2, 3))}
                className="w-10 h-10 rounded-xl bg-surface-card border border-border flex items-center justify-center text-ink-secondary hover:text-ink transition-colors cursor-pointer">
                <ZoomIn size={18} />
              </button>
              <button onClick={() => setMapZoom(Math.max(mapZoom - 0.2, 0.5))}
                className="w-10 h-10 rounded-xl bg-surface-card border border-border flex items-center justify-center text-ink-secondary hover:text-ink transition-colors cursor-pointer">
                <ZoomOut size={18} />
              </button>
              <button className="w-10 h-10 rounded-xl bg-surface-card border border-border flex items-center justify-center text-ink-secondary hover:text-ink transition-colors cursor-pointer">
                <Layers size={18} />
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-surface-card/90 backdrop-blur-sm border border-border rounded-xl p-3 z-20">
              <div className="text-xs font-medium text-ink mb-2">Legend</div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-400" />
                <span className="text-xs text-ink-secondary">Worker</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-green" />
                <span className="text-xs text-ink-secondary">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
                <span className="text-xs text-ink-secondary">Your Location</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="bg-surface-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-brand-400" />
                <span className="text-sm font-semibold text-ink">Filter by Profession</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PROFESSIONS.map((p) => (
                  <button key={p} onClick={() => setSelectedProfession(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${selectedProfession === p ? "gradient-brand text-white" : "bg-surface-muted text-ink-secondary hover:text-ink"}`}>
                    {p}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ink-secondary">Search Radius</span>
                  <span className="text-xs font-medium text-brand-400">{searchRadius} km</span>
                </div>
                <input type="range" min="1" max="25" value={searchRadius} onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full bg-surface-muted appearance-none cursor-pointer accent-[#7C3AED]" />
              </div>
            </div>

            {/* Worker List */}
            <div className="bg-surface-card rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-ink">{filteredWorkers.length} Workers Found</span>
                <span className="text-xs text-ink-muted">Within {searchRadius} km</span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredWorkers.map((worker) => (
                  <button key={worker.id} onClick={() => setSelectedWorker(worker)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${selectedWorker?.id === worker.id ? "border-brand-400 bg-brand-500/10" : "border-border hover:border-border-hover bg-surface"}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {worker.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-ink truncate">{worker.name}</span>
                          {worker.verified && <span className="text-accent-green text-xs">✓</span>}
                        </div>
                        <div className="text-xs text-brand-400">{worker.profession}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-ink-secondary">
                            <Star size={10} className="text-accent-orange fill-accent-orange" /> {worker.rating}
                          </span>
                          <span className="text-xs text-ink-muted">{worker.distance} km</span>
                          <span className="text-xs font-medium text-ink">₹{worker.price}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-ink-muted shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Worker Detail */}
            {selectedWorker && (
              <div className="bg-surface-card rounded-2xl border border-brand-400/30 p-4 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white font-bold">
                    {selectedWorker.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{selectedWorker.name}</div>
                    <div className="text-xs text-brand-400">{selectedWorker.profession}</div>
                    <div className="text-xs text-ink-muted">{selectedWorker.cooperative}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedWorker.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 text-xs">{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mb-3 text-xs text-ink-secondary">
                  <span className="flex items-center gap-1"><Star size={12} className="text-accent-orange fill-accent-orange" /> {selectedWorker.rating} ({selectedWorker.reviews})</span>
                  <span className="flex items-center gap-1"><Navigation size={12} /> {selectedWorker.distance} km away</span>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:+919876543210`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    <Phone size={14} /> Contact
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ink text-center mb-8">How Geo-Matching Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Locate size={24} />, title: "Detect Location", desc: "Allow browser geolocation or enter your area manually." },
              { icon: <Search size={24} />, title: "Find Workers", desc: "Our system matches verified workers near you in real-time." },
              { icon: <Star size={24} />, title: "Compare & Choose", desc: "View ratings, skills, experience, and pricing side by side." },
              { icon: <Phone size={24} />, title: "Book & Connect", desc: "Contact the worker directly or book through the platform." },
            ].map((step, i) => (
              <div key={i} className="bg-surface-card rounded-2xl border border-border p-6 text-center">
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white mx-auto mb-3">{step.icon}</div>
                <div className="text-sm font-semibold text-ink mb-1">{step.title}</div>
                <div className="text-xs text-ink-secondary">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
