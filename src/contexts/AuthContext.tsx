"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  language?: string;
  accountType?: "customer" | "worker";
  // Worker-specific
  profession?: string;
  skills?: string[];
  experience?: string;
  city?: string;
  state?: string;
  district?: string;
  pinCode?: string;
  serviceRadius?: string;
  availableDays?: string[];
  startTime?: string;
  endTime?: string;
  availabilityType?: string;
  idType?: string;
  registrationDate?: string;
  // Profile photo (data URL)
  profilePhoto?: string;
}

export interface Booking {
  id: string;
  workerId: number;
  workerName: string;
  workerProfession: string;
  date: string;
  time: string;
  price: number;
  note?: string;
  status: "upcoming" | "completed" | "cancelled";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => void;
  logout: () => void;
  redirectTo: string | null;
  setRedirectTo: (url: string | null) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "createdAt" | "status">) => void;
  cancelBooking: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectTo, setRedirectToState] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gharpe-auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed as User);
        }
      }
      const storedBookings = localStorage.getItem("gharpe-bookings");
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch {
      // corrupted data — ignore
    }
    setIsLoading(false);
  }, []);

  // Persist bookings
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem("gharpe-bookings", JSON.stringify(bookings));
    }
  }, [bookings]);

  /** Mock login — accepts any email + password ≥ 6 chars */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    if (!email || !password || password.length < 6) return false;

    // Check if user already registered with full data
    const existingData = localStorage.getItem("gharpe-auth");
    let existingUser: User | null = null;
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        if (parsed.email === email) {
          existingUser = parsed as User;
        }
      } catch { /* ignore */ }
    }

    if (existingUser) {
      setUser(existingUser);
      return true;
    }

    const newUser: User = {
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      accountType: "customer",
      registrationDate: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem("gharpe-auth", JSON.stringify(newUser));
    return true;
  }, []);

  /** Register with full profile data */
  const register = useCallback(async (userData: Partial<User>): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1500));
    if (!userData.email || !userData.name) return false;

    const newUser: User = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      address: userData.address || "",
      language: userData.language || "English",
      accountType: userData.accountType || "customer",
      profession: userData.profession,
      skills: userData.skills,
      experience: userData.experience,
      city: userData.city,
      state: userData.state,
      district: userData.district,
      pinCode: userData.pinCode,
      serviceRadius: userData.serviceRadius,
      availableDays: userData.availableDays,
      startTime: userData.startTime,
      endTime: userData.endTime,
      availabilityType: userData.availabilityType,
      idType: userData.idType,
      profilePhoto: userData.profilePhoto,
      registrationDate: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem("gharpe-auth", JSON.stringify(newUser));
    return true;
  }, []);

  /** Update profile data */
  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem("gharpe-auth", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("gharpe-auth");
  }, []);

  const setRedirectTo = useCallback((url: string | null) => {
    setRedirectToState(url);
  }, []);

  /** Add a new booking */
  const addBooking = useCallback((booking: Omit<Booking, "id" | "createdAt" | "status">) => {
    const newBooking: Booking = {
      ...booking,
      id: `BK-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: "upcoming",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      localStorage.setItem("gharpe-bookings", JSON.stringify(updated));
      return updated;
    });
  }, []);

  /** Cancel a booking */
  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) => b.id === id ? { ...b, status: "cancelled" as const } : b);
      localStorage.setItem("gharpe-bookings", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, updateProfile, logout, redirectTo, setRedirectTo, bookings, addBooking, cancelBooking }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
