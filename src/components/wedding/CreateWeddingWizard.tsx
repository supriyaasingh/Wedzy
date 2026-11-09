import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Calendar, MapPin, Heart, Plus, Trash2 } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { WeddingThemeId, WeddingEvent } from '../../types/wedding';
import { WEDDING_THEMES } from '../../data/weddingThemes';
import { DiyaIcon, SacredKalash, MandapArch } from '../illustrations/IndianWeddingDecorations';

interface CreateWeddingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onWeddingCreated: () => void;
}

export const CreateWeddingWizard: React.FC<CreateWeddingWizardProps> = ({
  isOpen,
  onClose,
  onWeddingCreated,
}) => {
  const { addWedding, addEvent } = useWedding();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Couple Details
  const [brideName, setBrideName] = useState('Pooja Iyer');
  const [groomName, setGroomName] = useState('Arjun Nambiar');
  const [brideFamilyName, setBrideFamilyName] = useState('Iyer Family');
  const [groomFamilyName, setGroomFamilyName] = useState('Nambiar Family');

  // Step 2: Wedding Details
  const [weddingDate, setWeddingDate] = useState('2026-12-25');
  const [weddingTime, setWeddingTime] = useState('18:00');
  const [venue, setVenue] = useState('ITC Grand Chola');
  const [venueAddress, setVenueAddress] = useState('63 Anna Salai, Guindy, Chennai, Tamil Nadu 600032');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('https://maps.google.com/?q=ITC+Grand+Chola+Chennai');
  const [rsvpDeadline, setRsvpDeadline] = useState('2026-12-10');
  const [contactPhone, setContactPhone] = useState('+91 98400 12345');
  const [contactEmail, setContactEmail] = useState('pooja.arjun.weddings@gmail.com');

  // Step 3: Invitation Design
  const [selectedTheme, setSelectedTheme] = useState<WeddingThemeId>('south_indian');
  const [invitationMessage, setInvitationMessage] = useState(
    'Together with our families, we joyfully invite you to join us for our wedding celebration and blessings.'
  );

  // Step 4: Multi-Events
  const [customEvents, setCustomEvents] = useState<Omit<WeddingEvent, 'eventId' | 'weddingId'>[]>([
    {
      eventName: 'Traditional Muhurtham',
      eventDate: '2026-12-25',
      startTime: '07:30',
      endTime: '11:30',
      venue: 'Raja Muthiah Hall, Chennai',
      dressCode: 'Kanjivaram Silk Sarees & Veshti',
      description: 'Morning traditional wedding rites, mangalya dharanam, and festive banana leaf feast.',
      separateRsvp: true,
      requiredFoodCount: true,
    },
    {
      eventName: 'Grand Evening Reception',
      eventDate: '2026-12-25',
      startTime: '19:00',
      endTime: '23:00',
      venue: 'Grand Rajendra Hall, ITC Grand Chola',
      dressCode: 'Traditional / Formal Indo-Western',
      description: 'An evening of celebration, musical ensemble, and celebratory buffet dinner.',
      separateRsvp: true,
      requiredFoodCount: true,
    },
  ]);

  if (!isOpen) return null;

  const handleAddEventRow = () => {
    setCustomEvents([
      ...customEvents,
      {
        eventName: 'Sangeet / Haldi Ceremony',
        eventDate: weddingDate,
        startTime: '16:00',
        endTime: '20:00',
        venue: venue,
        dressCode: 'Festive Attire',
        description: 'Music, dancing and celebrations with close family and friends.',
        separateRsvp: true,
        requiredFoodCount: true,
      },
    ]);
  };

  const handleRemoveEvent = (index: number) => {
    setCustomEvents(customEvents.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    // 1. Create Wedding
    const createdWedding = addWedding({
      brideName,
      groomName,
      brideFamilyName,
      groomFamilyName,
      weddingDate,
      weddingTime,
      venue,
      venueAddress,
      googleMapsUrl,
      rsvpDeadline,
      contactPhone,
      contactEmail,
      theme: selectedTheme,
      invitationMessage,
      isPublished: true,
    });

    // 2. Add Custom Events
    customEvents.forEach((ev) => {
      addEvent({
        ...ev,
        weddingId: createdWedding.weddingId,
      });
    });

    onWeddingCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl border-2 border-[#E5C378] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
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
          
          {/* Header & Step Tracker */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
              <DiyaIcon className="w-4 h-4" />
              <span>Wedding Creation Wizard</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#800020] mt-1">
              Create Your Indian Wedding
            </h3>

            {/* Stepper Dots */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E5C378]/40">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex-1 flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                      currentStep === step
                        ? 'bg-[#800020] text-white shadow-xs'
                        : currentStep > step
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FAF0D4] text-[#800020] border border-[#E5C378]'
                    }`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      currentStep > step ? 'bg-emerald-600' : 'bg-[#E5C378]/40'
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="text-[11px] font-medium text-[#786C64] mt-1.5">
              {currentStep === 1 && 'Step 1 of 5: Couple & Family Details'}
              {currentStep === 2 && 'Step 2 of 5: Ceremony Date, Time & Venue'}
              {currentStep === 3 && 'Step 3 of 5: Invitation Theme & Wording'}
              {currentStep === 4 && 'Step 4 of 5: Wedding Functions (Haldi, Mehendi, Reception)'}
              {currentStep === 5 && 'Step 5 of 5: Review & Publish Wedding'}
            </div>
          </div>

          {/* STEP 1: COUPLE DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                    Bride's Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="e.g. Pooja Iyer"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                    Groom's Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="e.g. Arjun Nambiar"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                    Bride's Family Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={brideFamilyName}
                    onChange={(e) => setBrideFamilyName(e.target.value)}
                    placeholder="e.g. Iyer Family"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                    Groom's Family Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={groomFamilyName}
                    onChange={(e) => setGroomFamilyName(e.target.value)}
                    placeholder="e.g. Nambiar Family"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: WEDDING DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                    Wedding Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                    Wedding Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={weddingTime}
                    onChange={(e) => setWeddingTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. ITC Grand Chola"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                  Full Venue Address *
                </label>
                <textarea
                  rows={2}
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="Full street address and city"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                    Google Maps Link
                  </label>
                  <input
                    type="url"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                    RSVP Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={rsvpDeadline}
                    onChange={(e) => setRsvpDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                    Host Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                    Host Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INVITATION THEME */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D291F] mb-2">
                  Select Cultural Wedding Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.keys(WEDDING_THEMES) as WeddingThemeId[]).map((tId) => {
                    const th = WEDDING_THEMES[tId];
                    return (
                      <button
                        key={tId}
                        type="button"
                        onClick={() => setSelectedTheme(tId)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          selectedTheme === tId
                            ? 'border-[#800020] bg-white shadow-md scale-102'
                            : 'border-[#E5C378]/50 bg-white/70 hover:bg-white'
                        }`}
                      >
                        <div className="h-16 rounded overflow-hidden mb-2 bg-neutral-100">
                          <img
                            src={th.imageAsset}
                            alt={th.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-bold font-serif-luxury text-xs text-[#800020] block">
                          {th.name}
                        </span>
                        <span className="text-[10px] text-[#786C64] line-clamp-1">
                          {th.tagline}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D291F] mb-1">
                  Custom Invitation Message
                </label>
                <textarea
                  rows={3}
                  value={invitationMessage}
                  onChange={(e) => setInvitationMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 4: FUNCTIONS / EVENTS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#800020]">
                  Wedding Functions ({customEvents.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddEventRow}
                  className="px-3 py-1 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-md flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Function</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {customEvents.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-lg border border-[#E5C378]/70 shadow-2xs space-y-2 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={ev.eventName}
                        onChange={(e) => {
                          const updated = [...customEvents];
                          updated[idx].eventName = e.target.value;
                          setCustomEvents(updated);
                        }}
                        className="font-bold text-xs sm:text-sm text-[#800020] border-b border-[#E5C378] pb-0.5 focus:outline-hidden flex-1"
                        placeholder="Event Name (e.g. Sangeet)"
                      />
                      {customEvents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEvent(idx)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <input
                        type="date"
                        value={ev.eventDate}
                        onChange={(e) => {
                          const updated = [...customEvents];
                          updated[idx].eventDate = e.target.value;
                          setCustomEvents(updated);
                        }}
                        className="px-2 py-1 bg-[#FAF7F2] border border-[#E5C378]/60 rounded"
                      />
                      <input
                        type="time"
                        value={ev.startTime}
                        onChange={(e) => {
                          const updated = [...customEvents];
                          updated[idx].startTime = e.target.value;
                          setCustomEvents(updated);
                        }}
                        className="px-2 py-1 bg-[#FAF7F2] border border-[#E5C378]/60 rounded"
                      />
                      <input
                        type="text"
                        value={ev.venue}
                        onChange={(e) => {
                          const updated = [...customEvents];
                          updated[idx].venue = e.target.value;
                          setCustomEvents(updated);
                        }}
                        placeholder="Venue"
                        className="px-2 py-1 bg-[#FAF7F2] border border-[#E5C378]/60 rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: PREVIEW & PUBLISH */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF0D4] border border-[#E5C378] text-center">
                <MandapArch className="w-32 mx-auto mb-1" />
                <h4 className="font-display text-xl font-bold text-[#800020]">
                  {brideName} & {groomName}
                </h4>
                <p className="text-xs text-[#5C4D43] mt-1">
                  {weddingDate} · {venue}
                </p>
                <div className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full inline-block">
                  ✓ Ready to Publish & Generate WhatsApp Links
                </div>
              </div>

              <div className="text-xs text-[#6B5E55] space-y-1 bg-white p-4 rounded-lg border border-[#E5C378]/50">
                <div className="flex justify-between">
                  <span>Selected Theme:</span>
                  <strong className="text-[#800020]">{WEDDING_THEMES[selectedTheme].name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Functions Configured:</span>
                  <strong className="text-[#800020]">{customEvents.length} ceremonies</strong>
                </div>
                <div className="flex justify-between">
                  <span>RSVP Deadline:</span>
                  <strong className="text-[#800020]">{rsvpDeadline}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Footer Controls */}
          <div className="mt-8 pt-4 border-t border-[#E5C378]/40 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-semibold text-[#800020] bg-white border border-[#E5C378] rounded-md hover:bg-[#FAF0D4] flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#800020] hover:bg-[#6B081B] rounded-md shadow-sm flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 rounded-md shadow-md flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#FDE047]" />
                <span>Publish Wedding & Open Dashboard</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
