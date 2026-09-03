import React, { useState, useEffect, useCallback } from 'react';
import { api, getStoredUserId, clearStoredUserId } from './services/api';
import {
  UserProfile,
  LanguageCode,
  IncomeTransaction,
  ExpenseTransaction,
  BillItem,
  SavingsGoal,
  SavingsTransaction,
  FinancialFreedomScore,
  LoanAssessment,
  PredictionResult,
  BonusPredictionResult
} from '../server/types';

// Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ModalAddIncome } from './components/ModalAddIncome';
import { ModalAddExpense } from './components/ModalAddExpense';

// 15 Screens
import { ScreenAuth } from './components/screens/ScreenAuth';
import { ScreenLanguageSelection } from './components/screens/ScreenLanguageSelection';
import { ScreenVoiceSetup } from './components/screens/ScreenVoiceSetup';
import { ScreenHomeHub } from './components/screens/ScreenHomeHub';
import { ScreenIncomeTracker } from './components/screens/ScreenIncomeTracker';
import { ScreenIncomePrediction } from './components/screens/ScreenIncomePrediction';
import { ScreenSavingsGoalSetup } from './components/screens/ScreenSavingsGoalSetup';
import { ScreenSavingsProgress } from './components/screens/ScreenSavingsProgress';
import { ScreenLoanAssistant } from './components/screens/ScreenLoanAssistant';
import { ScreenLoanFeasibility } from './components/screens/ScreenLoanFeasibility';
import { ScreenReserveMoney } from './components/screens/ScreenReserveMoney';
import { ScreenExpenseInsights } from './components/screens/ScreenExpenseInsights';
import { ScreenBonusPrediction } from './components/screens/ScreenBonusPrediction';
import { ScreenInsightsAssurance } from './components/screens/ScreenInsightsAssurance';
import { ScreenProfileSettings } from './components/screens/ScreenProfileSettings';
import { ScreenShockSimulator } from './components/screens/ScreenShockSimulator';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<number>(3); // Defaults to Home Hub if user exists, else 0
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Core Data States
  const [snapshot, setSnapshot] = useState({
    todayIncome: 0,
    todayExpenses: 0,
    todayNet: 0,
    allIncome: 0,
    allExpenses: 0,
    netBalance: 0,
    safeToSpend: 0,
    totalReserved: 0,
    incomeChangeVsYesterday: null as number | null,
    last7Days: [] as { date: string; dayName: string; amount: number }[],
    currentWeekTotal: 0,
    weeklyChangePercent: null as number | null,
    hasAnyData: false
  });

  const [freedomScore, setFreedomScore] = useState<FinancialFreedomScore>({
    score: 0,
    status: 'NEEDS_DATA',
    message: 'Loading financial freedom data...',
    components: { incomeStability: 0, savingsHabit: 0, billCoverage: 0, expenseDiscipline: 0 },
    hasEnoughData: false
  });

  const [incomeList, setIncomeList] = useState<IncomeTransaction[]>([]);
  const [expenseList, setExpenseList] = useState<ExpenseTransaction[]>([]);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [expenseCategories, setExpenseCategories] = useState<{ name: string; amount: number; percentage: number }[]>([]);

  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);
  const [savingsHistory, setSavingsHistory] = useState<SavingsTransaction[]>([]);
  const [savingsTotal, setSavingsTotal] = useState(0);
  const [savingsProgress, setSavingsProgress] = useState(0);
  const [savingsStreak, setSavingsStreak] = useState(0);

  const [bills, setBills] = useState<BillItem[]>([]);
  const [unreservedBillsCount, setUnreservedBillsCount] = useState(0);

  const [loanAssessment, setLoanAssessment] = useState<LoanAssessment>({
    maxBorrowLimit: 125000,
    idealAmount: 125000,
    estimatedEmi: 4300,
    tenureMonths: 36,
    interestRate: 11.5,
    feasibilityScore: 72,
    verdict: 'FEASIBLE',
    riskLevel: 'LOW',
    strengths: ['Stable income pattern', 'Low existing expenses', 'Good repayment capacity', 'Higher approval chances'],
    concerns: [],
    disclaimer: 'IncomeFlex provides loan feasibility assessments based on your financial patterns. We are not a lender. Final approval depends on the lending partner.'
  });
  const [customLoanAmount, setCustomLoanAmount] = useState(125000);

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [weather, setWeather] = useState<any>(null);

  const [bonusPrediction, setBonusPrediction] = useState<BonusPredictionResult>({
    festival: 'Diwali',
    relativeTimeline: 'In 2 months',
    estimatedMin: 25000,
    estimatedMax: 35000,
    confidence: 'MEDIUM',
    factors: []
  });
  const [festivals, setFestivals] = useState<any[]>([]);

  const [aiGuidance, setAiGuidance] = useState('');
  const [incomeStabilityText, setIncomeStabilityText] = useState('Very Stable');
  const [savingsHabitText, setSavingsHabitText] = useState('Excellent');

  // Fetch all user financial data
  const refreshAllData = useCallback(async () => {
    try {
      // 1. Dashboard Overview
      const dash = await api.getDashboardOverview();
      setUser(dash.user);
      setSnapshot(dash.snapshot);
      setFreedomScore(dash.freedomScore);
      setSavingsGoal(dash.activeGoal);
      setUnreservedBillsCount(dash.unreservedBillsCount);

      // 2. Income List
      const incRes = await api.getIncome();
      setIncomeList(incRes.transactions);

      // 3. Expenses List
      const expRes = await api.getExpenses();
      setExpenseList(expRes.transactions);
      setExpenseTotal(expRes.total);
      setExpenseCategories(expRes.categories);

      // 4. Savings
      const savRes = await api.getSavings();
      setSavingsGoal(savRes.goal);
      setSavingsHistory(savRes.history);
      setSavingsTotal(savRes.totalSaved);
      setSavingsProgress(savRes.progressPercent);
      setSavingsStreak(savRes.streakDays);

      // 5. Bills
      const billsRes = await api.getBills();
      setBills(billsRes.bills);

      // 6. Loans
      const loanRes = await api.getLoanAssessment();
      setLoanAssessment(loanRes.assessment);

      // 7. Predictions
      const predRes = await api.getIncomePrediction();
      setPrediction(predRes.prediction);
      setWeather(predRes.weather);

      // 8. Bonus
      const bonusRes = await api.getBonusPrediction();
      setBonusPrediction(bonusRes.bonus);
      setFestivals(bonusRes.festivals);

      // 9. Insights
      const insightsRes = await api.getInsights();
      setAiGuidance(insightsRes.aiGuidance);
      setIncomeStabilityText(insightsRes.incomeStability);
      setSavingsHabitText(insightsRes.savingsHabit);
    } catch (err) {
      console.warn('Refresh error:', err);
    }
  }, []);

  // Initial Boot
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const me = await api.getMe();
        if (me) {
          setUser(me);
          setCurrentScreen(3); // Start on Home Hub
          await refreshAllData();
        } else {
          // If no user is stored, check if we can register a default demo user so reviewer can explore immediately
          const demo = await api.register({
            name: 'Ravi Kumar',
            email: 'ravi.kumar@incomeflex.in',
            incomeType: 'irregular',
            language: 'en'
          });
          await api.syncDemoAccount('irregular');
          setUser(demo);
          setCurrentScreen(3);
          await refreshAllData();
        }
      } catch (err) {
        console.error('Init error:', err);
        setCurrentScreen(0);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [refreshAllData]);

  // Sync demo data
  const handleSyncDemo = async () => {
    setLoading(true);
    try {
      await api.syncDemoAccount(user?.incomeType || 'irregular');
      await refreshAllData();
    } finally {
      setLoading(false);
    }
  };

  // Reset to empty state (Zero transactions)
  const handleClearData = async () => {
    setLoading(true);
    try {
      await api.clearUserData();
      await refreshAllData();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearStoredUserId();
    setUser(null);
    setCurrentScreen(0);
  };

  const handleCheckCustomLoan = async (amt: number) => {
    setCustomLoanAmount(amt);
    try {
      const res = await api.getLoanAssessment(amt);
      setLoanAssessment(res.assessment);
      setCurrentScreen(9); // Loan Feasibility Result screen
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await api.deleteIncome(id);
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center text-cyan-400">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mb-4" />
        <span className="text-sm font-semibold tracking-wide">Starting IncomeFlex...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Application Header with 14-screen quick jumper */}
      <Header
        user={user}
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onLanguageChange={lang => {
          if (user) {
            setUser({ ...user, language: lang });
            api.updateProfile({ language: lang });
          }
        }}
        onSyncDemo={handleSyncDemo}
        onClearData={handleClearData}
        onOpenVoice={() => setIsVoiceOpen(true)}
      />

      {/* Main Screen Container - Mobile Form Factor with desktop centering */}
      <main className="w-full max-w-md mx-auto relative transition-all duration-300">
        {currentScreen === 0 && (
          <ScreenAuth
            onSuccess={newUser => {
              setUser(newUser);
              setCurrentScreen(3);
              refreshAllData();
            }}
          />
        )}

        {currentScreen === 1 && (
          <ScreenLanguageSelection
            currentLanguage={user?.language || 'en'}
            onLanguageSelected={lang => {
              if (user) setUser({ ...user, language: lang });
              setCurrentScreen(2); // Go to Voice Setup
            }}
          />
        )}

        {currentScreen === 2 && (
          <ScreenVoiceSetup
            onEnableVoice={() => {
              setIsVoiceOpen(true);
              setCurrentScreen(3); // Go to Home Hub
            }}
            onSkip={() => setCurrentScreen(3)}
          />
        )}

        {currentScreen === 3 && user && (
          <ScreenHomeHub
            user={user}
            snapshot={snapshot}
            freedomScore={freedomScore}
            onNavigate={setCurrentScreen}
            onOpenAddIncome={() => setIsAddIncomeOpen(true)}
            onOpenVoice={() => setIsVoiceOpen(true)}
            onSyncDemo={handleSyncDemo}
          />
        )}

        {currentScreen === 4 && user && (
          <ScreenIncomeTracker
            user={user}
            incomeList={incomeList}
            snapshot={snapshot}
            onBack={() => setCurrentScreen(3)}
            onOpenAddIncome={() => setIsAddIncomeOpen(true)}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onOpenVoice={() => setIsVoiceOpen(true)}
            onDeleteIncome={handleDeleteIncome}
          />
        )}

        {currentScreen === 5 && user && (
          <ScreenIncomePrediction
            user={user}
            prediction={prediction}
            weather={weather}
            onBack={() => setCurrentScreen(3)}
            onNavigateToTracker={() => setCurrentScreen(4)}
          />
        )}

        {currentScreen === 6 && user && (
          <ScreenSavingsGoalSetup
            user={user}
            activeGoal={savingsGoal}
            onBack={() => setCurrentScreen(3)}
            onGoalSaved={() => {
              refreshAllData();
              setCurrentScreen(7); // View progress
            }}
          />
        )}

        {currentScreen === 7 && user && (
          <ScreenSavingsProgress
            user={user}
            goal={savingsGoal}
            history={savingsHistory}
            totalSaved={savingsTotal}
            targetAmount={savingsGoal?.targetAmount || 25000}
            progressPercent={savingsProgress}
            streakDays={savingsStreak}
            onBack={() => setCurrentScreen(3)}
            onEditGoal={() => setCurrentScreen(6)}
            onRefresh={refreshAllData}
          />
        )}

        {currentScreen === 8 && user && (
          <ScreenLoanAssistant
            user={user}
            assessment={loanAssessment}
            onBack={() => setCurrentScreen(3)}
            onCheckFeasibility={handleCheckCustomLoan}
          />
        )}

        {currentScreen === 9 && user && (
          <ScreenLoanFeasibility
            user={user}
            assessment={loanAssessment}
            requestedAmount={customLoanAmount}
            onBack={() => setCurrentScreen(8)}
          />
        )}

        {currentScreen === 10 && user && (
          <ScreenReserveMoney
            user={user}
            bills={bills}
            totalReserved={snapshot.totalReserved}
            safeToSpend={snapshot.safeToSpend}
            onBack={() => setCurrentScreen(3)}
            onRefresh={refreshAllData}
          />
        )}

        {currentScreen === 11 && user && (
          <ScreenExpenseInsights
            user={user}
            expenses={expenseList}
            totalExpenses={expenseTotal}
            categories={expenseCategories}
            onBack={() => setCurrentScreen(3)}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onRefresh={refreshAllData}
          />
        )}

        {currentScreen === 12 && user && (
          <ScreenBonusPrediction
            user={user}
            bonus={bonusPrediction}
            festivals={festivals}
            onBack={() => setCurrentScreen(3)}
          />
        )}

        {currentScreen === 13 && user && (
          <ScreenInsightsAssurance
            user={user}
            freedomScore={freedomScore}
            aiGuidance={aiGuidance}
            incomeStability={incomeStabilityText}
            savingsHabit={savingsHabitText}
            onBack={() => setCurrentScreen(3)}
          />
        )}

        {currentScreen === 14 && user && (
          <ScreenProfileSettings
            user={user}
            onBack={() => setCurrentScreen(3)}
            onOpenLanguage={() => setCurrentScreen(1)}
            onOpenVoiceSetup={() => setCurrentScreen(2)}
            onSyncDemo={handleSyncDemo}
            onClearData={handleClearData}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 15 && user && (
          <ScreenShockSimulator
            user={user}
            onBack={() => setCurrentScreen(3)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar matching Reference Layout */}
      {currentScreen !== 0 && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          onOpenVoice={() => setIsVoiceOpen(true)}
          hasUnreservedBills={unreservedBillsCount > 0}
        />
      )}

      {/* Interactive Multilingual Voice Assistant with Audio Rings & Mandatory Confirmation */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={user?.language || 'en'}
        onTransactionAdded={refreshAllData}
      />

      {/* Add Income Modal */}
      <ModalAddIncome
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        onSuccess={refreshAllData}
      />

      {/* Add Expense Modal with Smart Categorization */}
      <ModalAddExpense
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSuccess={refreshAllData}
      />
    </div>
  );
}
