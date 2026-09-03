import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Weather API (Real live data from Open-Meteo for Indian metropolitan hubs)
app.get('/api/weather', async (req, res) => {
  try {
    const lat = req.query.lat || '19.0760'; // Mumbai default
    const lon = req.query.lon || '72.8777';
    
    // Open-Meteo free public API
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&hourly=precipitation_probability&forecast_days=3`
    );
    
    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo responded with status: ${weatherRes.status}`);
    }
    
    const data = await weatherRes.json();
    const current = data.current || {};
    const code = current.weather_code || 0;
    
    // Interpret weather code
    let condition = 'Clear Sky';
    let impactText = 'Standard weather conditions. No adverse impact on mobility or retail footfall.';
    if (code >= 51 && code <= 67) {
      condition = 'Rain / Drizzle';
      impactText = 'Rainy weather expected. Food delivery orders typically surge +15-20%, while outdoor vegetable stall footfall may soften.';
    } else if (code >= 71) {
      condition = 'Heavy Showers / Storm';
      impactText = 'Severe precipitation. Commute disruptions likely; factor in 25% lower outdoor business income.';
    } else if (code >= 1 && code <= 3) {
      condition = 'Partly Cloudy';
      impactText = 'Favorable weather conditions for outdoor work and transit.';
    }

    res.json({
      temperature: current.temperature_2m || 28,
      condition,
      precipitation: current.precipitation || 0,
      impactText,
    });
  } catch (err: any) {
    console.warn('Weather API fetch failed, providing fallback context:', err.message);
    res.json({
      temperature: 29,
      condition: 'Normal / Fair',
      precipitation: 0,
      impactText: 'Standard seasonal weather. No immediate volatility to daily gig or retail operations.',
    });
  }
});

// 3. Indian Calendar & Festival API
app.get('/api/festivals', (req, res) => {
  const festivals = [
    { name: 'Ganesh Chaturthi', date: '2026-09-14', impact: 'High retail & sweets demand; gig delivery surge' },
    { name: 'Dussehra / Vijayadashami', date: '2026-10-20', impact: 'Festival purchases & bonus release season' },
    { name: 'Diwali (Deepavali)', date: '2026-11-08', impact: 'Peak annual bonus payout and major consumer spending' },
    { name: 'Christmas & Year-End', date: '2026-12-25', impact: 'Year-end bonuses and holiday gig surge' },
    { name: 'Pongal / Makar Sankranti', date: '2027-01-14', impact: 'Harvest festival purchases & family expenditure' },
    { name: 'Eid-ul-Fitr', date: '2027-03-10', impact: 'High retail volume, gifts, and culinary surge' },
  ];
  res.json({ festivals });
});

