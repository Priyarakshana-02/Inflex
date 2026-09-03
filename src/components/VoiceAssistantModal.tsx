import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Check, Volume2, Sparkles, CornerDownLeft, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { LanguageCode } from '../../server/types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onTransactionAdded?: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onTransactionAdded
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState<string | null>(null);

  // Pending confirmation payload
  const [pendingAction, setPendingAction] = useState<{
    action: string;
    amount?: number;
    category?: string;
    source?: string;
    confirmationText: string;
    spokenReply: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setResponseMsg(null);
      setPendingAction(null);
    } else {
      stopListening();
    }
  }, [isOpen]);

  const startListening = () => {
    setResponseMsg(null);
    setPendingAction(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setResponseMsg('Speech recognition is not supported in this browser. You can type commands below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      // Set recognition language
      if (language === 'hi') recognition.lang = 'hi-IN';
      else if (language === 'ta') recognition.lang = 'ta-IN';
      else if (language === 'te') recognition.lang = 'te-IN';
      else if (language === 'mr') recognition.lang = 'mr-IN';
      else if (language === 'bn') recognition.lang = 'bn-IN';
      else if (language === 'kn') recognition.lang = 'kn-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleProcessTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setResponseMsg('Microphone permission was denied. Please allow microphone access or type commands below.');
        } else {
          setResponseMsg('Could not catch your voice. Please try again or type below.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleProcessTranscript = async (text: string) => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const { result } = await api.processVoiceCommand(text, language);
      setIsLoading(false);

      if (result.action === 'ADD_INCOME' || result.action === 'ADD_EXPENSE') {
        // ALWAYS require confirmation before writing financial data!
        setPendingAction(result);
        api.speakText(result.confirmationText, language);
      } else {
        setResponseMsg(result.spokenReply);
        api.speakText(result.spokenReply, language);
      }
    } catch (err: any) {
      setIsLoading(false);
      setResponseMsg('Failed to process command: ' + (err.message || 'Unknown error'));
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    setIsLoading(true);
    try {
      if (pendingAction.action === 'ADD_INCOME' && pendingAction.amount) {
        await api.addIncome({
          amount: pendingAction.amount,
          source: pendingAction.source || 'Voice Entry',
          category: pendingAction.category || 'Daily Income'
        });
        const msg = `Successfully recorded ₹${pendingAction.amount.toLocaleString('en-IN')} as income.`;
        setResponseMsg(msg);
        api.speakText(msg, language);
      } else if (pendingAction.action === 'ADD_EXPENSE' && pendingAction.amount) {
        await api.addExpense({
          amount: pendingAction.amount,
          category: (pendingAction.category as any) || 'Food'
        });
        const msg = `Successfully recorded ₹${pendingAction.amount.toLocaleString('en-IN')} expense.`;
        setResponseMsg(msg);
        api.speakText(msg, language);
      }
      setPendingAction(null);
      if (onTransactionAdded) onTransactionAdded();
    } catch (err: any) {
      setResponseMsg('Failed to record: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0B1327] border border-cyan-500/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.25)] text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="text-lg font-bold text-white tracking-tight">IncomeFlex Voice Assistant</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6">Ask balances, record income/expenses or check dues</p>

        {/* Big Glowing Microphone Visual matching Reference Screen 2 */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Concentric rings */}
          {isListening && (
            <>
              <div className="absolute w-36 h-36 rounded-full border border-cyan-500/30 animate-ping opacity-30" />
              <div className="absolute w-28 h-28 rounded-full border border-blue-500/40 animate-pulse" />
            </>
          )}

          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? 'bg-gradient-to-tr from-rose-600 to-amber-500 shadow-[0_0_30px_rgba(244,63,94,0.7)] scale-110'
                : 'bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-105'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-[#081020]/40 flex items-center justify-center">
              {isListening ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              )}
            </div>
          </button>
        </div>

        <p className="text-xs font-medium text-cyan-300 mb-4">
          {isListening ? 'Listening now... Speak clearly' : 'Tap microphone to speak'}
        </p>

        {/* Live Transcript */}
        {transcript && (
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 mb-4 text-xs text-slate-200 italic">
            "{transcript}"
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-3 text-cyan-400 text-xs font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing financial intent...</span>
          </div>
        )}

        {/* Required Confirmation Box before recording money */}
        {pendingAction && (
          <div className="bg-gradient-to-b from-cyan-950/60 to-slate-900 border border-cyan-500/40 rounded-2xl p-4 my-4 text-left">
            <div className="text-[10px] uppercase font-bold text-amber-400 mb-1 tracking-wider">
              Safety Confirmation Required
            </div>
            <p className="text-sm font-semibold text-white mb-2">{pendingAction.confirmationText}</p>
            <div className="text-xs text-slate-300 mb-3">
              Action: <span className="text-cyan-300 font-mono">{pendingAction.action}</span>
              {pendingAction.amount && (
                <> | Amount: <span className="text-emerald-400 font-bold">₹{pendingAction.amount.toLocaleString('en-IN')}</span></>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmAction}
                disabled={isLoading}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:opacity-95"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Record</span>
              </button>
              <button
                onClick={() => setPendingAction(null)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Response message */}
        {responseMsg && !pendingAction && (
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-3 my-3 text-xs text-cyan-200 text-left flex items-start gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{responseMsg}</span>
          </div>
        )}

        {/* Text Input Fallback */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleProcessTranscript(inputText);
              setInputText('');
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Or type e.g. 'Add ₹500 vegetable income'"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40"
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
