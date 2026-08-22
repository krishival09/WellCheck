import React, { useEffect, useState } from 'react';
import { Volume2, X, RotateCcw } from 'lucide-react';
import { subscribeSpeech, speakText, stopSpeaking, SUPPORTED_LANGUAGES } from '../../utils/speech';
import { SupportedLanguage } from '../../types';

export const TtsSubtitleBanner: React.FC = () => {
  const [speechData, setSpeechData] = useState<{
    text: string;
    langCode: SupportedLanguage;
    isSpeaking: boolean;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeSpeech((data) => {
      if (data.isSpeaking && data.text) {
        setSpeechData(data);
      } else if (!data.isSpeaking) {
        // Auto-fade after small delay
        const timer = setTimeout(() => {
          setSpeechData(prev => prev && !prev.isSpeaking ? null : prev);
        }, 3000);
        return () => clearTimeout(timer);
      }
    });
    return unsubscribe;
  }, []);

  if (!speechData || !speechData.text) {
    return null;
  }

  const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === speechData.langCode);

  return (
    <div 
      id="tts-live-subtitle-banner"
      className="w-full bg-[#1A2B4C] text-white p-2.5 rounded-xl border-2 border-[#FFB84D] shadow-[3px_3px_0px_#1A2B4C] mb-2.5 animate-in slide-in-from-top-2 duration-200"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-[#FF6B4A] rounded flex items-center justify-center text-white">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#FFB84D] flex items-center gap-1">
            <span>{langInfo?.flag || '🌐'}</span>
            <span>{langInfo?.nativeLabel} ({langInfo?.label}) Voice Prompt</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Replay voice button */}
          <button
            onClick={() => speakText(speechData.text, speechData.langCode)}
            title="Replay audio"
            className="px-1.5 py-0.5 bg-white/20 hover:bg-white/30 rounded text-[10px] font-bold flex items-center gap-0.5 text-white"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Replay</span>
          </button>
          {/* Close subtitle */}
          <button
            onClick={() => {
              stopSpeaking();
              setSpeechData(null);
            }}
            title="Dismiss voice banner"
            className="w-5 h-5 rounded hover:bg-white/20 flex items-center justify-center text-white/80"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {/* Subtitle text in native script */}
      <p className="text-xs font-black text-amber-100 leading-snug px-1">
        &ldquo;{speechData.text}&rdquo;
      </p>
      {/* Sound wave visualizer bars */}
      <div className="flex items-center gap-1 mt-1.5 px-1">
        <div className="h-1.5 w-3 bg-[#4CAF50] rounded-full animate-pulse" />
        <div className="h-2.5 w-3 bg-[#FFB84D] rounded-full animate-pulse delay-75" />
        <div className="h-3.5 w-3 bg-[#FF6B4A] rounded-full animate-pulse delay-150" />
        <div className="h-2 w-3 bg-[#4CAF50] rounded-full animate-pulse delay-100" />
        <span className="text-[9px] font-mono text-white/60 ml-1">
          TTS Audio Active
        </span>
      </div>
    </div>
  );
};
