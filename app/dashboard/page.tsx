"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

type Platform = "airbnb" | "viator" | "getyourguide";

type Booking = {
  id: string;
  platform: Platform;
  guestName: string;
  guestCount: number;
  date: Date;
  time?: string;
  status: "confirmed" | "cancelled" | "rescheduled";
  specialRequests?: string[];
  activityName?: string;
  duration?: string;
  // Email metadata
  emailSubject: string;
  emailPreview: string;
  emailDate: Date;
  emailId: string;
};

// Platform brand colors
const platformColors: Record<Platform, string> = {
  airbnb: "#FF5A5F",
  viator: "#00AA6C",
  getyourguide: "#FF5533",
};

const platformNames: Record<Platform, string> = {
  airbnb: "Airbnb",
  viator: "Viator",
  getyourguide: "GetYourGuide",
};

// Mock booking data - centered around Feb 15, 2026
const mockBookings: Booking[] = [
  // Feb 14 (Sat) - 1 booking
  {
    id: "1",
    platform: "airbnb",
    guestName: "Guillermo F.",
    guestCount: 5,
    date: new Date(2026, 1, 14),
    status: "confirmed",
    specialRequests: ["Early check-in (2 PM)", "Gluten-free"],
    duration: "3 nights",
    emailSubject: "Reservation confirmed – Guillermo arrives Feb 14",
    emailPreview: "Reservation confirmed. Guillermo F. and 4 guests will arrive on Feb 14 for 3 nights. Check-in: 2:00 PM. Notes: Gluten-free diet required.",
    emailDate: new Date(2026, 1, 10, 14, 23),
    emailId: "msg-001",
  },
  // Feb 15 (Sun) - 4 bookings (busy day)
  {
    id: "2",
    platform: "airbnb",
    guestName: "Natalia O.",
    guestCount: 2,
    date: new Date(2026, 1, 15),
    time: "3:00 PM",
    status: "confirmed",
    specialRequests: ["Vegetarian", "Early check-in"],
    duration: "3 nights",
    emailSubject: "Reservation confirmed – Natalia arrives Feb 15",
    emailPreview: "Reservation confirmed. Natalia O. and 1 guest will arrive on Feb 15 for 3 nights. Check-in: 3:00 PM. Notes: Vegetarian, early check-in requested.",
    emailDate: new Date(2026, 1, 3, 18, 42),
    emailId: "msg-002",
  },
  {
    id: "3",
    platform: "viator",
    guestName: "Luisana L.",
    guestCount: 2,
    date: new Date(2026, 1, 15),
    time: "2:00 PM",
    status: "confirmed",
    specialRequests: ["Wheelchair access"],
    activityName: "Buenos Aires Food Tour",
    emailSubject: "New Booking: Buenos Aires Food Tour – Luisana L.",
    emailPreview: "You have a new booking! Guest: Luisana L., Party size: 2, Tour: Buenos Aires Food & Wine Experience, Date: Feb 15 at 2:00 PM. Special request: Wheelchair access needed.",
    emailDate: new Date(2026, 1, 3, 16, 55),
    emailId: "msg-003",
  },
  {
    id: "4",
    platform: "getyourguide",
    guestName: "Ricardo D.",
    guestCount: 4,
    date: new Date(2026, 1, 15),
    time: "10:00 AM",
    status: "confirmed",
    specialRequests: ["Gluten-free (1 guest)"],
    activityName: "City Highlights Tour",
    emailSubject: "Booking Confirmation: Ricardo D. – City Tour Feb 15",
    emailPreview: "Great news! You have a new booking. Guest: Ricardo D., Guests: 4, Activity: Buenos Aires City Highlights Tour, Date: February 15, 2026. Dietary: Gluten-free (1 guest)",
    emailDate: new Date(2026, 1, 3, 14, 30),
    emailId: "msg-004",
  },
  {
    id: "5",
    platform: "viator",
    guestName: "Julieta Z.",
    guestCount: 3,
    date: new Date(2026, 1, 15),
    time: "6:00 PM",
    status: "confirmed",
    activityName: "Tango Night Experience",
    emailSubject: "New Booking: Tango Night – Julieta Z.",
    emailPreview: "You have a new booking! Guest: Julieta Z., Party size: 3, Tour: Authentic Tango Night Experience, Date: Feb 15 at 6:00 PM.",
    emailDate: new Date(2026, 1, 2, 11, 15),
    emailId: "msg-005",
  },
  // Feb 16 (Mon) - 2 bookings
  {
    id: "6",
    platform: "getyourguide",
    guestName: "Carlos M.",
    guestCount: 2,
    date: new Date(2026, 1, 16),
    time: "9:00 AM",
    status: "confirmed",
    activityName: "Tigre Delta Day Trip",
    emailSubject: "Booking Confirmation: Carlos M. – Tigre Delta",
    emailPreview: "Great news! You have a new booking. Guest: Carlos M., Guests: 2, Activity: Tigre Delta Day Trip with Boat Ride, Date: February 16, 2026 at 9:00 AM.",
    emailDate: new Date(2026, 1, 1, 9, 45),
    emailId: "msg-006",
  },
  {
    id: "7",
    platform: "airbnb",
    guestName: "Sofia R.",
    guestCount: 1,
    date: new Date(2026, 1, 16),
    status: "confirmed",
    duration: "2 nights",
    emailSubject: "Reservation confirmed – Sofia arrives Feb 16",
    emailPreview: "Reservation confirmed. Sofia R. will arrive on Feb 16 for 2 nights. Solo traveler. Standard check-in at 3:00 PM.",
    emailDate: new Date(2026, 0, 30, 20, 12),
    emailId: "msg-007",
  },
  // Feb 17 (Tue) - 1 booking
  {
    id: "8",
    platform: "viator",
    guestName: "Miguel A.",
    guestCount: 2,
    date: new Date(2026, 1, 17),
    time: "11:00 AM",
    status: "cancelled",
    activityName: "Street Art Walking Tour",
    emailSubject: "Booking Cancelled: Miguel A. (Feb 17)",
    emailPreview: "A booking has been cancelled. Guest: Miguel A., Original date: February 17, 2026. Reason: Guest requested cancellation.",
    emailDate: new Date(2026, 1, 2, 8, 30),
    emailId: "msg-008",
  },
  // Feb 18 (Wed) - 2 bookings (including rescheduled)
  {
    id: "9",
    platform: "airbnb",
    guestName: "Ricardo M.",
    guestCount: 3,
    date: new Date(2026, 1, 18),
    status: "rescheduled",
    specialRequests: ["Late checkout"],
    duration: "2 nights",
    emailSubject: "Booking update: Ricardo M. – Dates changed",
    emailPreview: "A guest has modified their reservation. Ricardo M. changed their booking from Feb 20-22 to Feb 18-20. Please confirm availability. Note: Late checkout requested.",
    emailDate: new Date(2026, 1, 3, 9, 21),
    emailId: "msg-009",
  },
  {
    id: "10",
    platform: "getyourguide",
    guestName: "Elena P.",
    guestCount: 4,
    date: new Date(2026, 1, 18),
    time: "3:00 PM",
    status: "confirmed",
    specialRequests: ["Vegan (2 guests)"],
    activityName: "Wine Tasting Experience",
    emailSubject: "Booking Confirmation: Elena P. – Wine Tasting",
    emailPreview: "Great news! You have a new booking. Guest: Elena P., Guests: 4, Activity: Mendoza Wine Tasting Experience, Date: February 18, 2026. Dietary: Vegan options needed for 2 guests.",
    emailDate: new Date(2026, 1, 1, 16, 8),
    emailId: "msg-010",
  },
  // Feb 19 (Thu) - 2 bookings
  {
    id: "11",
    platform: "viator",
    guestName: "Fernando B.",
    guestCount: 6,
    date: new Date(2026, 1, 19),
    time: "10:00 AM",
    status: "confirmed",
    specialRequests: ["Spanish-speaking guide"],
    activityName: "Full Day Gaucho Ranch",
    emailSubject: "New Booking: Gaucho Ranch – Fernando B.",
    emailPreview: "You have a new booking! Guest: Fernando B., Party size: 6, Tour: Full Day Gaucho Ranch Experience, Date: Feb 19 at 10:00 AM. Special request: Spanish-speaking guide preferred.",
    emailDate: new Date(2026, 0, 28, 13, 44),
    emailId: "msg-011",
  },
  {
    id: "12",
    platform: "airbnb",
    guestName: "Ana L.",
    guestCount: 2,
    date: new Date(2026, 1, 19),
    status: "confirmed",
    duration: "4 nights",
    emailSubject: "Reservation confirmed – Ana arrives Feb 19",
    emailPreview: "Reservation confirmed. Ana L. and 1 guest will arrive on Feb 19 for 4 nights. Check-in: 3:00 PM. No special requests.",
    emailDate: new Date(2026, 0, 25, 10, 30),
    emailId: "msg-012",
  },
  // Feb 20 (Fri) - 1 booking
  {
    id: "13",
    platform: "getyourguide",
    guestName: "Pablo N.",
    guestCount: 2,
    date: new Date(2026, 1, 20),
    time: "7:00 PM",
    status: "confirmed",
    activityName: "Night Photography Tour",
    emailSubject: "Booking Confirmation: Pablo N. – Night Photography",
    emailPreview: "Great news! You have a new booking. Guest: Pablo N., Guests: 2, Activity: Buenos Aires Night Photography Tour, Date: February 20, 2026 at 7:00 PM.",
    emailDate: new Date(2026, 1, 3, 19, 55),
    emailId: "msg-013",
  },
];

