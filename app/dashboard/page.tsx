"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type Platform = 'airbnb' | 'viator' | 'getyourguide' | 'civitatis' | 'tripadvisor' | 'booking_com' | 'expedia' | 'meitre' | 'other';

type BookingStatus = "confirmed" | "pending" | "cancelled" | "rescheduled";

type Booking = {
  id: string;
  platform: Platform;
  guestName: string;
  guestCount: number;
  date: Date;
  time?: string;
  status: BookingStatus;
  specialRequests?: string[];
  activityName?: string;
  duration?: string;
  // Email metadata
  emailSubject: string;
  emailPreview: string;
  emailDate: Date;
  emailId: string;
  extraction_confidence?: number;
  manually_reviewed?: boolean;
};

// Supabase booking row type
type SupabaseBooking = {
  id: string;
  platform: Platform;
  guest_name: string;
  guest_count: number | null;
  booking_date: string;
  booking_time: string | null;
  status: BookingStatus;
  activity_name: string | null;
  dietary_restrictions: string[] | null;
  special_requests: string | null;
  email_id: string;
  email_subject: string | null;
  email_preview: string | null;
  email_received_at: string | null;
  extraction_confidence: number | null;
  manually_reviewed: boolean | null;
};

// Platform brand colors
const platformColors: Record<Platform, string> = {
  airbnb: "#FF5A5F",
  viator: "#00AA6C",
  getyourguide: "#FF5533",
  civitatis: "#FF6B35",
  tripadvisor: "#34E0A1",
  booking_com: "#003580",
  expedia: "#FFCC00",
  meitre: "#6366F1",
  other: "#78716C",
};

const platformNames: Record<Platform, string> = {
  airbnb: "Airbnb",
  viator: "Viator",
  getyourguide: "GetYourGuide",
  civitatis: "Civitatis",
  tripadvisor: "TripAdvisor",
  booking_com: "Booking.com",
  expedia: "Expedia",
  meitre: "Meitre",
  other: "Other",
};

