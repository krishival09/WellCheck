import { Div, Span, P, Label, Button, Input, Form } from '../../rn-compat';
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
    <Div 
      id="volunteer-checkin-schedule-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Div className="bg-[#FAF7F2] dark:bg-slate-900 w-full max-w-lg rounded-3xl border-3 border-[#1A2B4C] dark:border-slate-700 shadow-[6px_6px_0px_#1A2B4C] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <Div className="p-4 bg-white dark:bg-slate-800 border-b-2 border-[#1A2B4C] dark:border-slate-700 flex items-center justify-between">
          <Div className="flex items-center gap-3">
            <Div className="w-10 h-10 rounded-2xl bg-[#1A2B4C] dark:bg-slate-700 text-white flex items-center justify-center font-black shadow-[2px_2px_0px_#1A2B4C]">
              <Clock className="w-5 h-5 text-[#FFB84D]" />
            </Div>
            <Div>
              <h2 className="text-base font-black text-[#1A2B4C] dark:text-white leading-tight">
                Scheduled Check-In Times
              </h2>
              <P className="text-xs font-bold text-[#1A2B4C]/70 dark:text-slate-400">
                Automated check-in messages for <Span className="font-black text-[#1A2B4C] dark:text-white">{pairData.elderName}</Span>
              </P>
            </Div>
          </Div>
          <Button
            id="close-checkin-schedule-modal-btn"
            onClick={() => {
              soundFx.playTap();
              onClose();
            }}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-[#1A2B4C] dark:text-white border-2 border-[#1A2B4C] dark:border-slate-600 flex items-center justify-center cursor-pointer active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </Button>
        </Div>

        {/* 3-Minute Timeout Policy Banner */}
        <Div className="bg-[#FFF8E7] dark:bg-amber-950/40 border-b-2 border-[#1A2B4C] dark:border-slate-700 px-4 py-3 flex items-start gap-2.5">
          <Timer className="w-5 h-5 text-[#FFB84D] shrink-0 mt-0.5" />
          <Div className="text-xs text-[#1A2B4C] dark:text-amber-200">
            <Span className="font-black uppercase tracking-wider block text-[11px] text-[#1A2B4C] dark:text-amber-300">
              ⚡ 3-Minute Escalation Rule
            </Span>
            <P className="font-medium text-[11px] leading-relaxed mt-0.5">
              When a check-in time arrives, <Span className="font-bold">{pairData.elderName}</Span> receives an instant prompt with sound and voice. If no response is received within <Span className="font-black underline">3 minutes</Span>, a high-priority <strong>Missed Check-In Alert Pop-up</strong> will immediately trigger on your screen.
            </P>
          </Div>
        </Div>

        {/* Success toast if triggered */}
        {testSentToast && (
          <Div className="bg-[#4CAF50] text-white px-4 py-2 text-xs font-black flex items-center gap-2 border-b-2 border-[#1A2B4C] animate-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <Span>{testSentToast}</Span>
          </Div>
        )}

        {/* Body Content */}
        <Div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
          
          {/* Elder Quick-Switch Strip */}
          {monitoredElders.length > 1 && (
            <Div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <Span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 shrink-0 mr-1">
                Elders:
              </Span>
              {monitoredElders.map((elder) => {
                const isSelected = elder.id === selectedElderId;
                return (
                  <Button
                    key={elder.id}
                    onClick={() => selectElder(elder.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-[#1A2B4C] dark:text-white border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Span>{elder.avatarEmoji || '👵'}</Span>
                    <Span>{elder.name}</Span>
                  </Button>
                );
              })}
            </Div>
          )}

          {/* Active Prompt Alert if running right now */}
          {activeCheckinPrompt && activeCheckinPrompt.status === 'pending' && (
            <Div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border-2 border-amber-500 shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-between">
              <Div className="flex items-center gap-2.5">
                <Span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                <Div>
                  <Span className="text-xs font-black uppercase text-amber-900 dark:text-amber-200 block">
                    Active Check-In Prompt In Progress
                  </Span>
                  <Span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                    Sent for {activeCheckinPrompt.scheduledTime} • 3 min window counting down
                  </Span>
                </Div>
              </Div>
              <Button
                onClick={handleSimulateMissedTimeout}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-xs cursor-pointer"
                title="Fast forward to test 3-min timeout popup"
              >
                Fast-Forward 3m
              </Button>
            </Div>
          )}

          {/* Quick Preset Time Chips */}
          <Div>
            <Div className="flex items-center justify-between mb-2">
              <Span className="text-xs font-black uppercase tracking-wider text-[#1A2B4C] dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
                Add Common Schedule Slots
              </Span>
              <Button
                onClick={() => {
                  soundFx.playTap();
                  setShowAddForm(!showAddForm);
                }}
                className="text-xs font-black text-[#1A2B4C] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <Span>{showAddForm ? 'Cancel Custom' : 'Custom Time'}</Span>
              </Button>
            </Div>

            <Div className="grid grid-cols-2 gap-2">
              {PRESET_TIMES.map((preset) => {
                const isAlreadyAdded = checkinSchedules.some(s => s.time === preset.time);
                return (
                  <Button
                    key={preset.time}
                    disabled={isAlreadyAdded}
                    onClick={() => {
                      addCheckinScheduleTime(preset.time, preset.label);
                    }}
                    className={`min-h-[44px] p-2 rounded-xl text-left border-2 transition flex flex-col justify-center cursor-pointer ${
                      isAlreadyAdded
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                        : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-[#1A2B4C] dark:text-white border-[#1A2B4C] dark:border-slate-700 shadow-[2px_2px_0px_#1A2B4C] active:scale-95'
                    }`}
                  >
                    <Div className="flex items-center justify-between">
                      <Span className="text-xs font-black">{preset.time}</Span>
                      {isAlreadyAdded ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-[#4CAF50]" />
                      )}
                    </Div>
                    <Span className="text-[10px] font-bold truncate opacity-75">{preset.label}</Span>
                  </Button>
                );
              })}
            </Div>
          </Div>

          {/* Custom Time Add Form */}
          {showAddForm && (
            <Form 
              onSubmit={handleAddSubmit}
              className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2.5 animate-in fade-in"
            >
              <Span className="text-xs font-black uppercase text-[#1A2B4C] dark:text-white">
                Set Custom Check-In Time
              </Span>
              <Div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Div>
                  <Label className="block text-[10px] font-black uppercase text-[#1A2B4C] dark:text-slate-300 mb-1">
                    Check-In Time (e.g. 10:15 AM)
                  </Label>
                  <Input
                    type="text"
                    required
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] dark:bg-slate-900 dark:text-white rounded-xl border border-[#1A2B4C] dark:border-slate-600 focus:outline-none"
                  />
                </Div>
                <Div>
                  <Label className="block text-[10px] font-black uppercase text-[#1A2B4C] dark:text-slate-300 mb-1">
                    Label / Description
                  </Label>
                  <Input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="e.g. Afternoon Tea Check"
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] dark:bg-slate-900 dark:text-white rounded-xl border border-[#1A2B4C] dark:border-slate-600 focus:outline-none"
                  />
                </Div>
              </Div>
              <Button
                type="submit"
                className="min-h-[40px] bg-[#1A2B4C] hover:bg-black text-white font-black text-xs uppercase rounded-xl border border-black shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#4CAF50]" />
                <Span>Save Check-In Time to Schedule</Span>
              </Button>
            </Form>
          )}

          {/* Current Configured Schedule Slots List */}
          <Div>
            <Span className="text-xs font-black uppercase tracking-wider text-[#1A2B4C] dark:text-white block mb-2">
              Active Daily Check-In Times ({checkinSchedules.length})
            </Span>

            {checkinSchedules.length === 0 ? (
              <Div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-[#1A2B4C] dark:border-slate-700 text-center text-slate-500 dark:text-slate-400">
                <Clock className="w-8 h-8 mx-auto text-slate-400 mb-1" />
                <P className="text-xs font-bold">No check-in times currently scheduled.</P>
                <P className="text-[11px] mt-0.5">Click any preset above to add daily automated check-in times.</P>
              </Div>
            ) : (
              <Div className="flex flex-col gap-2.5">
                {checkinSchedules.map((slot) => (
                  <Div
                    key={slot.id}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition ${
                      slot.enabled
                        ? 'bg-white dark:bg-slate-800 border-[#1A2B4C] dark:border-slate-700 shadow-[2px_2px_0px_#1A2B4C]'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <Div className="flex items-center gap-3">
                      <Button
                        onClick={() => toggleCheckinScheduleTime(slot.id)}
                        className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center font-black cursor-pointer transition ${
                          slot.enabled
                            ? 'bg-[#4CAF50] text-white border-[#1A2B4C]'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 border-slate-400'
                        }`}
                        title={slot.enabled ? 'Enabled (tap to pause)' : 'Paused (tap to enable)'}
                      >
                        {slot.enabled ? '✓' : '⏸'}
                      </Button>

                      <Div>
                        <Div className="flex items-center gap-2">
                          <Span className="text-sm font-black text-[#1A2B4C] dark:text-white">
                            {slot.time}
                          </Span>
                          <Span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            slot.enabled ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {slot.enabled ? 'Active Daily' : 'Paused'}
                          </Span>
                        </Div>
                        <P className="text-[11px] font-bold text-[#1A2B4C]/70 dark:text-slate-400">
                          {slot.label}
                        </P>
                      </Div>
                    </Div>

                    <Div className="flex items-center gap-1.5">
                      {/* Send check-in prompt right now */}
                      <Button
                        onClick={() => handleSendPromptNow(slot.time)}
                        className="px-2.5 py-1.5 bg-[#FAF7F2] dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 text-[#1A2B4C] dark:text-white border border-[#1A2B4C] dark:border-slate-600 rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 transition cursor-pointer"
                        title="Send this check-in prompt to the elder right now"
                      >
                        <Send className="w-3.5 h-3.5 text-[#4CAF50]" />
                        <Span className="hidden sm:inline">Send Now</Span>
                      </Button>

                      {/* Delete slot */}
                      <Button
                        onClick={() => deleteCheckinScheduleTime(slot.id)}
                        className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-700 flex items-center justify-center cursor-pointer transition"
                        title="Delete this schedule slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Div>
                  </Div>
                ))}
              </Div>
            )}
          </Div>

          {/* Testing & Simulation Card for Evaluation */}
          <Div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border-2 border-amber-400 dark:border-amber-700 shadow-[2px_2px_0px_#1A2B4C] flex flex-col gap-2">
            <Span className="text-xs font-black uppercase text-amber-950 dark:text-amber-200 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              Volunteer Test & Demonstration Tools
            </Span>
            <P className="text-[11px] font-bold text-amber-900 dark:text-amber-300 leading-snug">
              Want to see what happens when {pairData.elderName} misses a 3-minute check-in? Click below to immediately trigger the Missed Check-In Alert Pop-up.
            </P>
            <Div className="flex flex-wrap gap-2 pt-1">
              <Button
                id="volunteer-simulate-missed-checkin-btn"
                onClick={handleSimulateMissedTimeout}
                className="min-h-[40px] px-3.5 bg-[#FF6B4A] hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border border-black shadow-[2px_2px_0px_#1A2B4C] flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <Span>Trigger Missed 3-Min Check-In Pop-Up</Span>
              </Button>

              <Button
                onClick={() => handleSendPromptNow('09:00 AM')}
                className="min-h-[40px] px-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 text-[#1A2B4C] dark:text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[2px_2px_0px_#1A2B4C] flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-[#FFB84D]" />
                <Span>Send 9:00 AM Prompt to Elder</Span>
              </Button>
            </Div>
          </Div>

        </Div>

        {/* Footer */}
        <Div className="p-3 bg-white dark:bg-slate-800 border-t-2 border-[#1A2B4C] dark:border-slate-700 flex items-center justify-between">
          <Span className="text-[11px] font-bold text-[#1A2B4C]/70 dark:text-slate-400">
            {checkinSchedules.filter(s => s.enabled).length} automated check-in times enabled
          </Span>
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-[#1A2B4C] hover:bg-black text-white font-black text-xs uppercase tracking-wider rounded-xl border border-black shadow-[2px_2px_0px_#1A2B4C] cursor-pointer"
          >
            Done
          </Button>
        </Div>

      </Div>
    </Div>
  );
};
