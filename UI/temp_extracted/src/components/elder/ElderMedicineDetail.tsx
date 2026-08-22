import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Pill, 
  CheckCircle2, 
  Volume2, 
  Camera, 
  Clock, 
  Info, 
  ChevronLeft,
  Upload,
  Sparkles,
  ChevronRight,
  Plus
} from 'lucide-react';
import { speakText, TRANSLATIONS } from '../../utils/speech';
import { TtsSubtitleBanner } from '../common/TtsSubtitleBanner';
import { MedicinePhotoUploaderModal } from '../common/MedicinePhotoUploaderModal';
import { ElderAddMedicineModal } from './ElderAddMedicineModal';
import { soundFx } from '../../utils/audio';

const DEFAULT_MED_PILL_PHOTO = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';

export const ElderMedicineDetail: React.FC = () => {
  const {
    medicines,
    selectedMedicineId,
    setSelectedMedicineId,
    markMedicineTaken,
    setElderScreen,
    language,
    elderProfile,
  } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];
  const medicine = medicines.find(m => m.id === selectedMedicineId) || medicines[0];
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);

  const handleTakePill = () => {
    if (medicine) {
      markMedicineTaken(medicine.id);
    }
  };

  const handleReadDirectionsAloud = () => {
    if (!medicine) return;
    const text = `${t.medicinePrompt('', medicine.scheduledTime)} ${medicine.dosage}. ${medicine.instructions}`;
    speakText(text, language);
  };

  if (!medicine) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F2]">
        <p className="text-xl font-bold text-slate-800">No medicine selected.</p>
        <button
          onClick={() => setElderScreen('home')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold"
        >
          {t.backText}
        </button>
      </div>
    );
  }

  const currentIndex = medicines.findIndex(m => m.id === medicine.id);

  return (
    <div 
      id="elder-medicine-detail-screen"
      className="flex-1 flex flex-col justify-between p-4 bg-[#FAF7F2] text-[#1A2B4C] overflow-y-auto"
    >
      {/* Top Header */}
      <header className="flex items-center justify-between pb-3 border-b-2 border-[#1A2B4C]/20">
        <button
          id="elder-med-back-button"
          onClick={() => setElderScreen('home')}
          aria-label="Back to Home"
          className="min-h-[44px] px-3 bg-white border-2 border-[#1A2B4C] rounded-xl shadow-[2px_2px_0px_#1A2B4C] flex items-center gap-1 font-black text-xs uppercase tracking-wider text-[#1A2B4C] active:scale-95 transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          <span>{t.backText}</span>
        </button>
        
        <div className="flex items-center gap-2">
          {/* Add New Medicine button */}
          <button
            id="elder-detail-add-med-btn"
            onClick={() => {
              soundFx.playTap();
              setIsAddMedModalOpen(true);
            }}
            aria-label="Add new medicine"
            title="Add new medicine"
            className="min-h-[44px] px-2.5 bg-[#4CAF50] hover:bg-[#43a047] text-white border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] rounded-xl flex items-center gap-1 font-black text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Add Pill</span>
          </button>

          {/* Quick upload photo button in header */}
          <button
            id="elder-quick-upload-photo-header-btn"
            onClick={() => {
              soundFx.playTap();
              setIsPhotoModalOpen(true);
            }}
            aria-label="Upload photo of medicine"
            title="Upload photo of medicine"
            className="min-h-[44px] px-2.5 bg-white text-[#1A2B4C] border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] rounded-xl flex items-center gap-1.5 font-black text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#FF6B4A]" />
            <span className="hidden sm:inline">Photo</span>
          </button>

          <button
            id="elder-med-read-aloud-btn"
            onClick={handleReadDirectionsAloud}
            aria-label="Read medicine directions aloud"
            title="Read directions aloud"
            className="min-h-[44px] px-3 bg-[#FFB84D] text-[#1A2B4C] border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] rounded-xl flex items-center gap-1.5 font-black text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4 stroke-[2.5]" />
            <span>{t.listenText}</span>
          </button>
        </div>
      </header>

      {/* Medication Switcher Tabs (if multiple medicines exist) */}
      <div className="flex items-center gap-2 overflow-x-auto py-2">
        {medicines.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => {
              soundFx.playTap();
              setSelectedMedicineId(m.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase whitespace-nowrap border-2 transition cursor-pointer flex items-center gap-2 ${
              m.id === medicine.id
                ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C]'
                : 'bg-white text-[#1A2B4C] border-[#1A2B4C]/40 hover:border-[#1A2B4C]'
            }`}
          >
            <div className="w-5 h-5 rounded-md overflow-hidden bg-slate-200 shrink-0 border border-current">
              <img
                src={m.localPhotoRef || DEFAULT_MED_PILL_PHOTO}
                alt="Dose thumbnail"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span>{m.scheduledTime}</span>
            <span className={`w-2 h-2 rounded-full ${m.taken ? 'bg-[#4CAF50]' : 'bg-[#FFB84D]'}`} />
          </button>
        ))}

        <button
          onClick={() => {
            soundFx.playTap();
            setIsAddMedModalOpen(true);
          }}
          className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-[#1A2B4C] border-2 border-dashed border-[#1A2B4C] rounded-xl text-xs font-black uppercase whitespace-nowrap flex items-center gap-1 cursor-pointer"
          title="Add another medicine"
        >
          <Plus className="w-3.5 h-3.5 text-[#4CAF50] stroke-[3]" />
          <span>+ Add</span>
        </button>
      </div>

      <div className="mt-1">
        <TtsSubtitleBanner />
      </div>

      {/* Main Medicine Info */}
      <main className="flex-1 flex flex-col gap-3 py-2">
        
        {/* Scheduled Time Banner */}
        <div className="bg-[#FAF7F2] border-2 border-[#1A2B4C] rounded-2xl p-3.5 flex items-center justify-between shadow-[3px_3px_0px_#1A2B4C]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFB84D] border border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C] font-bold shrink-0">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1A2B4C]/70">
                {t.scheduledTimeText}
              </span>
              <div className="text-2xl font-black text-[#1A2B4C]">
                {medicine.scheduledTime}
              </div>
            </div>
          </div>
          <span 
            className={`text-xs font-black px-3 py-1.5 rounded-full border border-[#1A2B4C] shadow-[1px_1px_0px_#1A2B4C] uppercase tracking-wider ${
              medicine.taken
                ? 'bg-[#4CAF50] text-white'
                : 'bg-[#FFB84D] text-[#1A2B4C]'
            }`}
          >
            {medicine.taken ? t.takenText : t.dueNowText}
          </span>
        </div>

        {/* Primary Tablet Picture Card (No Name, Picture Only Focus) */}
        <div className="bg-white border-2 border-[#1A2B4C] rounded-2xl p-3.5 shadow-[4px_4px_0px_#1A2B4C] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF6B4A]/10 border border-[#1A2B4C] flex items-center justify-center text-sm font-black">
                💊
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-[#1A2B4C]">
                Pill to Take
              </span>
            </div>
            <button
              id="elder-upload-photo-direct-btn"
              onClick={() => {
                soundFx.playTap();
                setIsPhotoModalOpen(true);
              }}
              className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-slate-100 border border-[#1A2B4C] rounded-lg text-[11px] font-black text-[#FF6B4A] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>Change Photo</span>
            </button>
          </div>

          {/* Large Picture Viewport */}
          <div 
            onClick={() => {
              soundFx.playTap();
              setIsPhotoModalOpen(true);
            }}
            className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-100 border-2 border-[#1A2B4C] cursor-pointer group shadow-inner"
          >
            <img
              src={medicine.localPhotoRef || DEFAULT_MED_PILL_PHOTO}
              alt="Scheduled tablet to take"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition duration-200"
            />
            
            {/* Click to change badge */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-black text-xs uppercase">
              <Camera className="w-5 h-5 text-[#FFB84D]" />
              <span>Tap to Change or Snap Photo</span>
            </div>

            {/* Uploader badge */}
            <div className="absolute bottom-2 left-2 bg-[#1A2B4C]/95 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB84D]" />
              <span>
                {medicine.photoUploadedBy === 'elder' 
                  ? 'Uploaded by Elder' 
                  : medicine.photoUploadedBy === 'volunteer' 
                  ? 'Uploaded by Volunteer' 
                  : 'Verified pill picture'}
              </span>
            </div>
          </div>

          {/* Dosage & Simple Taking Instructions (No Tablet Name) */}
          <div className="pt-2 border-t border-[#1A2B4C]/15 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#1A2B4C] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#1A2B4C]">
                {t.dosageText}: {medicine.dosage}
              </span>
              <span className="text-xs font-mono font-bold text-[#1A2B4C]/80">
                {medicine.scheduledTime}
              </span>
            </div>
            <div className="flex items-start gap-1.5 text-[#1A2B4C] mt-1 bg-amber-50/70 p-2 rounded-xl border border-amber-200/80">
              <Info className="w-4 h-4 text-[#1A2B4C] shrink-0 mt-0.5 stroke-[2.5]" />
              <p className="text-xs font-bold leading-snug">
                {medicine.instructions}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Large Taken Button */}
      <footer className="pt-2">
        {medicine.taken ? (
          <div className="w-full min-h-[68px] bg-[#4CAF50] text-white rounded-2xl p-3.5 border-4 border-[#1A2B4C] shadow-[4px_4px_0px_#1A2B4C] flex items-center justify-center gap-3">
            <CheckCircle2 className="w-7 h-7 stroke-[3]" />
            <div className="flex flex-col text-left">
              <span className="text-lg font-black uppercase tracking-wide leading-none">
                {t.takenText}
              </span>
              <span className="text-[11px] font-bold text-white/90 mt-0.5">
                {t.medicineTaken}
              </span>
            </div>
          </div>
        ) : (
          <button
            id="elder-taken-pill-button"
            onClick={handleTakePill}
            aria-label="Confirm Medicine Taken"
            className="w-full min-h-[72px] bg-[#4CAF50] hover:bg-[#43a047] text-white rounded-2xl p-3.5 border-4 border-[#1A2B4C] shadow-[4px_4px_0px_#1A2B4C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-8 h-8 stroke-[3]" />
            <div className="flex flex-col text-left">
              <span className="text-[20px] font-black uppercase tracking-tight leading-none">
                {t.takePillAction}
              </span>
              <span className="text-[11px] font-bold text-white/90 mt-0.5 tracking-wide">
                {t.takeMedicineSubtext}
              </span>
            </div>
          </button>
        )}
      </footer>

      {/* Photo Uploader Modal */}
      {isPhotoModalOpen && (
        <MedicinePhotoUploaderModal
          medicine={medicine}
          isOpen={isPhotoModalOpen}
          uploaderRole="elder"
          onClose={() => setIsPhotoModalOpen(false)}
          onPhotoSaved={() => setIsPhotoModalOpen(false)}
        />
      )}

      {/* Elder Add Medicine Modal */}
      {isAddMedModalOpen && (
        <ElderAddMedicineModal
          isOpen={isAddMedModalOpen}
          onClose={() => setIsAddMedModalOpen(false)}
        />
      )}
    </div>
  );
};
