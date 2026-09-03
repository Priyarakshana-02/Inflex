import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Volume2,
  Brain,
  CheckCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { UserProfile, FinancialFreedomScore } from '../../../server/types';
import { api } from '../../services/api';
import { getTranslation } from '../../i18n/translations';

interface ScreenInsightsAssuranceProps {
  user: UserProfile;
  freedomScore: FinancialFreedomScore;
  aiGuidance: string;
  incomeStability: string;
  savingsHabit: string;
  onBack: () => void;
}

export const ScreenInsightsAssurance: React.FC<ScreenInsightsAssuranceProps> = ({
  user,
  freedomScore,
  aiGuidance,
  incomeStability,
  savingsHabit,
  onBack
}) => {
  const t = getTranslation(user.language);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleSpeakGuidance = () => {
    setIsPlayingVoice(true);
    api.speakText(aiGuidance, user.language);
    setTimeout(() => {
      setIsPlayingVoice(false);
    }, 4000);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Header matching Reference Screen 13 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-tight">{t.yourInsights}</h1>
          <p className="text-[11px] text-cyan-300 font-medium">{t.poweredByAi}</p>
        </div>
        <button
          onClick={handleSpeakGuidance}
          className={`p-2 rounded-xl border text-cyan-300 transition-all ${
            isPlayingVoice
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse'
              : 'bg-cyan-950/80 border-cyan-500/40 hover:text-white'
          }`}
          title="Read Aloud"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card 1: Income Stability matching Reference Screen 13 */}
      <div className="rounded-3xl bg-gradient-to-br from-[#101C3D] via-[#0E162F] to-[#0A1024] border border-cyan-500/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
            {t.incomeStability}
          </span>
          <div className="text-2xl font-extrabold text-white tracking-tight my-1">
            {incomeStability}
          </div>
          <p className="text-xs text-slate-300 font-medium">
            {t.greatIncomeConsistent}
          </p>
        </div>

        {/* Neon Line Trend Graphic matching Reference Screen 13 */}
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
          <TrendingUp className="w-9 h-9 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
        </div>
      </div>

      {/* Card 2: Savings Habit matching Reference Screen 13 */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121938] via-[#0E162E] to-[#0A1024] border border-emerald-500/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            {t.savingsHabit}
          </span>
          <div className="text-2xl font-extrabold text-white tracking-tight my-1">
            {savingsHabit}
          </div>
          <p className="text-xs text-slate-300 font-medium">
            {t.smartSaverKeepItUp}
          </p>
        </div>

        {/* Neon Shield Graphic matching Reference Screen 13 */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
          <ShieldCheck className="w-9 h-9 drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
        </div>
      </div>

      {/* Gemini AI Personalized Coach & Assurance Card */}
      <div className="rounded-3xl bg-[#0B1327]/90 border border-cyan-500/30 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Gemini Financial Coach
            </span>
          </div>
          <button
            onClick={handleSpeakGuidance}
            className="flex items-center gap-1 text-[11px] text-cyan-400 font-semibold hover:underline"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          "{aiGuidance}"
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Freedom Score: <strong className="text-white">{freedomScore.score}/100</strong></span>
          <span className="text-cyan-400 font-medium">Updated live</span>
        </div>
      </div>
    </div>
  );
};
