import React from 'react';
import {
  ArrowLeft,
  Check,
  Award,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { UserProfile, LoanAssessment } from '../../../server/types';
import { getTranslation } from '../../i18n/translations';

interface ScreenLoanFeasibilityProps {
  user: UserProfile;
  assessment: LoanAssessment;
  requestedAmount: number;
  onBack: () => void;
  onExploreLenders?: () => void;
}

export const ScreenLoanFeasibility: React.FC<ScreenLoanFeasibilityProps> = ({
  user,
  assessment,
  requestedAmount,
  onBack
}) => {
  const t = getTranslation(user.language);

  // Match score & status
  const matchScore = assessment.feasibilityScore;
  const isGoodMatch = matchScore >= 60;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Header matching Reference Screen 9 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-tight">{t.feasibilityReport}</h1>
          <p className="text-[11px] text-cyan-300 font-medium">{t.heresWhatWeFound}</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Hero Circular Gauge matching Reference Screen 9 */}
      <div className="rounded-3xl bg-gradient-to-b from-[#101C3D] via-[#0E162F] to-[#0A1024] border border-cyan-500/30 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.15)] flex flex-col items-center text-center">
        <span className="text-xs text-slate-400 font-semibold mb-2">
          Assessment for ₹{requestedAmount.toLocaleString('en-IN')}
        </span>

        {/* Circular Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#1E293B"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Value ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={isGoodMatch ? '#06B6D4' : '#F59E0B'}
              strokeWidth="8"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * matchScore) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {matchScore}%
            </span>
            <span className={`text-xs font-bold ${isGoodMatch ? 'text-cyan-300' : 'text-amber-400'}`}>
              {isGoodMatch ? t.goodMatch : 'High Risk'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 max-w-xs mt-1">
          {isGoodMatch
            ? 'Your cash flow comfortably supports this repayment without affecting core bills.'
            : 'This amount stretches your monthly income safety buffer. Consider a lower tenure or amount.'}
        </p>
      </div>

      {/* Section: Why this amount works for you matching Reference Screen 9 */}
      <div className="rounded-3xl bg-[#0B1327]/90 border border-cyan-500/25 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          {t.whyThisAmountWorks}
        </div>

        <div className="space-y-2.5">
          {assessment.strengths.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-400/40">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs font-medium text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Assurance for You with Gold Star Medal matching Reference Screen 9 */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950/70 via-indigo-950/70 to-purple-950/70 border border-amber-500/30 p-4 shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex items-center gap-4">
        {/* 3D Gold Star Medal Graphic */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] shrink-0">
          <Award className="w-8 h-8 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        </div>

        <div>
          <span className="text-xs font-bold text-amber-300 block">{t.assuranceForYou}</span>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
            {t.assuranceText}
          </p>
        </div>
      </div>

      {/* Required Disclaimer */}
      <div className="pt-2 text-center">
        <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
          {assessment.disclaimer}
        </p>

        <button
          onClick={onBack}
          className="mt-4 w-full py-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          ← Adjust Loan Amount
        </button>
      </div>
    </div>
  );
};
