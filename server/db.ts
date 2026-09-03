import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  IncomeTransaction,
  ExpenseTransaction,
  SavingsGoal,
  SavingsTransaction,
  BillItem,
  AuditLog
} from './types';

interface DatabaseSchema {
  users: UserProfile[];
  incomeTransactions: IncomeTransaction[];
  expenseTransactions: ExpenseTransaction[];
  savingsGoals: SavingsGoal[];
  savingsTransactions: SavingsTransaction[];
  bills: BillItem[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'incomeflex_data.json');

// Initial clean database state
const defaultDb: DatabaseSchema = {
  users: [],
  incomeTransactions: [],
  expenseTransactions: [],
  savingsGoals: [],
  savingsTransactions: [],
  bills: [],
  auditLogs: []
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading database file:', err);
    }
    this.saveData(defaultDb);
    return defaultDb;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database file:', err);
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // Users
  getUserById(id: string): UserProfile | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): UserProfile | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: UserProfile): UserProfile {
    this.data.users.push(user);
    this.addAuditLog(user.id, 'USER_REGISTERED', `User ${user.name} created account`);
    this.persist();
    return user;
  }

  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.addAuditLog(id, 'USER_UPDATED', `Updated fields: ${Object.keys(updates).join(', ')}`);
    this.persist();
    return this.data.users[idx];
  }

  // Income Transactions
  getIncomeTransactions(userId: string): IncomeTransaction[] {
    return this.data.incomeTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date + 'T' + (b.time || '00:00')).getTime() - new Date(a.date + 'T' + (a.time || '00:00')).getTime());
  }

  addIncomeTransaction(tx: IncomeTransaction): IncomeTransaction {
    this.data.incomeTransactions.push(tx);
    this.addAuditLog(tx.userId, 'INCOME_ADDED', `Added ₹${tx.amount} (${tx.source})`);
    this.persist();
    return tx;
  }

  deleteIncomeTransaction(userId: string, id: string): boolean {
    const prevLen = this.data.incomeTransactions.length;
    this.data.incomeTransactions = this.data.incomeTransactions.filter(t => !(t.id === id && t.userId === userId));
    if (this.data.incomeTransactions.length !== prevLen) {
      this.addAuditLog(userId, 'INCOME_DELETED', `Deleted income tx ${id}`);
      this.persist();
      return true;
    }
    return false;
  }

  // Expense Transactions
  getExpenseTransactions(userId: string): ExpenseTransaction[] {
    return this.data.expenseTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date + 'T' + (b.time || '00:00')).getTime() - new Date(a.date + 'T' + (a.time || '00:00')).getTime());
  }

  addExpenseTransaction(tx: ExpenseTransaction): ExpenseTransaction {
    this.data.expenseTransactions.push(tx);
    this.addAuditLog(tx.userId, 'EXPENSE_ADDED', `Added ₹${tx.amount} (${tx.category})`);
    this.persist();
    return tx;
  }

  confirmExpenseCategory(userId: string, id: string, category?: ExpenseTransaction['category']): ExpenseTransaction | null {
    const item = this.data.expenseTransactions.find(t => t.id === id && t.userId === userId);
    if (!item) return null;
    item.confirmed = true;
    if (category) item.category = category;
    this.persist();
    return item;
  }

  // Savings Goals
  getSavingsGoals(userId: string): SavingsGoal[] {
    return this.data.savingsGoals.filter(g => g.userId === userId);
  }

  getActiveSavingsGoal(userId: string): SavingsGoal | undefined {
    return this.data.savingsGoals.find(g => g.userId === userId && g.active);
  }

  saveOrUpdateSavingsGoal(goal: SavingsGoal): SavingsGoal {
    // Deactivate existing
    this.data.savingsGoals.forEach(g => {
      if (g.userId === goal.userId) g.active = false;
    });
    const existingIdx = this.data.savingsGoals.findIndex(g => g.id === goal.id);
    if (existingIdx >= 0) {
      this.data.savingsGoals[existingIdx] = { ...goal, active: true, updatedAt: new Date().toISOString() };
    } else {
      this.data.savingsGoals.push({ ...goal, active: true });
    }
    this.addAuditLog(goal.userId, 'SAVINGS_GOAL_SET', `Goal: ${goal.name}, Target ₹${goal.targetAmount}, Rule threshold ₹${goal.thresholdAmount}`);
    this.persist();
    return goal;
  }

  getSavingsTransactions(userId: string): SavingsTransaction[] {
    return this.data.savingsTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addSavingsTransaction(tx: SavingsTransaction): SavingsTransaction {
    this.data.savingsTransactions.push(tx);
    // update goal currentSaved
    const goal = this.getActiveSavingsGoal(tx.userId);
    if (goal) {
      goal.currentSaved += tx.amount;
      goal.updatedAt = new Date().toISOString();
    }
    this.addAuditLog(tx.userId, 'SAVINGS_EXECUTED', `Saved ₹${tx.amount} towards goal`);
    this.persist();
    return tx;
  }

  // Bills
  getBills(userId: string): BillItem[] {
    return this.data.bills
      .filter(b => b.userId === userId)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  addBill(bill: BillItem): BillItem {
    this.data.bills.push(bill);
    this.addAuditLog(bill.userId, 'BILL_ADDED', `Bill ${bill.title} for ₹${bill.amount} due ${bill.dueDate}`);
    this.persist();
    return bill;
  }

  toggleReserveBill(userId: string, billId: string): BillItem | null {
    const b = this.data.bills.find(item => item.id === billId && item.userId === userId);
    if (!b) return null;
    b.reserved = !b.reserved;
    b.status = b.reserved ? 'RESERVED' : 'PENDING';
    b.reservedAt = b.reserved ? new Date().toISOString() : undefined;
    this.addAuditLog(userId, 'BILL_RESERVE_TOGGLED', `Bill ${b.title} reserved status: ${b.reserved}`);
    this.persist();
    return b;
  }

  // Audit Logs
  addAuditLog(userId: string, action: string, details: string) {
    this.data.auditLogs.push({
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    });
    if (this.data.auditLogs.length > 2000) {
      this.data.auditLogs.splice(0, 500);
    }
  }

  getAuditLogs(userId: string): AuditLog[] {
    return this.data.auditLogs
      .filter(l => l.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);
  }

  // Data reset or demo connection for testing Account Aggregator
  seedConnectedAccountData(userId: string, incomeType: 'irregular' | 'fixed') {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Wipe previous data for this user to ensure clean state
    this.data.incomeTransactions = this.data.incomeTransactions.filter(t => t.userId !== userId);
    this.data.expenseTransactions = this.data.expenseTransactions.filter(t => t.userId !== userId);
    this.data.bills = this.data.bills.filter(b => b.userId !== userId);
    this.data.savingsGoals = this.data.savingsGoals.filter(g => g.userId !== userId);
    this.data.savingsTransactions = this.data.savingsTransactions.filter(t => t.userId !== userId);

    if (incomeType === 'irregular') {
      // 14 days of realistic irregular gig/shopkeeper data
      const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (13 - i));
        return d.toISOString().split('T')[0];
      });

      const incomePattern = [1600, 1850, 1400, 2100, 2300, 2900, 2750, 1700, 1950, 1800, 2200, 2600, 3100, 2450];
      const sources = ['Vegetable sales', 'Shop sales', 'Delivery gig', 'Vegetable sales', 'Customer UPI', 'Weekend rush sales', 'Weekend orders', 'Shop sales', 'Vegetable sales', 'Delivery gig', 'Customer UPI', 'Vegetable sales', 'Weekend shop sales', 'Daily collection'];

      dates.forEach((date, i) => {
        this.data.incomeTransactions.push({
          id: `inc_${userId}_${i}`,
          userId,
          amount: incomePattern[i],
          date,
          time: '18:30',
          source: sources[i],
          category: 'Sales / Gig',
          status: 'VERIFIED',
          sourceLabel: 'VERIFIED BANK DATA',
          createdAt: new Date(date + 'T18:30:00Z').toISOString()
        });
      });

      // Expenses
      const expenseList = [
        { desc: 'Wholesale mandi stock', amount: 800, date: dates[12], cat: 'Household' as const },
        { desc: 'Fuel / Auto LPG', amount: 250, date: dates[12], cat: 'Transport' as const },
        { desc: 'Groceries & provisions', amount: 450, date: dates[13], cat: 'Food' as const },
        { desc: 'Stall electricity charge', amount: 180, date: dates[13], cat: 'Utilities' as const },
      ];

      expenseList.forEach((exp, i) => {
        this.data.expenseTransactions.push({
          id: `exp_${userId}_${i}`,
          userId,
          amount: exp.amount,
          date: exp.date,
          time: '14:00',
          category: exp.cat,
          note: exp.desc,
          status: 'VERIFIED',
          sourceLabel: 'VERIFIED BANK DATA',
          confirmed: true,
          createdAt: new Date().toISOString()
        });
      });

      // Bills
      const d1 = new Date(now); d1.setDate(d1.getDate() + 2);
      const d2 = new Date(now); d2.setDate(d2.getDate() + 5);
      const d3 = new Date(now); d3.setDate(d3.getDate() + 8);

      this.data.bills.push(
        { id: `b_${userId}_1`, userId, title: 'Electricity Bill', amount: 1250, dueDate: d1.toISOString().split('T')[0], category: 'Electricity', reserved: true, reservedAt: new Date().toISOString(), status: 'RESERVED', createdAt: new Date().toISOString() },
        { id: `b_${userId}_2`, userId, title: 'Mobile Recharge', amount: 199, dueDate: d2.toISOString().split('T')[0], category: 'Mobile', reserved: true, reservedAt: new Date().toISOString(), status: 'RESERVED', createdAt: new Date().toISOString() },
        { id: `b_${userId}_3`, userId, title: 'Water Bill', amount: 600, dueDate: d3.toISOString().split('T')[0], category: 'Water', reserved: true, reservedAt: new Date().toISOString(), status: 'RESERVED', createdAt: new Date().toISOString() }
      );

      // Active Savings Goal
      const goal: SavingsGoal = {
        id: `goal_${userId}_1`,
        userId,
        name: 'My Dream Goal 🚀',
        targetAmount: 25000,
        currentSaved: 6000,
        ruleType: 'daily_threshold',
        thresholdAmount: 2000,
        saveAmount: 500,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.data.savingsGoals.push(goal);

      // Past 12 savings events
      for (let j = 1; j <= 12; j++) {
        const sd = new Date(now);
        sd.setDate(sd.getDate() - (14 - j));
        this.data.savingsTransactions.push({
          id: `stx_${userId}_${j}`,
          userId,
          goalId: goal.id,
          amount: 500,
          date: sd.toISOString().split('T')[0],
          status: 'COMPLETED',
          triggeredBy: 'Daily income goal reached (>= ₹2,000)',
          createdAt: sd.toISOString()
        });
      }
    } else {
      // Fixed salary user: monthly salary
      const prevMonth = new Date(now); prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prev2Month = new Date(now); prev2Month.setMonth(prev2Month.getMonth() - 2);

      this.data.incomeTransactions.push(
        { id: `inc_sal_1`, userId, amount: 45000, date: prev2Month.toISOString().split('T')[0], time: '09:00', source: 'Salary Credit - Employer', category: 'Salary', status: 'VERIFIED', sourceLabel: 'VERIFIED BANK DATA', createdAt: prev2Month.toISOString() },
        { id: `inc_sal_2`, userId, amount: 45000, date: prevMonth.toISOString().split('T')[0], time: '09:00', source: 'Salary Credit - Employer', category: 'Salary', status: 'VERIFIED', sourceLabel: 'VERIFIED BANK DATA', createdAt: prevMonth.toISOString() },
        { id: `inc_sal_3`, userId, amount: 45000, date: todayStr, time: '09:00', source: 'Salary Credit - Employer', category: 'Salary', status: 'VERIFIED', sourceLabel: 'VERIFIED BANK DATA', createdAt: new Date().toISOString() }
      );

      this.data.expenseTransactions.push(
        { id: `exp_fix_1`, userId, amount: 12000, date: todayStr, time: '10:00', category: 'Household', note: 'House Rent', status: 'VERIFIED', sourceLabel: 'VERIFIED BANK DATA', confirmed: true, createdAt: new Date().toISOString() },
        { id: `exp_fix_2`, userId, amount: 6500, date: todayStr, time: '12:00', category: 'Food', note: 'Monthly Groceries', status: 'VERIFIED', sourceLabel: 'VERIFIED BANK DATA', confirmed: true, createdAt: new Date().toISOString() },
        { id: `exp_fix_3`, userId, amount: 4200, date: todayStr, time: '15:00', category: 'Transport', note: 'Fuel & Metro card', status: 'VERIFIED', sourceLabel: 'VERIFIED BANK DATA', confirmed: true, createdAt: new Date().toISOString() },
        { id: `exp_fix_4`, userId, amount: 2800, date: todayStr, time: '16:00', category: 'Utilities', note: 'Broadband & electricity', status: 'VERIFIED', sourceLabel: 'VERIFIED BANK DATA', confirmed: true, createdAt: new Date().toISOString() },
        { id: `exp_fix_5`, userId, amount: 2900, date: todayStr, time: '17:00', category: 'Others', note: 'Subscriptions & personal', status: 'VERIFIED', sourceLabel: 'VERIFIED BANK DATA', confirmed: true, createdAt: new Date().toISOString() }
      );

      const d1 = new Date(now); d1.setDate(d1.getDate() + 3);
      this.data.bills.push(
        { id: `b_${userId}_10`, userId, title: 'House Rent', amount: 12000, dueDate: d1.toISOString().split('T')[0], category: 'Rent', reserved: true, reservedAt: new Date().toISOString(), status: 'RESERVED', createdAt: new Date().toISOString() }
      );

      const goal: SavingsGoal = {
        id: `goal_${userId}_2`,
        userId,
        name: 'Emergency Fund 🛡️',
        targetAmount: 100000,
        currentSaved: 30000,
        ruleType: 'monthly_surplus',
        thresholdAmount: 10000,
        saveAmount: 5000,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.data.savingsGoals.push(goal);
    }

    this.addAuditLog(userId, 'CONNECTED_ACCOUNT_SYNC', `Synchronized verified financial records from connected Account Aggregator`);
    this.persist();
  }

  clearUserData(userId: string) {
    this.data.incomeTransactions = this.data.incomeTransactions.filter(t => t.userId !== userId);
    this.data.expenseTransactions = this.data.expenseTransactions.filter(t => t.userId !== userId);
    this.data.bills = this.data.bills.filter(b => b.userId !== userId);
    this.data.savingsGoals = this.data.savingsGoals.filter(g => g.userId !== userId);
    this.data.savingsTransactions = this.data.savingsTransactions.filter(t => t.userId !== userId);
    this.addAuditLog(userId, 'USER_DATA_CLEARED', 'User cleared all financial transactions');
    this.persist();
  }
}

export const db = new Database();
