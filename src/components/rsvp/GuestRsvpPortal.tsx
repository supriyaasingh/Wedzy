import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Heart,
  Sparkles,
  ExternalLink,
  Download,
  AlertCircle,
  QrCode as QrIcon,
  MessageSquare,
  Utensils,
  Share2,
  Check,
  Search,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWedding } from '../../context/WeddingContext';
import { Guest, WeddingEvent, EventRSVP, WeddingThemeId } from '../../types/wedding';
import { WEDDING_THEMES } from '../../data/weddingThemes';
import {
  DiyaIcon,
  SacredKalash,
  MandapArch,
  CornerOrnament,
  MarigoldGarland,
} from '../illustrations/IndianWeddingDecorations';
import { GuestQrModal } from '../invitations/GuestQrModal';

interface GuestRsvpPortalProps {
  token?: string;
  guest?: Guest;
  onBackToHome?: () => void;
}

const DIETARY_OPTIONS = [
  { id: 'pure_veg', label: 'Pure Vegetarian (No Onion/Garlic / Sattvic)' },
  { id: 'jain_veg', label: 'Jain Vegetarian' },
  { id: 'regular_veg', label: 'Vegetarian (North/South Indian)' },
  { id: 'non_veg', label: 'Non-Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten_free', label: 'Gluten-Free / Allergen Sensitive' },
];

interface EventResponseDraft {
  eventId: string;
  attendanceStatus: 'attending' | 'declined';
  adultCount: number;
  childCount: number;
  dietaryRequirements: string;
  accompanyingGuests: string;
}

