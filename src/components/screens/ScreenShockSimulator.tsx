import React, { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  TrendingDown,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { UserProfile, IncomeRecord, ExpenseRecord, BillItem } from '../../types';
import { evaluateShockScenario, ShockSimulationResult } from '../../services/financialEngine';

interface ScreenShockSimulatorProps {
  profile: UserProfile;
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  bills: BillItem[];
  availableMoney: number;
}

export const ScreenShockSimulator: React.FC<ScreenShockSimulatorProps> = ({
  profile,
  incomes,
  expenses,
  bills,
  availableMoney,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<'DROP_20' | 'ZERO_7_DAYS' | 'EMERGENCY_EXPENSE' | 'INFLATION_SURGE'>('ZERO_7_DAYS');
  const [customShockAmount, setCustomShockAmount] = useState(15000);

  const result: ShockSimulationResult = evaluateShockScenario(
    profile,
    incomes,
    expenses,
    bills,
    availableMoney,
    selectedScenario,
    customShockAmount
  );

  return (
    <div className="space-y-6 pb-14">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
              Resilience Stress Test
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Financial Shock Simulator
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              "What happens if something goes wrong?" Test your safety margin before crisis strikes.
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            id: 'ZERO_7_DAYS',
            title: '7 Days Zero Work',
            desc: 'Fever, illness, or platform outage halts earnings for 1 week.',
            icon: '🤒',
          },
          {
            id: 'DROP_20',
            title: '20% Income Drop',
            desc: 'Fuel price surge or lower customer demand cuts net earnings by 20%.',
            icon: '📉',
          },
          {
            id: 'EMERGENCY_EXPENSE',
            title: 'Medical / Repair Bill',
            desc: `Sudden ₹${customShockAmount.toLocaleString('en-IN')} emergency outflow debit.`,
            icon: '🏥',
          },
          {
            id: 'INFLATION_SURGE',
            title: 'Essential Inflation +15%',
            desc: 'Cooking gas, grocery staples, and school transit prices hike 15%.',
            icon: '🛒',
          },
        ].map((sc) => (
          <button
            key={sc.id}
            onClick={() => setSelectedScenario(sc.id as any)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedScenario === sc.id
                ? 'bg-gradient-to-br from-yellow-950/50 to-blue-950/50 border-yellow-500/60 glow-amber text-white shadow-lg'
                : 'bg-[#0D1527] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="text-2xl mb-2">{sc.icon}</div>
            <h4 className="text-sm font-bold text-white">{sc.title}</h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {sc.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Custom Emergency Amount Slider if EMERGENCY_EXPENSE is chosen */}
      {selectedScenario === 'EMERGENCY_EXPENSE' && (
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-white block">Emergency Shock Outflow:</span>
            Adjust simulated medical or motorcycle repair bill size
          </div>
          <div className="flex items-center gap-3 w-full sm:w-72">
            <input
              type="range"
              min={5000}
              max={50000}
              step={2500}
              value={customShockAmount}
              onChange={(e) => setCustomShockAmount(Number(e.target.value))}
              className="flex-1 cursor-pointer"
            />
            <span className="text-sm font-extrabold text-yellow-400 tabular-nums">
              ₹{customShockAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {/* Simulation Result Card */}
      <div className={`p-6 rounded-3xl border transition-all ${
        result.status === 'MANAGEABLE'
          ? 'bg-emerald-950/30 border-emerald-500/50 glow-emerald'
          : result.status === 'TIGHT'
          ? 'bg-amber-950/30 border-amber-500/50 glow-amber'
          : 'bg-rose-950/30 border-rose-500/50 glow-rose'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            {result.status === 'MANAGEABLE' ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Simulation Outcome
              </span>
              <h3 className="text-xl font-extrabold text-white">
                Status: {result.status}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Remaining Buffer</span>
              <span className="text-2xl font-black text-white tabular-nums">
                {result.remainingRunwayDays} Days
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Runway Impact</span>
              <span className="text-2xl font-black text-rose-400 tabular-nums">
                -{result.bufferDaysImpact} Days
              </span>
            </div>
          </div>
        </div>

        {/* Narrative & Mitigation Steps */}
        <div className="mt-5 space-y-4">
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {result.summary}
          </p>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
              Step-by-Step Mitigation Protocol
            </span>
            <div className="space-y-2">
              {result.mitigationSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
