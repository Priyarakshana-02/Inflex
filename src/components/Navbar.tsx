import React from 'react';
import { 
  Sparkles, 
  Mic, 
  Globe, 
  Eye, 
  Briefcase, 
  User, 
  ShieldCheck, 
  Menu, 
  ChevronDown 
} from 'lucide-react';
import { UserProfile, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenVoice: () => void;
  onOpenConnectModal: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
  onToggleSimpleMode: () => void;
  onSwitchProfileDemo: (type: 'VARIABLE' | 'FIXED' | 'CLEAN') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onUpdateProfile,
  onOpenVoice,
  onOpenConnectModal,
  onNavigate,
  currentScreen,
  onToggleSimpleMode,
  onSwitchProfileDemo,
}) => {
  const t = translations[profile.preferredLanguage] || translations.en;

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0F1D]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Tagline */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                INCOMEFLEX
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                profile.incomeType === 'VARIABLE'
                  ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                  : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
              }`}>
                {profile.incomeType === 'VARIABLE' ? 'Variable Income' : 'Fixed Income'}
              </span>
            </div>
            <p className="text-[11px] text-cyan-400/90 font-medium tracking-wide">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Actions Bar */}
        <div className="flex items-center gap-2">
          {/* Quick Switch Demo Persona */}
          <div className="hidden lg:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs">
            <span className="text-slate-500 px-2 text-[10px] font-semibold uppercase">Persona:</span>
            <button
              onClick={() => onSwitchProfileDemo('VARIABLE')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                profile.incomeType === 'VARIABLE' && profile.id !== 'user-clean-00'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ramesh (Gig/Shop)
            </button>
            <button
              onClick={() => onSwitchProfileDemo('FIXED')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                profile.incomeType === 'FIXED'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Priya (Salaried)
            </button>
            <button
              onClick={() => onSwitchProfileDemo('CLEAN')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                profile.id === 'user-clean-00'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Clean User
            </button>
          </div>

          {/* Simple Mode Toggle */}
          <button
            onClick={onToggleSimpleMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              profile.simpleMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Toggle plain language simple view"
          >
            <span className="text-sm">💰</span>
            <span className="hidden sm:inline">
              {profile.simpleMode ? 'Standard View' : 'Simple Mode'}
            </span>
          </button>

          {/* Voice Assistant Trigger */}
          <button
            onClick={onOpenVoice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 font-bold text-xs shadow-md shadow-cyan-500/20 transition hover:scale-105"
            title="Open Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden md:inline">Voice Assistant</span>
          </button>

          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 hover:border-slate-700">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase font-bold">{profile.preferredLanguage}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            <div className="absolute right-0 mt-1 w-36 bg-[#0E1526] border border-slate-800 rounded-xl shadow-xl hidden group-hover:block z-50 p-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => onUpdateProfile({ preferredLanguage: l.code })}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                    profile.preferredLanguage === l.code
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="text-[10px] text-slate-500">{l.native}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Profile / Settings */}
          <button
            onClick={() => onNavigate('profile')}
            className={`p-2 rounded-xl border transition ${
              currentScreen === 'profile'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Profile & Settings"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
