import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form } from '../../rn-compat';
import React, { useState } from 'react';
import { Alert } from 'react-native';
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
import { MedicinePhotoUploaderModal } from '../components/MedicinePhotoUploaderModal';
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
      <Div 
        id="volunteer-med-manager-modal"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={(e: any) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <Div className="bg-[#FAF7F2] w-full max-w-2xl max-h-[90vh] rounded-3xl border-4 border-[#1A2B4C] shadow-[8px_8px_0px_#1A2B4C] p-4 sm:p-6 text-[#1A2B4C] flex flex-col gap-4 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <Div className="flex items-center justify-between pb-3 border-b-2 border-[#1A2B4C]/20">
            <Div className="flex items-center gap-2.5">
              <Div className="w-10 h-10 rounded-2xl bg-[#FF6B4A] text-white border-2 border-[#1A2B4C] flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_#1A2B4C]">
                💊
              </Div>
              <Div>
                <H2 className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight">
                  Elder Medication & Photo Hub
                </H2>
                <P className="text-xs font-bold text-[#1A2B4C]/70">
                  Live verification for <Span className="font-black text-[#1A2B4C]">{pairData.elderName}</Span>
                </P>
              </Div>
            </Div>
            <Div className="flex items-center gap-2">
              <Div className="hidden sm:flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <Span>Managed by Elder</Span>
              </Div>
              <Button
                onClick={onClose}
                aria-label="Close Modal"
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center text-[#1A2B4C] active:scale-95 transition cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </Button>
            </Div>
          </Div>

          {/* Elder Quick-Switch Strip */}
          {monitoredElders.length > 1 && (
            <Div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <Span className="text-[11px] font-black uppercase text-slate-500 shrink-0 mr-1">
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
                        : 'bg-white text-[#1A2B4C] border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Span>{elder.avatarEmoji || '👵'}</Span>
                    <Span>{elder.name}</Span>
                  </Button>
                );
              })}
            </Div>
          )}

          {/* Medicines List */}
          <Div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {medicines.length === 0 ? (
              <Div className="p-8 text-center bg-white rounded-2xl border-2 border-[#1A2B4C] flex flex-col items-center justify-center">
                <Pill className="w-8 h-8 text-slate-400 mb-2" />
                <P className="text-sm font-black text-[#1A2B4C]">No medicines currently scheduled</P>
                <P className="text-xs text-slate-500 mt-1">The elder can add medicine reminders directly on their screen.</P>
              </Div>
            ) : (
              medicines.map((med) => {
                const isEditing = editingMedId === med.id;

                return (
                  <Div
                    key={med.id}
                    className="p-3.5 sm:p-4 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
                  >
                    {/* Top Row: Photo Thumbnail + Details + Actions */}
                    <Div className="flex items-start gap-3.5">
                      
                      {/* Photo Thumbnail with Overlay & Upload Button */}
                      <Div className="relative group shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C]">
                        <Img
                          src={med.localPhotoRef}
                          alt={med.medicineName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {/* Hover / Direct Click Overlay to Upload Photo */}
                        <Button
                          type="button"
                          onClick={() => setActiveUploadMed(med)}
                          className="absolute inset-0 bg-[#1A2B4C]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center cursor-pointer"
                          title="Upload new photo of medicine"
                        >
                          <Camera className="w-5 h-5 mb-0.5 text-[#FFB84D]" />
                          <Span className="text-[10px] font-black uppercase leading-tight">
                            Change Photo
                          </Span>
                        </Button>
                        {/* Uploader Role Tag */}
                        <Div className="absolute bottom-1 left-1 right-1 bg-[#1A2B4C]/90 text-white text-[8px] font-black uppercase px-1 py-0.5 rounded text-center truncate">
                          {med.photoUploadedBy === 'volunteer' 
                            ? '🧑‍⚕️ By Volunteer' 
                            : med.photoUploadedBy === 'elder' 
                            ? '👵 By Elder' 
                            : '📸 Photo'}
                        </Div>
                      </Div>

                      {/* Info & Edit Fields */}
                      <Div className="flex-1 min-w-0">
                        {isEditing ? (
                          <Div className="flex flex-col gap-2">
                            <Input
                              type="text"
                              value={editForm.medicineName || ''}
                              onChange={(e: any) => setEditForm({ ...editForm, medicineName: e.target?.value ?? e })}
                              placeholder="Medicine Name"
                              className="text-xs font-bold px-2 py-1 bg-[#FAF7F2] rounded-lg border border-[#1A2B4C]"
                            />
                            <Div className="grid grid-cols-2 gap-1.5">
                              <Input
                                type="text"
                                value={editForm.dosage || ''}
                                onChange={(e: any) => setEditForm({ ...editForm, dosage: e.target?.value ?? e })}
                                placeholder="Dosage"
                                className="text-xs font-bold px-2 py-1 bg-[#FAF7F2] rounded-lg border border-[#1A2B4C]"
                              />
                              <Input
                                type="text"
                                value={editForm.scheduledTime || ''}
                                onChange={(e: any) => setEditForm({ ...editForm, scheduledTime: e.target?.value ?? e })}
                                placeholder="Time (e.g. 08:00 AM)"
                                className="text-xs font-bold px-2 py-1 bg-[#FAF7F2] rounded-lg border border-[#1A2B4C]"
                              />
                            </Div>
                            <Input
                              type="text"
                              value={editForm.instructions || ''}
                              onChange={(e: any) => setEditForm({ ...editForm, instructions: e.target?.value ?? e })}
                              placeholder="Instructions"
                              className="text-xs font-bold px-2 py-1 bg-[#FAF7F2] rounded-lg border border-[#1A2B4C]"
                            />
                            <Div className="flex gap-2 mt-1">
                              <Button
                                onClick={() => handleSaveEdit(med.id)}
                                className="px-3 py-1 bg-[#4CAF50] text-white font-black text-xs uppercase rounded-lg border border-[#1A2B4C] flex items-center gap-1 cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" /> Save
                              </Button>
                              <Button
                                onClick={() => setEditingMedId(null)}
                                className="px-3 py-1 bg-slate-200 text-[#1A2B4C] font-black text-xs uppercase rounded-lg border border-[#1A2B4C] cursor-pointer"
                              >
                                Cancel
                              </Button>
                            </Div>
                          </Div>
                        ) : (
                          <Div>
                            <Div className="flex items-start justify-between">
                              <Div>
                                <H3 className="text-sm sm:text-base font-black text-[#1A2B4C] leading-tight">
                                  Scheduled Dose • {med.scheduledTime}
                                </H3>
                                <Div className="text-xs font-bold text-[#1A2B4C]/80 mt-0.5">
                                  {med.dosage}
                                </Div>
                              </Div>
                              <Span 
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-[#1A2B4C] uppercase tracking-wider shrink-0 ${
                                  med.taken ? 'bg-[#4CAF50] text-white' : 'bg-[#FFB84D] text-[#1A2B4C]'
                                }`}
                              >
                                {med.taken ? '✓ Taken' : 'Pending'}
                              </Span>
                            </Div>
                            <Div className="text-[11px] font-semibold text-[#1A2B4C]/70 mt-1 flex items-start gap-1">
                              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <Span>{med.instructions}</Span>
                            </Div>
                          </Div>
                        )}
                      </Div>
                    </Div>

                    {/* Bottom Action Strip */}
                    <Div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1A2B4C]/10 text-xs">
                      <Div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          onClick={() => setActiveUploadMed(med)}
                          className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-slate-100 text-[#1A2B4C] font-black rounded-lg border border-[#1A2B4C] flex items-center gap-1 text-[11px] cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#FF6B4A]" />
                          <Span>Upload / Snap Photo</Span>
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleStartEdit(med)}
                          className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-slate-100 text-[#1A2B4C] font-black rounded-lg border border-[#1A2B4C] flex items-center gap-1 text-[11px] cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                          <Span>Edit</Span>
                        </Button>
                      </Div>

                      <Div className="flex items-center gap-1.5">
                        {med.taken ? (
                          <Button
                            type="button"
                            onClick={() => resetMedicineStatus(med.id)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-300 flex items-center gap-1 text-[10px] cursor-pointer"
                            title="Reset taken status back to pending"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <Span>Reset to Pending</Span>
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          onClick={() => {
                            Alert.alert(
                              'Remove Dose',
                              `Remove scheduled dose (${med.scheduledTime}) from schedule?`,
                              [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Remove', style: 'destructive', onPress: () => deleteMedicine(med.id) },
                              ]
                            );
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-300 transition cursor-pointer"
                          title="Delete medication"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </Div>
                    </Div>
                  </Div>
                );
              })
            )}
          </Div>

          {/* Footer note */}
          <Div className="pt-2 border-t border-[#1A2B4C]/20 flex items-center justify-between text-[11px] font-bold text-slate-600">
            <Span>Any photo uploaded here updates the elder screen in real time.</Span>
            <Button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#1A2B4C] hover:bg-black text-white font-black text-xs uppercase rounded-xl border border-black cursor-pointer"
            >
              Done
            </Button>
          </Div>
        </Div>
      </Div>

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
