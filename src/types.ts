export type IncomeType = 'VARIABLE' | 'FIXED';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn' | 'kn';

export type RecordSource = 
  | 'VERIFIED_BANK_DATA'
  | 'USER_ENTERED'
  | 'CONNECTED_BUSINESS_DATA'
  | 'GIG_PLATFORM'
  | 'CONNECTED_BILLER';

export interface LoanItem {
  id: string;
  name: string;
  lender: string;
  totalBorrowed: number;
  outstandingPrincipal: number;
  emiAmount: number;
  remainingTenureMonths: number;
}

export type RecordStatus = 'VERIFIED' | 'USER_ENTERED' | 'ESTIMATED' | 'PREDICTED';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  incomeType: IncomeType;
  occupation: string;
  currency: string;
  preferredLanguage: LanguageCode;
  voiceEnabled: boolean;
  simpleMode: boolean;
  highContrast: boolean;
  connectedAccountsCount: number;
  lastDataUpdate: string;
  hasSeenOnboarding: boolean;
  initialBalance: number;
  city?: string;
  voiceVoiceGender?: 'FEMALE' | 'MALE';
  emergencyFundBalance?: number;
}

export interface IncomeRecord {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD
  time?: string;
  category: 'DAILY_WAGE' | 'GIG_PAYOUT' | 'SHOP_SALES' | 'SALARY' | 'BONUS' | 'BENEFIT' | 'OTHER';
  description: string;
  source: RecordSource;
  status: RecordStatus;
  notes?: string;
}

export interface ExpenseRecord {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: 'RENT' | 'FOOD_GROCERIES' | 'UTILITIES' | 'TRANSPORT' | 'HEALTH' | 'LOAN_EMI' | 'BUSINESS_SUPPLIES' | 'EDUCATION' | 'OTHER';
  description: string;
  source: RecordSource;
  status: RecordStatus;
  isRecurring: boolean;
  confirmedCategory: boolean;
  needsConfirmation?: boolean;
}

export interface SavingsGoal {
  id: string;
  goalName: string;
  targetAmount: number;
  currentSaved: number;
  // For variable income: daily trigger condition
  dailyGoalThreshold?: number;
  dailySavingsAmount?: number;
  // For fixed income: monthly trigger condition
  monthlyThreshold?: number;
  monthlySavingsAmount?: number;
  frequency: 'DAILY' | 'MONTHLY';
  active: boolean;
  createdAt: string;
}

export interface SavingsEvent {
  id: string;
  goalId: string;
  date: string;
  amount: number;
  actualIncome: number;
  threshold: number;
  conditionMet: boolean;
  note: string;
}

export interface BillItem {
  id: string;
  name: string;
  category: 'ELECTRICITY' | 'MOBILE' | 'RENT' | 'LOAN_EMI' | 'GAS' | 'WATER' | 'INTERNET' | 'INSURANCE' | 'OTHER';
  amount: number;
  dueDate: string; // YYYY-MM-DD
  isReserved: boolean;
  reservedAmount: number;
  isPaid: boolean;
  source: RecordSource;
  isRecurring: boolean;
}

export interface SafeLoanPlan {
  requestedAmount: number;
  calculatedManageableMax: number;
  recommendedAmount: number;
  recommendedEmi: number;
  tenureMonths: number;
  feasibilityScore: number; // 0 - 100
  feasibilityStatus: 'SAFE' | 'MODERATE' | 'HIGH_RISK';
  disposableMonthlyMargin: number;
  debtToIncomeRatio: number;
  volatilityDiscountFactor: number;
  strengths: string[];
  risks: string[];
  rationale: string;
  status: 'SAFE' | 'MODERATE' | 'BORDERLINE' | 'HIGH_RISK';
  recommendedBorrowAmount: number;
  safeRangeMin: number;
  safeRangeMax: number;
  maxSafeMonthlyRepayment: number;
  calculatedMonthlyRepayment: number;
  safeRepaymentPeriodMonths: number;
  breakdown: {
    countedIncome: number;
    volatilityDeduction: number;
    essentialExpenses: number;
    existingDebtService: number;
    netMarginForDebt: number;
    estimatedMonthlyIncome?: number;
    existingBillObligations?: number;
    volatilityDiscountAmount?: number;
    safeDisposableSurplus?: number;
  };
}

export interface PredictionResult {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  estimatedMin: number;
  estimatedMax: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  dataPeriodLabel: string;
  factors: string[];
  weatherInfluence?: {
    temperature: number;
    condition: string;
    impactDescription: string;
  };
  holidayInfluence?: {
    name: string;
    date: string;
    impactDescription: string;
  };
}

export interface ShockScenario {
  id: string;
  name: string;
  description: string;
  type: 'INCOME_DROP_20' | 'INCOME_DROP_30' | 'ZERO_INCOME_7_DAYS' | 'UNEXPECTED_EXPENSE' | 'BONUS_DELAYED' | 'VEHICLE_REPAIR';
  customExpenseAmount?: number;
}

export interface ShockEvaluation {
  scenarioId: string;
  status: 'MANAGEABLE' | 'TIGHT' | 'SHORTFALL_RISK';
  shortfallAmount: number;
  survivalRunwayDays: number;
  projectedIncome: number;
  essentialExpenses: number;
  upcomingBills: number;
  liquidBuffer: number;
  simpleExplanation: string;
  mitigationSteps: string[];
}

export interface AccountConnection {
  id: string;
  institutionName: string;
  logoType: 'BANK' | 'GIG' | 'PAYROLL' | 'POS';
  type: 'ACCOUNT_AGGREGATOR' | 'GIG_PLATFORM' | 'PAYROLL_SYSTEM' | 'POS_PAYMENT';
  status: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING' | 'ERROR';
  lastSync: string;
  accountMask: string;
  consentExpiry: string;
}

export interface VoiceParsedIntent {
  action: 'ADD_INCOME' | 'ADD_EXPENSE' | 'CHECK_BALANCE' | 'CHECK_BILLS' | 'SAVINGS_STATUS' | 'UNKNOWN';
  amount?: number;
  category?: string;
  date?: string;
  description?: string;
  source?: RecordSource;
  rawText: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  source: string;
}
