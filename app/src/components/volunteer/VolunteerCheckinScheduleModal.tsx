import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
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
} from 'lucide-react-native';
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
    <View 
      id="volunteer-checkin-schedule-modal"
      
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <View >
        
        {/* Header */}
        <View >
          <View >
            <View >
              <Clock  />
            </View>
            <View>
              <Text >
                Scheduled Check-In Times
              </Text>
              <Text >
                Automated check-in messages for <Text >{pairData.elderName}</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            id="close-checkin-schedule-modal-btn"
            onClick={() => {
              soundFx.playTap();
              onClose();
            }}
            aria-label="Close modal"
            
          >
            <X  />
          </TouchableOpacity>
        </View>

        {/* 3-Minute Timeout Policy Banner */}
        <View >
          <Timer  />
          <View >
            <Text >
              ⚡ 3-Minute Escalation Rule
            </Text>
            <Text >
              When a check-in time arrives, <Text >{pairData.elderName}</Text> receives an instant prompt with sound and voice. If no response is received within <Text >3 minutes</Text>, a high-priority <Text>Missed Check-In Alert Pop-up</Text> will immediately trigger on your screen.
            </Text>
          </View>
        </View>

        {/* Success toast if triggered */}
        {testSentToast && (
          <View >
            <CheckCircle2  />
            <Text>{testSentToast}</Text>
          </View>
        )}

        {/* Body Content */}
        <View >
          
          {/* Elder Quick-Switch Strip */}
          {monitoredElders.length > 1 && (
            <View >
              <Text >
                Elders:
              </Text>
              {monitoredElders.map((elder) => {
                const isSelected = elder.id === selectedElderId;
                return (
                  <TouchableOpacity
                    key={elder.id}
                    onClick={() => selectElder(elder.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-xs'
                        : 'bg-white text-[#1A2B4C] border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Text>{elder.avatarEmoji || '👵'}</Text>
                    <Text>{elder.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Active Prompt Alert if running right now */}
          {activeCheckinPrompt && activeCheckinPrompt.status === 'pending' && (
            <View >
              <View >
                <Text  />
                <View>
                  <Text >
                    Active Check-In Prompt In Progress
                  </Text>
                  <Text >
                    Sent for {activeCheckinPrompt.scheduledTime} • 3 min window counting down
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onClick={handleSimulateMissedTimeout}
                
                title="Fast forward to test 3-min timeout popup"
              >
                Fast-Forward 3m
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Preset Time Chips */}
          <View>
            <View >
              <Text >
                <Sparkles  />
                Add Common Schedule Slots
              </Text>
              <TouchableOpacity
                onClick={() => {
                  soundFx.playTap();
                  setShowAddForm(!showAddForm);
                }}
                
              >
                <Plus  />
                <Text>{showAddForm ? 'Cancel Custom' : 'Custom Time'}</Text>
              </TouchableOpacity>
            </View>

            <View >
              {PRESET_TIMES.map((preset) => {
                const isAlreadyAdded = checkinSchedules.some(s => s.time === preset.time);
                return (
                  <TouchableOpacity
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
                    <View >
                      <Text >{preset.time}</Text>
                      {isAlreadyAdded ? (
                        <CheckCircle2  />
                      ) : (
                        <Plus  />
                      )}
                    </View>
                    <Text >{preset.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Custom Time Add Form */}
          {showAddForm && (
            <form 
              onSubmit={handleAddSubmit}
              
            >
              <Text >
                Set Custom Check-In Time
              </Text>
              <View >
                <View>
                  <Text >
                    Check-In Time (e.g. 10:15 AM)
                  </Text>
                  <input
                    type="text"
                    required
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="09:00 AM"
                    
                  />
                </View>
                <View>
                  <Text >
                    Label / Description
                  </Text>
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="e.g. Afternoon Tea Check"
                    
                  />
                </View>
              </View>
              <TouchableOpacity
                type="submit"
                
              >
                <Plus  />
                <Text>Save Check-In Time to Schedule</Text>
              </TouchableOpacity>
            </form>
          )}

          {/* Current Configured Schedule Slots List */}
          <View>
            <Text >
              Active Daily Check-In Times ({checkinSchedules.length})
            </Text>

            {checkinSchedules.length === 0 ? (
              <View >
                <Clock  />
                <Text >No check-in times currently scheduled.</Text>
                <Text >Click any preset above to add daily automated check-in times.</Text>
              </View>
            ) : (
              <View >
                {checkinSchedules.map((slot) => (
                  <View
                    key={slot.id}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition ${
                      slot.enabled
                        ? 'bg-white border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C]'
                        : 'bg-slate-100 border-slate-300 opacity-60'
                    }`}
                  >
                    <View >
                      <TouchableOpacity
                        onClick={() => toggleCheckinScheduleTime(slot.id)}
                        className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center font-black cursor-pointer transition ${
                          slot.enabled
                            ? 'bg-[#4CAF50] text-white border-[#1A2B4C]'
                            : 'bg-slate-200 text-slate-400 border-slate-400'
                        }`}
                        title={slot.enabled ? 'Enabled (tap to pause)' : 'Paused (tap to enable)'}
                      >
                        {slot.enabled ? '✓' : '⏸'}
                      </TouchableOpacity>

                      <View>
                        <View >
                          <Text >
                            {slot.time}
                          </Text>
                          <Text className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            slot.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {slot.enabled ? 'Active Daily' : 'Paused'}
                          </Text>
                        </View>
                        <Text >
                          {slot.label}
                        </Text>
                      </View>
                    </View>

                    <View >
                      {/* Send check-in prompt right now */}
                      <TouchableOpacity
                        onClick={() => handleSendPromptNow(slot.time)}
                        
                        title="Send this check-in prompt to the elder right now"
                      >
                        <Send  />
                        <Text >Send Now</Text>
                      </TouchableOpacity>

                      {/* Delete slot */}
                      <TouchableOpacity
                        onClick={() => deleteCheckinScheduleTime(slot.id)}
                        
                        title="Delete this schedule slot"
                      >
                        <Trash2  />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Testing & Simulation Card for Evaluation */}
          <View >
            <Text >
              <AlertTriangle  />
              Volunteer Test & Demonstration Tools
            </Text>
            <Text >
              Want to see what happens when {pairData.elderName} misses a 3-minute check-in? Click below to immediately trigger the Missed Check-In Alert Pop-up.
            </Text>
            <View >
              <TouchableOpacity
                id="volunteer-simulate-missed-checkin-btn"
                onClick={handleSimulateMissedTimeout}
                
              >
                <Play  />
                <Text>Trigger Missed 3-Min Check-In Pop-Up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onClick={() => handleSendPromptNow('09:00 AM')}
                
              >
                <Bell  />
                <Text>Send 9:00 AM Prompt to Elder</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* Footer */}
        <View >
          <Text >
            {checkinSchedules.filter(s => s.enabled).length} automated check-in times enabled
          </Text>
          <TouchableOpacity
            onClick={onClose}
            
          >
            Done
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};
