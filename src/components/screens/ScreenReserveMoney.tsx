import React, { useState } from 'react';
import { ShieldCheck, Plus, CheckCircle, Calendar, Lock, Unlock, AlertCircle, X, Sparkles } from 'lucide-react';
import { UserProfile, BillItem, RecordSource } from '../../types';

interface ScreenReserveMoneyProps {
  profile: UserProfile;
  bills: BillItem[];
  availableMoney: number;
  onToggleReserve: (billId: string) => void;
  onAddBill: (bill: Omit<BillItem, 'id'>) => void;
}

export const ScreenReserveMoney: React.FC<ScreenReserveMoneyProps> = ({
  profile,
  bills,
  availableMoney,
  onToggleReserve,
  onAddBill,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('2026-09-15');
  const [category, setCategory] = useState<'RENT' | 'ELECTRICITY' | 'SCHOOL_FEES' | 'LOAN_EMI' | 'UTILITIES' | 'OTHER'>('RENT');

  // Compute live calculations
  const totalBillsNeeded = bills.reduce((sum, b) => sum + b.amount, 0);
  const totalReserved = bills.filter(b => b.isReserved).reduce((sum, b) => sum + b.amount, 0);
  const safeToSpend = Math.max(0, availableMoney - totalReserved);

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;
    onAddBill({
      name,
      amount: Number(amount),
      dueDate,
      category,
      isReserved: true,
      source: 'USER_ENTERED',
    });
    setName('');
    setAmount('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Header matching instruction:
          Title: "Reserve Money"
          Subtitle: "Protect what matters"
      */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Cashflow Ring-Fencing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Reserve Money
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Protect what matters
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          + Add Bill
        </button>
      </div>

      {/* Calculated Metrics Grid matching instruction:
          - upcoming bills
          - total needed
          - planned/reserved in IncomeFlex
          - safe-to-spend
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Upcoming Bills</span>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">
            {bills.length} Bills Due
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Scheduled this month</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-xs font-semibold text-rose-400 block">Total Needed</span>
          <div className="text-2xl font-black text-rose-400 mt-1 tabular-nums">
            ₹{totalBillsNeeded.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Full commitments total</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1527] border border-amber-500/40 glow-amber">
          <span className="text-xs font-semibold text-amber-300 block">Planned in IncomeFlex</span>
          <div className="text-2xl font-black text-yellow-300 mt-1 tabular-nums">
            ₹{totalReserved.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-amber-400/80 mt-0.5 block">Ring-fenced from spending</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1527] border border-cyan-500/40 glow-cyan">
          <span className="text-xs font-semibold text-cyan-300 block">Safe-to-Spend</span>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">
            ₹{safeToSpend.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-cyan-400 mt-0.5 block">Free money after reserves</span>
        </div>
      </div>

      {/* Bills Reserve Protection List */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Active Scheduled Commitments
          </h3>
          <span className="text-xs text-slate-400">
            Click toggle to protect or release money
          </span>
        </div>

        {bills.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-xs">
            No bills registered yet. Click "+ Add Bill" to ring-fence rent, utilities, or loan EMIs.
          </div>
        ) : (
          bills.map((bill) => (
            <div
              key={bill.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                bill.isReserved
                  ? 'bg-[#101A33] border-cyan-500/40 shadow-sm'
                  : 'bg-[#121B32] border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleReserve(bill.id)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition mt-0.5 ${
                    bill.isReserved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                  title={bill.isReserved ? 'Protected: Click to unlock' : 'Unreserved: Click to protect'}
                >
                  {bill.isReserved ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </button>

                <div>
                  <h4 className="text-sm font-bold text-white">
                    {bill.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">
                      Due: {bill.dueDate}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-300">
                      {bill.category}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    {/* Source tag */}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wide ${
                      bill.source === 'VERIFIED_BANK_DATA'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                    }`}>
                      {bill.source.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pl-12 sm:pl-0">
                <div className="text-right">
                  <span className="text-lg font-extrabold text-white tabular-nums block">
                    ₹{bill.amount.toLocaleString('en-IN')}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    bill.isReserved ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {bill.isReserved ? 'Planned in IncomeFlex' : 'Pending Allocation'}
                  </span>
                </div>

                <button
                  onClick={() => onToggleReserve(bill.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    bill.isReserved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {bill.isReserved ? 'Reserved' : 'Reserve'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0D1424] border border-blue-900/70 rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Add Scheduled Bill / Due</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Bill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shop Rent or House Electricity"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-lg font-bold text-white focus:outline-none focus:border-cyan-500 tabular-nums"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="RENT">Rent</option>
                    <option value="ELECTRICITY">Electricity / Power</option>
                    <option value="SCHOOL_FEES">School / Education Fees</option>
                    <option value="LOAN_EMI">Loan Installment / EMI</option>
                    <option value="UTILITIES">Water / Mobile Recharge</option>
                    <option value="OTHER">Other Commitment</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold shadow-md hover:from-cyan-400 hover:to-blue-500"
                >
                  Save & Reserve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
