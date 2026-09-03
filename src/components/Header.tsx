import React, { useState } from 'react';
import { ChevronDown, Volume2, Shield, Sparkles, Layers, RefreshCw } from 'lucide-react';
import { UserProfile, LanguageCode } from '../../server/types';

interface HeaderProps {
  user: UserProfile | null;
  currentScreen: number;
  onNavigate: (screen: number) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onSyncDemo: () => void;
  onClearData: () => void;
  onOpenVoice: () => void;
}

const SCREENS = [
  { id: 0, title: 'Auth / Login', tag: 'Start' },
  { id: 1, title: '1. Language Selection', tag: 'Onboarding' },
  { id: 2, title: '2. Voice Setup', tag: 'Onboarding' },
  { id: 3, title: '3. Home Hub - Overview', tag: 'Core' },
  { id: 4, title: '4. Smart Income Tracker', tag: 'Tracking' },
  { id: 5, title: '5. Income Prediction', tag: 'AI Engine' },
  { id: 6, title: '6. Savings Goal Setup', tag: 'Savings' },
  { id: 7, title: '7. Savings Progress', tag: 'Savings' },
  { id: 8, title: '8. Loan Assistant', tag: 'Borrowing' },
  { id: 9, title: '9. Loan Feasibility Result', tag: 'Borrowing' },
  { id: 10, title: '10. Reserve Money (Bills)', tag: 'Resilience' },
  { id: 11, title: '11. Expenses Insights', tag: 'Analytics' },
  { id: 12, title: '12. Bonus & Festival Prediction', tag: 'Fixed Earner' },
  { id: 13, title: '13. Insights & Assurance', tag: 'AI Coach' },
  { id: 14, title: '14. Profile & Settings', tag: 'Account' },
  { id: 15, title: 'Financial Shock Simulator', tag: 'Simulator' }
];

export const Header: React.FC<HeaderProps> = ({
  user,
  currentScreen,
  onNavigate,
  onLanguageChange,
  onSyncDemo,
  onClearData,
  onOpenVoice
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#070B14]/90 backdrop-blur-md border-b border-cyan-500/15 px-4 py-2.5 flex items-center justify-between">
      {/* Brand & Screen Selector */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-slate-100 hover:border-cyan-400 text-xs font-semibold tracking-wide transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)]"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-300 font-bold tracking-tight">IncomeFlex</span>
          <span className="text-slate-400 text-[10px] max-w-[120px] truncate">
            {SCREENS.find(s => s.id === currentScreen)?.title.replace(/^[0-9.]+\s*/, '')}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-cyan-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu to directly jump to any of the 14 Reference Screens */}
        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            <div className="absolute top-full left-0 mt-2 w-72 max-h-96 overflow-y-auto bg-[#0C1427] border border-cyan-500/30 rounded-2xl p-2 z-50 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(6,182,212,0.2)]">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 border-b border-cyan-500/20 flex items-center justify-between">
                <span>14 Reference Screens</span>
                <span className="text-slate-400">Jump To</span>
              </div>
              <div className="py-1">
                {SCREENS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onNavigate(s.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                      currentScreen === s.id
                        ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/30 text-cyan-300 font-semibold border border-cyan-500/40'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{s.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {s.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Badges: Earner Type & Voice Trigger */}
      <div className="flex items-center gap-2">
        {/* Irregular / Fixed badge */}
        {user && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            {user.incomeType === 'irregular' ? 'Irregular / Gig' : 'Fixed Monthly'}
          </span>
        )}

        {/* Voice Trigger */}
        <button
          onClick={onOpenVoice}
          className="p-1.5 rounded-xl bg-blue-950/70 border border-blue-500/30 text-cyan-300 hover:bg-blue-900/80 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)]"
          title="Voice Assistant"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