export const GuestRsvpPortal: React.FC<GuestRsvpPortalProps> = ({
  token,
  guest: propGuest,
  onBackToHome,
}) => {
  const {
    currentWedding,
    events,
    guests,
    invitations,
    rsvps,
    getGuestByToken,
    submitMultiEventRSVP,
  } = useWedding();

  // Resolved guest & invitation
  const resolvedData = useMemo(() => {
    if (token) {
      return getGuestByToken(token);
    }
    if (propGuest) {
      const inv = invitations.find((i) => i.guestId === propGuest.guestId);
      return {
        guest: propGuest,
        invitation: inv!,
        wedding: currentWedding,
      };
    }
    return null;
  }, [token, propGuest, invitations, currentWedding, getGuestByToken]);

  const activeGuest = resolvedData?.guest;
  const activeWedding = resolvedData?.wedding || currentWedding;
  const activeThemeId = activeWedding.theme || 'royal_maroon';
  const theme = WEDDING_THEMES[activeThemeId] || WEDDING_THEMES.royal_maroon;

  // Phone lookup state for guests without direct token
  const [phoneLookup, setPhoneLookup] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [selectedGuestOverride, setSelectedGuestOverride] = useState<Guest | null>(null);

  const effectiveGuest = selectedGuestOverride || activeGuest;

  // Draft responses for each event
  const [responses, setResponses] = useState<Record<string, EventResponseDraft>>({});
  const [globalBlessing, setGlobalBlessing] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [formError, setFormError] = useState('');

  // Check deadline
  const isDeadlinePassed = useMemo(() => {
    if (!activeWedding.rsvpDeadline) return false;
    const deadlineDate = new Date(activeWedding.rsvpDeadline);
    const today = new Date();
    // End of deadline day
    deadlineDate.setHours(23, 59, 59, 999);
    return today > deadlineDate;
  }, [activeWedding.rsvpDeadline]);

  // Initialize draft responses from existing RSVPs or defaults
  useEffect(() => {
    if (!effectiveGuest) return;

    const initialResponses: Record<string, EventResponseDraft> = {};
    let foundAnyRsvp = false;

    events.forEach((ev) => {
      const existingRsvp = rsvps.find(
        (r) => r.guestId === effectiveGuest.guestId && r.eventId === ev.eventId
      );

      if (existingRsvp) {
        foundAnyRsvp = true;
        initialResponses[ev.eventId] = {
          eventId: ev.eventId,
          attendanceStatus: existingRsvp.attendanceStatus === 'attending' ? 'attending' : 'declined',
          adultCount: existingRsvp.attendanceStatus === 'attending' ? Math.max(1, existingRsvp.adultCount) : 1,
          childCount: existingRsvp.attendanceStatus === 'attending' ? existingRsvp.childCount : 0,
          dietaryRequirements: existingRsvp.dietaryRequirements || DIETARY_OPTIONS[2].label,
          accompanyingGuests: existingRsvp.accompanyingGuests?.join(', ') || '',
        };
        if (existingRsvp.additionalMessage && !globalBlessing) {
          setGlobalBlessing(existingRsvp.additionalMessage);
        }
      } else {
        // Default to attending with expected member breakdown
        const defaultAdults = Math.max(1, effectiveGuest.expectedMembers > 1 ? effectiveGuest.expectedMembers - 1 : 1);
        const defaultChildren = Math.max(0, effectiveGuest.expectedMembers - defaultAdults);

        initialResponses[ev.eventId] = {
          eventId: ev.eventId,
          attendanceStatus: 'attending',
          adultCount: defaultAdults,
          childCount: defaultChildren,
          dietaryRequirements: DIETARY_OPTIONS[2].label,
          accompanyingGuests: '',
        };
      }
    });

    setResponses(initialResponses);
    if (foundAnyRsvp) {
      setIsSubmitted(true);
    }
  }, [effectiveGuest, events, rsvps]);

  // Handle phone lookup
  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    const cleanInput = phoneLookup.replace(/[^0-9]/g, '');

    const found = guests.find((g) => {
      const cleanGuestPhone = g.phone.replace(/[^0-9]/g, '');
      return cleanGuestPhone.endsWith(cleanInput) || cleanGuestPhone === cleanInput;
    });

    if (found) {
      setSelectedGuestOverride(found);
      setIsSubmitted(false);
      setIsEditing(true);
    } else {
      setLookupError('Could not find an invitation with this phone number. Please check with the wedding hosts.');
    }
  };

  // Event draft change helpers
  const updateEventStatus = (eventId: string, status: 'attending' | 'declined') => {
    setResponses((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        attendanceStatus: status,
      },
    }));
  };

  const updateAdultCount = (eventId: string, delta: number) => {
    setResponses((prev) => {
      const current = prev[eventId];
      if (!current) return prev;
      const nextCount = Math.max(1, Math.min(15, current.adultCount + delta));
      return {
        ...prev,
        [eventId]: {
          ...current,
          adultCount: nextCount,
        },
      };
    });
  };

  const updateChildCount = (eventId: string, delta: number) => {
    setResponses((prev) => {
      const current = prev[eventId];
      if (!current) return prev;
      const nextCount = Math.max(0, Math.min(10, current.childCount + delta));
      return {
        ...prev,
        [eventId]: {
          ...current,
          childCount: nextCount,
        },
      };
    });
  };

  const updateDietary = (eventId: string, dietary: string) => {
    setResponses((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        dietaryRequirements: dietary,
      },
    }));
  };

  const updateAccompanying = (eventId: string, names: string) => {
    setResponses((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        accompanyingGuests: names,
      },
    }));
  };

  // Submit all responses
  const handleSubmitAll = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!effectiveGuest) {
      setFormError('No guest record found. Please select or search your invitation.');
      return;
    }

    if (isDeadlinePassed && !isEditing) {
      setFormError('The RSVP deadline for this wedding has closed. Please contact the hosts directly.');
      return;
    }

    const payload = events.map((ev) => {
      const r = responses[ev.eventId] || {
        eventId: ev.eventId,
        attendanceStatus: 'attending',
        adultCount: 1,
        childCount: 0,
        dietaryRequirements: '',
        accompanyingGuests: '',
      };

      const accompanyingArray = r.accompanyingGuests
        ? r.accompanyingGuests.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
        : [];

      return {
        eventId: ev.eventId,
        attendanceStatus: r.attendanceStatus,
        adultCount: r.attendanceStatus === 'attending' ? r.adultCount : 0,
        childCount: r.attendanceStatus === 'attending' ? r.childCount : 0,
        dietaryRequirements: r.attendanceStatus === 'attending' ? r.dietaryRequirements : '',
        accompanyingGuests: accompanyingArray,
        additionalMessage: globalBlessing,
      };
    });

    submitMultiEventRSVP(effectiveGuest.guestId, payload);

    // Festive confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#800020', '#D4AF37', '#F59E0B', '#E11D48', '#10B981'],
      });
    } catch {
      // Safe fallback
    }

    setIsSubmitted(true);
    setIsEditing(false);
  };

  // Google Calendar Link Generator
  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Wedding of ${activeWedding.brideName} & ${activeWedding.groomName}`);
    const details = encodeURIComponent(
      `Celebrating the auspicious wedding ceremonies of ${activeWedding.brideName} and ${activeWedding.groomName}.\nVenue: ${activeWedding.venue}, ${activeWedding.venueAddress}`
    );
    const location = encodeURIComponent(`${activeWedding.venue}, ${activeWedding.venueAddress}`);

    // Convert date string (YYYY-MM-DD) to format YYYYMMDD
    const dateFormatted = activeWedding.weddingDate.replace(/-/g, '');
    const dates = `${dateFormatted}T040000Z/${dateFormatted}T180000Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  // Fallback: If no guest found via token, show courteous phone lookup card
  if (!effectiveGuest) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border-2 border-[#E5C378] shadow-xl p-6 sm:p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-[#FAF0D4] border border-[#E5C378] flex items-center justify-center mx-auto text-[#800020]">
            <SacredKalash className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B45309]">
              ॥ श्री गणेशाय नमः ॥
            </span>
            <h2 className="font-serif-luxury text-xl font-bold text-[#800020] mt-1">
              Find Your Wedding Invitation Pass
            </h2>
            <p className="text-xs text-[#6B5E55] mt-1">
              Celebrating the wedding of {currentWedding.brideName} & {currentWedding.groomName}. Enter your WhatsApp mobile number to look up your personal invitation.
            </p>
          </div>

          <form onSubmit={handleLookupSubmit} className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                WhatsApp Phone Number
              </label>
              <div className="flex gap-2">
                <span className="px-3 py-2 bg-[#FAF0D4] border border-[#E5C378] rounded-lg font-mono font-bold text-xs text-[#800020]">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit phone number"
                  value={phoneLookup}
                  onChange={(e) => setPhoneLookup(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-lg text-xs focus:outline-hidden focus:border-[#800020]"
                />
              </div>
            </div>

            {lookupError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
                {lookupError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#800020] hover:bg-[#6B081B] text-white font-bold rounded-lg shadow-sm text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find My Invitation</span>
            </button>
          </form>

          {onBackToHome && (
            <div className="pt-2 border-t border-[#F0E6D8]">
              <button
                onClick={onBackToHome}
                className="text-xs text-[#800020] font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Home</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active confirmed summary metrics
  const attendingEventsCount = events.filter(
    (ev) => responses[ev.eventId]?.attendanceStatus === 'attending'
  ).length;

  const totalConfirmedAttendees = Math.max(
    0,
    ...events.map((ev) => {
      const r = responses[ev.eventId];
      return r?.attendanceStatus === 'attending' ? r.adultCount + r.childCount : 0;
    })
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Auspicious Navigation Strip */}
        <div className="flex items-center justify-between pb-2">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 text-xs font-semibold text-[#800020] bg-white hover:bg-[#FAF0D4] border border-[#E5C378] rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Wedding Welcome Page</span>
            </button>
          )}

          <div className="text-[11px] font-semibold text-[#8C7A70] flex items-center gap-1 ml-auto">
            <span>Pass ID:</span>
            <span className="font-mono text-[#800020] font-bold">
              {effectiveGuest.guestId.substring(0, 10)}
            </span>
          </div>
        </div>

        {/* Hero Royal Auspicious Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#800020] via-[#5B0616] to-[#800020] text-white border-2 border-[#D4AF37] shadow-xl relative overflow-hidden text-center space-y-4">
          
          {/* Subtle Background Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #D4AF37 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          <CornerOrnament position="tl" className="absolute top-3 left-3 w-8 h-8 text-[#D4AF37]" />
          <CornerOrnament position="tr" className="absolute top-3 right-3 w-8 h-8 text-[#D4AF37]" />

          {/* Invocation */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FDE68A]">
            <DiyaIcon className="w-4 h-4" />
            <span>॥ श्री गणेशाय नमः ॥</span>
            <DiyaIcon className="w-4 h-4" />
          </div>

          <MandapArch className="w-48 sm:w-60 mx-auto h-auto my-1" />

          {/* Bride & Groom */}
          <div>
            <div className="text-xs uppercase tracking-widest text-[#FDE68A]/80 font-medium">
              Together with their families
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#FDE047] mt-1 drop-shadow-sm">
              {activeWedding.brideName} & {activeWedding.groomName}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-lg mx-auto font-serif-luxury italic">
              Joyfully invite you to celebrate the auspicious wedding ceremonies
            </p>
          </div>

          {/* Date, Time & Venue Bar */}
          <div className="bg-black/25 backdrop-blur-xs rounded-xl p-3 border border-[#E5C378]/40 max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center justify-center gap-1.5 text-white/90">
              <Calendar className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span className="font-semibold">{activeWedding.weddingDate}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-white/90">
              <Clock className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>{activeWedding.weddingTime}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-white/90 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#FDE68A] shrink-0" />
              <span className="truncate">{activeWedding.venue}</span>
            </div>
          </div>

          {/* Personal Salutation */}
          <div className="pt-2">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#FAF0D4] text-[#800020] border border-[#E5C378] shadow-sm">
              <span className="text-xs sm:text-sm font-bold font-serif-luxury">
                Personalized Invitation for: <strong className="font-black text-[#5B0616]">{effectiveGuest.name} & Family</strong>
              </span>
            </div>
          </div>

        </div>

        {/* Personalized Welcome & Deadline Status Strip */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5C378]/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#800020] uppercase tracking-wider">
                Family Reservation
              </span>
              <span className="text-[10px] font-semibold text-[#800020] bg-[#FAF0D4] px-2 py-0.5 rounded border border-[#E5C378]">
                {effectiveGuest.category}
              </span>
            </div>
            <p className="text-xs text-[#5C4D43] mt-1">
              We have reserved seating for up to <strong className="text-[#3D291F]">{effectiveGuest.expectedMembers} members</strong> from your family unit.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-semibold text-[#8C7A70] block uppercase tracking-wider">
              RSVP Deadline:
            </span>
            <div className="font-mono text-xs font-bold text-[#800020] mt-0.5">
              {activeWedding.rsvpDeadline ? new Date(activeWedding.rsvpDeadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Open'}
            </div>
            {isDeadlinePassed ? (
              <span className="inline-block text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 mt-1">
                Responses Closed
              </span>
            ) : (
              <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                Responses Open
              </span>
            )}
          </div>
        </div>

        {/* ========================================================
            SUBMITTED CONFIRMATION RECEIPT (Shown after submission)
            ======================================================== */}
        {isSubmitted && !isEditing ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-emerald-400 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-300">
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="font-serif-luxury text-2xl font-bold text-[#800020]">
                Namaste {effectiveGuest.name}! Your RSVP is Confirmed 🙏
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4D43] max-w-md mx-auto leading-relaxed">
                Thank you for confirming your attendance! Your family's response has been securely saved and factored into the catering calculations to prevent food waste.
              </p>
            </div>

            {/* Attendance Breakdown Receipt Card */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5C378] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5C378]/50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#800020]">
                  Your Ceremony Schedule & Headcounts
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {attendingEventsCount} of {events.length} Ceremonies Attending
                </span>
              </div>

              <div className="space-y-2.5">
                {events.map((ev, idx) => {
                  const r = responses[ev.eventId];
                  const isAttending = r?.attendanceStatus === 'attending';

                  return (
                    <div
                      key={`${ev.eventId || 'evt'}_${idx}`}
                      className="p-3 bg-white rounded-lg border border-[#E5C378]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-[#3D291F]">{ev.eventName}</strong>
                          <span className="text-[10px] text-[#786C64]">
                            {ev.eventDate} at {ev.startTime}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5C4D43] mt-0.5">
                          {ev.venue} {ev.dressCode ? `· Dress Code: ${ev.dressCode}` : ''}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {isAttending ? (
                          <div>
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Attending: {r.adultCount + r.childCount} Guests
                            </span>
                            <div className="text-[10px] text-[#786C64] mt-0.5">
                              {r.adultCount} adults, {r.childCount} kids · {r.dietaryRequirements}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Declined
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {globalBlessing && (
                <div className="pt-2 border-t border-[#E5C378]/40 text-xs">
                  <span className="font-semibold text-[#800020] block mb-0.5">Your Blessing for the Couple:</span>
                  <p className="italic text-[#5C4D43] bg-white p-2.5 rounded border border-[#E5C378]/40">
                    "{globalBlessing}"
                  </p>
                </div>
              )}
            </div>

            {/* Quick Action Buttons: Calendar, Directions, QR Pass */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <a
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </a>

              <a
                href={activeWedding.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${activeWedding.venue}, ${activeWedding.venueAddress}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 text-xs font-semibold text-[#5C4D43] hover:text-[#800020] bg-white hover:bg-[#FAF7F2] border border-[#E5C378] rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Get Directions</span>
              </a>

              <button
                onClick={() => setIsQrModalOpen(true)}
                className="py-2.5 px-3 text-xs font-bold text-white bg-[#800020] hover:bg-[#6B081B] rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <QrIcon className="w-3.5 h-3.5 text-[#FDE047]" />
                <span>Wedding QR Pass</span>
              </button>
            </div>

            {/* Edit Option if before deadline */}
            <div className="pt-2 text-center">
              {!isDeadlinePassed ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-[#800020] hover:underline"
                >
                  Need to change your response? Click here to update your RSVP
                </button>
              ) : (
                <span className="text-[11px] text-[#8C7A70]">
                  Responses are now finalized. For any emergency changes, please contact the wedding hosts directly at {activeWedding.contactPhone}.
                </span>
              )}
            </div>

          </div>
        ) : (
          /* ========================================================
             RSVP EDIT / SUBMISSION FORM
             ======================================================== */
          <form onSubmit={handleSubmitAll} className="space-y-6">
            
            <div className="text-center sm:text-left">
              <h3 className="font-serif-luxury text-xl font-bold text-[#800020] flex items-center gap-2">
                <DiyaIcon className="w-5 h-5 text-[#800020]" />
                <span>Ceremony Attendance & Headcounts</span>
              </h3>
              <p className="text-xs text-[#6B5E55] mt-1">
                Please select your attendance for each ceremony. Your exact count ensures our caterers prepare fresh, plentiful food without wastage.
              </p>
            </div>

            {/* Event-by-Event Selection Cards */}
            <div className="space-y-4">
              {events.map((ev, index) => {
                const draft = responses[ev.eventId] || {
                  eventId: ev.eventId,
                  attendanceStatus: 'attending',
                  adultCount: 1,
                  childCount: 0,
                  dietaryRequirements: DIETARY_OPTIONS[2].label,
                  accompanyingGuests: '',
                };

                const isAttending = draft.attendanceStatus === 'attending';

                return (
                  <div
                    key={`${ev.eventId || 'evt'}_${index}`}
                    className={`rounded-2xl border-2 transition-all overflow-hidden ${
                      isAttending
                        ? 'bg-white border-[#E5C378] shadow-sm'
                        : 'bg-[#FAF7F2]/60 border-neutral-300 opacity-80'
                    }`}
                  >
                    {/* Event Header Banner */}
                    <div className="p-4 bg-gradient-to-r from-[#FAF0D4]/80 via-white to-[#FAF0D4]/80 border-b border-[#E5C378]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#800020] text-white flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </span>
                          <h4 className="font-bold text-sm text-[#3D291F]">
                            {ev.eventName}
                          </h4>
                        </div>
                        <div className="text-xs text-[#5C4D43] mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#800020]" />
                            {ev.eventDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#800020]" />
                            {ev.startTime} - {ev.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#800020]" />
                            {ev.venue}
                          </span>
                          {ev.dressCode && (
                            <span className="text-[11px] font-medium text-[#B45309]">
                              Dress: {ev.dressCode}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Attendance Toggle Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateEventStatus(ev.eventId, 'attending')}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                            isAttending
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                              : 'bg-white text-[#5C4D43] border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Attending</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateEventStatus(ev.eventId, 'declined')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
                            !isAttending
                              ? 'bg-rose-700 text-white border-rose-800 shadow-2xs'
                              : 'bg-white text-[#5C4D43] border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Declining</span>
                        </button>
                      </div>
                    </div>

                    {/* Event Body: Headcounts & Diet (Shown only if Attending) */}
                    {isAttending ? (
                      <div className="p-4 sm:p-5 space-y-4 text-xs">
                        
                        {/* Counters Row: Adults + Children */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {/* Adults Counter */}
                          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5C378]/60 flex items-center justify-between">
                            <div>
                              <label className="font-bold text-[#3D291F] block">
                                Adults (Ages 12+) *
                              </label>
                              <span className="text-[10px] text-[#786C64]">
                                Includes yourself
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateAdultCount(ev.eventId, -1)}
                                disabled={draft.adultCount <= 1}
                                className="w-8 h-8 rounded-lg bg-white border border-[#E5C378] text-[#800020] font-bold text-sm hover:bg-[#FAF0D4] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="font-mono text-base font-bold text-[#3D291F] w-6 text-center tabular-nums">
                                {draft.adultCount}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateAdultCount(ev.eventId, 1)}
                                className="w-8 h-8 rounded-lg bg-white border border-[#E5C378] text-[#800020] font-bold text-sm hover:bg-[#FAF0D4] flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Children Counter */}
                          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5C378]/60 flex items-center justify-between">
                            <div>
                              <label className="font-bold text-[#3D291F] block">
                                Children (Under 12)
                              </label>
                              <span className="text-[10px] text-[#786C64]">
                                Kid-friendly portions
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateChildCount(ev.eventId, -1)}
                                disabled={draft.childCount <= 0}
                                className="w-8 h-8 rounded-lg bg-white border border-[#E5C378] text-[#800020] font-bold text-sm hover:bg-[#FAF0D4] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="font-mono text-base font-bold text-[#3D291F] w-6 text-center tabular-nums">
                                {draft.childCount}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateChildCount(ev.eventId, 1)}
                                className="w-8 h-8 rounded-lg bg-white border border-[#E5C378] text-[#800020] font-bold text-sm hover:bg-[#FAF0D4] flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* Headcount Verification Badge */}
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                          <span className="text-emerald-900 font-medium">
                            Confirmed Plate Requirement for {ev.eventName}:
                          </span>
                          <span className="font-mono font-bold text-emerald-800 text-sm">
                            {draft.adultCount + draft.childCount} Total Plates ({draft.adultCount} Adults + {draft.childCount} Kids)
                          </span>
                        </div>

                        {/* Dietary Requirements */}
                        <div>
                          <label className="block font-bold text-[#3D291F] mb-1">
                            Dietary Preference for {ev.eventName}:
                          </label>
                          <select
                            value={draft.dietaryRequirements}
                            onChange={(e) => updateDietary(ev.eventId, e.target.value)}
                            className="w-full p-2.5 bg-white border border-[#E5C378] rounded-lg text-xs focus:outline-hidden focus:border-[#800020] text-[#3D291F]"
                          >
                            {DIETARY_OPTIONS.map((opt) => (
                              <option key={opt.id} value={opt.label}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Accompanying Members Names */}
                        <div>
                          <label className="block font-semibold text-[#5C4D43] mb-1">
                            Accompanying Family Members' Names (Optional):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sunita, Aryan, Pooja"
                            value={draft.accompanyingGuests}
                            onChange={(e) => updateAccompanying(ev.eventId, e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-lg text-xs focus:outline-hidden focus:border-[#800020]"
                          />
                        </div>

                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-[#8C7A70] italic">
                        Respectfully declining {ev.eventName}. Zero food plates will be ordered for your family for this event.
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Overall Blessings Message Box */}
            <div className="p-5 bg-white rounded-2xl border border-[#E5C378]/70 shadow-xs space-y-2">
              <label className="block font-serif-luxury text-sm font-bold text-[#800020] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#800020]" />
                <span>Blessings & Wishes for {activeWedding.brideName} & {activeWedding.groomName}</span>
              </label>
              <textarea
                rows={3}
                placeholder="Share your love, blessings, or arrival notes for the couple..."
                value={globalBlessing}
                onChange={(e) => setGlobalBlessing(e.target.value)}
                className="w-full p-3 bg-[#FAF7F2] border border-[#E5C378] rounded-xl text-xs text-[#3D291F] focus:outline-hidden focus:border-[#800020]"
              />
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isDeadlinePassed}
                className="w-full py-4 text-sm font-bold text-white bg-gradient-to-r from-[#800020] via-[#990000] to-[#800020] hover:from-[#6B081B] hover:to-[#6B081B] rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FDE047]" />
                <span>Confirm Attendance & Headcounts</span>
              </button>
              <p className="text-[11px] text-[#786C64] text-center mt-2">
                Your response instantly updates the host's catering planner. You can revisit this link to make changes anytime before {activeWedding.rsvpDeadline}.
              </p>
            </div>

          </form>
        )}

        {/* QR Pass Modal */}
        <GuestQrModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          guest={effectiveGuest}
        />

      </div>
    </div>
  );
};
