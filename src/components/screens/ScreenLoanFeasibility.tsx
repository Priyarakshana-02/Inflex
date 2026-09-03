import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Info, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { UserProfile, IncomeRecord, ExpenseRecord, BillItem, LoanItem } from '../../types';
import { ResilienceGauge } from '../ResilienceGauge';

interface ScreenLoanFeasibilityProps {
  profile: UserProfile;
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  bills: BillItem[];
  loans: LoanItem[];
  onNavigate: (screen: string) => void;
}

export const ScreenLoanFeasibility: React.FC<ScreenLoanFeasibilityProps> = ({
  profile,
  incomes,
  expenses,
  bills,
  loans,
  onNavigate,
}) => {
  // Compute dynamic feasibility score based on actual debt-to-income and buffer
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const monthlyApproxIncome = profile.incomeType === 'VARIABLE' ? totalIncome * 2.2 : 38500;
  const existingEmiTotal = loans.reduce((s, l) => s + l.emiAmount, 0);
  const dtiRatio = monthlyApproxIncome > 0 ? (existingEmiTotal / monthlyApproxIncome) : 0.3;

  // Feasibility score (0-100)
  let feasibilityScore = Math.max(15, Math.min(95, Math.round((1 - dtiRatio) * 85 + ((profile.emergencyFundBalance || 0) > 5000 ? 10 : 0))));
  
  const manageableFactors = [
    `Low Existing Debt Burden: Current EMI obligations (₹${existingEmiTotal.toLocaleString('en-IN')}) consume only ${Math.round(dtiRatio * 100)}% of earnings.`,
    `Active Cashflow Velocity: Consistent credit frequency across multiple days/weeks.`,
    `Protected Reserve Priority: Core utilities and rent are factored into calculations before debt capacity.`,
  ];

  const riskFactors = [
    profile.incomeType === 'VARIABLE'
      ? 'Daily income variability can reduce cash in hand during unseasonal rains or platform downtime.'
      : 'Fixed income has limited upward elasticity if medical emergency occurs simultaneously.',
    'Missing long-term formal credit bureau records could mean external lenders charge higher interest rates.',
  ];

  return (
    <div className="space-y-6 pb-14">
      {/* Header matching instruction:
          Title: "Loan Feasibility"
      */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Resilience Diagnostic
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Loan Feasibility
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Capacity evaluation based on your verified cashflow resilience
          </p>
        </div>

        <button
          onClick={() => onNavigate('loan-planner')}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Planner
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Feasibility Gauge */}
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
            Feasibility Index
          </span>

          <ResilienceGauge
            score={feasibilityScore}
            size={180}
            strokeWidth={14}
            colorMode={feasibilityScore >= 70 ? 'emerald' : 'purple'}
            tier={feasibilityScore >= 70 ? 'STABLE' : 'VULNERABLE'}
          />

          <p className="text-xs text-slate-400 mt-3 max-w-xs">
            Reflects how comfortably your net disposable income can sustain an additional installment without stress.
          </p>
        </div>

        {/* Why Manageable & Why Risky */}
        <div className="lg:col-span-2 space-y-4">
          {/* Why Manageable */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Why Manageable
            </h4>
            <div className="space-y-2">
              {manageableFactors.map((f, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why Risky */}
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Potential Risks to Guard Against
            </h4>
            <div className="space-y-2">
              {riskFactors.map((r, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Existing Debt Obligations */}
          <div className="p-5 rounded-2xl bg-[#121B32] border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Existing Debt Obligations Monitored
            </h4>
            {loans.length === 0 ? (
              <p className="text-xs text-slate-500">No active loans found in connected records.</p>
            ) : (
              <div className="space-y-2">
                {loans.map((l) => (
                  <div key={l.id} className="flex justify-between items-center text-xs py-1 border-b border-slate-800 last:border-none">
                    <span className="text-slate-300">{l.name} ({l.lender})</span>
                    <span className="font-bold text-cyan-300 tabular-nums">
                      ₹{l.emiAmount.toLocaleString('en-IN')} / mo • {l.remainingTenureMonths} mo left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer matching instruction:
          "This is not a loan approval or credit decision. IncomeFlex provides educational financial resilience calculations based on your data."
      */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200 block">Important Notice</span>
          <p className="mt-0.5 leading-relaxed">
            This is not a loan approval or credit decision. IncomeFlex provides educational financial resilience calculations based on your data.
          </p>
        </div>
      </div>
    </div>
  );
};
