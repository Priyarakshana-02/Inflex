import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  IncomeRecord, 
  ExpenseRecord, 
  BillItem, 
  SavingsGoal, 
  SavingsEvent, 
  AccountConnection, 
  VoiceParsedIntent,
  LanguageCode 
} from './types';
import { 
  sampleVariableProfile, 
  sampleFixedProfile, 
  emptyUserProfile,
  initialVariableIncomes,
  initialFixedIncomes,
  initialVariableExpenses,
  initialFixedExpenses,
  initialBills,
  initialSavingsGoal,
  initialSavingsEvents,
  initialConnections
} from './data/initialData';
import { calculateFinancialSnapshot, LoanItem } from './services/financialEngine';
import { Navbar } from './components/Navbar';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ConnectAccountModal } from './components/ConnectAccountModal';

// Screens
import { ScreenLanguage } from './components/screens/ScreenLanguage';
import { ScreenVoiceSetup } from './components/screens/ScreenVoiceSetup';
import { ScreenHome } from './components/screens/ScreenHome';
import { ScreenIncomeTracker } from './components/screens/ScreenIncomeTracker';
import { ScreenIncomePrediction } from './components/screens/ScreenIncomePrediction';
import { ScreenSavingsGoal } from './components/screens/ScreenSavingsGoal';
import { ScreenSavingsProgress } from './components/screens/ScreenSavingsProgress';
import { ScreenLoanPlanner } from './components/screens/ScreenLoanPlanner';
import { ScreenLoanFeasibility } from './components/screens/ScreenLoanFeasibility';
import { ScreenReserveMoney } from './components/screens/ScreenReserveMoney';
import { ScreenExpenseInsights } from './components/screens/ScreenExpenseInsights';
import { ScreenBonusPrediction } from './components/screens/ScreenBonusPrediction';
import { ScreenInsights } from './components/screens/ScreenInsights';
import { ScreenProfileSettings } from './components/screens/ScreenProfileSettings';
import { ScreenShockSimulator } from './components/screens/ScreenShockSimulator';

