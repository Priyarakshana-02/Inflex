import React, { useState } from 'react';
import { Check, Globe2, ArrowRight } from 'lucide-react';
import { LanguageCode } from '../../../server/types';
import { api } from '../../services/api';

interface ScreenLanguageSelectionProps {
  currentLanguage: LanguageCode;
  onLanguageSelected: (lang: LanguageCode) => void;
}

const LANGUAGES: { code: LanguageCode; name: string; native: string; speech: string }[] = [
  { code: 'en', name: 'English', native: 'English', speech: 'Hello' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी (Hindi)', speech: 'नमस्ते' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ் (Tamil)', speech: 'வணக்கம்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు (Telugu)', speech: 'నమస్కారం' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা (Bengali)', speech: 'নমস্কার' },
  { code: 'mr', name: 'Marathi', native: 'मराठी (Marathi)', speech: 'नमस्कार' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ (Kannada)', speech: 'ನಮಸ್ಕಾರ' }
];

export const ScreenLanguageSelection: React.FC<ScreenLanguageSelectionProps> = ({
  currentLanguage,
  onLanguageSelected
}) => {
  const [selected, setSelected] = useState<LanguageCode>(currentLanguage || 'en');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      await api.updateProfile({ language: selected });
      onLanguageSelected(selected);
    } catch {
      onLanguageSelected(selected);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 pb-28 flex flex-col min-h-[90vh]">
      {/* Title & Subtitle */}
      <div className="text-center pt-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Choose Your Language
        </h1>
        <p className="text-xs sm:text-sm text-cyan-300/90 mt-1">
          Banking made simple in your language
        </p>
      </div>

      {/* Visual Header matching Reference Screen 1: Globe with Floating Speech Bubbles */}
      <div className="relative w-full h-44 flex items-center justify-center mb-6">
        {/* Ambient Glow */}
        <div className="absolute w-40 h-40 rounded-full bg-cyan-500/20 blur-2xl" />
        <div className="absolute w-32 h-32 rounded-full bg-blue-600/30 blur-xl" />

        {/* Globe Circle Graphic */}
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#0E1A38] via-[#122854] to-[#1E3A8A] border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.35)] flex items-center justify-center">
          <Globe2 className="w-16 h-16 text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)] opacity-90" />
        </div>

        {/* Speech Bubble 1: Hindi (नमस्ते) Left */}
        <div className="absolute left-4 top-6 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 text-white text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/50 animate-bounce [animation-duration:3s]">
          नमस्ते
        </div>

        {/* Speech Bubble 2: English (Hello) Right */}
        <div className="absolute right-6 top-8 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-400/50 animate-bounce [animation-duration:3.5s]">
          Hello
        </div>

        {/* Speech Bubble 3: Tamil (வணக்கம்) Bottom Left */}
        <div className="absolute left-8 bottom-3 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-700 to-pink-600 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-purple-400/50 animate-bounce [animation-duration:4s]">
          வணக்கம்
        </div>
      </div>

      {/* Languages List Matching Reference Exactly */}
      <div className="space-y-2.5 flex-1 mb-6">
        {LANGUAGES.map(lang => {
          const isSelected = selected === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelected(lang.code)}
              className={`w-full px-4 py-3.5 rounded-2xl flex items-center justify-between border transition-all text-left ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-950/90 to-[#0F1E42] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] text-white'
                  : 'bg-[#0B1327]/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Globe/Language Icon */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {lang.code.toUpperCase()}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {lang.native}
                  </div>
                </div>
              </div>

              {/* Radio Selection Indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="sticky bottom-20 z-10 pt-2">
        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base tracking-wide shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Saving...' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
