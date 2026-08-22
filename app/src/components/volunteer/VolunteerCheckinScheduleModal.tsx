import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Plus, 
  Trash2, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Send,
  Timer,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audio';

interface VolunteerCheckinScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_TIMES = [
  { time: '08:00 AM', label: 'Morning Awakening Check' },
  { time: '09:00 AM', label: 'Morning Safety Check' },
  { time: '12:30 PM', label: 'Mid-Day Lunch Check' },
  { time: '03:00 PM', label: 'Afternoon Well-being Check' },
  { time: '06:30 PM', label: 'Evening Dinner Check' },
  { time: '09:00 PM', label: 'Bedtime Safe Night Check' },
];

export const VolunteerCheckinScheduleModal: React.FC<VolunteerCheckinScheduleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    pairData,
    checkinSchedules,
    addCheckinScheduleTime,
    deleteCheckinScheduleTime,
    toggleCheckinScheduleTime,
    triggerCheckinPrompt,
    simulateMissedCheckinTimeout,
    activeCheckinPrompt,
    monitoredElders,
    selectedElderId,
    selectedElder,
    selectElder,
  } = useApp();

  const [customTime, setCustomTime] = useState<string>('09:00 AM');
  const [customLabel, setCustomLabel] = useState<string>('Scheduled Check-In');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [testSentToast, setTestSentToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTime.trim()) return;
    addCheckinScheduleTime(customTime.trim(), customLabel.trim() || 'Scheduled Check-In');
    setCustomLabel('Scheduled Check-In');
    setShowAddForm(false);
  };

  const handleSendPromptNow = (timeStr: string) => {
    triggerCheckinPrompt(timeStr);
    setTestSentToast(`Check-In message sent to ${pairData.elderName} for ${timeStr}! (3 min timeout active)`);
    setTimeout(() => setTestSentToast(null), 4000);
  };

  const handleSimulateMissedTimeout = () => {
    simulateMissedCheckinTimeout();
    onClose();
  };

  return (
    <div 
      id="volunteer-checkin-schedule-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FAF7F2] w-full max-w-lg rounded-3xl border-3 border-[#1A2B4C] shadow-[6px_6px_0px_#1A2B4C] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 bg-white border-b-2 border-[#1A2B4C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A2B4C] text-white flex items-center justify-center font-black shadow-[2px_2px_0px_#1A2B4C]">
              <Clock className="w-5 h-5 text-[#FFB84D]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1A2B4C] leading-tight">
                Scheduled Check-In Times
              </h2>
              <p className="text-xs font-bold text-[#1A2B4C]/70">
                Automated check-in messages for <span className="font-black text-[#1A2B4C]">{pairData.elderName}</span>
              </p>
            </div>
          </div>
          <button
            id="close-checkin-schedule-modal-btn"
            onClick={() => {
              soundFx.playTap();
              onClose();
            }}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1A2B4C] border-2 border-[#1A2B4C] flex items-center justify-center cursor-pointer active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Minute Timeout Policy Banner */}
        <div className="bg-[#FFF8E7] border-b-2 border-[#1A2B4C] px-4 py-3 flex items-start gap-2.5">
          <Timer className="w-5 h-5 text-[#FFB84D] shrink-0 mt-0.5" />
          <div className="text-xs text-[#1A2B4C]">
            <span className="font-black uppercase tracking-wider block text-[11px] text-[#1A2B4C]">
              ⚡ 3-Minute Escalation Rule
            </span>
            <p className="font-medium text-[11px] leading-relaxed mt-0.5">
              When a check-in time arrives, <span className="font-bold">{pairData.elderName}</span> receives an instant prompt with sound and voice. If no response is received within <span className="font-black underline">3 minutes</span>, a high-priority <strong>Missed Check-In Alert Pop-up</strong> will immediately trigger on your screen.
            </p>
          </div>
        </div>

        {/* Success toast if triggered */}
        {testSentToast && (
          <div className="bg-[#4CAF50] text-white px-4 py-2 text-xs font-black flex items-center gap-2 border-b-2 border-[#1A2B4C] animate-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{testSentToast}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
          
          {/* Elder Quick-Switch Strip */}
          {monitoredElders.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-black uppercase text-slate-500 shrink-0 mr-1">
                Elders:
              </span>
              {monitoredElders.map((elder) => {
                const isSelected = elder.id === selectedElderId;
                return (
                  <button
                    key={elder.id}
                    onClick={() => selectElder(elder.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-xs'
                        : 'bg-white text-[#1A2B4C] border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{elder.avatarEmoji || '👵'}</span>
                    <span>{elder.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Prompt Alert if running right now */}
          {activeCheckinPrompt && activeCheckinPrompt.status === 'pending' && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-500 shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                <div>
                  <span className="text-xs font-black uppercase text-amber-900 block">
                    Active Check-In Prompt In Progress
                  </span>
                  <span className="text-[11px] font-bold text-amber-800">
                    Sent for {activeCheckinPrompt.scheduledTime} • 3 min window counting down
                  </span>
                </div>
              </div>
              <button
                onClick={handleSimulateMissedTimeout}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-xs cursor-pointer"
                title="Fast forward to test 3-min timeout popup"
              >
                Fast-Forward 3m
              </button>
            </div>
          )}

          {/* Quick Preset Time Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#1A2B4C] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
                Add Common Schedule Slots
              </span>
              <button
                onClick={() => {
                  soundFx.playTap();
                  setShowAddForm(!showAddForm);
                }}
                className="text-xs font-black text-[#1A2B4C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Cancel Custom' : 'Custom Time'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_TIMES.map((preset) => {
                const isAlreadyAdded = checkinSchedules.some(s => s.time === preset.time);
                return (
                  <button
                    key={preset.time}
                    disabled={isAlreadyAdded}
                    onClick={() => {
                      addCheckinScheduleTime(preset.time, preset.label);
                    }}
                    className={`min-h-[44px] p-2 rounded-xl text-left border-2 transition flex flex-col justify-center cursor-pointer ${
                      isAlreadyAdded
                        ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed opacity-60'
                        : 'bg-white hover:bg-emerald-50 text-[#1A2B4C] border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] active:scale-95'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">{preset.time}</span>
                      {isAlreadyAdded ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-[#4CAF50]" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold truncate opacity-75">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Time Add Form */}
          {showAddForm && (
            <form 
              onSubmit={handleAddSubmit}
              className="p-3.5 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2.5 animate-in fade-in"
            >
              <span className="text-xs font-black uppercase text-[#1A2B4C]">
                Set Custom Check-In Time
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#1A2B4C] mb-1">
                    Check-In Time (e.g. 10:15 AM)
                  </label>
                  <input
                    type="text"
                    required
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#1A2B4C] mb-1">
                    Label / Description
                  </label>
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="e.g. Afternoon Tea Check"
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="min-h-[40px] bg-[#1A2B4C] hover:bg-black text-white font-black text-xs uppercase rounded-xl border border-black shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#4CAF50]" />
                <span>Save Check-In Time to Schedule</span>
              </button>
            </form>
          )}

          {/* Current Configured Schedule Slots List */}
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#1A2B4C] block mb-2">
              Active Daily Check-In Times ({checkinSchedules.length})
            </span>

            {checkinSchedules.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border-2 border-dashed border-[#1A2B4C] text-center text-slate-500">
                <Clock className="w-8 h-8 mx-auto text-slate-400 mb-1" />
                <p className="text-xs font-bold">No check-in times currently scheduled.</p>
                <p className="text-[11px] mt-0.5">Click any preset above to add daily automated check-in times.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {checkinSchedules.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition ${
                      slot.enabled
                        ? 'bg-white border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C]'
                        : 'bg-slate-100 border-slate-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleCheckinScheduleTime(slot.id)}
                        className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center font-black cursor-pointer transition ${
                          slot.enabled
                            ? 'bg-[#4CAF50] text-white border-[#1A2B4C]'
                            : 'bg-slate-200 text-slate-400 border-slate-400'
                        }`}
                        title={slot.enabled ? 'Enabled (tap to pause)' : 'Paused (tap to enable)'}
                      >
                        {slot.enabled ? '✓' : '⏸'}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#1A2B4C]">
                            {slot.time}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            slot.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {slot.enabled ? 'Active Daily' : 'Paused'}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-[#1A2B4C]/70">
                          {slot.label}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Send check-in prompt right now */}
                      <button
                        onClick={() => handleSendPromptNow(slot.time)}
                        className="px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-emerald-50 text-[#1A2B4C] border border-[#1A2B4C] rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 transition cursor-pointer"
                        title="Send this check-in prompt to the elder right now"
                      >
                        <Send className="w-3.5 h-3.5 text-[#4CAF50]" />
                        <span className="hidden sm:inline">Send Now</span>
                      </button>

                      {/* Delete slot */}
                      <button
                        onClick={() => deleteCheckinScheduleTime(slot.id)}
                        className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 flex items-center justify-center cursor-pointer transition"
                        title="Delete this schedule slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Testing & Simulation Card for Evaluation */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-400 shadow-[2px_2px_0px_#1A2B4C] flex flex-col gap-2">
            <span className="text-xs font-black uppercase text-amber-950 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Volunteer Test & Demonstration Tools
            </span>
            <p className="text-[11px] font-bold text-amber-900 leading-snug">
              Want to see what happens when {pairData.elderName} misses a 3-minute check-in? Click below to immediately trigger the Missed Check-In Alert Pop-up.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                id="volunteer-simulate-missed-checkin-btn"
                onClick={handleSimulateMissedTimeout}
                className="min-h-[40px] px-3.5 bg-[#FF6B4A] hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border border-black shadow-[2px_2px_0px_#1A2B4C] flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Trigger Missed 3-Min Check-In Pop-Up</span>
              </button>

              <button
                onClick={() => handleSendPromptNow('09:00 AM')}
                className="min-h-[40px] px-3.5 bg-white hover:bg-slate-50 text-[#1A2B4C] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-[#FFB84D]" />
                <span>Send 9:00 AM Prompt to Elder</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t-2 border-[#1A2B4C] flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#1A2B4C]/70">
            {checkinSchedules.filter(s => s.enabled).length} automated check-in times enabled
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1A2B4C] text-white font-black text-xs uppercase tracking-wider rounded-xl border border-black shadow-[2px_2px_0px_#1A2B4C] cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
