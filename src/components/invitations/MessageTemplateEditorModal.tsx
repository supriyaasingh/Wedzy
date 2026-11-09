import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  Send,
  Info,
  Smartphone,
  Eye,
  CheckCheck,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { DiyaIcon, SacredKalash } from '../illustrations/IndianWeddingDecorations';

interface MessageTemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATE_PRESETS = [
  {
    id: 'auspicious',
    name: 'Auspicious Traditional (Hindi/English)',
    tag: 'Recommended',
    template: `॥ श्री गणेशाय नमः ॥ 🙏
Warmest greetings to {guestName} & Family!

With the divine blessings of our ancestors and the Almighty, we cordially invite you to celebrate the wedding ceremony of:
🌺 {brideName} & {groomName} 🌺

📅 Date: {weddingDate}
⏰ Time: {weddingTime}
📍 Venue: {venue}, {venueAddress}

To help our families make flawless arrangements and prevent food wastage, kindly confirm how many members from your family will join us:
👉 {rsvpUrl}

Your auspicious presence and blessings mean the world to us!

With warm regards & folded hands,
The Families of {brideName} & {groomName}`,
  },
  {
    id: 'heartfelt',
    name: 'Heartfelt & Family Warmth',
    tag: 'Warm',
    template: `Dearest {guestName}! ❤️

Our family's joy will only be complete with you beside us as we celebrate the wedding of {brideName} and {groomName}!

Save the Date:
🗓️ {weddingDate} at {weddingTime}
📍 {venue}, {venueAddress}

Please take a moment to confirm your family's headcount via your personal digital invitation link:
👉 {rsvpUrl}

We can't wait to dance, dine, and make memories together!

With all our love,
{brideName} & {groomName}`,
  },
  {
    id: 'crisp_modern',
    name: 'Crisp & Modern',
    tag: 'Concise',
    template: `Namaste {guestName}! 🙏

{brideName} & {groomName} are getting married, and you're invited to celebrate with us!

📅 Date: {weddingDate}
⏰ Time: {weddingTime}
📍 Venue: {venue}

Please confirm your attendance and party count here to help us finalize catering:
👉 {rsvpUrl}

Looking forward to seeing you there!
{brideName} & {groomName}`,
  },
];

const REMINDER_PRESETS = [
  {
    id: 'gentle_caterer',
    name: 'Catering Finalization Reminder',
    tag: 'High Response Rate',
    template: `Namaste {guestName}! 🙏

Hope you're having a wonderful week! As our wedding date ({weddingDate}) is approaching, our caterers in {venue} need the exact food headcount to ensure zero food waste.

Could you please confirm if you and your family will be attending?
👉 {rsvpUrl}

Takes just 20 seconds. We'd love to have you with us!

Warm regards,
{brideName} & {groomName}`,
  },
  {
    id: 'friendly_nudge',
    name: 'Friendly Countdown Nudge',
    tag: 'Casual',
    template: `Hi {guestName}! 🌟

The countdown to {brideName} & {groomName}'s wedding on {weddingDate} is officially on!

If you haven't had a chance to RSVP yet, please confirm your family count using this link:
👉 {rsvpUrl}

Looking forward to celebrating with you!
{brideName} & {groomName}`,
  },
];

const AVAILABLE_VARIABLES = [
  { key: '{guestName}', label: 'Guest Name', example: 'Rahul Sharma' },
  { key: '{brideName}', label: 'Bride Name', example: 'Ananya' },
  { key: '{groomName}', label: 'Groom Name', example: 'Kabir' },
  { key: '{weddingDate}', label: 'Wedding Date', example: 'Nov 28, 2026' },
  { key: '{weddingTime}', label: 'Time', example: '10:30 AM' },
  { key: '{venue}', label: 'Venue Name', example: 'Taj Jai Mahal Palace' },
  { key: '{venueAddress}', label: 'Venue Address', example: 'Jacob Road, Jaipur' },
  { key: '{rsvpUrl}', label: 'Personal RSVP Link', example: 'https://.../?rsvp=tok_123' },
];

