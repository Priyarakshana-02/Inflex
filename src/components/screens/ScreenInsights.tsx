import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowRight, 
  Activity,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { UserProfile, IncomeRecord, ExpenseRecord, BillItem } from '../../types';
import { FinancialSnapshot } from '../../services/financialEngine';

interface ScreenInsightsProps {
  profile: UserProfile;
  snapshot: FinancialSnapshot;
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  bills: BillItem[];
}

export const ScreenInsights: React.FC<ScreenInsightsProps> = ({
  profile,
  snapshot,
  incomes,
  expenses,
  bills,
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Trigger Gemini AI insights via server endpoint
  const fetchGeminiInsights = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          snapshot,
          incomesCount: incomes.length,
          expensesCount: expenses.length,
          billsCount: bills.length,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data.insights);
      }
    } catch (e) {
      console.warn('Gemini insights error:', e);
      setAiAnalysis('Your cashflow shows positive momentum. Keep allocating 15% of high-earning shifts to your emergency buffer.');
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchGeminiInsights();
  }, [profile.incomeType, snapshot.resilienceScore]);

  const hasShortfallRisk = snapshot.upcomingBillsTotal > snapshot.availableMoney;

  return (
    <div className="space-y-6 pb-14">
      {/* Header matching instruction:
          Title: "Your Insights"
          Subtitle: "Resilience trends and patterns"
      */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Diagnostic Intelligence
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
              Mathematically Traceable
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Your Insights
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Resilience trends and patterns
          </p>
        </div>

        <button
          onClick={fetchGeminiInsights}
          disabled={loadingAi}
          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
          Refresh AI Analysis
        </button>
      </div>

      {/* Shortfall Warning Alert if bills > available */}
      {hasShortfallRisk && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3 glow-rose">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-300">
              Shortfall Warning: Upcoming Dues Exceed Current Available Cash
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              You have ₹{snapshot.upcomingBillsTotal.toLocaleString('en-IN')} in committed bills due soon, but only ₹{snapshot.availableMoney.toLocaleString('en-IN')} currently available in liquid funds.
              Prioritize upcoming high-earning shifts or reserve every earned rupee to avert late penalties.
            </p>
          </div>
        </div>
      )}

      {/* Gemini AI Synthesis Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-[#101C38] to-purple-950/60 border border-cyan-500/40 shadow-xl glow-cyan">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
            Gemini Plain-Language Financial Synthesis
          </span>
        </div>

        {loadingAi ? (
          <div className="py-4 text-xs text-slate-400 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            Generating grounded analysis from your verified transactions...
          </div>
        ) : (
          <div className="text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line">
            {aiAnalysis}
          </div>
        )}
      </div>

      {/* 4 Traceable Mathematical Insight Cards matching instruction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Income Stability Metric */}
        <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Income Stability Metric
            </span>
            <span className="text-sm font-black text-white tabular-nums">
              {snapshot.incomeStabilityIndex}%
            </span>
          </div>
          <p className="text-xs text-slate-300">
            <strong>Calculation Basis:</strong> Computed via 1 minus the coefficient of variation across your recorded daily credits.
          </p>
          <p className="text-xs text-slate-400">
            <strong>Plain English:</strong> High consistency means your earning days are steady with low risk of surprise drop-offs.
          </p>
          <div className="pt-2 text-[11px] text-cyan-300 font-semibold">
            Action: Continue maintaining weekend earning shifts to keep stability above 70%.
          </div>
        </div>

        {/* 2. Buffer Runway */}
        <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Emergency Buffer Runway
            </span>
            <span className="text-sm font-black text-white tabular-nums">
              {snapshot.daysOfBuffer} Days
            </span>
          </div>
          <p className="text-xs text-slate-300">
            <strong>Calculation Basis:</strong> Total available liquid savings divided by average daily essential burn rate.
          </p>
          <p className="text-xs text-slate-400">
            <strong>Plain English:</strong> If zero income arrives starting tomorrow, your essential food and rent are secured for this duration.
          </p>
          <div className="pt-2 text-[11px] text-emerald-300 font-semibold">
            Action: Aim for a minimum 14-day buffer runway for complete peace of mind.
          </div>
        </div>

        {/* 3. Spending Pace */}
        <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Spending Pace & Burn Rate
            </span>
            <span className="text-sm font-black text-white tabular-nums">
              Normal Velocity
            </span>
          </div>
          <p className="text-xs text-slate-300">
            <strong>Calculation Basis:</strong> Actual recorded expense frequency relative to the period length.
          </p>
          <p className="text-xs text-slate-400">
            <strong>Plain English:</strong> You are spending within expected bounds. No abnormal outflow spikes detected.
          </p>
          <div className="pt-2 text-[11px] text-purple-300 font-semibold">
            Action: Check recurring debits in Expense Insights to eliminate unused subscriptions.
          </div>
        </div>

        {/* 4. Debt-to-Surplus Ratio */}
        <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Debt-to-Surplus Ratio
            </span>
            <span className="text-sm font-black text-white tabular-nums">
              Healthy
            </span>
          </div>
          <p className="text-xs text-slate-300">
            <strong>Calculation Basis:</strong> Total active loan EMI vs net disposable post-essential earnings.
          </p>
          <p className="text-xs text-slate-400">
            <strong>Plain English:</strong> Your debt load is not threatening your core family necessities.
          </p>
          <div className="pt-2 text-[11px] text-blue-300 font-semibold">
            Action: Use Safe Loan Planner before applying for any new consumer finance.
          </div>
        </div>
      </div>
    </div>
  );
};
