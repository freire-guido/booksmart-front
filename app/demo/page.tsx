"use client";

import { useState } from "react";
import Link from "next/link";

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
  isBooking?: boolean;
  platform?: "airbnb" | "viator" | "getyourguide";
}

const emails: Email[] = [
  {
    id: "1",
    from: "Airbnb",
    fromEmail: "automated@airbnb.com",
    subject: "Reservation confirmed – Natalia arrives Feb 15",
    preview: "Reservation confirmed. Natalia O. and 1 guest will arrive on Feb 15 for 3 nights. Check-in: 3:00 PM. Notes: Vegetarian, early check-in requested.",
    date: "6:42 PM",
    read: false,
    starred: false,
    hasAttachment: false,
    isBooking: true,
    platform: "airbnb",
  },
  {
    id: "2",
    from: "Calendly",
    fromEmail: "teamcalendly@send.calendly.com",
    subject: "Complete your Calendly account setup",
    preview: "You're so close! Complete your account setup to start scheduling meetings with ease.",
    date: "6:12 PM",
    read: false,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "3",
    from: "Namecheap Support",
    fromEmail: "support@namecheap.com",
    subject: "Namecheap Order Summary (Order# 193728786)",
    preview: "Namecheap Details Order Date: Feb. 2, 2026. Thank you for your order! Your domain has been registered.",
    date: "4:58 PM",
    read: false,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "4",
    from: "Viator",
    fromEmail: "booking@viator.com",
    subject: "New Booking: Buenos Aires Food Tour – Luisana L.",
    preview: "You have a new booking! Guest: Luisana L., Party size: 2, Tour: Buenos Aires Food & Wine Experience, Date: Feb 15 at 2:00 PM. Special request: Wheelchair access needed.",
    date: "4:55 PM",
    read: false,
    starred: true,
    hasAttachment: false,
    isBooking: true,
    platform: "viator",
  },
  {
    id: "5",
    from: "Namecheap Support",
    fromEmail: "support@namecheap.com",
    subject: "Your confirmation code",
    preview: "Sign-in verification code: 847291. This code expires in 10 minutes.",
    date: "4:55 PM",
    read: true,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "6",
    from: "Google",
    fromEmail: "no-reply@accounts.google.com",
    subject: "Security alert for freireguidoi@gmail.com",
    preview: "This is a copy of a security alert sent to freireguidoi@gmail.com. freireguido@outlook.com is the recovery email for this account. If you don't recognize this a",
    date: "4:12 PM",
    read: false,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "7",
    from: "Google",
    fromEmail: "no-reply@accounts.google.com",
    subject: "Security alert",
    preview: "You recently enabled access for a new app. Review this activity and secure your Google Account data,",
    date: "4:12 PM",
    read: false,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "8",
    from: "SECRETARIA TECNICA",
    fromEmail: "tecnica@de.fcen.uba.ar",
    subject: "[DC-Anuncios] [FCEyN] Corte de suministro de gas - martes 3 de febrero",
    preview: "A partir de mañana martes 3 de febrero se realizarán tareas de mantenimiento en las instalaciones de g",
    date: "3:27 PM",
    read: true,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "9",
    from: "GetYourGuide",
    fromEmail: "booking@getyourguide.com",
    subject: "Booking Confirmation: Ricardo D. – City Tour Feb 15",
    preview: "Great news! You have a new booking. Guest: Ricardo D., Guests: 4, Activity: Buenos Aires City Highlights Tour, Date: February 15, 2026. Dietary: Gluten-free (1 guest)",
    date: "2:30 PM",
    read: false,
    starred: false,
    hasAttachment: false,
    isBooking: true,
    platform: "getyourguide",
  },
  {
    id: "10",
    from: "Esteban Feuerstein",
    fromEmail: "efeuerst@dc.uba.ar",
    subject: "[DC-Todos] Fwd: LATIN 2026 - poster deadline February 8",
    preview: "Hasta el 8 de febrero para enviar posters al congreso LATIN 2026 que se realizará en Latinoamérica en",
    date: "1:45 PM",
    read: true,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "11",
    from: "Mercado Libre",
    fromEmail: "no-responder@mercadolibre.com",
    subject: "Tu compra está en camino",
    preview: "Llega hoy entre las 12:00 y las 18:00. Tu pedido FRGU6030470 ya salió del centro de distribución.",
    date: "11:30 AM",
    read: false,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "12",
    from: "Monika J via Otter",
    fromEmail: "no-reply@otter.ai",
    subject: "Meeting Summary for MARS weekly meeting",
    preview: "Monika J shared a meeting summary with you. Key discussion points: project timeline, repository with g",
    date: "10:15 AM",
    read: true,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "13",
    from: "Airbnb",
    fromEmail: "express@airbnb.com",
    subject: "Booking update: Ricardo M. – Dates changed",
    preview: "A guest has modified their reservation. Ricardo M. changed their booking from Feb 20-22 to Feb 18-20. Please confirm availability.",
    date: "9:21 AM",
    read: false,
    starred: false,
    hasAttachment: false,
    isBooking: true,
    platform: "airbnb",
  },
  {
    id: "14",
    from: "'AGD EXACTAS' via a.",
    fromEmail: "alumnos@dc.uba.ar",
    subject: "[Alumnos] Recordatorio: Entrega de kits escolares para hijas e hijos de afiliades",
    preview: "Entrega de kits escolares para hijas e hijos de afiliades a AGD UBA. Deben completar el formulario antes del 13-2. No se entregaran kits a",
    date: "Feb 1",
    read: false,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "15",
    from: "EA Global Admissions",
    fromEmail: "admissions@eaglobal.org",
    subject: "EA Global 2026 | More Information Required",
    preview: "Hi Guido, Thank you for your application. We'd love to learn more about you and your involvement with effective altruism to properly",
    date: "Feb 1",
    read: true,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "16",
    from: "Slack",
    fromEmail: "no-reply@slack.com",
    subject: "Slack confirmation code: KMJ-TO4",
    preview: "Use this code to verify your email address in Slack. This code expires in 10 minutes.",
    date: "Feb 1",
    read: false,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "17",
    from: "Portfolio Personal",
    fromEmail: "envios@portfoliopersonal.com",
    subject: "Orden en proceso - NVDA",
    preview: "Orden de Producto: Cedears Operación: Venta Instrumento: NVDA Fecha de operación: 02/02/2026",
    date: "Feb 1",
    read: false,
    starred: false,
    hasAttachment: false,
  },
  {
    id: "18",
    from: "Viviana Cotik",
    fromEmail: "vivianacotik@gmail.com",
    subject: "Re: Paper draft feedback",
    preview: "11:46 Viviana Cotik <vivianacotik@gmail.com> Thanks for sending the draft! I've attached my comments.",
    date: "Jan 31",
    read: true,
    starred: true,
    hasAttachment: true,
  },
  {
    id: "19",
    from: "Viator",
    fromEmail: "cancellations@viator.com",
    subject: "Booking Cancelled: Miguel A.S. (Jan 30)",
    preview: "A booking has been cancelled. Guest: Miguel A.S., Original date: January 30, 2026. Reason: Guest requested cancellation.",
    date: "Jan 30",
    read: true,
    starred: false,
    hasAttachment: false,
    isBooking: true,
    platform: "viator",
  },
  {
    id: "20",
    from: "Brubank",
    fromEmail: "noresponder@brubank.com.ar",
    subject: "Resumen de cuenta - Enero 2026",
    preview: "Ya está disponible tu resumen de cuenta de enero. Para acceder deberás abrir el archivo adjunto ingresando los últimos 5",
    date: "Jan 31",
    read: false,
    starred: false,
    hasAttachment: true,
  },
  {
    id: "21",
    from: "iRacing.com",
    fromEmail: "noreply@iracing.com",
    subject: "Protest Decision: Case #847291",
    preview: "Your protest has been reviewed. Violation: 6.12.3 - Retaliation or Intentional Wrecking. Penalty issued to other driver.",
    date: "Jan 31",
    read: true,
    starred: false,
    hasAttachment: false,
  },
];

