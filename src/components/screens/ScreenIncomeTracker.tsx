import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Edit2,
  TrendingUp,
  Sun,
  Sparkles,
  ShoppingBag,
  Shield,
  Trash2,
  Mic,
  ArrowUpRight
} from 'lucide-react';
import { UserProfile, IncomeTransaction } from '../../../server/types';
import { getTranslation } from '../../i18n/translations';

interface ScreenIncomeTrackerProps {
  user: UserProfile;
  incomeList: IncomeTransaction[];
  snapshot: {
    todayIncome: number;
    currentWeekTotal: number;
    weeklyChangePercent: number | null;
    last7Days: { date: string; dayName: string; amount: number }[];
  };
  onBack: () => void;
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
  onOpenVoice: () => void;
  onDeleteIncome: (id: string) => void;
}

export const ScreenIncomeTracker: React.FC<ScreenIncomeTrackerProps> = ({
  user,
  incomeList,
  snapshot,
  onBack,
  onOpenAddIncome,
  onOpenAddExpense,
  onOpenVoice,
  onDeleteIncome
}) => {
  const t = getTranslation(user.language);
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');

  // Format today's date
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Max weekly amount for bar scale
  const maxWeekly = Math.max(1000, ...snapshot.last7Days.map(d => d.amount));

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">{t.trackIncome}</h1>
        <button
          onClick={onOpenVoice}
          className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white"
          title="Voice Entry"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Daily / Weekly Toggle matching Reference Screen 4 */}
      <div className="grid grid-cols-2 p-1 bg-[#0A1224] border border-cyan-500/25 rounded-2xl">
        <button
          onClick={() => setTab('daily')}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            tab === 'daily'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.daily}
        </button>
        <button
          onClick={() => setTab('weekly')}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            tab === 'weekly'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.weekly}
        </button>
      </div>

      {/* TODAY'S / RECENT CARD matching Reference Screen 4 */}
      <div className="rounded-3xl bg-[#0B1327]/90 border border-cyan-500/25 p-5 shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-slate-300">Today, {dateFormatted}</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{timeFormatted}</span>
            <Edit2 className="w-3 h-3 text-cyan-400 ml-1 cursor-pointer" onClick={onOpenAddIncome} />
          </div>
        </div>

        {/* Large Financial Figure */}
        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight my-2">
          ₹{snapshot.todayIncome.toLocaleString('en-IN')}
        </div>

        {/* Action Row: Add Income & Add Expense & Voice */}
        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-800">
          <button
            onClick={onOpenAddIncome}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:opacity-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addIncome}</span>
          </button>
          <button
            onClick={onOpenAddExpense}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:border-purple-400"
          >
            + Expense
          </button>
          <button
            onClick={onOpenVoice}
            className="p-2.5 rounded-xl bg-blue-950/80 border border-cyan-500/40 text-cyan-400 hover:text-white"
            title="Add by voice"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECTION: This Week Chart matching Reference Screen 4 */}
      <div className="rounded-3xl bg-[#0B1327]/90 border border-cyan-500/25 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {t.thisWeek}
            </span>
            <div className="text-xl font-extrabold text-white mt-0.5">
              ₹{snapshot.currentWeekTotal.toLocaleString('en-IN')}
            </div>
          </div>
          {snapshot.weeklyChangePercent !== null && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>+{snapshot.weeklyChangePercent}% vs last week</span>
            </span>
          )}
        </div>

        {/* 7 Vertical Bar Indicators matching Reference Screen 4 */}
        <div className="grid grid-cols-7 gap-2 pt-4 items-end h-32">
          {snapshot.last7Days.map((day, idx) => {
            const heightPercent = maxWeekly > 0 ? Math.max(12, Math.round((day.amount / maxWeekly) * 100)) : 12;
            const isToday = idx === 6;
            return (
              <div key={day.date} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[9px] font-mono text-slate-400">
                  {day.amount > 0 ? (day.amount >= 1000 ? `${(day.amount / 1000).toFixed(1)}k` : day.amount) : '0'}
                </span>
                <div className="w-full max-w-[28px] bg-slate-900/80 rounded-t-lg overflow-hidden flex flex-col justify-end h-20">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-blue-600 via-cyan-400 to-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                        : 'bg-gradient-to-t from-indigo-900 to-purple-600 opacity-80'
                    }`}
                  />
                </div>
                <span className={`text-[10px] font-medium ${isToday ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                  {day.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: Factors Affecting Income matching Reference Screen 4 */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
          {t.factorsAffecting}
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Sunny Weather */}
          <div className="p-2.5 rounded-2xl bg-[#0B1327] border border-cyan-500/20 flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1.5 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
              <Sun className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              {t.sunnyWeather}
            </span>
          </div>

          {/* Weekend Boost */}
          <div className="p-2.5 rounded-2xl bg-[#0B1327] border border-cyan-500/20 flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-1.5 shadow-[0_0_8px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              {t.weekendBoost}
            </span>
          </div>

          {/* Market Crowd */}
          <div className="p-2.5 rounded-2xl bg-[#0B1327] border border-cyan-500/20 flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-cyan-300 mb-1.5 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              {t.marketCrowd}
            </span>
          </div>

          {/* No Calamities */}
          <div className="p-2.5 rounded-2xl bg-[#0B1327] border border-cyan-500/20 flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1.5 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              {t.noCalamities}
            </span>
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS LIST with Provenance Labels */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
          Recent Income Records
        </div>

        {incomeList.length === 0 ? (
          <div className="p-6 rounded-3xl bg-[#0B1327]/80 border border-slate-800 text-center">
            <p className="text-xs text-slate-400">No income records yet.</p>
            <button
              onClick={onOpenAddIncome}
              className="mt-2 text-xs text-cyan-400 font-semibold hover:underline"
            >
              + Add your first income
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {incomeList.slice(0, 5).map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#0B1327]/80 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{item.source}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950/90 text-cyan-300 font-mono border border-cyan-500/30">
                      {item.sourceLabel}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {item.date} • {item.time} {item.note ? `• ${item.note}` : ''}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-400">
                    +₹{item.amount.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => onDeleteIncome(item.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
