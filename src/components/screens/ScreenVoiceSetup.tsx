import React, { useState } from 'react';
import { Mic, CreditCard, TrendingUp, Bell, MessageSquare, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

interface ScreenVoiceSetupProps {
  onEnableVoice: () => void;
  onSkip: () => void;
}

export const ScreenVoiceSetup: React.FC<ScreenVoiceSetupProps> = ({
  onEnableVoice,
  onSkip
}) => {
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    try {
      await api.updateProfile({ voiceEnabled: true });
      onEnableVoice();
    } catch {
      onEnableVoice();
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      await api.updateProfile({ voiceEnabled: false });
    } catch {}
    onSkip();
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 pb-28 flex flex-col min-h-[90vh]">
      {/* Title */}
      <div className="text-center pt-2 mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Let's make it hands-free!
        </h1>
        <p className="text-xs sm:text-sm text-cyan-300/90 mt-1 font-medium">
          I can help you with
        </p>
      </div>

      {/* Feature List matching Reference Screen 2 */}
      <div className="space-y-2.5 mb-6">
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0C152B]/80 border border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Checking balance</span>
        </div>

        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0C152B]/80 border border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Tracking income & expenses</span>
        </div>

        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0C152B]/80 border border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Reminding bills & dues</span>
        </div>

        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0C152B]/80 border border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Answering your questions</span>
        </div>
      </div>

      {/* Center Large Glowing Microphone with concentric soundwave rings */}
      <div className="relative w-full my-6 flex flex-col items-center justify-center flex-1">
        {/* Outer Glows */}
        <div className="absolute w-52 h-52 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20 animate-pulse" />
        <div className="absolute w-36 h-36 rounded-full border border-blue-500/30" />

        {/* Big Mic Button */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-[0_0_35px_rgba(6,182,212,0.5)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#091122]/40 flex items-center justify-center">
            <Mic className="w-11 h-11 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
          </div>
        </div>

        {/* Text Prompt */}
        <p className="text-xs text-slate-400 mt-5 font-medium tracking-wide">
          Tap to speak or type your commands
        </p>
      </div>

      {/* Buttons matching Reference */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleEnable}
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base tracking-wide shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Activating...' : 'Enable Voice Assistant'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full py-3 text-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};
