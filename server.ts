import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { db } from './server/db';
import { FinanceEngine } from './server/financeEngine';
import { AIService } from './server/ai';
import { ExternalApis } from './server/externalApis';
import { UserProfile, IncomeTransaction, ExpenseTransaction, BillItem, SavingsGoal } from './server/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get user from x-user-id header or fallback demo user
function getAuthUser(req: Request): UserProfile | null {
  const userId = req.headers['x-user-id'] as string;
  if (userId) {
    const u = db.getUserById(userId);
    if (u) return u;
  }
  return null;
}

// ----------------------------------------------------
// AUTH & PROFILE ENDPOINTS
// ----------------------------------------------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, incomeType = 'irregular', language = 'en' } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.json({ user: existing, isNew: false });
  }

  const newUser: UserProfile = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    language: language || 'en',
    incomeType: incomeType || 'irregular',
    voiceEnabled: false,
    onboardingStep: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.createUser(newUser);
  return res.json({ user: newUser, isNew: true });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'User not found. Please register first.' });
  }

  return res.json({ user });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user });
});

app.patch('/api/auth/profile', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const updated = db.updateUser(user.id, req.body);
  return res.json({ user: updated });
});

// Seed verified Account Aggregator data (for test/preview connection)
app.post('/api/auth/sync-demo-account', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { incomeType } = req.body;
  const targetType = incomeType || user.incomeType;
  db.updateUser(user.id, { incomeType: targetType });
  db.seedConnectedAccountData(user.id, targetType);

  return res.json({ success: true, message: 'Connected account data synchronized successfully' });
});

// Clear user data (to test true zero/empty state)
app.post('/api/auth/clear-data', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  db.clearUserData(user.id);
  return res.json({ success: true, message: 'All transactions cleared. Initial zero state restored.' });
});

// ----------------------------------------------------
// DASHBOARD & OVERVIEW
// ----------------------------------------------------
app.get('/api/dashboard/overview', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const incomes = db.getIncomeTransactions(user.id);
  const expenses = db.getExpenseTransactions(user.id);
  const bills = db.getBills(user.id);
  const goal = db.getActiveSavingsGoal(user.id);
  const savings = db.getSavingsTransactions(user.id);

  const snapshot = FinanceEngine.getOverviewSnapshot(user, incomes, expenses, bills, goal);
  const freedomScore = FinanceEngine.calculateFreedomScore(incomes, expenses, savings, bills);
  const savingsEvaluation = FinanceEngine.evaluateSavingsRule(user, goal, snapshot.todayIncome, snapshot.netBalance);

  return res.json({
    user,
    snapshot,
    freedomScore,
    savingsEvaluation,
    activeGoal: goal || null,
    totalBillsCount: bills.length,
    unreservedBillsCount: bills.filter(b => !b.reserved).length
  });
});

// ----------------------------------------------------
// INCOME TRACKING
// ----------------------------------------------------
app.get('/api/transactions/income', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const list = db.getIncomeTransactions(user.id);
  return res.json({ transactions: list });
});

app.post('/api/transactions/income', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { amount, source = 'Cash / Sales', category = 'Daily Income', note = '', date, time } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid income amount is required' });
  }

  const now = new Date();
  const txDate = date || now.toISOString().split('T')[0];
  const txTime = time || now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

  const newTx: IncomeTransaction = {
    id: 'inc_' + Date.now(),
    userId: user.id,
    amount: Number(amount),
    date: txDate,
    time: txTime,
    source: source.trim(),
    category: category.trim(),
    note: note.trim(),
    status: 'USER_ENTERED',
    sourceLabel: 'USER ENTERED',
    createdAt: new Date().toISOString()
  };

  const saved = db.addIncomeTransaction(newTx);
  return res.status(201).json({ transaction: saved });
});

app.delete('/api/transactions/income/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const success = db.deleteIncomeTransaction(user.id, req.params.id);
  return res.json({ success });
});

// ----------------------------------------------------
// EXPENSES TRACKING
// ----------------------------------------------------
app.get('/api/transactions/expenses', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const list = db.getExpenseTransactions(user.id);
  // Compute category distribution
  const total = list.reduce((s, t) => s + t.amount, 0);
  const byCat: Record<string, number> = {};
  list.forEach(t => {
    byCat[t.category] = (byCat[t.category] || 0) + t.amount;
  });

  const categories = Object.entries(byCat).map(([name, amount]) => ({
    name,
    amount,
    percentage: total > 0 ? Math.round((amount / total) * 100) : 0
  }));

  return res.json({ transactions: list, total, categories });
});

