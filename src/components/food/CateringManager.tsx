import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  ChefHat,
  Sliders,
  TrendingDown,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  FileText,
  Printer,
  Save,
  Check,
  Calendar,
  Layers,
  Leaf,
  Heart,
  Baby,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { DiyaIcon, SacredKalash } from '../illustrations/IndianWeddingDecorations';
import { KitchenSlipModal } from './KitchenSlipModal';

export const CateringManager: React.FC = () => {
  const {
    currentWedding,
    events,
    selectedEventId,
    setSelectedEventId,
    foodBufferPercentage,
    setFoodBufferPercentage,
    foodManualAdjustment,
    setFoodManualAdjustment,
    getEventFoodCalculation,
    getCateringPlan,
    updateCateringPlan,
  } = useWedding();

  const selectedEvent = events.find((e) => e.eventId === selectedEventId) || events[0];
  const foodStats = getEventFoodCalculation(selectedEventId);
  const cateringPlan = getCateringPlan(selectedEventId);

  // Form state for editing caterer contract details
  const [catererName, setCatererName] = useState(cateringPlan.catererName);
  const [catererPhone, setCatererPhone] = useState(cateringPlan.contactNumber);
  const [costPerPlate, setCostPerPlate] = useState(cateringPlan.estimatedCostPerPlate || 1200);
  const [platesOrdered, setPlatesOrdered] = useState(cateringPlan.platesOrdered || foodStats.recommendedPlates);
  const [depositPaid, setDepositPaid] = useState(cateringPlan.depositPaid || 0);
  const [foodMenu, setFoodMenu] = useState(cateringPlan.foodMenu);
  const [isSaved, setIsSaved] = useState(false);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

  // Keep local state in sync when switching ceremonies
  React.useEffect(() => {
    const plan = getCateringPlan(selectedEventId);
    setCatererName(plan.catererName);
    setCatererPhone(plan.contactNumber);
    setCostPerPlate(plan.estimatedCostPerPlate || 1200);
    setPlatesOrdered(plan.platesOrdered || foodStats.recommendedPlates);
    setDepositPaid(plan.depositPaid || 0);
    setFoodMenu(plan.foodMenu);
  }, [selectedEventId]);

  // Wastage difference: Ordered vs Recommended
  const plateDifference = platesOrdered - foodStats.recommendedPlates;

  // Traditional Blind Guessing comparison:
  // Typical Indian weddings over-order by ~25% over the total invited guest count
  const blindGuessPlates = Math.ceil((foodStats.totalExpectedFromInvited || 100) * 1.25);
  const platesSaved = Math.max(0, blindGuessPlates - foodStats.recommendedPlates);
  const moneySaved = platesSaved * costPerPlate;
  const foodWeightSavedKg = Math.round(platesSaved * 0.45); // ~450g food per plate
  const communityMealsEquivalent = platesSaved;

  // Total budget & balance
  const totalCateringCost = platesOrdered * costPerPlate;
  const balanceRemaining = Math.max(0, totalCateringCost - depositPaid);

  const handleSaveContract = (e: React.FormEvent) => {
    e.preventDefault();
    updateCateringPlan(selectedEventId, {
      catererName,
      contactNumber: catererPhone,
      estimatedCostPerPlate: Number(costPerPlate),
      platesOrdered: Number(platesOrdered),
      depositPaid: Number(depositPaid),
      foodMenu,
      totalBudget: Number(platesOrdered) * Number(costPerPlate),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleApplyPreset = (bufferPct: number) => {
    setFoodBufferPercentage(bufferPct);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Ceremony Selector */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5C378]/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF0D4] border border-[#E5C378] flex items-center justify-center text-[#800020] shadow-2xs shrink-0">
            <UtensilsCrossed className="w-6 h-6 text-[#800020]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                Zero-Waste Food Planning Engine
              </span>
              <span className="text-[11px] text-[#8C7A70]">·</span>
              <span className="text-[11px] font-medium text-emerald-800">
                Formula: ⌈Confirmed × (1 + {foodBufferPercentage}%)⌉
              </span>
            </div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#800020]">
              Catering & Food Operations Manager
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Accurately order food for {selectedEvent.eventName}, eliminate buffet waste, and track vendor budgets.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSlipModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#800020] hover:bg-[#6B081B] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <ChefHat className="w-4 h-4 text-[#FDE047]" />
            <span>Kitchen Order Slip (Print)</span>
          </button>
        </div>
      </div>

      {/* Ceremony Switcher Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-[#800020] uppercase tracking-wider shrink-0 mr-1">
          Select Ceremony:
        </span>
        {events.map((ev, idx) => (
          <button
            key={`${ev.eventId || 'evt'}_${idx}`}
            onClick={() => setSelectedEventId(ev.eventId)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              selectedEventId === ev.eventId
                ? 'bg-[#800020] text-white shadow-xs'
                : 'bg-white text-[#5C4D43] border border-[#E5C378]/70 hover:bg-[#FAF0D4] hover:text-[#800020]'
            }`}
          >
            {ev.eventName} ({ev.eventDate})
          </button>
        ))}
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Card 1: Confirmed Attendees */}
        <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
            Confirmed Attendees
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#3D291F] mt-1 tabular-nums">
            {foodStats.confirmedAttendees}
          </div>
          <div className="text-[11px] text-[#5C4D43] mt-1">
            {foodStats.confirmedAdults} adults · {foodStats.confirmedChildren} children
          </div>
        </div>

        {/* Card 2: Recommended Plates */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#FAF0D4] to-[#FDF8EE] border-2 border-[#D4AF37] shadow-xs">
          <span className="text-[11px] font-bold text-[#800020] uppercase tracking-wider block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Recommended to Cook
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-black text-[#800020] mt-1 tabular-nums">
            {foodStats.recommendedPlates}
            <span className="text-xs font-normal text-[#800020] ml-1">plates</span>
          </div>
          <div className="text-[11px] text-[#B45309] font-medium mt-1">
            With {foodStats.bufferPercentage}% buffer {foodManualAdjustment !== 0 ? `(${foodManualAdjustment > 0 ? '+' : ''}${foodManualAdjustment} manual)` : ''}
          </div>
        </div>

        {/* Card 3: Plates Ordered */}
        <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
            Plates Contracted
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-800 mt-1 tabular-nums">
            {platesOrdered}
            <span className="text-xs font-normal text-emerald-800 ml-1">plates</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            ₹{costPerPlate} per plate
          </div>
        </div>

        {/* Card 4: Difference & Wastage Status */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          plateDifference === 0
            ? 'bg-emerald-50/70 border-emerald-300'
            : plateDifference > 0
            ? 'bg-amber-50/70 border-amber-300'
            : 'bg-rose-50/70 border-rose-300'
        }`}>
          <span className={`text-[11px] font-bold uppercase tracking-wider block ${
            plateDifference === 0 ? 'text-emerald-800' : plateDifference > 0 ? 'text-amber-800' : 'text-rose-800'
          }`}>
            Ordering Accuracy
          </span>
          <div className={`font-mono text-2xl sm:text-3xl font-black mt-1 tabular-nums ${
            plateDifference === 0 ? 'text-emerald-900' : plateDifference > 0 ? 'text-amber-900' : 'text-rose-900'
          }`}>
            {plateDifference === 0 ? '0' : plateDifference > 0 ? `+${plateDifference}` : plateDifference}
            <span className="text-xs font-normal ml-1">plates</span>
          </div>
          <div className={`text-[11px] font-medium mt-1 ${
            plateDifference === 0 ? 'text-emerald-800' : plateDifference > 0 ? 'text-amber-800' : 'text-rose-800'
          }`}>
            {plateDifference === 0
              ? 'Zero-Waste Perfection ✓'
              : plateDifference > 0
              ? `Surplus: ₹${(plateDifference * costPerPlate).toLocaleString('en-IN')} risk`
              : 'Potential shortage warning'}
          </div>
        </div>

      </div>

      {/* Grid: Scenario Planning Left vs Savings Impact Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Scenario Planning & Safety Buffer Slider */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5C378]/70 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E5C378]/50 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#800020]" />
              <h3 className="font-serif-luxury text-base font-bold text-[#800020]">
                Catering Scenario Engine: {selectedEvent.eventName}
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-[#800020] bg-[#FAF0D4] px-2.5 py-1 rounded border border-[#E5C378]">
              Buffer: {foodBufferPercentage}%
            </span>
          </div>

          {/* Quick Scenario Preset Buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3D291F]">
              Choose Scenario Preset:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Exact RSVP', pct: 0, tag: 'Exact Count' },
                { label: 'Standard', pct: 5, tag: 'Recommended' },
                { label: 'High Assurance', pct: 10, tag: '+10% Buffer' },
                { label: 'Extended Family', pct: 15, tag: '+15% Buffer' },
              ].map((preset) => (
                <button
                  key={preset.pct}
                  type="button"
                  onClick={() => handleApplyPreset(preset.pct)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    foodBufferPercentage === preset.pct
                      ? 'bg-[#800020] text-white border-[#800020] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#3D291F] border-[#E5C378] hover:bg-[#FAF0D4]'
                  }`}
                >
                  <div className="font-bold text-xs">{preset.label}</div>
                  <div className={`text-[10px] ${foodBufferPercentage === preset.pct ? 'text-[#FDE047]' : 'text-[#8C7A70]'}`}>
                    {preset.tag}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Buffer Slider */}
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5C378]/60 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-[#3D291F]">
              <span>Fine-Tune Buffer Percentage:</span>
              <span className="font-mono font-bold text-base text-[#800020]">{foodBufferPercentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={foodBufferPercentage}
              onChange={(e) => setFoodBufferPercentage(Number(e.target.value))}
              className="w-full accent-[#800020] h-2.5 bg-[#F0E6D8] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C7A70] font-mono">
              <span>0% (Exact Headcount)</span>
              <span className="text-[#800020] font-bold">5% (Recommended for Indian Weddings)</span>
              <span>30% (Maximum Safety)</span>
            </div>
          </div>

          {/* Manual Adjustment Stepper */}
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5C378]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-[#3D291F] block">
                Manual Kitchen Plate Offset:
              </span>
              <span className="text-[10px] text-[#786C64]">
                Additional VIP plates, driver meals, or temple priest offerings
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {[-5, -1, 0, 1, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    if (val === 0) setFoodManualAdjustment(0);
                    else setFoodManualAdjustment(foodManualAdjustment + val);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded border transition-colors ${
                    val === 0
                      ? 'bg-white text-[#5C4D43] border-[#E5C378] hover:bg-[#FAF0D4]'
                      : 'bg-[#FAF0D4] text-[#800020] border-[#E5C378] hover:bg-[#F5E3B5]'
                  }`}
                >
                  {val === 0 ? 'Reset' : val > 0 ? `+${val}` : val}
                </button>
              ))}
              <span className="font-mono font-bold text-[#800020] ml-1">
                ({foodManualAdjustment > 0 ? `+${foodManualAdjustment}` : foodManualAdjustment})
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[#6B5E55] leading-relaxed">
            Formula applied: <code className="font-mono text-[#800020]">⌈{foodStats.confirmedAttendees} confirmed × (1 + {foodBufferPercentage}%)⌉ {foodManualAdjustment !== 0 ? `${foodManualAdjustment > 0 ? '+' : ''}${foodManualAdjustment}` : ''} = {foodStats.recommendedPlates} plates</code>.
          </div>
        </div>

        {/* Right Column: "Celebrate More. Waste Less." Financial & Environmental Savings */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#FAF0D4] via-[#FDF8EE] to-[#F5E3B5] p-6 rounded-2xl border-2 border-[#D4AF37] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#075E54]">
              <Leaf className="w-4 h-4 text-emerald-700" />
              <span>Food Wastage Prevention Impact</span>
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#800020] mt-1">
              Celebrate More. Waste Less.
            </h3>
            <p className="text-xs text-[#5C4D43] mt-1 leading-relaxed">
              Traditional Indian weddings over-order catering by 25%–35% due to guesswork. With verified digital RSVPs, you eliminate massive waste.
            </p>

            {/* Impact Metric Cards */}
            <div className="mt-4 space-y-3">
              
              {/* Metric 1: Money Saved */}
              <div className="p-3 bg-white rounded-xl border border-[#E5C378] shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">Estimated Money Saved</span>
                    <strong className="font-mono text-lg font-bold text-emerald-800">
                      ₹{moneySaved.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  {platesSaved} Plates Prevented
                </span>
              </div>

              {/* Metric 2: Kilograms of Food */}
              <div className="p-3 bg-white rounded-xl border border-[#E5C378] shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">Landfill Waste Avoided</span>
                    <strong className="font-mono text-lg font-bold text-[#800020]">
                      ~{foodWeightSavedKg} kg
                    </strong>
                  </div>
                </div>
                <span className="text-[10px] text-[#800020] font-semibold bg-[#FAF0D4] px-2 py-0.5 rounded">
                  Fresh Food Kept Off Landfills
                </span>
              </div>

              {/* Metric 3: Community Equivalent */}
              <div className="p-3 bg-white rounded-xl border border-[#E5C378] shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">Community Meals Equivalent</span>
                    <strong className="font-mono text-lg font-bold text-[#3D291F]">
                      {communityMealsEquivalent} Meals
                    </strong>
                  </div>
                </div>
                <span className="text-[10px] text-[#786C64]">
                  Zero Over-Cooking
                </span>
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-[#E5C378]/50 text-[11px] text-[#5C4D43] italic text-center">
            "Annadaanam Mahadaanam" — Honoring food as sacred by cooking the exact right amount.
          </div>
        </div>

      </div>

      {/* Caterer Contract & Operations Form */}
      <div className="bg-white rounded-2xl border border-[#E5C378]/70 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E5C378]/50 pb-3">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#800020]" />
            <h3 className="font-serif-luxury text-base font-bold text-[#800020]">
              Caterer Contract & Kitchen Operations Details: {selectedEvent.eventName}
            </h3>
          </div>
          <span className="text-xs text-[#786C64]">
            Vendor Contract Tracking
          </span>
        </div>

        <form onSubmit={handleSaveContract} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">Caterer / Halwai Agency Name *</label>
              <input
                type="text"
                required
                value={catererName}
                onChange={(e) => setCatererName(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-lg text-xs focus:outline-hidden focus:border-[#800020]"
                placeholder="e.g. Maharaja Royal Caterers"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">Caterer Phone Number *</label>
              <input
                type="tel"
                required
                value={catererPhone}
                onChange={(e) => setCatererPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-lg text-xs focus:outline-hidden focus:border-[#800020]"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">Estimated Cost Per Plate (₹) *</label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={costPerPlate}
                onChange={(e) => setCostPerPlate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-lg text-xs font-mono focus:outline-hidden focus:border-[#800020]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">
                Plates Contracted / Ordered *
              </label>
              <input
                type="number"
                min="1"
                required
                value={platesOrdered}
                onChange={(e) => setPlatesOrdered(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-lg text-xs font-mono font-bold focus:outline-hidden focus:border-[#800020]"
              />
              <span className="text-[10px] text-[#786C64]">Recommended: {foodStats.recommendedPlates} plates</span>
            </div>

            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">Advance / Deposit Paid (₹)</label>
              <input
                type="number"
                min="0"
                step="500"
                value={depositPaid}
                onChange={(e) => setDepositPaid(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-lg text-xs font-mono focus:outline-hidden focus:border-[#800020]"
              />
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5C378]/60 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-[#8C7A70]">Total Catering Expense</span>
              <div className="font-mono text-base font-bold text-[#800020]">
                ₹{totalCateringCost.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#786C64]">
                Balance Due: ₹{balanceRemaining.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#3D291F] mb-1">Approved Food Menu & Cooking Notes</label>
            <textarea
              rows={3}
              value={foodMenu}
              onChange={(e) => setFoodMenu(e.target.value)}
              className="w-full p-3 bg-[#FAF7F2] border border-[#E5C378] rounded-xl text-xs text-[#3D291F] focus:outline-hidden focus:border-[#800020]"
              placeholder="List courses, live counters, dessert stations, and special dietary cooking instructions..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setIsSlipModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Preview & Print Kitchen Order Slip</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#800020] hover:bg-[#6B081B] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4 text-[#FDE047]" />}
              <span>{isSaved ? 'Contract Saved!' : 'Save Catering Details'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Kitchen Slip Modal */}
      <KitchenSlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        event={selectedEvent}
      />

    </div>
  );
};
