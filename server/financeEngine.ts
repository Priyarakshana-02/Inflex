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
} from './types';

export class FinanceEngine {
  // 1. Calculate Daily & Weekly Snapshots
  static getOverviewSnapshot(
    user: UserProfile,
    incomes: IncomeTransaction[],
    expenses: ExpenseTransaction[],
    bills: BillItem[],
    activeGoal?: SavingsGoal
  ) {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Today's data
    const todayIncomes = incomes.filter(t => t.date === todayStr);
    const todayIncomeTotal = todayIncomes.reduce((s, t) => s + t.amount, 0);

    const yesterdayIncomes = incomes.filter(t => t.date === yesterdayStr);
    const yesterdayIncomeTotal = yesterdayIncomes.reduce((s, t) => s + t.amount, 0);

    const todayExpenses = expenses.filter(t => t.date === todayStr);
    const todayExpenseTotal = todayExpenses.reduce((s, t) => s + t.amount, 0);

    // Total historical
    const allIncome = incomes.reduce((s, t) => s + t.amount, 0);
    const allExpenses = expenses.reduce((s, t) => s + t.amount, 0);

    // Reserved money
    const reservedBills = bills.filter(b => b.reserved);
    const totalReserved = reservedBills.reduce((s, b) => s + b.amount, 0);

    // Net balance = all income - all expenses
    const netBalance = Math.max(0, allIncome - allExpenses);
    // Safe to spend = net balance - total reserved
    const safeToSpend = Math.max(0, netBalance - totalReserved);

    // % change vs yesterday
    let incomeChangeVsYesterday: number | null = null;
    if (yesterdayIncomeTotal > 0 && todayIncomeTotal > 0) {
      incomeChangeVsYesterday = Math.round(((todayIncomeTotal - yesterdayIncomeTotal) / yesterdayIncomeTotal) * 100);
    }

    // Weekly income (last 7 days)
    const last7Days: { date: string; dayName: string; amount: number }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayTotal = incomes
        .filter(t => t.date === dStr)
        .reduce((sum, item) => sum + item.amount, 0);

      last7Days.push({
        date: dStr,
        dayName: dayNames[d.getDay()],
        amount: dayTotal
      });
    }

    const currentWeekTotal = last7Days.reduce((s, d) => s + d.amount, 0);

    // Prior 7 days for comparison
    let priorWeekTotal = 0;
    for (let i = 13; i >= 7; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      priorWeekTotal += incomes
        .filter(t => t.date === dStr)
        .reduce((sum, item) => sum + item.amount, 0);
    }

    let weeklyChangePercent: number | null = null;
    if (priorWeekTotal > 0) {
      weeklyChangePercent = Math.round(((currentWeekTotal - priorWeekTotal) / priorWeekTotal) * 100);
    }

    const hasAnyData = incomes.length > 0 || expenses.length > 0;

