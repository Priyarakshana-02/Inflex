import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Coins, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { UserProfile, SavingsGoal } from '../../../server/types';
import { api } from '../../services/api';
import { getTranslation } from '../../i18n/translations';

interface ScreenSavingsGoalSetupProps {
  user: UserProfile;
  activeGoal: SavingsGoal | null;
  onBack: () => void;
  onGoalSaved: () => void;
}

export const ScreenSavingsGoalSetup: React.FC<ScreenSavingsGoalSetupProps> = ({
  user,
  activeGoal,
  onBack,
  onGoalSaved
}) => {
  const t = getTranslation(user.language);
  const [goalName, setGoalName] = useState(activeGoal?.name || 'My Dream Goal 🚀');
  const [targetAmount, setTargetAmount] = useState(activeGoal?.targetAmount ? String(activeGoal.targetAmount) : '25000');
  const [thresholdAmount, setThresholdAmount] = useState(activeGoal?.thresholdAmount ? String(activeGoal.thresholdAmount) : '2000');
  const [saveAmount, setSaveAmount] = useState(activeGoal?.saveAmount ? String(activeGoal.saveAmount) : '500');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.saveGoal({
        name: goalName,
        targetAmount: Number(targetAmount) || 25000,
        thresholdAmount: Number(thresholdAmount) || 2000,
        saveAmount: Number(saveAmount) || 500
      });
      setSuccess(true);
      setTimeout(() => {
        onGoalSaved();
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Header matching Reference Screen 6 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-tight">{t.setSavingsGoal}</h1>
          <p className="text-[11px] text-cyan-300 font-medium">{t.buildYourFuture}</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Visual: Glowing Glass Savings Jar Graphic with Floating Coins matching Reference */}
      <div className="relative w-full h-44 flex items-center justify-center">
        <div className="absolute w-40 h-40 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute w-32 h-32 bg-cyan-500/25 rounded-full blur-2xl" />

        {/* Jar Container Graphic */}
        <div className="relative w-28 h-36 rounded-3xl bg-gradient-to-b from-[#182348]/90 via-[#111A35]/80 to-[#0B1226]/90 border-2 border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.35)] flex flex-col items-center justify-between p-3 overflow-hidden backdrop-blur-md">
          {/* Jar Lid */}
          <div className="w-16 h-3 rounded-md bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] -mt-1" />

          {/* Floating Coins inside Jar */}
          <div className="relative flex flex-col items-center justify-center my-auto">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border border-yellow-200 shadow-[0_0_20px_rgba(251,191,36,0.8)] flex items-center justify-center text-slate-950 font-extrabold text-sm animate-pulse">
              ₹
            </div>
            <div className="flex gap-1.5 mt-2">
              <span className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)] inline-block" />
              <span className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)] inline-block" />
              <span className="w-4 h-4 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)] inline-block" />
            </div>
          </div>

          {/* Base glow */}
          <div className="w-full h-2 rounded-full bg-cyan-400/40 blur-xs" />
        </div>
      </div>

      {/* Form matching Reference Screen 6 Steps */}
      <form onSubmit={handleActivate} className="space-y-4">
        {/* Step 1: Set Daily Goal Amount */}
        <div className="rounded-2xl bg-[#0B1327]/90 border border-cyan-500/25 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <label className="block text-xs font-bold text-slate-200 mb-1">
            {user.incomeType === 'irregular' ? '1. Set Daily Goal Amount' : '1. Set Monthly Income Threshold'}
          </label>
          <p className="text-[11px] text-slate-400 mb-2.5">
            {user.incomeType === 'irregular' ? 'Enter goal earning amount for triggering savings' : 'Surplus margin threshold for automatic savings'}
          </p>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400 text-sm font-semibold">₹</span>
            <input
              type="number"
              required
              value={thresholdAmount}
              onChange={e => setThresholdAmount(e.target.value)}
              className="w-full bg-[#080E1E] border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2.5 text-base font-extrabold text-white focus:outline-none transition-colors"
              placeholder="2000"
            />
          </div>
        </div>

        {/* Step 2: Save When Goal is Achieved */}
        <div className="rounded-2xl bg-[#0B1327]/90 border border-cyan-500/25 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <label className="block text-xs font-bold text-slate-200 mb-1">
            2. Save When Goal is Achieved
          </label>
          <p className="text-[11px] text-slate-400 mb-2.5">
            Save this amount from extra income automatically
          </p>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400 text-sm font-semibold">₹</span>
            <input
              type="number"
              required
              value={saveAmount}
              onChange={e => setSaveAmount(e.target.value)}
              className="w-full bg-[#080E1E] border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2.5 text-base font-extrabold text-white focus:outline-none transition-colors"
              placeholder="500"
            />
          </div>
        </div>

        {/* Step 3: Choose Goal Name (Optional) */}
        <div className="rounded-2xl bg-[#0B1327]/90 border border-cyan-500/25 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <label className="block text-xs font-bold text-slate-200 mb-1">
            3. Choose Goal Name & Target (Optional)
          </label>
          <p className="text-[11px] text-slate-400 mb-2.5">
            Eg. New Bike, Family Trip, Emergency Fund
          </p>
          <div className="space-y-2">
            <input
              type="text"
              value={goalName}
              onChange={e => setGoalName(e.target.value)}
              className="w-full bg-[#080E1E] border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
              placeholder="My Dream Goal 🚀"
            />
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-slate-400 text-xs font-semibold">Target: ₹</span>
              <input
                type="number"
                value={targetAmount}
                onChange={e => setTargetAmount(e.target.value)}
                className="w-full bg-[#080E1E] border border-slate-700 focus:border-cyan-400 rounded-xl pl-20 pr-4 py-2.5 text-xs font-bold text-white focus:outline-none transition-colors"
                placeholder="25000"
              />
            </div>
          </div>
        </div>

        {/* Activate Goal Button matching Reference Screen 6 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base tracking-wide shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Activating...' : success ? 'Goal Activated! 🎉' : 'Activate Goal'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
