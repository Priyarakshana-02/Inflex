import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Globe, 
  Mic, 
  Sliders, 
  Trash2, 
  Download, 
  Building2, 
  CheckCircle, 
  Lock, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  RefreshCw,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, LanguageCode, AccountConnection } from '../../types';
import { translations } from '../../data/translations';

interface ScreenProfileSettingsProps {
  profile: UserProfile;
  connections: AccountConnection[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onRevokeConnection: (id: string) => void;
  onOpenConnectModal: () => void;
  onExportData: () => void;
  onClearAllData: () => void;
}

export const ScreenProfileSettings: React.FC<ScreenProfileSettingsProps> = ({
  profile,
  connections,
  onUpdateProfile,
  onRevokeConnection,
  onOpenConnectModal,
  onExportData,
  onClearAllData,
}) => {
  const [name, setName] = useState(profile.name);
  const [occupation, setOccupation] = useState(profile.occupation);
  const [city, setCity] = useState(profile.city);
  const [voiceVoiceGender, setVoiceGender] = useState(profile.voiceVoiceGender);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveBasic = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, occupation, city, voiceVoiceGender });
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Header matching instruction:
          Title: "Profile & Settings"
      */}
      <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Account Preferences & Security
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Profile & Settings
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Consent management, language, and connected account authorizations
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details & Mode Toggle */}
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Personal & Income Persona
          </h3>

          <form onSubmit={handleSaveBasic} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Income Profile Switcher matching instruction:
                "Income profile type: Variable / Gig / Small Business vs Fixed / Salaried"
            */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-semibold">
                Income Profile Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ incomeType: 'VARIABLE' })}
                  className={`p-3 rounded-2xl border text-left transition ${
                    profile.incomeType === 'VARIABLE'
                      ? 'border-purple-500 bg-purple-950/30 text-white glow-purple'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs text-purple-300">Variable / Gig Earner</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Daily tracking, 30% volatility discount, weather & festival predictions.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateProfile({ incomeType: 'FIXED' })}
                  className={`p-3 rounded-2xl border text-left transition ${
                    profile.incomeType === 'FIXED'
                      ? 'border-blue-500 bg-blue-950/30 text-white glow-blue'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs text-blue-300">Fixed / Salaried</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Monthly salary calendar, bonus estimates, post-expense savings evaluation.
                  </div>
                </button>
              </div>
            </div>

            {/* Accessibility & Plain Language Toggles */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Simple Mode</span>
                  <span className="text-[11px] text-slate-400">Everyday financial terms (Money I have, Money I saved)</span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ simpleMode: !profile.simpleMode })}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    profile.simpleMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {profile.simpleMode ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Voice Assistance Speech</span>
                  <span className="text-[11px] text-slate-400">Audio read-out voice gender & responses</span>
                </div>
                <select
                  value={voiceVoiceGender}
                  onChange={(e) => {
                    setVoiceGender(e.target.value as any);
                    onUpdateProfile({ voiceVoiceGender: e.target.value as any });
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1 text-xs text-white"
                >
                  <option value="FEMALE">Female Voice (Natural)</option>
                  <option value="MALE">Male Voice (Natural)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              Save Profile Details
            </button>
          </form>
        </div>

        {/* Connected Accounts & Consent Management */}
        <div className="p-6 rounded-3xl bg-[#0D1527] border border-blue-900/60 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Connected Accounts & Data Sources
            </h3>
            <button
              onClick={onOpenConnectModal}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
            >
              + Link Account
            </button>
          </div>

          <div className="space-y-3">
            {connections.length === 0 ? (
              <p className="text-xs text-slate-500">No external accounts connected yet.</p>
            ) : (
              connections.map((conn) => (
                <div
                  key={conn.id}
                  className="p-3.5 rounded-2xl bg-[#121B32] border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{conn.institutionName}</span>
                      <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/50">
                        {conn.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Mask: {conn.accountMask} • Synced {conn.lastSync} • Expiry: {conn.consentExpiry}
                    </span>
                  </div>

                  <button
                    onClick={() => onRevokeConnection(conn.id)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 rounded bg-rose-950/40 border border-rose-800/40 transition"
                    title="Revoke consent and delete imported tokens"
                  >
                    Revoke Consent
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Data Privacy & Consent Management Section matching instruction */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>Data Privacy & Consent Transparency</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              IncomeFlex operates strictly under RBI Account Aggregator read-only consent guidelines. 
              We never hold user banking passwords, never execute unconfirmed fund transfers, and maintain clear audit logs.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={onExportData}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                Download My Data (JSON)
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-rose-800/50 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0D1424] border border-rose-900/70 rounded-3xl p-6 text-white shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete All Financial Data?</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              This will erase all recorded transactions, savings rules, bill reserves, and connected account tokens. This action is irreversible.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowDeleteConfirm(false);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
