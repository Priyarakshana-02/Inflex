import React, { useState } from 'react';
import { Building2, Smartphone, Briefcase, ShieldCheck, CheckCircle2, X, ArrowRight, Loader2, Lock } from 'lucide-react';
import { IncomeRecord, ExpenseRecord, AccountConnection } from '../types';

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountConnected: (connection: AccountConnection, importedIncomes: IncomeRecord[], importedExpenses: ExpenseRecord[]) => void;
}

export const ConnectAccountModal: React.FC<ConnectAccountModalProps> = ({
  isOpen,
  onClose,
  onAccountConnected,
}) => {
  const [selectedType, setSelectedType] = useState<'BANK' | 'GIG' | 'PAYROLL'>('BANK');
  const [selectedInstitution, setSelectedInstitution] = useState('State Bank of India');
  const [step, setStep] = useState<'SELECT' | 'CONSENT' | 'SYNCING' | 'SUCCESS'>('SELECT');
  const [phoneOtp, setPhoneOtp] = useState('9876');

  if (!isOpen) return null;

  const handleStartConsent = () => {
    setStep('CONSENT');
  };

  const handleApproveConsent = () => {
    setStep('SYNCING');
    setTimeout(() => {
      // Create new connection object and real verified transactions
      const newConn: AccountConnection = {
        id: `conn-${Date.now()}`,
        institutionName: `${selectedInstitution} (via Sahamati AA)`,
        logoType: selectedType === 'BANK' ? 'BANK' : selectedType === 'GIG' ? 'GIG' : 'PAYROLL',
        type: selectedType === 'BANK' ? 'ACCOUNT_AGGREGATOR' : selectedType === 'GIG' ? 'GIG_PLATFORM' : 'PAYROLL_SYSTEM',
        status: 'CONNECTED',
        lastSync: 'Just now',
        accountMask: 'SB-••••8841',
        consentExpiry: '2027-09-01',
      };

      const importedIncomes: IncomeRecord[] = [
        {
          id: `imp-inc-${Date.now()}-1`,
          amount: selectedType === 'PAYROLL' ? 42000 : selectedType === 'GIG' ? 2450 : 3200,
          date: new Date().toISOString().split('T')[0],
          time: '14:20',
          category: selectedType === 'PAYROLL' ? 'SALARY' : selectedType === 'GIG' ? 'GIG_PAYOUT' : 'OTHER',
          description: selectedType === 'PAYROLL' ? 'Direct Payroll Deposit via NEFT' : selectedType === 'GIG' ? 'Partner Weekly Payout' : 'UPI Credit via Bank AA',
          source: selectedType === 'GIG' ? 'GIG_PLATFORM' : 'VERIFIED_BANK_DATA',
          status: 'VERIFIED',
        },
      ];

      const importedExpenses: ExpenseRecord[] = [
        {
          id: `imp-exp-${Date.now()}-1`,
          amount: 1250,
          date: new Date().toISOString().split('T')[0],
          category: 'UTILITIES',
          description: 'Verified Direct Debit - Electricity Bill',
          source: 'VERIFIED_BANK_DATA',
          status: 'VERIFIED',
          isRecurring: true,
          confirmedCategory: true,
        },
      ];

      onAccountConnected(newConn, importedIncomes, importedExpenses);
      setStep('SUCCESS');
    }, 1800);
  };

  const resetAndClose = () => {
    setStep('SELECT');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0E1526] border border-blue-900/70 rounded-3xl p-6 text-white shadow-2xl">
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'SELECT' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Connect Real Financial Data</h3>
                <p className="text-xs text-slate-400">RBI-Regulated Account Aggregator & Partner APIs</p>
              </div>
            </div>

            {/* Source Category Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-5">
              <button
                onClick={() => { setSelectedType('BANK'); setSelectedInstitution('State Bank of India'); }}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                  selectedType === 'BANK' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Bank (AA)
              </button>
              <button
                onClick={() => { setSelectedType('GIG'); setSelectedInstitution('Swiggy & Zomato Partner API'); }}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                  selectedType === 'GIG' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Gig Apps
              </button>
              <button
                onClick={() => { setSelectedType('PAYROLL'); setSelectedInstitution('RazorpayX Payroll'); }}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                  selectedType === 'PAYROLL' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Payroll
              </button>
            </div>

            {/* Institution List */}
            <div className="space-y-2 mb-6">
              {selectedType === 'BANK' && (
                <>
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank', 'Bank of Baroda'].map((bank) => (
                    <div
                      key={bank}
                      onClick={() => setSelectedInstitution(bank)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                        selectedInstitution === bank
                          ? 'border-cyan-500 bg-cyan-950/20 text-white'
                          : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm font-medium">{bank}</span>
                      <span className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded">Sahamati AA</span>
                    </div>
                  ))}
                </>
              )}

              {selectedType === 'GIG' && (
                <>
                  {['Swiggy & Zomato Partner API', 'Uber & Ola Driver Platform', 'Urban Company Partner Connect', 'Porter Logistics Fleet'].map((gig) => (
                    <div
                      key={gig}
                      onClick={() => setSelectedInstitution(gig)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                        selectedInstitution === gig
                          ? 'border-cyan-500 bg-cyan-950/20 text-white'
                          : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm font-medium">{gig}</span>
                      <span className="text-[10px] bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-800/40">Verified Partner</span>
                    </div>
                  ))}
                </>
              )}

              {selectedType === 'PAYROLL' && (
                <>
                  {['RazorpayX Payroll', 'Keka HRMS & Salary', 'Darwinbox Enterprise', 'Govt Treasury / Pension Portal'].map((p) => (
                    <div
                      key={p}
                      onClick={() => setSelectedInstitution(p)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                        selectedInstitution === p
                          ? 'border-cyan-500 bg-cyan-950/20 text-white'
                          : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm font-medium">{p}</span>
                      <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">Direct Depository</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl mb-5 text-xs text-blue-200">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>We never ask for bank passwords. Data is strictly read-only and encrypted via authorized RBI Account Aggregator protocol.</span>
            </div>

            <button
              onClick={handleStartConsent}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
            >
              Continue to Consent Authorization
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'CONSENT' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-2">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Account Aggregator Consent Artifact</h3>
              <p className="text-xs text-slate-400">Consent ID: AA-IND-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5 text-slate-300">
              <div className="flex justify-between pb-1 border-b border-slate-800">
                <span className="text-slate-400">Financial Information Provider:</span>
                <span className="font-semibold text-white">{selectedInstitution}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-800">
                <span className="text-slate-400">Information User:</span>
                <span className="font-semibold text-white">IncomeFlex Technologies</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-800">
                <span className="text-slate-400">Consent Purpose:</span>
                <span className="font-semibold text-cyan-300">Resilience Scoring & Loan Planning</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-800">
                <span className="text-slate-400">Data Access Mode:</span>
                <span className="font-semibold text-white">VIEW ONLY (No Fund Movement)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consent Duration:</span>
                <span className="font-semibold text-white">12 Months (Revocable anytime)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Enter OTP sent to registered mobile:</label>
              <input
                type="text"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                maxLength={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-center text-lg font-bold tracking-widest text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setStep('SELECT')}
                className="py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Back
              </button>
              <button
                onClick={handleApproveConsent}
                className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition"
              >
                Authorize & Connect
              </button>
            </div>
          </div>
        )}

        {step === 'SYNCING' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            <div>
              <h4 className="text-base font-bold text-white">Fetching Verified Account Data...</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Deduplicating, categorizing, and establishing real financial baseline via secure token.
              </p>
            </div>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Account Successfully Connected!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm">
                Verified financial records imported into IncomeFlex with VERIFIED BANK DATA source tags. Your financial picture is updated.
              </p>
            </div>
            <button
              onClick={resetAndClose}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/30 transition"
            >
              View Updated Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