export default function DemoPage() {
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [starredEmails, setStarredEmails] = useState<Set<string>>(
    new Set(emails.filter((e) => e.starred).map((e) => e.id))
  );

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredEmails((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getPlatformColor = (platform?: string) => {
    switch (platform) {
      case "airbnb":
        return "#FF5A5F";
      case "viator":
        return "#00AA6C";
      case "getyourguide":
        return "#FF5533";
      default:
        return "#5f6368";
    }
  };

  const bookingCount = emails.filter((e) => e.isBooking).length;

  return (
    <div className="min-h-screen bg-[#f6f8fc]" style={{ fontFamily: "'Google Sans', Roboto, Arial, sans-serif" }}>
      {/* Gmail Header */}
      <header className="h-16 flex items-center px-2 border-b border-transparent">
        <div className="flex items-center gap-1 flex-1">
          {/* Hamburger */}
          <button className="p-3 hover:bg-[#e8eaed] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>

          {/* Gmail Logo */}
          <a href="#" className="flex items-center gap-2 px-3 py-2">
            <svg className="h-10" viewBox="0 0 75 24" fill="none">
              <path d="M7.5 18.5H3V6.5L12 13L21 6.5V18.5H16.5V11L12 14.5L7.5 11V18.5Z" fill="#4285F4"/>
              <path d="M21 4.5H3L12 11L21 4.5Z" fill="#EA4335"/>
              <path d="M3 6.5V18.5L7.5 14.5V11L3 6.5Z" fill="#FBBC05"/>
              <path d="M21 6.5V18.5L16.5 14.5V11L21 6.5Z" fill="#34A853"/>
            </svg>
            <span className="text-[22px] text-[#5f6368] font-normal tracking-tight">Gmail</span>
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-[720px] mx-2">
          <div className="bg-[#eaf1fb] hover:bg-white hover:shadow-[0_1px_3px_rgba(60,64,67,0.3)] rounded-full flex items-center h-12 px-4 transition-all focus-within:bg-white focus-within:shadow-[0_1px_3px_rgba(60,64,67,0.3)]">
            <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search mail"
              className="flex-1 bg-transparent border-none outline-none px-4 text-[16px] text-[#202124] placeholder:text-[#5f6368]"
            />
            <button className="p-2 hover:bg-[#e8eaed] rounded-full">
              <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1 flex-1 justify-end">
          <button className="p-3 hover:bg-[#e8eaed] rounded-full">
            <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
            </svg>
          </button>
          <button className="p-3 hover:bg-[#e8eaed] rounded-full">
            <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
            </svg>
          </button>
          <button className="p-3 hover:bg-[#e8eaed] rounded-full">
            <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
          {/* Profile */}
          <button className="ml-2 w-8 h-8 rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#1a73e8] flex items-center justify-center text-white text-sm font-medium">
              G
            </div>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[256px] pt-2 px-2 flex-shrink-0">
          {/* Compose Button */}
          <button className="flex items-center gap-3 bg-[#c2e7ff] hover:shadow-[0_1px_3px_rgba(60,64,67,0.3)] text-[#001d35] rounded-2xl pl-3 pr-6 py-4 mb-4 transition-all">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            <span className="text-sm font-medium">Compose</span>
          </button>

          {/* Navigation */}
          <nav className="space-y-0.5">
            <button className="w-full flex items-center gap-4 px-3 py-1 rounded-r-full bg-[#d3e3fd] text-[#001d35] font-medium text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"/>
              </svg>
              <span className="flex-1 text-left">Inbox</span>
              <span className="text-xs font-medium">12</span>
            </button>
            {[
              { name: "Starred", icon: "star" },
              { name: "Snoozed", icon: "clock" },
              { name: "Sent", icon: "send" },
              { name: "Drafts", icon: "file", count: 3 },
              { name: "More", icon: "chevron" },
            ].map((item) => (
              <button
                key={item.name}
                className="w-full flex items-center gap-4 px-3 py-1 rounded-r-full text-[#5f6368] hover:bg-[#e8eaed] text-sm transition-colors"
              >
                {item.icon === "star" && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                )}
                {item.icon === "clock" && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                  </svg>
                )}
                {item.icon === "send" && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                )}
                {item.icon === "file" && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z"/>
                  </svg>
                )}
                {item.icon === "chevron" && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                  </svg>
                )}
                <span className="flex-1 text-left">{item.name}</span>
                {item.count && <span className="text-xs">{item.count}</span>}
              </button>
            ))}
          </nav>

          {/* Labels */}
          <div className="mt-4 pt-3 border-t border-[#e8eaed]">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-sm font-medium text-[#5f6368]">Labels</span>
              <button className="p-1 hover:bg-[#e8eaed] rounded-full">
                <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </button>
            </div>
            {[
              { name: "Personal", color: "#15c" },
              { name: "Work", color: "#fa903e" },
              { name: "Travel", color: "#16a766" },
            ].map((label) => (
              <button
                key={label.name}
                className="w-full flex items-center gap-4 px-3 py-1 rounded-r-full text-[#5f6368] hover:bg-[#e8eaed] text-sm transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={label.color}>
                  <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>
                </svg>
                <span>{label.name}</span>
              </button>
            ))}
          </div>

          {/* BookSmart Badge */}
          <div className="mt-6 mx-1 p-4 bg-gradient-to-br from-[#fef3e8] to-[#fff8f3] rounded-2xl border border-[#EA580C]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#EA580C] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-[#EA580C] text-sm">BookSmart</span>
            </div>
            <p className="text-xs text-[#5f6368] mb-3">
              <span className="font-medium text-[#202124]">{bookingCount} booking emails</span> detected
            </p>
            <Link
              href="/"
              className="block text-center bg-[#EA580C] text-white text-sm font-medium py-2.5 rounded-full hover:bg-[#C2410C] transition-colors"
            >
              Sync to Dashboard
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-tl-2xl mr-2 overflow-hidden flex flex-col min-h-[calc(100vh-64px)]">
          {/* Toolbar */}
          <div className="flex items-center gap-1 px-2 py-1.5 border-b border-[#e8eaed]">
            <button className="p-2 hover:bg-[#e8eaed] rounded">
              <div className="w-[18px] h-[18px] border-2 border-[#5f6368] rounded-sm" />
            </button>
            <button className="p-2 hover:bg-[#e8eaed] rounded">
              <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
            </button>
            <button className="p-2 hover:bg-[#e8eaed] rounded">
              <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
            <div className="flex-1" />
            <span className="text-xs text-[#5f6368] px-2">1-{emails.length} of {emails.length}</span>
            <button className="p-2 hover:bg-[#e8eaed] rounded opacity-40 cursor-not-allowed">
              <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <button className="p-2 hover:bg-[#e8eaed] rounded opacity-40 cursor-not-allowed">
              <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-auto">
            {emails.map((email) => (
              <div
                key={email.id}
                className={`flex items-center border-b border-[#e8eaed] cursor-pointer transition-colors ${
                  !email.read ? "bg-[#f2f6fc]" : "bg-white hover:bg-[#f5f5f5]"
                } ${selectedEmails.has(email.id) ? "!bg-[#c2dbff]" : ""} hover:shadow-[inset_1px_0_0_#dadce0,inset_-1px_0_0_#dadce0,0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)]`}
                style={{ height: "40px" }}
              >
                {/* Checkbox */}
                <div className="w-[52px] flex items-center justify-center">
                  <button
                    onClick={(e) => toggleSelect(email.id, e)}
                    className="p-1.5 hover:bg-[#e8eaed] rounded"
                  >
                    <div
                      className={`w-[18px] h-[18px] border-2 rounded-sm flex items-center justify-center transition-colors ${
                        selectedEmails.has(email.id)
                          ? "bg-[#1a73e8] border-[#1a73e8]"
                          : "border-[#5f6368]"
                      }`}
                    >
                      {selectedEmails.has(email.id) && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      )}
                    </div>
                  </button>
                </div>

                {/* Star */}
                <button
                  onClick={(e) => toggleStar(email.id, e)}
                  className="p-1.5 hover:bg-[#e8eaed] rounded mr-2"
                >
                  <svg
                    className={`w-5 h-5 ${
                      starredEmails.has(email.id) ? "text-[#f4b400]" : "text-[#5f6368]"
                    }`}
                    viewBox="0 0 24 24"
                    fill={starredEmails.has(email.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>

                {/* Booking dot */}
                {email.isBooking && (
                  <span
                    className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: getPlatformColor(email.platform) }}
                  />
                )}

                {/* Sender */}
                <div className="w-[200px] pr-4 flex-shrink-0 overflow-hidden">
                  <span
                    className={`text-sm truncate block ${
                      !email.read ? "font-semibold text-[#202124]" : "text-[#5f6368]"
                    }`}
                  >
                    {email.from}
                  </span>
                </div>

                {/* Subject + Preview */}
                <div className="flex-1 flex items-center gap-1 min-w-0 pr-4 overflow-hidden">
                  <span
                    className={`truncate text-sm ${
                      !email.read ? "font-semibold text-[#202124]" : "text-[#202124]"
                    }`}
                  >
                    {email.subject}
                  </span>
                  <span className="text-[#5f6368] text-sm flex-shrink-0">&nbsp;-&nbsp;</span>
                  <span className="truncate text-sm text-[#5f6368]">{email.preview}</span>
                </div>

                {/* Attachment */}
                {email.hasAttachment && (
                  <svg className="w-5 h-5 text-[#5f6368] flex-shrink-0 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H9v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S6 2.79 6 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                  </svg>
                )}

                {/* Date */}
                <div className="w-[72px] pr-4 flex-shrink-0 text-right">
                  <span
                    className={`text-xs ${
                      !email.read ? "font-semibold text-[#202124]" : "text-[#5f6368]"
                    }`}
                  >
                    {email.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar (Icons) */}
        <aside className="w-[52px] flex flex-col items-center py-4 gap-5 flex-shrink-0">
          <button className="p-2 hover:bg-[#e8eaed] rounded-full">
            <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
            </svg>
          </button>
          <button className="p-2 hover:bg-[#e8eaed] rounded-full">
            <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </button>
          <button className="p-2 hover:bg-[#e8eaed] rounded-full">
            <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </button>
          <div className="flex-1" />
          <button className="p-2 hover:bg-[#e8eaed] rounded-full">
            <svg className="w-5 h-5 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </aside>
      </div>
    </div>
  );
}
