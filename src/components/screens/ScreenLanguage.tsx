import React from 'react';
import { Check, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { LanguageCode } from '../../types';

interface ScreenLanguageProps {
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onContinue: () => void;
}

export const ScreenLanguage: React.FC<ScreenLanguageProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onContinue,
}) => {
  const languages: {
    code: LanguageCode;
    name: string;
    nativeName: string;
    sampleText: string;
  }[] = [
    { code: 'en', name: 'English', nativeName: 'English', sampleText: 'Banking made simple in your language' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', sampleText: 'आपकी भाषा में सरल बैंकिंग व वित्तीय सुरक्षा' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', sampleText: 'तुमच्या भाषेत सोपे व सुरक्षित आर्थिक नियोजन' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', sampleText: 'உங்கள் மொழியில் எளிய நிதி மேலாண்மை' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', sampleText: 'మీ భాషలోనే సులభమైన బ్యాంకింగ్' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', sampleText: 'আপনার ভাষায় সহজ আর্থিক ব্যবস্থাপনা' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', sampleText: 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸರಳ ಹಣಕಾಸು ಸೇವೆಗಳು' },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-xl mx-auto bg-[#0D1424] border border-blue-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40">
        {/* Visual Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30">
            <Globe className="w-8 h-8" />
          </div>
        </div>

        {/* Title and Subtitle matching instruction */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Choose Your Language
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 font-medium">
            Banking made simple in your language
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {languages.map((item) => {
            const isSelected = selectedLanguage === item.code;
            return (
              <div
                key={item.code}
                onClick={() => onSelectLanguage(item.code)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'border-cyan-400 bg-gradient-to-r from-cyan-950/50 to-blue-950/50 text-white glow-cyan shadow-lg'
                    : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">
                      {item.nativeName}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({item.name})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {item.sampleText}
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                      : 'border-slate-700 bg-slate-800 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.01]"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center text-xs text-slate-500 mt-4">
          The selected language applies instantly across all screens, charts, and voice prompts.
        </p>
      </div>
    </div>
  );
};
