import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { 
  X, 
  Pill, 
  Camera, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Save,
  Image as ImageIcon,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { MedicineReminderDoc } from '../../types';
import { MedicinePhotoUploaderModal } from '../common/MedicinePhotoUploaderModal';
import { soundFx } from '../../utils/audio';

interface VolunteerMedicineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMedIdForUpload?: string | null;
}

export const VolunteerMedicineManagerModal: React.FC<VolunteerMedicineManagerModalProps> = ({
  isOpen,
  onClose,
  selectedMedIdForUpload,
}) => {
  const {
    medicines,
    editMedicine,
    deleteMedicine,
    resetMedicineStatus,
    pairData,
    volunteerProfile,
    monitoredElders,
    selectedElderId,
    selectedElder,
    selectElder,
  } = useApp();

  const [activeUploadMed, setActiveUploadMed] = useState<MedicineReminderDoc | null>(() => {
    if (selectedMedIdForUpload) {
      return medicines.find(m => m.id === selectedMedIdForUpload) || null;
    }
    return null;
  });

  const [editingMedId, setEditingMedId] = useState<string | null>(null);

  // Inline Edit State
  const [editForm, setEditForm] = useState<Partial<MedicineReminderDoc>>({});

  if (!isOpen) return null;

  const handleStartEdit = (med: MedicineReminderDoc) => {
    soundFx.playTap();
    setEditingMedId(med.id);
    setEditForm({
      medicineName: med.medicineName,
      dosage: med.dosage,
      scheduledTime: med.scheduledTime,
      instructions: med.instructions,
    });
  };

  const handleSaveEdit = (id: string) => {
    soundFx.playSuccessChime();
    editMedicine(id, editForm);
    setEditingMedId(null);
  };

  return (
    <>
      <View 
        id="volunteer-med-manager-modal"
        
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
                  Elder Medication & Photo Hub
                </Text>
                <Text >
                  Live verification for <Text >{pairData.elderName}</Text>
                </Text>
              </View>
            </View>
            <View >
              <View >
                <ShieldCheck  />
                <Text>Managed by Elder</Text>
              </View>
              <TouchableOpacity
                onClick={onClose}
                aria-label="Close Modal"
                
              >
                <X  />
              </TouchableOpacity>
            </View>
          </View>

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

          {/* Medicines List */}
          <View >
            {medicines.length === 0 ? (
              <View >
                <Pill  />
                <Text >No medicines currently scheduled</Text>
                <Text >The elder can add medicine reminders directly on their screen.</Text>
              </View>
            ) : (
              medicines.map((med) => {
                const isEditing = editingMedId === med.id;

                return (
                  <View
                    key={med.id}
                    
                  >
                    {/* Top Row: Photo Thumbnail + Details + Actions */}
                    <View >
                      
                      {/* Photo Thumbnail with Overlay & Upload Button */}
                      <View >
                        <Image
                          src={med.localPhotoRef}
                          alt={med.medicineName}
                          referrerPolicy="no-referrer"
                          
                        />
                        {/* Hover / Direct Click Overlay to Upload Photo */}
                        <TouchableOpacity
                          type="button"
                          onClick={() => setActiveUploadMed(med)}
                          
                          title="Upload new photo of medicine"
                        >
                          <Camera  />
                          <Text >
                            Change Photo
                          </Text>
                        </TouchableOpacity>
                        {/* Uploader Role Tag */}
                        <View >
                          {med.photoUploadedBy === 'volunteer' 
                            ? '🧑‍⚕️ By Volunteer' 
                            : med.photoUploadedBy === 'elder' 
                            ? '👵 By Elder' 
                            : '📸 Photo'}
                        </View>
                      </View>

                      {/* Info & Edit Fields */}
                      <View >
                        {isEditing ? (
                          <View >
                            <input
                              type="text"
                              value={editForm.medicineName || ''}
                              onChange={(e) => setEditForm({ ...editForm, medicineName: e.target.value })}
                              placeholder="Medicine Name"
                              
                            />
                            <View >
                              <input
                                type="text"
                                value={editForm.dosage || ''}
                                onChange={(e) => setEditForm({ ...editForm, dosage: e.target.value })}
                                placeholder="Dosage"
                                
                              />
                              <input
                                type="text"
                                value={editForm.scheduledTime || ''}
                                onChange={(e) => setEditForm({ ...editForm, scheduledTime: e.target.value })}
                                placeholder="Time (e.g. 08:00 AM)"
                                
                              />
                            </View>
                            <input
                              type="text"
                              value={editForm.instructions || ''}
                              onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
                              placeholder="Instructions"
                              
                            />
                            <View >
                              <TouchableOpacity
                                onClick={() => handleSaveEdit(med.id)}
                                
                              >
                                <Save  /> Save
                              </TouchableOpacity>
                              <TouchableOpacity
                                onClick={() => setEditingMedId(null)}
                                
                              >
                                Cancel
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <View>
                            <View >
                              <View>
                                <Text >
                                  Scheduled Dose • {med.scheduledTime}
                                </Text>
                                <View >
                                  {med.dosage}
                                </View>
                              </View>
                              <Text 
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-[#1A2B4C] uppercase tracking-wider shrink-0 ${
                                  med.taken ? 'bg-[#4CAF50] text-white' : 'bg-[#FFB84D] text-[#1A2B4C]'
                                }`}
                              >
                                {med.taken ? '✓ Taken' : 'Pending'}
                              </Text>
                            </View>
                            <View >
                              <Info  />
                              <Text>{med.instructions}</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Bottom Action Strip */}
                    <View >
                      <View >
                        <TouchableOpacity
                          type="button"
                          onClick={() => setActiveUploadMed(med)}
                          
                        >
                          <Camera  />
                          <Text>Upload / Snap Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          type="button"
                          onClick={() => handleStartEdit(med)}
                          
                        >
                          <Edit3  />
                          <Text>Edit</Text>
                        </TouchableOpacity>
                      </View>

                      <View >
                        {med.taken ? (
                          <TouchableOpacity
                            type="button"
                            onClick={() => resetMedicineStatus(med.id)}
                            
                            title="Reset taken status back to pending"
                          >
                            <RotateCcw  />
                            <Text>Reset to Pending</Text>
                          </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove scheduled dose (${med.scheduledTime}) from schedule?`)) {
                              deleteMedicine(med.id);
                            }
                          }}
                          
                          title="Delete medication"
                        >
                          <Trash2  />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* Footer note */}
          <View >
            <Text>Any photo uploaded here updates the elder screen in real time.</Text>
            <TouchableOpacity
              onClick={onClose}
              
            >
              Done
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Sub-modal for Uploading Photo */}
      {activeUploadMed && (
        <MedicinePhotoUploaderModal
          medicine={activeUploadMed}
          isOpen={true}
          uploaderRole="volunteer"
          onClose={() => setActiveUploadMed(null)}
          onPhotoSaved={() => setActiveUploadMed(null)}
        />
      )}
    </>
  );
};
