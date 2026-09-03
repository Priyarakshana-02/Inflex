import React, { useState } from 'react';
import { 
  Plus, 
  Mic, 
  TrendingUp, 
  Calendar, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Check 
} from 'lucide-react';
import { UserProfile, IncomeRecord, ExpenseRecord, RecordSource } from '../../types';

interface ScreenIncomeTrackerProps {
  profile: UserProfile;
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  onAddIncome: (record: Omit<IncomeRecord, 'id'>) => void;
  onAddExpense: (record: Omit<ExpenseRecord, 'id'>) => void;
  onOpenVoice: () => void;
}

export const ScreenIncomeTracker: React.FC<ScreenIncomeTrackerProps> = ({
  profile,
  incomes,
  expenses,
  onAddIncome,
  onAddExpense,
  onOpenVoice,
}) => {
  const isVariable = profile.incomeType === 'VARIABLE';
  const [activeTab, setActiveTab] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>(isVariable ? 'DAILY' : 'MONTHLY');
  const [showAddModal, setShowAddModal] = useState<'INCOME' | 'EXPENSE' | null>(null);

  // Form states
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(isVariable ? 'GIG_PAYOUT' : 'SALARY');
  const [source, setSource] = useState<RecordSource>('USER_ENTERED');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmitIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    onAddIncome({
      amount: Number(amount),
      date,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      category: category as any,
      description: description || (category === 'SALARY' ? 'Monthly Salary' : 'Earned Income'),
      source,
      status: source === 'USER_ENTERED' ? 'USER_ENTERED' : 'VERIFIED',
    });
    setAmount('');
    setDescription('');
    setShowAddModal(null);
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    onAddExpense({
      amount: Number(amount),
      date,
      category: category as any,
      description: description || 'Routine Expense',
      source,
      status: 'USER_ENTERED',
      isRecurring: false,
      confirmedCategory: true,
    });
    setAmount('');
    setDescription('');
    setShowAddModal(null);
  };

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 pb-14">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Smart Financial Ledger
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
              {isVariable ? 'Variable Income Mode' : 'Fixed Salaried Mode'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Track Income
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            {isVariable
              ? 'Real daily & weekly records from connected accounts, gig platforms, merchant QR, or cash.'
              : 'Monthly salary, bonuses, perks, and recurring allowances synchronized to your payroll cadence.'}
          </p>
        </div>

        {/* Action Buttons matching specification:
            "+ Add Income", "+ Add Expense", "Add by Voice"
        */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setCategory(isVariable ? 'GIG_PAYOUT' : 'SALARY');
              setShowAddModal('INCOME');
            }}
            className="flex-1 md:flex-none py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            + Add Income
          </button>

          <button
            onClick={() => {
              setCategory('FOOD_GROCERIES');
              setShowAddModal('EXPENSE');
            }}
            className="flex-1 md:flex-none py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            + Add Expense
          </button>

          <button
            onClick={onOpenVoice}
            className="py-2.5 px-4 bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-bold text-xs rounded-xl border border-purple-700/50 flex items-center justify-center gap-1.5 transition glow-purple"
          >
            <Mic className="w-4 h-4 text-purple-300" />
            Add by Voice
          </button>
        </div>
      </div>

      {/* Cadence Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs font-semibold">
          {isVariable ? (
            <>
              <button
                onClick={() => setActiveTab('DAILY')}
                className={`px-4 py-2 rounded-xl transition ${
                  activeTab === 'DAILY' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setActiveTab('WEEKLY')}
                className={`px-4 py-2 rounded-xl transition ${
                  activeTab === 'WEEKLY' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Weekly
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('MONTHLY')}
                className={`px-4 py-2 rounded-xl transition ${
                  activeTab === 'MONTHLY' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Salary
              </button>
            </>
          )}
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Logged Income</span>
          <span className="text-lg font-black text-cyan-300 tabular-nums">
            ₹{totalIncome.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Ledger Table / List */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl space-y-3">
        {incomes.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm font-semibold text-slate-300">No income records logged yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Click "+ Add Income" or speak "Today I earned ₹1,500" to log your first payout.
            </p>
          </div>
        ) : (
          incomes.map((record) => (
            <div
              key={record.id}
              className="p-4 rounded-2xl bg-[#121B32] border border-slate-800/80 hover:border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    {record.description}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">
                      {record.date} {record.time ? `• ${record.time}` : ''}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-300">
                      {record.category.replace(/_/g, ' ')}
                    </span>
                    {/* Source label matching instruction */}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      record.source === 'VERIFIED_BANK_DATA'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                        : record.source === 'GIG_PLATFORM'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                        : record.source === 'CONNECTED_BUSINESS_DATA'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                    }`}>
                      {record.source.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right sm:self-center pl-13 sm:pl-0">
                <span className="text-lg font-extrabold text-cyan-300 tabular-nums block">
                  +₹{record.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-medium">
                  {record.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add Income or Expense */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0D1424] border border-blue-900/70 rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">
                {showAddModal === 'INCOME' ? 'Add Real Income Record' : 'Add Expense Debit'}
              </h3>
              <button
                onClick={() => setShowAddModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showAddModal === 'INCOME' ? handleSubmitIncome : handleSubmitExpense} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-lg font-bold text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Zomato dinner peak deliveries"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {showAddModal === 'INCOME' ? (
                      <>
                        <option value="GIG_PAYOUT">Gig Payout</option>
                        <option value="SHOP_SALES">Shop / POS Sales</option>
                        <option value="DAILY_WAGE">Daily Wage</option>
                        <option value="SALARY">Monthly Salary</option>
                        <option value="BONUS">Bonus / Incentive</option>
                        <option value="OTHER">Other Income</option>
                      </>
                    ) : (
                      <>
                        <option value="FOOD_GROCERIES">Food & Groceries</option>
                        <option value="TRANSPORT">Fuel & Transport</option>
                        <option value="UTILITIES">Utilities & Recharge</option>
                        <option value="RENT">Rent</option>
                        <option value="BUSINESS_SUPPLIES">Business Wholesale</option>
                        <option value="HEALTH">Health</option>
                        <option value="OTHER">Other Expense</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Source Label</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as RecordSource)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="USER_ENTERED">USER ENTERED (Cash)</option>
                    <option value="VERIFIED_BANK_DATA">VERIFIED BANK DATA</option>
                    <option value="CONNECTED_BUSINESS_DATA">CONNECTED BUSINESS DATA</option>
                    <option value="GIG_PLATFORM">GIG PLATFORM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold shadow-md hover:from-cyan-400 hover:to-blue-500"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
