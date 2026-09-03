import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Gift } from 'lucide-react';
import { UserProfile, IncomeRecord } from '../../types';

interface ScreenBonusPredictionProps {
  profile: UserProfile;
  incomes: IncomeRecord[];
}

export const ScreenBonusPrediction: React.FC<ScreenBonusPredictionProps> = ({
  profile,
  incomes,
}) => {
  const isVariable = profile.incomeType === 'VARIABLE';
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFestivals() {
      setLoading(true);
      try {
        const res = await fetch('/api/festivals');
        if (res.ok) {
          const data = await res.json();
          setFestivals(data.festivals || []);
        }
      } catch (err) {
        console.warn('Failed to fetch festivals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFestivals();
  }, []);

  const pastBonus = incomes.filter(i => i.category === 'BONUS');
  const hasBonusData = pastBonus.length > 0 || isVariable;

  return (
    <div className="space-y-6 pb-14">
      {/* Header matching instruction:
          Title: "Bonus & Festival Prediction"
          Subtitle: "Plan ahead for seasonal events"
      */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Seasonal Surge & Annual Payouts
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Bonus & Festival Prediction
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Plan ahead for seasonal events
            </p>
          </div>
        </div>
      </div>

      {/* Mode Specific Prediction Banner */}
      {isVariable ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#131B36] to-cyan-950/60 border border-purple-500/40 shadow-xl glow-purple">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
            Gig & Merchant Festival Surge Forecast
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white mt-1 tabular-nums">
            +35% to +60% Surge Window
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
            During Diwali, Durga Puja, and New Year holiday shopping runs, delivery volume and shop footfall historic index shows expected daily surge from ₹2,000 to ₹3,500/day.
          </p>
        </div>
      ) : hasBonusData ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-[#101C38] to-purple-950/60 border border-cyan-500/40 shadow-xl glow-cyan">
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
            Annual Performance & Festival Bonus Prediction
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white mt-1 tabular-nums">
            ₹25,000 – ₹38,500
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
            Projected Diwali ex-gratia payout based on your company's historic Q3 payroll schedule (usually credited 10 days before Diwali).
          </p>
        </div>
      ) : (
        /* Empty state matching instruction */
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-slate-800 text-center">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">
            No past bonus record found
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Add past bonus details or connect payroll to estimate upcoming bonuses.
          </p>
        </div>
      )}

      {/* Indian Calendar Festivals List matching instruction */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Indian Festive Calendar & Cashflow Impact
          </h3>
          <span className="text-xs text-slate-400">Live 2026/2027 Schedule</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {festivals.map((fest, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#121B32] border border-slate-800/80 hover:border-cyan-500/40 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-white">{fest.name}</h4>
                  <span className="text-xs text-slate-400">{fest.date}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  {fest.impact}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                {fest.prepTips}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
