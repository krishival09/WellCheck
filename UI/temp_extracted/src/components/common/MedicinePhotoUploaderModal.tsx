import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Check, 
  RefreshCw, 
  Sparkles, 
  AlertCircle,
  Pill,
  Trash2
} from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'presets'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(medicine.localPhotoRef || PRESET_MEDICINE_PHOTOS[0].url);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isCapturingCamera, setIsCapturingCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync preview with current medicine when opened
  useEffect(() => {
    if (medicine && medicine.localPhotoRef) {
      setPreviewUrl(medicine.localPhotoRef);
    }
  }, [medicine, isOpen]);

  // Clean up camera stream on unmount or tab change
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  // Handle File Input Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WEBP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        soundFx.playTap();
        setPreviewUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Live Web Camera Setup
  const startLiveCamera = async () => {
    setCameraError(null);
    setIsCapturingCamera(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device API not supported in this browser. Please use file upload.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Live camera error:', err);
      setCameraError(err?.message || 'Unable to access camera. Please allow camera permissions or use direct file upload.');
      setIsCapturingCamera(false);
    }
  };

  const captureCameraSnapshot = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        soundFx.playSuccessChime();
        setPreviewUrl(dataUrl);
        // Stop stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
        setIsCapturingCamera(false);
      }
    } catch (e) {
      console.error('Snapshot failed', e);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCapturingCamera(false);
  };

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
    <div 
      id="medicine-photo-upload-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopCamera();
          onClose();
        }
      }}
    >
      <div className="bg-[#FAF7F2] w-full max-w-lg rounded-3xl border-4 border-[#1A2B4C] shadow-[8px_8px_0px_#1A2B4C] p-4 sm:p-6 text-[#1A2B4C] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1A2B4C]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFB84D] border-2 border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C]">
              <Camera className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight">
                Upload Medicine Photo
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-[#1A2B4C] ${
                  role === 'elder' ? 'bg-[#4CAF50] text-white' : 'bg-[#FF6B4A] text-white'
                }`}>
                  {role === 'elder' ? '👵 Elder Upload' : '🧑‍⚕️ Volunteer Upload'}
                </span>
                <span className="text-xs font-bold text-[#1A2B4C]/80">
                  By {uploaderName}
                </span>
              </div>
            </div>
          </div>
          <button
            id="close-med-photo-modal-btn"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            aria-label="Close Modal"
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center text-[#1A2B4C] active:scale-95 transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Medicine Info Summary Strip */}
        <div className="p-3 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#1A2B4C] flex items-center justify-center text-[#FF6B4A] shrink-0 font-bold">
              <Pill className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-[#1A2B4C] leading-tight">
                {medicine.medicineName}
              </div>
              <div className="text-[11px] font-bold text-[#1A2B4C]/70 mt-0.5">
                {medicine.dosage} • {medicine.scheduledTime}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 text-[#1A2B4C] px-2 py-1 rounded-lg border border-slate-300 shrink-0">
            {medicine.scheduledTime}
          </span>
        </div>

        {/* Method Tab Selector */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-200 p-1.5 rounded-2xl border border-[#1A2B4C]/30">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('upload');
            }}
            className={`py-2 px-1 text-xs font-black uppercase rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-[#1A2B4C] text-white shadow-sm'
                : 'text-[#1A2B4C]/80 hover:text-[#1A2B4C]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              startLiveCamera();
            }}
            className={`py-2 px-1 text-xs font-black uppercase rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-[#1A2B4C] text-white shadow-sm'
                : 'text-[#1A2B4C]/80 hover:text-[#1A2B4C]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Snap</span>
          </button>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('presets');
            }}
            className={`py-2 px-1 text-xs font-black uppercase rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-[#1A2B4C] text-white shadow-sm'
                : 'text-[#1A2B4C]/80 hover:text-[#1A2B4C]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Pill Library</span>
          </button>
        </div>

        {/* TAB 1: FILE DRAG & DROP / UPLOAD */}
        {activeTab === 'upload' && (
          <div className="flex flex-col gap-3">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`min-h-[140px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition ${
                isDragOver 
                  ? 'border-[#FF6B4A] bg-[#FF6B4A]/10 scale-[1.01]' 
                  : 'border-[#1A2B4C] bg-white hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="med-photo-file-input"
              />
              <div className="w-12 h-12 rounded-2xl bg-[#FFB84D] border-2 border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C] mb-2 shadow-[2px_2px_0px_#1A2B4C]">
                <Upload className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-black uppercase text-[#1A2B4C]">
                Click to Choose or Drag Photo Here
              </span>
              <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                Supports JPG, PNG, WEBP, Camera photos
              </span>
            </div>

            {/* Mobile Native Camera direct button */}
            <div className="flex items-center gap-2">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
                id="med-photo-camera-direct-input"
              />
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#FF6B4A]" />
                <span>Open Device Camera App</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE CAMERA VIEWFINDER */}
        {activeTab === 'camera' && (
          <div className="flex flex-col gap-3">
            {isCapturingCamera ? (
              <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-black border-2 border-[#1A2B4C] flex flex-col items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  Live Camera
                </div>
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={captureCameraSnapshot}
                    className="min-h-[44px] px-5 bg-[#4CAF50] hover:bg-[#43a047] text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-white shadow-lg flex items-center gap-2 active:scale-95 transition cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>📸 Capture Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="min-h-[44px] px-3 bg-black/70 text-white text-xs font-bold rounded-xl border border-white/40 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-2xl border-2 border-[#1A2B4C] flex flex-col items-center text-center gap-3">
                {cameraError ? (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-700 text-xs font-bold flex items-start gap-2 text-left">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black">Camera Access Issue</p>
                      <p className="text-[11px] mt-0.5">{cameraError}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-slate-600">
                    Snap a fresh photo of the pill bottle, strip, or blister pack using your device camera.
                  </p>
                )}
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={startLiveCamera}
                    className="flex-1 min-h-[46px] bg-[#FFB84D] hover:bg-[#ffa726] text-[#1A2B4C] font-black text-xs uppercase rounded-xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Start Live Viewfinder</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 min-h-[46px] bg-[#1A2B4C] hover:bg-black text-white font-black text-xs uppercase rounded-xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#4CAF50]" />
                    <span>Device Camera App</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRESET PILL LIBRARY */}
        {activeTab === 'presets' && (
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            <div className="text-[11px] font-black uppercase text-[#1A2B4C]/80 flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
              Select from High-Clarity Medicine Presets:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_MEDICINE_PHOTOS.map((preset) => (
                <button
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
                  <div className="w-full h-16 bg-slate-200 relative">
                    <img
                      src={preset.url}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    {previewUrl === preset.url && (
                      <div className="absolute inset-0 bg-[#4CAF50]/30 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-xs font-black border border-white">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-1.5 bg-white">
                    <div className="text-[10px] font-black truncate text-[#1A2B4C]">
                      {preset.title}
                    </div>
                    <div className="text-[9px] font-bold text-slate-500">
                      {preset.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Photo Live Preview Card */}
        <div className="p-3 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#1A2B4C] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#4CAF50]" />
              Active Selected Photo Preview
            </span>
            <span className="text-[10px] font-mono font-bold bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#1A2B4C]">
              Ready to Sync
            </span>
          </div>
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 border-2 border-[#1A2B4C]">
            <img
              src={previewUrl}
              alt="Medicine verification preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-[#1A2B4C]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/30 flex items-center gap-1">
              <span>Verified for: {medicine.medicineName.split(' ')[0]}</span>
            </div>
            
            <button
              type="button"
              onClick={() => {
                soundFx.playTap();
                setPreviewUrl(PRESET_MEDICINE_PHOTOS[0].url);
              }}
              title="Reset to default photo"
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-red-600 rounded-lg border border-[#1A2B4C] shadow-sm cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="flex-1 min-h-[50px] bg-slate-200 hover:bg-slate-300 text-[#1A2B4C] font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-[#1A2B4C] active:scale-95 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="save-medicine-photo-btn"
            type="button"
            disabled={isSaving}
            onClick={handleSavePhoto}
            className="flex-[2] min-h-[50px] bg-[#4CAF50] hover:bg-[#43a047] text-white font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1A2B4C] flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{isSaving ? 'Saving Photo...' : 'Confirm & Save Photo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
