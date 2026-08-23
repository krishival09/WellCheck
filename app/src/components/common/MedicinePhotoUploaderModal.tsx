import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
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
    <View 
      id="medicine-photo-upload-modal"
      
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopCamera();
          onClose();
        }
      }}
    >
      <View >
        
        {/* Modal Header */}
        <View >
          <View >
            <View >
              <Camera  />
            </View>
            <View>
              <Text >
                Upload Medicine Photo
              </Text>
              <View >
                <Text className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-[#1A2B4C] ${
                  role === 'elder' ? 'bg-[#4CAF50] text-white' : 'bg-[#FF6B4A] text-white'
                }`}>
                  {role === 'elder' ? '👵 Elder Upload' : '🧑‍⚕️ Volunteer Upload'}
                </Text>
                <Text >
                  By {uploaderName}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            id="close-med-photo-modal-btn"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            aria-label="Close Modal"
            
          >
            <X  />
          </TouchableOpacity>
        </View>

        {/* Medicine Info Summary Strip */}
        <View >
          <View >
            <View >
              <Pill  />
            </View>
            <View>
              <View >
                {medicine.medicineName}
              </View>
              <View >
                {medicine.dosage} • {medicine.scheduledTime}
              </View>
            </View>
          </View>
          <Text >
            {medicine.scheduledTime}
          </Text>
        </View>

        {/* Method Tab Selector */}
        <View >
          <TouchableOpacity
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
            <Upload  />
            <Text>Upload File</Text>
          </TouchableOpacity>
          <TouchableOpacity
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
            <Camera  />
            <Text>Live Snap</Text>
          </TouchableOpacity>
          <TouchableOpacity
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
            <ImageIcon  />
            <Text>Pill Library</Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: FILE DRAG & DROP / UPLOAD */}
        {activeTab === 'upload' && (
          <View >
            <View
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
                
                id="med-photo-file-input"
              />
              <View >
                <Upload  />
              </View>
              <Text >
                Click to Choose or Drag Photo Here
              </Text>
              <Text >
                Supports JPG, PNG, WEBP, Camera photos
              </Text>
            </View>

            {/* Mobile Native Camera direct button */}
            <View >
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                
                id="med-photo-camera-direct-input"
              />
              <TouchableOpacity
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                
              >
                <Camera  />
                <Text>Open Device Camera App</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: LIVE CAMERA VIEWFINDER */}
        {activeTab === 'camera' && (
          <View >
            {isCapturingCamera ? (
              <View >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  
                />
                <View >
                  <Text  />
                  Live Camera
                </View>
                <View >
                  <TouchableOpacity
                    type="button"
                    onClick={captureCameraSnapshot}
                    
                  >
                    <Camera  />
                    <Text>📸 Capture Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    type="button"
                    onClick={stopCamera}
                    
                  >
                    Cancel
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View >
                {cameraError ? (
                  <View >
                    <AlertCircle  />
                    <View>
                      <Text >Camera Access Issue</Text>
                      <Text >{cameraError}</Text>
                    </View>
                  </View>
                ) : (
                  <Text >
                    Snap a fresh photo of the pill bottle, strip, or blister pack using your device camera.
                  </Text>
                )}
                <View >
                  <TouchableOpacity
                    type="button"
                    onClick={startLiveCamera}
                    
                  >
                    <RefreshCw  />
                    <Text>Start Live Viewfinder</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    
                  >
                    <Camera  />
                    <Text>Device Camera App</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* TAB 3: PRESET PILL LIBRARY */}
        {activeTab === 'presets' && (
          <View >
            <View >
              <Sparkles  />
              Select from High-Clarity Medicine Presets:
            </View>
            <View >
              {PRESET_MEDICINE_PHOTOS.map((preset) => (
                <TouchableOpacity
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
                  <View >
                    <Image
                      src={preset.url}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      
                    />
                    {previewUrl === preset.url && (
                      <View >
                        <View >
                          ✓
                        </View>
                      </View>
                    )}
                  </View>
                  <View >
                    <View >
                      {preset.title}
                    </View>
                    <View >
                      {preset.category}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Selected Photo Live Preview Card */}
        <View >
          <View >
            <Text >
              <Check  />
              Active Selected Photo Preview
            </Text>
            <Text >
              Ready to Sync
            </Text>
          </View>
          <View >
            <Image
              src={previewUrl}
              alt="Medicine verification preview"
              referrerPolicy="no-referrer"
              
            />
            <View >
              <Text>Verified for: {medicine.medicineName.split(' ')[0]}</Text>
            </View>
            
            <TouchableOpacity
              type="button"
              onClick={() => {
                soundFx.playTap();
                setPreviewUrl(PRESET_MEDICINE_PHOTOS[0].url);
              }}
              title="Reset to default photo"
              
            >
              <Trash2  />
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal Action Buttons */}
        <View >
          <TouchableOpacity
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            
          >
            Cancel
          </TouchableOpacity>
          <TouchableOpacity
            id="save-medicine-photo-btn"
            type="button"
            disabled={isSaving}
            onClick={handleSavePhoto}
            
          >
            <Check  />
            <Text>{isSaving ? 'Saving Photo...' : 'Confirm & Save Photo'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
