import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, User as UserIcon, Phone, Users, FileText } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, GuestCategory } from '../../types/wedding';
import { DiyaIcon } from '../illustrations/IndianWeddingDecorations';

interface EditGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
}

export const EditGuestModal: React.FC<EditGuestModalProps> = ({
  isOpen,
  onClose,
  guest,
}) => {
  const { updateGuest } = useWedding();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [email, setEmail] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [category, setCategory] = useState<GuestCategory>('Friends');
  const [expectedMembers, setExpectedMembers] = useState(2);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (guest) {
      setName(guest.name);
      setPhone(guest.phone);
      setCountryCode(guest.countryCode || '+91');
      setEmail(guest.email || '');
      setFamilyName(guest.familyName || '');
      setCategory(guest.category);
      setExpectedMembers(guest.expectedMembers);
      setNotes(guest.notes || '');
    }
  }, [guest]);

  if (!isOpen || !guest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    updateGuest(guest.guestId, {
      name,
      phone: phone.replace(/[^0-9]/g, ''),
      countryCode,
      email,
      familyName,
      category,
      expectedMembers,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl border-2 border-[#E5C378] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Gold Border */}
        <div className="h-1.5 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#F59E0B]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6B5E55] hover:text-[#800020] hover:bg-[#FAF0D4] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
              <DiyaIcon className="w-4 h-4" />
              <span>Edit Guest Details</span>
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#800020] mt-1">
              Update {guest.name}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">WhatsApp Phone *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-16 px-2 py-2 bg-[#FAF0D4] border border-[#E5C378] rounded-md text-center font-mono font-bold text-[#800020]"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GuestCategory)}
                  className="w-full px-2.5 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                >
                  <option value="Bride's family">Bride's Family</option>
                  <option value="Groom's family">Groom's Family</option>
                  <option value="Friends">Friends</option>
                  <option value="Relatives">Relatives</option>
                  <option value="Colleagues">Colleagues</option>
                  <option value="Neighbours">Neighbours</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Expected Members</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={expectedMembers}
                  onChange={(e) => setExpectedMembers(Number(e.target.value))}
                  className="w-full px-2.5 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">Family Group Name</label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g. Sharma Family"
                className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@example.com"
                className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">Notes / Diet (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dietary requirements or travel notes..."
                className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#E5C378] bg-white rounded-md font-semibold text-[#5C4D43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#800020] hover:bg-[#6B081B] text-white font-bold rounded-md shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
