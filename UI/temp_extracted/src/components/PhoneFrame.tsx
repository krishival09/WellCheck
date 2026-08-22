import React, { ReactNode } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
  title: string;
  roleBadge?: 'Elder Mode' | 'Volunteer Mode' | string;
  badgeColor?: 'elder' | 'volunteer';
  showInspectionOverlay?: boolean;
  statusText?: string;
  modeTag?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  title,
  roleBadge = 'Elder Mode',
  badgeColor = 'elder',
  showInspectionOverlay = false,
  statusText,
  modeTag,
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="flex flex-col items-center">
      {/* Top Device Label & Mode Badge */}
      <div className="w-full max-w-[390px] mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {modeTag && (
            <span
              className={`text-xs px-2 py-0.5 font-black uppercase tracking-wider text-white border border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] ${
                badgeColor === 'elder' ? 'bg-[#1A2B4C]' : 'bg-[#FF6B4A]'
              }`}
            >
              {modeTag}
            </span>
          )}
          <span className="font-extrabold text-[#1A2B4C] text-sm tracking-tight uppercase">{title}</span>
        </div>
        {statusText && (
          <span className="text-[11px] font-bold text-[#1A2B4C]/70 uppercase tracking-wide">
            {statusText}
          </span>
        )}
      </div>

      {/* Realistic Mobile Device Frame */}
      <div className="relative w-[360px] sm:w-[380px] h-[760px] bg-[#FAF7F2] rounded-[36px] shadow-2xl border-[6px] border-[#1A2B4C] overflow-hidden flex flex-col select-none ring-2 ring-[#1A2B4C]/20">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#1A2B4C] rounded-full z-50 flex items-center justify-between px-3 border border-white/20">
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-white/20" />
          <div className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-pulse" title="Live System Active" />
        </div>

        {/* Status Bar */}
        <div className="h-10 bg-transparent flex items-center justify-between px-6 pt-1 text-[#1A2B4C] text-xs font-black z-40 border-b border-[#1A2B4C]/10">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5 opacity-90 text-[#1A2B4C]">
            <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <Battery className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-[#FAF7F2]">
          {children}

          {/* Dev Inspection Overlay for 60dp targets */}
          {showInspectionOverlay && (
            <div className="pointer-events-none absolute inset-0 z-40 bg-emerald-500/10 border-2 border-dashed border-emerald-600 flex flex-col justify-between p-2">
              <div className="bg-[#1A2B4C] text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow border border-emerald-400 self-start">
                60×60dp Touch Target Grid Active
              </div>
            </div>
          )}
        </div>

        {/* Home Indicator Bar */}
        <div className="h-5 bg-transparent flex items-center justify-center pb-1 z-40 pointer-events-none">
          <div className="w-28 h-1.5 bg-[#1A2B4C]/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
