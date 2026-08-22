import React from 'react';
import { BellOff, Pill, ShieldCheck, Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'alerts' | 'medicines' | 'general';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'alerts':
        return <BellOff className="w-10 h-10 text-emerald-600" />;
      case 'medicines':
        return <Pill className="w-10 h-10 text-amber-600" />;
      default:
        return <ShieldCheck className="w-10 h-10 text-indigo-600" />;
    }
  };

  const defaultTitle = 
    type === 'alerts' 
      ? 'No Active Alerts' 
      : type === 'medicines' 
      ? 'No Medicine Reminders Set' 
      : 'All Clear';

  const defaultDesc = 
    type === 'alerts'
      ? 'Everything is quiet and safe. Past events will show up here.'
      : type === 'medicines'
      ? 'Add daily prescriptions and vitamins to track adherence.'
      : 'No pending items at this time.';

  return (
    <div 
      id={`empty-state-${type}`}
      className="w-full p-6 bg-white border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center my-3 shadow-sm"
    >
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        {getIcon()}
      </div>
      <h3 className="text-lg font-black text-slate-900 leading-tight">
        {title || defaultTitle}
      </h3>
      <p className="text-xs font-semibold text-slate-500 mt-1 max-w-[240px] leading-relaxed">
        {description || defaultDesc}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-3 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
