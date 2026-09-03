import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  Flame,
  Calendar,
  Building2,
  TrendingUp,
  Gift,
  HelpCircle
} from 'lucide-react';
import { UserProfile, BonusPredictionResult } from '../../../server/types';
import { getTranslation } from '../../i18n/translations';

interface ScreenBonusPredictionProps {
  user: UserProfile;
  bonus: BonusPredictionResult;
  festivals: Array<{ id: string; name: string; date: string; relativeMonths: number; financialImpact: string; icon: string }>;
  onBack: () => void;
}

export const ScreenBonusPrediction: React.FC<ScreenBonusPredictionProps> = ({
  user,
  bonus,
  festivals,
  onBack
}) => {
  const t = getTranslation(user.language);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Header matching Reference Screen 12 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-tight">{t.bonusPrediction}</h1>
          <p className="text-[11px] text-cyan-300 font-medium">{t.aiInsightJustForYou}</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Hero Card: Upcoming Festival with Glowing Diwali Lamps Illustration matching Reference Screen 12 */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#1B1536] via-[#14122C] to-[#0A0D1E] border border-purple-500/30 p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_25px_rgba(168,85,247,0.15)] overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-purple-500/10 pointer-events-none" />

        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
          {t.upcomingFestival}
        </span>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          {bonus.festival} — {bonus.relativeTimeline}
        </h2>

        {/* Glowing Festival Graphic (Diwali Lamps / Festive Sparkles) */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500/30 via-rose-500/20 to-purple-600/30 border border-amber-400/40 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.4)]">
            <Flame className="w-12 h-12 text-amber-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.9)] animate-pulse" />
          </div>
          {/* Floating decorative lights */}
          <div className="absolute left-10 top-4 w-3 h-3 rounded-full bg-amber-400 blur-xs animate-ping" />
          <div className="absolute right-10 bottom-4 w-3 h-3 rounded-full bg-pink-400 blur-xs animate-ping" />
        </div>

        <p className="text-xs text-slate-300 max-w-xs mx-auto">
          Expected festive expenditure surge and seasonal bonus cycle ahead.
        </p>
      </div>

      {/* Card 2: Estimated Bonus matching Reference Screen 12 */}
      <div className="rounded-3xl bg-gradient-to-br from-[#101C3D] via-[#0D152E] to-[#090E20] border border-cyan-500/30 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
          {t.estimatedBonus}
        </span>
        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight my-1.5">
          ₹{bonus.estimatedMin.toLocaleString('en-IN')} – ₹{bonus.estimatedMax.toLocaleString('en-IN')}
        </div>
        <p className="text-xs text-slate-300 font-medium">
          {t.basedOnYourProfile}
        </p>
      </div>

      {/* Section: Factors Considered matching Reference Screen 12 */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
          {t.factorsConsidered}
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Past Bonus */}
          <div className="p-2.5 rounded-2xl bg-[#0B1327] border border-cyan-500/20 flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-1.5 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              {t.pastBonus}
            </span>
          </div>

          {/* Company Performance */}
          <div className="p-2.5 rounded-2xl bg-[#0B1327] border border-cyan-500/20 flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-1.5 shadow-[0_0_8px_rgba(168,85,247,0.2)]">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              {t.companyPerformance}
            </span>
          </div>

          {/* Industry Trend */}
          <div className="p-2.5 rounded-2xl bg-[#0B1327] border border-cyan-500/20 flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1.5 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              {t.industryTrend}
            </span>
          </div>

          {/* Festival Impact */}
          <div className="p-2.5 rounded-2xl bg-[#0B1327] border border-cyan-500/20 flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1.5 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
              <Gift className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              {t.festivalImpact}
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Indian Festival Calendar */}
      <div className="rounded-3xl bg-[#0B1327]/90 border border-slate-800 p-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
          Upcoming Festive Windows
        </span>
        <div className="space-y-2">
          {festivals.map(f => (
            <div key={f.id} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span>{f.icon}</span>
                <span className="font-semibold text-white">{f.name}</span>
                <span className="text-[10px] text-slate-400">({f.date})</span>
              </div>
              <span className="text-[10px] text-amber-400 font-medium">{f.financialImpact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
