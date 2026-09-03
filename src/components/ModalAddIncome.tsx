import React, { useState } from 'react';
import { X, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { api } from '../services/api';

interface ModalAddIncomeProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SOURCES = [
  'Ride Hailing (Uber/Ola)',
  'Delivery (Swiggy/Zomato)',
  'Vegetable / Market Stall',
  'Retail Store Sales',
  'Daily Wages / Freelance',
  'Direct Cash Payment'
];

export const ModalAddIncome: React.FC<ModalAddIncomeProps> = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState(SOURCES[0]);
  const [customSource, setCustomSource] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalSource = customSource.trim() || source;
      await api.addIncome({
        amount: Number(amount) || 0,
        source: finalSource,
        note: note.trim() || undefined
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-[#0C152B] border border-cyan-500/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.2)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Record Income</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Amount Earned (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                required
                autoFocus
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="2450"
                className="w-full bg-[#080E1E] border border-slate-700 focus:border-cyan-400 rounded-2xl pl-9 pr-4 py-3 text-xl font-extrabold text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Earning Source</label>
            <select
              value={source}
              onChange={e => setSource(e.target.value)}
              className="w-full bg-[#080E1E] border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              {SOURCES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Custom">Other Custom Source...</option>
            </select>
            {source === 'Custom' && (
              <input
                type="text"
                value={customSource}
                onChange={e => setCustomSource(e.target.value)}
                placeholder="Specify source name"
                className="w-full mt-2 bg-[#080E1E] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. evening shift, festive demand"
              className="w-full bg-[#080E1E] border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={loading || !amount}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:opacity-95 disabled:opacity-40"
            >
              {loading ? 'Recording...' : '+ Record Income'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