export default function App() {
  // Load state from localStorage or initialize with variable earner persona
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('incomeflex_profile');
    return saved ? JSON.parse(saved) : { ...sampleVariableProfile, city: 'Mumbai', voiceVoiceGender: 'FEMALE' };
  });

  const [incomes, setIncomes] = useState<IncomeRecord[]>(() => {
    const saved = localStorage.getItem('incomeflex_incomes');
    return saved ? JSON.parse(saved) : initialVariableIncomes;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('incomeflex_expenses');
    return saved ? JSON.parse(saved) : initialVariableExpenses;
  });

  const [bills, setBills] = useState<BillItem[]>(() => {
    const saved = localStorage.getItem('incomeflex_bills');
    return saved ? JSON.parse(saved) : initialBills;
  });

  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal>(() => {
    const saved = localStorage.getItem('incomeflex_savings_goal');
    return saved ? JSON.parse(saved) : initialSavingsGoal;
  });

  const [savingsEvents, setSavingsEvents] = useState<SavingsEvent[]>(() => {
    const saved = localStorage.getItem('incomeflex_savings_events');
    return saved ? JSON.parse(saved) : initialSavingsEvents;
  });

  const [connections, setConnections] = useState<AccountConnection[]>(() => {
    const saved = localStorage.getItem('incomeflex_connections');
    return saved ? JSON.parse(saved) : initialConnections;
  });

  const [loans, setLoans] = useState<LoanItem[]>([
    {
      id: 'loan-01',
      name: 'Two-Wheeler Loan',
      lender: 'Bajaj Finance',
      totalBorrowed: 65000,
      outstandingPrincipal: 28500,
      emiAmount: 2850,
      remainingTenureMonths: 10,
    },
  ]);

  // Current active screen navigation
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('incomeflex_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('incomeflex_incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('incomeflex_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('incomeflex_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('incomeflex_savings_goal', JSON.stringify(savingsGoal));
  }, [savingsGoal]);

  // Switch demo personas seamlessly
  const handleSwitchProfileDemo = (type: 'VARIABLE' | 'FIXED' | 'CLEAN') => {
    if (type === 'VARIABLE') {
      setProfile({ ...sampleVariableProfile, city: 'Mumbai', voiceVoiceGender: 'FEMALE' });
      setIncomes(initialVariableIncomes);
      setExpenses(initialVariableExpenses);
      setBills(initialBills);
      setSavingsGoal(initialSavingsGoal);
      setSavingsEvents(initialSavingsEvents);
      setConnections(initialConnections);
    } else if (type === 'FIXED') {
      setProfile({ ...sampleFixedProfile, city: 'Bengaluru', voiceVoiceGender: 'FEMALE' });
      setIncomes(initialFixedIncomes);
      setExpenses(initialFixedExpenses);
      setBills([
        {
          id: 'bill-fix-01',
          name: 'Flat House Rent',
          category: 'RENT',
          amount: 14000,
          dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          isReserved: true,
          reservedAmount: 14000,
          isPaid: false,
          source: 'VERIFIED_BANK_DATA',
          isRecurring: true,
        },
        {
          id: 'bill-fix-02',
          name: 'Broadband & Mobile Postpaid',
          category: 'INTERNET',
          amount: 1899,
          dueDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
          isReserved: true,
          reservedAmount: 1899,
          isPaid: false,
          source: 'CONNECTED_BILLER',
          isRecurring: true,
        },
      ]);
      setSavingsGoal({
        ...initialSavingsGoal,
        goalName: 'Annual Holiday & Tax Saver',
        targetAmount: 50000,
        currentSaved: 18500,
        monthlyThreshold: 6000,
        monthlySavingsAmount: 4000,
        frequency: 'MONTHLY',
      });
      setSavingsEvents([
        {
          id: 'se-fix-01',
          goalId: 'goal-fix-01',
          date: '2026-08-01',
          amount: 4000,
          actualIncome: 38500,
          threshold: 6000,
          conditionMet: true,
          note: 'August salary surplus credited to emergency buffer.',
        },
      ]);
      setConnections([
        {
          id: 'conn-fix-01',
          institutionName: 'HDFC Bank (via Sahamati AA)',
          logoType: 'BANK',
          type: 'ACCOUNT_AGGREGATOR',
          status: 'CONNECTED',
          lastSync: '5 mins ago',
          accountMask: 'SB-••••7104',
          consentExpiry: '2027-08-01',
        },
        {
          id: 'conn-fix-02',
          institutionName: 'RazorpayX Payroll Gateway',
          logoType: 'PAYROLL',
          type: 'PAYROLL_SYSTEM',
          status: 'CONNECTED',
          lastSync: '2 hours ago',
          accountMask: 'Emp ID: TC-8419',
          consentExpiry: '2027-01-01',
        },
      ]);
    } else {
      // CLEAN: New User with no records
      setProfile({ ...emptyUserProfile, city: 'Delhi', voiceVoiceGender: 'FEMALE' });
      setIncomes([]);
      setExpenses([]);
      setBills([]);
      setSavingsGoal({
        id: 'goal-clean-01',
        goalName: 'My First Buffer',
        targetAmount: 10000,
        currentSaved: 0,
        dailyGoalThreshold: 1500,
        dailySavingsAmount: 200,
        monthlyThreshold: 4000,
        monthlySavingsAmount: 1500,
        frequency: 'DAILY',
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
      });
      setSavingsEvents([]);
      setConnections([]);
    }
    setCurrentScreen('home');
  };

  // Compute live mathematical snapshot
  const snapshot = calculateFinancialSnapshot(profile, incomes, expenses, bills, loans);

  // Profile update handler
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated, lastDataUpdate: 'Just now' }));
  };

  // Add Income
  const handleAddIncome = (record: Omit<IncomeRecord, 'id'>) => {
    const newRecord: IncomeRecord = {
      ...record,
      id: `inc-${Date.now()}`,
    };
    setIncomes(prev => [newRecord, ...prev]);

    // Check savings condition trigger
    if (profile.incomeType === 'VARIABLE' && savingsGoal.dailyGoalThreshold) {
      if (newRecord.amount >= savingsGoal.dailyGoalThreshold) {
        const saveAmt = savingsGoal.dailySavingsAmount || 300;
        setSavingsGoal(prev => ({
          ...prev,
          currentSaved: prev.currentSaved + saveAmt,
          streakDays: (prev.streakDays || 0) + 1,
        }));
        setSavingsEvents(prev => [
          {
            id: `se-${Date.now()}`,
            goalId: savingsGoal.id,
            date: newRecord.date,
            amount: saveAmt,
            actualIncome: newRecord.amount,
            threshold: savingsGoal.dailyGoalThreshold!,
            conditionMet: true,
            note: `Daily goal of ₹${savingsGoal.dailyGoalThreshold} reached! Auto-transferred ₹${saveAmt}.`,
          },
          ...prev,
        ]);
      }
    }
  };

  // Add Expense
  const handleAddExpense = (record: Omit<ExpenseRecord, 'id'>) => {
    const newRecord: ExpenseRecord = {
      ...record,
      id: `exp-${Date.now()}`,
    };
    setExpenses(prev => [newRecord, ...prev]);
  };

  // Add Bill
  const handleAddBill = (bill: Omit<BillItem, 'id'>) => {
    const newBill: BillItem = {
      ...bill,
      id: `bill-${Date.now()}`,
      reservedAmount: bill.isReserved ? bill.amount : 0,
      isPaid: false,
    };
    setBills(prev => [...prev, newBill]);
  };

  // Toggle Bill Reserve Status
  const handleToggleReserve = (billId: string) => {
    setBills(prev => prev.map(b => {
      if (b.id === billId) {
        const nextReserved = !b.isReserved;
        return {
          ...b,
          isReserved: nextReserved,
          reservedAmount: nextReserved ? b.amount : 0,
        };
      }
      return b;
    }));
  };

  // Handle Voice Parsed Intent from Modal
  const handleVoiceIntent = (intent: VoiceParsedIntent) => {
    if (intent.action === 'ADD_INCOME' && intent.amount) {
      handleAddIncome({
        amount: intent.amount,
        date: intent.date || new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        category: (intent.category as any) || 'DAILY_WAGE',
        description: intent.description || 'Voice logged income credit',
        source: 'USER_ENTERED',
        status: 'USER_ENTERED',
      });
    } else if (intent.action === 'ADD_EXPENSE' && intent.amount) {
      handleAddExpense({
        amount: intent.amount,
        date: intent.date || new Date().toISOString().split('T')[0],
        category: (intent.category as any) || 'FOOD_GROCERIES',
        description: intent.description || 'Voice logged expense debit',
        source: 'USER_ENTERED',
        status: 'USER_ENTERED',
        isRecurring: false,
        confirmedCategory: true,
      });
    } else if (intent.action === 'CHECK_BALANCE') {
      setCurrentScreen('home');
    } else if (intent.action === 'CHECK_BILLS') {
      setCurrentScreen('reserve-money');
    }
  };

  // Account Connected Handler
  const handleAccountConnected = (
    connection: AccountConnection, 
    importedIncomes: IncomeRecord[], 
    importedExpenses: ExpenseRecord[]
  ) => {
    setConnections(prev => [connection, ...prev]);
    if (importedIncomes.length > 0) {
      setIncomes(prev => [...importedIncomes, ...prev]);
    }
    if (importedExpenses.length > 0) {
      setExpenses(prev => [...importedExpenses, ...prev]);
    }
    setProfile(prev => ({
      ...prev,
      connectedAccountsCount: prev.connectedAccountsCount + 1,
      lastDataUpdate: 'Just now',
    }));
  };

  // Revoke account connection
  const handleRevokeConnection = (connId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connId));
  };

  // Export Data as JSON
  const handleExportData = () => {
    const bundle = {
      profile,
      incomes,
      expenses,
      bills,
      savingsGoal,
      savingsEvents,
      connections,
      exportTimestamp: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `IncomeFlex_Data_${profile.id}.json`);
    dlAnchor.click();
  };

  // Clear all data
  const handleClearAllData = () => {
    localStorage.clear();
    handleSwitchProfileDemo('CLEAN');
  };

  // Confirm Expense Category
  const handleConfirmExpenseCategory = (expenseId: string, isConfirmed: boolean, newCategory?: string) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === expenseId) {
        return {
          ...e,
          confirmedCategory: isConfirmed,
          category: (newCategory as any) || e.category,
        };
      }
      return e;
    }));
  };

  // Manual Trigger Extra Savings
  const handleTriggerSave = (amount: number, reason: string) => {
    setSavingsGoal(prev => ({
      ...prev,
      currentSaved: prev.currentSaved + amount,
    }));
    setSavingsEvents(prev => [
      {
        id: `se-${Date.now()}`,
        goalId: savingsGoal.id,
        date: new Date().toISOString().split('T')[0],
        amount,
        actualIncome: 0,
        threshold: 0,
        conditionMet: true,
        note: reason,
      },
      ...prev,
    ]);
  };

  return (
    <div className={`min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 ${profile.highContrast ? 'contrast-125' : ''}`}>
      {/* Top Main Navbar */}
      <Navbar
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenConnectModal={() => setIsConnectOpen(true)}
        onNavigate={setCurrentScreen}
        currentScreen={currentScreen}
        onToggleSimpleMode={() => setProfile(p => ({ ...p, simpleMode: !p.simpleMode }))}
        onSwitchProfileDemo={handleSwitchProfileDemo}
      />

      {/* Main Screen Content Frame */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
        {/* Screen 1: Choose Your Language */}
        {currentScreen === 'language' && (
          <ScreenLanguage
            selectedLanguage={profile.preferredLanguage}
            onSelectLanguage={(lang: LanguageCode) => handleUpdateProfile({ preferredLanguage: lang })}
            onContinue={() => setCurrentScreen('voice-setup')}
          />
        )}

        {/* Screen 2: Voice Setup */}
        {currentScreen === 'voice-setup' && (
          <ScreenVoiceSetup
            onEnableVoice={() => {
              handleUpdateProfile({ voiceEnabled: true });
              setIsVoiceOpen(true);
              setCurrentScreen('home');
            }}
            onMaybeLater={() => setCurrentScreen('home')}
          />
        )}

        {/* Screen 3: Home / Overview */}
        {currentScreen === 'home' && (
          <ScreenHome
            profile={profile}
            snapshot={snapshot}
            incomes={incomes}
            expenses={expenses}
            bills={bills}
            savingsGoal={savingsGoal}
            onNavigate={setCurrentScreen}
            onOpenAddIncome={() => setCurrentScreen('income-tracker')}
            onOpenConnectModal={() => setIsConnectOpen(true)}
          />
        )}

        {/* Screen 4: Track Income */}
        {currentScreen === 'income-tracker' && (
          <ScreenIncomeTracker
            profile={profile}
            incomes={incomes}
            expenses={expenses}
            onAddIncome={handleAddIncome}
            onAddExpense={handleAddExpense}
            onOpenVoice={() => setIsVoiceOpen(true)}
          />
        )}

        {/* Screen 5: Income Prediction */}
        {currentScreen === 'income-prediction' && (
          <ScreenIncomePrediction
            profile={profile}
            incomes={incomes}
          />
        )}

        {/* Screen 6: Set Your Savings Goal */}
        {currentScreen === 'savings-goal' && (
          <ScreenSavingsGoal
            profile={profile}
            savingsGoal={savingsGoal}
            incomes={incomes}
            onUpdateSavingsGoal={(upd) => setSavingsGoal(prev => ({ ...prev, ...upd }))}
            onNavigate={setCurrentScreen}
          />
        )}

        {/* Screen 7: Your Savings Progress */}
        {currentScreen === 'savings-progress' && (
          <ScreenSavingsProgress
            profile={profile}
            savingsGoal={savingsGoal}
            savingsEvents={savingsEvents}
            onTriggerSave={handleTriggerSave}
            onNavigate={setCurrentScreen}
          />
        )}

        {/* Screen 8: Safe Loan Planner */}
        {currentScreen === 'loan-planner' && (
          <ScreenLoanPlanner
            profile={profile}
            incomes={incomes}
            expenses={expenses}
            bills={bills}
            loans={loans}
            onNavigate={setCurrentScreen}
          />
        )}

        {/* Screen 9: Loan Feasibility */}
        {currentScreen === 'loan-feasibility' && (
          <ScreenLoanFeasibility
            profile={profile}
            incomes={incomes}
            expenses={expenses}
            bills={bills}
            loans={loans}
            onNavigate={setCurrentScreen}
          />
        )}

        {/* Screen 10: Reserve Money */}
        {currentScreen === 'reserve-money' && (
          <ScreenReserveMoney
            profile={profile}
            bills={bills}
            availableMoney={snapshot.availableMoney}
            onToggleReserve={handleToggleReserve}
            onAddBill={handleAddBill}
          />
        )}

        {/* Screen 11: Expense Insights */}
        {currentScreen === 'expense-insights' && (
          <ScreenExpenseInsights
            profile={profile}
            expenses={expenses}
            onConfirmExpenseCategory={handleConfirmExpenseCategory}
          />
        )}

        {/* Screen 12: Bonus & Festival Prediction */}
        {currentScreen === 'bonus-prediction' && (
          <ScreenBonusPrediction
            profile={profile}
            incomes={incomes}
          />
        )}

        {/* Screen 13: Your Insights */}
        {currentScreen === 'insights' && (
          <ScreenInsights
            profile={profile}
            snapshot={snapshot}
            incomes={incomes}
            expenses={expenses}
            bills={bills}
          />
        )}

        {/* Screen 14: Profile & Settings */}
        {currentScreen === 'profile' && (
          <ScreenProfileSettings
            profile={profile}
            connections={connections}
            onUpdateProfile={handleUpdateProfile}
            onRevokeConnection={handleRevokeConnection}
            onOpenConnectModal={() => setIsConnectOpen(true)}
            onExportData={handleExportData}
            onClearAllData={handleClearAllData}
          />
        )}

        {/* Financial Shock Simulator */}
        {currentScreen === 'shock-simulator' && (
          <ScreenShockSimulator
            profile={profile}
            incomes={incomes}
            expenses={expenses}
            bills={bills}
            availableMoney={snapshot.availableMoney}
          />
        )}
      </main>

      {/* Floating Bottom Quick Bar for Fast Access */}
      <nav className="fixed bottom-3 inset-x-0 z-40 max-w-lg mx-auto px-4 pointer-events-none">
        <div className="bg-[#0C1222]/95 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-2 flex items-center justify-around shadow-2xl glow-cyan pointer-events-auto">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'income-tracker', label: 'Income', icon: '💵' },
            { id: 'reserve-money', label: 'Reserves', icon: '🔒' },
            { id: 'loan-planner', label: 'Loan Plan', icon: '🛡️' },
            { id: 'insights', label: 'Insights', icon: '✨' },
            { id: 'shock-simulator', label: 'Shock Sim', icon: '⚡' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
                currentScreen === item.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onConfirmAction={handleVoiceIntent}
        incomeType={profile.incomeType}
      />

      <ConnectAccountModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        onAccountConnected={handleAccountConnected}
      />
    </div>
  );
}
