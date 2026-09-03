import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight, HelpCircle, Info, ChevronRight, Lock } from 'lucide-react';
import { UserProfile, IncomeRecord, ExpenseRecord, BillItem, LoanItem } from '../../types';
import { calculateSafeLoanPlan, SafeLoanPlan } from '../../services/financialEngine';

interface ScreenLoanPlannerProps {
  profile: UserProfile;
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  bills: BillItem[];
  loans: LoanItem[];
  onNavigate: (screen: string) => void;
}

export const ScreenLoanPlanner: React.FC<ScreenLoanPlannerProps> = ({
  profile,
  incomes,
  expenses,
  bills,
  loans,
  onNavigate,
}) => {
  const [requestedAmount, setRequestedAmount] = useState<number>(45000);
  const [tenureMonths, setTenureMonths] = useState<number>(12);

  const plan: SafeLoanPlan = calculateSafeLoanPlan(
    profile,
    incomes,
    expenses,
    bills,
    loans,
    requestedAmount,
    tenureMonths
  );

  return (
    <div className="space-y-6 pb-14">
      {/* Header matching instruction:
          Title: "Safe Loan Planner"
          Subtitle: "Borrow with confidence"
      */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Responsible Borrowing Guard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Safe Loan Planner
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Borrow with confidence
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input "I need ₹X" and Tenure Slider */}
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                How much do you need to borrow?
              </label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-cyan-400">
                  ₹
                </span>
                <input
                  type="number"
                  step={1000}
                  min={5000}
                  max={200000}
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-900 border border-cyan-500/60 rounded-2xl pl-10 pr-4 py-3.5 text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 tabular-nums glow-cyan"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Calculated against your verified cashflow, not arbitrary credit scores.
              </p>
            </div>

            {/* Repayment Horizon Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Repayment Horizon
                </label>
                <span className="text-sm font-bold text-cyan-300">
                  {tenureMonths} Months
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={36}
                step={3}
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>3 mo</span>
                <span>12 mo</span>
                <span>24 mo</span>
                <span>36 mo</span>
              </div>
            </div>

            {/* Volatility Discount Notice matching instruction:
                "volatility discount (at least 30% discount for variable-income earners)"
            */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Info className="w-4 h-4" />
                <span>30% Volatility Haircut Applied</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {profile.incomeType === 'VARIABLE'
                  ? 'We deduct 30% from your average earnings before calculating safe loan EMIs so a rainy week or bad shift never causes loan default.'
                  : 'Salaried earnings discounted by standard 10% emergency buffer buffer.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigate('loan-feasibility')}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/30 flex items-center justify-center gap-1.5 transition"
            >
              <span>View Full Feasibility Scoring</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center & Right: Safe Borrowing Plan Results & Rationale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Warning Banner */}
          <div className={`p-6 rounded-3xl border transition-all ${
            plan.status === 'SAFE'
              ? 'bg-emerald-950/30 border-emerald-500/50 glow-emerald'
              : plan.status === 'BORDERLINE'
              ? 'bg-amber-950/30 border-amber-500/50 glow-amber'
              : 'bg-rose-950/30 border-rose-500/50'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {plan.status === 'SAFE' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                )}
                <div>
                  <h3 className={`text-base font-bold ${
                    plan.status === 'SAFE' ? 'text-emerald-300' : 'text-amber-300'
                  }`}>
                    {plan.status === 'SAFE'
                      ? 'Requested Loan is Within Safe Capacity'
                      : plan.status === 'BORDERLINE'
                      ? 'Tight Budget: Stretches Safe Cashflow'
                      : 'High Risk: Exceeds Safe Borrowing Limit'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {plan.rationale}
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                plan.status === 'SAFE'
                  ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50'
                  : 'bg-amber-900/60 text-amber-300 border-amber-500/50'
              }`}>
                {plan.status}
              </span>
            </div>

            {/* Core Metrics Grid matching instruction:
                - safe manageable borrowing range
                - recommended borrowing amount
                - maximum safe monthly repayment / EMI
                - safe repayment period
            */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              <div className="p-4 rounded-2xl bg-[#0E162B] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Recommended Safe Amount
                </span>
                <div className="text-2xl font-black text-emerald-300 mt-1 tabular-nums">
                  ₹{plan.recommendedBorrowAmount.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Range: ₹{plan.safeRangeMin.toLocaleString('en-IN')} – ₹{plan.safeRangeMax.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0E162B] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Maximum Safe Monthly EMI
                </span>
                <div className="text-2xl font-black text-cyan-300 mt-1 tabular-nums">
                  ₹{plan.maxSafeMonthlyRepayment.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Calculated EMI: ₹{plan.calculatedMonthlyRepayment.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0E162B] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Safe Repayment Period
                </span>
                <div className="text-2xl font-black text-white mt-1 tabular-nums">
                  {plan.safeRepaymentPeriodMonths} Months
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Manageable at safe EMI
                </span>
              </div>
            </div>
          </div>

          {/* Transparent Breakdown Card matching instruction:
              - how much income is counted
              - how much is deducted for volatility
              - how much is reserved for essentials
              - how much remains for debt service
          */}
          <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Mathematical Capacity Breakdown (Transparent Calculation)
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-300">1. Historical Gross Income Counted:</span>
                <span className="font-bold text-white tabular-nums">
                  ₹{plan.breakdown.countedIncome.toLocaleString('en-IN')} / month
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-300">2. Less: Volatility Haircut (Safety Margin):</span>
                <span className="font-bold text-amber-400 tabular-nums">
                  - ₹{plan.breakdown.volatilityDeduction.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-300">3. Less: Protected Essential Living (Food, Rent, Bills):</span>
                <span className="font-bold text-rose-400 tabular-nums">
                  - ₹{plan.breakdown.essentialExpenses.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-300">4. Less: Existing Debt Servicing Obligations:</span>
                <span className="font-bold text-rose-400 tabular-nums">
                  - ₹{plan.breakdown.existingDebtService.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-2 pt-3 bg-cyan-950/20 px-3 rounded-xl border border-cyan-500/20">
                <span className="font-bold text-cyan-300">Net Safe Unencumbered Margin Remaining:</span>
                <span className="text-sm font-black text-cyan-300 tabular-nums">
                  ₹{plan.breakdown.netMarginForDebt.toLocaleString('en-IN')} / month
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
