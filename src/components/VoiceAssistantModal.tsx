import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Check, Edit2, Loader2, Sparkles } from 'lucide-react';
import { VoiceParsedIntent, RecordSource } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAction: (intent: VoiceParsedIntent) => void;
  incomeType: 'VARIABLE' | 'FIXED';
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onConfirmAction,
  incomeType,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedIntent, setParsedIntent] = useState<VoiceParsedIntent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editDesc, setEditDesc] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Tap the microphone and speak naturally');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          setStatusMessage('Listening... Speak now');
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          setStatusMessage('Speech recognition error. You can also type below.');
        };

        recognition.onend = () => {
          setIsListening(false);
          if (transcript) {
            handleProcessTranscript(transcript);
          }
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }
  }, [transcript]);

  // TTS Read aloud
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    setParsedIntent(null);
    setTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 200);
      }
    } else {
      setStatusMessage('Voice recognition not supported in this browser. Try manual input.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (transcript) {
      handleProcessTranscript(transcript);
    }
  };

  const handleProcessTranscript = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;
    setIsProcessing(true);
    setStatusMessage('Analyzing financial intent with IncomeFlex AI...');

    try {
      const res = await fetch('/api/voice/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speechText: textToProcess, incomeType }),
      });
      const data = await res.json();
      if (data.parsed) {
        setParsedIntent(data.parsed);
        setEditAmount(data.parsed.amount || 0);
        setEditDesc(data.parsed.description || textToProcess);
        setStatusMessage('Please confirm understood details:');
        
        // Read aloud confirmation
        const spokenMsg = `Understood: ${data.parsed.action === 'ADD_INCOME' ? 'Income' : 'Expense'} of ${data.parsed.amount || 0} rupees. Please confirm or edit.`;
        speakText(spokenMsg);
      }
    } catch (e) {
      // Local fallback
      const amountMatch = textToProcess.match(/(\d+)/);
      const amount = amountMatch ? parseInt(amountMatch[1], 10) : 1000;
      const fallback: VoiceParsedIntent = {
        action: textToProcess.toLowerCase().includes('spent') ? 'ADD_EXPENSE' : 'ADD_INCOME',
        amount,
        category: 'DAILY_WAGE',
        description: textToProcess,
        date: new Date().toISOString().split('T')[0],
        source: 'USER_ENTERED',
        rawText: textToProcess,
      };
      setParsedIntent(fallback);
      setEditAmount(fallback.amount || 0);
      setEditDesc(fallback.description || textToProcess);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (!parsedIntent) return;
    const finalIntent: VoiceParsedIntent = {
      ...parsedIntent,
      amount: editAmount,
      description: editDesc,
      source: 'USER_ENTERED' as RecordSource,
    };
    onConfirmAction(finalIntent);
    speakText('Record confirmed and saved to your IncomeFlex ledger.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0D1424] border border-blue-900/60 rounded-3xl p-6 text-white shadow-2xl shadow-cyan-950/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">IncomeFlex Voice Assistant</h3>
              <p className="text-xs text-slate-400">Hands-Free Financial Command</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Mic & Visualizer */}
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            {/* Pulsing glow rings when listening */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping" />
                <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-pulse" />
              </>
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-rose-500/50 scale-105'
                  : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 text-white shadow-cyan-500/30 hover:scale-105'
              }`}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          <p className="text-sm font-medium text-slate-200">{statusMessage}</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Try: "Today I earned 1500 rupees from deliveries" or "Spent 350 on petrol"
          </p>

          {/* Live Transcript Display */}
          {transcript && (
            <div className="w-full mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-left">
              <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">You said:</span>
              <p className="text-sm text-slate-100 font-medium italic mt-0.5">"{transcript}"</p>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center gap-2 mt-4 text-cyan-400 text-sm font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing financial parameters...
            </div>
          )}
        </div>

        {/* Confirmation Card matching the instruction:
            "I understood:
             Income ₹1,500
             Cash
             Today
             [ Confirm ]
             [ Edit ]"
        */}
        {parsedIntent && !isProcessing && (
          <div className="mt-2 p-4 bg-[#141E33] border border-cyan-500/40 rounded-2xl glow-cyan animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                AI Interpretation Confirmation
              </span>
              <button
                onClick={() => speakText(`I understood: ${parsedIntent.action === 'ADD_INCOME' ? 'Income' : 'Expense'} of ${editAmount} rupees.`)}
                className="text-slate-400 hover:text-cyan-300 p-1"
                title="Read aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Action:</span>
                <span className="font-semibold text-white">
                  {parsedIntent.action === 'ADD_INCOME'
                    ? 'Income Credit'
                    : parsedIntent.action === 'ADD_EXPENSE'
                    ? 'Expense Debit'
                    : parsedIntent.action}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Amount:</span>
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <span className="text-cyan-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(Number(e.target.value))}
                      className="w-24 bg-slate-900 border border-cyan-500 rounded px-2 py-0.5 text-right text-white text-sm"
                    />
                  </div>
                ) : (
                  <span className="text-lg font-bold text-cyan-300">
                    ₹{editAmount.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Details:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-44 bg-slate-900 border border-cyan-500 rounded px-2 py-0.5 text-right text-white text-xs"
                  />
                ) : (
                  <span className="text-slate-200 text-right truncate max-w-[200px]">
                    {editDesc}
                  </span>
                )}
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Date & Source:</span>
                <span className="text-xs font-semibold text-amber-400">
                  Today • USER ENTERED
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {isEditing ? 'Done Editing' : 'Edit'}
              </button>

              <button
                onClick={handleConfirm}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 transition"
              >
                <Check className="w-4 h-4" />
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* Manual Quick Text Input if mic is denied or unavailable */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessTranscript(transcript);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Or type what you earned/spent..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!transcript.trim() || isProcessing}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl border border-slate-700 disabled:opacity-50"
            >
              Parse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