// Helper: Generate deterministic financial insights based on real user figures
function generateDeterministicInsights(snapshot: any, profile: any) {
  const availableMoney = snapshot?.availableMoney || 0;
  const daysOfBuffer = snapshot?.daysOfBuffer || 0;
  const upcomingBills = snapshot?.upcomingBillsTotal || 0;
  const reservedMoney = snapshot?.reservedMoneyTotal || 0;
  const safeToSpend = snapshot?.safeToSpend || 0;

  const insights = [];

  // Insight 1: Cash buffer runway
  if (daysOfBuffer >= 14) {
    insights.push({
      title: 'Strong Cash Runway',
      type: 'POSITIVE',
      text: `Your available liquid reserves of ₹${availableMoney.toLocaleString('en-IN')} provide approximately ${daysOfBuffer} days of essential living coverage at your current burn rate.`,
      traceability: 'Calculated as liquid balance divided by daily essential burn rate.',
    });
  } else {
    insights.push({
      title: 'Buffer Attention Recommended',
      type: 'WARNING',
      text: `You currently hold approximately ${daysOfBuffer} days of essential cash runway. Prioritize upcoming high-velocity earning shifts to reach a 14-day safety threshold.`,
      traceability: `Available cash ₹${availableMoney.toLocaleString('en-IN')} compared with daily essential burn obligations.`,
    });
  }

  // Insight 2: Bill Reservation protection
  if (upcomingBills > 0) {
    if (reservedMoney >= upcomingBills) {
      insights.push({
        title: 'Upcoming Dues 100% Protected',
        type: 'POSITIVE',
        text: `All ₹${upcomingBills.toLocaleString('en-IN')} in committed bills are safely locked in your Reserve Money vault, ensuring your safe-to-spend balance (₹${safeToSpend.toLocaleString('en-IN')}) is completely unencumbered.`,
        traceability: 'Computed from upcoming active bill items marked as reserved.',
      });
    } else {
      const gap = upcomingBills - reservedMoney;
      insights.push({
        title: 'Bill Reservation Gap',
        type: 'ALERT',
        text: `₹${gap.toLocaleString('en-IN')} in scheduled bills is unreserved. Lock these funds in before making discretionary purchases.`,
        traceability: 'Tracked against verified biller dues and recurring utilities.',
      });
    }
  }

  // Insight 3: Income pattern discipline
  if (profile?.incomeType === 'VARIABLE') {
    insights.push({
      title: 'Variable Income Smoothing',
      type: 'INFO',
      text: `IncomeFlex enforces a 30% volatility haircut and zero-deduction lean day protection on your variable earnings, ensuring you never over-commit on peak earning days.`,
      traceability: 'Conservative volatility discount applied to irregular earnings streams.',
    });
  } else {
    insights.push({
      title: 'Fixed Salary Scheduling',
      type: 'INFO',
      text: `With predictable monthly salary timing, scheduling recurring bill reservations immediately on your pay date eliminates penalty risk and maximizes your resilience score.`,
      traceability: 'Derived from predictable salary credit cadence.',
    });
  }

  return insights;
}

// Helper: Call Gemini with fallback to gemini-3.1-flash-lite on 503 high demand
async function generateContentWithFallback(ai: GoogleGenAI, config: any) {
  try {
    return await ai.models.generateContent({
      ...config,
      model: config.model || 'gemini-3.8-flash',
    });
  } catch (err: any) {
    const isHighDemand =
      err?.status === 503 ||
      err?.code === 503 ||
      err?.status === 'UNAVAILABLE' ||
      err?.message?.includes('high demand') ||
      err?.message?.includes('503');

    if (isHighDemand) {
      console.warn('Primary model experiencing temporary high demand (503). Falling back to gemini-3.1-flash-lite...');
      try {
        return await ai.models.generateContent({
          ...config,
          model: 'gemini-3.1-flash-lite',
        });
      } catch (fallbackErr: any) {
        console.warn('Fallback model also temporarily unavailable, switching to local financial engine.');
        throw fallbackErr;
      }
    }
    throw err;
  }
}

