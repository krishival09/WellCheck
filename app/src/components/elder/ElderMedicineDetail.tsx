import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
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
} from 'lucide-react-native';
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
      <View >
        <Text >No medicine selected.</Text>
        <TouchableOpacity
          onClick={() => setElderScreen('home')}
          
        >
          {t.backText}
        </TouchableOpacity>
      </View>
    );
  }

  const currentIndex = medicines.findIndex(m => m.id === medicine.id);

  return (
    <View 
      id="elder-medicine-detail-screen"
      
    >
      {/* Top Header */}
      <View >
        <TouchableOpacity
          id="elder-med-back-button"
          onClick={() => setElderScreen('home')}
          aria-label="Back to Home"
          
        >
          <ChevronLeft  />
          <Text>{t.backText}</Text>
        </TouchableOpacity>
        
        <View >
          {/* Add New Medicine button */}
          <TouchableOpacity
            id="elder-detail-add-med-btn"
            onClick={() => {
              soundFx.playTap();
              setIsAddMedModalOpen(true);
            }}
            aria-label="Add new medicine"
            title="Add new medicine"
            
          >
            <Plus  />
            <Text >Add Pill</Text>
          </TouchableOpacity>

          {/* Quick upload photo button in header */}
          <TouchableOpacity
            id="elder-quick-upload-photo-header-btn"
            onClick={() => {
              soundFx.playTap();
              setIsPhotoModalOpen(true);
            }}
            aria-label="Upload photo of medicine"
            title="Upload photo of medicine"
            
          >
            <Camera  />
            <Text >Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            id="elder-med-read-aloud-btn"
            onClick={handleReadDirectionsAloud}
            aria-label="Read medicine directions aloud"
            title="Read directions aloud"
            
          >
            <Volume2  />
            <Text>{t.listenText}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Medication Switcher Tabs (if multiple medicines exist) */}
      <View >
        {medicines.map((m, idx) => (
          <TouchableOpacity
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
            <View >
              <Image
                src={m.localPhotoRef || DEFAULT_MED_PILL_PHOTO}
                alt="Dose thumbnail"
                referrerPolicy="no-referrer"
                
              />
            </View>
            <Text>{m.scheduledTime}</Text>
            <Text className={`w-2 h-2 rounded-full ${m.taken ? 'bg-[#4CAF50]' : 'bg-[#FFB84D]'}`} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onClick={() => {
            soundFx.playTap();
            setIsAddMedModalOpen(true);
          }}
          
          title="Add another medicine"
        >
          <Plus  />
          <Text>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View >
        <TtsSubtitleBanner />
      </View>

      {/* Main Medicine Info */}
      <View >
        
        {/* Scheduled Time Banner */}
        <View >
          <View >
            <View >
              <Clock  />
            </View>
            <View>
              <Text >
                {t.scheduledTimeText}
              </Text>
              <View >
                {medicine.scheduledTime}
              </View>
            </View>
          </View>
          <Text 
            className={`text-xs font-black px-3 py-1.5 rounded-full border border-[#1A2B4C] shadow-[1px_1px_0px_#1A2B4C] uppercase tracking-wider ${
              medicine.taken
                ? 'bg-[#4CAF50] text-white'
                : 'bg-[#FFB84D] text-[#1A2B4C]'
            }`}
          >
            {medicine.taken ? t.takenText : t.dueNowText}
          </Text>
        </View>

        {/* Primary Tablet Picture Card (No Name, Picture Only Focus) */}
        <View >
          <View >
            <View >
              <View >
                💊
              </View>
              <Text >
                Pill to Take
              </Text>
            </View>
            <TouchableOpacity
              id="elder-upload-photo-direct-btn"
              onClick={() => {
                soundFx.playTap();
                setIsPhotoModalOpen(true);
              }}
              
            >
              <Upload  />
              <Text>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Large Picture Viewport */}
          <View 
            onClick={() => {
              soundFx.playTap();
              setIsPhotoModalOpen(true);
            }}
            
          >
            <Image
              src={medicine.localPhotoRef || DEFAULT_MED_PILL_PHOTO}
              alt="Scheduled tablet to take"
              referrerPolicy="no-referrer"
              
            />
            
            {/* Click to change badge */}
            <View >
              <Camera  />
              <Text>Tap to Change or Snap Photo</Text>
            </View>

            {/* Uploader badge */}
            <View >
              <Sparkles  />
              <Text>
                {medicine.photoUploadedBy === 'elder' 
                  ? 'Uploaded by Elder' 
                  : medicine.photoUploadedBy === 'volunteer' 
                  ? 'Uploaded by Volunteer' 
                  : 'Verified pill picture'}
              </Text>
            </View>
          </View>

          {/* Dosage & Simple Taking Instructions (No Tablet Name) */}
          <View >
            <View >
              <Text >
                {t.dosageText}: {medicine.dosage}
              </Text>
              <Text >
                {medicine.scheduledTime}
              </Text>
            </View>
            <View >
              <Info  />
              <Text >
                {medicine.instructions}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Large Taken Button */}
      <View >
        {medicine.taken ? (
          <View >
            <CheckCircle2  />
            <View >
              <Text >
                {t.takenText}
              </Text>
              <Text >
                {t.medicineTaken}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            id="elder-taken-pill-button"
            onClick={handleTakePill}
            aria-label="Confirm Medicine Taken"
            
          >
            <CheckCircle2  />
            <View >
              <Text >
                {t.takePillAction}
              </Text>
              <Text >
                {t.takeMedicineSubtext}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

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
    </View>
  );
};
