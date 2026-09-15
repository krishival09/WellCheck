import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form } from '../../rn-compat';
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Pill,
  Trash2
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { MedicineReminderDoc, RoleMode } from '../../types';
import { soundFx } from '../../utils/audio';
import { speakText, TRANSLATIONS } from '../../utils/speech';

export interface MedicinePhotoUploaderModalProps {
  medicine: MedicineReminderDoc;
  isOpen: boolean;
  onClose: () => void;
  uploaderRole?: RoleMode;
  onPhotoSaved?: (newPhotoUrl: string) => void;
}

export const PRESET_MEDICINE_PHOTOS = [
  {
    id: 'blister-tabs',
    title: 'Tablets / Blister Pack',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    category: 'Tablets'
  },
  {
    id: 'bottle-tabs',
    title: 'Amber Prescription Bottle',
    url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    category: 'Bottle'
  },
  {
    id: 'capsules-yellow',
    title: 'Gel Capsules / Softgels',
    url: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=80',
    category: 'Capsules'
  },
  {
    id: 'pills-foil',
    title: 'Daily Blood Pressure Pill',
    url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
    category: 'Strip'
  },
  {
    id: 'syrup-liquid',
    title: 'Liquid Syrup / Dropper',
    url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
    category: 'Liquid'
  },
  {
    id: 'organizer-box',
    title: 'Weekly Organizer Pillbox',
    url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&auto=format&fit=crop&q=80',
    category: 'Organizer'
  },
  {
    id: 'multivitamins',
    title: 'Multivitamin Supplements',
    url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80',
    category: 'Supplements'
  },
  {
    id: 'antibiotic-caps',
    title: 'Dual-Color Capsule',
    url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&auto=format&fit=crop&q=80',
    category: 'Capsules'
  },
];

