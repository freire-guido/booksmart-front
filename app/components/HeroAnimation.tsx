"use client";

import { useState, useEffect, useRef } from "react";

type Email = {
  id: number;
  platform: string;
  guest: string;
  guests: number;
  date: string;
  type: "booking" | "cancellation" | "reschedule";
};

type Booking = {
  platform: string;
  guest: string;
  guests: number;
  dietary: string | null;
  status: "confirmed" | "leaving";
  leavingType?: "cancelled" | "rescheduled";
};

// Fixed pool of 5 guests that cycle through
const guestPool = [
  { platform: "Airbnb", guest: "Maria Garcia", guests: 2, dietary: "1 vegetarian" },
  { platform: "GetYourGuide", guest: "James Wilson", guests: 4, dietary: null },
  { platform: "Viator", guest: "Sophie Chen", guests: 2, dietary: "2 vegan" },
  { platform: "Civitatis", guest: "Emma Roberts", guests: 3, dietary: null },
  { platform: "TripAdvisor", guest: "Carlos Mendez", guests: 5, dietary: "1 gluten-free" },
];

export default function HeroAnimation() {
  // Get today's date
  const today = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayMonth = monthNames[today.getMonth()];
  const todayDay = today.getDate();
  const todayDayName = dayNames[today.getDay()];
  const todayFormatted = `${todayMonth} ${todayDay}`;
  
  // Future date for reschedules
  const futureDay = todayDay + 3;
  const futureFormatted = `${todayMonth} ${futureDay}`;

  const [emails, setEmails] = useState<Email[]>([
    { id: 1, platform: "Airbnb", guest: "Maria Garcia", guests: 2, date: todayFormatted, type: "booking" },
    { id: 2, platform: "GetYourGuide", guest: "James Wilson", guests: 4, date: todayFormatted, type: "booking" },
    { id: 3, platform: "Viator", guest: "Sophie Chen", guests: 2, date: todayFormatted, type: "booking" },
  ]);
  
  // Max 3 visible bookings
  const [bookings, setBookings] = useState<Booking[]>([
    { platform: "Airbnb", guest: "Maria Garcia", guests: 2, dietary: "1 vegetarian", status: "confirmed" },
    { platform: "GetYourGuide", guest: "James Wilson", guests: 4, dietary: null, status: "confirmed" },
    { platform: "Viator", guest: "Sophie Chen", guests: 2, dietary: "2 vegan", status: "confirmed" },
  ]);
  
  const [syncing, setSyncing] = useState(false);
  const [emailCounter, setEmailCounter] = useState(4);
  // Alternate: true = next action is cancel/reschedule, false = next action is new booking
  const lastWasRemoval = useRef(false);

  useEffect(() => {
    const addEmail = () => {
      const currentBookings = bookings.filter(b => b.status === "confirmed");
      const currentGuests = currentBookings.map(b => b.guest);
      const availableGuests = guestPool.filter(g => !currentGuests.includes(g.guest));
      
      let template: Omit<Email, "id">;
      
      if (lastWasRemoval.current && availableGuests.length > 0) {
        // After a removal, add a new booking from someone not on the list
        const newGuest = availableGuests[Math.floor(Math.random() * availableGuests.length)];
        template = {
          platform: newGuest.platform,
          guest: newGuest.guest,
          guests: newGuest.guests,
          date: todayFormatted,
          type: "booking",
        };
        lastWasRemoval.current = false;
      } else if (currentBookings.length >= 2) {
        // Remove someone (cancel or reschedule to different date)
        const toRemove = currentBookings[Math.floor(Math.random() * currentBookings.length)];
        const type = Math.random() < 0.6 ? "cancellation" : "reschedule";
        template = {
          platform: toRemove.platform,
          guest: toRemove.guest,
          guests: toRemove.guests,
          date: type === "reschedule" ? futureFormatted : todayFormatted,
          type,
        };
        lastWasRemoval.current = true;
      } else if (availableGuests.length > 0) {
        // Not enough bookings, add someone
        const newGuest = availableGuests[Math.floor(Math.random() * availableGuests.length)];
        template = {
          platform: newGuest.platform,
          guest: newGuest.guest,
          guests: newGuest.guests,
          date: todayFormatted,
          type: "booking",
        };
        lastWasRemoval.current = false;
      } else {
        return; // Nothing to do
      }
      
      const newEmail: Email = { ...template, id: emailCounter };
      
      // Add email with animation
      setEmails((prev) => [newEmail, ...prev.slice(0, 2)]);
      setEmailCounter((c) => c + 1);
      setSyncing(true);

      // Update bookings after "sync"
      setTimeout(() => {
        setBookings((prev) => {
          if (template.type === "cancellation" || template.type === "reschedule") {
            // Mark as leaving with type
            const leavingType: "cancelled" | "rescheduled" = template.type === "cancellation" ? "cancelled" : "rescheduled";
            return prev.map(b => 
              b.guest === template.guest 
                ? { ...b, status: "leaving" as const, leavingType }
                : b
            );
          } else {
            // Add new booking (max 3)
            const confirmed = prev.filter(b => b.status === "confirmed");
            if (confirmed.length < 3) {
              const guestInfo = guestPool.find(g => g.guest === template.guest);
              return [...prev.filter(b => b.status === "confirmed"), {
                platform: template.platform,
                guest: template.guest,
                guests: template.guests,
                dietary: guestInfo?.dietary || null,
                status: "confirmed" as const,
              }];
            }
            return prev;
          }
        });
        setSyncing(false);
        
        // If it was a removal, actually remove after showing the state briefly
        if (template.type === "cancellation" || template.type === "reschedule") {
          setTimeout(() => {
            setBookings(prev => prev.filter(b => b.guest !== template.guest));
          }, 1000);
        }
      }, 1500);
    };

    // Random interval between 5-8 seconds
    const scheduleNext = () => {
      const delay = 5000 + Math.random() * 3000;
      return setTimeout(() => {
        addEmail();
        timeoutId = scheduleNext();
      }, delay);
    };

    let timeoutId = scheduleNext();

    return () => clearTimeout(timeoutId);
  }, [emailCounter, bookings]);

  const visibleBookings = bookings;
  
  const totalGuests = visibleBookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.guests, 0);
  
  const activeBookings = visibleBookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="relative">
      <div className="rounded-2xl border border-[#E7E5E4] bg-white p-6 shadow-xl shadow-[#EA580C]/5">
        {/* Email Cards */}
        <div className="mb-4 space-y-2">
          {emails.map((email, index) => (
            <div
              key={email.id}
              className={`rounded-xl border border-[#E7E5E4] p-3 transition-all duration-500 ${
                index === 0 ? "bg-[#FDF6EC] scale-100" : "bg-[#FDF6EC]/50 scale-[0.98]"
              } ${
                email.type === "cancellation"
                  ? "border-red-200"
                  : email.type === "reschedule"
                  ? "border-amber-200"
                  : ""
              }`}
              style={{
                opacity: index === 0 ? 1 : 0.7 - index * 0.2,
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  email.type === "cancellation"
                    ? "bg-red-100"
                    : email.type === "reschedule"
                    ? "bg-amber-100"
                    : "bg-[#EA580C]/10"
                }`}>
                  {email.type === "cancellation" ? (
                    <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : email.type === "reschedule" ? (
                    <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-[#EA580C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#1C1917]">{email.platform}</p>
                    {email.type === "cancellation" && (
                      <span className="text-xs font-medium text-red-500">CANCELLED</span>
                    )}
                    {email.type === "reschedule" && (
                      <span className="text-xs font-medium text-amber-500">→ {email.date}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#78716C] truncate">
                    {email.guest} ({email.guests} guests)
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="my-4 flex justify-center">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
            syncing ? "bg-amber-500" : "bg-[#EA580C]"
          }`}>
            {syncing ? (
              <svg className="h-5 w-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
          </div>
        </div>

        {/* Calendar Card */}
        <div className="rounded-xl border border-[#E7E5E4] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-xs text-[#78716C]">{todayMonth}</p>
                <p className="text-2xl font-semibold text-[#EA580C]">{todayDay}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1C1917]">{todayDayName}</p>
                <p className="text-xs text-[#78716C]">
                  {activeBookings} booking{activeBookings !== 1 ? "s" : ""} · {totalGuests} guests
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
              syncing
                ? "bg-amber-50 text-amber-700"
                : "bg-green-50 text-green-700"
            }`}>
              {syncing ? (
                <>
                  <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Syncing...
                </>
              ) : (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  </span>
                  Live
                </>
              )}
            </span>
          </div>
          
          {/* Booking rows - fixed height container for exactly 3 rows */}
          <div className="space-y-1.5 h-[116px]">
            {visibleBookings.map((booking) => (
              <div
                key={`${booking.guest}-${booking.platform}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-500 ${
                  booking.status === "leaving" && booking.leavingType === "cancelled"
                    ? "bg-red-50 opacity-50"
                    : booking.status === "leaving" && booking.leavingType === "rescheduled"
                    ? "bg-amber-50 opacity-50"
                    : "bg-[#EA580C]/5"
                }`}
              >
                <span className="text-xs font-medium text-[#78716C] w-20 truncate">{booking.platform}</span>
                <span className={`flex-1 ${booking.status === "leaving" ? "line-through text-[#78716C]" : "text-[#1C1917]"}`}>
                  {booking.guest}
                </span>
                {booking.dietary && booking.status === "confirmed" && (
                  <span className="text-xs text-[#EA580C]">({booking.dietary})</span>
                )}
                {booking.status === "leaving" && booking.leavingType === "cancelled" && (
                  <span className="text-xs font-medium text-red-500">✕</span>
                )}
                {booking.status === "leaving" && booking.leavingType === "rescheduled" && (
                  <span className="text-xs font-medium text-amber-500">→</span>
                )}
                <span className="text-xs text-[#78716C] w-6 text-right">{booking.guests}g</span>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}
