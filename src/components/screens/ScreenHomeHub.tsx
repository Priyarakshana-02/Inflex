import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Heart,
  ShieldAlert,
  Lock,
  PieChart,
  Lightbulb,
  PlusCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { UserProfile, FinancialFreedomScore } from '../../../server/types';
import { getTranslation } from '../../i18n/translations';

interface ScreenHomeHubProps {
  user: UserProfile;
  snapshot: {
    todayIncome: number;
    todayExpenses: number;
    todayNet: number;
    allIncome: number;
    allExpenses: number;
    netBalance: number;
    safeToSpend: number;
    totalReserved: number;
    incomeChangeVsYesterday: number | null;
    currentWeekTotal: number;
    hasAnyData: boolean;
  };
  freedomScore: FinancialFreedomScore;
  onNavigate: (screen: number) => void;
  onOpenAddIncome: () => void;
  onOpenVoice: () => void;
  onSyncDemo: () => void;
}

export const ScreenHomeHub: React.FC<ScreenHomeHubProps> = ({
  user,
  snapshot,
  freedomScore,
  onNavigate,
  onOpenAddIncome,
  onOpenVoice,
  onSyncDemo
}) => {
  const t = getTranslation(user.language);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.goodMorning : hour < 17 ? t.goodAfternoon : t.goodEvening;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Top Welcome Header matching Reference */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-1.5">
            <span>{greeting}, {user.name.split(' ')[0]}</span>
            <span>👋</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{t.financialSummary}</p>
        </div>

        {/* Profile Avatar Button */}
        <button
          onClick={() => onNavigate(14)}
          className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          aria-label="Profile"
        >
          <div className="w-full h-full rounded-[14px] bg-[#070B14] flex items-center justify-center text-cyan-300 font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#070B14]" />
        </button>
      </div>

      {/* CARD 1: Financial Freedom Score matching Reference Screen 3 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1B38]/90 via-[#0A1226]/90 to-[#070C1A] border border-cyan-500/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.15)]">
        {/* Glow background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-wider uppercase text-cyan-400">
              {t.freedomScore}
            </div>

            {freedomScore.hasEnoughData ? (
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-4xl font-extrabold text-white tracking-tight">
                  {freedomScore.score}
                </span>
                <span className="text-slate-400 text-sm font-medium">/100</span>
              </div>
            ) : (
              <div className="mt-2">
                <span className="text-sm font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2.5 py-1 rounded-full">
                  Building History
                </span>
              </div>
            )}

            <p className="text-xs text-slate-300 mt-2 font-medium max-w-[200px]">
              {freedomScore.hasEnoughData ? freedomScore.message : 'Track 3+ transactions to calculate your score'}
            </p>
          </div>

          {/* Glowing Circular / Mini Graphic Indicator */}
          <div className="relative w-16 h-16 rounded-full bg-[#081022] border-2 border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <TrendingUp className="w-8 h-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
        </div>

        {/* Breakdown bar */}
        {freedomScore.hasEnoughData && (
          <div className="mt-4 pt-3 border-t border-cyan-500/15 flex items-center justify-between text-[10px] text-slate-400">
            <span>Stability: <strong className="text-cyan-300">{freedomScore.components.incomeStability}/30</strong></span>
            <span>Savings: <strong className="text-cyan-300">{freedomScore.components.savingsHabit}/25</strong></span>
            <span>Reserves: <strong className="text-cyan-300">{freedomScore.components.billCoverage}/25</strong></span>
          </div>
        )}
      </div>

      {/* CARD 2: Today's Snapshot matching Reference Screen 3 */}
      <div className="rounded-3xl bg-[#0B1327]/90 border border-cyan-500/20 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.todaysSnapshot}
          </span>
          {snapshot.incomeChangeVsYesterday !== null && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>+{snapshot.incomeChangeVsYesterday}% vs yesterday</span>
            </span>
          )}
        </div>

        {/* Income & Expenses Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3.5 rounded-2xl bg-[#0E1A38]/70 border border-blue-500/20">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">{t.income}</span>
            <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              ₹{snapshot.todayIncome.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#1A1226]/70 border border-purple-500/20">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">{t.expenses}</span>
            <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              ₹{snapshot.todayExpenses.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Net Balance Row with Safe to Spend */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">{t.netBalance}</span>
            <span className="text-lg font-bold text-cyan-300">
              ₹{snapshot.todayNet.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium block">{t.safeToSpend}</span>
            <span className="text-lg font-bold text-emerald-400">
              ₹{snapshot.safeToSpend.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Empty State Banner if No Data */}
      {!snapshot.hasAnyData && (
        <div className="rounded-3xl bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border border-cyan-500/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Start Your Financial Journey</div>
              <div className="text-[10px] text-slate-400">Add first income or sync account data</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onOpenAddIncome}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            >
              + Add
            </button>
            <button
              onClick={onSyncDemo}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 text-xs font-semibold"
            >
              Sync AA
            </button>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS: 8 Grid items matching Reference Screen 3 */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
          {t.quickActions}
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {/* 1. Track Income */}
          <button
            onClick={() => onNavigate(4)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0B1327] border border-cyan-500/20 hover:border-cyan-400 hover:bg-[#0E1A38] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-300 font-medium text-center leading-tight">
              {t.trackIncome}
            </span>
          </button>

          {/* 2. Predict */}
          <button
            onClick={() => onNavigate(5)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0B1327] border border-cyan-500/20 hover:border-cyan-400 hover:bg-[#0E1A38] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-300 font-medium text-center leading-tight">
              {t.predict}
            </span>
          </button>

          {/* 3. Savings Goal */}
          <button
            onClick={() => onNavigate(6)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0B1327] border border-cyan-500/20 hover:border-cyan-400 hover:bg-[#0E1A38] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_10px_rgba(244,114,182,0.2)]">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-300 font-medium text-center leading-tight">
              {t.savingsGoal}
            </span>
          </button>

          {/* 4. Loan Helper */}
          <button
            onClick={() => onNavigate(8)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0B1327] border border-cyan-500/20 hover:border-cyan-400 hover:bg-[#0E1A38] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-300 font-medium text-center leading-tight">
              {t.loanHelper}
            </span>
          </button>

          {/* 5. Reserve Money */}
          <button
            onClick={() => onNavigate(10)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0B1327] border border-cyan-500/20 hover:border-cyan-400 hover:bg-[#0E1A38] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-300 font-medium text-center leading-tight">
              {t.reserveMoney}
            </span>
          </button>

          {/* 6. Expenses */}
          <button
            onClick={() => onNavigate(11)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0B1327] border border-cyan-500/20 hover:border-cyan-400 hover:bg-[#0E1A38] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-300 font-medium text-center leading-tight">
              {t.expenses}
            </span>
          </button>

          {/* 7. Insights */}
          <button
            onClick={() => onNavigate(13)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0B1327] border border-cyan-500/20 hover:border-cyan-400 hover:bg-[#0E1A38] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-300 font-medium text-center leading-tight">
              {t.insights}
            </span>
          </button>

          {/* 8. More / Shock Simulator */}
          <button
            onClick={() => onNavigate(15)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0B1327] border border-cyan-500/20 hover:border-cyan-400 hover:bg-[#0E1A38] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-300 font-medium text-center leading-tight">
              {t.shockSimulator}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