export const MedicinePhotoUploaderModal: React.FC<MedicinePhotoUploaderModalProps> = ({
  medicine,
  isOpen,
  onClose,
  uploaderRole,
  onPhotoSaved,
}) => {
  const { 
    updateMedicinePhoto, 
    activeRole, 
    elderProfile, 
    volunteerProfile,
    language,
    volunteerLanguage 
  } = useApp();

  const role: RoleMode = uploaderRole || activeRole || 'elder';
  const activeLang = role === 'elder' ? language : volunteerLanguage;
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS['en-US'];

  const [activeTab, setActiveTab] = useState<'url' | 'presets'>('presets');
  const [previewUrl, setPreviewUrl] = useState<string>(medicine.localPhotoRef || PRESET_MEDICINE_PHOTOS[0].url);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync preview with current medicine when opened
  useEffect(() => {
    if (medicine && medicine.localPhotoRef) {
      setPreviewUrl(medicine.localPhotoRef);
    }
  }, [medicine, isOpen]);

  if (!isOpen) return null;

  // Save changes to context & storage
  const handleSavePhoto = () => {
    setIsSaving(true);
    soundFx.playSuccessChime();
    updateMedicinePhoto(medicine.id, previewUrl, role);
    
    if (role === 'elder') {
      speakText(`${medicine.medicineName} photo updated successfully`, language);
    }
    if (onPhotoSaved) {
      onPhotoSaved(previewUrl);
    }
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 350);
  };

  const uploaderName = role === 'elder' 
    ? (elderProfile.name || 'Eleanor Vance')
    : (volunteerProfile.name || 'Sarah Chen');

  return (
    <Div 
      id="medicine-photo-upload-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e: any) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Div className="bg-[#FAF7F2] w-full max-w-lg rounded-3xl border-4 border-[#1A2B4C] shadow-[8px_8px_0px_#1A2B4C] p-4 sm:p-6 text-[#1A2B4C] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <Div className="flex items-center justify-between pb-3 border-b-2 border-[#1A2B4C]/20">
          <Div className="flex items-center gap-2.5">
            <Div className="w-10 h-10 rounded-2xl bg-[#FFB84D] border-2 border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C]">
              <Camera className="w-5 h-5 stroke-[2.5]" />
            </Div>
            <Div>
              <H2 className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight">
                Upload Medicine Photo
              </H2>
              <Div className="flex items-center gap-2 mt-0.5">
                <Span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-[#1A2B4C] ${
                  role === 'elder' ? 'bg-[#4CAF50] text-white' : 'bg-[#FF6B4A] text-white'
                }`}>
                  {role === 'elder' ? '👵 Elder Upload' : '🧑‍⚕️ Volunteer Upload'}
                </Span>
                <Span className="text-xs font-bold text-[#1A2B4C]/80">
                  By {uploaderName}
                </Span>
              </Div>
            </Div>
          </Div>
          <Button
            id="close-med-photo-modal-btn"
            onClick={() => {
              onClose();
            }}
            aria-label="Close Modal"
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center text-[#1A2B4C] active:scale-95 transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </Button>
        </Div>

        {/* Medicine Info Summary Strip */}
        <Div className="p-3 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-between">
          <Div className="flex items-center gap-2.5">
            <Div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#1A2B4C] flex items-center justify-center text-[#FF6B4A] shrink-0 font-bold">
              <Pill className="w-4 h-4 stroke-[2.5]" />
            </Div>
            <Div>
              <Div className="text-xs sm:text-sm font-black text-[#1A2B4C] leading-tight">
                {medicine.medicineName}
              </Div>
              <Div className="text-[11px] font-bold text-[#1A2B4C]/70 mt-0.5">
                {medicine.dosage} • {medicine.scheduledTime}
              </Div>
            </Div>
          </Div>
          <Span className="text-[10px] font-mono font-bold bg-slate-100 text-[#1A2B4C] px-2 py-1 rounded-lg border border-slate-300 shrink-0">
            {medicine.scheduledTime}
          </Span>
        </Div>

        {/* Method Tab Selector */}
        <Div className="flex flex-row gap-1.5 bg-slate-200 p-1.5 rounded-2xl border border-[#1A2B4C]/30">
          <Button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 px-1 flex flex-row items-center justify-center gap-1 rounded-xl ${
              activeTab === 'url'
                ? 'bg-[#1A2B4C] shadow-sm'
                : 'bg-transparent'
            }`}
          >
            <Upload size={14} color={activeTab === 'url' ? 'white' : '#1A2B4C'} />
            <Span className={`text-xs font-black uppercase ${activeTab === 'url' ? 'text-white' : 'text-[#1A2B4C]'}`}>Photo URL</Span>
          </Button>
          <Button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 px-1 flex flex-row items-center justify-center gap-1 rounded-xl ${
              activeTab === 'presets'
                ? 'bg-[#1A2B4C] shadow-sm'
                : 'bg-transparent'
            }`}
          >
            <ImageIcon size={14} color={activeTab === 'presets' ? 'white' : '#1A2B4C'} />
            <Span className={`text-xs font-black uppercase ${activeTab === 'presets' ? 'text-white' : 'text-[#1A2B4C]'}`}>Pill Library</Span>
          </Button>
        </Div>

        {/* TAB 1: PHOTO URL INPUT */}
        {activeTab === 'url' && (
          <Div className="flex flex-col gap-3">
            <Div className="p-4 bg-white rounded-2xl border-2 border-[#1A2B4C] flex flex-col gap-3">
              <Div className="flex flex-row items-center gap-2">
                <Div className="w-10 h-10 rounded-xl bg-[#FFB84D] border-2 border-[#1A2B4C] flex items-center justify-center">
                  <Upload size={20} color="#1A2B4C" />
                </Div>
                <Div>
                  <P className="text-xs font-black text-[#1A2B4C] uppercase">Enter Photo URL</P>
                  <P className="text-[10px] font-bold text-slate-500">Paste a direct link to an image</P>
                </Div>
              </Div>
              <Input
                type="url"
                value={urlInput}
                onChange={(e: any) => setUrlInput(e.target.value)}
                placeholder="https://example.com/medicine.jpg"
                className="w-full h-10 px-3 bg-[#FAF7F2] border-2 border-[#1A2B4C] rounded-xl text-xs font-bold text-[#1A2B4C] outline-none"
              />
              <Button
                type="button"
                disabled={!urlInput.trim()}
                onClick={() => {
                  if (urlInput.trim()) {
                    soundFx.playTap();
                    setPreviewUrl(urlInput.trim());
                    setUrlInput('');
                  }
                }}
                className="w-full py-2.5 bg-[#1A2B4C] rounded-xl flex flex-row items-center justify-center gap-2"
              >
                <Check size={16} color="white" />
                <Span className="text-sm font-black text-white">Use This Photo</Span>
              </Button>
            </Div>
          </Div>
        )}

        {/* TAB 3: PRESET PILL LIBRARY */}
        {activeTab === 'presets' && (
          <Div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            <Div className="text-[11px] font-black uppercase text-[#1A2B4C]/80 flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
              Select from High-Clarity Medicine Presets:
            </Div>
            <Div className="grid grid-cols-2 gap-2">
              {PRESET_MEDICINE_PHOTOS.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    setPreviewUrl(preset.url);
                  }}
                  className={`relative rounded-xl overflow-hidden border-2 transition cursor-pointer flex flex-col text-left group ${
                    previewUrl === preset.url
                      ? 'border-[#4CAF50] ring-2 ring-[#4CAF50] shadow-[2px_2px_0px_#1A2B4C]'
                      : 'border-[#1A2B4C] hover:border-[#FF6B4A]'
                  }`}
                >
                  <Div className="w-full h-16 bg-slate-200 relative">
                    <Img
                      src={preset.url}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    {previewUrl === preset.url && (
                      <Div className="absolute inset-0 bg-[#4CAF50]/30 flex items-center justify-center">
                        <Div className="w-6 h-6 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-xs font-black border border-white">
                          ✓
                        </Div>
                      </Div>
                    )}
                  </Div>
                  <Div className="p-1.5 bg-white">
                    <Div className="text-[10px] font-black truncate text-[#1A2B4C]">
                      {preset.title}
                    </Div>
                    <Div className="text-[9px] font-bold text-slate-500">
                      {preset.category}
                    </Div>
                  </Div>
                </Button>
              ))}
            </Div>
          </Div>
        )}

        {/* Selected Photo Live Preview Card */}
        <Div className="p-3 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2">
          <Div className="flex items-center justify-between">
            <Span className="text-[11px] font-black uppercase tracking-wider text-[#1A2B4C] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#4CAF50]" />
              Active Selected Photo Preview
            </Span>
            <Span className="text-[10px] font-mono font-bold bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#1A2B4C]">
              Ready to Sync
            </Span>
          </Div>
          <Div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 border-2 border-[#1A2B4C]">
            <Img
              src={previewUrl}
              alt="Medicine verification preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <Div className="absolute bottom-2 left-2 bg-[#1A2B4C]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/30 flex items-center gap-1">
              <Span>Verified for: {medicine.medicineName.split(' ')[0]}</Span>
            </Div>
            
            <Button
              type="button"
              onClick={() => {
                soundFx.playTap();
                setPreviewUrl(PRESET_MEDICINE_PHOTOS[0].url);
              }}
              title="Reset to default photo"
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-red-600 rounded-lg border border-[#1A2B4C] shadow-sm cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </Div>
        </Div>

        {/* Modal Action Buttons */}
        <Div className="flex gap-2 pt-1">
          <Button
            type="button"
            onClick={() => {
              onClose();
            }}
            className="flex-1 min-h-[50px] bg-slate-200 hover:bg-slate-300 text-[#1A2B4C] font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-[#1A2B4C] active:scale-95 transition cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            id="save-medicine-photo-btn"
            type="button"
            disabled={isSaving}
            onClick={handleSavePhoto}
            className="flex-[2] min-h-[50px] bg-[#4CAF50] hover:bg-[#43a047] text-white font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1A2B4C] flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <Span>{isSaving ? 'Saving Photo...' : 'Confirm & Save Photo'}</Span>
          </Button>
        </Div>
      </Div>
    </Div>
  );
};
