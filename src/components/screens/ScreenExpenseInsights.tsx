import React, { useState } from 'react';
import {
  ArrowLeft,
  PieChart as PieIcon,
  Lightbulb,
  ArrowDownRight,
  Plus,
  CheckCircle,
  HelpCircle,
  Tag
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { UserProfile, ExpenseTransaction } from '../../../server/types';
import { api } from '../../services/api';
import { getTranslation } from '../../i18n/translations';

interface ScreenExpenseInsightsProps {
  user: UserProfile;
  expenses: ExpenseTransaction[];
  totalExpenses: number;
  categories: { name: string; amount: number; percentage: number }[];
  onBack: () => void;
  onOpenAddExpense: () => void;
  onRefresh: () => void;
}

const COLORS = ['#8B5CF6', '#06B6D4', '#3B82F6', '#F59E0B', '#10B981', '#EC4899', '#64748B'];

export const ScreenExpenseInsights: React.FC<ScreenExpenseInsightsProps> = ({
  user,
  expenses,
  totalExpenses,
  categories,
  onBack,
  onOpenAddExpense,
  onRefresh
}) => {
  const t = getTranslation(user.language);
  const [period, setPeriod] = useState('This Month');

  // Find any expense that requires category confirmation
  const unconfirmed = expenses.filter(e => e.needsConfirmation);

  const handleConfirmCategory = async (id: string, category: string) => {
    try {
      await api.confirmExpense(id, category);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = categories.map((cat, i) => ({
    name: cat.name,
    value: cat.amount,
    percentage: cat.percentage,
    color: COLORS[i % COLORS.length]
  }));

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Header matching Reference Screen 11 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-tight">{t.expenseInsights}</h1>
          <p className="text-[11px] text-cyan-300 font-medium">{t.whereMoneyGoes}</p>
        </div>
        <button
          onClick={onOpenAddExpense}
          className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 hover:text-white"
          title="Add Expense"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Period Selector & Total Expense Card matching Reference Screen 11 */}
      <div className="rounded-3xl bg-gradient-to-br from-[#12112C] via-[#0E1326] to-[#0A0D1E] border border-cyan-500/25 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 font-semibold">{t.thisMonth}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" />
            <span>-8% vs last month</span>
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight my-1">
          ₹{totalExpenses.toLocaleString('en-IN')}
        </div>

        {/* Donut Chart matching Reference Screen 11 */}
        {categories.length > 0 ? (
          <div className="h-44 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0A0D1E" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1327',
                    borderColor: '#06B6D4',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                  formatter={(val: any, name: any) => [`₹${val}`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No expenses tracked yet for this month.
          </div>
        )}

        {/* Category breakdown pills matching Reference Screen 11 */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          {categories.map((cat, i) => (
            <div key={cat.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-[11px] text-slate-300 font-medium truncate max-w-[80px]">
                  {cat.name}
                </span>
              </div>
              <span className="text-xs font-bold text-white">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Tip Card matching Reference Screen 11 */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/70 to-purple-950/70 border border-cyan-500/30 p-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-amber-300 block">{t.smartTip}</span>
          <p className="text-[11px] text-slate-200 mt-0.5 leading-relaxed">
            {t.smartTipText}
          </p>
        </div>
      </div>

      {/* Unconfirmed Category Confirmation (Required AI Governance Feature) */}
      {unconfirmed.length > 0 && (
        <div className="rounded-2xl bg-amber-950/40 border border-amber-500/30 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-2">
            <Tag className="w-4 h-4" />
            <span>Confirm Expense Categories</span>
          </div>
          <p className="text-[11px] text-slate-300 mb-3">
            IncomeFlex suggested these categories based on your note. Please confirm:
          </p>
          <div className="space-y-2">
            {unconfirmed.map(item => (
              <div key={item.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-white font-semibold">₹{item.amount}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">"{item.note || 'Unspecified'}"</span>
                  <div className="text-[10px] text-cyan-300">Suggested: {item.category}</div>
                </div>
                <button
                  onClick={() => handleConfirmCategory(item.id, item.category)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  <span>Confirm</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
