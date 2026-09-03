import React, { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, LoanAssessment } from '../../../server/types';
import { getTranslation } from '../../i18n/translations';

interface ScreenLoanAssistantProps {
  user: UserProfile;
  assessment: LoanAssessment;
  onBack: () => void;
  onCheckFeasibility: (requestedAmount: number) => void;
}

export const ScreenLoanAssistant: React.FC<ScreenLoanAssistantProps> = ({
  user,
  assessment,
  onBack,
  onCheckFeasibility
}) => {
  const t = getTranslation(user.language);
  const [customAmount, setCustomAmount] = useState(String(assessment.maxBorrowLimit || 50000));

  const handleCustomCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(customAmount) || assessment.maxBorrowLimit || 50000;
    onCheckFeasibility(amt);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Header matching Reference Screen 8 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-tight">{t.loanAssistant}</h1>
          <p className="text-[11px] text-cyan-300 font-medium">{t.smartLoans}</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Hero Card: You can borrow up to ₹1,25,000 matching Reference Screen 8 */}
      <div className="rounded-3xl bg-gradient-to-br from-[#101C3D] via-[#0E162F] to-[#0A1024] border border-cyan-500/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.15)] flex items-center justify-between">
        <div className="flex-1 pr-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
            {t.borrowUpTo}
          </span>
          <div className="text-3xl font-extrabold text-white tracking-tight my-1">
            ₹{assessment.maxBorrowLimit.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-300 font-medium mb-3">
            {t.withinRepaymentAbility}
          </p>

          <button
            onClick={() => onCheckFeasibility(assessment.maxBorrowLimit)}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:opacity-95 transition-all inline-flex items-center gap-1.5"
          >
            <span>{t.checkMyLimit}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3D Money Bag Icon matching Reference Screen 8 */}
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)] shrink-0 p-3">
          <Briefcase className="w-10 h-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        </div>
      </div>

      {/* Card 2: Want a different amount? matching Reference Screen 8 */}
      <div className="rounded-3xl bg-[#0B1327]/90 border border-cyan-500/25 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
        <label className="block text-xs font-bold text-slate-200 mb-1">
          {t.wantDifferentAmount}
        </label>
        <p className="text-[11px] text-slate-400 mb-3">
          Enter loan amount to simulate repayment safety & approval odds
        </p>

        <form onSubmit={handleCustomCheck} className="space-y-3">
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400 text-sm font-bold">₹</span>
            <input
              type="number"
              required
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              className="w-full bg-[#080E1E] border border-slate-700 focus:border-cyan-400 rounded-2xl pl-9 pr-4 py-3 text-lg font-extrabold text-white focus:outline-none transition-colors"
              placeholder="125000"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>{t.checkFeasibility}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Card 3: Our Suggestion matching Reference Screen 8 */}
      <div className="rounded-3xl bg-[#0B1327]/90 border border-emerald-500/30 p-4 shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
            {t.ourSuggestion}
          </span>
          <div className="text-sm font-bold text-white mt-0.5">
            {t.idealAmountForYou}: <span className="text-cyan-300 font-extrabold">₹{assessment.idealAmount.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 max-w-[260px]">
            Est. Monthly EMI: ₹{assessment.estimatedEmi.toLocaleString('en-IN')} ({assessment.tenureMonths} mos @ {assessment.interestRate}% p.a.)
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Required Disclaimer */}
      <p className="text-[10px] text-slate-500 text-center px-4 leading-relaxed">
        {assessment.disclaimer}
      </p>
    </div>
  );
};
