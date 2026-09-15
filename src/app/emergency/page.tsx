"use client";

import { useState, useEffect } from "react";
import { Zap, Clock, MapPin, Phone, Star, CheckCircle2, AlertTriangle, Siren, Shield, Users, Truck, Thermometer, Droplets, Wrench } from "lucide-react";

const EMERGENCY_SERVICES = [
  { icon: <Zap size={24} />, title: "Electrical Emergency", desc: "Power outage, short circuit, sparking, or electrical hazards", avgTime: "30 min", workers: 3, color: "from-yellow-500 to-orange-500" },
  { icon: <Droplets size={24} />, title: "Plumbing Emergency", desc: "Burst pipe, major leak, flooding, or sewer backup", avgTime: "25 min", workers: 4, color: "from-blue-500 to-cyan-500" },
  { icon: <Thermometer size={24} />, title: "AC/Heating Failure", desc: "Complete AC breakdown during extreme weather", avgTime: "45 min", workers: 2, color: "from-red-500 to-pink-500" },
  { icon: <Wrench size={24} />, title: "Lockout/Key Issue", desc: "Locked out of home, broken lock, or security concern", avgTime: "20 min", workers: 5, color: "from-purple-500 to-violet-500" },
];

const NEARBY_WORKERS = [
  { name: "Rajesh Kumar Singh", profession: "Electrician", distance: 1.2, eta: "15 min", rating: 4.8, available: true },
  { name: "Sunita Devi Sharma", profession: "Plumber", distance: 2.5, eta: "20 min", rating: 4.6, available: true },
  { name: "Deepak Verma", profession: "Technician", distance: 3.1, eta: "25 min", rating: 4.7, available: true },
  { name: "Mohammed Farhan", profession: "Cleaner", distance: 1.8, eta: "18 min", rating: 4.5, available: false },
];

export default function EmergencyPage() {
  const [selectedService, setSelectedService] = useState<typeof EMERGENCY_SERVICES[0] | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleEmergencyRequest = () => {
    setIsRequesting(true);
    setCountdown(30);
    setTimeout(() => {
      setIsRequesting(false);
      setRequestSent(true);
    }, 3000);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="py-12 sm:py-16 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-80 h-80 bg-accent-pink/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-accent-orange/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-sm font-medium mb-6">
            <Siren size={16} />
            Emergency Services
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4">
            <span className="text-accent-pink">Emergency</span> & On-Demand
          </h1>
          <p className="text-ink-secondary text-lg max-w-2xl mx-auto mb-6">
            Urgent home emergency? Get verified workers dispatched immediately. Available 24/7 with real-time ETA tracking.
          </p>
          <a href="tel:8017273136" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent-pink text-white font-bold text-lg hover:opacity-90 transition-opacity">
            <Phone size={20} />
            Call Emergency Line: 8017273136
          </a>
        </div>
      </section>

      {/* Emergency Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-ink mb-6">Select Emergency Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {EMERGENCY_SERVICES.map((service, i) => (
            <button key={i} onClick={() => setSelectedService(service)}
              className={`text-left bg-surface-card rounded-2xl border p-6 transition-all cursor-pointer ${selectedService === service ? "border-accent-pink ring-2 ring-accent-pink/20" : "border-border hover:border-border-hover"}`}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-4`}>{service.icon}</div>
              <h3 className="text-sm font-semibold text-ink mb-1">{service.title}</h3>
              <p className="text-xs text-ink-secondary mb-3">{service.desc}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-accent-green"><Clock size={10} /> {service.avgTime}</span>
                <span className="flex items-center gap-1 text-brand-400"><Users size={10} /> {service.workers} nearby</span>
              </div>
            </button>
          ))}
        </div>

        {/* Request Button */}
        {selectedService && !requestSent && (
          <div className="bg-surface-card rounded-2xl border border-accent-pink/30 p-6 text-center animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
            <h3 className="text-lg font-bold text-ink mb-2">Request {selectedService.title}</h3>
            <p className="text-sm text-ink-secondary mb-4">A verified worker will be dispatched to your location immediately.</p>
            <button onClick={handleEmergencyRequest} disabled={isRequesting}
              className="px-8 py-3 rounded-xl bg-accent-pink text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
              {isRequesting ? `Finding Worker... ${countdown}s` : "Send Emergency Request"}
            </button>
          </div>
        )}

        {requestSent && (
          <div className="bg-surface-card rounded-2xl border border-accent-green/30 p-6 text-center animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
            <CheckCircle2 size={48} className="text-accent-green mx-auto mb-3" />
            <h3 className="text-lg font-bold text-ink mb-2">Worker Dispatched!</h3>
            <p className="text-sm text-ink-secondary mb-4">Rajesh Kumar Singh (Electrician) is on the way. ETA: 15 minutes.</p>
            <div className="flex justify-center gap-3">
              <a href="tel:8017273136" className="px-4 py-2 rounded-xl gradient-brand text-white text-sm font-semibold flex items-center gap-2">
                <Phone size={14} /> Call Worker
              </a>
              <button onClick={() => { setRequestSent(false); setSelectedService(null); }} className="px-4 py-2 rounded-xl border border-border text-ink text-sm font-medium cursor-pointer">
                New Request
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Nearby Available Workers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-ink mb-6">Nearby Available Workers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NEARBY_WORKERS.map((worker, i) => (
            <div key={i} className="bg-surface-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white text-sm font-bold">
                  {worker.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{worker.name}</div>
                  <div className="text-xs text-brand-400">{worker.profession}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-ink-secondary mb-3">
                <span className="flex items-center gap-1"><MapPin size={10} /> {worker.distance} km</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {worker.eta}</span>
                <span className="flex items-center gap-1"><Star size={10} className="text-accent-orange fill-accent-orange" /> {worker.rating}</span>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center ${worker.available ? "bg-accent-green/10 text-accent-green" : "bg-surface-muted text-ink-muted"}`}>
                {worker.available ? "Available Now" : "Currently Busy"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-12 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ink text-center mb-8">Emergency Safety Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Shield size={24} />, title: "Verified Workers", desc: "Every emergency worker is ID-verified and background-checked through their cooperative." },
              { icon: <Clock size={24} />, title: "Real-Time Tracking", desc: "Track the worker's location and ETA in real-time from dispatch to arrival." },
              { icon: <Phone size={24} />, title: "Direct Contact", desc: "Call the worker or emergency support line directly for immediate assistance." },
            ].map((f, i) => (
              <div key={i} className="bg-surface-card rounded-2xl border border-border p-6 text-center">
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white mx-auto mb-3">{f.icon}</div>
                <h3 className="text-sm font-semibold text-ink mb-1">{f.title}</h3>
                <p className="text-xs text-ink-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
