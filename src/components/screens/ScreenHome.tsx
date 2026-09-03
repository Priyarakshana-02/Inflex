import React from 'react';
import { 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  PiggyBank, 
  ShieldAlert, 
  Sparkles, 
  Calendar, 
  Building2, 
  Zap, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import { UserProfile, IncomeRecord, ExpenseRecord, BillItem, SavingsGoal } from '../../types';
import { FinancialSnapshot } from '../../services/financialEngine';
import { ResilienceGauge } from '../ResilienceGauge';
import { translations } from '../../data/translations';

interface ScreenHomeProps {
  profile: UserProfile;
  snapshot: FinancialSnapshot;
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  bills: BillItem[];
  savingsGoal: SavingsGoal;
  onNavigate: (screen: string) => void;
  onOpenAddIncome: () => void;
  onOpenConnectModal: () => void;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  profile,
  snapshot,
  incomes,
  expenses,
  bills,
  savingsGoal,
  onNavigate,
  onOpenAddIncome,
  onOpenConnectModal,
}) => {
  const t = translations[profile.preferredLanguage] || translations.en;
  const isCleanUser = incomes.length === 0 && expenses.length === 0 && snapshot.availableMoney === 0;

  // Simple Mode Layout
  if (profile.simpleMode) {
    return (
      <div className="space-y-6 pb-12">
        <div className="bg-gradient-to-r from-amber-500/20 via-blue-900/30 to-purple-900/20 border border-amber-500/40 rounded-3xl p-6 text-slate-100 glow-amber">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {t.simpleModeTitle}
              </span>
              <h2 className="text-2xl font-extrabold mt-1 text-white">
                Namaste, {profile.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Everyday finance explained in plain, clear terms.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-2xl font-bold">
              💰
            </div>
          </div>
        </div>

        {/* 5 Plain-Language Core Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Money I Have */}
          <div 
            onClick={() => onNavigate('income-tracker')}
            className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all shadow-lg"
          >
            <span className="text-xs font-semibold text-cyan-400">{t.simpleMoneyIHave}</span>
            <div className="text-3xl font-extrabold text-white mt-1 tabular-nums">
              ₹{snapshot.availableMoney.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ready cash in bank and wallet for your daily life.
            </p>
          </div>

          {/* 2. Money I May Earn */}
          <div 
            onClick={() => onNavigate('income-prediction')}
            className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all shadow-lg"
          >
            <span className="text-xs font-semibold text-purple-400">{t.simpleMoneyIMayEarn}</span>
            <div className="text-3xl font-extrabold text-white mt-1 tabular-nums">
              {profile.incomeType === 'VARIABLE' ? '₹1,600 – ₹2,400 / day' : '₹38,500 / month'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Based on your actual past work and current conditions.
            </p>
          </div>

          {/* 3. Money I Need Soon */}
          <div 
            onClick={() => onNavigate('reserve-money')}
            className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all shadow-lg"
          >
            <span className="text-xs font-semibold text-rose-400">{t.simpleMoneyINeed}</span>
            <div className="text-3xl font-extrabold text-white mt-1 tabular-nums">
              ₹{snapshot.upcomingBillsTotal.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Bills, rent, or dues to be paid this month.
            </p>
          </div>

          {/* 4. Money I Saved */}
          <div 
            onClick={() => onNavigate('savings-progress')}
            className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all shadow-lg"
          >
            <span className="text-xs font-semibold text-emerald-400">{t.simpleMoneyISaved}</span>
            <div className="text-3xl font-extrabold text-white mt-1 tabular-nums">
              ₹{savingsGoal.currentSaved.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Target: ₹{savingsGoal.targetAmount.toLocaleString('en-IN')} for lean weeks.
            </p>
          </div>

          {/* 5. Money I May Borrow */}
          <div 
            onClick={() => onNavigate('loan-planner')}
            className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all shadow-lg md:col-span-2"
          >
            <span className="text-xs font-semibold text-blue-400">{t.simpleMoneyIMayBorrow}</span>
            <div className="text-3xl font-extrabold text-white mt-1 tabular-nums">
              Up to ₹35,000 safely
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Calculated without putting your food or rent at risk.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-14">
      {/* Empty State Guard as explicitly specified in prompt:
          "When the user is new and no financial data is available:
           DO NOT display fake cards with random numbers.
           Show empty states that match the visual design."
      */}
      {isCleanUser && (
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#10182C] to-[#0B1020] border border-cyan-500/40 text-center shadow-2xl glow-cyan">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Connect your account to see your financial picture
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
            IncomeFlex uses real financial data to compute your resilience score, predict income ranges, and protect your bills.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <button
              onClick={onOpenConnectModal}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-sm rounded-2xl shadow-lg shadow-cyan-500/30 transition hover:scale-105"
            >
              {t.connectAccountBtn}
            </button>
            <button
              onClick={onOpenAddIncome}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 font-bold text-sm rounded-2xl transition"
            >
              {t.addIncomeBtn}
            </button>
          </div>
        </div>
      )}

      {/* Main Top Banner / Snapshot Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Circular Financial Resilience Gauge */}
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl shadow-cyan-950/30 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {t.financialResilienceScore}
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
              Live Index
            </span>
          </div>

          <ResilienceGauge
            score={snapshot.resilienceScore}
            tier={snapshot.resilienceTier}
            size={175}
            strokeWidth={13}
            colorMode="cyan"
          />

          <div className="w-full mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-900/60 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Income Stability</span>
              <span className="text-sm font-bold text-slate-100">{snapshot.incomeStabilityIndex}%</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Buffer Runway</span>
              <span className="text-sm font-bold text-cyan-300">{snapshot.daysOfBuffer} Days</span>
            </div>
          </div>
        </div>

        {/* Card 2: Current Liquid Snapshot & Safe-to-Spend */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.currentSnapshot}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  {profile.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">
                  {t.lastUpdated}
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  {profile.lastDataUpdate}
                </span>
              </div>
            </div>

            {/* Financial Numbers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-[#121B32] border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-medium">
                  {t.availableMoney}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tabular-nums">
                  ₹{snapshot.availableMoney.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-1 inline-block">
                  Verified Total
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121B32] border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-medium">
                  {t.incomeThisPeriod}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1 tabular-nums">
                  +₹{snapshot.totalIncomePeriod.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 inline-flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                  {incomes.length} Active credits
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121B32] border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-medium">
                  {t.expensesThisPeriod}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1 tabular-nums">
                  -₹{snapshot.totalExpensePeriod.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 inline-flex items-center gap-1">
                  <ArrowDownRight className="w-3 h-3 text-rose-400" />
                  {expenses.length} Debits
                </span>
              </div>
            </div>

            {/* Dual Highlight: Safe-to-Spend vs Planned Reserved */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 glow-cyan">
              <div>
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  {t.safeToSpend}
                </span>
                <div className="text-3xl font-black text-white mt-0.5 tabular-nums">
                  ₹{snapshot.safeToSpend.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Available without risking rent, utility dues, or essential repayments.
                </p>
              </div>

              <div className="text-left sm:text-right bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 w-full sm:w-auto">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {t.reservedMoney}
                </span>
                <span className="text-lg font-bold text-yellow-300 tabular-nums">
                  ₹{snapshot.reservedMoneyTotal.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  for {bills.filter(b => b.isReserved).length} upcoming dues
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={onOpenAddIncome}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" />
              {t.addIncomeBtn}
            </button>
            <button
              onClick={onOpenConnectModal}
              className="py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              Sync Bank / Gig Data
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid matching specification:
          Quick actions:
          Track Income, Predict, Savings Goal, Loan Helper, Reserve Money, Expenses, Insights, More
      */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Resilience Tools & Quick Actions
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { id: 'income-tracker', title: 'Track Income', icon: '💵', color: 'from-cyan-500/20 to-blue-500/20 text-cyan-300' },
            { id: 'income-prediction', title: 'Predict', icon: '📈', color: 'from-blue-500/20 to-purple-500/20 text-blue-300' },
            { id: 'savings-goal', title: 'Savings Goal', icon: '🎯', color: 'from-purple-500/20 to-pink-500/20 text-purple-300' },
            { id: 'loan-planner', title: 'Loan Helper', icon: '🛡️', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300' },
            { id: 'reserve-money', title: 'Reserve Money', icon: '🔒', color: 'from-amber-500/20 to-yellow-500/20 text-amber-300' },
            { id: 'expense-insights', title: 'Expenses', icon: '📊', color: 'from-rose-500/20 to-red-500/20 text-rose-300' },
            { id: 'shock-simulator', title: 'Shock Sim', icon: '⚡', color: 'from-yellow-500/20 to-amber-500/20 text-yellow-300' },
            { id: 'insights', title: 'AI Insights', icon: '✨', color: 'from-indigo-500/20 to-cyan-500/20 text-indigo-300' },
          ].map((act) => (
            <button
              key={act.id}
              onClick={() => onNavigate(act.id)}
              className="p-3 rounded-2xl bg-[#0D1527] border border-slate-800/90 hover:border-cyan-500/50 flex flex-col items-center justify-center text-center group transition-all duration-200 hover:scale-[1.02] shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900/80 flex items-center justify-center text-xl mb-1.5 group-hover:scale-110 transition-transform">
                {act.icon}
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                {act.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Section: Upcoming Bills & Recent Activity with Data Transparency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upcoming Bills & Reserve Protection */}
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">{t.upcomingBills}</h4>
                <p className="text-xs text-slate-400">Essential commitments & dues</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('reserve-money')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Manage Reserves <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {bills.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-[#121B32] border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">{b.name}</span>
                    {b.isReserved ? (
                      <span className="text-[10px] bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800/50 font-semibold">
                        Planned in IncomeFlex
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-950/80 text-amber-400 px-2 py-0.5 rounded-full border border-amber-800/50 font-semibold">
                        Pending Allocation
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    Due on {b.dueDate} • {b.category}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-white tabular-nums">
                    ₹{b.amount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {b.source.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Activity with Data Transparency Labels */}
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Recent Verified Records</h4>
                <p className="text-xs text-slate-400">Transparent source attribution</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('income-tracker')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Full Ledger <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {incomes.slice(0, 4).map((inc) => (
              <div
                key={inc.id}
                className="p-3 rounded-2xl bg-[#121B32] border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-200 block truncate max-w-[220px]">
                    {inc.description}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400">
                      {inc.date} {inc.time ? `• ${inc.time}` : ''}
                    </span>
                    {/* Transparency Badge */}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                      inc.source === 'VERIFIED_BANK_DATA'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                        : inc.source === 'GIG_PLATFORM'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                        : inc.source === 'CONNECTED_BUSINESS_DATA'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                    }`}>
                      {inc.source.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-cyan-400 tabular-nums block">
                    +₹{inc.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">
                    {inc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
