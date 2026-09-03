import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({});
    } catch (err) {
      console.warn('Could not initialize GoogleGenAI client:', err);
    }
  }
  return aiClient;
}

export class AIService {
  // Personalized financial guidance and explanation
  static async generateFinancialGuidance(params: {
    userName: string;
    incomeType: string;
    language: string;
    score: number;
    todayIncome: number;
    todayExpenses: number;
    netBalance: number;
    totalReserved: number;
    billsCount: number;
    savingsActive: boolean;
  }): Promise<string> {
    const ai = getAiClient();
    if (!ai) {
      // Deterministic rule-based plain-language explanation
      if (params.netBalance <= 0) {
        return `Hello ${params.userName}, your current spending matches or exceeds recent earnings. Consider prioritizing upcoming bills in Reserve Money before new expenses.`;
      }
      if (params.totalReserved > 0) {
        return `Great progress, ${params.userName}! You have ₹${params.totalReserved.toLocaleString('en-IN')} safely reserved for upcoming dues, protecting your essential bills.`;
      }
      return `Welcome, ${params.userName}! Tracking your daily or weekly cash flow is the first step toward financial freedom. Continue adding transactions to unlock deeper resilience insights.`;
    }

    try {
      const prompt = `You are the empathetic, expert financial resilience coach of "IncomeFlex" (Tagline: "Your Money, Your Way").
User details:
- Name: ${params.userName}
- Earner Type: ${params.incomeType === 'irregular' ? 'Daily / Irregular earner (e.g. gig worker, shopkeeper)' : 'Fixed / Salaried earner'}
- Language requested: ${params.language}
- Financial Freedom Score: ${params.score > 0 ? params.score + '/100' : 'Currently building initial history'}
- Recent Daily Income: ₹${params.todayIncome}
- Recent Expenses: ₹${params.todayExpenses}
- Net Balance: ₹${params.netBalance}
- Reserved for Bills: ₹${params.totalReserved}
- Upcoming Bills Count: ${params.billsCount}
- Has Active Savings Goal: ${params.savingsActive ? 'Yes' : 'No'}

Instructions:
1. Provide a 2-3 sentence personalized, encouraging, and actionable financial insight.
2. Address the user by name with warmth.
3. Be realistic, respectful, and crystal clear (no Wall Street jargon, simple plain language).
4. Do NOT calculate new numbers, use only the verified metrics provided.
5. If the language is not English (e.g. Hindi, Tamil, Telugu, Marathi, Bengali, Kannada), translate the explanation accurately into that language, maintaining Indian Rupee (₹) symbol.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return response.text?.trim() || `Welcome ${params.userName}! Keep logging your transactions daily to build your financial resilience.`;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to heuristic:', err);
      return `Welcome ${params.userName}! Track your daily cash flow consistently to build long-term financial resilience.`;
    }
  }

  // Voice Intent & Financial Action Extraction
  // When a user speaks in any language (e.g. "Add ₹500 income", "आज मैंने 1200 रुपये कमाए", "Add 250 for petrol")
  static async parseVoiceCommand(
    transcript: string,
    language: string
  ): Promise<{
    action: 'ADD_INCOME' | 'ADD_EXPENSE' | 'CHECK_BALANCE' | 'CHECK_BILLS' | 'ASK_QUESTION' | 'UNKNOWN';
    amount?: number;
    category?: string;
    source?: string;
    confirmationText: string;
    spokenReply: string;
  }> {
    const ai = getAiClient();
    const clean = transcript.trim().toLowerCase();

    // Regex fallback for fast deterministic detection
    const numMatch = transcript.match(/(?:₹|rs|rupees|rupaye)?\s*([0-9]+(?:,[0-9]+)*)/i);
    const extractedAmount = numMatch ? parseInt(numMatch[1].replace(/,/g, ''), 10) : undefined;

    const isIncome = /(earn|kamaya|income|kamai|aaya|jama|credit|collection|biki|sales)/i.test(clean);
    const isExpense = /(spend|kharch|expense|petrol|chai|khana|rent|kharcha|debit)/i.test(clean);
    const isBalance = /(balance|kitna|paisa|bacha|kitne rupaye)/i.test(clean);
    const isBills = /(bill|due|light bill|bijli|bijlee|recharge)/i.test(clean);

    if (!ai) {
      if (isIncome && extractedAmount) {
        return {
          action: 'ADD_INCOME',
          amount: extractedAmount,
          source: 'Cash / Direct collection',
          category: 'Daily Earning',
          confirmationText: `I understood: Income of ₹${extractedAmount.toLocaleString('en-IN')}. Would you like to record it?`,
          spokenReply: `Understood income of ${extractedAmount} rupees. Please confirm to add.`
        };
      }
      if (isExpense && extractedAmount) {
        return {
          action: 'ADD_EXPENSE',
          amount: extractedAmount,
          category: 'Food',
          confirmationText: `I understood: Expense of ₹${extractedAmount.toLocaleString('en-IN')}. Would you like to record it?`,
          spokenReply: `Understood expense of ${extractedAmount} rupees. Please confirm to record.`
        };
      }
      if (isBalance) {
        return {
          action: 'CHECK_BALANCE',
          confirmationText: 'Checking your available balance and financial status.',
          spokenReply: 'Here is your current balance.'
        };
      }
      if (isBills) {
        return {
          action: 'CHECK_BILLS',
          confirmationText: 'Checking your upcoming bills and reserved funds.',
          spokenReply: 'Here are your upcoming dues.'
        };
      }
      return {
        action: 'ASK_QUESTION',
        confirmationText: `Searching answers for: "${transcript}"`,
        spokenReply: `Here is information on your query.`
      };
    }

    try {
      const prompt = `You are the voice assistant for IncomeFlex fintech app.
User voice input: "${transcript}"
Language: ${language}

Extract intent into valid JSON matching this schema:
{
  "action": "ADD_INCOME" | "ADD_EXPENSE" | "CHECK_BALANCE" | "CHECK_BILLS" | "ASK_QUESTION" | "UNKNOWN",
  "amount": number or null,
  "category": string or null,
  "source": string or null,
  "confirmationText": string (in English or user language, asking confirmation before adding money),
  "spokenReply": string (short voice text to read aloud)
}
Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        action: parsed.action || 'ASK_QUESTION',
        amount: parsed.amount || extractedAmount,
        category: parsed.category || 'General',
        source: parsed.source || 'Voice Entry',
        confirmationText: parsed.confirmationText || `I understood: "${transcript}". Proceed?`,
        spokenReply: parsed.spokenReply || `I heard you: ${transcript}`
      };
    } catch (e) {
      return {
        action: extractedAmount && isIncome ? 'ADD_INCOME' : extractedAmount && isExpense ? 'ADD_EXPENSE' : 'ASK_QUESTION',
        amount: extractedAmount,
        category: 'General',
        source: 'Voice Entry',
        confirmationText: `I understood: "${transcript}". Should I proceed?`,
        spokenReply: `Understood: ${transcript}`
      };
    }
  }
}
