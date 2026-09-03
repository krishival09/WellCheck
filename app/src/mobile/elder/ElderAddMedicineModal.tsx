import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form } from '../../rn-compat';
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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRESET_MEDICINE_PHOTOS } from '../components/MedicinePhotoUploaderModal';
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
    <Div 
      id="elder-add-medicine-modal"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Div className="bg-[#FAF7F2] w-full max-w-lg max-h-[92vh] rounded-3xl border-4 border-[#1A2B4C] shadow-[8px_8px_0px_#1A2B4C] p-4 sm:p-5 text-[#1A2B4C] flex flex-col gap-3 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <Div className="flex items-center justify-between pb-2 border-b-2 border-[#1A2B4C]/20 shrink-0">
          <Div className="flex items-center gap-2.5">
            <Div className="w-10 h-10 rounded-2xl bg-[#4CAF50] text-white border-2 border-[#1A2B4C] flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_#1A2B4C]">
              💊
            </Div>
            <Div>
              <H2 className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight">
                Add New Medicine
              </H2>
              <P className="text-xs font-bold text-[#1A2B4C]/70">
                Set up your dose schedule & picture
              </P>
            </Div>
          </Div>

          <Div className="flex items-center gap-1.5">
            <Button
              type="button"
              id="elder-add-med-listen-btn"
              onClick={handleReadFormAloud}
              title="Listen to Instructions"
              className="min-h-[38px] px-2.5 bg-[#FFB84D] hover:bg-[#ffa726] text-[#1A2B4C] rounded-xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] font-black text-xs uppercase flex items-center gap-1 active:scale-95 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
              <Span className="hidden sm:inline">Listen</Span>
            </Button>
            <Button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center text-[#1A2B4C] active:scale-95 transition cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </Button>
          </Div>
        </Div>

        {/* Form Body */}
        <Form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          
          {/* 1. Medicine Name */}
          <Div className="bg-white p-3 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C]">
            <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1">
              1. Medicine / Tablet Name *
            </Label>
            <Input
              id="elder-input-med-name"
              type="text"
              required
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="Type name (e.g. Blood Pressure Pill)"
              className="w-full text-sm font-black px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white text-[#1A2B4C]"
            />
            {/* Quick Name Suggestions */}
            <Div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_MED_NAME_SUGGESTIONS.map((suggestion) => (
                <Button
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
                </Button>
              ))}
            </Div>
          </Div>

          {/* 2. Scheduled Time Selection */}
          <Div className="bg-white p-3 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C]">
            <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1.5 flex items-center justify-between">
              <Span>2. When should you take it? *</Span>
              <Span className="text-[11px] font-mono font-bold text-[#FF6B4A] bg-[#FF6B4A]/10 px-2 py-0.5 rounded">
                {scheduledTime}
              </Span>
            </Label>
            
            {/* One-tap Time Slots */}
            <Div className="grid grid-cols-2 gap-2">
              {COMMON_TIME_PRESETS.map((slot) => (
                <Button
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
                  <Span className="text-base">{slot.icon}</Span>
                  <Span className="leading-tight text-left">{slot.label}</Span>
                </Button>
              ))}
            </Div>

            {/* Custom Time Input */}
            <Div className="mt-2 flex items-center gap-2">
              <Span className="text-[11px] font-bold text-[#1A2B4C]/70">Or custom time:</Span>
              <Input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="e.g. 02:30 PM"
                className="text-xs font-bold px-2 py-1 bg-[#FAF7F2] rounded-lg border border-[#1A2B4C] w-28 text-center"
              />
            </Div>
          </Div>

          {/* 3. Dosage & Instructions */}
          <Div className="bg-white p-3 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex flex-col gap-2.5">
            <Div>
              <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1">
                3. How much to take (Dosage)?
              </Label>
              <Input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 1 Tablet with water"
                className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C]"
              />
              <Div className="flex flex-wrap gap-1.5 mt-1.5">
                {COMMON_DOSAGE_PRESETS.map((d) => (
                  <Button
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
                  </Button>
                ))}
              </Div>
            </Div>

            <Div>
              <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1">
                4. Instructions / With Food?
              </Label>
              <Input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Take after food with warm water"
                className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C]"
              />
              <Div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_INSTRUCTIONS_PRESETS.map((inst) => (
                  <Button
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
                  </Button>
                ))}
              </Div>
            </Div>
          </Div>

          {/* 4. Choose Pill Picture */}
          <Div className="bg-white p-3 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C]">
            <Div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs font-black uppercase tracking-wider text-[#1A2B4C]">
                5. Pill Picture (So you recognize it easily)
              </Label>
              <Label className="px-2 py-1 bg-[#FAF7F2] hover:bg-slate-100 text-[#1A2B4C] border border-[#1A2B4C] rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                <Camera className="w-3 h-3 text-[#FF6B4A]" />
                <Span>Snap / Upload</Span>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </Label>
            </Div>

            {/* Photo Preset Grid */}
            <Div className="grid grid-cols-4 gap-2 mt-2">
              {PRESET_MEDICINE_PHOTOS.map((preset) => (
                <Button
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
                  <Img
                    src={preset.url}
                    alt={preset.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {selectedPhoto === preset.url && (
                    <Div className="absolute top-1 right-1 w-5 h-5 bg-[#4CAF50] text-white rounded-full flex items-center justify-center border border-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </Div>
                  )}
                  <Span className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[9px] font-black uppercase py-0.5 text-center truncate">
                    {preset.category}
                  </Span>
                </Button>
              ))}
            </Div>
          </Div>

          {/* Submit Button */}
          <Div className="pt-1 flex flex-col gap-2">
            <Button
              id="elder-submit-add-med-btn"
              type="submit"
              className="w-full min-h-[58px] bg-[#4CAF50] hover:bg-[#43a047] active:bg-[#388e3c] text-white rounded-2xl p-3.5 border-4 border-[#1A2B4C] shadow-[4px_4px_0px_#1A2B4C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-2.5 font-black text-base uppercase tracking-wider transition-all cursor-pointer"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <Span>✓ Save & Add to My Schedule</Span>
            </Button>

            <Button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-transparent hover:bg-slate-200/60 text-[#1A2B4C] font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              Cancel
            </Button>
          </Div>
        </Form>
      </Div>
    </Div>
  );
};
