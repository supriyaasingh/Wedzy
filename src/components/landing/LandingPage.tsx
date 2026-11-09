import React, { useState } from 'react';
import {
  Sparkles,
  HeartHandshake,
  Send,
  Users,
  UtensilsCrossed,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Calendar,
  QrCode,
  Layers,
  MapPin,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { WEDDING_THEMES } from '../../data/weddingThemes';
import { WeddingThemeId } from '../../types/wedding';
import {
  MandapArch,
  DiyaIcon,
  SacredKalash,
  DholDrumIcon,
  ShehnaiIcon,
  RangoliMotif,
  MarigoldGarland,
  FloatingPetals,
} from '../illustrations/IndianWeddingDecorations';
import { DigitalInvitationCard } from '../invitation/DigitalInvitationCard';
import { InteractiveFoodCalculatorWidget } from './InteractiveFoodCalculatorWidget';

interface LandingPageProps {
  onExploreDemo: () => void;
  onCreateWedding: () => void;
  onOpenRsvpModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreDemo,
  onCreateWedding,
  onOpenRsvpModal,
}) => {
  const { currentWedding } = useWedding();
  const [selectedThemeId, setSelectedThemeId] = useState<WeddingThemeId>('royal_maroon');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const heroIllustrationAssets = [
    {
      id: 'baraat',
      title: 'Baraat & Dhol Procession',
      src: '/assets/aistudio/image_e5596fb6.png',
      caption: 'Groom on decorated horse with dhol drummers and dancing guests',
    },
    {
      id: 'orchestra',
      title: 'Grand Mandap & Band',
      src: '/assets/aistudio/image_462bf99c.png',
      caption: 'Regal wedding arch with traditional trumpet and band celebration',
    },
    {
      id: 'south_kalyanam',
      title: 'South Indian Kalyanam',
      src: '/assets/aistudio/image_824ba388.png',
      caption: 'Banana leaves, jasmine garlands, veena & nadaswaram melodies',
    },
    {
      id: 'royal_couple',
      title: 'Pastel Royal Varmala',
      src: '/assets/aistudio/image_b4fb396f.png',
      caption: 'Bride and groom in traditional pastel royal wedding outfits',
    },
  ];

  const [activeHeroAssetIndex, setActiveHeroAssetIndex] = useState(0);

  const faqs = [
    {
      q: 'Do wedding guests need to download an app or create an account to RSVP?',
      a: 'No, not at all! Guests receive a personalized invitation link via WhatsApp. When they tap the link on their smartphone, their private wedding invitation card opens instantly in any web browser. They can confirm attendance and headcount in under 30 seconds without creating any account or password.',
    },
    {
      q: 'How does WeddingGuest reduce catering food wastage?',
      a: 'Traditional Indian weddings over-order by 25% to 40% out of fear that food might run out. WeddingGuest provides accurate headcounts of confirmed adults and children across each function (Haldi, Mehendi, Sangeet, Wedding, Reception). Our formula applies a precise 5% safety buffer on confirmed attendees only, saving an average of 40 to 90 plates (₹60,000 to ₹1,50,000) per wedding while guaranteeing plenty of food for everyone.',
    },
    {
      q: 'How does the WhatsApp Click-to-Chat invitation work?',
      a: 'With one tap, WeddingGuest opens WhatsApp with a warm, personalized invitation text pre-filled with the guest’s name, date, venue, and unique personal RSVP link. The host simply reviews and taps send. Unlike spammy bots, this uses official WhatsApp web/mobile links without risk of number bans.',
    },
    {
      q: 'Can one invitation be sent to an entire family?',
      a: 'Yes! Indian weddings are family celebrations. You can group guests under family units (e.g. "Sharma Family"). The primary contact receives one invitation link and can confirm attendance for their entire household, specifying the breakdown of adults and children.',
    },
    {
      q: 'Can we manage multiple wedding functions with separate guest lists?',
      a: 'Absolutely. You can create distinct events like Haldi, Mehendi, Sangeet, Wedding Ceremony, and Reception. Each event has its own separate guest count, separate RSVP tracking, and dedicated food quantity calculations.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#2C1810] overflow-hidden">
      {/* Subtle Festive Background Petals Animation */}
      <FloatingPetals />

      {/* ========================================================
          HERO SECTION (Part 2, Section 6)
          ======================================================== */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E5C378]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Auspicious Kalash Banner */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <DiyaIcon className="w-5 h-5 text-[#B45309]" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#B45309] font-serif-luxury">
              Auspicious Indian Wedding Invitation & Food Management
            </span>
            <DiyaIcon className="w-5 h-5 text-[#B45309]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text & Primary CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left z-10">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#800020] leading-[1.12]">
                Your Wedding, <br />
                <span className="gold-gradient-text italic font-serif-luxury">
                  Beautifully Organized.
                </span>
              </h1>

              <p className="mt-4 text-lg sm:text-xl font-medium text-[#5B4636] max-w-2xl mx-auto lg:mx-0">
                Celebrate together. Plan smarter. Waste less.
              </p>

              <p className="mt-3 text-sm sm:text-base text-[#6B5E55] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Send royal digital invitations via WhatsApp, collect exact guest headcounts, and calculate accurate catering plates with zero food waste.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onCreateWedding}
                  className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#800020] via-[#990000] to-[#800020] hover:from-[#6B081B] hover:to-[#800020] rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 border border-[#D4AF37]/50"
                >
                  <Sparkles className="w-4 h-4 text-[#FDE047]" />
                  <span>Create Your Wedding</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExploreDemo}
                  className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border-2 border-[#E5C378] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Demo Wedding</span>
                  <span className="text-[11px] font-mono font-normal text-[#800020] bg-white/60 px-2 py-0.5 rounded">
                    Instant Access
                  </span>
                </button>
              </div>

              {/* Trust & Culture Markers */}
              <div className="mt-8 pt-6 border-t border-[#E5C378]/40 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#5C4D43]">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>WhatsApp 1-Click Invites</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Adult & Child Count Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Accurate Food Plate Formula</span>
                </div>
              </div>
            </div>

            {/* Right Column: Large Hand-Drawn Indian Wedding Illustration Showcase */}
            <div className="lg:col-span-5 relative z-10">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-[#FAF0D4] via-[#FDF8EE] to-[#F5E3B5] border-2 border-[#E5C378] shadow-2xl relative">
                
                {/* Decorative Mandap Crest */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#800020] text-[#FDE68A] text-xs font-serif-luxury font-bold border border-[#E5C378] shadow-md flex items-center gap-1.5 whitespace-nowrap">
                  <DiyaIcon className="w-3.5 h-3.5" />
                  <span>Royal Celebration Preview</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#D4AF37] bg-white shadow-inner relative group">
                  <img
                    src={heroIllustrationAssets[activeHeroAssetIndex].src}
                    alt={heroIllustrationAssets[activeHeroAssetIndex].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-80 sm:h-96 object-contain bg-[#FAF7F2] p-2 transition-transform duration-700 group-hover:scale-102"
                  />
                  
                  {/* Caption Scrim */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white text-center">
                    <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#FDE047]">
                      {heroIllustrationAssets[activeHeroAssetIndex].title}
                    </h4>
                    <p className="text-xs text-white/80 mt-0.5">
                      {heroIllustrationAssets[activeHeroAssetIndex].caption}
                    </p>
                  </div>
                </div>

                {/* Illustration Selector Tabs */}
                <div className="grid grid-cols-4 gap-1.5 mt-3">
                  {heroIllustrationAssets.map((asset, index) => (
                    <button
                      key={asset.id}
                      onClick={() => setActiveHeroAssetIndex(index)}
                      className={`py-1.5 px-1 text-[10px] font-medium rounded-md transition-all text-center truncate ${
                        activeHeroAssetIndex === index
                          ? 'bg-[#800020] text-white font-bold shadow-xs'
                          : 'bg-white/80 text-[#5C4D43] hover:bg-white border border-[#E5C378]/50'
                      }`}
                    >
                      {asset.title.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 1: WELCOME & CORE MISSION QUOTE
          ======================================================== */}
      <section className="py-14 sm:py-18 bg-[#F5EBE0]/50 border-b border-[#E5C378]/40 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SacredKalash className="w-12 h-12 mx-auto mb-3" />
          
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-[#800020] italic leading-snug">
            “Every wedding is special. Every guest matters. Every meal counts. Let’s celebrate without unnecessary food waste.”
          </h2>

          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#B45309]">
              The WeddingGuest Philosophy
            </span>
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
          </div>

          <p className="mt-4 text-sm sm:text-base text-[#6B5E55] max-w-2xl mx-auto leading-relaxed">
            In Indian weddings, feeding guests with warmth and abundance is a sacred tradition. But guessing guest numbers leads to tons of wasted food and strained family budgets. WeddingGuest brings peace of mind by giving hosts exact headcounts before the caterer turns on the stoves.
          </p>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: HOW WEDDINGGUEST WORKS (Part 2, Section 6)
          ======================================================== */}
      <section id="how-it-works" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B45309] bg-[#FAF0D4] px-3.5 py-1 rounded-full border border-[#E5C378]/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Effortless 5-Step Process</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#800020]">
            How WeddingGuest Works
          </h2>
          <p className="text-sm sm:text-base text-[#6B5E55] mt-2">
            Designed with elder-friendly simplicity so parents and relatives can organize weddings with complete confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-xl border border-[#E5C378]/60 shadow-sm relative group hover:border-[#800020] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#FAF0D4] text-[#800020] font-bold font-mono text-sm flex items-center justify-center mb-4 border border-[#E5C378]">
              01
            </div>
            <h3 className="font-bold font-serif-luxury text-base text-[#800020]">
              Create Wedding & Events
            </h3>
            <p className="text-xs text-[#6B5E55] mt-2 leading-relaxed">
              Add couple details, choose a traditional theme, and set up ceremonies (Haldi, Sangeet, Wedding, Reception).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-xl border border-[#E5C378]/60 shadow-sm relative group hover:border-[#800020] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#FAF0D4] text-[#800020] font-bold font-mono text-sm flex items-center justify-center mb-4 border border-[#E5C378]">
              02
            </div>
            <h3 className="font-bold font-serif-luxury text-base text-[#800020]">
              Add Guests & Families
            </h3>
            <p className="text-xs text-[#6B5E55] mt-2 leading-relaxed">
              Add individual guests or group households. Import full contact lists via CSV/Excel template with instant phone validation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-xl border border-[#E5C378]/60 shadow-sm relative group hover:border-[#800020] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#FAF0D4] text-[#800020] font-bold font-mono text-sm flex items-center justify-center mb-4 border border-[#E5C378]">
              03
            </div>
            <h3 className="font-bold font-serif-luxury text-base text-[#800020]">
              1-Click WhatsApp Invite
            </h3>
            <p className="text-xs text-[#6B5E55] mt-2 leading-relaxed">
              Send personalized invitations on WhatsApp with one click. Pre-filled text includes ceremony details and unique RSVP link.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-xl border border-[#E5C378]/60 shadow-sm relative group hover:border-[#800020] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#FAF0D4] text-[#800020] font-bold font-mono text-sm flex items-center justify-center mb-4 border border-[#E5C378]">
              04
            </div>
            <h3 className="font-bold font-serif-luxury text-base text-[#800020]">
              Instant Guest Headcount
            </h3>
            <p className="text-xs text-[#6B5E55] mt-2 leading-relaxed">
              Guests tap "Yes" or "No" and confirm how many adults and children are attending. No password or app download required.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-6 rounded-xl border border-[#E5C378]/60 shadow-sm relative group hover:border-[#800020] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#FAF0D4] text-[#800020] font-bold font-mono text-sm flex items-center justify-center mb-4 border border-[#E5C378]">
              05
            </div>
            <h3 className="font-bold font-serif-luxury text-base text-[#800020]">
              Exact Catering Math
            </h3>
            <p className="text-xs text-[#6B5E55] mt-2 leading-relaxed">
              Our smart calculator applies a 5% buffer on confirmed RSVPs. Order exact plates with zero excess bills and zero food trash.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================
          SECTION 3: MAIN FEATURES BENTO GRID
          ======================================================== */}
      <section id="features" className="py-16 sm:py-20 bg-[#FDFBF7] border-y border-[#E5C378]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#800020]">
              Built for Indian Wedding Traditions
            </h2>
            <p className="text-sm sm:text-base text-[#6B5E55] mt-2">
              Every detail honors our culture while giving hosts modern technological clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-white border border-[#E5C378]/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0D4] text-[#800020] flex items-center justify-center mb-4 border border-[#E5C378]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury text-[#800020]">
                WhatsApp Click-to-Chat Invitations
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5E55] mt-2 leading-relaxed">
                Generate tailored WhatsApp messages with the guest’s name and individualized RSVP token. Track sharing status transparently without unverified bot delivery claims.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-white border border-[#E5C378]/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0D4] text-[#800020] flex items-center justify-center mb-4 border border-[#E5C378]">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury text-[#800020]">
                Food Wastage Prevention Engine
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5E55] mt-2 leading-relaxed">
                Real-time formula: <code className="font-mono text-xs text-[#800020] bg-[#FAF0D4] px-1.5 py-0.5 rounded font-bold">⌈Attendees × (1 + 5%)⌉</code>. Only verified responses count. Pending and declined guests are never mistakenly added to food bills.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-white border border-[#E5C378]/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0D4] text-[#800020] flex items-center justify-center mb-4 border border-[#E5C378]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury text-[#800020]">
                Multi-Function Management
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5E55] mt-2 leading-relaxed">
                Separate guest lists and catering counts for Haldi, Mehendi, Sangeet, Wedding, and Reception. Some guests attend all, others attend only the reception.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl bg-white border border-[#E5C378]/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0D4] text-[#800020] flex items-center justify-center mb-4 border border-[#E5C378]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury text-[#800020]">
                Family Group RSVPs
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5E55] mt-2 leading-relaxed">
                Invite the entire family with one link. The primary guest specifies adults, children, and names of accompanying members, avoiding individual follow-up headaches.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl bg-white border border-[#E5C378]/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0D4] text-[#800020] flex items-center justify-center mb-4 border border-[#E5C378]">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury text-[#800020]">
                Unique QR Code Verification
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5E55] mt-2 leading-relaxed">
                Generate high-resolution QR codes for physical card inserts or wedding entrance check-in. Tapping or scanning takes guests straight to their RSVP.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl bg-white border border-[#E5C378]/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0D4] text-[#800020] flex items-center justify-center mb-4 border border-[#E5C378]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury text-[#800020]">
                PWA & Offline Reliability
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5E55] mt-2 leading-relaxed">
                Install directly on Android or iPhone home screens as a native Progressive Web App. Clean, touch-optimized forms that never crop or break on mobile.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: DIGITAL WEDDING INVITATIONS (Part 2, Section 6)
          ======================================================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#800020]">
            Digital Wedding Invitations
          </h2>
          <p className="text-sm sm:text-base text-[#6B5E55] mt-2">
            Opening your invitation link feels like unwrapping an exquisite physical royal wedding card, right inside WhatsApp.
          </p>

          {/* Theme Switcher Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {(Object.keys(WEDDING_THEMES) as WeddingThemeId[]).map((themeKey) => {
              const th = WEDDING_THEMES[themeKey];
              return (
                <button
                  key={themeKey}
                  onClick={() => setSelectedThemeId(themeKey)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    selectedThemeId === themeKey
                      ? 'bg-[#800020] text-[#FDE68A] border-[#D4AF37] shadow-sm scale-105'
                      : 'bg-white text-[#5C4D43] border-[#E5C378]/60 hover:bg-[#FAF0D4]'
                  }`}
                >
                  {th.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Invitation Card Showcase */}
        <div className="flex justify-center">
          <DigitalInvitationCard
            wedding={currentWedding}
            guestName="Rahul Sharma"
            themeOverride={selectedThemeId}
            onOpenRsvpModal={onOpenRsvpModal}
            showRsvpButtons={true}
          />
        </div>
      </section>

      {/* ========================================================
          SECTION 5: WHATSAPP RSVP PROCESS (Part 2, Section 6)
          ======================================================== */}
      <section className="py-16 sm:py-20 bg-[#FDF8EE] border-y border-[#E5C378]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Visual Mock of WhatsApp Chat */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md bg-[#075E54] rounded-2xl shadow-xl overflow-hidden border-4 border-[#25D366]/30">
                
                {/* WhatsApp Chat Header */}
                <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3 text-white">
                  <div className="w-9 h-9 rounded-full bg-[#128C7E] flex items-center justify-center font-bold text-xs">
                    WG
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm block">Ananya & Kabir (Wedding)</span>
                    <span className="text-[10px] text-emerald-200">Official Wedding Invite</span>
                  </div>
                  <Send className="w-4 h-4 text-emerald-300" />
                </div>

                {/* WhatsApp Chat Body */}
                <div className="bg-[#EFEAE2] p-4 space-y-3 min-h-[300px] flex flex-col justify-end text-xs">
                  <div className="bg-white p-3.5 rounded-lg rounded-tl-none shadow-xs border border-neutral-200 max-w-[90%] space-y-2 text-[#303030]">
                    <p className="font-medium text-[#111827]">
                      Namaste Rahul ji! 🙏
                    </p>
                    <p>
                      We are overjoyed to invite you and your family to celebrate the wedding ceremonies of <strong>Ananya & Kabir</strong> in Jaipur.
                    </p>
                    <div className="bg-[#F7F7F7] p-2 rounded border border-neutral-200 text-[11px] space-y-1">
                      <div>📅 <strong>Date:</strong> 20 December 2026</div>
                      <div>📍 <strong>Venue:</strong> The Oberoi Rajvilas, Jaipur</div>
                    </div>
                    <p>
                      To help us prepare delicious food and avoid wastage, please confirm how many members will attend using your personal RSVP link:
                    </p>
                    <div className="bg-[#E7F3EF] p-2 rounded border border-[#25D366]/40 text-[#075E54] font-semibold text-[11px] break-all">
                      👉 weddingguest.app/?rsvp=tok_sharma_9811
                    </div>
                    <div className="text-[10px] text-neutral-400 text-right mt-1">
                      10:42 AM · Sent via WeddingGuest
                    </div>
                  </div>

                  <div className="self-end bg-[#DCF8C6] p-2.5 rounded-lg rounded-tr-none shadow-xs text-[11px] max-w-[80%] text-[#303030]">
                    "Thank you Ananya! Just confirmed 4 of us are coming. Looking forward to celebrating with you all! ❤️"
                    <div className="text-[9px] text-neutral-400 text-right mt-0.5">10:45 AM ✓✓</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Explanatory Copy */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#25D366] bg-[#075E54] px-3 py-1 rounded-md">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Meta WhatsApp Click-to-Chat</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#800020]">
                Frictionless WhatsApp RSVP Process
              </h2>

              <p className="text-sm sm:text-base text-[#6B5E55] leading-relaxed">
                Indian families use WhatsApp all day. Rather than emailing long invitations or making hundreds of awkward follow-up phone calls, WeddingGuest automates the entire flow:
              </p>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0D4] text-[#800020] font-bold flex items-center justify-center shrink-0 border border-[#E5C378]">1</span>
                  <p className="text-[#4A382C]">
                    <strong>Personalized Pre-fill:</strong> Message automatically fills the guest’s name, ceremony details, and private response token.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0D4] text-[#800020] font-bold flex items-center justify-center shrink-0 border border-[#E5C378]">2</span>
                  <p className="text-[#4A382C]">
                    <strong>Zero Logins for Guests:</strong> Tapping the link opens their mobile wedding card directly. No app installation, no sign up required.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0D4] text-[#800020] font-bold flex items-center justify-center shrink-0 border border-[#E5C378]">3</span>
                  <p className="text-[#4A382C]">
                    <strong>Real Delivery Status Tracking:</strong> Track whether links are not shared, opened in WhatsApp, confirmed sent by host, or RSVP received.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onExploreDemo}
                  className="px-5 py-2.5 text-xs font-bold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-lg shadow-xs transition-all flex items-center gap-2"
                >
                  <span>Test WhatsApp Sharing in Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: SMART GUEST MANAGEMENT (Part 2, Section 6)
          ======================================================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#800020]">
            Smart Guest & Family Management
          </h2>
          <p className="text-sm sm:text-base text-[#6B5E55] mt-2">
            Organize hundreds of attendees cleanly by bride's side, groom's side, family units, and diet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-white border border-[#E5C378]/60 shadow-2xs">
            <h4 className="font-bold font-serif-luxury text-base text-[#800020] mb-1">
              Family Grouping
            </h4>
            <p className="text-xs text-[#6B5E55]">
              Link spouses and children under one family card so one response updates the entire party.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E5C378]/60 shadow-2xs">
            <h4 className="font-bold font-serif-luxury text-base text-[#800020] mb-1">
              Bulk CSV / Excel Import
            </h4>
            <p className="text-xs text-[#6B5E55]">
              Upload your existing phone lists with instant duplicate phone number detection.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E5C378]/60 shadow-2xs">
            <h4 className="font-bold font-serif-luxury text-base text-[#800020] mb-1">
              Dietary Categorization
            </h4>
            <p className="text-xs text-[#6B5E55]">
              Track pure vegetarian, Jain, vegan, or nut allergies so caterers can prepare accordingly.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E5C378]/60 shadow-2xs">
            <h4 className="font-bold font-serif-luxury text-base text-[#800020] mb-1">
              Pending Follow-ups
            </h4>
            <p className="text-xs text-[#6B5E55]">
              Filter guests who haven't responded and trigger polite 1-click WhatsApp reminders.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: FOOD WASTAGE REDUCTION WIDGET (Part 2, Section 6)
          ======================================================== */}
      <section id="food-calculator" className="py-16 sm:py-20 bg-[#FDFBF7] border-y border-[#E5C378]/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B45309] bg-[#FAF0D4] px-3.5 py-1 rounded-full border border-[#E5C378] mb-2">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Interactive Calculator</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#800020]">
              Food Wastage Reduction Calculator
            </h2>
            <p className="text-sm sm:text-base text-[#6B5E55] mt-2">
              Drag the sliders below to see how our mathematical RSVP buffer saves money and preserves food integrity.
            </p>
          </div>

          <InteractiveFoodCalculatorWidget />
        </div>
      </section>

      {/* ========================================================
          SECTION 8: WEDDING THEMES SHOWCASE (Part 2, Section 6)
          ======================================================== */}
      <section id="themes" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#800020]">
            5 Culturally Authentic Themes
          </h2>
          <p className="text-sm sm:text-base text-[#6B5E55] mt-2">
            Hand-drawn cartoon illustrations, regional instruments, and traditional color motifs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {(Object.keys(WEDDING_THEMES) as WeddingThemeId[]).map((themeKey) => {
            const th = WEDDING_THEMES[themeKey];
            return (
              <div
                key={themeKey}
                onClick={() => setSelectedThemeId(themeKey)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedThemeId === themeKey
                    ? 'border-[#800020] bg-white shadow-md scale-102'
                    : 'border-[#E5C378]/50 bg-white/70 hover:bg-white hover:border-[#D4AF37]'
                }`}
              >
                <div>
                  <div className="h-32 rounded-lg overflow-hidden border border-neutral-200 mb-3 bg-neutral-100">
                    <img
                      src={th.imageAsset}
                      alt={th.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-serif-luxury font-bold text-sm text-[#800020]">
                    {th.name}
                  </h4>
                  <p className="text-[11px] text-[#786C64] mt-1 leading-snug">
                    {th.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] text-[#B45309]">
                  <span className="font-medium">View Design</span>
                  <span>✦</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SECTION 9: FREQUENTLY ASKED QUESTIONS (Part 2, Section 6)
          ======================================================== */}
      <section id="faq" className="py-16 sm:py-20 bg-[#FAF7F2] border-t border-[#E5C378]/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#800020]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-[#6B5E55] mt-2">
              Everything you need to know about digital Indian wedding invitations and food planning.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E5C378]/60 bg-white overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif-luxury font-bold text-sm sm:text-base text-[#3D291F] hover:text-[#800020]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#800020] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-[#6B5E55] leading-relaxed border-t border-[#F0E6D8] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 10: FOOTER (Part 2, Section 6)
          ======================================================== */}
      <footer className="bg-[#5B0616] text-[#FDF8EE] pt-14 pb-10 border-t-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
            
            {/* Brand column (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#800020] flex items-center justify-center border border-[#D4AF37]">
                  <DiyaIcon className="w-5 h-5 text-[#FDE047]" />
                </div>
                <span className="font-display text-2xl font-bold tracking-tight text-[#FDE047]">
                  WeddingGuest
                </span>
              </div>
              <p className="text-xs text-[#FAF0D4]/80 max-w-sm leading-relaxed">
                Smart Indian Wedding Invitation, RSVP & Guest Management Platform. Celebrate more. Waste less.
              </p>
              <div className="text-xs font-serif-luxury text-[#E5C378] italic">
                “Every wedding is special. Every guest matters. Every meal counts.”
              </div>
            </div>

            {/* Quick Links (4 cols) */}
            <div className="md:col-span-4 space-y-2 text-xs">
              <span className="font-bold text-[#FDE68A] uppercase tracking-wider block mb-2">
                Quick Navigation
              </span>
              <div className="flex flex-col space-y-1.5 text-white/80">
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                <a href="#features" className="hover:text-white transition-colors">Main Features</a>
                <a href="#food-calculator" className="hover:text-white transition-colors">Smart Food Calculator</a>
                <a href="#themes" className="hover:text-white transition-colors">Traditional Themes</a>
                <a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a>
              </div>
            </div>

            {/* Actions (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <span className="font-bold text-[#FDE68A] uppercase tracking-wider text-xs block">
                Get Started
              </span>
              <button
                onClick={onExploreDemo}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] rounded-md transition-colors shadow-sm"
              >
                Launch Demo Wedding
              </button>
              <button
                onClick={onCreateWedding}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] border border-[#D4AF37] rounded-md transition-colors"
              >
                Create Your Wedding
              </button>
            </div>

          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/60 gap-4">
            <div>
              © 2026 WeddingGuest. Culturally Indian · Designed with reverence & precision.
            </div>
            <div className="flex items-center gap-4">
              <span>Celebrate More · Waste Less</span>
              <span>·</span>
              <span>Your Wedding, Beautifully Organized</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
