import {
  UserProfile,
  IncomeTransaction,
  ExpenseTransaction,
  BillItem,
  SavingsGoal,
  SavingsTransaction,
  FinancialFreedomScore,
  LoanAssessment,
  PredictionResult,
  BonusPredictionResult
} from '../../server/types';

const STORAGE_KEY = 'incomeflex_active_user_id';

export function getStoredUserId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredUserId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {}
}

export function clearStoredUserId() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const userId = getStoredUserId();
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (userId) {
    headers.set('x-user-id', userId);
  }

  const res = await fetch(path, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `HTTP error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  async register(data: { name: string; email: string; incomeType: 'irregular' | 'fixed'; language: string }) {
    const res = await request<{ user: UserProfile; isNew: boolean }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    setStoredUserId(res.user.id);
    return res.user;
  },

  async login(email: string) {
    const res = await request<{ user: UserProfile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    setStoredUserId(res.user.id);
    return res.user;
  },

  async getMe(): Promise<UserProfile | null> {
    try {
      const res = await request<{ user: UserProfile }>('/api/auth/me');
      return res.user;
    } catch {
      return null;
    }
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await request<{ user: UserProfile }>('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    return res.user;
  },

  async syncDemoAccount(incomeType?: 'irregular' | 'fixed') {
    return request<{ success: boolean; message: string }>('/api/auth/sync-demo-account', {
      method: 'POST',
      body: JSON.stringify({ incomeType })
    });
  },

  async clearUserData() {
    return request<{ success: boolean; message: string }>('/api/auth/clear-data', {
      method: 'POST'
    });
  },

  // Dashboard Overview
  async getDashboardOverview() {
    return request<{
      user: UserProfile;
      snapshot: {
        todayIncome: number;
        todayExpenses: number;
        todayNet: number;
        allIncome: number;
        allExpenses: number;
        netBalance: number;
        safeToSpend: number;
        totalReserved: number;
        incomeChangeVsYesterday: number | null;
        last7Days: { date: string; dayName: string; amount: number }[];
        currentWeekTotal: number;
        weeklyChangePercent: number | null;
        hasAnyData: boolean;
      };
      freedomScore: FinancialFreedomScore;
      savingsEvaluation: {
        hasGoal: boolean;
        triggered: boolean;
        eligibleAmount: number;
        message: string;
      };
      activeGoal: SavingsGoal | null;
      totalBillsCount: number;
      unreservedBillsCount: number;
    }>('/api/dashboard/overview');
  },

  // Income
  async getIncome() {
    return request<{ transactions: IncomeTransaction[] }>('/api/transactions/income');
  },

  async addIncome(data: { amount: number; source: string; category?: string; note?: string; date?: string; time?: string }) {
    return request<{ transaction: IncomeTransaction }>('/api/transactions/income', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async deleteIncome(id: string) {
    return request<{ success: boolean }>(`/api/transactions/income/${id}`, {
      method: 'DELETE'
    });
  },

  // Expenses
  async getExpenses() {
    return request<{
      transactions: ExpenseTransaction[];
      total: number;
      categories: { name: string; amount: number; percentage: number }[];
    }>('/api/transactions/expenses');
  },

  async addExpense(data: { amount: number; category: string; note?: string; date?: string }) {
    return request<{ transaction: ExpenseTransaction }>('/api/transactions/expenses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async confirmExpense(id: string, category?: string) {
    return request<{ transaction: ExpenseTransaction }>(`/api/transactions/expenses/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ category })
    });
  },

  // Savings
  async getSavings() {
    return request<{
      goal: SavingsGoal | null;
      history: SavingsTransaction[];
      ruleEvaluation: { hasGoal: boolean; triggered: boolean; eligibleAmount: number; message: string };
      totalSaved: number;
      targetAmount: number;
      progressPercent: number;
      streakDays: number;
    }>('/api/savings');
  },

  async saveGoal(data: { name: string; targetAmount: number; ruleType?: string; thresholdAmount: number; saveAmount: number }) {
    return request<{ goal: SavingsGoal }>('/api/savings/goal', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async executeSaving(amount?: number, triggeredBy?: string) {
    return request<{ transaction: SavingsTransaction; currentSaved: number }>('/api/savings/execute', {
      method: 'POST',
      body: JSON.stringify({ amount, triggeredBy })
    });
  },

  // Loans
  async getLoanAssessment(amount?: number) {
    const q = amount ? `?amount=${amount}` : '';
    return request<{ assessment: LoanAssessment }>(`/api/loans/assessment${q}`);
  },

  // Bills
  async getBills() {
    return request<{
      bills: BillItem[];
      totalReserved: number;
      safeToSpend: number;
      totalDueSoon: number;
    }>('/api/bills');
  },

  async addBill(data: { title: string; amount: number; dueDate: string; category?: string }) {
    return request<{ bill: BillItem }>('/api/bills', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async toggleReserveBill(id: string) {
    return request<{ bill: BillItem }>(`/api/bills/${id}/toggle-reserve`, {
      method: 'POST'
    });
  },

  // Predictions
  async getIncomePrediction() {
    return request<{
      prediction: PredictionResult;
      weather: { temp: number; condition: string; rainMm: number; humidity: number; isFavorableForGig: boolean; lastUpdated: string };
    }>('/api/predictions/income');
  },

  async getBonusPrediction() {
    return request<{
      bonus: BonusPredictionResult;
      festivals: Array<{ id: string; name: string; date: string; relativeMonths: number; financialImpact: string; icon: string }>;
    }>('/api/predictions/bonus');
  },

  // Shock Simulator
  async simulateShock(scenario: string) {
    return request<{
      result: {
        scenarioName: string;
        incomeLoss: number;
        shockExpense: number;
        currentBalance: number;
        postShockAvailable: number;
        totalBillsDue: number;
        netAfterBills: number;
        verdict: 'MANAGEABLE' | 'TIGHT' | 'SHORTFALL RISK';
        summary: string;
      };
    }>('/api/shock-simulator', {
      method: 'POST',
      body: JSON.stringify({ scenario })
    });
  },

  // Insights
  async getInsights() {
    return request<{
      aiGuidance: string;
      freedomScore: FinancialFreedomScore;
      incomeStability: string;
      savingsHabit: string;
    }>('/api/insights');
  },

  // Voice command processing
  async processVoiceCommand(transcript: string, language?: string) {
    return request<{
      result: {
        action: 'ADD_INCOME' | 'ADD_EXPENSE' | 'CHECK_BALANCE' | 'CHECK_BILLS' | 'ASK_QUESTION' | 'UNKNOWN';
        amount?: number;
        category?: string;
        source?: string;
        confirmationText: string;
        spokenReply: string;
      };
    }>('/api/voice/process', {
      method: 'POST',
      body: JSON.stringify({ transcript, language })
    });
  },

  // Speech Output Helper (Browser Web Speech API)
  speakText(text: string, langCode: string = 'en') {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      if (langCode === 'hi') utterance.lang = 'hi-IN';
      else if (langCode === 'ta') utterance.lang = 'ta-IN';
      else if (langCode === 'te') utterance.lang = 'te-IN';
      else if (langCode === 'mr') utterance.lang = 'mr-IN';
      else if (langCode === 'bn') utterance.lang = 'bn-IN';
      else if (langCode === 'kn') utterance.lang = 'kn-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  }
};
