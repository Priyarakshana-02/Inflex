import React from 'react';
import {
  ArrowLeft,
  User,
  Globe2,
  Mic,
  Bell,
  Lock,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Sparkles,
  Building2,
  Trash2,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, LanguageCode } from '../../../server/types';
import { getTranslation } from '../../i18n/translations';

interface ScreenProfileSettingsProps {
  user: UserProfile;
  onBack: () => void;
  onOpenLanguage: () => void;
  onOpenVoiceSetup: () => void;
  onSyncDemo: () => void;
  onClearData: () => void;
  onLogout: () => void;
}

export const ScreenProfileSettings: React.FC<ScreenProfileSettingsProps> = ({
  user,
  onBack,
  onOpenLanguage,
  onOpenVoiceSetup,
  onSyncDemo,
  onClearData,
  onLogout
}) => {
  const t = getTranslation(user.language);

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
        <h1 className="text-lg font-bold text-white tracking-tight">{t.profileSettings}</h1>
        <div className="w-9" />
      </div>

      {/* User Card matching Reference Screen 14 */}
      <div className="rounded-3xl bg-gradient-to-br from-[#101C3D] via-[#0E162F] to-[#0A1024] border border-cyan-500/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <div className="w-full h-full rounded-[14px] bg-[#070B14] flex items-center justify-center text-cyan-300 font-extrabold text-xl">
              {user.name.charAt(0)}
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-white">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>{t.premiumMember}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Aggregator Status Card */}
      <div className="rounded-2xl bg-[#0B1327] border border-cyan-500/25 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Account Aggregator (RBI Compliant)</div>
            <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Financial Data Connected</span>
            </div>
          </div>
        </div>

        <button
          onClick={onSyncDemo}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold transition-all"
        >
          Sync Data
        </button>
      </div>

      {/* Settings Menu Items matching Reference Screen 14 */}
      <div className="rounded-3xl bg-[#0B1327]/90 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
        {/* Personal Information */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">{t.personalInformation}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Language */}
        <div
          onClick={onOpenLanguage}
          className="p-4 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">{t.language}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-cyan-300 font-medium">
            <span>{user.language.toUpperCase()}</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Voice Assistant */}
        <div
          onClick={onOpenVoiceSetup}
          className="p-4 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">{t.voiceAssistant}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <span>{user.voiceEnabled ? 'Enabled' : 'Disabled'}</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Notifications */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">{t.notifications}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Security & Privacy */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">{t.securityPrivacy}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Help & Support */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">{t.helpSupport}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* About Us */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">{t.aboutUs}</span>
          </div>
          <span className="text-[10px] text-slate-500">v1.0.0</span>
        </div>
      </div>

      {/* Developer Reset / Empty State Testing Tool */}
      <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20">
        <div className="text-xs font-bold text-rose-300 mb-1">Testing & Governance Controls</div>
        <p className="text-[11px] text-slate-400 mb-3">
          Clear all transactions to test zero-data states and honest feedback.
        </p>
        <button
          onClick={onClearData}
          className="w-full py-2 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset to Empty State (Zero Transactions)</span>
        </button>
      </div>

      {/* Log Out matching Reference Screen 14 */}
      <button
        onClick={onLogout}
        className="w-full p-4 rounded-2xl bg-[#0B1327] border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>{t.logOut}</span>
      </button>
    </div>
  );
};
