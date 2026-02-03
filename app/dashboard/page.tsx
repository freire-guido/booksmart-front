"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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

// Get the Monday of the current week
function getMondayOfCurrentWeek(): Date {
  const today = new Date();
  const day = today.getDay();
  // If Sunday (0), go back 6 days; otherwise go back (day - 1) days
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Helper to create a date relative to current week's Monday
function getDateFromMonday(daysFromMonday: number): Date {
  const monday = getMondayOfCurrentWeek();
  const date = new Date(monday);
  date.setDate(monday.getDate() + daysFromMonday);
  return date;
}

// Helper to create an email date (days before current week's Monday)
function getEmailDate(daysBefore: number, hours: number, minutes: number): Date {
  const monday = getMondayOfCurrentWeek();
  const date = new Date(monday);
  date.setDate(monday.getDate() - daysBefore);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Mock booking data - Asado Experience at 7pm
// Dates are relative to current week's Monday (day 0 = Monday, day 6 = Sunday)
const mockBookings: Booking[] = [
  // Monday (day 0)
  {
    id: "1",
    platform: "viator",
    guestName: "Guillermo F.",
    guestCount: 4,
    date: getDateFromMonday(0),
    time: "7:00 PM",
    status: "confirmed",
    activityName: "Authentic Asado Experience",
    emailSubject: "New Booking: Asado Experience – Guillermo F.",
    emailPreview: "You have a new booking! Guest: Guillermo F., Party size: 4, Experience: Authentic Argentine Asado.",
    emailDate: getEmailDate(4, 14, 23),
    emailId: "msg-001",
  },
  // Tuesday (day 1) - busier day
  {
    id: "2",
    platform: "getyourguide",
    guestName: "Natalia O.",
    guestCount: 2,
    date: getDateFromMonday(1),
    time: "7:00 PM",
    status: "confirmed",
    activityName: "Authentic Asado Experience",
    emailSubject: "Booking Confirmation: Natalia O. – Asado",
    emailPreview: "Great news! You have a new booking. Guest: Natalia O., Guests: 2, Activity: Authentic Argentine Asado Experience.",
    emailDate: getEmailDate(11, 18, 42),
    emailId: "msg-002",
  },
  {
    id: "3",
    platform: "airbnb",
    guestName: "Ricardo D.",
    guestCount: 6,
    date: getDateFromMonday(1),
    time: "7:00 PM",
    status: "confirmed",
    specialRequests: ["1 vegetarian"],
    activityName: "Authentic Asado Experience",
    emailSubject: "Experience booked – Ricardo D. for Asado",
    emailPreview: "New experience booking confirmed. Ricardo D. and 5 guests for Authentic Asado Experience. Notes: 1 vegetarian.",
    emailDate: getEmailDate(11, 14, 30),
    emailId: "msg-003",
  },
  // Wednesday (day 2)
  {
    id: "4",
    platform: "viator",
    guestName: "Carlos M.",
    guestCount: 2,
    date: getDateFromMonday(2),
    time: "7:00 PM",
    status: "confirmed",
    activityName: "Authentic Asado Experience",
    emailSubject: "New Booking: Asado Experience – Carlos M.",
    emailPreview: "You have a new booking! Guest: Carlos M., Party size: 2, Experience: Authentic Argentine Asado.",
    emailDate: getEmailDate(13, 9, 45),
    emailId: "msg-004",
  },
  // Thursday (day 3) - one cancelled
  {
    id: "5",
    platform: "getyourguide",
    guestName: "Miguel A.",
    guestCount: 2,
    date: getDateFromMonday(3),
    time: "7:00 PM",
    status: "cancelled",
    activityName: "Authentic Asado Experience",
    emailSubject: "Booking Cancelled: Miguel A.",
    emailPreview: "A booking has been cancelled. Guest: Miguel A. Reason: Guest requested cancellation.",
    emailDate: getEmailDate(12, 8, 30),
    emailId: "msg-005",
  },
  // Friday (day 4)
  {
    id: "6",
    platform: "airbnb",
    guestName: "Elena P.",
    guestCount: 4,
    date: getDateFromMonday(4),
    time: "7:00 PM",
    status: "confirmed",
    specialRequests: ["1 vegan"],
    activityName: "Authentic Asado Experience",
    emailSubject: "Experience booked – Elena P. for Asado",
    emailPreview: "New experience booking confirmed. Elena P. and 3 guests for Authentic Asado Experience. Notes: 1 vegan.",
    emailDate: getEmailDate(13, 16, 8),
    emailId: "msg-006",
  },
  {
    id: "7",
    platform: "viator",
    guestName: "Sofia R.",
    guestCount: 3,
    date: getDateFromMonday(4),
    time: "7:00 PM",
    status: "rescheduled",
    activityName: "Authentic Asado Experience",
    emailSubject: "Booking update: Sofia R. – Date changed",
    emailPreview: "A guest has modified their reservation. Sofia R. changed their Asado Experience date.",
    emailDate: getEmailDate(11, 9, 21),
    emailId: "msg-007",
  },
  // Saturday (day 5)
  {
    id: "8",
    platform: "getyourguide",
    guestName: "Ana L.",
    guestCount: 2,
    date: getDateFromMonday(5),
    time: "7:00 PM",
    status: "confirmed",
    activityName: "Authentic Asado Experience",
    emailSubject: "Booking Confirmation: Ana L. – Asado",
    emailPreview: "Great news! You have a new booking. Guest: Ana L., Guests: 2, Activity: Authentic Argentine Asado Experience.",
    emailDate: getEmailDate(17, 13, 44),
    emailId: "msg-008",
  },
  // Sunday (day 6)
  {
    id: "9",
    platform: "airbnb",
    guestName: "Pablo N.",
    guestCount: 5,
    date: getDateFromMonday(6),
    time: "7:00 PM",
    status: "confirmed",
    specialRequests: ["1 gluten-free"],
    activityName: "Authentic Asado Experience",
    emailSubject: "Experience booked – Pablo N. for Asado",
    emailPreview: "New experience booking confirmed. Pablo N. and 4 guests for Authentic Asado Experience. Notes: 1 gluten-free.",
    emailDate: getEmailDate(11, 19, 55),
    emailId: "msg-009",
  },
];

function getWeekDates(baseDate: Date): Date[] {
  const dates: Date[] = [];
  const startOfWeek = new Date(baseDate);
  // Adjust to Monday (day 1) as start of week
  const day = startOfWeek.getDay();
  // If Sunday (0), go back 6 days; otherwise go back (day - 1) days
  const diff = day === 0 ? -6 : 1 - day;
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

// Button that redirects to /demo with this email selected
function OpenInEmailButton({ emailId, onClose }: { emailId: string; onClose: () => void }) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        onClose();
        router.push(`/demo?email=${encodeURIComponent(emailId)}`);
      }}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#EA580C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C2410C]"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Open in Email
    </button>
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

        {/* Open in email - redirects to demo inbox with this email selected */}
        <OpenInEmailButton emailId={booking.emailId} onClose={onClose} />
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
      <div className={booking.status === "cancelled" || booking.status === "rescheduled" ? "line-through opacity-60" : ""}>
        <p className="text-sm font-medium text-[#1C1917]">{booking.guestName}</p>
        <p className="text-xs text-[#78716C]">
          {booking.guestCount} guest{booking.guestCount !== 1 ? "s" : ""}
          {booking.time && ` · ${booking.time}`}
        </p>
      </div>

      {/* Activity or duration */}
      {booking.activityName && (
        <p className={`mt-1.5 text-xs text-[#78716C] truncate ${booking.status === "cancelled" || booking.status === "rescheduled" ? "line-through opacity-60" : ""}`} title={booking.activityName}>
          {booking.activityName}
        </p>
      )}
      {booking.duration && (
        <p className={`mt-1.5 text-xs text-[#78716C] ${booking.status === "cancelled" || booking.status === "rescheduled" ? "line-through opacity-60" : ""}`}>{booking.duration}</p>
      )}

      {/* Special requests */}
      {booking.specialRequests && booking.specialRequests.length > 0 && booking.status === "confirmed" && (
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

// Parse dietary counts from special requests
function parseDietaryCounts(bookings: Booking[]): { vegetarian: number; vegan: number; glutenFree: number } {
  let vegetarian = 0;
  let vegan = 0;
  let glutenFree = 0;

  bookings.forEach((booking) => {
    if (booking.status !== "confirmed" || !booking.specialRequests) return;
    
    booking.specialRequests.forEach((request) => {
      const lower = request.toLowerCase();
      // Parse "X vegetarian" or "vegetarian"
      const vegMatch = lower.match(/(\d+)?\s*vegetarian/);
      if (vegMatch) {
        vegetarian += vegMatch[1] ? parseInt(vegMatch[1]) : 1;
      }
      // Parse "X vegan" or "vegan"
      const veganMatch = lower.match(/(\d+)?\s*vegan/);
      if (veganMatch) {
        vegan += veganMatch[1] ? parseInt(veganMatch[1]) : 1;
      }
      // Parse "X gluten-free" or "gluten-free"
      const gfMatch = lower.match(/(\d+)?\s*gluten[- ]?free/);
      if (gfMatch) {
        glutenFree += gfMatch[1] ? parseInt(gfMatch[1]) : 1;
      }
    });
  });

  return { vegetarian, vegan, glutenFree };
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
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalGuests = confirmedBookings.reduce((sum, b) => sum + b.guestCount, 0);
  const dietary = parseDietaryCounts(bookings);
  const hasDietary = dietary.vegetarian > 0 || dietary.vegan > 0 || dietary.glutenFree > 0;
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
      className={`flex min-w-[220px] flex-1 flex-col rounded-xl border ${
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
        
        {/* Dietary summary */}
        {hasDietary && (
          <div className="mt-2 flex flex-wrap gap-1">
            {dietary.vegetarian > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                <span>🥬</span> {dietary.vegetarian}
              </span>
            )}
            {dietary.vegan > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700">
                <span>🌱</span> {dietary.vegan}
              </span>
            )}
            {dietary.glutenFree > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                <span>🌾</span> {dietary.glutenFree}
              </span>
            )}
          </div>
        )}
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

type ViewMode = "week" | "month";

// Get all dates in a month, organized by weeks starting Monday (including padding days from adjacent months)
function getMonthDates(baseDate: Date): Date[][] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Start from Monday of the week containing the first day
  // getDay(): 0=Sun, 1=Mon, ..., 6=Sat
  // For Monday start: if day is 0 (Sun), go back 6 days; otherwise go back (day - 1) days
  const startDate = new Date(firstDay);
  const firstDayOfWeek = firstDay.getDay();
  const startDiff = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
  startDate.setDate(firstDay.getDate() + startDiff);
  
  // End on Sunday of the week containing the last day
  const endDate = new Date(lastDay);
  const lastDayOfWeek = lastDay.getDay();
  const endDiff = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  endDate.setDate(lastDay.getDate() + endDiff);
  
  const weeks: Date[][] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }
  
  return weeks;
}

function getMonthName(date: Date): string {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[date.getMonth()];
}

function isCurrentMonth(date: Date, baseDate: Date): boolean {
  return date.getMonth() === baseDate.getMonth() && date.getFullYear() === baseDate.getFullYear();
}

// Month Day Cell Component
function MonthDayCell({
  date,
  bookings,
  isCurrentMonth: inCurrentMonth,
  onClick,
}: {
  date: Date;
  bookings: Booking[];
  isCurrentMonth: boolean;
  onClick: () => void;
}) {
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalGuests = confirmedBookings.reduce((sum, b) => sum + b.guestCount, 0);
  const dietary = parseDietaryCounts(bookings);
  const hasDietary = dietary.vegetarian > 0 || dietary.vegan > 0 || dietary.glutenFree > 0;
  const today = isToday(date);
  const hasBookings = confirmedBookings.length > 0;

  return (
    <button
      onClick={onClick}
      className={`relative flex min-h-[80px] flex-col items-start rounded-lg border p-2 text-left transition-all ${
        today
          ? "border-[#EA580C] bg-[#FDF6EC]"
          : inCurrentMonth
          ? hasBookings
            ? "border-[#E7E5E4] bg-white hover:border-[#EA580C]/30 hover:shadow-sm"
            : "border-[#E7E5E4] bg-white"
          : "border-transparent bg-[#FAF8F5] opacity-40"
      }`}
    >
      {/* Day number */}
      <span
        className={`text-sm font-medium ${
          today
            ? "text-[#EA580C]"
            : inCurrentMonth
            ? "text-[#1C1917]"
            : "text-[#78716C]"
        }`}
      >
        {date.getDate()}
      </span>

      {/* Booking info - only if has bookings */}
      {hasBookings && inCurrentMonth && (
        <div className="mt-1 flex flex-col gap-1">
          {/* Guests count */}
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-medium text-[#1C1917]">{totalGuests}</span>
          </div>

          {/* Special requests emoticons */}
          {hasDietary && (
            <div className="flex gap-0.5">
              {dietary.vegetarian > 0 && <span className="text-xs" title={`${dietary.vegetarian} vegetarian`}>🥬</span>}
              {dietary.vegan > 0 && <span className="text-xs" title={`${dietary.vegan} vegan`}>🌱</span>}
              {dietary.glutenFree > 0 && <span className="text-xs" title={`${dietary.glutenFree} gluten-free`}>🌾</span>}
            </div>
          )}
        </div>
      )}

      {/* Today indicator */}
      {today && (
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
      )}
    </button>
  );
}

// Month Grid Component
function MonthGrid({
  baseDate,
  getBookingsForDate,
  onDayClick,
}: {
  baseDate: Date;
  getBookingsForDate: (date: Date) => Booking[];
  onDayClick: (date: Date) => void;
}) {
  const weeks = getMonthDates(baseDate);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex flex-1 flex-col rounded-xl border border-[#E7E5E4] bg-white p-3">
      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs font-medium text-[#78716C]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex flex-1 flex-col gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid flex-1 grid-cols-7 gap-1">
            {week.map((date) => (
              <MonthDayCell
                key={date.toISOString()}
                date={date}
                bookings={getBookingsForDate(date)}
                isCurrentMonth={isCurrentMonth(date, baseDate)}
                onClick={() => onDayClick(date)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// View Toggle Component
function ViewToggle({
  viewMode,
  onViewChange,
}: {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex rounded-lg border border-[#E7E5E4] bg-white p-0.5">
      <button
        onClick={() => onViewChange("week")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          viewMode === "week"
            ? "bg-[#EA580C] text-white"
            : "text-[#78716C] hover:text-[#1C1917]"
        }`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Week
      </button>
      <button
        onClick={() => onViewChange("month")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          viewMode === "month"
            ? "bg-[#EA580C] text-white"
            : "text-[#78716C] hover:text-[#1C1917]"
        }`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Month
      </button>
    </div>
  );
}

export default function DashboardPage() {
  // Start with the current week/month
  const [currentWeekStart, setCurrentWeekStart] = useState(() => new Date());
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const weekDates = getWeekDates(currentWeekStart);

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  // When clicking a day in month view, switch to week view for that day
  const handleMonthDayClick = (date: Date) => {
    setCurrentWeekStart(date);
    setViewMode("week");
  };

  // Get bookings for the current week
  const getBookingsForDate = (date: Date) => {
    return mockBookings.filter((booking) => isSameDay(booking.date, date));
  };

  // Calculate week totals
  const weekBookings = weekDates.flatMap(getBookingsForDate);
  const confirmedWeekBookings = weekBookings.filter((b) => b.status !== "cancelled");
  const totalWeekGuests = confirmedWeekBookings.reduce((sum, b) => sum + b.guestCount, 0);

  // Count special requests for week
  const specialRequestCount = confirmedWeekBookings.filter(
    (b) => b.specialRequests && b.specialRequests.length > 0
  ).length;

  // Calculate month totals
  const monthWeeks = getMonthDates(currentMonth);
  const monthDates = monthWeeks.flat().filter((date) => isCurrentMonth(date, currentMonth));
  const monthBookings = monthDates.flatMap(getBookingsForDate);
  const confirmedMonthBookings = monthBookings.filter((b) => b.status !== "cancelled");
  const totalMonthGuests = confirmedMonthBookings.reduce((sum, b) => sum + b.guestCount, 0);
  const monthSpecialRequestCount = confirmedMonthBookings.filter(
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

        {/* View toggle + Navigation row */}
        <div className="mb-3 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />

            {/* Navigation controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => viewMode === "week" ? navigateWeek("prev") : navigateMonth("prev")}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E5E4] bg-white text-[#78716C] transition-colors hover:bg-[#FDF6EC] hover:text-[#1C1917]"
                aria-label={viewMode === "week" ? "Previous week" : "Previous month"}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="min-w-[140px] text-center">
                {viewMode === "week" ? (
                  <>
                    <p className="text-sm font-medium text-[#1C1917]">
                      {formatDate(weekDates[0])} – {formatDate(weekDates[6])}
                    </p>
                    <p className="text-xs text-[#78716C]">
                      {weekDates[0].getFullYear()}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-[#1C1917]">
                      {getMonthName(currentMonth)}
                    </p>
                    <p className="text-xs text-[#78716C]">
                      {currentMonth.getFullYear()}
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={() => viewMode === "week" ? navigateWeek("next") : navigateMonth("next")}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E5E4] bg-white text-[#78716C] transition-colors hover:bg-[#FDF6EC] hover:text-[#1C1917]"
                aria-label={viewMode === "week" ? "Next week" : "Next month"}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Summary stats + Email stack */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="rounded-lg bg-white px-2.5 py-1.5 border border-[#E7E5E4]">
              <span className="text-[#78716C]">Bookings:</span>{" "}
              <span className="font-medium text-[#1C1917]">
                {viewMode === "week" ? confirmedWeekBookings.length : confirmedMonthBookings.length}
              </span>
            </div>
            <div className="rounded-lg bg-white px-2.5 py-1.5 border border-[#E7E5E4]">
              <span className="text-[#78716C]">Guests:</span>{" "}
              <span className="font-medium text-[#1C1917]">
                {viewMode === "week" ? totalWeekGuests : totalMonthGuests}
              </span>
            </div>
            {(viewMode === "week" ? specialRequestCount : monthSpecialRequestCount) > 0 && (
              <div className="rounded-lg bg-[#EA580C]/10 px-2.5 py-1.5 border border-[#EA580C]/20">
                <span className="text-[#EA580C]">Requests:</span>{" "}
                <span className="font-medium text-[#EA580C]">
                  {viewMode === "week" ? specialRequestCount : monthSpecialRequestCount}
                </span>
              </div>
            )}
            <div className="rounded-lg border border-[#E7E5E4] bg-white px-3 py-1.5">
              <EmailStack bookings={mockBookings} />
            </div>
          </div>
        </div>

        {/* Calendar view - fills remaining height */}
        {viewMode === "week" ? (
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
        ) : (
          <MonthGrid
            baseDate={currentMonth}
            getBookingsForDate={getBookingsForDate}
            onDayClick={handleMonthDayClick}
          />
        )}
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