// 4. Voice Intent Parser (powered by server-side Gemini with fallback)
app.post('/api/voice/interpret', async (req, res) => {
  const { speechText, incomeType } = req.body;
  if (!speechText || typeof speechText !== 'string') {
    return res.status(400).json({ error: 'speechText is required' });
  }

  const parseFallback = () => {
    const lower = speechText.toLowerCase();
    const amountMatch = speechText.match(/(\d[\d,]*)/);
    const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, ''), 10) : 0;
    
    let action: string = 'CHECK_BALANCE';
    let category = 'OTHER';
    let description = speechText;

    if (lower.includes('earn') || lower.includes('income') || lower.includes('got') || lower.includes('received') || lower.includes('delivery') || lower.includes('salary')) {
      action = 'ADD_INCOME';
      category = incomeType === 'FIXED' ? 'SALARY' : 'GIG_PAYOUT';
      description = `Income via voice: "${speechText}"`;
    } else if (lower.includes('spent') || lower.includes('paid') || lower.includes('expense') || lower.includes('bought') || lower.includes('petrol') || lower.includes('food')) {
      action = 'ADD_EXPENSE';
      if (lower.includes('petrol') || lower.includes('fuel')) category = 'TRANSPORT';
      else if (lower.includes('food') || lower.includes('grocery') || lower.includes('lunch')) category = 'FOOD_GROCERIES';
      else if (lower.includes('rent')) category = 'RENT';
      else category = 'UTILITIES';
      description = `Expense via voice: "${speechText}"`;
    } else if (lower.includes('bill') || lower.includes('due')) {
      action = 'CHECK_BILLS';
    } else if (lower.includes('save') || lower.includes('savings')) {
      action = 'SAVINGS_STATUS';
    }

    return {
      action,
      amount,
      category,
      description,
      date: new Date().toISOString().split('T')[0],
      source: 'USER_ENTERED',
      confidence: 'FALLBACK_RULE',
      rawText: speechText,
    };
  };

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({ parsed: parseFallback() });
  }

  try {
    const prompt = `You are the Voice Financial Assistant for IncomeFlex.
Analyze this user spoken query: "${speechText}".
User profile income type: ${incomeType || 'VARIABLE'}.
Identify:
1. action: "ADD_INCOME" | "ADD_EXPENSE" | "CHECK_BALANCE" | "CHECK_BILLS" | "SAVINGS_STATUS" | "UNKNOWN"
2. amount: number (0 if no financial figure mentioned)
3. category: for income ("DAILY_WAGE" | "GIG_PAYOUT" | "SHOP_SALES" | "SALARY" | "BONUS" | "BENEFIT" | "OTHER") or for expense ("RENT" | "FOOD_GROCERIES" | "UTILITIES" | "TRANSPORT" | "HEALTH" | "LOAN_EMI" | "BUSINESS_SUPPLIES" | "EDUCATION" | "OTHER")
4. description: short clean summary
5. source: "USER_ENTERED"`;

    const response = await generateContentWithFallback(ai, {
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            source: { type: Type.STRING },
          },
          required: ['action', 'amount', 'category', 'description'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({
      parsed: {
        ...parsedData,
        date: new Date().toISOString().split('T')[0],
        confidence: 'GEMINI_AI',
        rawText: speechText,
      },
    });
  } catch (err: any) {
    console.warn('Voice intent using deterministic fallback due to service status:', err?.message || err);
    res.json({ parsed: parseFallback() });
  }
});

// 5. Plain-Language AI Insights Generator (Traceable to real user data)
app.post('/api/gemini/insights', async (req, res) => {
  const { profile = {}, snapshot = {}, recentIncomes = [], recentExpenses = [] } = req.body;
  const deterministic = generateDeterministicInsights(snapshot, profile);
  const defaultSummary = deterministic.map((i) => `• ${i.title}: ${i.text}`).join('\n\n');

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      insights: deterministic,
      summaryText: defaultSummary,
    });
  }

  try {
    const prompt = `You are IncomeFlex's Senior Financial Resilience Specialist.
Analyze this user's real financial data:
- User Name: ${profile.name || 'User'}
- Income Type: ${profile.incomeType || 'VARIABLE'} (${profile.occupation || 'Earner'})
- Available Liquid Money: ₹${snapshot.availableMoney || 0}
- Safe-to-Spend Right Now: ₹${snapshot.safeToSpend || 0}
- Reserved for Bills: ₹${snapshot.reservedMoneyTotal || 0} of ₹${snapshot.upcomingBillsTotal || 0}
- Financial Resilience Score: ${snapshot.resilienceScore || 65}/100 (${snapshot.resilienceTier || 'HEALTHY'})
- Days of Buffer: ${snapshot.daysOfBuffer || 12} days
- Recent Income Count: ${recentIncomes?.length || 0}
- Recent Expenses Count: ${recentExpenses?.length || 0}

Generate 3 concise, highly actionable, plain-language financial insights.
Every insight MUST strictly reference real user numbers and explain the exact mathematical rationale.
Return JSON array with items containing { title: string, type: "POSITIVE" | "WARNING" | "ALERT" | "INFO", text: string, traceability: string }.`;

    const response = await generateContentWithFallback(ai, {
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              type: { type: Type.STRING },
              text: { type: Type.STRING },
              traceability: { type: Type.STRING },
            },
            required: ['title', 'type', 'text', 'traceability'],
          },
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const aiSummary = parsed.map((i) => `• ${i.title}: ${i.text}`).join('\n\n');
        return res.json({
          insights: parsed,
          summaryText: aiSummary,
        });
      }
    }

    res.json({
      insights: deterministic,
      summaryText: defaultSummary,
    });
  } catch (err: any) {
    console.warn('Gemini insights using deterministic fallback due to service status:', err?.message || err);
    res.json({
      insights: deterministic,
      summaryText: defaultSummary,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IncomeFlex server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
