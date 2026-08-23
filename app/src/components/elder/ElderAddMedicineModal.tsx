import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { 
  X, 
  Pill, 
  Plus, 
  Camera, 
  Clock, 
  Check, 
  Volume2, 
  Sparkles,
  Upload,
  Image as ImageIcon
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { PRESET_MEDICINE_PHOTOS } from '../common/MedicinePhotoUploaderModal';
import { soundFx } from '../../utils/audio';
import { speakText, TRANSLATIONS } from '../../utils/speech';

interface ElderAddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_TIME_PRESETS = [
  { label: 'Morning (08:00 AM)', time: '08:00 AM', icon: '🌅' },
  { label: 'Afternoon (01:00 PM)', time: '01:00 PM', icon: '☀️' },
  { label: 'Evening (05:00 PM)', time: '05:00 PM', icon: '🌇' },
  { label: 'Night (09:00 PM)', time: '09:00 PM', icon: '🌙' },
];

const COMMON_DOSAGE_PRESETS = [
  '1 Tablet with water',
  '2 Tablets with water',
  '1 Capsule',
  '1 Spoon syrup (5ml)',
  'Half tablet (1/2)',
];

const COMMON_INSTRUCTIONS_PRESETS = [
  'Take after breakfast / food with a glass of water.',
  'Take on an empty stomach in the morning.',
  'Take right after dinner before sleep.',
  'Take with warm milk or water.',
];

const COMMON_MED_NAME_SUGGESTIONS = [
  'Blood Pressure Pill',
  'Diabetes Tablet',
  'Morning Vitamin',
  'Heart Medicine',
  'Calcium Supplement',
  'Pain Relief Tablet',
];

export const ElderAddMedicineModal: React.FC<ElderAddMedicineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addMedicine, pairData, language } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];

  const [medicineName, setMedicineName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('08:00 AM');
  const [dosage, setDosage] = useState('1 Tablet with water');
  const [instructions, setInstructions] = useState('Take after breakfast / food with a glass of water.');
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_MEDICINE_PHOTOS[0].url);
  const [customPhotoUpload, setCustomPhotoUpload] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFx.playTap();
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setCustomPhotoUpload(dataUrl);
        setSelectedPhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReadFormAloud = () => {
    soundFx.playTap();
    const promptText = `Add your new medicine. Enter medicine name, choose scheduled time like Morning 8 AM or Night 9 PM, choose dosage, and pick pill picture. Then press the green Save button.`;
    speakText(promptText, language);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = medicineName.trim() || 'Daily Tablet';

    soundFx.playSuccessChime();
    addMedicine({
      elderId: pairData.elderId || 'elder-8841',
      medicineName: finalName,
      dosage: dosage.trim() || '1 tablet with water',
      scheduledTime: scheduledTime.trim() || '08:00 AM',
      instructions: instructions.trim() || 'Take as prescribed with water.',
      localPhotoRef: selectedPhoto,
      photoUploadedBy: 'elder',
      photoUploadedAt: new Date().toISOString(),
      taken: false,
      takenAt: null,
    });

    speakText(`New medicine ${finalName} added for ${scheduledTime}`, language);
    onClose();
  };

  return (
    <View 
      id="elder-add-medicine-modal"
      
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <View >
        
        {/* Header */}
        <View >
          <View >
            <View >
              💊
            </View>
            <View>
              <Text >
                Add New Medicine
              </Text>
              <Text >
                Set up your dose schedule & picture
              </Text>
            </View>
          </View>

          <View >
            <TouchableOpacity
              type="button"
              id="elder-add-med-listen-btn"
              onClick={handleReadFormAloud}
              title="Listen to Instructions"
              
            >
              <Volume2  />
              <Text >Listen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onClick={onClose}
              aria-label="Close"
              
            >
              <X  />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Body */}
        <form onSubmit={handleSubmit} >
          
          {/* 1. Medicine Name */}
          <View >
            <Text >
              1. Medicine / Tablet Name *
            </Text>
            <input
              id="elder-input-med-name"
              type="text"
              required
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="Type name (e.g. Blood Pressure Pill)"
              
            />
            {/* Quick Name Suggestions */}
            <View >
              {COMMON_MED_NAME_SUGGESTIONS.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    setMedicineName(suggestion);
                  }}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition cursor-pointer ${
                    medicineName === suggestion
                      ? 'bg-[#1A2B4C] text-white border-[#1A2B4C]'
                      : 'bg-[#FAF7F2] text-[#1A2B4C] border-[#1A2B4C]/40 hover:bg-slate-100'
                  }`}
                >
                  + {suggestion}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 2. Scheduled Time Selection */}
          <View >
            <Text >
              <Text>2. When should you take it? *</Text>
              <Text >
                {scheduledTime}
              </Text>
            </Text>
            
            {/* One-tap Time Slots */}
            <View >
              {COMMON_TIME_PRESETS.map((slot) => (
                <TouchableOpacity
                  key={slot.time}
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    setScheduledTime(slot.time);
                  }}
                  className={`min-h-[46px] p-2 rounded-xl border-2 font-black text-xs flex items-center gap-2 transition cursor-pointer ${
                    scheduledTime === slot.time
                      ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C]'
                      : 'bg-[#FAF7F2] hover:bg-amber-50 text-[#1A2B4C] border-[#1A2B4C]/40'
                  }`}
                >
                  <Text >{slot.icon}</Text>
                  <Text >{slot.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Time Input */}
            <View >
              <Text >Or custom time:</Text>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="e.g. 02:30 PM"
                
              />
            </View>
          </View>

          {/* 3. Dosage & Instructions */}
          <View >
            <View>
              <Text >
                3. How much to take (Dosage)?
              </Text>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 1 Tablet with water"
                
              />
              <View >
                {COMMON_DOSAGE_PRESETS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    type="button"
                    onClick={() => {
                      soundFx.playTap();
                      setDosage(d);
                    }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border cursor-pointer ${
                      dosage === d
                        ? 'bg-[#4CAF50] text-white border-[#4CAF50]'
                        : 'bg-[#FAF7F2] text-[#1A2B4C] border-slate-300'
                    }`}
                  >
                    {d}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text >
                4. Instructions / With Food?
              </Text>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Take after food with warm water"
                
              />
              <View >
                {COMMON_INSTRUCTIONS_PRESETS.map((inst) => (
                  <TouchableOpacity
                    key={inst}
                    type="button"
                    onClick={() => {
                      soundFx.playTap();
                      setInstructions(inst);
                    }}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border cursor-pointer text-left ${
                      instructions === inst
                        ? 'bg-[#1A2B4C] text-white border-[#1A2B4C]'
                        : 'bg-[#FAF7F2] text-[#1A2B4C] border-slate-300'
                    }`}
                  >
                    {inst}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* 4. Choose Pill Picture */}
          <View >
            <View >
              <Text >
                5. Pill Picture (So you recognize it easily)
              </Text>
              <Text >
                <Camera  />
                <Text>Snap / Upload</Text>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  
                />
              </Text>
            </View>

            {/* Photo Preset Grid */}
            <View >
              {PRESET_MEDICINE_PHOTOS.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    setSelectedPhoto(preset.url);
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-3 transition cursor-pointer ${
                    selectedPhoto === preset.url
                      ? 'border-[#4CAF50] ring-3 ring-[#4CAF50]/30 shadow-md scale-102'
                      : 'border-[#1A2B4C]/40 hover:border-[#1A2B4C]'
                  }`}
                >
                  <Image
                    src={preset.url}
                    alt={preset.title}
                    referrerPolicy="no-referrer"
                    
                  />
                  {selectedPhoto === preset.url && (
                    <View >
                      <Check  />
                    </View>
                  )}
                  <Text >
                    {preset.category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <View >
            <TouchableOpacity
              id="elder-submit-add-med-btn"
              type="submit"
              
            >
              <Check  />
              <Text>✓ Save & Add to My Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              type="button"
              onClick={onClose}
              
            >
              Cancel
            </TouchableOpacity>
          </View>
        </form>
      </View>
    </View>
  );
};