// Format time from HH:MM:SS to "7:00 PM"
function formatTimeString(timeStr: string | null): string | undefined {
  if (!timeStr) return undefined;
  const [hours, minutes] = timeStr.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

// Map Supabase booking to UI Booking type
function mapSupabaseBooking(row: SupabaseBooking): Booking {
  // Combine dietary_restrictions and special_requests into specialRequests array
  const specialRequests: string[] = [];
  if (row.dietary_restrictions && row.dietary_restrictions.length > 0) {
    specialRequests.push(...row.dietary_restrictions);
  }
  if (row.special_requests) {
    specialRequests.push(row.special_requests);
  }

  return {
    id: row.id,
    platform: row.platform,
    guestName: row.guest_name,
    guestCount: row.guest_count ?? 1,
    date: new Date(row.booking_date + "T00:00:00"),
    time: formatTimeString(row.booking_time),
    status: row.status,
    specialRequests: specialRequests.length > 0 ? specialRequests : undefined,
    activityName: row.activity_name ?? undefined,
    emailSubject: row.email_subject ?? "",
    emailPreview: row.email_preview ?? "",
    emailDate: row.email_received_at ? new Date(row.email_received_at) : new Date(),
    emailId: row.email_id,
    extraction_confidence: row.extraction_confidence ?? undefined,
    manually_reviewed: row.manually_reviewed ?? false,
  };
}

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

// Get low-confidence emails (extraction_confidence <= 0.5 and not manually reviewed)
function getLowConfidenceEmails(bookings: Booking[]): Booking[] {
  return [...bookings]
    .filter((b) => 
      b.extraction_confidence !== undefined && 
      b.extraction_confidence <= 0.5 && 
      !b.manually_reviewed
    )
    .sort((a, b) => b.emailDate.getTime() - a.emailDate.getTime());
}

// Email item component for reuse
function EmailItem({ 
  booking, 
  isFirst = false, 
  isLowConfidence = false,
  onClick
}: { 
  booking: Booking; 
  isFirst?: boolean; 
  isLowConfidence?: boolean;
  onClick?: () => void;
}) {
  const isClickable = !!onClick;
  const Component = isClickable ? 'button' : 'div';
  
  return (
    <Component
      onClick={isClickable ? onClick : undefined}
      className={`w-full text-left rounded-lg border p-2.5 transition-all ${
        isLowConfidence
          ? "border-orange-200 bg-orange-50 hover:border-orange-300 hover:bg-orange-100 cursor-pointer"
          : isClickable
          ? isFirst
            ? "border-[#E7E5E4] bg-[#FDF6EC] hover:border-[#EA580C]/30 hover:shadow-sm cursor-pointer"
            : "border-[#E7E5E4] bg-white hover:border-[#EA580C]/30 hover:shadow-sm cursor-pointer"
          : isFirst
          ? "border-[#E7E5E4] bg-[#FDF6EC]"
          : "border-[#E7E5E4] bg-white"
      }`}
    >
      <div className="flex items-start gap-2">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
            isLowConfidence
              ? "bg-orange-100"
              : booking.status === "cancelled"
              ? "bg-red-100"
              : booking.status === "rescheduled"
              ? "bg-amber-100"
              : "bg-[#EA580C]/10"
          }`}
        >
          {isLowConfidence ? (
            <svg className="h-2.5 w-2.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : booking.status === "cancelled" ? (
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
          {isLowConfidence && booking.extraction_confidence !== undefined && (
            <div className="mt-0.5 flex items-center justify-between">
              <p className="text-xs text-orange-600">
                {Math.round(booking.extraction_confidence * 100)}% confidence
              </p>
              <span className="text-xs text-orange-500">Click to review</span>
            </div>
          )}
        </div>
      </div>
    </Component>
  );
}

// Email Stack Component
function EmailStack({ 
  bookings, 
  onBookingClick,
  onNavigateToWeek 
}: { 
  bookings: Booking[]; 
  onBookingClick?: (booking: Booking) => void;
  onNavigateToWeek?: (date: Date) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const latestEmails = getLatestEmails(bookings, 3);
  const lowConfidenceEmails = getLowConfidenceEmails(bookings);
  const hasLowConfidence = lowConfidenceEmails.length > 0;
  const mostRecent = latestEmails[0];

  const handleLowConfidenceClick = (booking: Booking) => {
    setExpanded(false);
    onBookingClick?.(booking);
  };

  const handleRecentEmailClick = (booking: Booking) => {
    setExpanded(false);
    onNavigateToWeek?.(booking.date);
  };

  if (bookings.length === 0) {
    return (
      <span className="text-xs text-[#78716C]">No emails yet</span>
    );
  }

  return (
    <div className="relative">
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2"
      >
        <div className="relative">
          <svg className="h-4 w-4 text-[#EA580C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {/* Orange dot indicator for low-confidence emails */}
          {hasLowConfidence && (
            <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500"></span>
            </span>
          )}
        </div>
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
        <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-xl border border-[#E7E5E4] bg-white p-3 shadow-lg max-h-[400px] overflow-y-auto">
          {/* Low-Confidence Emails Section */}
          {hasLowConfidence && (
            <div className="mb-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                <p className="text-xs font-medium text-orange-600">Low-Confidence Emails</p>
                <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-600">
                  {lowConfidenceEmails.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {lowConfidenceEmails.map((booking) => (
                  <EmailItem 
                    key={booking.id} 
                    booking={booking} 
                    isLowConfidence 
                    onClick={() => handleLowConfidenceClick(booking)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent Emails Section */}
          <div>
            <p className="mb-2 text-xs font-medium text-[#78716C]">Recent Emails</p>
            <div className="space-y-1.5">
              {latestEmails.map((booking, index) => (
                <EmailItem 
                  key={booking.id} 
                  booking={booking} 
                  isFirst={index === 0} 
                  onClick={() => handleRecentEmailClick(booking)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Convert 12-hour time format back to 24-hour HH:MM:SS for API
function parseTimeToApiFormat(time: string | undefined): string | null {
  if (!time) return null;
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
}

// Format date to YYYY-MM-DD for API
function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Booking Detail Modal
function BookingModal({
  booking,
  onClose,
  onUpdate,
  onDelete,
}: {
  booking: Booking;
  onClose: () => void;
  onUpdate: (updatedBooking: Booking) => void;
  onDelete: (bookingId: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // Edit form state
  const [editGuestName, setEditGuestName] = useState(booking.guestName);
  const [editGuestCount, setEditGuestCount] = useState(booking.guestCount);
  const [editDate, setEditDate] = useState(formatDateForApi(booking.date));
  const [editTime, setEditTime] = useState(booking.time || "");
  const [editPlatform, setEditPlatform] = useState<Platform>(booking.platform);
  const [editActivityName, setEditActivityName] = useState(booking.activityName || "");
  const [editDietaryRestrictions, setEditDietaryRestrictions] = useState(
    booking.specialRequests?.filter(r => 
      r.toLowerCase().includes("vegetarian") || 
      r.toLowerCase().includes("vegan") || 
      r.toLowerCase().includes("gluten")
    ).join(", ") || ""
  );
  const [editSpecialRequests, setEditSpecialRequests] = useState(
    booking.specialRequests?.filter(r => 
      !r.toLowerCase().includes("vegetarian") && 
      !r.toLowerCase().includes("vegan") && 
      !r.toLowerCase().includes("gluten")
    ).join(", ") || ""
  );
  const [editStatus, setEditStatus] = useState<BookingStatus>(booking.status);

  const platformColor = platformColors[booking.platform];
  const platformName = platformNames[booking.platform];

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Parse dietary restrictions into array
      const dietaryArray = editDietaryRestrictions
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
      
      // Check if this is a low-confidence booking that should be marked as reviewed
      const isLowConfidence = booking.extraction_confidence !== undefined && 
        booking.extraction_confidence <= 0.5 && 
        !booking.manually_reviewed;
      
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: booking.id,
          guest_name: editGuestName,
          guest_count: editGuestCount,
          booking_date: editDate,
          booking_time: parseTimeToApiFormat(editTime),
          platform: editPlatform,
          activity_name: editActivityName || null,
          dietary_restrictions: dietaryArray.length > 0 ? dietaryArray : null,
          special_requests: editSpecialRequests || null,
          status: editStatus,
          // Mark as manually reviewed if it was a low-confidence extraction
          ...(isLowConfidence && { manually_reviewed: true }),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update booking");
      }
      
      const { booking: updatedBookingData } = await response.json();
      
      // Map back to UI format
      const updatedBooking = mapSupabaseBooking(updatedBookingData);
      onUpdate(updatedBooking);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving booking:", err);
      setSaveError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form state
    setEditGuestName(booking.guestName);
    setEditGuestCount(booking.guestCount);
    setEditDate(formatDateForApi(booking.date));
    setEditTime(booking.time || "");
    setEditPlatform(booking.platform);
    setEditActivityName(booking.activityName || "");
    setEditDietaryRestrictions(
      booking.specialRequests?.filter(r => 
        r.toLowerCase().includes("vegetarian") || 
        r.toLowerCase().includes("vegan") || 
        r.toLowerCase().includes("gluten")
      ).join(", ") || ""
    );
    setEditSpecialRequests(
      booking.specialRequests?.filter(r => 
        !r.toLowerCase().includes("vegetarian") && 
        !r.toLowerCase().includes("vegan") && 
        !r.toLowerCase().includes("gluten")
      ).join(", ") || ""
    );
    setEditStatus(booking.status);
    setSaveError(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: booking.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete booking");
      }

      onDelete(booking.id);
      onClose();
    } catch (err) {
      console.error("Error deleting booking:", err);
      setDeleteError(err instanceof Error ? err.message : "Failed to delete booking");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={isEditing ? undefined : onClose}
      />
      
      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#E7E5E4] bg-white p-6 shadow-xl">
        {/* Header buttons */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#78716C] transition-colors hover:bg-[#FDF6EC] hover:text-[#EA580C]"
                title="Edit booking"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#78716C] transition-colors hover:bg-red-50 hover:text-red-500"
                title="Delete booking"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
          <button
            onClick={isEditing ? handleCancel : onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#78716C] transition-colors hover:bg-[#FDF6EC] hover:text-[#1C1917]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1C1917]">Edit Booking</h3>
            
            {saveError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {saveError}
              </div>
            )}
            
            {/* Guest Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Guest Name</label>
              <input
                type="text"
                value={editGuestName}
                onChange={(e) => setEditGuestName(e.target.value)}
                className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            
            {/* Guest Count */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Number of Guests</label>
              <input
                type="number"
                min="1"
                value={editGuestCount}
                onChange={(e) => setEditGuestCount(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            
            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Time</label>
                <input
                  type="text"
                  placeholder="e.g. 7:00 PM"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>
            </div>
            
            {/* Platform */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Platform</label>
              <select
                value={editPlatform}
                onChange={(e) => setEditPlatform(e.target.value as Platform)}
                className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              >
                {Object.entries(platformNames).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
            
            {/* Activity Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Activity Name</label>
              <input
                type="text"
                value={editActivityName}
                onChange={(e) => setEditActivityName(e.target.value)}
                placeholder="e.g. Sunset Wine Tour"
                className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            
            {/* Dietary Restrictions */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Dietary Restrictions</label>
              <input
                type="text"
                value={editDietaryRestrictions}
                onChange={(e) => setEditDietaryRestrictions(e.target.value)}
                placeholder="e.g. 2 vegetarian, 1 gluten-free"
                className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
              <p className="mt-1 text-xs text-[#A8A29E]">Comma-separated list</p>
            </div>
            
            {/* Special Requests */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Special Requests</label>
              <textarea
                value={editSpecialRequests}
                onChange={(e) => setEditSpecialRequests(e.target.value)}
                placeholder="Any other notes or requests..."
                rows={2}
                className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            
            {/* Status */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as BookingStatus)}
                className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Delete button */}
            <div className="border-t border-[#E7E5E4] pt-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Booking
              </button>
            </div>
            
            {/* Save/Cancel buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 rounded-full border border-[#E7E5E4] px-4 py-2.5 text-sm font-medium text-[#78716C] transition-colors hover:bg-[#FAF8F5] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#EA580C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C2410C] disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <>
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
                {booking.status === "pending" && (
                  <span className="text-xs font-medium text-slate-600">Pending</span>
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
            {booking.emailSubject && (
              <div className="rounded-xl border border-[#E7E5E4] bg-[#FAF8F5] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-[#78716C]">Original Email</p>
                  <span className="text-xs text-[#78716C]">{formatEmailDate(booking.emailDate)}</span>
                </div>
                <p className="mb-2 text-sm font-medium text-[#1C1917]">{booking.emailSubject}</p>
                <p className="text-xs leading-relaxed text-[#78716C]">{booking.emailPreview}</p>
              </div>
            )}

            {/* Open in Gmail */}
            <a
              href={`https://mail.google.com/mail/u/0/#inbox/${booking.emailId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#EA580C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C2410C]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Open in Gmail
            </a>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/20" 
            onClick={() => !isDeleting && setShowDeleteConfirm(false)} 
          />
          <div className="relative mx-4 w-full max-w-sm rounded-xl border border-[#E7E5E4] bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-[#1C1917]">Delete Booking?</h4>
            <p className="mb-1 text-sm text-[#78716C]">
              Are you sure you want to delete the booking for <span className="font-medium text-[#1C1917]">{booking.guestName}</span>?
            </p>
            <p className="mb-4 text-xs text-[#A8A29E]">
              This action cannot be undone. The booking will be permanently removed.
            </p>
            
            {deleteError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {deleteError}
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="flex-1 rounded-full border border-[#E7E5E4] px-4 py-2.5 text-sm font-medium text-[#78716C] transition-colors hover:bg-[#FAF8F5] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Create Booking Modal
function CreateBookingModal({
  initialDate,
  onClose,
  onCreate,
}: {
  initialDate: Date;
  onClose: () => void;
  onCreate: (newBooking: Booking) => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Form state
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [date, setDate] = useState(formatDateForApi(initialDate));
  const [time, setTime] = useState("");
  const [platform, setPlatform] = useState<Platform>("other");
  const [activityName, setActivityName] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [status, setStatus] = useState<BookingStatus>("confirmed");

  const handleSave = async () => {
    if (!guestName.trim()) {
      setSaveError("Guest name is required");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Parse dietary restrictions into array
      const dietaryArray = dietaryRestrictions
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
      
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: guestName,
          guest_count: guestCount,
          booking_date: date,
          booking_time: parseTimeToApiFormat(time),
          platform,
          activity_name: activityName || null,
          dietary_restrictions: dietaryArray.length > 0 ? dietaryArray : null,
          special_requests: specialRequests || null,
          status,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }
      
      const { booking: newBookingData } = await response.json();
      
      // Map back to UI format
      const newBooking = mapSupabaseBooking(newBookingData);
      onCreate(newBooking);
      onClose();
    } catch (err) {
      console.error("Error creating booking:", err);
      setSaveError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#E7E5E4] bg-white p-6 shadow-xl">
        {/* Header button */}
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#78716C] transition-colors hover:bg-[#FDF6EC] hover:text-[#1C1917]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#1C1917]">New Booking</h3>
          
          {saveError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {saveError}
            </div>
          )}
          
          {/* Guest Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Guest Name *</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter guest name"
              className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
            />
          </div>
          
          {/* Guest Count */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Number of Guests</label>
            <input
              type="number"
              min="1"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
              className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
            />
          </div>
          
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Time</label>
              <input
                type="text"
                placeholder="e.g. 7:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
          </div>
          
          {/* Platform */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
            >
              {Object.entries(platformNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
          
          {/* Activity Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Activity Name</label>
            <input
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="e.g. Sunset Wine Tour"
              className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
            />
          </div>
          
          {/* Dietary Restrictions */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Dietary Restrictions</label>
            <input
              type="text"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
              placeholder="e.g. 2 vegetarian, 1 gluten-free"
              className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
            />
            <p className="mt-1 text-xs text-[#A8A29E]">Comma-separated list</p>
          </div>
          
          {/* Special Requests */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Special Requests</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any other notes or requests..."
              rows={2}
              className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
            />
          </div>
          
          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#78716C]">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
              className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
            >
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          {/* Save/Cancel buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-full border border-[#E7E5E4] px-4 py-2.5 text-sm font-medium text-[#78716C] transition-colors hover:bg-[#FAF8F5] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#EA580C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C2410C] disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Booking"
              )}
            </button>
          </div>
        </div>
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
          : booking.status === "pending"
          ? "border-slate-200 bg-slate-50/50 hover:border-slate-300"
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
        {booking.status === "pending" && (
          <span className="text-xs font-medium text-slate-600">Pending</span>
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
      {booking.specialRequests && booking.specialRequests.length > 0 && (booking.status === "confirmed" || booking.status === "pending") && (
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
  onAddBooking,
}: {
  date: Date;
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
  onAddBooking: (date: Date) => void;
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
        
        {/* Dietary summary — fixed height so header alignment is consistent across days */}
        <div className="mt-2 flex min-h-[26px] flex-wrap items-center gap-1">
          {hasDietary && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Bookings list with scroll fade */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="absolute inset-0 space-y-2 overflow-y-auto p-2"
        >
          {bookings.length === 0 ? (
            <button
              onClick={() => onAddBooking(date)}
              className="flex h-full w-full flex-col items-center justify-center gap-2 py-8 text-[#78716C] transition-colors hover:text-[#EA580C]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-xs">Add booking</span>
            </button>
          ) : (
            <>
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onClick={() => onBookingClick(booking)}
                />
              ))}
              {/* Add booking button */}
              <button
                onClick={() => onAddBooking(date)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E7E5E4] py-2 text-xs text-[#78716C] transition-colors hover:border-[#EA580C] hover:text-[#EA580C]"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add
              </button>
            </>
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

      {/* Booking info - same format as weekly view: bookings · guests, no icon */}
      {hasBookings && inCurrentMonth && (
        <div className="mt-1 flex flex-col gap-1">
          <p className="text-xs text-[#78716C]">
            {confirmedBookings.length} booking{confirmedBookings.length !== 1 ? "s" : ""} · {totalGuests} guest
            {totalGuests !== 1 ? "s" : ""}
          </p>

          {/* Dietary summary — same as weekly view */}
          {hasDietary && (
            <div className="flex flex-wrap items-center gap-1">
              {dietary.vegetarian > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-1.5 py-0.5 text-xs text-green-700" title={`${dietary.vegetarian} vegetarian`}>
                  <span>🥬</span> {dietary.vegetarian}
                </span>
              )}
              {dietary.vegan > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700" title={`${dietary.vegan} vegan`}>
                  <span>🌱</span> {dietary.vegan}
                </span>
              )}
              {dietary.glutenFree > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700" title={`${dietary.glutenFree} gluten-free`}>
                  <span>🌾</span> {dietary.glutenFree}
                </span>
              )}
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

// Loading skeleton for day columns
function DayColumnSkeleton() {
  return (
    <div className="flex min-w-[220px] flex-1 flex-col rounded-xl border border-[#E7E5E4] bg-white">
      <div className="shrink-0 border-b border-[#E7E5E4] p-3">
        <div className="h-4 w-12 animate-pulse rounded bg-[#E7E5E4]" />
        <div className="mt-1 h-6 w-16 animate-pulse rounded bg-[#E7E5E4]" />
        <div className="mt-2 h-4 w-24 animate-pulse rounded bg-[#E7E5E4]" />
        <div className="mt-2 h-[26px]" />
      </div>
      <div className="flex-1 space-y-2 p-2">
        <div className="h-24 animate-pulse rounded-lg bg-[#E7E5E4]" />
        <div className="h-24 animate-pulse rounded-lg bg-[#E7E5E4]" />
      </div>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-[#E7E5E4] bg-white p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF6EC]">
        <svg className="h-8 w-8 text-[#EA580C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#1C1917]">No bookings yet</h3>
      <p className="mt-1 max-w-sm text-center text-sm text-[#78716C]">
        Once we sync your email, your bookings from Airbnb, Viator, and GetYourGuide will appear here automatically.
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Data state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // View state
  const [currentWeekStart, setCurrentWeekStart] = useState(() => new Date());
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [createBookingDate, setCreateBookingDate] = useState<Date | null>(null);
  
  const weekDates = getWeekDates(currentWeekStart);

  // Check authentication and fetch bookings
  useEffect(() => {
    async function loadData() {
      try {
        // Check auth
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        
        if (!meData.user) {
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Fetch bookings
        const bookingsRes = await fetch("/api/bookings");
        if (!bookingsRes.ok) {
          throw new Error("Failed to fetch bookings");
        }
        
        const bookingsData = await bookingsRes.json();
        const mappedBookings = (bookingsData.bookings as SupabaseBooking[]).map(mapSupabaseBooking);
        setBookings(mappedBookings);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

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

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => isSameDay(booking.date, date));
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

  // Show loading state while checking auth
  if (isAuthenticated === null || (isAuthenticated === false)) {
    return (
      <div className="flex h-screen flex-col bg-[#FAF8F5]">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#EA580C] border-t-transparent" />
        </div>
      </div>
    );
  }

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

        {/* Error state */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-700 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

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
              <EmailStack 
                bookings={bookings} 
                onBookingClick={setSelectedBooking}
                onNavigateToWeek={handleMonthDayClick}
              />
            </div>
          </div>
        </div>

        {/* Calendar view - fills remaining height */}
        {loading ? (
          <div className="flex min-h-0 flex-1 gap-2 overflow-x-auto sm:gap-3">
            {[...Array(7)].map((_, i) => (
              <DayColumnSkeleton key={i} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState />
        ) : viewMode === "week" ? (
          <div className="flex min-h-0 flex-1 gap-2 overflow-x-auto sm:gap-3">
            {weekDates.map((date) => (
              <DayColumn
                key={date.toISOString()}
                date={date}
                bookings={getBookingsForDate(date)}
                onBookingClick={setSelectedBooking}
                onAddBooking={setCreateBookingDate}
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
          onUpdate={(updatedBooking) => {
            setBookings((prev) =>
              prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
            );
            setSelectedBooking(updatedBooking);
          }}
          onDelete={(bookingId) => {
            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
            setSelectedBooking(null);
          }}
        />
      )}

      {/* Create booking modal */}
      {createBookingDate && (
        <CreateBookingModal
          initialDate={createBookingDate}
          onClose={() => setCreateBookingDate(null)}
          onCreate={(newBooking) => {
            setBookings((prev) => [...prev, newBooking]);
          }}
        />
      )}
    </div>
  );
}
