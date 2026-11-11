import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Calendar,
  MapPin,
  Heart,
  Plus,
  Trash2,
  Users,
  Upload,
  MessageCircle,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { WeddingThemeId, WeddingEvent, GuestCategory } from '../../types/wedding';
import { WEDDING_THEMES } from '../../data/weddingThemes';
import { DiyaIcon, SacredKalash, MandapArch } from '../illustrations/IndianWeddingDecorations';
import { parseAndValidateCsv, ParsedGuestRow } from '../../utils/csvHelper';

interface CreateWeddingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onWeddingCreated: () => void;
  initialStep?: number;
}

export const CreateWeddingWizard: React.FC<CreateWeddingWizardProps> = ({
  isOpen,
  onClose,
  onWeddingCreated,
  initialStep = 1,
}) => {
  const { addWedding, addEvent, bulkAddGuests, currentWedding } = useWedding();
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // STEP 1: WEDDING DETAILS
  const [brideName, setBrideName] = useState('Pooja Iyer');
  const [groomName, setGroomName] = useState('Arjun Nambiar');
  const [weddingDate, setWeddingDate] = useState('2026-12-25');
  const [weddingTime, setWeddingTime] = useState('18:00');
  const [venue, setVenue] = useState('ITC Grand Chola');
  const [venueAddress, setVenueAddress] = useState('63 Anna Salai, Guindy, Chennai, Tamil Nadu 600032');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('https://maps.google.com/?q=ITC+Grand+Chola+Chennai');
  const [selectedTheme, setSelectedTheme] = useState<WeddingThemeId>('royal_maroon');

  // STEP 2: WEDDING EVENTS
  const [customEvents, setCustomEvents] = useState<Omit<WeddingEvent, 'eventId' | 'weddingId'>[]>([
    {
      eventName: 'Haldi Ceremony',
      eventDate: '2026-12-24',
      startTime: '10:00',
      endTime: '13:00',
      venue: 'Courtyard Pavilion, ITC Grand Chola',
      dressCode: 'Shades of Yellow / Haldi Festive',
      description: 'Auspicious turmeric blessings, folk songs, and joyful family lunch.',
      separateRsvp: true,
      requiredFoodCount: true,
    },
    {
      eventName: 'Mehendi & Sangeet Gala',
      eventDate: '2026-12-24',
      startTime: '17:30',
      endTime: '22:30',
      venue: 'Grand Rajendra Ballroom, ITC Grand Chola',
      dressCode: 'Indo-Western Glitz & Glamour',
      description: 'Henna artistry, high-energy musical dance performances, and cocktail dinner.',
      separateRsvp: true,
      requiredFoodCount: true,
    },
    {
      eventName: 'Traditional Wedding Ceremony (Muhurtham)',
      eventDate: '2026-12-25',
      startTime: '07:30',
      endTime: '11:30',
      venue: 'Raja Muthiah Hall, ITC Grand Chola',
      dressCode: 'Traditional Kanjivaram & Veshti',
      description: 'Sacred Vedic wedding vows, Mangalya Dharanam, and grand feast.',
      separateRsvp: true,
      requiredFoodCount: true,
    },
    {
      eventName: 'Grand Reception Dinner',
      eventDate: '2026-12-25',
      startTime: '19:00',
      endTime: '23:30',
      venue: 'Royal Banquet Hall, ITC Grand Chola',
      dressCode: 'Formal Elegance',
      description: 'Meet and greet the newlyweds with live music and multi-cuisine royal banquet.',
      separateRsvp: true,
      requiredFoodCount: true,
    },
  ]);

  // STEP 3: GUEST LIST SETUP (Manual or CSV)
  const [guestEntryMode, setGuestEntryMode] = useState<'manual' | 'csv'>('manual');
  const [manualGuests, setManualGuests] = useState<Array<{ name: string; phone: string; familyName: string; category: GuestCategory; expectedMembers: number }>>([
    {
      name: 'Ramesh Sharma',
      phone: '9811223344',
      familyName: 'Sharma Family',
      category: "Bride's family",
      expectedMembers: 4,
    },
    {
      name: 'Vikram Singhania',
      phone: '9822334455',
      familyName: 'Singhania Family',
      category: 'Friends',
      expectedMembers: 2,
    },
  ]);
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  const [singleFamily, setSingleFamily] = useState('');
  const [singleCategory, setSingleCategory] = useState<GuestCategory>('Friends');
  const [singleExpected, setSingleExpected] = useState(2);

  // CSV Import State
  const [rawCsvText, setRawCsvText] = useState('');
  const [parsedCsvRows, setParsedCsvRows] = useState<ParsedGuestRow[]>([]);
  const [hasParsedCsv, setHasParsedCsv] = useState(false);

  // STEP 4: INVITATIONS CUSTOMIZATION
  const [invitationMessage, setInvitationMessage] = useState(
    'Together with our families, we joyfully invite you to celebrate our wedding ceremonies and shower us with your blessings.'
  );
  const [rsvpDeadline, setRsvpDeadline] = useState('2026-12-10');
  const [contactPhone, setContactPhone] = useState('+91 98400 12345');
  const [invitationLanguage, setInvitationLanguage] = useState<'english' | 'hindi'>('english');
  const [showLiveInvitationPreview, setShowLiveInvitationPreview] = useState(false);

  if (!isOpen) return null;

  // Add manual guest handler
  const handleAddManualGuest = () => {
    if (!singleName.trim() || !singlePhone.trim()) return;
    setManualGuests([
      ...manualGuests,
      {
        name: singleName.trim(),
        phone: singlePhone.trim(),
        familyName: singleFamily.trim() || `${singleName.split(' ')[0]} Family`,
        category: singleCategory,
        expectedMembers: singleExpected,
      },
    ]);
    setSingleName('');
    setSinglePhone('');
    setSingleFamily('');
    setSingleExpected(2);
  };

  const handleRemoveManualGuest = (idx: number) => {
    setManualGuests(manualGuests.filter((_, i) => i !== idx));
  };

  // CSV Parsing
  const handleParseCsv = (text: string) => {
    setRawCsvText(text);
    if (!text.trim()) return;
    const parsed = parseAndValidateCsv(text, new Set());
    setParsedCsvRows(parsed);
    setHasParsedCsv(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleParseCsv(content);
    };
    reader.readAsText(file);
  };

  // Events Helpers
  const handleAddEventRow = () => {
    setCustomEvents([
      ...customEvents,
      {
        eventName: 'Special Celebration',
        eventDate: weddingDate,
        startTime: '16:00',
        endTime: '20:00',
        venue: venue,
        dressCode: 'Festive Attire',
        description: 'Celebration ceremony with family and friends.',
        separateRsvp: true,
        requiredFoodCount: true,
      },
    ]);
  };

  const handleRemoveEvent = (index: number) => {
    setCustomEvents(customEvents.filter((_, i) => i !== index));
  };

  // Final Publish Handler
  const handleFinish = () => {
    // 1. Create Wedding
    const createdWedding = addWedding({
      brideName,
      groomName,
      weddingDate,
      weddingTime,
      venue,
      venueAddress,
      googleMapsUrl,
      rsvpDeadline,
      contactPhone,
      theme: selectedTheme,
      invitationMessage,
      isPublished: true,
    });

    // 2. Add Functions / Events
    customEvents.forEach((ev) => {
      addEvent({
        ...ev,
        weddingId: createdWedding.weddingId,
      });
    });

    // 3. Add Guests (manual + valid CSV)
    const guestsToImport: Array<{
      name: string;
      phone: string;
      countryCode: string;
      familyName?: string;
      category: GuestCategory;
      expectedMembers: number;
    }> = [];

    manualGuests.forEach((g) => {
      guestsToImport.push({
        name: g.name,
        phone: g.phone,
        countryCode: '+91',
        familyName: g.familyName,
        category: g.category,
        expectedMembers: g.expectedMembers,
      });
    });

    if (hasParsedCsv) {
      parsedCsvRows
        .filter((r) => r.isValid)
        .forEach((r) => {
          guestsToImport.push({
            name: r.name,
            phone: r.phone,
            countryCode: r.countryCode || '+91',
            familyName: r.familyName || `${r.name.split(' ')[0]} Family`,
            category: r.category as GuestCategory,
            expectedMembers: r.expectedMembers || 2,
          });
        });
    }

    if (guestsToImport.length > 0) {
      bulkAddGuests(guestsToImport);
    }

    onWeddingCreated();
  };

  const stepLabels = [
    '1. Wedding Details',
    '2. Wedding Events',
    '3. Add Guests',
    '4. Create Invitations',
    '5. Send & Collect RSVPs',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl border-2 border-[#E5C378] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Auspicious Top Gold Border Ribbon */}
        <div className="h-1.5 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#F59E0B]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6B5E55] hover:text-[#800020] hover:bg-[#FAF0D4] rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Header & Stepper Progress Bar */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
                <DiyaIcon className="w-4 h-4" />
                <span>Guided Wedding Setup</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#800020] bg-[#FAF0D4] px-2.5 py-0.5 rounded-full border border-[#E5C378]">
                Step {currentStep} of 5
              </span>
            </div>

            <h3 className="font-serif-luxury text-2xl font-bold text-[#800020] mt-1">
              {currentStep === 1 && 'Step 1: Create Your Wedding'}
              {currentStep === 2 && 'Step 2: Add Wedding Ceremonies & Events'}
              {currentStep === 3 && 'Step 3: Add or Import Your Guests'}
              {currentStep === 4 && 'Step 4: Create & Personalise Invitations'}
              {currentStep === 5 && 'Step 5: Send Invitations & Collect RSVPs'}
            </h3>

            {/* Stepper Progress Bar */}
            <div className="mt-4 pt-3 border-t border-[#E5C378]/40">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className="flex-1 text-left focus:outline-hidden group"
                  >
                    <div
                      className={`h-2 rounded-full transition-all ${
                        currentStep === step
                          ? 'bg-[#800020]'
                          : currentStep > step
                          ? 'bg-emerald-600'
                          : 'bg-[#E5C378]/40'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-semibold mt-1 block truncate ${
                        currentStep === step
                          ? 'text-[#800020] font-bold'
                          : currentStep > step
                          ? 'text-emerald-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {stepLabels[step - 1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================
              STEP 1: CREATE WEDDING (Bride, Groom, Date, Venue, Theme)
              ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs animate-in fade-in duration-150">
              <p className="text-[#6B5E55]">
                Enter the couple's names and primary ceremony date. You can add more events like Haldi and Sangeet in the next step.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">
                    Bride's Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="e.g. Pooja Sharma"
                    className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-xl text-xs focus:outline-hidden focus:border-[#800020]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">
                    Groom's Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="e.g. Arjun Malhotra"
                    className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-xl text-xs focus:outline-hidden focus:border-[#800020]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">
                    Wedding Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-xl text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">
                    Ceremony Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={weddingTime}
                    onChange={(e) => setWeddingTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-xl text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">
                  Wedding Venue Name *
                </label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. ITC Grand Chola / City Palace"
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">
                  Full Venue Address
                </label>
                <input
                  type="text"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="Street address, locality, city"
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block font-semibold text-[#3D291F] mb-1.5">
                  Choose Wedding Theme (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(WEDDING_THEMES) as WeddingThemeId[]).map((tId) => {
                    const th = WEDDING_THEMES[tId];
                    return (
                      <button
                        key={tId}
                        type="button"
                        onClick={() => setSelectedTheme(tId)}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                          selectedTheme === tId
                            ? 'border-[#800020] bg-white shadow-sm'
                            : 'border-[#E5C378]/50 bg-white/70 hover:bg-white'
                        }`}
                      >
                        <span className="font-bold text-xs text-[#800020] block">{th.name}</span>
                        <span className="text-[10px] text-[#786C64] truncate block">{th.tagline}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 2: WEDDING EVENTS (Haldi, Mehendi, Sangeet, Wedding, Reception)
              ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <p className="text-[#6B5E55]">
                  Indian weddings have multiple ceremonies. Customise dates, times, and dress codes for each event.
                </p>
                <button
                  type="button"
                  onClick={handleAddEventRow}
                  className="px-3 py-1.5 bg-[#FAF0D4] hover:bg-[#F5E3B5] text-[#800020] font-bold rounded-lg border border-[#E5C378] flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Custom Event</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {customEvents.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl border border-[#E5C378]/70 shadow-2xs space-y-2 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-5 h-5 rounded-full bg-[#800020] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={ev.eventName}
                          onChange={(e) => {
                            const updated = [...customEvents];
                            updated[idx].eventName = e.target.value;
                            setCustomEvents(updated);
                          }}
                          className="font-bold text-xs text-[#800020] border-b border-[#E5C378] pb-0.5 focus:outline-hidden flex-1"
                        />
                      </div>
                      {customEvents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEvent(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Remove Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-500 block">Date</label>
                        <input
                          type="date"
                          value={ev.eventDate}
                          onChange={(e) => {
                            const updated = [...customEvents];
                            updated[idx].eventDate = e.target.value;
                            setCustomEvents(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#FAF7F2] border border-[#E5C378]/60 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block">Time</label>
                        <input
                          type="time"
                          value={ev.startTime}
                          onChange={(e) => {
                            const updated = [...customEvents];
                            updated[idx].startTime = e.target.value;
                            setCustomEvents(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#FAF7F2] border border-[#E5C378]/60 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block">Dress Code</label>
                        <input
                          type="text"
                          placeholder="e.g. Traditional Yellow"
                          value={ev.dressCode || ''}
                          onChange={(e) => {
                            const updated = [...customEvents];
                            updated[idx].dressCode = e.target.value;
                            setCustomEvents(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#FAF7F2] border border-[#E5C378]/60 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 3: ADD GUESTS (Manual or CSV Import with Data Preview)
              ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#3D291F]">Guest List Setup</h4>
                  <p className="text-[#6B5E55]">
                    Add guests individually or upload a CSV file from Excel or Google Contacts.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E5C378]">
                  <button
                    type="button"
                    onClick={() => setGuestEntryMode('manual')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      guestEntryMode === 'manual' ? 'bg-[#800020] text-white' : 'text-[#5C4D43]'
                    }`}
                  >
                    Manual Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuestEntryMode('csv')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      guestEntryMode === 'csv' ? 'bg-[#800020] text-white' : 'text-[#5C4D43]'
                    }`}
                  >
                    CSV / Excel Import
                  </button>
                </div>
              </div>

              {guestEntryMode === 'manual' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-[#E5C378] grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Guest Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={singleName}
                        onChange={(e) => setSingleName(e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#E5C378] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">WhatsApp Mobile *</label>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={singlePhone}
                        onChange={(e) => setSinglePhone(e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#E5C378] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Category</label>
                      <select
                        value={singleCategory}
                        onChange={(e) => setSingleCategory(e.target.value as GuestCategory)}
                        className="w-full px-2 py-1.5 border border-[#E5C378] rounded text-xs"
                      >
                        <option value="Bride's family">Bride's Family</option>
                        <option value="Groom's family">Groom's Family</option>
                        <option value="Friends">Friends</option>
                        <option value="Relatives">Relatives</option>
                        <option value="Colleagues">Colleagues</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddManualGuest}
                        className="w-full py-1.5 bg-[#800020] hover:bg-[#6B081B] text-white font-bold rounded text-xs flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Guest</span>
                      </button>
                    </div>
                  </div>

                  {/* Manual Guests Preview List */}
                  <div className="max-h-[200px] overflow-y-auto space-y-1.5">
                    {manualGuests.map((g, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white rounded-lg border border-[#E5C378]/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-[#3D291F]">{g.name}</strong>
                          <span className="text-[#8C7A70] ml-2">({g.phone})</span>
                          <span className="text-[10px] text-[#B45309] bg-[#FAF0D4] px-1.5 py-0.5 rounded ml-2">
                            {g.category} · {g.expectedMembers} members
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveManualGuest(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* CSV Import Mode with Preview */
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-[#E5C378] rounded-xl p-4 text-center bg-white/70 relative cursor-pointer">
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-6 h-6 text-[#800020] mx-auto mb-1" />
                    <span className="font-bold text-xs text-[#800020] block">Upload CSV File</span>
                    <span className="text-[10px] text-gray-500">Click to browse or drop file here</span>
                  </div>

                  {/* Data Preview Table */}
                  {hasParsedCsv && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-700">
                          ✓ {parsedCsvRows.filter((r) => r.isValid).length} Valid Guests Ready to Import
                        </span>
                        <span className="text-gray-500">Previewing first rows:</span>
                      </div>
                      <div className="overflow-x-auto max-h-[160px] border border-[#E5C378] rounded-lg bg-white">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#FAF7F2] text-[#800020] font-bold text-[10px] border-b border-[#E5C378]">
                            <tr>
                              <th className="p-2">Name</th>
                              <th className="p-2">Phone</th>
                              <th className="p-2">Category</th>
                              <th className="p-2">Party Size</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {parsedCsvRows.slice(0, 5).map((row, i) => (
                              <tr key={i}>
                                <td className="p-2 font-medium">{row.name}</td>
                                <td className="p-2 font-mono text-[11px]">{row.phone}</td>
                                <td className="p-2">{row.category}</td>
                                <td className="p-2 font-mono">{row.expectedMembers}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              STEP 4: CREATE INVITATIONS (Message, Language, Deadline, Preview)
              ======================================================== */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs animate-in fade-in duration-150">
              <p className="text-[#6B5E55]">
                Customise the invitation greeting and message sent to your guests on WhatsApp.
              </p>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">
                  Invitation Message *
                </label>
                <textarea
                  rows={3}
                  value={invitationMessage}
                  onChange={(e) => setInvitationMessage(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E5C378] rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">
                    RSVP Confirmation Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={rsvpDeadline}
                    onChange={(e) => setRsvpDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-xl text-xs focus:outline-hidden"
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    Gives caterers enough notice to prepare exact food quantities.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">
                    Host Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-xl text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Live Preview Button & Card */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowLiveInvitationPreview(!showLiveInvitationPreview)}
                  className="px-3.5 py-1.5 bg-[#FAF0D4] hover:bg-[#F5E3B5] text-[#800020] font-bold rounded-lg border border-[#E5C378] flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showLiveInvitationPreview ? 'Hide Mobile Card Preview' : 'Show Mobile Card Preview'}</span>
                </button>

                {showLiveInvitationPreview && (
                  <div className="mt-3 p-4 bg-gradient-to-b from-[#800020] to-[#5B0616] text-white rounded-2xl border-2 border-[#D4AF37] text-center space-y-2 max-w-sm mx-auto shadow-lg animate-in zoom-in-95 duration-200">
                    <span className="text-[10px] uppercase tracking-widest text-[#FDE68A]">
                      ॥ श्री गणेशाय नमः ॥
                    </span>
                    <h5 className="font-display text-lg font-bold text-[#FDE047]">
                      {brideName} & {groomName}
                    </h5>
                    <p className="text-[11px] text-white/90 italic">
                      "{invitationMessage}"
                    </p>
                    <div className="text-[10px] text-[#FDE68A] pt-1">
                      📅 {weddingDate} · 📍 {venue}
                    </div>
                    <div className="bg-[#FAF0D4] text-[#800020] text-[10px] font-bold py-1 px-3 rounded-full inline-block">
                      Guest: Ramesh Sharma & Family (Personal Pass)
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 5: SEND INVITATIONS & COLLECT RSVPS
              ======================================================== */}
          {currentStep === 5 && (
            <div className="space-y-4 text-xs animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF0D4] to-[#FDF8EE] border-2 border-[#E5C378] text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#800020] text-[#FDE047] flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-serif-luxury text-xl font-bold text-[#800020]">
                  Ready to Celebrate & Send Invitations!
                </h4>
                <p className="text-xs text-[#5C4D43] max-w-md mx-auto leading-relaxed">
                  Your wedding is completely configured. Every guest will receive their own personal link with an interactive RSVP form and QR code pass.
                </p>
              </div>

              {/* WhatsApp Feature Explanation */}
              <div className="p-4 bg-white rounded-xl border border-emerald-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>How WhatsApp Sending Works:</span>
                </div>
                <ul className="space-y-1.5 text-gray-700 pl-6 list-disc text-xs">
                  <li>
                    Clicking <strong>Send</strong> opens WhatsApp directly with the guest's phone number and personalised message filled in.
                  </li>
                  <li>
                    You review the message and press Send inside WhatsApp. No Meta API keys or token setup needed!
                  </li>
                  <li>
                    When guests confirm attendance, your live Catering Planner and Seating Chart update in real-time.
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5C378] flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-[#3D291F] block">
                    {brideName} & {groomName}'s Wedding
                  </span>
                  <span className="text-gray-500">
                    {weddingDate} · {customEvents.length} Ceremonies · {manualGuests.length + parsedCsvRows.filter(r => r.isValid).length} Guests Configured
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              FOOTER ACTIONS & SKIP SUPPORT
              ======================================================== */}
          <div className="pt-4 border-t border-[#E5C378]/40 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-semibold text-[#800020] bg-white border border-[#E5C378] rounded-xl hover:bg-[#FAF0D4] flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              {/* Skip Button for optional steps 2, 3, 4 */}
              {currentStep > 1 && currentStep < 5 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#6B5E55] hover:text-[#800020] hover:underline"
                >
                  Skip this step & return later
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#800020] hover:bg-[#6B081B] rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 rounded-xl shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FDE047]" />
                  <span>Publish Wedding & Open Dashboard</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
