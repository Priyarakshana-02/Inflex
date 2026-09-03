import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Plus,
  Zap,
  Phone,
  Droplets,
  Home,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { UserProfile, BillItem } from '../../../server/types';
import { api } from '../../services/api';
import { getTranslation } from '../../i18n/translations';

interface ScreenReserveMoneyProps {
  user: UserProfile;
  bills: BillItem[];
  totalReserved: number;
  safeToSpend: number;
  onBack: () => void;
  onRefresh: () => void;
}

export const ScreenReserveMoney: React.FC<ScreenReserveMoneyProps> = ({
  user,
  bills,
  totalReserved,
  safeToSpend,
  onBack,
  onRefresh
}) => {
  const t = getTranslation(user.language);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCategory, setNewCategory] = useState('Utilities');
  const [loading, setLoading] = useState(false);

  const handleToggleReserve = async (billId: string) => {
    try {
      await api.toggleReserveBill(billId);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addBill({
        title: newTitle,
        amount: Number(newAmount) || 500,
        dueDate: newDueDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        category: newCategory
      });
      setShowAddModal(false);
      setNewTitle('');
      setNewAmount('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBillIcon = (category: string) => {
    if (category.toLowerCase().includes('elec') || category.toLowerCase().includes('util')) {
      return <Zap className="w-5 h-5 text-amber-400" />;
    }
    if (category.toLowerCase().includes('recharge') || category.toLowerCase().includes('phone')) {
      return <Phone className="w-5 h-5 text-cyan-400" />;
    }
    if (category.toLowerCase().includes('water')) {
      return <Droplets className="w-5 h-5 text-blue-400" />;
    }
    return <Home className="w-5 h-5 text-purple-400" />;
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Header matching Reference Screen 10 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-tight">{t.reserveMoney}</h1>
          <p className="text-[11px] text-cyan-300 font-medium">{t.helpYouStayAhead}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white"
          title="Add Bill"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Card: Total Reserved with 3D Safe Vault Graphic matching Reference Screen 10 */}
      <div className="rounded-3xl bg-gradient-to-br from-[#101A38] via-[#0E152E] to-[#0A0F22] border border-cyan-500/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.15)] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
            {t.totalReserved}
          </span>
          <div className="text-3xl font-extrabold text-white tracking-tight my-1">
            ₹{totalReserved.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-300 font-medium max-w-[190px]">
            {t.safeAndReserved}
          </p>

          <div className="mt-3 text-[11px] text-slate-400">
            Safe to Spend: <strong className="text-emerald-400">₹{safeToSpend.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* 3D Safe Vault Icon matching Reference Screen 10 */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-blue-600/30 to-indigo-600/20 border border-cyan-400/50 flex flex-col items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.35)] shrink-0">
          <Lock className="w-10 h-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.9)] text-cyan-300" />
        </div>
      </div>

      {/* Section: Upcoming Dues matching Reference Screen 10 */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 px-1">
          <span>{t.upcomingDues}</span>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-cyan-400 lowercase font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>add bill</span>
          </button>
        </div>

        {bills.length === 0 ? (
          <div className="p-6 rounded-3xl bg-[#0B1327]/80 border border-slate-800 text-center">
            <p className="text-xs text-slate-400">No upcoming dues recorded.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 text-xs text-cyan-400 font-semibold hover:underline"
            >
              + Add electricity, rent or recharge bills
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map(bill => (
              <div
                key={bill.id}
                className="p-4 rounded-2xl bg-[#0B1327]/90 border border-slate-800 flex items-center justify-between shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {getBillIcon(bill.title)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{bill.title}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>Due {bill.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-white">
                    ₹{bill.amount.toLocaleString('en-IN')}
                  </span>

                  <button
                    onClick={() => handleToggleReserve(bill.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      bill.isReserved
                        ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:opacity-95'
                    }`}
                  >
                    {bill.isReserved ? 'Reserved ✓' : t.reserve}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-3xl bg-[#0C152B] border border-cyan-500/30 p-5">
            <h3 className="text-base font-bold text-white mb-3 text-center">Add Upcoming Bill</h3>
            <form onSubmit={handleAddBill} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Bill Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Electricity Bill"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={newAmount}
                  onChange={e => setNewAmount(e.target.value)}
                  placeholder="1200"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
                >
                  {loading ? 'Saving...' : 'Save Bill'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
