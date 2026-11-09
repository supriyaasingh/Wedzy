import React from 'react';
import {
  X,
  Printer,
  Calendar,
  Clock,
  MapPin,
  UtensilsCrossed,
  ChefHat,
  CheckCircle2,
  Phone,
  FileText,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { WeddingEvent } from '../../types/wedding';
import { SacredKalash, DiyaIcon } from '../illustrations/IndianWeddingDecorations';

interface KitchenSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: WeddingEvent;
}

export const KitchenSlipModal: React.FC<KitchenSlipModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const { currentWedding, getEventFoodCalculation, getCateringPlan } = useWedding();

  if (!isOpen) return null;

  const foodStats = getEventFoodCalculation(event.eventId);
  const plan = getCateringPlan(event.eventId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border-2 border-[#D4AF37] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-[#800020] text-white px-6 py-4 border-b border-[#D4AF37] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5B0616] border border-[#E5C378] flex items-center justify-center text-[#FDE68A]">
              <ChefHat className="w-5 h-5 text-[#FDE047]" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#FDE047]">
                Official Kitchen Catering Order Slip
              </h3>
              <p className="text-xs text-white/80">
                Authorized food count slip for Head Chef / Halwai Kitchen Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-full ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Kitchen Slip Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 font-sans text-xs">
          
          {/* Slip Header Box */}
          <div className="p-4 rounded-xl border-2 border-[#800020] bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#800020] block">
                ॥ श्री गणेशाय नमः ॥ · Auspicious Wedding Ceremony
              </span>
              <h2 className="font-serif-luxury text-xl font-bold text-[#800020] mt-0.5">
                {currentWedding.brideName} & {currentWedding.groomName}
              </h2>
              <div className="text-xs text-[#5C4D43] mt-1 space-y-0.5">
                <div>Ceremony: <strong className="text-[#3D291F]">{event.eventName}</strong></div>
                <div>Date & Time: <strong>{event.eventDate} ({event.startTime} - {event.endTime})</strong></div>
                <div>Venue / Kitchen Location: <strong>{event.venue}</strong></div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#E5C378] text-right shrink-0">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider block">
                Total Plates to Cook
              </span>
              <div className="font-mono text-3xl font-black text-[#800020] mt-0.5 tabular-nums">
                {foodStats.recommendedPlates}
              </div>
              <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">
                Includes {foodStats.bufferPercentage}% Safety Buffer
              </span>
            </div>
          </div>

          {/* Headcount Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-white rounded-xl border border-[#E5C378]/70">
              <span className="text-[10px] text-[#8C7A70] uppercase font-bold block">Confirmed Guests</span>
              <div className="font-mono text-xl font-bold text-[#3D291F] mt-1">{foodStats.confirmedAttendees}</div>
              <span className="text-[10px] text-[#5C4D43]">{foodStats.confirmedFamilies} families</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E5C378]/70">
              <span className="text-[10px] text-[#8C7A70] uppercase font-bold block">Adult Portions</span>
              <div className="font-mono text-xl font-bold text-[#800020] mt-1">{foodStats.confirmedAdults}</div>
              <span className="text-[10px] text-[#5C4D43]">Ages 12+</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E5C378]/70">
              <span className="text-[10px] text-[#8C7A70] uppercase font-bold block">Child Portions</span>
              <div className="font-mono text-xl font-bold text-[#B45309] mt-1">{foodStats.confirmedChildren}</div>
              <span className="text-[10px] text-[#5C4D43]">Under 12 years</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E5C378]/70">
              <span className="text-[10px] text-[#8C7A70] uppercase font-bold block">Plates Ordered</span>
              <div className="font-mono text-xl font-bold text-emerald-700 mt-1">{plan.platesOrdered}</div>
              <span className="text-[10px] text-emerald-800">Caterer contract</span>
            </div>
          </div>

          {/* Caterer & Kitchen Instructions */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#800020] border-b border-[#E5C378]/60 pb-1">
              Catering Operations & Menu Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E5C378]/60 space-y-1">
                <span className="font-bold text-[#3D291F] block">Catering Agency / Halwai:</span>
                <div className="text-xs text-[#5C4D43]">{plan.catererName}</div>
                <div className="text-xs text-[#5C4D43] font-mono">Contact: {plan.contactNumber}</div>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E5C378]/60 space-y-1">
                <span className="font-bold text-[#3D291F] block">Host Contact & Authorization:</span>
                <div className="text-xs text-[#5C4D43]">Wedding Family Host: {currentWedding.brideName} / {currentWedding.groomName}</div>
                <div className="text-xs text-[#5C4D43] font-mono">Phone: {currentWedding.contactPhone}</div>
              </div>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E5C378]/60 space-y-1">
              <span className="font-bold text-[#3D291F] block">Approved Food Menu:</span>
              <p className="text-xs text-[#5C4D43] leading-relaxed">
                {plan.foodMenu || 'Standard Royal Banquet Menu'}
              </p>
            </div>
          </div>

          {/* Signatures & Kitchen Delivery Verification */}
          <div className="pt-6 border-t-2 border-dashed border-[#E5C378] grid grid-cols-2 gap-8 text-center">
            <div className="space-y-8">
              <div className="h-10 border-b border-gray-400" />
              <div className="text-[11px] text-[#5C4D43]">
                <strong className="block text-[#3D291F]">Head Chef / Caterer Signature</strong>
                <span>Date & Time Received</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="h-10 border-b border-gray-400" />
              <div className="text-[11px] text-[#5C4D43]">
                <strong className="block text-[#3D291F]">Wedding Host / Family Coordinator</strong>
                <span>Approved for Kitchen Cooking</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E5C378]/60 flex items-center justify-between text-xs text-[#5C4D43] shrink-0">
          <span>
            Slip generated by WeddingGuest Food Wastage Prevention Platform.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 font-semibold text-[#800020] hover:underline"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
