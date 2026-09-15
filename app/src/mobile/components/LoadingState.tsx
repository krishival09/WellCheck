import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form } from '../../rn-compat';
import React from 'react';
import { Loader2 } from 'lucide-react-native';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading live Firestore data...' 
}) => {
  return (
    <Div 
      id="loading-skeleton-container" 
      className="flex-1 flex flex-col p-4 bg-[#FAF7F2] gap-4 animate-pulse"
    >
      {/* Skeleton Header */}
      <Div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <Div className="h-7 w-32 bg-slate-200 rounded-lg" />
        <Div className="h-9 w-20 bg-slate-200 rounded-lg" />
      </Div>

      {/* Skeleton Top Banner */}
      <Div className="h-16 w-full bg-slate-200 rounded-2xl flex items-center px-4 gap-3">
        <Div className="w-8 h-8 rounded-full bg-slate-300" />
        <Div className="flex flex-col gap-1.5 flex-1">
          <Div className="h-4 w-28 bg-slate-300 rounded" />
          <Div className="h-3 w-44 bg-slate-300 rounded" />
        </Div>
      </Div>

      {/* Skeleton Main Card */}
      <Div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-3">
        <Div className="flex justify-between items-center">
          <Div className="h-5 w-36 bg-slate-200 rounded" />
          <Div className="h-6 w-16 bg-slate-200 rounded-full" />
        </Div>
        <Div className="h-4 w-48 bg-slate-100 rounded" />
        <Div className="h-12 w-full bg-slate-100 rounded-xl" />
      </Div>

      {/* Skeleton Feed List */}
      <Div className="flex flex-col gap-2.5 mt-2">
        <Div className="h-4 w-24 bg-slate-200 rounded" />
        <Div className="h-20 bg-white border border-slate-200 rounded-2xl" />
        <Div className="h-20 bg-white border border-slate-200 rounded-2xl" />
      </Div>

      {/* Center Spinner Indicator */}
      <Div className="mt-auto py-6 flex flex-col items-center justify-center gap-2 text-slate-600">
        <Loader2 className="w-8 h-8 text-[#FF6B4A] animate-spin" />
        <Span className="text-sm font-bold tracking-tight">{message}</Span>
        <Span className="text-xs text-slate-400">Syncing with Firestore collections</Span>
      </Div>
    </Div>
  );
};
