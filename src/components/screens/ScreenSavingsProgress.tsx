import React, { useState } from 'react';
import { ArrowLeft, Trophy, Sparkles, TrendingUp, Plus, CheckCircle, ArrowRight } from 'lucide-react';
import { UserProfile, SavingsGoal, SavingsTransaction } from '../../../server/types';
import { api } from '../../services/api';
import { getTranslation } from '../../i18n/translations';

interface ScreenSavingsProgressProps {
  user: UserProfile;
  goal: SavingsGoal | null;
  history: SavingsTransaction[];
  totalSaved: number;
  targetAmount: number;
  progressPercent: number;
  streakDays: number;
  onBack: () => void;
  onEditGoal: () => void;
  onRefresh: () => void;
}

export const ScreenSavingsProgress: React.FC<ScreenSavingsProgressProps> = ({
  user,
  goal,
  history,
  totalSaved,
  targetAmount,
  progressPercent,
  streakDays,
  onBack,
  onEditGoal,
  onRefresh
}) => {
  const t = getTranslation(user.language);
  const [savingAmount, setSavingAmount] = useState('500');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleManualSave = async () => {
    setLoading(true);
    try {
      await api.executeSaving(Number(savingAmount) || 500, 'User voluntary manual saving');
      setShowAddModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Header matching Reference Screen 7 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-tight">{t.savingsProgress}</h1>
          <p className="text-[11px] text-cyan-300 font-medium">Goal: {goal?.name || 'My Dream Goal 🚀'}</p>
        </div>
        <button
          onClick={onEditGoal}
          className="text-xs font-semibold text-cyan-400 hover:underline"
        >
          Edit
        </button>
      </div>

      {/* Hero Achievement Card matching Reference Screen 7: Trophy with Goal Achieved Days */}
      <div className="rounded-3xl bg-gradient-to-r from-[#121B38] via-[#151D44] to-[#1E1948] border border-cyan-500/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.15)] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
            {t.goalAchieved}
          </span>
          <div className="text-3xl font-extrabold text-white mt-1">
            {streakDays} Days
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            Rule: Save ₹{goal?.saveAmount || 500} when income reaches ₹{goal?.thresholdAmount || 2000}
          </p>
        </div>

        {/* 3D Gold Trophy Graphic */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-yellow-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.4)] shrink-0">
          <Trophy className="w-9 h-9 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
        </div>
      </div>

      {/* Target & Saved Stats Row matching Reference Screen 7 */}
      <div className="rounded-3xl bg-[#0B1327]/90 border border-cyan-500/25 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">{t.totalSaved}</span>
            <span className="text-2xl font-extrabold text-white">
              ₹{totalSaved.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium block">{t.target}</span>
            <span className="text-2xl font-extrabold text-slate-200">
              ₹{(targetAmount || 25000).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Progress Bar matching Reference Screen 7 */}
        <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-800 my-2">
          <div
            style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-500"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
          <span>{progressPercent}% completed</span>
          <span className="text-cyan-400 font-medium">
            ₹{Math.max(0, (targetAmount || 25000) - totalSaved).toLocaleString('en-IN')} remaining
          </span>
        </div>

        {/* Quick Save Trigger */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Save Extra Amount Now</span>
        </button>
      </div>

      {/* SECTION: Recent Savings matching Reference Screen 7 */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
          {t.recentSavings}
        </div>

        {history.length === 0 ? (
          <div className="p-6 rounded-3xl bg-[#0B1327]/80 border border-slate-800 text-center">
            <p className="text-xs text-slate-400">Your savings journey starts here.</p>
            <p className="text-[10px] text-slate-500 mt-1">
              When your earnings reach ₹{goal?.thresholdAmount || 2000}, savings trigger automatically!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#0B1327]/80 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{item.date}</div>
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Goal Achieved</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-cyan-300">
                  +₹{item.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Motivation Banner matching Reference Screen 7 */}
      <div className="rounded-2xl bg-[#0B1327] border border-cyan-500/20 p-3.5 text-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
        <p className="text-xs text-slate-200 font-medium flex items-center justify-center gap-1">
          <span>⭐</span>
          <span>Keep going! Small steps lead to big dreams</span>
          <span>✨</span>
        </p>
      </div>

      {/* Manual Save Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-3xl bg-[#0C152B] border border-cyan-500/30 p-5 text-center">
            <h3 className="text-base font-bold text-white mb-1">Save Extra Amount</h3>
            <p className="text-xs text-slate-400 mb-4">Add directly towards your goal</p>
            <div className="relative mb-4">
              <span className="absolute left-4 top-2.5 text-slate-400 text-sm font-bold">₹</span>
              <input
                type="number"
                value={savingAmount}
                onChange={e => setSavingAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2 text-white font-bold text-lg focus:outline-none focus:border-cyan-400 text-center"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleManualSave}
                disabled={loading}
                className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
              >
                {loading ? 'Saving...' : 'Confirm'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
