import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  TrendingDown,
  Wrench,
  Stethoscope,
  CloudRain,
  RotateCcw
} from 'lucide-react';
import { UserProfile } from '../../../server/types';
import { api } from '../../services/api';
import { getTranslation } from '../../i18n/translations';

interface ScreenShockSimulatorProps {
  user: UserProfile;
  onBack: () => void;
}

const SCENARIOS = [
  { id: 'income_drop_20', title: 'Income drops 20%', desc: 'Lean market week or slow orders', icon: <TrendingDown className="w-5 h-5 text-amber-400" /> },
  { id: 'income_drop_30', title: 'Income drops 30%', desc: 'Monsoon or off-season slowdown', icon: <CloudRain className="w-5 h-5 text-cyan-400" /> },
  { id: 'zero_income_7days', title: 'Zero income for 7 days', desc: 'Illness or forced leave', icon: <AlertTriangle className="w-5 h-5 text-rose-400" /> },
  { id: 'vehicle_repair', title: 'Vehicle repair (₹3,500)', desc: 'Bike breakdown or tire change', icon: <Wrench className="w-5 h-5 text-blue-400" /> },
  { id: 'medical_emergency', title: 'Medical emergency (₹5,000)', desc: 'Clinic visit & urgent medicine', icon: <Stethoscope className="w-5 h-5 text-pink-400" /> }
];

export const ScreenShockSimulator: React.FC<ScreenShockSimulatorProps> = ({
  user,
  onBack
}) => {
  const t = getTranslation(user.language);
  const [selectedScenario, setSelectedScenario] = useState('income_drop_20');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runSimulation(selectedScenario);
  }, [selectedScenario]);

  const runSimulation = async (scenario: string) => {
    setLoading(true);
    try {
      const res = await api.simulateShock(scenario);
      setResult(res.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-tight">{t.shockSimulator}</h1>
          <p className="text-[11px] text-cyan-300 font-medium">What happens if something goes wrong?</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Hero explanation card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1A122E] via-[#10142C] to-[#0A0D1E] border border-cyan-500/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Resilience Stress-Testing</h2>
            <p className="text-[11px] text-slate-400">See if your money survives sudden disruptions</p>
          </div>
        </div>
      </div>

      {/* Scenario Selector */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
          Select Shock Scenario
        </div>

        <div className="space-y-2">
          {SCENARIOS.map(sc => {
            const isSelected = selectedScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'bg-[#101A38] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-white'
                    : 'bg-[#0B1327]/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {sc.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{sc.title}</div>
                    <div className="text-[10px] text-slate-400">{sc.desc}</div>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulation Result Card */}
      {result && (
        <div className="rounded-3xl bg-[#0B1327]/90 border border-cyan-500/30 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.5)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Simulation Outcome
            </span>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                result.verdict === 'MANAGEABLE'
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                  : result.verdict === 'TIGHT'
                  ? 'bg-amber-950/80 border-amber-500/40 text-amber-400'
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-400'
              }`}
            >
              {result.verdict}
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-[#0E172E] border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Post-Shock Balance</span>
              <span className="text-lg font-extrabold text-white">
                ₹{result.postShockAvailable.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0E172E] border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Bills Protection</span>
              <span
                className={`text-lg font-extrabold ${
                  result.netAfterBills >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ₹{result.netAfterBills.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Plain Language Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {result.summary}
          </div>
        </div>
      )}
    </div>
  );
};
