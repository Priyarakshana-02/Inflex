import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Bot,
  Sun,
  Users,
  TrendingUp,
  CloudRain,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { UserProfile, PredictionResult } from '../../../server/types';
import { getTranslation } from '../../i18n/translations';

interface ScreenIncomePredictionProps {
  user: UserProfile;
  prediction: PredictionResult | null;
  weather: { temp: number; condition: string; rainMm: number; lastUpdated: string } | null;
  onBack: () => void;
  onNavigateToTracker: () => void;
}

export const ScreenIncomePrediction: React.FC<ScreenIncomePredictionProps> = ({
  user,
  prediction,
  weather,
  onBack,
  onNavigateToTracker
}) => {
  const t = getTranslation(user.language);
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');

  // Chart data for visualization
  const chartData = [
    { name: '4d ago', value: prediction?.estimatedMin ? Math.round(prediction.estimatedMin * 0.85) : 0 },
    { name: '3d ago', value: prediction?.estimatedMin ? Math.round(prediction.estimatedMin * 0.92) : 0 },
    { name: '2d ago', value: prediction?.estimatedMin ? Math.round(prediction.estimatedMin * 0.98) : 0 },
    { name: 'Yesterday', value: prediction?.estimatedMin ? Math.round(prediction.estimatedMin * 1.02) : 0 },
    { name: 'Today', value: prediction?.estimatedMin ? Math.round(prediction.estimatedMin * 1.05) : 0 },
    { name: 'Tomorrow (AI)', value: prediction?.estimatedMax ? Math.round((prediction.estimatedMin + prediction.estimatedMax) / 2) : 0 }
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Top Bar matching Reference Screen 5 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-tight">{t.predictedIncome}</h1>
          <p className="text-[11px] text-cyan-300 font-medium flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>AI insight based on your data</span>
          </p>
        </div>
        <div className="w-9" />
      </div>

      {/* Daily / Weekly Toggle matching Reference */}
      <div className="grid grid-cols-2 p-1 bg-[#0A1224] border border-cyan-500/25 rounded-2xl">
        <button
          onClick={() => setTab('daily')}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            tab === 'daily'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.daily}
        </button>
        <button
          onClick={() => setTab('weekly')}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            tab === 'weekly'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.weekly}
        </button>
      </div>

      {/* Main Prediction Card */}
      {!prediction || !prediction.hasEnoughData ? (
        <div className="rounded-3xl bg-[#0B1327]/90 border border-amber-500/30 p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white mb-1">Not Enough Data Yet</h2>
          <p className="text-xs text-slate-300 mb-4 max-w-xs mx-auto">
            {prediction?.aiInsight || 'Track income for at least 3-5 days to unlock reliable mathematical AI predictions.'}
          </p>
          <button
            onClick={onNavigateToTracker}
            className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:opacity-95"
          >
            + Add Daily Earnings
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-gradient-to-b from-[#0F1B38]/90 via-[#0A1226]/90 to-[#070C1A] border border-cyan-500/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(6,182,212,0.15)]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">Predicted Income</span>
            <span className="text-cyan-400 font-mono text-[11px]">Tomorrow</span>
          </div>

          {/* Large Estimated Range matching Reference Screen 5 */}
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ₹{prediction.estimatedMin.toLocaleString('en-IN')} – ₹{prediction.estimatedMax.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold">
              ↑ +15% chance
            </span>
            <span className="text-[10px] text-slate-400">
              Confidence: <strong className="text-cyan-300">{prediction.confidence}</strong> ({prediction.confidenceScore}%)
            </span>
          </div>

          {/* Recharts Glowing Area Chart matching Reference Screen 5 */}
          <div className="h-32 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="predictionGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748B" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1327',
                    borderColor: '#06B6D4',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                  formatter={(val: any) => [`₹${val}`, 'Projected']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22D3EE"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#predictionGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* SECTION: Why is this prediction? matching Reference Screen 5 */}
      {prediction && prediction.hasEnoughData && (
        <div className="rounded-3xl bg-[#0B1327]/90 border border-cyan-500/20 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
            <span>{t.whyThisPrediction}</span>
            {weather && (
              <span className="text-[10px] text-cyan-400 font-normal">
                Weather: {weather.condition} ({weather.temp}°C)
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {prediction.factors.map((factor, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-[#0E1A38]/60 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{factor.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-white">{factor.name}</div>
                    <div className="text-[10px] text-slate-400">{factor.description}</div>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold ${
                    factor.impactAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {factor.impactAmount >= 0 ? `+₹${factor.impactAmount}` : `-₹${Math.abs(factor.impactAmount)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Bot Banner matching Reference Screen 5 */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-cyan-500/30 p-3.5 flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-white block">Continuous Learning Engine</span>
          Prediction gets better as you keep tracking!
        </div>
      </div>
    </div>
  );
};
