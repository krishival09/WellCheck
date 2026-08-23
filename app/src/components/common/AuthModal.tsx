import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { 
  X, 
  User, 
  HeartHandshake, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  FileText, 
  Check, 
  ArrowRight,
  Sparkles,
  Smartphone
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { COUNTRY_CODES, SUPPORTED_LANGUAGES } from '../../utils/speech';
import { RoleMode, SupportedLanguage } from '../../types';
import { soundFx } from '../../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: RoleMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole,
}) => {
  const {
    activeRole,
    setActiveRole,
    elderProfile,
    updateElderProfile,
    volunteerProfile,
    updateVolunteerProfile,
    language,
    setLanguage,
    volunteerLanguage,
    setVolunteerLanguage,
    pairData,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<RoleMode>(initialRole || activeRole || 'elder');

  // Elder Edit Form
  const [elderForm, setElderForm] = useState({
    name: elderProfile.name || 'Eleanor Vance',
    age: elderProfile.age || 78,
    address: elderProfile.address || 'Apartment 4B, Maple Green Lane',
    emergencyContactName: elderProfile.emergencyContactName || 'Sarah Chen',
    emergencyContactPhone: elderProfile.emergencyContactPhone || '+1 (555) 234-5678',
    countryCode: elderProfile.countryCode || '+1',
    medicalConditions: (elderProfile.medicalConditions || ['Hypertension', 'Mild Arthritis']).join(', '),
  });

  // Volunteer Edit Form
  const [volForm, setVolForm] = useState({
    name: volunteerProfile.name || 'Sarah Chen',
    relationship: volunteerProfile.relationship || 'Daughter & Primary Caregiver',
    phoneNumber: volunteerProfile.phoneNumber || '+1 (555) 234-5678',
    countryCode: volunteerProfile.countryCode || '+1',
  });

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccessChime();

    if (selectedRole === 'elder') {
      updateElderProfile({
        name: elderForm.name.trim(),
        age: Number(elderForm.age) || 78,
        address: elderForm.address.trim(),
        emergencyContactName: elderForm.emergencyContactName.trim(),
        emergencyContactPhone: elderForm.emergencyContactPhone.trim(),
        countryCode: elderForm.countryCode,
        medicalConditions: elderForm.medicalConditions.split(',').map(s => s.trim()).filter(Boolean),
      });
      setActiveRole('elder');
    } else {
      updateVolunteerProfile({
        name: volForm.name.trim(),
        relationship: volForm.relationship.trim(),
        phoneNumber: volForm.phoneNumber.trim(),
        countryCode: volForm.countryCode,
      });
      setActiveRole('volunteer');
    }

    onClose();
  };

  return (
    <View 
      id="auth-role-modal"
      
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <View >
        
        {/* Header */}
        <View >
          <View >
            <View >
              <ShieldCheck  />
            </View>
            <View>
              <Text >
                Account & Role Switcher
              </Text>
              <Text >
                Configure profile details and active device mode
              </Text>
            </View>
          </View>
          <TouchableOpacity
            id="close-auth-modal-btn"
            onClick={onClose}
            aria-label="Close Profile Modal"
            
          >
            <X  />
          </TouchableOpacity>
        </View>

        {/* Role Toggle Selector */}
        <View >
          <TouchableOpacity
            type="button"
            onClick={() => {
              soundFx.playTap();
              setSelectedRole('elder');
            }}
            className={`py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition cursor-pointer ${
              selectedRole === 'elder'
                ? 'bg-[#1A2B4C] text-white shadow-md'
                : 'text-[#1A2B4C]/70 hover:text-[#1A2B4C]'
            }`}
          >
            <User  />
            <Text>Elder (Senior Mode)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            type="button"
            onClick={() => {
              soundFx.playTap();
              setSelectedRole('volunteer');
            }}
            className={`py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition cursor-pointer ${
              selectedRole === 'volunteer'
                ? 'bg-[#1A2B4C] text-white shadow-md'
                : 'text-[#1A2B4C]/70 hover:text-[#1A2B4C]'
            }`}
          >
            <HeartHandshake  />
            <Text>Volunteer Caregiver</Text>
          </TouchableOpacity>
        </View>

        <form onSubmit={handleSave} >
          
          {selectedRole === 'elder' ? (
            /* ELDER PROFILE FORM */
            <View >
              <View >
                <Text >
                  Senior Citizen Information
                </Text>
                <Text >
                  PIN: {pairData.pinCode}
                </Text>
              </View>

              <View >
                <View>
                  <Text >
                    Senior Full Name *
                  </Text>
                  <input
                    type="text"
                    required
                    value={elderForm.name}
                    onChange={(e) => setElderForm({ ...elderForm, name: e.target.value })}
                    
                  />
                </View>

                <View>
                  <Text >
                    Age
                  </Text>
                  <input
                    type="number"
                    value={elderForm.age}
                    onChange={(e) => setElderForm({ ...elderForm, age: Number(e.target.value) })}
                    
                  />
                </View>
              </View>

              <View>
                <Text >
                  Home / Apartment Address
                </Text>
                <View >
                  <MapPin  />
                  <input
                    type="text"
                    value={elderForm.address}
                    onChange={(e) => setElderForm({ ...elderForm, address: e.target.value })}
                    
                  />
                </View>
              </View>

              <View >
                <View>
                  <Text >
                    Emergency Contact Name
                  </Text>
                  <input
                    type="text"
                    value={elderForm.emergencyContactName}
                    onChange={(e) => setElderForm({ ...elderForm, emergencyContactName: e.target.value })}
                    
                  />
                </View>

                <View>
                  <Text >
                    Emergency Phone Number
                  </Text>
                  <View >
                    <select
                      value={elderForm.countryCode}
                      onChange={(e) => setElderForm({ ...elderForm, countryCode: e.target.value })}
                      
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={elderForm.emergencyContactPhone}
                      onChange={(e) => setElderForm({ ...elderForm, emergencyContactPhone: e.target.value })}
                      
                    />
                  </View>
                </View>
              </View>

              <View>
                <Text >
                  Medical Notes / Conditions (comma separated)
                </Text>
                <input
                  type="text"
                  value={elderForm.medicalConditions}
                  onChange={(e) => setElderForm({ ...elderForm, medicalConditions: e.target.value })}
                  placeholder="e.g. Hypertension, Diabetes, Pacemaker"
                  
                />
              </View>

              {/* Language Choice */}
              <View>
                <Text >
                  Elder Voice & Display Language
                </Text>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeLabel} ({l.label})
                    </option>
                  ))}
                </select>
              </View>
            </View>
          ) : (
            /* VOLUNTEER PROFILE FORM */
            <View >
              <View >
                <Text >
                  Volunteer Caregiver Profile
                </Text>
                <Text >
                  Caregiver Role
                </Text>
              </View>

              <View >
                <View>
                  <Text >
                    Caregiver Name *
                  </Text>
                  <input
                    type="text"
                    required
                    value={volForm.name}
                    onChange={(e) => setVolForm({ ...volForm, name: e.target.value })}
                    
                  />
                </View>

                <View>
                  <Text >
                    Relationship
                  </Text>
                  <input
                    type="text"
                    value={volForm.relationship}
                    onChange={(e) => setVolForm({ ...volForm, relationship: e.target.value })}
                    placeholder="e.g. Daughter, Neighbor, Nurse"
                    
                  />
                </View>
              </View>

              <View>
                <Text >
                  Caregiver Contact Phone
                </Text>
                <View >
                  <select
                    value={volForm.countryCode}
                    onChange={(e) => setVolForm({ ...volForm, countryCode: e.target.value })}
                    
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={volForm.phoneNumber}
                    onChange={(e) => setVolForm({ ...volForm, phoneNumber: e.target.value })}
                    
                  />
                </View>
              </View>

              {/* Language Choice */}
              <View>
                <Text >
                  Caregiver UI Language
                </Text>
                <select
                  value={volunteerLanguage}
                  onChange={(e) => setVolunteerLanguage(e.target.value as SupportedLanguage)}
                  
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeLabel} ({l.label})
                    </option>
                  ))}
                </select>
              </View>
            </View>
          )}

          {/* Quick Demo Presets */}
          <View >
            <Text >
              <Sparkles  /> Preset Demo Accounts
            </Text>
            <View >
              <TouchableOpacity
                type="button"
                onClick={() => {
                  soundFx.playTap();
                  setElderForm({
                    name: 'Eleanor Vance',
                    age: 78,
                    address: 'Apartment 4B, Maple Green Lane',
                    emergencyContactName: 'Sarah Chen',
                    emergencyContactPhone: '+1 (555) 234-5678',
                    countryCode: '+1',
                    medicalConditions: 'Hypertension, Mild Arthritis',
                  });
                  setSelectedRole('elder');
                }}
                
              >
                Load Eleanor (Elder)
              </TouchableOpacity>
              <TouchableOpacity
                type="button"
                onClick={() => {
                  soundFx.playTap();
                  setVolForm({
                    name: 'Sarah Chen',
                    relationship: 'Daughter & Primary Caregiver',
                    phoneNumber: '+1 (555) 234-5678',
                    countryCode: '+1',
                  });
                  setSelectedRole('volunteer');
                }}
                
              >
                Load Sarah (Caregiver)
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            id="auth-modal-save-btn"
            type="submit"
            
          >
            <Check  />
            <Text>Save Profile & Activate {selectedRole === 'elder' ? 'Elder Mode' : 'Volunteer Mode'}</Text>
          </TouchableOpacity>
        </form>
      </View>
    </View>
  );
};
