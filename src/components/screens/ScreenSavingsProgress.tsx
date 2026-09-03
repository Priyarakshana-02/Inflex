import React, { useState } from 'react';
import { PiggyBank, Flame, Award, Calendar, CheckCircle, ArrowUpRight, Plus, Sparkles } from 'lucide-react';
import { UserProfile, SavingsGoal, SavingsEvent } from '../../types';
import { ResilienceGauge } from '../ResilienceGauge';

interface ScreenSavingsProgressProps {
  profile: UserProfile;
  savingsGoal: SavingsGoal;
  savingsEvents: SavingsEvent[];
  onTriggerSave: (amount: number, reason: string) => void;
  onNavigate: (screen: string) => void;
}

export const ScreenSavingsProgress: React.FC<ScreenSavingsProgressProps> = ({
  profile,
  savingsGoal,
  savingsEvents,
  onTriggerSave,
  onNavigate,
}) => {
  const [manualAmount, setManualAmount] = useState('300');
  const [showManualModal, setShowManualModal] = useState(false);

  // Compute values from actual user data
  const currentSaved = savingsGoal.currentSaved;
  const target = Math.max(1, savingsGoal.targetAmount);
  const percent = Math.min(100, Math.round((currentSaved / target) * 100));
  const remaining = Math.max(0, target - currentSaved);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAmount || isNaN(Number(manualAmount))) return;
    onTriggerSave(Number(manualAmount), 'Manual Savings Contribution');
    setShowManualModal(false);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Header matching instruction:
          Title: "Your Savings Progress"
          Subtitle: "Small amounts add up"
      */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Emergency Buffer Tracker
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Your Savings Progress
          </h2>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Small amounts add up
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('savings-goal')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            Edit Goal Rules
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            + Save Extra
          </button>
        </div>
      </div>

      {/* Main Gauge and Progress Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Progress Gauge */}
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            Target Completion
          </span>

          <ResilienceGauge
            score={percent}
            size={180}
            strokeWidth={14}
            colorMode="emerald"
            subtitle={`${percent}% of ₹${target.toLocaleString('en-IN')}`}
          />

          <div className="mt-4 flex items-center justify-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{savingsGoal.streakDays} Day Savings Streak!</span>
          </div>
        </div>

        {/* Milestone Cards */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                Goal: {savingsGoal.goalName}
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Created: {savingsGoal.startDate}
              </span>
            </div>

            {/* Metric Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-4 rounded-2xl bg-[#121B32] border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Current Saved</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 tabular-nums">
                  ₹{currentSaved.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Locked in liquid buffer</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121B32] border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Target Amount</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tabular-nums">
                  ₹{target.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Full buffer objective</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121B32] border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Remaining Needed</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 mt-1 tabular-nums">
                  ₹{remaining.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">To reach safety goal</span>
              </div>
            </div>

            {/* Progress Bar Visual */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Progress</span>
                <span className="text-emerald-400">{percent}% Completed</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-700 shadow-sm shadow-emerald-500/50"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>
              Rule: If earnings &gt;= ₹{profile.incomeType === 'VARIABLE' ? savingsGoal.dailyGoalThreshold : savingsGoal.monthlyThreshold}, save ₹{profile.incomeType === 'VARIABLE' ? savingsGoal.dailySavingsAmount : savingsGoal.monthlySavingsAmount}.
            </span>
            <span className="font-bold text-emerald-400">AUTOMATIC ENGINE ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Savings Events Log matching instruction:
          "savings events log (real, triggered by savings conditions)"
      */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Verified Savings Events History
        </h4>

        <div className="space-y-2.5">
          {savingsEvents.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No automated savings events recorded yet. Meet your daily earnings threshold to trigger transfers.
            </div>
          ) : (
            savingsEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-2xl bg-[#121B32] border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-100">
                      {evt.reason}
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      {evt.date} • Condition matched
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-emerald-300 tabular-nums">
                    +₹{evt.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase block font-semibold">
                    {evt.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manual Deposit Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0D1424] border border-blue-900/70 rounded-3xl p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Deposit to Savings Buffer</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add extra surplus to accelerate your emergency buffer milestone.
            </p>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-lg font-bold text-white focus:outline-none focus:border-cyan-500 tabular-nums"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold shadow-md hover:from-cyan-400 hover:to-blue-500"
                >
                  Transfer ₹{manualAmount}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
