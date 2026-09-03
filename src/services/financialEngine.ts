import { 
  UserProfile, 
  IncomeRecord, 
  ExpenseRecord, 
  BillItem, 
  SavingsGoal, 
  SafeLoanPlan, 
  PredictionResult, 
  ShockScenario, 
  ShockEvaluation,
  LoanItem 
} from '../types';

export type { LoanItem, SafeLoanPlan } from '../types';

export interface ShockSimulationResult {
  status: 'MANAGEABLE' | 'TIGHT' | 'SHORTFALL_RISK';
  remainingRunwayDays: number;
  bufferDaysImpact: number;
  summary: string;
  mitigationSteps: string[];
}

export interface FinancialSnapshot {
  availableMoney: number;
  totalIncomePeriod: number;
  totalExpensePeriod: number;
  netSavingsPeriod: number;
  upcomingBillsTotal: number;
  reservedMoneyTotal: number;
  safeToSpend: number;
  resilienceScore: number;
  resilienceTier: 'EXCELLENT' | 'STABLE' | 'VULNERABLE' | 'CRITICAL';
  incomeStabilityIndex: number;
  daysOfBuffer: number;
}

export function calculateSnapshot(
  profile: UserProfile,
  incomes: IncomeRecord[],
  expenses: ExpenseRecord[],
  bills: BillItem[],
  loans?: LoanItem[]
): FinancialSnapshot {
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  
  const availableMoney = Math.max(0, profile.initialBalance + totalIncome - totalExpense);

  const upcomingBills = bills.filter(b => !b.isPaid);
  const upcomingBillsTotal = upcomingBills.reduce((sum, b) => sum + b.amount, 0);
  const reservedMoneyTotal = upcomingBills.reduce((sum, b) => sum + (b.isReserved ? b.reservedAmount : 0), 0);
  
  const safeToSpend = Math.max(0, availableMoney - reservedMoneyTotal);

  // Daily burn rate calculation
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentExpenses = expenses.filter(e => new Date(e.date) >= thirtyDaysAgo);
  const recentExpenseSum = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const dailyBurn = recentExpenses.length > 0 ? (recentExpenseSum / 30) : 500;
  
  const daysOfBuffer = dailyBurn > 0 ? Math.round(availableMoney / dailyBurn) : 0;

  // Income stability calculation
  let incomeStabilityIndex = 50;
  if (profile.incomeType === 'FIXED') {
    incomeStabilityIndex = 88;
  } else if (incomes.length >= 5) {
    // Calculate coefficient of variation
    const amounts = incomes.slice(0, 14).map(i => i.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? stdDev / mean : 1;
    // Lower CV means higher stability
    incomeStabilityIndex = Math.max(20, Math.min(95, Math.round((1 - Math.min(cv, 1)) * 100)));
  }

  // Resilience score components:
  // 1. Buffer days (max 40 pts for 30+ days)
  const bufferScore = Math.min(40, (daysOfBuffer / 30) * 40);
  
  // 2. Income stability (max 30 pts)
  const stabilityScore = (incomeStabilityIndex / 100) * 30;

  // 3. Bill coverage (max 20 pts: ratio of reserved to upcoming bills)
  const billCoverageRatio = upcomingBillsTotal > 0 ? Math.min(1, reservedMoneyTotal / upcomingBillsTotal) : 1;
  const billScore = billCoverageRatio * 20;

  // 4. Data freshness & active habits (max 10 pts)
  const habitScore = incomes.length > 0 ? 10 : 0;

  const rawResilience = Math.round(bufferScore + stabilityScore + billScore + habitScore);
  const resilienceScore = Math.max(10, Math.min(98, rawResilience));

  let resilienceTier: 'EXCELLENT' | 'STABLE' | 'VULNERABLE' | 'CRITICAL' = 'STABLE';
  if (resilienceScore >= 80) resilienceTier = 'EXCELLENT';
  else if (resilienceScore >= 60) resilienceTier = 'STABLE';
  else if (resilienceScore >= 40) resilienceTier = 'VULNERABLE';
  else resilienceTier = 'CRITICAL';

  return {
    availableMoney,
    totalIncomePeriod: totalIncome,
    totalExpensePeriod: totalExpense,
    netSavingsPeriod: Math.max(0, totalIncome - totalExpense),
    upcomingBillsTotal,
    reservedMoneyTotal,
    safeToSpend,
    resilienceScore,
    resilienceTier,
    incomeStabilityIndex,
    daysOfBuffer,
  };
}

export const calculateFinancialSnapshot = calculateSnapshot;

export function calculateSafeLoanPlan(
  profile: UserProfile,
  incomes: IncomeRecord[],
  expenses: ExpenseRecord[],
  bills: BillItem[],
  loansOrRequested: LoanItem[] | number,
  requestedAmountOrTenure?: number,
  maybeTenure?: number
): SafeLoanPlan {
  const isFifthParamLoans = Array.isArray(loansOrRequested);
  const requestedAmount: number = isFifthParamLoans
    ? (typeof requestedAmountOrTenure === 'number' ? requestedAmountOrTenure : 45000)
    : (typeof loansOrRequested === 'number' ? loansOrRequested : 45000);
  
  const tenureMonths: number = isFifthParamLoans
    ? (typeof maybeTenure === 'number' ? maybeTenure : 12)
    : (typeof requestedAmountOrTenure === 'number' ? requestedAmountOrTenure : 12);

  const existingLoans: LoanItem[] = isFifthParamLoans ? loansOrRequested : [];
  const existingLoanEmis = existingLoans.reduce((sum, l) => sum + l.emiAmount, 0);

  // Estimate monthly income
  let estimatedMonthlyIncome = 0;
  if (profile.incomeType === 'FIXED') {
    const salaryRecord = incomes.find(i => i.category === 'SALARY');
    estimatedMonthlyIncome = salaryRecord ? salaryRecord.amount : 38500;
  } else {
    // Variable: average past 30 days
    const sum = incomes.slice(0, 30).reduce((acc, i) => acc + i.amount, 0);
    estimatedMonthlyIncome = incomes.length > 0 ? (sum / Math.min(incomes.length, 30)) * 30 : 25000;
  }

  // Monthly essential commitments (Bills + Rent + Groceries + existing EMIs)
  const monthlyBills = bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  const monthlyEssentialExpenses = expenses
    .filter(e => ['RENT', 'UTILITIES', 'FOOD_GROCERIES', 'LOAN_EMI'].includes(e.category))
    .reduce((sum, e) => sum + e.amount, 0);

  const totalMonthlyCommitment = Math.max(monthlyBills, monthlyEssentialExpenses * 0.8) + existingLoanEmis;
  const netMonthlySurplus = Math.max(0, estimatedMonthlyIncome - totalMonthlyCommitment);

  // Volatility discount: Variable income gets 30% haircut to prevent debt trap
  const volatilityDiscount = profile.incomeType === 'VARIABLE' ? 0.30 : 0.10;
  const safeDisposableMargin = netMonthlySurplus * (1 - volatilityDiscount);

  // Safe maximum monthly EMI is 35% of safe disposable margin
  const recommendedEmi = Math.max(500, Math.round(safeDisposableMargin * 0.35));
  
  // Manageable borrowing range based on requested tenure at reasonable indicative rate (e.g. 14% p.a.)
  const calculatedManageableMax = Math.round(recommendedEmi * tenureMonths * 0.88);
  const recommendedAmount = Math.min(requestedAmount, calculatedManageableMax);

  // Feasibility score (0-100)
  const ratio = calculatedManageableMax > 0 ? (requestedAmount / calculatedManageableMax) : 2;
  let feasibilityScore = 75;
  let feasibilityStatus: 'SAFE' | 'MODERATE' | 'HIGH_RISK' = 'SAFE';

  if (ratio <= 0.8) {
    feasibilityScore = Math.min(95, Math.round(92 - (ratio * 15)));
    feasibilityStatus = 'SAFE';
  } else if (ratio <= 1.2) {
    feasibilityScore = Math.round(75 - ((ratio - 0.8) * 40));
    feasibilityStatus = 'MODERATE';
  } else {
    feasibilityScore = Math.max(15, Math.round(45 - ((ratio - 1.2) * 25)));
    feasibilityStatus = 'HIGH_RISK';
  }

  const strengths: string[] = [];
  const risks: string[] = [];

  if (profile.incomeType === 'FIXED') {
    strengths.push('Regular salaried cadence allows predictable monthly EMI repayment.');
  } else {
    strengths.push('Active daily/weekly cash flow provides rolling liquidity.');
  }

  if (safeDisposableMargin > recommendedEmi * 2) {
    strengths.push(`Healthy surplus margin: ₹${Math.round(safeDisposableMargin).toLocaleString('en-IN')}/mo available.`);
  }

  if (profile.incomeType === 'VARIABLE') {
    risks.push('30% income volatility discount applied to protect against lean earnings weeks.');
  }

  if (requestedAmount > calculatedManageableMax) {
    risks.push(`Requested ₹${requestedAmount.toLocaleString('en-IN')} exceeds safe threshold of ₹${calculatedManageableMax.toLocaleString('en-IN')}.`);
  }

  if (monthlyBills > estimatedMonthlyIncome * 0.5) {
    risks.push('Existing essential bill obligations consume over 50% of anticipated earnings.');
  }

  const rationale = requestedAmount <= calculatedManageableMax
    ? `Based on your real surplus of ₹${Math.round(safeDisposableMargin).toLocaleString('en-IN')}/mo, a monthly repayment of ₹${recommendedEmi.toLocaleString('en-IN')} is comfortably manageable without risking essential expenses.`
    : `Borrowing ₹${requestedAmount.toLocaleString('en-IN')} would require an EMI that exceeds safe limits during slow business periods. We recommend capping borrowing at ₹${calculatedManageableMax.toLocaleString('en-IN')}.`;

  const debtToIncomeRatio = estimatedMonthlyIncome > 0 
    ? Math.round((totalMonthlyCommitment / estimatedMonthlyIncome) * 100)
    : 0;

  return {
    requestedAmount,
    calculatedManageableMax,
    recommendedAmount,
    recommendedEmi,
    tenureMonths,
    feasibilityScore,
    feasibilityStatus,
    disposableMonthlyMargin: Math.round(safeDisposableMargin),
    debtToIncomeRatio,
    volatilityDiscountFactor: volatilityDiscount,
    strengths,
    risks,
    rationale,
    status: feasibilityStatus,
    recommendedBorrowAmount: recommendedAmount,
    safeRangeMin: Math.round(calculatedManageableMax * 0.4),
    safeRangeMax: calculatedManageableMax,
    maxSafeMonthlyRepayment: recommendedEmi,
    calculatedMonthlyRepayment: recommendedEmi,
    safeRepaymentPeriodMonths: tenureMonths,
    breakdown: {
      countedIncome: Math.round(estimatedMonthlyIncome),
      volatilityDeduction: Math.round(netMonthlySurplus * volatilityDiscount),
      essentialExpenses: Math.round(monthlyEssentialExpenses),
      existingDebtService: Math.round(existingLoanEmis),
      netMarginForDebt: Math.round(safeDisposableMargin),
      estimatedMonthlyIncome: Math.round(estimatedMonthlyIncome),
      existingBillObligations: Math.round(monthlyBills + existingLoanEmis),
      volatilityDiscountAmount: Math.round(netMonthlySurplus * volatilityDiscount),
      safeDisposableSurplus: Math.round(safeDisposableMargin),
    },
  };
}

export function evaluateSavingsCondition(
  goal: SavingsGoal,
  todayActualIncome: number,
  monthlyNetSurplus: number
): { conditionMet: boolean; eligibleSavings: number; explanation: string } {
  if (goal.frequency === 'DAILY') {
    const threshold = goal.dailyGoalThreshold || 1500;
    const saveAmount = goal.dailySavingsAmount || 200;
    
    if (todayActualIncome >= threshold) {
      return {
        conditionMet: true,
        eligibleSavings: saveAmount,
        explanation: `Daily goal of ₹${threshold.toLocaleString('en-IN')} reached with ₹${todayActualIncome.toLocaleString('en-IN')} income. ₹${saveAmount.toLocaleString('en-IN')} eligible to save.`,
      };
    } else {
      const deficit = threshold - todayActualIncome;
      return {
        conditionMet: false,
        eligibleSavings: 0,
        explanation: `Today's income (₹${todayActualIncome.toLocaleString('en-IN')}) is ₹${deficit.toLocaleString('en-IN')} below daily trigger (₹${threshold.toLocaleString('en-IN')}). No automatic savings triggered.`,
      };
    }
  } else {
    const threshold = goal.monthlyThreshold || 5000;
    const saveAmount = goal.monthlySavingsAmount || 2000;
    if (monthlyNetSurplus >= threshold) {
      return {
        conditionMet: true,
        eligibleSavings: saveAmount,
        explanation: `Monthly surplus threshold of ₹${threshold.toLocaleString('en-IN')} met. ₹${saveAmount.toLocaleString('en-IN')} allocated toward goal.`,
      };
    } else {
      return {
        conditionMet: false,
        eligibleSavings: 0,
        explanation: `Monthly surplus (₹${monthlyNetSurplus.toLocaleString('en-IN')}) has not crossed savings trigger (₹${threshold.toLocaleString('en-IN')}).`,
      };
    }
  }
}

export function evaluateShockScenario(
  profile: UserProfile,
  param2: any,
  param3: any,
  param4?: any,
  param5?: any,
  param6?: any,
  param7?: any
): any {
  // Check if called as (profile, snapshot, incomes, scenario)
  if (param2 && typeof param2 === 'object' && 'resilienceScore' in param2) {
    const snapshot: FinancialSnapshot = param2;
    const incomes: IncomeRecord[] = param3;
    const scenario: ShockScenario = param4;

    const currentAvailable = snapshot.availableMoney;
    const monthlyExpenses = Math.max(12000, snapshot.totalExpensePeriod);
    const upcomingBills = snapshot.upcomingBillsTotal;
    
    let projectedIncome = snapshot.totalIncomePeriod;
    let extraExpense = 0;

    switch (scenario.type) {
      case 'INCOME_DROP_20':
        projectedIncome = snapshot.totalIncomePeriod * 0.8;
        break;
      case 'INCOME_DROP_30':
        projectedIncome = snapshot.totalIncomePeriod * 0.7;
        break;
      case 'ZERO_INCOME_7_DAYS':
        projectedIncome = snapshot.totalIncomePeriod * (23 / 30);
        break;
      case 'UNEXPECTED_EXPENSE':
        extraExpense = scenario.customExpenseAmount || 15000;
        break;
      case 'VEHICLE_REPAIR':
        extraExpense = 8500;
        break;
      case 'BONUS_DELAYED':
        projectedIncome = Math.max(10000, snapshot.totalIncomePeriod - 12000);
        break;
    }

    const totalRequired = monthlyExpenses + upcomingBills + extraExpense;
    const totalResources = currentAvailable + projectedIncome;
    const netPosition = totalResources - totalRequired;

    const dailyEssentialBurn = (monthlyExpenses + upcomingBills) / 30;
    const survivalRunwayDays = dailyEssentialBurn > 0 
      ? Math.max(0, Math.round((currentAvailable + projectedIncome - extraExpense) / dailyEssentialBurn))
      : 30;

    let status: 'MANAGEABLE' | 'TIGHT' | 'SHORTFALL_RISK' = 'MANAGEABLE';
    let shortfallAmount = 0;

    if (netPosition >= 5000) {
      status = 'MANAGEABLE';
    } else if (netPosition >= 0) {
      status = 'TIGHT';
    } else {
      status = 'SHORTFALL_RISK';
      shortfallAmount = Math.abs(netPosition);
    }

    let simpleExplanation = '';
    const mitigationSteps: string[] = [];

    if (status === 'MANAGEABLE') {
      simpleExplanation = `Your current liquid reserves (₹${currentAvailable.toLocaleString('en-IN')}) can absorb this shock with approximately ${survivalRunwayDays} days of essential buffer remaining.`;
      mitigationSteps.push('Maintain your current reserved money allocations for upcoming essential bills.');
      mitigationSteps.push('Pause optional discretionary spending until the income stabilizes.');
    } else if (status === 'TIGHT') {
      simpleExplanation = `Cash flow would be tight with only ₹${Math.round(netPosition).toLocaleString('en-IN')} remaining above essential obligations. Any additional unexpected cost could trigger a deficit.`;
      mitigationSteps.push('Lock in existing planned reserves for rent and utility dues immediately.');
      mitigationSteps.push('Temporarily pause automated daily/monthly savings contributions.');
      mitigationSteps.push('Prioritize immediate cash-earning shifts or freelance deliverables.');
    } else {
      simpleExplanation = `A potential shortfall of ₹${shortfallAmount.toLocaleString('en-IN')} could occur within 30 days under this scenario unless expenses are reduced or income is supplemented.`;
      mitigationSteps.push(`Immediately cut non-essential expenses to protect the ₹${upcomingBills.toLocaleString('en-IN')} needed for critical bills.`);
      mitigationSteps.push('Contact billers or lenders early to explore grace periods or revised payment schedules.');
      mitigationSteps.push('Utilize the Safe Loan Planner for a low-cost micro-cushion rather than high-interest informal loans.');
    }

    return {
      scenarioId: scenario.id,
      status,
      shortfallAmount,
      survivalRunwayDays,
      remainingRunwayDays: survivalRunwayDays,
      bufferDaysImpact: Math.max(0, snapshot.daysOfBuffer - survivalRunwayDays),
      summary: simpleExplanation,
      projectedIncome: Math.round(projectedIncome),
      essentialExpenses: Math.round(monthlyExpenses),
      upcomingBills: Math.round(upcomingBills),
      liquidBuffer: currentAvailable,
      simpleExplanation,
      mitigationSteps,
    };
  }

  // Called from ScreenShockSimulator: (profile, incomes, expenses, bills, availableMoney, selectedScenario, customShockAmount)
  const incomes: IncomeRecord[] = param2 || [];
  const expenses: ExpenseRecord[] = param3 || [];
  const bills: BillItem[] = param4 || [];
  const availableMoney: number = typeof param5 === 'number' ? param5 : 10000;
  const scenarioType: string = typeof param6 === 'string' ? param6 : 'ZERO_7_DAYS';
  const customShockAmount: number = typeof param7 === 'number' ? param7 : 15000;

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const upcomingBills = bills.filter(b => !b.isPaid).reduce((s, b) => s + b.amount, 0);
  const baselineDailyBurn = Math.max(300, (totalExpense + upcomingBills) / 30);
  const baselineRunwayDays = Math.round(availableMoney / baselineDailyBurn);

  let remainingRunwayDays = baselineRunwayDays;
  let bufferDaysImpact = 5;
  let status: 'MANAGEABLE' | 'TIGHT' | 'SHORTFALL_RISK' = 'MANAGEABLE';
  let summary = '';
  const mitigationSteps: string[] = [];

  if (scenarioType === 'ZERO_7_DAYS') {
    remainingRunwayDays = Math.max(0, baselineRunwayDays - 7);
    bufferDaysImpact = 7;
    if (remainingRunwayDays >= 14) {
      status = 'MANAGEABLE';
      summary = `Your ₹${availableMoney.toLocaleString('en-IN')} buffer comfortably cushions 7 days of complete rest or illness, leaving ${remainingRunwayDays} days of survival runway.`;
      mitigationSteps.push('Rest without panic — your essential food and shelter are guarded.');
      mitigationSteps.push('Resume high-volume weekend delivery shifts once recovered.');
    } else if (remainingRunwayDays >= 5) {
      status = 'TIGHT';
      summary = `You would have ${remainingRunwayDays} days of buffer remaining. Essential bills will require disciplined spending.`;
      mitigationSteps.push('Freeze discretionary dining and leisure expenses.');
      mitigationSteps.push('Keep bill reserves locked in the Reserve Money vault.');
    } else {
      status = 'SHORTFALL_RISK';
      summary = `7 days with zero earnings exhausts your available cash. High risk of missing upcoming bills.`;
      mitigationSteps.push('Prioritize immediate partial shifts or micro-tasks if physically able.');
      mitigationSteps.push('Request due date extensions for utility payments before penalties hit.');
    }
  } else if (scenarioType === 'DROP_20') {
    const projectedShortfall = Math.round(totalIncome * 0.20);
    remainingRunwayDays = Math.max(0, baselineRunwayDays - 4);
    bufferDaysImpact = 4;
    status = remainingRunwayDays >= 10 ? 'MANAGEABLE' : 'TIGHT';
    summary = `A 20% income contraction (approx ₹${projectedShortfall.toLocaleString('en-IN')}/mo) reduces your buffer runway by 4 days.`;
    mitigationSteps.push('Adjust daily savings rule threshold downward to maintain consistency.');
    mitigationSteps.push('Review Expense Insights to eliminate recurring non-essential charges.');
  } else if (scenarioType === 'EMERGENCY_EXPENSE') {
    const postShockAvailable = Math.max(0, availableMoney - customShockAmount);
    remainingRunwayDays = Math.round(postShockAvailable / baselineDailyBurn);
    bufferDaysImpact = Math.max(0, baselineRunwayDays - remainingRunwayDays);
    if (postShockAvailable >= upcomingBills) {
      status = 'MANAGEABLE';
      summary = `Your cash reserves can absorb this ₹${customShockAmount.toLocaleString('en-IN')} emergency bill while preserving upcoming bill commitments.`;
      mitigationSteps.push('Draw directly from emergency reserve pool rather than taking high-rate loans.');
      mitigationSteps.push('Allocate surplus from upcoming peak shifts to replenish the emergency buffer.');
    } else {
      status = 'SHORTFALL_RISK';
      summary = `An unexpected ₹${customShockAmount.toLocaleString('en-IN')} debit would consume all liquid cash, risking shortfall on committed bills.`;
      mitigationSteps.push('Do NOT take unregulated payday/instant loans with predatory interest.');
      mitigationSteps.push('Use Safe Loan Planner to evaluate a low-interest formal installment advance.');
    }
  } else {
    // INFLATION_SURGE
    remainingRunwayDays = Math.max(0, baselineRunwayDays - 5);
    bufferDaysImpact = 5;
    status = 'TIGHT';
    summary = `A 15% surge in grocery and fuel prices increases monthly burn by ~₹${Math.round(totalExpense * 0.15).toLocaleString('en-IN')}.`;
    mitigationSteps.push('Switch to local wholesale mandi purchasing for bulk family grains.');
    mitigationSteps.push('Audit vehicle fuel efficiency and map route grouping for deliveries.');
  }

  return {
    scenarioId: scenarioType,
    status,
    shortfallAmount: Math.max(0, upcomingBills - availableMoney),
    survivalRunwayDays: remainingRunwayDays,
    remainingRunwayDays,
    bufferDaysImpact,
    summary,
    projectedIncome: Math.round(totalIncome * 0.9),
    essentialExpenses: Math.round(totalExpense),
    upcomingBills,
    liquidBuffer: availableMoney,
    simpleExplanation: summary,
    mitigationSteps,
  };
}
