import React, { useState } from 'react';
import { X, CheckCircle2, Heart, Users, Utensils, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, WeddingEvent } from '../../types/wedding';
import { DiyaIcon, SacredKalash } from '../illustrations/IndianWeddingDecorations';
import confetti from 'canvas-confetti';

interface GuestRsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Guest;
  event?: WeddingEvent;
  onRsvpComplete?: () => void;
}

export const GuestRsvpModal: React.FC<GuestRsvpModalProps> = ({
  isOpen,
  onClose,
  guest,
  event,
  onRsvpComplete,
}) => {
  const { currentWedding, events, guests, customQuestions, submitGuestRSVP, getGuestRSVP } = useWedding();

  // If no specific guest is provided, default to first guest for demo/preview
  const activeGuest = guest || guests[0];
  const targetEvent = event || events[2] || events[0];

  const existingRsvp = activeGuest ? getGuestRSVP(activeGuest.guestId, targetEvent.eventId) : undefined;

  // Form State
  const [attendanceChoice, setAttendanceChoice] = useState<'attending' | 'declined' | null>(
    existingRsvp && existingRsvp.attendanceStatus !== 'pending' ? existingRsvp.attendanceStatus : null
  );
  const [guestName, setGuestName] = useState(activeGuest ? activeGuest.name : '');
  const [adults, setAdults] = useState<number>(existingRsvp?.adultCount ?? (activeGuest?.expectedMembers ? Math.max(1, activeGuest.expectedMembers - 1) : 2));
  const [children, setChildren] = useState<number>(existingRsvp?.childCount ?? (activeGuest?.expectedMembers ? Math.max(0, activeGuest.expectedMembers - adults) : 0));
  const [dietary, setDietary] = useState<string>(existingRsvp?.dietaryRequirements ?? '');
  const [accompanyingNames, setAccompanyingNames] = useState<string>(
    existingRsvp?.accompanyingGuests?.join(', ') ?? ''
  );
  const [message, setMessage] = useState<string>(existingRsvp?.additionalMessage ?? '');
  const [customAnswers, setCustomAnswers] = useState<Record<string, any>>(existingRsvp?.customAnswers || {});
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalAttendees = adults + children;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!activeGuest) {
      setErrorMsg('Guest information not found.');
      return;
    }

    if (!attendanceChoice) {
      setErrorMsg('Please select whether you will attend or cannot make it.');
      return;
    }

    if (attendanceChoice === 'attending') {
      if (adults < 1) {
        setErrorMsg('At least 1 adult (including the primary guest) must be specified.');
        return;
      }
      if (adults + children > 25) {
        setErrorMsg('For parties larger than 25 members, please contact the wedding hosts directly.');
        return;
      }

      const accompanyingArray = accompanyingNames
        .split(',')
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      submitGuestRSVP(
        activeGuest.guestId,
        targetEvent.eventId,
        'attending',
        adults,
        children,
        {
          accompanyingGuests: accompanyingArray,
          dietaryRequirements: dietary,
          additionalMessage: message,
          customAnswers,
        }
      );

      // Trigger celebratory festive confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#800020', '#D4AF37', '#F59E0B', '#E11D48'],
        });
      } catch {
        // Safe fallback
      }
    } else {
      // Declined
      submitGuestRSVP(
        activeGuest.guestId,
        targetEvent.eventId,
        'declined',
        0,
        0,
        {
          dietaryRequirements: '',
          additionalMessage: message,
        }
      );
    }

    setIsSubmitted(true);
    if (onRsvpComplete) onRsvpComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl border-2 border-[#E5C378] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Gold Border */}
        <div className="h-1.5 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#F59E0B]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6B5E55] hover:text-[#800020] hover:bg-[#FAF0D4] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#800020] to-[#5B0616] border border-[#E5C378] mb-3 shadow-sm">
              <SacredKalash className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#800020]">
              Wedding Attendance RSVP
            </h3>
            <p className="text-xs sm:text-sm text-[#786C64] mt-1">
              Celebrating the Wedding of <strong className="text-[#3D291F]">{currentWedding.brideName} & {currentWedding.groomName}</strong>
            </p>
            <div className="mt-2 text-xs font-serif-luxury font-medium text-[#B45309] bg-[#FAF0D4] inline-block px-3 py-1 rounded-full border border-[#E5C378]/60">
              Event: {targetEvent.eventName} · {targetEvent.eventDate}
            </div>
          </div>

          {/* Submitted Success Screen */}
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border-2 border-emerald-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold font-serif-luxury text-[#800020]">
                {attendanceChoice === 'attending'
                  ? 'Attendance Successfully Confirmed!'
                  : 'Response Received with Love'}
              </h4>
              <p className="text-sm text-[#5C4D43] max-w-sm mx-auto leading-relaxed">
                {attendanceChoice === 'attending'
                  ? `Thank you, ${guestName}! We have confirmed ${totalAttendees} attendee${totalAttendees > 1 ? 's' : ''} (${adults} adults, ${children} children). Your prompt response helps our family prepare exact food quantities and avoid wastage!`
                  : `Thank you for letting us know, ${guestName}. We will dearly miss celebrating with you. Sending you and your family our deepest love and best wishes!`}
              </p>
              
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#800020] bg-[#FAF0D4] border border-[#E5C378] rounded-md hover:bg-[#F5E3B5]"
                >
                  Edit RSVP
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-xs font-semibold text-white bg-[#800020] hover:bg-[#6B081B] rounded-md shadow-sm"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* RSVP Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Attendance Choice Buttons (Part 16) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#800020] text-center mb-2.5">
                  Will you be joining us to celebrate?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendanceChoice('attending')}
                    className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                      attendanceChoice === 'attending'
                        ? 'bg-gradient-to-r from-[#800020] to-[#990000] text-white border-[#D4AF37] shadow-md scale-[1.02]'
                        : 'bg-white text-[#3D291F] border-[#E5C378]/60 hover:bg-[#FAF0D4]/40'
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 ${attendanceChoice === 'attending' ? 'text-[#FDE047]' : 'text-[#B45309]'}`} />
                    <span>YES, I'LL BE THERE!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendanceChoice('declined')}
                    className={`py-3 px-4 rounded-xl font-medium text-xs sm:text-sm border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                      attendanceChoice === 'declined'
                        ? 'bg-[#3D291F] text-white border-[#786C64] shadow-md scale-[1.02]'
                        : 'bg-white text-[#6B5E55] border-[#E5C378]/60 hover:bg-[#F5EBE0]'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>SORRY, CAN'T MAKE IT</span>
                  </button>
                </div>
              </div>

              {/* Primary Guest Name */}
              <div>
                <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                  Primary Guest / Family Name
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#800020]"
                />
              </div>

              {/* If Attending: Ask Adult & Child Counts (Part 17) */}
              {attendanceChoice === 'attending' && (
                <div className="space-y-4 pt-2 border-t border-[#E5C378]/50">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Adults Count */}
                    <div>
                      <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                        Adults (Incl. you) *
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                          className="w-8 h-8 rounded border border-[#E5C378] bg-[#FAF0D4] font-bold text-[#800020] hover:bg-[#F5E3B5]"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={adults}
                          onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full text-center py-1.5 font-mono font-bold text-sm bg-white border border-[#E5C378] rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setAdults((prev) => Math.min(20, prev + 1))}
                          className="w-8 h-8 rounded border border-[#E5C378] bg-[#FAF0D4] font-bold text-[#800020] hover:bg-[#F5E3B5]"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children Count */}
                    <div>
                      <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                        Children (Under 12)
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                          className="w-8 h-8 rounded border border-[#E5C378] bg-[#FAF0D4] font-bold text-[#800020] hover:bg-[#F5E3B5]"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={children}
                          onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full text-center py-1.5 font-mono font-bold text-sm bg-white border border-[#E5C378] rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setChildren((prev) => Math.min(15, prev + 1))}
                          className="w-8 h-8 rounded border border-[#E5C378] bg-[#FAF0D4] font-bold text-[#800020] hover:bg-[#F5E3B5]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total Attending Summary Pill */}
                  <div className="p-2.5 rounded-lg bg-[#FAF0D4] border border-[#E5C378] flex items-center justify-between text-xs text-[#800020]">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Total Attendees Confirmed:
                    </span>
                    <span className="font-mono font-bold text-sm">
                      {totalAttendees} {totalAttendees === 1 ? 'person' : 'people'}
                    </span>
                  </div>

                  {/* Accompanying Names (optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                      Names of Accompanying Family / Guests (Optional)
                    </label>
                    <input
                      type="text"
                      value={accompanyingNames}
                      onChange={(e) => setAccompanyingNames(e.target.value)}
                      placeholder="e.g. Pooja (Wife), Aarav (Son)"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                    />
                  </div>

                  {/* Dietary Requirements (optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#3D291F] mb-1 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-[#B45309]" />
                      Dietary Preferences (Optional)
                    </label>
                    <select
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                    >
                      <option value="">No special preference (Standard catering)</option>
                      <option value="Vegetarian Only">Pure Vegetarian Only</option>
                      <option value="Jain Vegetarian">Jain Vegetarian (No onion / garlic / root veg)</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                      <option value="Nut Allergy">Nut Allergy</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Message to Couple (optional) */}
              <div>
                <label className="block text-xs font-semibold text-[#3D291F] mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#B45309]" />
                  Blessings & Wishes for the Couple (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a heartfelt message or wedding wish..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!attendanceChoice}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Confirm & Submit RSVP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