app.post('/api/transactions/expenses', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { amount, category = 'Others', note = '', date, time } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid expense amount is required' });
  }

  const now = new Date();
  const newTx: ExpenseTransaction = {
    id: 'exp_' + Date.now(),
    userId: user.id,
    amount: Number(amount),
    date: date || now.toISOString().split('T')[0],
    time: time || now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    category: category,
    note: note.trim(),
    status: 'USER_ENTERED',
    sourceLabel: 'USER ENTERED',
    confirmed: true,
    createdAt: new Date().toISOString()
  };

  const saved = db.addExpenseTransaction(newTx);
  return res.status(201).json({ transaction: saved });
});

app.post('/api/transactions/expenses/:id/confirm', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const updated = db.confirmExpenseCategory(user.id, req.params.id, req.body.category);
  return res.json({ transaction: updated });
});

// ----------------------------------------------------
// SAVINGS & GOALS
// ----------------------------------------------------
app.get('/api/savings', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const goal = db.getActiveSavingsGoal(user.id);
  const history = db.getSavingsTransactions(user.id);
  const incomes = db.getIncomeTransactions(user.id);
  const expenses = db.getExpenseTransactions(user.id);
  const bills = db.getBills(user.id);

  const snapshot = FinanceEngine.getOverviewSnapshot(user, incomes, expenses, bills, goal);
  const ruleEvaluation = FinanceEngine.evaluateSavingsRule(user, goal, snapshot.todayIncome, snapshot.netBalance);

  return res.json({
    goal: goal || null,
    history,
    ruleEvaluation,
    totalSaved: goal ? goal.currentSaved : 0,
    targetAmount: goal ? goal.targetAmount : 0,
    progressPercent: goal && goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100)) : 0,
    streakDays: history.length
  });
});

app.post('/api/savings/goal', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { name = 'My Savings Goal', targetAmount, ruleType, thresholdAmount, saveAmount } = req.body;
  if (!targetAmount || targetAmount <= 0) {
    return res.status(400).json({ error: 'Target amount is required' });
  }

  const newGoal: SavingsGoal = {
    id: 'goal_' + Date.now(),
    userId: user.id,
    name: name.trim() || 'My Savings Goal',
    targetAmount: Number(targetAmount),
    currentSaved: 0,
    ruleType: ruleType || (user.incomeType === 'irregular' ? 'daily_threshold' : 'monthly_surplus'),
    thresholdAmount: Number(thresholdAmount) || 2000,
    saveAmount: Number(saveAmount) || 500,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const saved = db.saveOrUpdateSavingsGoal(newGoal);
  return res.status(201).json({ goal: saved });
});

app.post('/api/savings/execute', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const goal = db.getActiveSavingsGoal(user.id);
  if (!goal) return res.status(400).json({ error: 'No active savings goal' });

  const { amount, triggeredBy = 'User voluntary saving' } = req.body;
  const saveAmt = Number(amount) || goal.saveAmount;

  const stx = db.addSavingsTransaction({
    id: 'stx_' + Date.now(),
    userId: user.id,
    goalId: goal.id,
    amount: saveAmt,
    date: new Date().toISOString().split('T')[0],
    status: 'COMPLETED',
    triggeredBy,
    createdAt: new Date().toISOString()
  });

  return res.json({ transaction: stx, currentSaved: goal.currentSaved + saveAmt });
});

// ----------------------------------------------------
// LOAN ASSISTANT & FEASIBILITY REPORT
// ----------------------------------------------------
app.get('/api/loans/assessment', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const requestedAmount = req.query.amount ? Number(req.query.amount) : 0;
  const incomes = db.getIncomeTransactions(user.id);
  const expenses = db.getExpenseTransactions(user.id);
  const bills = db.getBills(user.id);

  const assessment = FinanceEngine.assessLoanAffordability(requestedAmount, incomes, expenses, bills);
  return res.json({ assessment });
});

// ----------------------------------------------------
// RESERVE MONEY & BILLS
// ----------------------------------------------------
app.get('/api/bills', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const bills = db.getBills(user.id);
  const incomes = db.getIncomeTransactions(user.id);
  const expenses = db.getExpenseTransactions(user.id);
  const totalReserved = bills.filter(b => b.reserved).reduce((s, b) => s + b.amount, 0);
  const totalNet = Math.max(0, incomes.reduce((s, t) => s + t.amount, 0) - expenses.reduce((s, t) => s + t.amount, 0));
  const safeToSpend = Math.max(0, totalNet - totalReserved);

  return res.json({
    bills,
    totalReserved,
    safeToSpend,
    totalDueSoon: bills.reduce((s, b) => s + b.amount, 0)
  });
});

