export type IncomeType = 'irregular' | 'fixed';

export type RecordStatus = 'VERIFIED' | 'USER_ENTERED' | 'ESTIMATED' | 'PREDICTED';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'kn';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  language: LanguageCode;
  incomeType: IncomeType;
  voiceEnabled: boolean;
  onboardingStep: number; // 0: auth, 1: language, 2: voice, 3: income profile, 4: completed
  occupation?: string;
  monthlySalary?: number;
  expectedBonusMonth?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeTransaction {
  id: string;
  userId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  source: string; // e.g. "Vegetable sales", "Delivery", "Salary", "Cash"
  category: string;
  note?: string;
  status: RecordStatus;
  sourceLabel: string; // "VERIFIED BANK DATA" | "USER ENTERED" | "CONNECTED BUSINESS DATA"
  createdAt: string;
}

export type ExpenseCategory = 'Household' | 'Food' | 'Transport' | 'Utilities' | 'Health' | 'Education' | 'Debt' | 'Entertainment' | 'Others';

export interface ExpenseTransaction {
  id: string;
  userId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string;
  category: ExpenseCategory;
  note?: string;
  status: RecordStatus;
  sourceLabel: string;
  confirmed: boolean;
  needsConfirmation?: boolean;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentSaved: number;
  ruleType: 'daily_threshold' | 'monthly_surplus';
  thresholdAmount: number; // For irregular: daily income >= threshold; For fixed: monthly surplus >= threshold
  saveAmount: number; // Amount to save when threshold met
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsTransaction {
  id: string;
  userId: string;
  goalId: string;
  amount: number;
  date: string;
  status: 'PENDING_CONFIRMATION' | 'COMPLETED';
  triggeredBy: string; // e.g. "Daily goal reached (₹2,450 >= ₹2,000)"
  createdAt: string;
}

export interface BillItem {
  id: string;
  userId: string;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  category: 'Electricity' | 'Water' | 'Rent' | 'Mobile' | 'School' | 'Insurance' | 'EMI' | 'Other';
  reserved: boolean;
  reservedAt?: string;
  status: 'PENDING' | 'RESERVED' | 'PAID';
  createdAt: string;
}

export interface LoanAssessment {
  requestedAmount: number;
  borrowingCapacity: number;
  recommendedAmount: number;
  feasibilityScore: number; // 0 - 100
  matchRating: string; // "Excellent Match" | "Good Match" | "Moderate Match" | "High Risk"
  monthlyIncomeAvg: number;
  monthlyExpenseAvg: number;
  existingObligations: number;
  repaymentCapacityMonthly: number;
  estimatedEmi: number;
  reasons: {
    positive: string[];
    cautions: string[];
  };
  assuranceMessage: string;
  disclaimer: string;
}

export interface PredictionResult {
  targetDate: string;
  targetPeriod: 'daily' | 'weekly' | 'monthly';
  estimatedMin: number;
  estimatedMax: number;
  confidence: 'High' | 'Medium' | 'Low' | 'Insufficient Data';
  confidenceScore: number; // 0 - 100
  dataPeriodDays: number;
  factors: {
    name: string;
    impactAmount: number; // +₹X or -₹X
    description: string;
    icon: string;
  }[];
  modelInfo: string;
  aiInsight: string;
  hasEnoughData: boolean;
}

export interface BonusPredictionResult {
  festivalName: string;
  festivalDate: string;
  countdownMonths: number;
  estimatedBonusMin: number;
  estimatedBonusMax: number;
  confidence: 'High' | 'Medium' | 'Low' | 'Insufficient Data';
  factors: string[];
  hasEnoughData: boolean;
  explanation: string;
}

export interface FinancialFreedomScore {
  score: number; // 0-100, or -1 if insufficient data
  trend: 'up' | 'stable' | 'down';
  label: string;
  message: string;
  components: {
    incomeStability: number;
    savingsHabit: number;
    debtToIncome: number;
    billCoverage: number;
  };
  hasEnoughData: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}
