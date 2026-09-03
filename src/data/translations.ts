import { LanguageCode } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  chooseLanguage: string;
  bankingMadeSimple: string;
  continueBtn: string;
  voiceSetupTitle: string;
  voiceSetupSubtitle: string;
  enableVoice: string;
  maybeLater: string;
  checkBalance: string;
  trackIncomeExpenses: string;
  remindBills: string;
  answerQuestions: string;
  
  // Dashboard / Snapshot
  financialResilienceScore: string;
  currentSnapshot: string;
  availableMoney: string;
  incomeThisPeriod: string;
  expensesThisPeriod: string;
  upcomingBills: string;
  savingsProgress: string;
  borrowingCapacity: string;
  financialInsights: string;
  safeToSpend: string;
  reservedMoney: string;
  daysOfRunway: string;
  lastUpdated: string;
  
  // Empty states
  connectAccountPrompt: string;
  addFirstIncomePrompt: string;
  connectAccountBtn: string;
  addIncomeBtn: string;
  noBillsRecorded: string;
  noSavingsRecorded: string;
  notEnoughDataPrediction: string;

  // Simple Mode
  simpleModeToggle: string;
  simpleModeTitle: string;
  simpleMoneyIHave: string;
  simpleMoneyIMayEarn: string;
  simpleMoneyINeed: string;
  simpleMoneyISaved: string;
  simpleMoneyIMayBorrow: string;

  // Navigation & Quick Actions
  navOverview: string;
  navTrackIncome: string;
  navPredict: string;
  navSavings: string;
  navLoanPlanner: string;
  navReserve: string;
  navExpenses: string;
  navShockSimulator: string;
  navInsights: string;
  navProfile: string;

  // Data transparency
  verifiedBankData: string;
  userEntered: string;
  estimated: string;
  predicted: string;
  connectedBusinessData: string;

  // Actions
  addExpenseBtn: string;
  addByVoiceBtn: string;
  confirmBtn: string;
  cancelBtn: string;
  editBtn: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'IncomeFlex',
    tagline: 'Your Money, Your Way',
    chooseLanguage: 'Choose Your Language',
    bankingMadeSimple: 'Banking made simple in your language',
    continueBtn: 'Continue',
    voiceSetupTitle: "Let's make this hands-free",
    voiceSetupSubtitle: 'Speak naturally to manage your financial life',
    enableVoice: 'Enable Voice Assistant',
    maybeLater: 'Maybe later',
    checkBalance: 'Checking your live balance',
    trackIncomeExpenses: 'Tracking irregular income & expenses',
    remindBills: 'Reminding upcoming bills & dues',
    answerQuestions: 'Answering financial resilience questions',
    
    financialResilienceScore: 'Financial Resilience Score',
    currentSnapshot: "Today's Financial Snapshot",
    availableMoney: 'Available Money',
    incomeThisPeriod: 'Income (This Period)',
    expensesThisPeriod: 'Expenses (This Period)',
    upcomingBills: 'Upcoming Bills & Dues',
    savingsProgress: 'Savings Progress',
    borrowingCapacity: 'Safe Borrowing Capacity',
    financialInsights: 'Personalized Financial Insights',
    safeToSpend: 'Safe-to-Spend Right Now',
    reservedMoney: 'Planned / Reserved in IncomeFlex',
    daysOfRunway: 'Days of Essential Runway',
    lastUpdated: 'Last updated',

    connectAccountPrompt: 'Connect your account to see your full financial picture.',
    addFirstIncomePrompt: 'Add your first income or gig payout to get started.',
    connectAccountBtn: 'Connect Financial Account',
    addIncomeBtn: '+ Add Income',
    noBillsRecorded: 'No upcoming bills recorded yet.',
    noSavingsRecorded: 'Your savings journey starts here.',
    notEnoughDataPrediction: 'Not enough data to make a reliable prediction yet.',

    simpleModeToggle: 'Simple Mode',
    simpleModeTitle: 'Plain Language Overview',
    simpleMoneyIHave: '💰 Money I Have',
    simpleMoneyIMayEarn: '💵 Money I May Earn',
    simpleMoneyINeed: '📅 Money I Need Soon',
    simpleMoneyISaved: '🛟 Money I Saved',
    simpleMoneyIMayBorrow: '💳 Money I May Borrow Safely',

    navOverview: 'Overview',
    navTrackIncome: 'Track Income',
    navPredict: 'Predict',
    navSavings: 'Savings Goal',
    navLoanPlanner: 'Safe Loan',
    navReserve: 'Reserve Money',
    navExpenses: 'Expenses',
    navShockSimulator: 'Shock Simulator',
    navInsights: 'Insights',
    navProfile: 'Settings',

    verifiedBankData: 'VERIFIED BANK DATA',
    userEntered: 'USER ENTERED',
    estimated: 'ESTIMATED',
    predicted: 'PREDICTED',
    connectedBusinessData: 'CONNECTED BUSINESS DATA',

    addExpenseBtn: '+ Add Expense',
    addByVoiceBtn: 'Add by Voice',
    confirmBtn: 'Confirm',
    cancelBtn: 'Cancel',
    editBtn: 'Edit',
  },
  hi: {
    appName: 'IncomeFlex',
    tagline: 'आपका पैसा, आपकी मर्जी',
    chooseLanguage: 'अपनी भाषा चुनें',
    bankingMadeSimple: 'आपकी अपनी भाषा में सरल वित्तीय प्रबंधन',
    continueBtn: 'आगे बढ़ें',
    voiceSetupTitle: 'इसे हाथ मुक्त (hands-free) बनाएं',
    voiceSetupSubtitle: 'अपने वित्त को संभालने के लिए सहजता से बोलें',
    enableVoice: 'वॉइस असिस्टेंट चालू करें',
    maybeLater: 'बाद में',
    checkBalance: 'बैलेंस जांचें',
    trackIncomeExpenses: 'आय और खर्च ट्रैक करें',
    remindBills: 'आगामी बिल और देनदारियां याद रखें',
    answerQuestions: 'अपने वित्तीय सवालों के जवाब पाएं',

    financialResilienceScore: 'वित्तीय मजबूती स्कोर',
    currentSnapshot: 'आज का वित्तीय सारांश',
    availableMoney: 'उपलब्ध राशि',
    incomeThisPeriod: 'इस अवधि की कुल आय',
    expensesThisPeriod: 'कुल खर्च',
    upcomingBills: 'आगामी बिल और देय',
    savingsProgress: 'बचत प्रगति',
    borrowingCapacity: 'सुरक्षित ऋण क्षमता',
    financialInsights: 'व्यक्तिगत वित्तीय अंतर्दृष्टि',
    safeToSpend: 'खर्च के लिए सुरक्षित राशि',
    reservedMoney: 'IncomeFlex में आरक्षित (Reserved)',
    daysOfRunway: 'सुरक्षित दिनों का बफर',
    lastUpdated: 'अंतिम अपडेट',

    connectAccountPrompt: 'अपनी वित्तीय स्थिति देखने के लिए खाता जोड़ें।',
    addFirstIncomePrompt: 'शुरुआत करने के लिए अपनी पहली आय दर्ज करें।',
    connectAccountBtn: 'खाता कनेक्ट करें',
    addIncomeBtn: '+ आय जोड़ें',
    noBillsRecorded: 'कोई आगामी बिल दर्ज नहीं है।',
    noSavingsRecorded: 'आपकी बचत यात्रा यहीं से शुरू होती है।',
    notEnoughDataPrediction: 'सटीक भविष्यवाणी के लिए अभी पर्याप्त डेटा नहीं है।',

    simpleModeToggle: 'सरल मोड',
    simpleModeTitle: 'आसान भाषा में सारांश',
    simpleMoneyIHave: '💰 मेरे पास उपलब्ध पैसा',
    simpleMoneyIMayEarn: '💵 संभावित आगामी कमाई',
    simpleMoneyINeed: '📅 जल्द जरूरी खर्चे व बिल',
    simpleMoneyISaved: '🛟 मेरी कुल बचत',
    simpleMoneyIMayBorrow: '💳 सुरक्षित उधार लेने की सीमा',

    navOverview: 'होम',
    navTrackIncome: 'आय ट्रैकर',
    navPredict: 'पूर्वानुमान',
    navSavings: 'बचत लक्ष्य',
    navLoanPlanner: 'ऋण योजना',
    navReserve: 'पैसे आरक्षित करें',
    navExpenses: 'खर्च विश्लेषण',
    navShockSimulator: 'शॉक सिम्युलेटर',
    navInsights: 'सलाह',
    navProfile: 'सेटिंग्स',

    verifiedBankData: 'सत्यापित बैंक डेटा',
    userEntered: 'उपयोगकर्ता द्वारा दर्ज',
    estimated: 'अनुमानित',
    predicted: 'पूर्वानुमानित',
    connectedBusinessData: 'कनेक्टेड व्यापार डेटा',

    addExpenseBtn: '+ खर्च जोड़ें',
    addByVoiceBtn: 'आवाज़ से जोड़ें',
    confirmBtn: 'पुष्टि करें',
    cancelBtn: 'रद्द करें',
    editBtn: 'संपादित करें',
  },
  mr: {
    appName: 'IncomeFlex',
    tagline: 'तुमचे पैसे, तुमची पद्धत',
    chooseLanguage: 'तुमची भाषा निवडा',
    bankingMadeSimple: 'तुमच्या भाषेत सोपे आर्थिक नियोजन',
    continueBtn: 'पुढे जा',
    voiceSetupTitle: 'हे हँड्स-फ्री करा',
    voiceSetupSubtitle: 'तुमचे आर्थिक नियोजन बोलून करा',
    enableVoice: 'व्हॉइस असिस्टंट सुरू करा',
    maybeLater: 'नंतर करू',
    checkBalance: 'शिल्लक तपासा',
    trackIncomeExpenses: 'उत्पन्न आणि खर्च नोंदवा',
    remindBills: 'येणारे बिल आणि देणी आठवण करा',
    answerQuestions: 'तुमच्या प्रश्नांची उत्तरे मिळवा',

    financialResilienceScore: 'आर्थिक लवचिकता स्कोअर',
    currentSnapshot: 'आजचा आर्थिक स्नॅपशॉट',
    availableMoney: 'उपलब्ध शिल्लक',
    incomeThisPeriod: 'या कालावधीतील उत्पन्न',
    expensesThisPeriod: 'एकूण खर्च',
    upcomingBills: 'येणारी बिले व देणी',
    savingsProgress: 'बचतीची प्रगती',
    borrowingCapacity: 'सुरक्षित कर्ज मर्यादा',
    financialInsights: 'वैयक्तिकृत आर्थिक सल्ले',
    safeToSpend: 'खर्चासाठी सुरक्षित रक्कम',
    reservedMoney: 'IncomeFlex मध्ये राखीव रक्कम',
    daysOfRunway: 'सुरक्षित दिवसांचा बफर',
    lastUpdated: 'शेवटचे अपडेट',

    connectAccountPrompt: 'तुमचे आर्थिक चित्र पाहण्यासाठी खाते जोडा.',
    addFirstIncomePrompt: 'सुरुवात करण्यासाठी पहिले उत्पन्न नोंदवा.',
    connectAccountBtn: 'बँक खाते जोडा',
    addIncomeBtn: '+ उत्पन्न जोडा',
    noBillsRecorded: 'अद्याप कोणतीही बिले नोंदवलेली नाहीत.',
    noSavingsRecorded: 'तुमचा बचतीचा प्रवास येथून सुरू होतो.',
    notEnoughDataPrediction: 'अचूक अंदाजासाठी सध्या पुरेसा डेटा उपलब्ध नाही.',

    simpleModeToggle: 'सोपा मोड',
    simpleModeTitle: 'सोप्या भाषेतील माहिती',
    simpleMoneyIHave: '💰 माझ्याकडील शिल्लक पैसे',
    simpleMoneyIMayEarn: '💵 संभाव्य मिळणारे उत्पन्न',
    simpleMoneyINeed: '📅 लवकरच लागणारे पैसे व बिले',
    simpleMoneyISaved: '🛟 माझी साठवलेली बचत',
    simpleMoneyIMayBorrow: '💳 सुरक्षितपणे घेता येणारे कर्ज',

    navOverview: 'मुख्यपृष्ठ',
    navTrackIncome: 'उत्पन्न ट्रॅकर',
    navPredict: 'अंदाज',
    navSavings: 'बचत ध्येय',
    navLoanPlanner: 'कर्ज नियोजन',
    navReserve: 'रक्कम राखीव ठेवा',
    navExpenses: 'खर्च विश्लेषण',
    navShockSimulator: 'शॉक सिम्युलेटर',
    navInsights: 'सल्ले',
    navProfile: 'सेटिंग्ज',

    verifiedBankData: 'सत्यापित बँक डेटा',
    userEntered: 'वापरकर्त्याने नोंदवलेले',
    estimated: 'अंदाजित',
    predicted: 'भाकीत केलेले',
    connectedBusinessData: 'कनेक्टेड व्यवसाय डेटा',

    addExpenseBtn: '+ खर्च जोडा',
    addByVoiceBtn: 'आवाजाने जोडा',
    confirmBtn: 'नक्की करा',
    cancelBtn: 'रद्द करा',
    editBtn: 'बदल करा',
  },
  ta: {
    appName: 'IncomeFlex',
    tagline: 'உங்கள் பணம், உங்கள் வழி',
    chooseLanguage: 'உங்கள் மொழியைத் தேர்வுசெய்யவும்',
    bankingMadeSimple: 'உங்கள் மொழியில் எளிய நிதி மேலாண்மை',
    continueBtn: 'தொடரவும்',
    voiceSetupTitle: 'குரல் வழியில் எளிதாக்குங்கள்',
    voiceSetupSubtitle: 'இயல்பாக பேசி உங்கள் நிதியை நிர்வகியுங்கள்',
    enableVoice: 'குரல் உதவியாளரை இயக்கு',
    maybeLater: 'பிறகு செய்கிறேன்',
    checkBalance: 'இருப்பு சோதனை',
    trackIncomeExpenses: 'வருமானம் மற்றும் செலவு கண்காணிப்பு',
    remindBills: 'வரவிருக்கும் கட்டண நினைவூட்டல்',
    answerQuestions: 'உங்கள் நிதி கேள்விகளுக்கு பதில்',

    financialResilienceScore: 'நிதி வலிமை மதிப்பீடு',
    currentSnapshot: 'இன்றைய நிதி சுருக்கம்',
    availableMoney: 'கையிருப்பு பணம்',
    incomeThisPeriod: 'இந்த கால வருமானம்',
    expensesThisPeriod: 'மொத்த செலவுகள்',
    upcomingBills: 'வரவிருக்கும் கட்டணங்கள்',
    savingsProgress: 'சேமிப்பு முன்னேற்றம்',
    borrowingCapacity: 'பாதுகாப்பான கடன் திறன்',
    financialInsights: 'தனிப்பயனாக்கப்பட்ட நிதி நுண்ணறிவு',
    safeToSpend: 'செலவழிக்க பாதுகாப்பான தொகை',
    reservedMoney: 'ஒதுக்கப்பட்ட தொகை',
    daysOfRunway: 'பாதுகாப்பான நாட்கள்',
    lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது',

    connectAccountPrompt: 'முழு நிதி விவரத்தைக் காண கணக்கை இணைக்கவும்.',
    addFirstIncomePrompt: 'தொடங்க முதல் வருமானத்தை சேர்க்கவும்.',
    connectAccountBtn: 'கணக்கை இணைக்கவும்',
    addIncomeBtn: '+ வருமானம் சேர்க்க',
    noBillsRecorded: 'எந்த கட்டணங்களும் பதிவு செய்யப்படவில்லை.',
    noSavingsRecorded: 'உங்கள் சேமிப்பு பயணம் இங்கே தொடங்குகிறது.',
    notEnoughDataPrediction: 'கணிப்பதற்கு போதுமான தரவு இன்னும் இல்லை.',

    simpleModeToggle: 'எளிய முறை',
    simpleModeTitle: 'எளிய மொழி கண்ணோட்டம்',
    simpleMoneyIHave: '💰 என்னிடம் உள்ள பணம்',
    simpleMoneyIMayEarn: '💵 நான் ஈட்டக்கூடிய பணம்',
    simpleMoneyINeed: '📅 எனக்குத் தேவைப்படும் பணம்',
    simpleMoneyISaved: '🛟 நான் சேமித்த பணம்',
    simpleMoneyIMayBorrow: '💳 நான் பாதுகாப்பாக கடன் வாங்கக்கூடிய தொகை',

    navOverview: 'முகப்பு',
    navTrackIncome: 'வருமானம்',
    navPredict: 'கணிப்பு',
    navSavings: 'சேமிப்பு',
    navLoanPlanner: 'கடன் திட்டம்',
    navReserve: 'பணம் ஒதுக்கு',
    navExpenses: 'செலவுகள்',
    navShockSimulator: 'அதிர்ச்சி உருவகப்படுத்துதல்',
    navInsights: 'ஆலோசனைகள்',
    navProfile: 'அமைப்புகள்',

    verifiedBankData: 'சரிபார்க்கப்பட்ட வங்கித் தரவு',
    userEntered: 'பயனரால் உள்ளிடப்பட்டது',
    estimated: 'மதிப்பிடப்பட்டது',
    predicted: 'கணிக்கப்பட்டது',
    connectedBusinessData: 'இணைக்கப்பட்ட வணிகத் தரவு',

    addExpenseBtn: '+ செலவு சேர்க்க',
    addByVoiceBtn: 'குரல் மூலம் சேர்க்க',
    confirmBtn: 'உறுதிப்படுத்து',
    cancelBtn: 'ரத்து செய்',
    editBtn: 'திருத்து',
  },
  te: {
    appName: 'IncomeFlex',
    tagline: 'మీ డబ్బు, మీ ఇష్టం',
    chooseLanguage: 'మీ భాషను ఎంచుకోండి',
    bankingMadeSimple: 'మీ భాషలోనే సులభమైన ఆర్థిక నిర్వహణ',
    continueBtn: 'కొనసాగించు',
    voiceSetupTitle: 'దీన్ని హ్యాండ్స్-ఫ్రీ చేయండి',
    voiceSetupSubtitle: 'మీ ఆర్థిక విషయాలను మాట్లాడి నిర్వహించండి',
    enableVoice: 'వాయిస్ అసిస్టెంట్ ఆన్ చేయండి',
    maybeLater: 'తర్వాత',
    checkBalance: 'బ్యాలెన్స్ తనిఖీ',
    trackIncomeExpenses: 'ఆదాయం & ఖర్చులు ట్రాక్ చేయండి',
    remindBills: 'రాబోయే బిల్లుల రిమైండర్',
    answerQuestions: 'మీ ఆర్థిక ప్రశ్నలకు సమాధానాలు',

    financialResilienceScore: 'ఆర్థిక స్థిరత్వ స్కోరు',
    currentSnapshot: 'నేటి ఆర్థిక నివేదిక',
    availableMoney: 'అందుబాటులో ఉన్న నిధులు',
    incomeThisPeriod: 'ఈ కాలంలో ఆదాయం',
    expensesThisPeriod: 'మొత్తం ఖర్చులు',
    upcomingBills: 'రాబోయే బిల్లులు',
    savingsProgress: 'పొదుపు ప్రగతి',
    borrowingCapacity: 'సురక్షిత అప్పు సామర్థ్యం',
    financialInsights: 'వ్యక్తిగత ఆర్థిక సలహాలు',
    safeToSpend: 'ఖర్చు చేయడానికి సురక్షిత మొత్తం',
    reservedMoney: 'రిజర్వ్ చేయబడిన నిధులు',
    daysOfRunway: 'బఫర్ రోజులు',
    lastUpdated: 'చివరిగా నవీకరించబడింది',

    connectAccountPrompt: 'మీ పూర్తి ఆర్థిక స్థితిని చూడటానికి ఖాతాను కనెక్ట్ చేయండి.',
    addFirstIncomePrompt: 'మొదటి ఆదాయాన్ని జోడించి ప్రారంభించండి.',
    connectAccountBtn: 'ఖాతాను కనెక్ట్ చేయండి',
    addIncomeBtn: '+ ఆదాయం జోడించు',
    noBillsRecorded: 'ఎలాంటి బిల్లులు నమోదు కాలేదు.',
    noSavingsRecorded: 'మీ పొదుపు ప్రయాణం ఇక్కడే మొదలవుతుంది.',
    notEnoughDataPrediction: 'ఖచ్చితమైన అంచనాకు సరిపడా డేటా లేదు.',

    simpleModeToggle: 'సరళమైన మోడ్',
    simpleModeTitle: 'సులభ భాషలో సారాంశం',
    simpleMoneyIHave: '💰 నా వద్ద ఉన్న డబ్బు',
    simpleMoneyIMayEarn: '💵 నేను సంపాదించగల డబ్బు',
    simpleMoneyINeed: '📅 నాకు త్వరలో కావలసిన డబ్బు',
    simpleMoneyISaved: '🛟 నేను దాచుకున్న పొదుపు',
    simpleMoneyIMayBorrow: '💳 నేను సురక్షితంగా తీసుకోగల రుణం',

    navOverview: 'హోమ్',
    navTrackIncome: 'ఆదాయం',
    navPredict: 'అంచనా',
    navSavings: 'పొదుపు',
    navLoanPlanner: 'రుణ ప్రణాళిక',
    navReserve: 'డబ్బు రిజర్వ్ చేయండి',
    navExpenses: 'ఖర్చులు',
    navShockSimulator: 'షాక్ సిమ్యులేటర్',
    navInsights: 'సలహాలు',
    navProfile: 'సెట్టింగ్‌లు',

    verifiedBankData: 'ధృవీకరించబడిన బ్యాంక్ డేటా',
    userEntered: 'వినియోగదారు నమోదు చేసినది',
    estimated: 'అంచనా వేసినది',
    predicted: 'ముందస్తు అంచనా',
    connectedBusinessData: 'కనెక్ట్ చేయబడిన వ్యాపార డేటా',

    addExpenseBtn: '+ ఖర్చు జోడించు',
    addByVoiceBtn: 'వాయిస్ ద్వారా జోడించు',
    confirmBtn: 'నిర్ధారించు',
    cancelBtn: 'రద్దు చేయి',
    editBtn: 'సవరించు',
  },
  bn: {
    appName: 'IncomeFlex',
    tagline: 'আপনার অর্থ, আপনার পথ',
    chooseLanguage: 'আপনার ভাষা বেছে নিন',
    bankingMadeSimple: 'আপনার নিজের ভাষায় সহজ আর্থিক সমাধান',
    continueBtn: 'এগিয়ে যান',
    voiceSetupTitle: 'ভয়েসের মাধ্যমে সহজ করুন',
    voiceSetupSubtitle: 'কথা বলেই পরিচালনা করুন আপনার আর্থিক হিসাব',
    enableVoice: 'ভয়েস সহকারী চালু করুন',
    maybeLater: 'পরে করব',
    checkBalance: 'ব্যালেন্স চেক করুন',
    trackIncomeExpenses: 'আয় ও ব্যয় ট্র্যাক করুন',
    remindBills: 'আসন্ন বিলের সতর্কতা পান',
    answerQuestions: 'আর্থিক প্রশ্নের উত্তর পান',

    financialResilienceScore: 'আর্থিক সক্ষমতা স্কোর',
    currentSnapshot: 'আজকের আর্থিক সারসংক্ষেপ',
    availableMoney: 'উপলব্ধ টাকা',
    incomeThisPeriod: 'এই সময়ের মোট আয়',
    expensesThisPeriod: 'মোট ব্যয়',
    upcomingBills: 'আসন্ন বিল ও প্রদেয়',
    savingsProgress: 'সঞ্চয়ের অগ্রগতি',
    borrowingCapacity: 'নিরাপদ ঋণ নেওয়ার ক্ষমতা',
    financialInsights: 'ব্যক্তিগত আর্থিক পরামর্শ',
    safeToSpend: 'খরচের জন্য নিরাপদ টাকা',
    reservedMoney: 'IncomeFlex-এ সংরক্ষিত টাকা',
    daysOfRunway: 'নিরাপদ দিনের বাফার',
    lastUpdated: 'সর্বশেষ আপডেট',

    connectAccountPrompt: 'সম্পূর্ণ হিসাব দেখতে আপনার অ্যাকাউন্ট যুক্ত করুন।',
    addFirstIncomePrompt: 'শুরু করতে আপনার প্রথম আয় যোগ করুন।',
    connectAccountBtn: 'অ্যাকাউন্ট যুক্ত করুন',
    addIncomeBtn: '+ আয় যোগ করুন',
    noBillsRecorded: 'কোনো আসন্ন বিল লিপিবদ্ধ নেই।',
    noSavingsRecorded: 'আপনার সঞ্চয় যাত্রা এখান থেকেই শুরু।',
    notEnoughDataPrediction: 'সঠিক পূর্বাভাসের জন্য পর্যাপ্ত তথ্য নেই।',

    simpleModeToggle: 'সহজ মোড',
    simpleModeTitle: 'সহজ ভাষায় সংক্ষেপ',
    simpleMoneyIHave: '💰 আমার কাছে থাকা টাকা',
    simpleMoneyIMayEarn: '💵 সম্ভাব্য আয়ের টাকা',
    simpleMoneyINeed: '📅 শীঘ্রই প্রয়োজনীয় বিল ও খরচ',
    simpleMoneyISaved: '🛟 আমার জমানো সঞ্চয়',
    simpleMoneyIMayBorrow: '💳 নিরাপদে ধার নেওয়ার ক্ষমতা',

    navOverview: 'হোম',
    navTrackIncome: 'আয় ট্র্যাকার',
    navPredict: 'পূর্বাভাস',
    navSavings: 'সঞ্চয় লক্ষ্য',
    navLoanPlanner: 'ঋণ পরিকল্পনা',
    navReserve: 'টাকা সংরক্ষণ',
    navExpenses: 'ব্যয় বিশ্লেষণ',
    navShockSimulator: 'শক সিমুলেটর',
    navInsights: 'পরামর্শ',
    navProfile: 'সেটিংস',

    verifiedBankData: 'যাচাইকৃত ব্যাংক তথ্য',
    userEntered: 'ব্যবহারকারী প্রদত্ত',
    estimated: 'আনুমানিক',
    predicted: 'পূর্বাভাসিত',
    connectedBusinessData: 'যুক্ত ব্যবসার তথ্য',

    addExpenseBtn: '+ ব্যয় যোগ করুন',
    addByVoiceBtn: 'ভয়েসে যোগ করুন',
    confirmBtn: 'নিশ্চিত করুন',
    cancelBtn: 'বাতিল',
    editBtn: 'সম্পাদনা',
  },
  kn: {
    appName: 'IncomeFlex',
    tagline: 'ನಿಮ್ಮ ಹಣ, ನಿಮ್ಮ ಇಷ್ಟ',
    chooseLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    bankingMadeSimple: 'ನಿಮ್ಮದೇ ಭಾಷೆಯಲ್ಲಿ ಸರಳ ಹಣಕಾಸು ನಿರ್ವಹಣೆ',
    continueBtn: 'ಮುಂದುವರಿಯಿರಿ',
    voiceSetupTitle: 'ಇದನ್ನು ಹ್ಯಾಂಡ್ಸ್-ಫ್ರೀ ಮಾಡಿ',
    voiceSetupSubtitle: 'ನಿಮ್ಮ ಹಣಕಾಸನ್ನು ನಿರ್ವಹಿಸಲು ಧ್ವನಿಯಲ್ಲೇ ಮಾತನಾಡಿ',
    enableVoice: 'ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್ ಸಕ್ರಿಯಗೊಳಿಸಿ',
    maybeLater: 'ನಂತರ ನೋಡೋಣ',
    checkBalance: 'ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲಿಸಿ',
    trackIncomeExpenses: 'ಆದಾಯ ಮತ್ತು ವೆಚ್ಚವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    remindBills: 'ಮುಂಬರುವ ಬಿಲ್‌ಗಳ ಜ್ಞಾಪನೆ',
    answerQuestions: 'ಹಣಕಾಸಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರ ಪಡೆಯಿರಿ',

    financialResilienceScore: 'ಹಣಕಾಸು ಚೇತರಿಕೆ ಸ್ಕೋರ್',
    currentSnapshot: 'ಇಂದಿನ ಹಣಕಾಸು ಸಾರಾಂಶ',
    availableMoney: 'ಲಭ್ಯವಿರುವ ಹಣ',
    incomeThisPeriod: 'ಈ ಅವಧಿಯ ಆದಾಯ',
    expensesThisPeriod: 'ಒಟ್ಟು ವೆಚ್ಚಗಳು',
    upcomingBills: 'ಮುಂಬರುವ ಬಿಲ್‌ಗಳು',
    savingsProgress: 'ಉಳಿತಾಯ ಪ್ರಗತಿ',
    borrowingCapacity: 'ಸುರಕ್ಷಿತ ಸಾಲ ಸಾಮರ್ಥ್ಯ',
    financialInsights: 'ವೈಯಕ್ತಿಕ ಹಣಕಾಸು ಸಲಹೆಗಳು',
    safeToSpend: 'ಖರ್ಚು ಮಾಡಲು ಸುರಕ್ಷಿತ ಮೊತ್ತ',
    reservedMoney: 'ಕಾಯ್ದಿರಿಸಿದ ಮೊತ್ತ',
    daysOfRunway: 'ಬಫರ್ ದಿನಗಳು',
    lastUpdated: 'ಕೊನೆಯ ನವೀಕರಣ',

    connectAccountPrompt: 'ಸಂಪೂರ್ಣ ಮಾಹಿತಿ ನೋಡಲು ಖಾತೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    addFirstIncomePrompt: 'ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಮೊದಲ ಆದಾಯವನ್ನು ನಮೂದಿಸಿ.',
    connectAccountBtn: 'ಖಾತೆಯನ್ನು ಜೋಡಿಸಿ',
    addIncomeBtn: '+ ಆದಾಯ ಸೇರಿಸಿ',
    noBillsRecorded: 'ಯಾವುದೇ ಬಿಲ್‌ಗಳು ದಾಖಲಾಗಿಲ್ಲ.',
    noSavingsRecorded: 'ನಿಮ್ಮ ಉಳಿತಾಯದ ಪ್ರಯಾಣ ಇಲ್ಲಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.',
    notEnoughDataPrediction: 'ಅಂದಾಜು ಮಾಡಲು ಇನ್ನೂ ಸಾಕಷ್ಟು ಡೇಟಾ ಇಲ್ಲ.',

    simpleModeToggle: 'ಸರಳ ಮೋಡ್',
    simpleModeTitle: 'ಸರಳ ಭಾಷೆಯ ಅವಲೋಕನ',
    simpleMoneyIHave: '💰 ನನ್ನ ಬಳಿ ಇರುವ ಹಣ',
    simpleMoneyIMayEarn: '💵 ನಾನು ಗಳಿಸಬಹುದಾದ ಹಣ',
    simpleMoneyINeed: '📅 ನನಗೆ ಶೀಘ್ರದಲ್ಲೇ ಬೇಕಾಗುವ ಹಣ',
    simpleMoneyISaved: '🛟 ನಾನು ಉಳಿಸಿದ ಹಣ',
    simpleMoneyIMayBorrow: '💳 ನಾನು ಸುರಕ್ಷಿತವಾಗಿ ಪಡೆಯಬಹುದಾದ ಸಾಲ',

    navOverview: 'ಮುಖಪುಟ',
    navTrackIncome: 'ಆದಾಯ',
    navPredict: 'ಮುನ್ಸೂಚನೆ',
    navSavings: 'ಉಳಿತಾಯ ಗುರಿ',
    navLoanPlanner: 'ಸಾಲ ಯೋಜನೆ',
    navReserve: 'ಹಣ ಮೀಸಲಿಡಿ',
    navExpenses: 'ವೆಚ್ಚಗಳು',
    navShockSimulator: 'ಶಾಕ್ ಸಿಮ್ಯುಲೇಟರ್',
    navInsights: 'ಸಲಹೆಗಳು',
    navProfile: 'ಸೆಟ್ಟಿಂಗ್ಸ್',

    verifiedBankData: 'ಪರಿಶೀಲಿಸಿದ ಬ್ಯಾಂಕ್ ಡೇಟಾ',
    userEntered: 'ಬಳಕೆದಾರ ನಮೂದಿಸಿದ್ದು',
    estimated: 'ಅಂದಾಜು ಮಾಡಿದ',
    predicted: 'ಮುನ್ಸೂಚಿಸಿದ',
    connectedBusinessData: 'ಸಂಪರ್ಕಿತ ವ್ಯಾಪಾರ ಡೇಟಾ',

    addExpenseBtn: '+ ವೆಚ್ಚ ಸೇರಿಸಿ',
    addByVoiceBtn: 'ಧ್ವನಿಯ ಮೂಲಕ ಸೇರಿಸಿ',
    confirmBtn: 'ದೃಢೀಕರಿಸಿ',
    cancelBtn: 'ರದ್ದುಮಾಡಿ',
    editBtn: 'ತಿದ್ದುಪಡಿ',
  },
};
