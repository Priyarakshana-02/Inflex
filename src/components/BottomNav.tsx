import React from 'react';
import { Home, BarChart2, Mic, Bell, User, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

interface BottomNavProps {
  currentScreen: number;
  onNavigate: (screen: number) => void;
  onOpenVoice: () => void;
  hasUnreservedBills?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenVoice,
  hasUnreservedBills = false
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 px-4 pb-4 pointer-events-none">
      <div className="pointer-events-auto bg-[#0A1022]/95 backdrop-blur-xl border border-cyan-500/20 rounded-3xl px-4 py-2 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.15)]">
        {/* Home */}
        <button
          onClick={() => onNavigate(3)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            currentScreen === 3 ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Activity / Tracker */}
        <button
          onClick={() => onNavigate(4)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            currentScreen === 4 || currentScreen === 11 ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Activity"
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Activity</span>
        </button>

        {/* Center Glowing Voice Button */}
        <div className="-mt-8 relative flex flex-col items-center">
          <div className="absolute inset-0 rounded-full bg-cyan-400 blur-md opacity-40 animate-pulse" />
          <button
            onClick={onOpenVoice}
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 p-0.5 shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-white"
            aria-label="Voice Assistant"
          >
            <div className="w-full h-full rounded-full bg-[#091122]/40 flex items-center justify-center">
              <Mic className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </div>
          </button>
          <span className="text-[9px] text-cyan-300 font-medium mt-1">AI Voice</span>
        </div>

        {/* Alerts / Reserve */}
        <button
          onClick={() => onNavigate(10)}
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            currentScreen === 10 ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {hasUnreservedBills && (
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
          )}
          <span className="text-[10px] mt-0.5">Alerts</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate(14)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            currentScreen === 14 ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Profile"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>
    </div>
  );
};
