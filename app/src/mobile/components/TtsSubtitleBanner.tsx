import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form, useSafeAreaInsets } from '../../rn-compat';
import React, { useEffect, useState } from 'react';
import { Volume2, X, RotateCcw } from 'lucide-react-native';
import { subscribeSpeech, speakText, stopSpeaking, SUPPORTED_LANGUAGES } from '../../utils/speech';
import { SupportedLanguage } from '../../types';

export const TtsSubtitleBanner: React.FC = () => {
  const insets = useSafeAreaInsets();
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
    <Div 
      id="tts-live-subtitle-banner"
      className="absolute left-3 right-3 bg-[#1A2B4C] text-white px-3 py-2 rounded-xl border-2 border-[#FFB84D] shadow-[3px_3px_0px_#1A2B4C] z-50 animate-in slide-in-from-top-2 duration-200"
      style={{ top: Math.max(insets.top, 8) + 4 }}
    >
      <Div className="flex flex-row items-center justify-between gap-2 mb-1.5">
        <Div className="flex flex-row items-center gap-2 flex-1 min-w-0">
          <Div className="w-6 h-6 bg-[#FF6B4A] rounded-lg flex items-center justify-center text-white shrink-0">
            <Volume2 className="w-4 h-4 animate-bounce" />
          </Div>
          <Span className="text-[11px] font-black uppercase tracking-wider text-[#FFB84D] truncate">
            {langInfo?.flag || '🌐'} {langInfo?.nativeLabel} ({langInfo?.label}) Voice Prompt
          </Span>
        </Div>
        <Div className="flex flex-row items-center gap-1.5 shrink-0">
          {/* Replay voice button */}
          <Button
            onClick={() => speakText(speechData.text, speechData.langCode)}
            title="Replay audio"
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-bold flex flex-row items-center gap-1 text-white cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <Span>Replay</Span>
          </Button>
          {/* Close subtitle */}
          <Button
            onClick={() => {
              stopSpeaking();
              setSpeechData(null);
            }}
            title="Dismiss voice banner"
            className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </Div>
      </Div>
      {/* Subtitle text in native script */}
      <P className="text-xs font-bold text-amber-100 leading-snug">
        &ldquo;{speechData.text}&rdquo;
      </P>
    </Div>
  );
};
