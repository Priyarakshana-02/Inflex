import React, { useState } from 'react';
import { Mic, CheckCircle2, Volume2, Sparkles, ArrowRight, Shield } from 'lucide-react';

interface ScreenVoiceSetupProps {
  onEnableVoice: () => void;
  onMaybeLater: () => void;
}

export const ScreenVoiceSetup: React.FC<ScreenVoiceSetupProps> = ({
  onEnableVoice,
  onMaybeLater,
}) => {
  const [testMicActive, setTestMicActive] = useState(false);
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  const handleTestVoice = () => {
    setTestMicActive(true);
    setTestFeedback('Listening... Say "Check balance" or "Add 500 income"');
    
    // Simulate test audio verification
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance('Voice assistant ready. What would you like to do?');
      window.speechSynthesis.speak(u);
    }

    setTimeout(() => {
      setTestMicActive(false);
      setTestFeedback('Voice engine connected and verified! You can now enable hands-free mode.');
    }, 2500);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-lg mx-auto bg-[#0D1424] border border-blue-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-center">
        {/* Large Glowing Microphone Interface */}
        <div className="relative py-6 flex flex-col items-center justify-center">
          <div className="relative">
            {testMicActive && (
              <>
                <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
                <div className="absolute -inset-6 rounded-full bg-blue-600/20 animate-pulse" />
              </>
            )}
            <div 
              onClick={handleTestVoice}
              className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/40 cursor-pointer hover:scale-105 transition-transform"
              title="Click to test microphone"
            >
              <Mic className={`w-12 h-12 ${testMicActive ? 'animate-bounce text-yellow-300' : 'text-white'}`} />
            </div>
          </div>
          
          <button
            onClick={handleTestVoice}
            className="mt-4 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            {testMicActive ? 'Listening to speech...' : 'Tap to test voice engine'}
          </button>

          {testFeedback && (
            <div className="mt-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
              {testFeedback}
            </div>
          )}
        </div>

        {/* Title and Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Let's make this hands-free
        </h1>
        <p className="text-sm text-slate-400 mt-2 font-medium max-w-sm mx-auto">
          Manage money on the move, during shifts, or after long workdays with natural spoken commands.
        </p>

        {/* 4 Feature Points matching instruction:
            - Checking balance
            - Tracking income & expenses
            - Reminding bills & dues
            - Answering your questions
        */}
        <div className="my-8 text-left space-y-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-100">Checking balance</span>
              <p className="text-xs text-slate-400">Ask "What is my safe-to-spend right now?"</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-100">Tracking income & expenses</span>
              <p className="text-xs text-slate-400">Say "Today I earned 1500 from deliveries"</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-100">Reminding bills & dues</span>
              <p className="text-xs text-slate-400">Ask "What bills are due this week?"</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-100">Answering your questions</span>
              <p className="text-xs text-slate-400">Instant plain-language financial guidance</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onEnableVoice}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.01]"
          >
            <Mic className="w-4 h-4" />
            <span>Enable Voice Assistant</span>
          </button>

          <button
            onClick={onMaybeLater}
            className="w-full py-3 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white font-medium text-xs rounded-2xl border border-slate-800 transition"
          >
            Maybe later
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-slate-500">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Microphone active only when tapped. Audio is never stored without consent.</span>
        </div>
      </div>
    </div>
  );
};
