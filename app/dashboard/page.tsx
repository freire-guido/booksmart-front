"use client";

import { useState } from "react";
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
  },
  {
    id: "7",
    platform: "airbnb",
    guestName: "Sofia R.",
    guestCount: 1,
    date: new Date(2026, 1, 16),
    status: "confirmed",
    duration: "2 nights",
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
  },
  {
    id: "12",
    platform: "airbnb",
    guestName: "Ana L.",
    guestCount: 2,
    date: new Date(2026, 1, 19),
    status: "confirmed",
    duration: "4 nights",
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

// Booking Card Component
function BookingCard({ booking }: { booking: Booking }) {
  const platformColor = platformColors[booking.platform];
  const platformName = platformNames[booking.platform];

  return (
    <div
      className={`rounded-lg border p-3 transition-all ${
        booking.status === "cancelled"
          ? "border-red-200 bg-red-50/50 opacity-60"
          : booking.status === "rescheduled"
          ? "border-amber-200 bg-amber-50/50"
          : "border-[#E7E5E4] bg-white hover:shadow-sm"
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
    </div>
  );
}

// Day Column Component
function DayColumn({ date, bookings }: { date: Date; bookings: Booking[] }) {
  const confirmedBookings = bookings.filter((b) => b.status !== "cancelled");
  const totalGuests = confirmedBookings.reduce((sum, b) => sum + b.guestCount, 0);
  const today = isToday(date);

  return (
    <div
      className={`flex min-w-[200px] flex-1 flex-col rounded-xl border ${
        today ? "border-[#EA580C] bg-[#FDF6EC]" : "border-[#E7E5E4] bg-white"
      }`}
    >
      {/* Day header */}
      <div className={`border-b p-3 ${today ? "border-[#EA580C]/20" : "border-[#E7E5E4]"}`}>
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

      {/* Bookings list */}
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {bookings.length === 0 ? (
          <p className="py-8 text-center text-xs text-[#78716C]">No bookings</p>
        ) : (
          bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Start with the week containing Feb 15, 2026
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2026, 1, 14));
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
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#1C1917] sm:text-3xl">Dashboard</h1>
              <p className="mt-1 text-sm text-[#78716C]">
                All your bookings from Airbnb, Viator, and GetYourGuide in one place
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

        {/* Week navigation */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateWeek("prev")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E5E4] bg-white text-[#78716C] transition-colors hover:bg-[#FDF6EC] hover:text-[#1C1917]"
              aria-label="Previous week"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E5E4] bg-white text-[#78716C] transition-colors hover:bg-[#FDF6EC] hover:text-[#1C1917]"
              aria-label="Next week"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Week summary stats */}
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="rounded-lg bg-white px-3 py-2 border border-[#E7E5E4]">
              <span className="text-[#78716C]">Bookings:</span>{" "}
              <span className="font-medium text-[#1C1917]">{confirmedWeekBookings.length}</span>
            </div>
            <div className="rounded-lg bg-white px-3 py-2 border border-[#E7E5E4]">
              <span className="text-[#78716C]">Guests:</span>{" "}
              <span className="font-medium text-[#1C1917]">{totalWeekGuests}</span>
            </div>
            {specialRequestCount > 0 && (
              <div className="rounded-lg bg-[#EA580C]/10 px-3 py-2 border border-[#EA580C]/20">
                <span className="text-[#EA580C]">Special requests:</span>{" "}
                <span className="font-medium text-[#EA580C]">{specialRequestCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Week grid */}
        <div className="flex gap-3 overflow-x-auto pb-4">
          {weekDates.map((date) => (
            <DayColumn
              key={date.toISOString()}
              date={date}
              bookings={getBookingsForDate(date)}
            />
          ))}
        </div>

        {/* Platform legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 rounded-xl border border-[#E7E5E4] bg-white p-4">
          <span className="text-xs text-[#78716C]">Platforms:</span>
          {(Object.keys(platformColors) as Platform[]).map((platform) => (
            <div key={platform} className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: platformColors[platform] }}
              />
              <span className="text-xs text-[#1C1917]">{platformNames[platform]}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
