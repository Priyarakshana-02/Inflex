import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { UserProfile, SavingsGoal, IncomeRecord } from '../../types';
import { evaluateSavingsCondition } from '../../services/financialEngine';

interface ScreenSavingsGoalProps {
  profile: UserProfile;
  savingsGoal: SavingsGoal;
  incomes: IncomeRecord[];
  onUpdateSavingsGoal: (updatedGoal: Partial<SavingsGoal>) => void;
  onNavigate: (screen: string) => void;
}

export const ScreenSavingsGoal: React.FC<ScreenSavingsGoalProps> = ({
  profile,
  savingsGoal,
  incomes,
  onUpdateSavingsGoal,
  onNavigate,
}) => {
  const isVariable = profile.incomeType === 'VARIABLE';

  // State for form
  const [goalName, setGoalName] = useState(savingsGoal.goalName);
  const [targetAmount, setTargetAmount] = useState(savingsGoal.targetAmount);
  const [dailyThreshold, setDailyThreshold] = useState(savingsGoal.dailyGoalThreshold || 2000);
  const [dailySavings, setDailySavings] = useState(savingsGoal.dailySavingsAmount || 400);
  const [monthlyThreshold, setMonthlyThreshold] = useState(savingsGoal.monthlyThreshold || 6000);
  const [monthlySavings, setMonthlySavings] = useState(savingsGoal.monthlySavingsAmount || 2500);

  // Test simulation value
  const [simulatedIncome, setSimulatedIncome] = useState(2300);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live test result of the rule
  const testGoal: SavingsGoal = {
    ...savingsGoal,
    dailyGoalThreshold: dailyThreshold,
    dailySavingsAmount: dailySavings,
    monthlyThreshold,
    monthlySavingsAmount: monthlySavings,
  };

  const evalResult = evaluateSavingsCondition(testGoal, simulatedIncome, simulatedIncome);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSavingsGoal({
      goalName,
      targetAmount,
      dailyGoalThreshold: dailyThreshold,
      dailySavingsAmount: dailySavings,
      monthlyThreshold,
      monthlySavingsAmount: monthlySavings,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Conditional Savings Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Set Your Savings Goal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isVariable
                ? 'Save only on good earning days. Never forced during lean or zero-income shifts.'
                : 'Automated allocation evaluated monthly against real post-expense disposable surplus.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration Form */}
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Goal & Condition Parameters
          </h3>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">
                Goal Name (Optional)
              </label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g. Lean Week Emergency Buffer"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">
                Total Target Amount (₹)
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-lg font-bold text-white focus:outline-none focus:border-cyan-500 tabular-nums"
              />
            </div>

            {isVariable ? (
              <>
                {/* 1. Daily Income Goal */}
                <div className="p-4 rounded-2xl bg-[#121B32] border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-cyan-300">
                      1. Daily Income Goal Trigger (₹)
                    </label>
                    <span className="text-sm font-bold text-white tabular-nums">
                      ₹{dailyThreshold.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={800}
                    max={5000}
                    step={100}
                    value={dailyThreshold}
                    onChange={(e) => setDailyThreshold(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Only trigger automatic savings when your earnings cross this number.
                  </p>
                </div>

                {/* 2. Savings Amount */}
                <div className="p-4 rounded-2xl bg-[#121B32] border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-emerald-300">
                      2. Eligible Savings Amount (₹)
                    </label>
                    <span className="text-sm font-bold text-white tabular-nums">
                      ₹{dailySavings.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={1500}
                    step={50}
                    value={dailySavings}
                    onChange={(e) => setDailySavings(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Amount transferred to your savings reserve when the condition is reached.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Fixed Income Monthly Rule */}
                <div className="p-4 rounded-2xl bg-[#121B32] border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-cyan-300">
                      Monthly Minimum Surplus Threshold (₹)
                    </label>
                    <span className="text-sm font-bold text-white tabular-nums">
                      ₹{monthlyThreshold.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={20000}
                    step={500}
                    value={monthlyThreshold}
                    onChange={(e) => setMonthlyThreshold(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Evaluated monthly after real rent, bills, and food debits.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#121B32] border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-emerald-300">
                      Monthly Savings Allocation (₹)
                    </label>
                    <span className="text-sm font-bold text-white tabular-nums">
                      ₹{monthlySavings.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={10000}
                    step={250}
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>Update Savings Rule</span>
            </button>

            {saveSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-center text-xs font-bold text-emerald-300 animate-in fade-in">
                Savings condition rule successfully saved!
              </div>
            )}
          </form>
        </div>

        {/* Right: Interactive Condition Tester matching instruction */}
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              Live Condition Verification
            </span>
            <h3 className="text-lg font-bold text-white">
              Simulate Your Earnings Day
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              See how IncomeFlex evaluates the exact rule:
              <br />
              <code className="text-cyan-300 font-mono text-[11px]">
                IF actual income &gt;= goal ({isVariable ? `₹${dailyThreshold}` : `₹${monthlyThreshold}`})
                &rarr; save {isVariable ? `₹${dailySavings}` : `₹${monthlySavings}`}
              </code>
            </p>

            {/* Interactive Slider */}
            <div className="my-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-300 font-semibold">
                  Test Income Value:
                </span>
                <span className="text-xl font-extrabold text-white tabular-nums">
                  ₹{simulatedIncome.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={4000}
                step={100}
                value={simulatedIncome}
                onChange={(e) => setSimulatedIncome(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Evaluation Card matching the specification:
                "Your savings condition was reached."
                "₹500 is eligible to save."
                or
                "Your savings condition was not reached."
                "No savings triggered today."
            */}
            <div className={`p-5 rounded-2xl border transition-all ${
              evalResult.conditionMet
                ? 'bg-gradient-to-br from-emerald-950/50 to-cyan-950/40 border-emerald-500/60 glow-emerald'
                : 'bg-gradient-to-br from-slate-900/90 to-amber-950/30 border-amber-500/40 glow-amber'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {evalResult.conditionMet ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
                <span className={`text-sm font-bold ${
                  evalResult.conditionMet ? 'text-emerald-300' : 'text-amber-300'
                }`}>
                  {evalResult.conditionMet
                    ? 'Your savings condition was reached.'
                    : 'Your savings condition was not reached.'}
                </span>
              </div>

              <div className="text-2xl font-black text-white tabular-nums my-1">
                {evalResult.conditionMet
                  ? `₹${evalResult.eligibleSavings.toLocaleString('en-IN')} is eligible to save.`
                  : 'No savings triggered today.'}
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {evalResult.explanation}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">View current progress towards target</span>
            <button
              onClick={() => onNavigate('savings-progress')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Savings Progress <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