function getWeekDates(baseDate: Date): Date[] {
  const dates: Date[] = [];
  const startOfWeek = new Date(baseDate);
  // Adjust to Saturday (day 6) as start of week for tourism context
  const day = startOfWeek.getDay();
  const diff = day === 6 ? 0 : day === 0 ? -1 : -(day + 1);
  startOfWeek.setDate(startOfWeek.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }
  return dates;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

function getDayName(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function isToday(date: Date): boolean {
  const today = new Date();
  return isSameDay(date, today);
}

function formatEmailDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${months[date.getMonth()]} ${date.getDate()}, ${hour12}:${minutes} ${ampm}`;
}

// Get latest emails sorted by date
function getLatestEmails(bookings: Booking[], count: number): Booking[] {
  return [...bookings]
    .sort((a, b) => b.emailDate.getTime() - a.emailDate.getTime())
    .slice(0, count);
}

// Email Stack Component
function EmailStack({ bookings }: { bookings: Booking[] }) {
  const [expanded, setExpanded] = useState(false);
  const latestEmails = getLatestEmails(bookings, 3);
  const mostRecent = latestEmails[0];

  return (
    <div className="relative">
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2"
      >
        <svg className="h-4 w-4 text-[#EA580C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="text-xs text-[#78716C]">
          {mostRecent ? formatEmailDate(mostRecent.emailDate) : "—"}
        </span>
        <svg
          className={`h-3.5 w-3.5 text-[#78716C] transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded dropdown */}
      {expanded && (
        <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-[#E7E5E4] bg-white p-3 shadow-lg">
          <p className="mb-2 text-xs font-medium text-[#78716C]">Recent Emails</p>
          <div className="space-y-1.5">
            {latestEmails.map((booking, index) => (
              <div
                key={booking.id}
                className={`rounded-lg border border-[#E7E5E4] p-2.5 transition-all ${
                  index === 0 ? "bg-[#FDF6EC]" : "bg-white"
                }`}
                style={{
                  opacity: index === 0 ? 1 : 0.8 - index * 0.15,
                }}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      booking.status === "cancelled"
                        ? "bg-red-100"
                        : booking.status === "rescheduled"
                        ? "bg-amber-100"
                        : "bg-[#EA580C]/10"
                    }`}
                  >
                    {booking.status === "cancelled" ? (
                      <svg className="h-2.5 w-2.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : booking.status === "rescheduled" ? (
                      <svg className="h-2.5 w-2.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="h-2.5 w-2.5 text-[#EA580C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-medium text-[#1C1917]">
                        {platformNames[booking.platform]}
                      </p>
                      <span className="shrink-0 text-xs text-[#78716C]">
                        {formatEmailDate(booking.emailDate)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-[#78716C]">
                      {booking.guestName} ({booking.guestCount} guest{booking.guestCount !== 1 ? "s" : ""})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Booking Detail Modal
function BookingModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const platformColor = platformColors[booking.platform];
  const platformName = platformNames[booking.platform];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-[#E7E5E4] bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#78716C] transition-colors hover:bg-[#FDF6EC] hover:text-[#1C1917]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: platformColor }}
            >
              {platformName}
            </span>
            {booking.status === "cancelled" && (
              <span className="text-xs font-medium text-red-500">Cancelled</span>
            )}
            {booking.status === "rescheduled" && (
              <span className="text-xs font-medium text-amber-600">Rescheduled</span>
            )}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-[#1C1917]">
            {booking.guestName}
          </h3>
          <p className="text-sm text-[#78716C]">
            {booking.guestCount} guest{booking.guestCount !== 1 ? "s" : ""}
            {booking.time && ` · ${booking.time}`}
            {booking.activityName && ` · ${booking.activityName}`}
            {booking.duration && ` · ${booking.duration}`}
          </p>
        </div>

        {/* Special requests */}
        {booking.specialRequests && booking.specialRequests.length > 0 && (
          <div className="mb-4">
            <p className="mb-1.5 text-xs font-medium text-[#78716C]">Special Requests</p>
            <div className="flex flex-wrap gap-1.5">
              {booking.specialRequests.map((request, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-[#EA580C]/10 px-2 py-1 text-xs text-[#EA580C]"
                >
                  {request}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Email preview */}
        <div className="rounded-xl border border-[#E7E5E4] bg-[#FAF8F5] p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-[#78716C]">Original Email</p>
            <span className="text-xs text-[#78716C]">{formatEmailDate(booking.emailDate)}</span>
          </div>
          <p className="mb-2 text-sm font-medium text-[#1C1917]">{booking.emailSubject}</p>
          <p className="text-xs leading-relaxed text-[#78716C]">{booking.emailPreview}</p>
        </div>

        {/* Open in email button */}
        <button
          onClick={() => {
            // This would open the email client in a real implementation
            alert(`Opening email: ${booking.emailId}\n\nThis would redirect to your email client in the full version.`);
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#EA580C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C2410C]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Open in Email
        </button>
      </div>
    </div>
  );
}

// Booking Card Component
function BookingCard({ booking, onClick }: { booking: Booking; onClick: () => void }) {
  const platformColor = platformColors[booking.platform];
  const platformName = platformNames[booking.platform];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-3 transition-all ${
        booking.status === "cancelled"
          ? "border-red-200 bg-red-50/50 opacity-60"
          : booking.status === "rescheduled"
          ? "border-amber-200 bg-amber-50/50 hover:border-amber-300"
          : "border-[#E7E5E4] bg-white hover:border-[#EA580C]/30 hover:shadow-sm"
      }`}
    >
      {/* Platform badge and status */}
      <div className="mb-2 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: platformColor }}
        >
          {platformName}
        </span>
        {booking.status === "cancelled" && (
          <span className="text-xs font-medium text-red-500">Cancelled</span>
        )}
        {booking.status === "rescheduled" && (
          <span className="text-xs font-medium text-amber-600">Rescheduled</span>
        )}
      </div>

      {/* Guest info */}
      <div className={booking.status === "cancelled" ? "line-through" : ""}>
        <p className="text-sm font-medium text-[#1C1917]">{booking.guestName}</p>
        <p className="text-xs text-[#78716C]">
          {booking.guestCount} guest{booking.guestCount !== 1 ? "s" : ""}
          {booking.time && ` · ${booking.time}`}
        </p>
      </div>

      {/* Activity or duration */}
      {booking.activityName && (
        <p className="mt-1.5 text-xs text-[#78716C] truncate" title={booking.activityName}>
          {booking.activityName}
        </p>
      )}
      {booking.duration && (
        <p className="mt-1.5 text-xs text-[#78716C]">{booking.duration}</p>
      )}

      {/* Special requests */}
      {booking.specialRequests && booking.specialRequests.length > 0 && booking.status !== "cancelled" && (
        <div className="mt-2 flex flex-wrap gap-1">
          {booking.specialRequests.map((request, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-[#EA580C]/10 px-1.5 py-0.5 text-xs text-[#EA580C]"
            >
              {request}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

// Day Column Component
function DayColumn({
  date,
  bookings,
  onBookingClick,
}: {
  date: Date;
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
}) {
  const confirmedBookings = bookings.filter((b) => b.status !== "cancelled");
  const totalGuests = confirmedBookings.reduce((sum, b) => sum + b.guestCount, 0);
  const today = isToday(date);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      const hasMoreBelow = el.scrollHeight > el.clientHeight && 
        el.scrollTop + el.clientHeight < el.scrollHeight - 4;
      setShowFade(hasMoreBelow);
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [bookings]);

  return (
    <div
      className={`flex min-w-[180px] flex-1 flex-col rounded-xl border ${
        today ? "border-[#EA580C] bg-[#FDF6EC]" : "border-[#E7E5E4] bg-white"
      }`}
    >
      {/* Day header */}
      <div className={`shrink-0 border-b p-3 ${today ? "border-[#EA580C]/20" : "border-[#E7E5E4]"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs font-medium ${today ? "text-[#EA580C]" : "text-[#78716C]"}`}>
              {getDayName(date)}
            </p>
            <p className={`text-lg font-semibold ${today ? "text-[#EA580C]" : "text-[#1C1917]"}`}>
              {formatDate(date)}
            </p>
          </div>
          {today && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EA580C] px-2 py-0.5 text-xs font-medium text-white">
              Today
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-[#78716C]">
          {confirmedBookings.length} booking{confirmedBookings.length !== 1 ? "s" : ""} · {totalGuests} guest
          {totalGuests !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Bookings list with scroll fade */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="absolute inset-0 space-y-2 overflow-y-auto p-2"
        >
          {bookings.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#78716C]">No bookings</p>
          ) : (
            bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => onBookingClick(booking)}
              />
            ))
          )}
        </div>
        
        {/* Fade indicator */}
        {showFade && (
          <div
            className={`pointer-events-none absolute bottom-0 left-0 right-0 h-8 rounded-b-xl ${
              today
                ? "bg-gradient-to-t from-[#FDF6EC] to-transparent"
                : "bg-gradient-to-t from-white to-transparent"
            }`}
          />
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Start with the week containing Feb 15, 2026
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2026, 1, 14));
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const weekDates = getWeekDates(currentWeekStart);

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  // Get bookings for the current week
  const getBookingsForDate = (date: Date) => {
    return mockBookings.filter((booking) => isSameDay(booking.date, date));
  };

  // Calculate week totals
  const weekBookings = weekDates.flatMap(getBookingsForDate);
  const confirmedWeekBookings = weekBookings.filter((b) => b.status !== "cancelled");
  const totalWeekGuests = confirmedWeekBookings.reduce((sum, b) => sum + b.guestCount, 0);

  // Count special requests
  const specialRequestCount = confirmedWeekBookings.filter(
    (b) => b.specialRequests && b.specialRequests.length > 0
  ).length;

  return (
    <div className="flex h-screen flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6">
        {/* Header */}
        <div className="mb-4 shrink-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#1C1917] sm:text-2xl">Dashboard</h1>
              <p className="mt-0.5 text-sm text-[#78716C]">
                All your bookings in one place
              </p>
            </div>

            {/* Sync status */}
            <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              Live Sync
            </div>
          </div>
        </div>

        {/* Week navigation + Email stack row */}
        <div className="mb-3 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateWeek("prev")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E5E4] bg-white text-[#78716C] transition-colors hover:bg-[#FDF6EC] hover:text-[#1C1917]"
              aria-label="Previous week"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-sm font-medium text-[#1C1917]">
                {formatDate(weekDates[0])} – {formatDate(weekDates[6])}
              </p>
              <p className="text-xs text-[#78716C]">
                {weekDates[0].getFullYear()}
              </p>
            </div>
            <button
              onClick={() => navigateWeek("next")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E5E4] bg-white text-[#78716C] transition-colors hover:bg-[#FDF6EC] hover:text-[#1C1917]"
              aria-label="Next week"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Week summary stats + Email stack */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="rounded-lg bg-white px-2.5 py-1.5 border border-[#E7E5E4]">
              <span className="text-[#78716C]">Bookings:</span>{" "}
              <span className="font-medium text-[#1C1917]">{confirmedWeekBookings.length}</span>
            </div>
            <div className="rounded-lg bg-white px-2.5 py-1.5 border border-[#E7E5E4]">
              <span className="text-[#78716C]">Guests:</span>{" "}
              <span className="font-medium text-[#1C1917]">{totalWeekGuests}</span>
            </div>
            {specialRequestCount > 0 && (
              <div className="rounded-lg bg-[#EA580C]/10 px-2.5 py-1.5 border border-[#EA580C]/20">
                <span className="text-[#EA580C]">Requests:</span>{" "}
                <span className="font-medium text-[#EA580C]">{specialRequestCount}</span>
              </div>
            )}
            <div className="rounded-lg border border-[#E7E5E4] bg-white px-3 py-1.5">
              <EmailStack bookings={mockBookings} />
            </div>
          </div>
        </div>

        {/* Week grid - fills remaining height */}
        <div className="flex min-h-0 flex-1 gap-2 overflow-x-auto sm:gap-3">
          {weekDates.map((date) => (
            <DayColumn
              key={date.toISOString()}
              date={date}
              bookings={getBookingsForDate(date)}
              onBookingClick={setSelectedBooking}
            />
          ))}
        </div>
      </main>

      {/* Booking detail modal */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