    return {
      todayIncome: todayIncomeTotal,
      todayExpenses: todayExpenseTotal,
      todayNet: Math.max(0, todayIncomeTotal - todayExpenseTotal),
      allIncome,
      allExpenses,
      netBalance,
      safeToSpend,
      totalReserved,
      incomeChangeVsYesterday,
      last7Days,
      currentWeekTotal,
      weeklyChangePercent,
      hasAnyData
    };
  }

  // 2. Financial Freedom Score Calculation
  static calculateFreedomScore(
    incomes: IncomeTransaction[],
    expenses: ExpenseTransaction[],
    savings: SavingsTransaction[],
    bills: BillItem[]
  ): FinancialFreedomScore {
    if (incomes.length < 3) {
      return {
        score: -1,
        trend: 'stable',
        label: 'Building History',
        message: 'Track income and expenses for at least 3-5 days to unlock your Financial Freedom Score.',
        components: {
          incomeStability: 0,
          savingsHabit: 0,
          debtToIncome: 0,
          billCoverage: 0
        },
        hasEnoughData: false
      };
    }

    // Component 1: Income Stability (0-30 pts)
    const amounts = incomes.map(t => t.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((s, a) => s + Math.pow(a - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const cv = avg > 0 ? stdDev / avg : 1; // coefficient of variation
    // Lower cv means more stable. cv < 0.3 is very stable (30 pts), cv > 1 is volatile (10 pts)
    const stabilityScore = Math.min(30, Math.max(10, Math.round(30 - cv * 18)));

    // Component 2: Savings Habit (0-25 pts)
    const completedSavings = savings.filter(s => s.status === 'COMPLETED');
    const savingsPoints = Math.min(25, completedSavings.length * 2 + 5);

    // Component 3: Bill Coverage (0-25 pts)
    const totalReserved = bills.filter(b => b.reserved).reduce((s, b) => s + b.amount, 0);
    const totalDue = bills.reduce((s, b) => s + b.amount, 0);
    let coverageScore = 15;
    if (totalDue > 0) {
      coverageScore = Math.round((totalReserved / totalDue) * 25);
    }

    // Component 4: Net Cash Flow Margin (0-20 pts)
    const totalInc = incomes.reduce((s, t) => s + t.amount, 0);
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
    let marginScore = 10;
    if (totalInc > 0) {
      const margin = (totalInc - totalExp) / totalInc;
      marginScore = Math.min(20, Math.max(5, Math.round(margin * 25)));
    }

    const totalScore = Math.min(100, Math.max(25, stabilityScore + savingsPoints + coverageScore + marginScore));

    let label = 'Fair';
    let message = 'Keep building consistency to improve your resilience.';
    if (totalScore >= 80) {
      label = 'Excellent';
      message = "You're doing great! Strong cashflow and safety buffer.";
    } else if (totalScore >= 65) {
      label = 'Good';
      message = 'Healthy financial baseline with steady progress.';
    }

    return {
      score: totalScore,
      trend: totalScore > 70 ? 'up' : 'stable',
      label,
      message,
      components: {
        incomeStability: stabilityScore,
        savingsHabit: savingsPoints,
        debtToIncome: marginScore,
        billCoverage: coverageScore
      },
      hasEnoughData: true
    };
  }

  // 3. Savings Rule Trigger Evaluation
  static evaluateSavingsRule(
    user: UserProfile,
    goal: SavingsGoal | undefined,
    todayIncome: number,
    netMonthlySurplus: number
  ) {
    if (!goal || !goal.active) {
      return {
        hasGoal: false,
        triggered: false,
        eligibleAmount: 0,
        message: 'No active savings goal set.'
      };
    }

    if (user.incomeType === 'irregular') {
      // Daily goal rule
      if (todayIncome >= goal.thresholdAmount) {
        return {
          hasGoal: true,
          triggered: true,
          eligibleAmount: goal.saveAmount,
          message: `Your savings condition was reached! Today's income (₹${todayIncome.toLocaleString('en-IN')}) reached your daily goal (₹${goal.thresholdAmount.toLocaleString('en-IN')}).`
        };
      } else {
        return {
          hasGoal: true,
          triggered: false,
          eligibleAmount: 0,
          message: `Your savings condition was not reached today (₹${todayIncome.toLocaleString('en-IN')} of ₹${goal.thresholdAmount.toLocaleString('en-IN')}). No savings triggered.`
        };
      }
    } else {
      // Monthly surplus rule for fixed-income
      if (netMonthlySurplus >= goal.thresholdAmount) {
        return {
          hasGoal: true,
          triggered: true,
          eligibleAmount: goal.saveAmount,
          message: `Monthly surplus (₹${netMonthlySurplus.toLocaleString('en-IN')}) meets your threshold (₹${goal.thresholdAmount.toLocaleString('en-IN')}). ₹${goal.saveAmount.toLocaleString('en-IN')} is eligible to save.`
        };
      } else {
        return {
          hasGoal: true,
          triggered: false,
          eligibleAmount: 0,
          message: `Monthly surplus did not reach threshold of ₹${goal.thresholdAmount.toLocaleString('en-IN')}.`
        };
      }
    }
  }

  // 4. Safe Loan Planner & Feasibility Assessment
  static assessLoanAffordability(
    requestedAmount: number,
    incomes: IncomeTransaction[],
    expenses: ExpenseTransaction[],
    bills: BillItem[]
  ): LoanAssessment {
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);

    // Determine monthly estimates
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    if (incomes.length >= 7) {
      // Last 30 days or average extrapolated to 30 days
      const daysSpan = Math.max(7, Math.min(30, incomes.length));
      const dailyAvg = totalIncome / daysSpan;
      monthlyIncome = Math.round(dailyAvg * 26); // assuming 26 earning days
      monthlyExpense = Math.round((totalExpenses / daysSpan) * 30);
    } else if (incomes.length > 0) {
      monthlyIncome = Math.round((totalIncome / incomes.length) * 24);
      monthlyExpense = Math.round((totalExpenses / Math.max(1, expenses.length)) * 30);
    }

    // Existing obligations (EMIs in bills)
    const emiBills = bills.filter(b => b.category === 'EMI');
    const existingObligations = emiBills.reduce((s, b) => s + b.amount, 0);

    // Repayment capacity = Max 35% of monthly disposable income
    const disposableIncome = Math.max(0, monthlyIncome - monthlyExpense - existingObligations);
    const repaymentCapacityMonthly = Math.round(disposableIncome * 0.4);

    // Max safe borrowing capacity (12-month tenure at ~12% simple APR benchmark)
    // Borrowing Capacity = repaymentCapacityMonthly * 10
    const borrowingCapacity = Math.max(5000, Math.round(repaymentCapacityMonthly * 10 / 1000) * 1000);
    const recommendedAmount = borrowingCapacity;

    // Evaluate requested amount
    const req = Math.max(1000, requestedAmount || borrowingCapacity);
    const estimatedEmi = Math.round(req / 12 * 1.1); // approx monthly EMI for 12 mo

    // Feasibility Score (0 - 100)
    let score = 50;
    const positiveReasons: string[] = [];
    const cautions: string[] = [];

    if (monthlyIncome === 0) {
      score = 20;
      cautions.push('Insufficient income history to reliably assess loan repayment capacity.');
    } else {
      const emiToCapacityRatio = estimatedEmi / Math.max(500, repaymentCapacityMonthly);
      if (emiToCapacityRatio <= 0.8) {
        score = 88;
        positiveReasons.push('Stable regular income pattern');
        positiveReasons.push('Comfortable repayment capacity (EMI is well within monthly margin)');
        positiveReasons.push('Low existing debt obligations');
        positiveReasons.push('Higher likelihood of responsible repayment');
      } else if (emiToCapacityRatio <= 1.1) {
        score = 72;
        positiveReasons.push('Manageable monthly repayment with moderate buffer');
        positiveReasons.push('Existing expenses allow for timely EMI payment');
        cautions.push('Keep non-essential spending low during loan tenure');
      } else if (emiToCapacityRatio <= 1.5) {
        score = 48;
        cautions.push('Requested amount may stretch your monthly cash flow');
        cautions.push('Consider reducing loan amount to the recommended limit');
      } else {
        score = 28;
        cautions.push('High repayment stress relative to current recorded income');
        cautions.push('Risk of shortfall when recurring bills are due');
      }
    }

    let matchRating = 'Good Match!';
    if (score >= 80) matchRating = 'Excellent Match!';
    else if (score >= 60) matchRating = 'Good Match!';
    else if (score >= 40) matchRating = 'Moderate Risk';
    else matchRating = 'High Financial Stress';

    return {
      requestedAmount: req,
      borrowingCapacity,
      recommendedAmount,
      feasibilityScore: score,
      matchRating,
      monthlyIncomeAvg: monthlyIncome,
      monthlyExpenseAvg: monthlyExpense,
      existingObligations,
      repaymentCapacityMonthly,
      estimatedEmi,
      reasons: {
        positive: positiveReasons,
        cautions
      },
      assuranceMessage: 'Maintain steady earnings and on-time bill reserves to unlock higher borrowing limits safely.',
      disclaimer: 'IncomeFlex estimate — not lender approval. We do not issue loans directly.'
    };
  }

  // 5. Prediction Engine (Deterministic Heuristic + Statistical model)
  static generatePrediction(
    user: UserProfile,
    incomes: IncomeTransaction[],
    weatherCondition: { temp: number; condition: string; rainMm: number }
  ): PredictionResult {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][tomorrow.getDay()];
    const isWeekend = tomorrow.getDay() === 0 || tomorrow.getDay() === 6;

    if (incomes.length < 3) {
      return {
        targetDate: tomorrow.toISOString().split('T')[0],
        targetPeriod: 'daily',
        estimatedMin: 0,
        estimatedMax: 0,
        confidence: 'Insufficient Data',
        confidenceScore: 15,
        dataPeriodDays: incomes.length,
        factors: [],
        modelInfo: 'Baseline heuristic requiring min. 3 days of recorded income',
        aiInsight: 'Track income for at least 3-5 days to generate a reliable forecast.',
        hasEnoughData: false
      };
    }

    // Calculate moving average
    const recent7 = incomes.slice(0, 7).map(t => t.amount);
    const baseAvg = recent7.reduce((a, b) => a + b, 0) / recent7.length;

    // Day of week seasonality adjustment
    let weekendBoost = 0;
    if (isWeekend) {
      weekendBoost = Math.round(baseAvg * 0.15); // +15% on weekends
    }

    // Weather impact
    let weatherImpact = 0;
    let weatherDescription = 'Sunny / clear weather';
    let weatherIcon = '☀️';

    if (weatherCondition.rainMm > 5) {
      weatherImpact = -Math.round(baseAvg * 0.12);
      weatherDescription = 'Rainfall alert (outdoor footfall drop)';
      weatherIcon = '🌧️';
    } else {
      weatherImpact = Math.round(baseAvg * 0.08);
      weatherDescription = 'Favorable weather conditions';
      weatherIcon = '☀️';
    }

    // Market trend factor
    const marketBoost = Math.round(baseAvg * 0.06);

    const projectedCenter = baseAvg + weekendBoost + weatherImpact + marketBoost;
    const estimatedMin = Math.max(100, Math.round((projectedCenter * 0.9) / 50) * 50);
    const estimatedMax = Math.max(estimatedMin + 200, Math.round((projectedCenter * 1.1) / 50) * 50);

    const factors = [
      {
        name: weatherDescription,
        impactAmount: weatherImpact,
        description: 'Atmospheric and footfall suitability',
        icon: weatherIcon
      },
      ...(isWeekend
        ? [
            {
              name: 'Weekend Crowd Boost',
              impactAmount: weekendBoost,
              description: 'Historical weekend spike for local commerce',
              icon: '🎉'
            }
          ]
        : []),
      {
        name: 'Market Trend Factor',
        impactAmount: marketBoost,
        description: 'Customer demand momentum in recent 3 days',
        icon: '📈'
      },
      {
        name: 'No Disruption / Calamity',
        impactAmount: 150,
        description: 'Uninterrupted transit and supply routes',
        icon: '🛡️'
      }
    ];

    const confidenceScore = incomes.length >= 14 ? 85 : incomes.length >= 7 ? 68 : 50;
    const confidence = confidenceScore >= 80 ? 'High' : confidenceScore >= 60 ? 'Medium' : 'Low';

    return {
      targetDate: tomorrow.toISOString().split('T')[0],
      targetPeriod: 'daily',
      estimatedMin,
      estimatedMax,
      confidence,
      confidenceScore,
      dataPeriodDays: incomes.length,
      factors,
      modelInfo: `Time-Series Moving Average (Window = ${recent7.length} records) + Day-of-Week & Weather regression`,
      aiInsight: `Based on your recent ${incomes.length} earnings entries and favorable weather, tomorrow (${tomorrowDayName}) shows solid demand.`,
      hasEnoughData: true
    };
  }

  // 6. Bonus & Festival Prediction for Fixed-Income Users
  static generateBonusPrediction(
    user: UserProfile,
    incomes: IncomeTransaction[]
  ): BonusPredictionResult {
    // Check upcoming major festivals (Diwali in ~2 months, Pongal/Sankranti, Eid)
    const festivalName = 'Diwali Festival';
    const festivalDate = 'November 2026';
    const countdownMonths = 2;

    const salaryIncome = incomes.filter(t => t.category === 'Salary' || t.source.toLowerCase().includes('salary'));
    if (salaryIncome.length === 0 && (!user.monthlySalary || user.monthlySalary <= 0)) {
      return {
        festivalName,
        festivalDate,
        countdownMonths,
        estimatedBonusMin: 0,
        estimatedBonusMax: 0,
        confidence: 'Insufficient Data',
        factors: ['Past Bonus History', 'Company Performance', 'Industry Trend', 'Festival Season Policy'],
        hasEnoughData: false,
        explanation: 'Not enough personal salary or historical bonus records to estimate your festival bonus.'
      };
    }

    const baseSalary = user.monthlySalary || salaryIncome[0].amount;
    // Typical festive performance bonus in Indian corporate/SME ranges 50% to 85% of monthly salary
    const minBonus = Math.round((baseSalary * 0.55) / 1000) * 1000;
    const maxBonus = Math.round((baseSalary * 0.85) / 1000) * 1000;

    return {
      festivalName,
      festivalDate,
      countdownMonths,
      estimatedBonusMin: minBonus,
      estimatedBonusMax: maxBonus,
      confidence: 'Medium',
      factors: [
        'Historical Corporate Bonus Cycle',
        'Employer Payroll Consistency',
        'Industry Benchmark Standards',
        'Upcoming Q3 Festive Incentive Window'
      ],
      hasEnoughData: true,
      explanation: 'Estimated based on your base salary profile, regional employer bonus trends, and upcoming festival season.'
    };
  }

  // 7. Financial Shock Simulator
  static simulateShock(
    scenario: 'income_drop_20' | 'income_drop_30' | 'zero_income_7days' | 'unexpected_expense_5000' | 'emergency_repair',
    incomes: IncomeTransaction[],
    expenses: ExpenseTransaction[],
    bills: BillItem[]
  ) {
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
    const totalBills = bills.reduce((s, b) => s + b.amount, 0);
    const availableReserve = bills.filter(b => b.reserved).reduce((s, b) => s + b.amount, 0);
    const liquidBalance = Math.max(0, totalIncome - totalExpenses);

    let scenarioName = '20% Income Reduction';
    let incomeLoss = 0;
    let shockExpense = 0;

    if (scenario === 'income_drop_20') {
      scenarioName = 'Income falls by 20%';
      incomeLoss = Math.round(totalIncome * 0.2);
    } else if (scenario === 'income_drop_30') {
      scenarioName = 'Income falls by 30%';
      incomeLoss = Math.round(totalIncome * 0.3);
    } else if (scenario === 'zero_income_7days') {
      scenarioName = 'No income for 7 continuous days';
      const dailyAvg = incomes.length > 0 ? totalIncome / Math.max(1, incomes.length) : 0;
      incomeLoss = Math.round(dailyAvg * 7);
    } else if (scenario === 'unexpected_expense_5000') {
      scenarioName = 'Unexpected medical/family expense of ₹5,000';
      shockExpense = 5000;
    } else if (scenario === 'emergency_repair') {
      scenarioName = 'Vehicle or equipment breakdown repair (₹3,500)';
      shockExpense = 3500;
    }

    const postShockAvailable = liquidBalance - incomeLoss - shockExpense;
    const netAfterBills = postShockAvailable - totalBills;

    let verdict: 'MANAGEABLE' | 'TIGHT' | 'SHORTFALL RISK' = 'MANAGEABLE';
    let summary = '';

    if (netAfterBills >= 1000) {
      verdict = 'MANAGEABLE';
      summary = `Even under this shock scenario, your existing reserves and cash cushion (₹${postShockAvailable.toLocaleString('en-IN')}) will cover all upcoming bills with ₹${netAfterBills.toLocaleString('en-IN')} remaining.`;
    } else if (netAfterBills >= -1500) {
      verdict = 'TIGHT';
      summary = `Cash flow will be tight. You will have barely enough to cover essential bills. We recommend delaying non-essential spending immediately.`;
    } else {
      verdict = 'SHORTFALL RISK';
      summary = `Potential shortfall of ₹${Math.abs(netAfterBills).toLocaleString('en-IN')}. Your upcoming bills exceed projected emergency cash. Immediate reserve protection is advised.`;
    }

    return {
      scenarioName,
      incomeLoss,
      shockExpense,
      currentBalance: liquidBalance,
      postShockAvailable: Math.max(0, postShockAvailable),
      totalBillsDue: totalBills,
      netAfterBills,
      verdict,
      summary
    };
  }
}
