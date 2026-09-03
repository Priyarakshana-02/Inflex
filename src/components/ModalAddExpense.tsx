import React, { useState } from 'react';
import { X, Plus, Sparkles, PieChart, Tag, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { ExpenseCategory } from '../../server/types';

interface ModalAddExpenseProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES: ExpenseCategory[] = ['Food', 'Transport', 'Household', 'Utilities', 'Health', 'Education', 'Debt', 'Entertainment', 'Others'];

export const ModalAddExpense: React.FC<ModalAddExpenseProps> = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Auto-detect category suggestion as user types note
  const handleNoteChange = (text: string) => {
    setNote(text);
    const lower = text.toLowerCase();
    if (lower.includes('petrol') || lower.includes('diesel') || lower.includes('fuel') || lower.includes('bus') || lower.includes('auto') || lower.includes('cab') || lower.includes('uber')) {
      setCategory('Transport');
    } else if (lower.includes('tea') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('ration') || lower.includes('grocer') || lower.includes('vegetable')) {
      setCategory('Food');
    } else if (lower.includes('bill') || lower.includes('light') || lower.includes('water') || lower.includes('recharge') || lower.includes('wifi')) {
      setCategory('Utilities');
    } else if (lower.includes('medicine') || lower.includes('doctor') || lower.includes('hospital') || lower.includes('clinic')) {
      setCategory('Health');
    } else if (lower.includes('rent') || lower.includes('repair') || lower.includes('soap')) {
      setCategory('Household');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addExpense({
        amount: Number(amount) || 0,
        category,
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
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <PieChart className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Record Expense</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Amount Spent (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                required
                autoFocus
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="450"
                className="w-full bg-[#080E1E] border border-slate-700 focus:border-cyan-400 rounded-2xl pl-9 pr-4 py-3 text-xl font-extrabold text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">What did you spend on?</label>
            <input
              type="text"
              value={note}
              onChange={e => handleNoteChange(e.target.value)}
              placeholder="e.g. Petrol for bike, Groceries, Medicine"
              className="w-full bg-[#080E1E] border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Category (Confirm)</label>
              <span className="text-[10px] text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Smart Categorized</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                    category === cat
                      ? 'bg-purple-900/60 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={loading || !amount}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:opacity-95 disabled:opacity-40"
            >
              {loading ? 'Recording...' : '+ Record Expense'}
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
