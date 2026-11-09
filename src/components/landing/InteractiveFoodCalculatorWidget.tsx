import React, { useState } from 'react';
import { Utensils, TrendingDown, ShieldAlert, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { DiyaIcon } from '../illustrations/IndianWeddingDecorations';

interface InteractiveFoodCalculatorWidgetProps {
  initialAdults?: number;
  initialChildren?: number;
  initialBuffer?: number;
  costPerPlate?: number;
  isCompact?: boolean;
}

export const InteractiveFoodCalculatorWidget: React.FC<InteractiveFoodCalculatorWidgetProps> = ({
  initialAdults = 180,
  initialChildren = 40,
  initialBuffer = 5,
  costPerPlate = 1400, // INR avg catering plate
  isCompact = false,
}) => {
  const [adults, setAdults] = useState<number>(initialAdults);
  const [children, setChildren] = useState<number>(initialChildren);
  const [bufferPct, setBufferPct] = useState<number>(initialBuffer);
  const [plateCost, setPlateCost] = useState<number>(costPerPlate);

  const totalConfirmed = adults + children;
  
  // Smart Formula: Confirmed attendees * (1 + buffer / 100), rounded UP
  const recommendedPlates = Math.ceil(totalConfirmed * (1 + bufferPct / 100));
  const bufferPlates = recommendedPlates - totalConfirmed;

  // Traditional unscientific guesswork (typically Indian weddings over-order by 25% - 40%)
  const traditionalGuessPlates = Math.ceil(totalConfirmed * 1.30);
  const platesWastedTraditionally = Math.max(0, traditionalGuessPlates - recommendedPlates);
  const moneySaved = platesWastedTraditionally * plateCost;

  return (
    <div className={`bg-white rounded-xl border border-[#E5C378]/60 shadow-lg overflow-hidden ${isCompact ? 'p-5' : 'p-6 sm:p-8'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E6D8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
            <DiyaIcon className="w-4 h-4" />
            <span>Smart Food Waste Reduction Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#800020] mt-1">
            Exact Catering Calculation Formula
          </h3>
          <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
            Calculate precise food quantities based only on confirmed RSVPs. Zero guesswork, zero embarrassment, zero wastage.
          </p>
        </div>

        <div className="self-start sm:self-auto px-3.5 py-1.5 bg-[#FAF0D4] border border-[#E5C378] rounded-md text-right">
          <span className="text-[11px] font-semibold text-[#800020] uppercase tracking-wide block">Food Waste Formula</span>
          <span className="font-mono text-xs font-bold text-[#800020]">
            Plates = ⌈Confirmed × (1 + {bufferPct}%)⌉
          </span>
        </div>
      </div>

      {/* Main Grid: Sliders & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Confirmed Adults Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-sm font-semibold text-[#3D291F]">
                Confirmed Adults (Eating full plate)
              </label>
              <span className="font-mono text-sm font-bold text-[#800020] bg-[#FDF5F2] px-2.5 py-0.5 rounded border border-[#F3D2C9]">
                {adults} adults
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="5"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full accent-[#800020] h-2 bg-[#F0E6D8] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C7A70] mt-1 font-mono">
              <span>10</span>
              <span>250</span>
              <span>500</span>
              <span>1000</span>
            </div>
          </div>

          {/* Confirmed Children Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-sm font-semibold text-[#3D291F]">
                Confirmed Children (Under 12 years)
              </label>
              <span className="font-mono text-sm font-bold text-[#800020] bg-[#FDF5F2] px-2.5 py-0.5 rounded border border-[#F3D2C9]">
                {children} children
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              step="5"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full accent-[#800020] h-2 bg-[#F0E6D8] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C7A70] mt-1 font-mono">
              <span>0</span>
              <span>50</span>
              <span>150</span>
              <span>250</span>
            </div>
          </div>

          {/* Safety Buffer Percentage Slider (0% - 30%) */}
          <div className="p-4 bg-[#FAF7F2] rounded-lg border border-[#E5C378]/40">
            <div className="flex justify-between items-center mb-2">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-[#3D291F] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#B45309]" />
                  Recommended Buffer Percentage
                </label>
                <p className="text-[11px] text-[#786C64]">
                  Indian families typically need only 5% buffer when RSVPs are confirmed.
                </p>
              </div>
              <span className="font-mono text-sm font-bold text-[#B45309] bg-[#FAF0D4] px-2.5 py-1 rounded border border-[#E5C378]">
                {bufferPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={bufferPct}
              onChange={(e) => setBufferPct(Number(e.target.value))}
              className="w-full accent-[#B45309] h-2 bg-[#F0E6D8] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C7A70] mt-1 font-mono">
              <span>0% (Exact)</span>
              <span className="text-[#B45309] font-bold">5% (Recommended)</span>
              <span>15%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Plate Cost Input */}
          <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
            <span className="text-[#6B5E55]">Estimated catering cost per plate:</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[#800020]">₹</span>
              <input
                type="number"
                min="300"
                max="10000"
                step="50"
                value={plateCost}
                onChange={(e) => setPlateCost(Number(e.target.value) || 0)}
                className="w-24 px-2 py-1 text-right font-mono font-bold text-[#800020] bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#800020]"
              />
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 bg-gradient-to-br from-[#5B0616] to-[#800020] rounded-xl text-white shadow-md relative overflow-hidden">
          {/* Subtle floral pattern glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <span className="text-xs uppercase tracking-wider text-[#FDE68A] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Recommended Order
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded text-white/90">
                Formula Verified
              </span>
            </div>

            {/* Giant Number */}
            <div className="mt-5 text-center sm:text-left">
              <div className="font-mono text-4xl sm:text-5xl font-black text-[#FDE047] tabular-nums tracking-tight">
                {recommendedPlates.toLocaleString()}
                <span className="text-xl font-normal text-white/80 ml-2">Plates</span>
              </div>
              <p className="text-xs text-white/70 mt-1">
                Confirmed: <strong className="text-white font-mono">{totalConfirmed}</strong> ({adults} adults + {children} kids) + <strong className="text-white font-mono">{bufferPlates}</strong> buffer plates
              </p>
            </div>

            {/* Comparison Metrics */}
            <div className="mt-6 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1.5 px-3 rounded bg-white/5 border border-white/10">
                <span className="text-white/80">Traditional Guesswork (30% excess):</span>
                <span className="font-mono font-semibold text-rose-300">{traditionalGuessPlates} plates</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 px-3 rounded bg-white/5 border border-white/10">
                <span className="text-white/80">Food Plates Saved from Trash:</span>
                <span className="font-mono font-bold text-[#FDE047] flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {platesWastedTraditionally} plates
                </span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 rounded bg-emerald-950/60 border border-emerald-500/40">
                <span className="text-emerald-200 font-medium">Estimated Money Saved:</span>
                <span className="font-mono text-base font-bold text-emerald-300">
                  ₹{moneySaved.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 text-[11px] text-white/70 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FDE047] shrink-0" />
            <span>Guarantees sufficient food while eliminating excessive catering bills.</span>
          </div>
        </div>
      </div>

      {/* Scenario Footnote */}
      <div className="mt-6 pt-4 border-t border-[#F0E6D8] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5C4D43]">
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-[#FAF0D4] border border-[#E5C378] text-[#800020] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
          <div>
            <strong className="text-[#3D291F]">Scenario 1 (Exact):</strong> {totalConfirmed} confirmed guests only.
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-[#FAF0D4] border border-[#E5C378] text-[#800020] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
          <div>
            <strong className="text-[#3D291F]">Scenario 2 (Safety):</strong> {recommendedPlates} plates with {bufferPct}% cushion.
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-[#FAF0D4] border border-[#E5C378] text-[#800020] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
          <div>
            <strong className="text-[#3D291F]">Scenario 3 (Zero Waste):</strong> Updated dynamically as guests RSVP.
          </div>
        </div>
      </div>
    </div>
  );
};