app.post('/api/bills', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { title, amount, dueDate, category = 'Other' } = req.body;
  if (!title || !amount || !dueDate) {
    return res.status(400).json({ error: 'Title, amount and due date are required' });
  }

  const newBill: BillItem = {
    id: 'b_' + Date.now(),
    userId: user.id,
    title: title.trim(),
    amount: Number(amount),
    dueDate,
    category,
    reserved: false,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  const saved = db.addBill(newBill);
  return res.status(201).json({ bill: saved });
});

app.post('/api/bills/:id/toggle-reserve', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const updated = db.toggleReserveBill(user.id, req.params.id);
  if (!updated) return res.status(404).json({ error: 'Bill not found' });
  return res.json({ bill: updated });
});

// ----------------------------------------------------
// PREDICTIONS & FESTIVAL BONUS
// ----------------------------------------------------
app.get('/api/predictions/income', async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const weather = await ExternalApis.getWeather();
  const incomes = db.getIncomeTransactions(user.id);
  const prediction = FinanceEngine.generatePrediction(user, incomes, weather);

  return res.json({ prediction, weather });
});

app.get('/api/predictions/bonus', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const incomes = db.getIncomeTransactions(user.id);
  const bonus = FinanceEngine.generateBonusPrediction(user, incomes);
  const festivals = ExternalApis.getUpcomingFestivals();

  return res.json({ bonus, festivals });
});

// ----------------------------------------------------
// FINANCIAL SHOCK SIMULATOR
// ----------------------------------------------------
app.post('/api/shock-simulator', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { scenario = 'income_drop_20' } = req.body;
  const incomes = db.getIncomeTransactions(user.id);
  const expenses = db.getExpenseTransactions(user.id);
  const bills = db.getBills(user.id);

  const result = FinanceEngine.simulateShock(scenario, incomes, expenses, bills);
  return res.json({ result });
});

// ----------------------------------------------------
// INSIGHTS & AI GUIDANCE
// ----------------------------------------------------
app.get('/api/insights', async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const incomes = db.getIncomeTransactions(user.id);
  const expenses = db.getExpenseTransactions(user.id);
  const bills = db.getBills(user.id);
  const goal = db.getActiveSavingsGoal(user.id);
  const savings = db.getSavingsTransactions(user.id);

  const snapshot = FinanceEngine.getOverviewSnapshot(user, incomes, expenses, bills, goal);
  const freedomScore = FinanceEngine.calculateFreedomScore(incomes, expenses, savings, bills);

  const aiGuidance = await AIService.generateFinancialGuidance({
    userName: user.name,
    incomeType: user.incomeType,
    language: user.language,
    score: freedomScore.score,
    todayIncome: snapshot.todayIncome,
    todayExpenses: snapshot.todayExpenses,
    netBalance: snapshot.netBalance,
    totalReserved: snapshot.totalReserved,
    billsCount: bills.length,
    savingsActive: !!goal
  });

  return res.json({
    aiGuidance,
    freedomScore,
    incomeStability: freedomScore.components.incomeStability >= 22 ? 'Very Stable' : freedomScore.components.incomeStability >= 16 ? 'Moderate' : 'Variable',
    savingsHabit: freedomScore.components.savingsHabit >= 20 ? 'Excellent' : freedomScore.components.savingsHabit >= 10 ? 'Growing' : 'Needs Focus'
  });
});

// ----------------------------------------------------
// VOICE ASSISTANT INTENT
// ----------------------------------------------------
app.post('/api/voice/process', async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { transcript = '', language = user?.language || 'en' } = req.body;

  if (!transcript.trim()) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  const result = await AIService.parseVoiceCommand(transcript, language);
  return res.json({ result });
});

// ----------------------------------------------------
// AUDIT LOGS
// ----------------------------------------------------
app.get('/api/audit-logs', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const logs = db.getAuditLogs(user.id);
  return res.json({ logs });
});

// ----------------------------------------------------
// VITE OR STATIC FILE SERVING
// ----------------------------------------------------
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IncomeFlex Server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch(err => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