export const MessageTemplateEditorModal: React.FC<MessageTemplateEditorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentWedding, updateWedding } = useWedding();

  const [activeTab, setActiveTab] = useState<'invite' | 'reminder'>('invite');
  const [inviteTemplate, setInviteTemplate] = useState<string>(
    currentWedding.customWhatsAppMessage || TEMPLATE_PRESETS[0].template
  );
  const [reminderTemplate, setReminderTemplate] = useState<string>(
    currentWedding.customWhatsAppReminder || REMINDER_PRESETS[0].template
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const currentText = activeTab === 'invite' ? inviteTemplate : reminderTemplate;
  const setCurrentText = activeTab === 'invite' ? setInviteTemplate : setReminderTemplate;

  const handleInsertVariable = (variableKey: string) => {
    setCurrentText((prev) => prev + ` ${variableKey}`);
  };

  const handleApplyPreset = (presetText: string) => {
    setCurrentText(presetText);
  };

  const handleSave = () => {
    updateWedding({
      customWhatsAppMessage: inviteTemplate,
      customWhatsAppReminder: reminderTemplate,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleResetDefault = () => {
    if (activeTab === 'invite') {
      setInviteTemplate(TEMPLATE_PRESETS[0].template);
    } else {
      setReminderTemplate(REMINDER_PRESETS[0].template);
    }
  };

  // Preview renderer replacing tokens with mock data
  const renderPreviewMessage = () => {
    return currentText
      .replace(/{guestName}/g, 'Rahul Sharma')
      .replace(/{brideName}/g, currentWedding.brideName)
      .replace(/{groomName}/g, currentWedding.groomName)
      .replace(/{weddingDate}/g, new Date(currentWedding.weddingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }))
      .replace(/{weddingTime}/g, currentWedding.weddingTime)
      .replace(/{venue}/g, currentWedding.venue)
      .replace(/{venueAddress}/g, currentWedding.venueAddress)
      .replace(/{rsvpUrl}/g, `${window.location.origin}/?rsvp=tok_demo_rahul`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-2xl border-2 border-[#E5C378] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-[#800020] text-white px-6 py-4 border-b border-[#D4AF37] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5B0616] border border-[#E5C378] flex items-center justify-center text-[#FDE68A]">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#FDE047]">
                WhatsApp Message Customizer
              </h3>
              <p className="text-xs text-white/80">
                Personalized templates for WhatsApp digital invitation links and catering reminders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector (Invite vs Reminder) */}
        <div className="bg-white px-6 py-3 border-b border-[#E5C378]/50 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('invite')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'invite'
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'text-[#5C4D43] hover:bg-[#FAF0D4] hover:text-[#800020]'
              }`}
            >
              1. Main WhatsApp Invitation
            </button>
            <button
              onClick={() => setActiveTab('reminder')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'reminder'
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'text-[#5C4D43] hover:bg-[#FAF0D4] hover:text-[#800020]'
              }`}
            >
              2. Follow-Up Reminder (Pending RSVPs)
            </button>
          </div>

          <button
            onClick={handleResetDefault}
            className="text-xs font-semibold text-[#8C7A70] hover:text-[#800020] flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>

        {/* Modal Body - 2 Columns (Editor Left, Live WhatsApp Phone Right) */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Template Controls */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800020] mb-1.5">
                Choose Tone Preset:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(activeTab === 'invite' ? TEMPLATE_PRESETS : REMINDER_PRESETS).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p.template)}
                    className="p-2.5 text-left rounded-lg bg-white border border-[#E5C378]/70 hover:border-[#800020] hover:bg-[#FAF0D4]/30 transition-all text-xs group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#3D291F] group-hover:text-[#800020]">
                        {p.name.split('(')[0]}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#B45309] font-medium bg-[#FAF0D4] px-1.5 py-0.5 rounded">
                      {p.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Variable Tokens */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#800020]">
                  Click to Insert Personalization Tags:
                </label>
                <span className="text-[10px] text-[#8C7A70]">Auto-replaced per guest</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => handleInsertVariable(v.key)}
                    className="px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-[#FAF0D4] text-[#800020] border border-[#E5C378] rounded-md transition-colors shadow-2xs"
                    title={`Inserts ${v.label} (e.g. ${v.example})`}
                  >
                    + {v.key}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3D291F] mb-1.5">
                Message Content:
              </label>
              <textarea
                rows={9}
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                className="w-full p-3.5 bg-white border-2 border-[#E5C378] rounded-xl font-sans text-xs text-[#3D291F] focus:outline-hidden focus:border-[#800020] leading-relaxed shadow-inner"
                placeholder="Enter customized WhatsApp message..."
              />
              <p className="text-[11px] text-[#786C64] mt-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#B45309]" />
                WhatsApp supports *bold*, _italics_, and line breaks. The `{'{rsvpUrl}'}` tag contains the guest's unique token.
              </p>
            </div>

          </div>

          {/* Right Column: Live WhatsApp Mobile Simulator */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="text-xs font-bold uppercase tracking-wider text-[#800020] mb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>Guest's WhatsApp View</span>
            </div>

            {/* Simulated Phone Shell */}
            <div className="w-full max-w-sm rounded-3xl bg-[#121B22] p-3 shadow-xl border-4 border-[#2A3942] flex flex-col h-[460px]">
              
              {/* WhatsApp Chat Top Bar */}
              <div className="bg-[#1F2C34] text-white px-3 py-2 rounded-t-2xl flex items-center gap-2.5 shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#800020] border border-[#E5C378] flex items-center justify-center text-xs font-bold text-[#FDE047]">
                  {currentWedding.brideName.charAt(0)}{currentWedding.groomName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#E9EDEF] truncate">
                    {currentWedding.brideName} & {currentWedding.groomName}
                  </div>
                  <div className="text-[10px] text-[#8696A0]">online</div>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div
                className="flex-1 p-3 overflow-y-auto space-y-2"
                style={{
                  backgroundColor: '#0B141A',
                  backgroundImage: `radial-gradient(#1f2c34 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              >
                {/* Outgoing Message Bubble */}
                <div className="bg-[#005C4B] text-[#E9EDEF] rounded-xl rounded-tr-xs p-3 text-xs leading-relaxed max-w-[95%] ml-auto shadow-sm space-y-2 whitespace-pre-wrap">
                  <div>{renderPreviewMessage()}</div>

                  <div className="flex items-center justify-end gap-1 text-[9px] text-[#8696A0] pt-1">
                    <span>10:30 AM</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                  </div>
                </div>
              </div>

              {/* Chat Bottom Fake Input */}
              <div className="bg-[#1F2C34] px-3 py-2 rounded-b-2xl flex items-center gap-2 shrink-0 text-[#8696A0] text-xs">
                <span className="flex-1 bg-[#2A3942] rounded-full px-3 py-1.5 text-[11px] text-[#8696A0]">
                  Type a reply...
                </span>
                <div className="w-7 h-7 rounded-full bg-[#00A884] flex items-center justify-center text-white">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-4 border-t border-[#E5C378]/50 flex items-center justify-between shrink-0">
          <div className="text-xs text-[#5C4D43]">
            Changes apply immediately to all one-click WhatsApp dispatch links and batch queues.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5C4D43] hover:text-[#800020] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-[#800020] hover:bg-[#6B081B] rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Templates Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#FDE047]" />
                  <span>Save Templates</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
