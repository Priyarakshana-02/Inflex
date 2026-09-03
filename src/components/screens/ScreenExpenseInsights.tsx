import React, { useState } from 'react';
import { 
  PieChart, 
  BarChart2, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Repeat, 
  TrendingDown, 
  Check, 
  X, 
  Sparkles 
} from 'lucide-react';
import { UserProfile, ExpenseRecord } from '../../types';

interface ScreenExpenseInsightsProps {
  profile: UserProfile;
  expenses: ExpenseRecord[];
  onConfirmExpenseCategory: (expenseId: string, isConfirmed: boolean, newCategory?: string) => void;
}

export const ScreenExpenseInsights: React.FC<ScreenExpenseInsightsProps> = ({
  profile,
  expenses,
  onConfirmExpenseCategory,
}) => {
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoriesMap: { [key: string]: number } = {};
  expenses.forEach((e) => {
    categoriesMap[e.category] = (categoriesMap[e.category] || 0) + e.amount;
  });

  const categoryEntries = Object.entries(categoriesMap).sort((a, b) => b[1] - a[1]);

  // Find unconfirmed transaction for the interactive confirmation prompt
  const unconfirmedExpense = expenses.find(e => !e.confirmedCategory) || {
    id: 'exp-demo-prompt',
    amount: 1200,
    category: 'UTILITIES',
    description: 'Direct Debit to BSES Yamuna Power',
    confirmedCategory: false,
  };

  const [promptDismissed, setPromptDismissed] = useState(false);
  const [promptSuccessMessage, setPromptSuccessMessage] = useState<string | null>(null);

  const handleConfirmPrompt = (isYes: boolean) => {
    if (isYes) {
      onConfirmExpenseCategory(unconfirmedExpense.id, true);
      setPromptSuccessMessage('Categorized as verified Electricity Bill. Future debits will be auto-categorized.');
    } else {
      onConfirmExpenseCategory(unconfirmedExpense.id, false, 'OTHER');
      setPromptSuccessMessage('Marked as Other Uncategorized. You can re-assign anytime.');
    }
    setTimeout(() => {
      setPromptDismissed(true);
      setPromptSuccessMessage(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Header matching instruction:
          Title: "Expense Insights"
          Subtitle: "Where your money goes"
      */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Expenditure Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Expense Insights
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Where your money goes
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Verification Card matching instruction:
          "Is this ₹1,200 payment your electricity bill?"
          [Yes, that's right] [No, change it]
      */}
      {!promptDismissed && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-950/70 via-[#101C38] to-purple-950/70 border border-cyan-500/50 shadow-xl glow-cyan animate-in fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  AI Category Verification
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  Is this ₹{unconfirmedExpense.amount.toLocaleString('en-IN')} payment your electricity bill?
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Reference: "{unconfirmedExpense.description}"
                </p>
              </div>
            </div>
          </div>

          {promptSuccessMessage ? (
            <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300">
              {promptSuccessMessage}
            </div>
          ) : (
            <div className="flex items-center gap-3 mt-4 pt-2">
              <button
                onClick={() => handleConfirmPrompt(true)}
                className="py-2.5 px-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition"
              >
                <Check className="w-4 h-4" />
                Yes, that's right
              </button>

              <button
                onClick={() => handleConfirmPrompt(false)}
                className="py-2.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
              >
                <X className="w-4 h-4" />
                No, change it
              </button>
            </div>
          )}
        </div>
      )}

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total & Recurring Summary */}
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Recorded Outflow
            </span>
            <div className="text-3xl sm:text-4xl font-black text-rose-400 mt-1 tabular-nums">
              ₹{totalExpense.toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Across {expenses.length} debit events
            </span>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-cyan-400" />
              Identified Recurring Expenses
            </h4>

            {expenses.filter(e => e.isRecurring).length === 0 ? (
              <p className="text-xs text-slate-500">No recurring debits detected yet.</p>
            ) : (
              expenses.filter(e => e.isRecurring).map((rec) => (
                <div key={rec.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{rec.description}</span>
                    <span className="text-[10px] text-slate-400">Monthly cadence • {rec.category}</span>
                  </div>
                  <span className="font-bold text-rose-400 tabular-nums">
                    ₹{rec.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category Visual Bars */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Category Breakdown
          </h3>

          <div className="space-y-4">
            {categoryEntries.map(([cat, amt]) => {
              const share = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-200">
                      {cat.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-300 font-semibold tabular-nums">
                      ₹{amt.toLocaleString('en-IN')} ({share}%)
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
