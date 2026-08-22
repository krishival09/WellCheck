import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading live Firestore data...' 
}) => {
  return (
    <div 
      id="loading-skeleton-container" 
      className="flex-1 flex flex-col p-4 bg-[#FAF7F2] gap-4 animate-pulse"
    >
      {/* Skeleton Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="h-7 w-32 bg-slate-200 rounded-lg" />
        <div className="h-9 w-20 bg-slate-200 rounded-lg" />
      </div>

      {/* Skeleton Top Banner */}
      <div className="h-16 w-full bg-slate-200 rounded-2xl flex items-center px-4 gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-300" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-4 w-28 bg-slate-300 rounded" />
          <div className="h-3 w-44 bg-slate-300 rounded" />
        </div>
      </div>

      {/* Skeleton Main Card */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="h-5 w-36 bg-slate-200 rounded" />
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-4 w-48 bg-slate-100 rounded" />
        <div className="h-12 w-full bg-slate-100 rounded-xl" />
      </div>

      {/* Skeleton Feed List */}
      <div className="flex flex-col gap-2.5 mt-2">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="h-20 bg-white border border-slate-200 rounded-2xl" />
        <div className="h-20 bg-white border border-slate-200 rounded-2xl" />
      </div>

      {/* Center Spinner Indicator */}
      <div className="mt-auto py-6 flex flex-col items-center justify-center gap-2 text-slate-600">
        <Loader2 className="w-8 h-8 text-[#FF6B4A] animate-spin" />
        <span className="text-sm font-bold tracking-tight">{message}</span>
        <span className="text-xs text-slate-400">Syncing with Firestore collections</span>
      </div>
    </div>
  );
};
