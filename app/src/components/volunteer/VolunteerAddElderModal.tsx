import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  KeyRound, 
  HeartHandshake, 
  Phone, 
  MapPin, 
  Languages, 
  Plus, 
  Check, 
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audio';
import { SUPPORTED_LANGUAGES } from '../../utils/speech';
import { SupportedLanguage } from '../../types';

interface VolunteerAddElderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerAddElderModal: React.FC<VolunteerAddElderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addElderByPin, addNewElder, selectElder, volunteerLanguage } = useApp();

  const [tab, setTab] = useState<'pin' | 'profile'>('pin');

  // PIN Pair Tab State
  const [pinCode, setPinCode] = useState('');
  const [pinElderName, setPinElderName] = useState('');
  const [pinRelationship, setPinRelationship] = useState('Mother');
  const [pinError, setPinError] = useState('');

  // Profile Create Tab State
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [age, setAge] = useState<string>('78');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredLang, setPreferredLang] = useState<SupportedLanguage>('en-US');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [medicalConditionsStr, setMedicalConditionsStr] = useState('Hypertension, Arthritis');
  const [emergencyContactName, setEmergencyContactName] = useState('Sarah Chen');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('(555) 019-2834');
  const [profileError, setProfileError] = useState('');

  if (!isOpen) return null;

  const handlePairWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim().length < 4) {
      setPinError('Please enter a 4-digit PIN code.');
      return;
    }

    const res = addElderByPin(pinCode.trim(), pinElderName.trim() || undefined, pinRelationship.trim());
    if (res.success) {
      soundFx.playSuccessChime();
      if (res.elder) {
        selectElder(res.elder.id);
      }
      onClose();
    } else {
      setPinError(res.message || 'Could not pair with this PIN. Please check the code.');
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileError('Please enter the elder’s full name.');
      return;
    }

    const conditions = medicalConditionsStr
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const newElderId = addNewElder({
      name: name.trim(),
      relationship: relationship.trim(),
      age: parseInt(age, 10) || 75,
      phoneCountryCode,
      phoneNumber: phoneNumber.trim() || '4155559811',
      preferredLanguage: preferredLang,
      address: address.trim() || 'Apartment 2B, 108 Oakwood Lane',
      landmark: landmark.trim() || 'Near Community Health Clinic',
      medicalConditions: conditions,
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
    });

    soundFx.playSuccessChime();
    selectElder(newElderId);
    onClose();
  };

  const quickDemoPins = [
    { pin: '7492', name: 'Eleanor Vance', rel: 'Mother', age: 78, icon: '👵' },
    { pin: '1234', name: 'Arthur Pendelton', rel: 'Father', age: 82, icon: '👴' },
    { pin: '5521', name: 'Grace Hopper-Chen', rel: 'Aunt', age: 76, icon: '🧓' },
    { pin: '8833', name: 'Robert Tanaka', rel: 'Grandfather', age: 85, icon: '👴' },
  ];

  return (
    <View 
      id="volunteer-add-elder-modal"
      
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <View >
        
        {/* Header */}
        <View >
          <View >
            <View >
              <UserPlus  />
            </View>
            <View>
              <Text >
                Add Elder to Account
              </Text>
              <Text >
                Care for and monitor multiple family members or clients
              </Text>
            </View>
          </View>

          <TouchableOpacity
            id="close-add-elder-modal-btn"
            onClick={onClose}
            
          >
            <X  />
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View >
          <TouchableOpacity
            id="add-elder-tab-pin-btn"
            onClick={() => {
              soundFx.playTap();
              setTab('pin');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 transition cursor-pointer ${
              tab === 'pin'
                ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-sm'
                : 'bg-[#FAF7F2] text-[#1A2B4C] border-transparent hover:bg-slate-100'
            }`}
          >
            <KeyRound  />
            <Text>Connect via PIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            id="add-elder-tab-profile-btn"
            onClick={() => {
              soundFx.playTap();
              setTab('profile');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 transition cursor-pointer ${
              tab === 'profile'
                ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-sm'
                : 'bg-[#FAF7F2] text-[#1A2B4C] border-transparent hover:bg-slate-100'
            }`}
          >
            <UserCheck  />
            <Text>New Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Body */}
        <View >

          {/* TAB 1: CONNECT VIA PIN CODE */}
          {tab === 'pin' && (
            <form onSubmit={handlePairWithPin} >
              <View >
                <Text >
                  Elder Pairing PIN Code
                </Text>
                <Text >
                  Enter the 4-digit PIN code displayed on the elder's device screen.
                </Text>

                <input
                  id="add-elder-pin-input"
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value.replace(/\D/g, ''));
                    setPinError('');
                  }}
                  placeholder="e.g. 7492"
                  
                />

                <View >
                  <View>
                    <Text >
                      Elder Name (Optional)
                    </Text>
                    <input
                      type="text"
                      value={pinElderName}
                      onChange={(e) => setPinElderName(e.target.value)}
                      placeholder="e.g. Arthur"
                      
                    />
                  </View>
                  <View>
                    <Text >
                      Relationship
                    </Text>
                    <select
                      value={pinRelationship}
                      onChange={(e) => setPinRelationship(e.target.value)}
                      
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Aunt / Uncle">Aunt / Uncle</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Client / Ward">Client / Ward</option>
                      <option value="Neighbor">Neighbor</option>
                    </select>
                  </View>
                </View>

                {pinError && (
                  <Text >
                    {pinError}
                  </Text>
                )}
              </View>

              {/* Quick Demo PIN Chips */}
              <View >
                <Text >
                  Quick Demo Elders (Tap to Auto-Fill):
                </Text>
                <View >
                  {quickDemoPins.map((item) => (
                    <TouchableOpacity
                      key={item.pin}
                      type="button"
                      onClick={() => {
                        soundFx.playTap();
                        setPinCode(item.pin);
                        setPinElderName(item.name);
                        setPinRelationship(item.rel);
                        setPinError('');
                      }}
                      
                    >
                      <Text >{item.icon}</Text>
                      <View >
                        <View >{item.name}</View>
                        <View >
                          {item.rel} • PIN <Text >{item.pin}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                id="submit-add-elder-pin-btn"
                type="submit"
                
              >
                <KeyRound  />
                <Text>Pair & Add Elder</Text>
              </TouchableOpacity>
            </form>
          )}

          {/* TAB 2: REGISTER FULL NEW ELDER PROFILE */}
          {tab === 'profile' && (
            <form onSubmit={handleCreateProfile} >
              <View >
                
                {/* Full Name & Relationship */}
                <View >
                  <View>
                    <Text >
                      Full Name *
                    </Text>
                    <input
                      id="new-elder-name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Margaret Smith"
                      
                    />
                  </View>
                  <View>
                    <Text >
                      Relationship
                    </Text>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Client / Ward">Client / Ward</option>
                      <option value="Neighbor">Neighbor</option>
                    </select>
                  </View>
                </View>

                {/* Age & Preferred Language */}
                <View >
                  <View>
                    <Text >
                      Age
                    </Text>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="78"
                      
                    />
                  </View>
                  <View>
                    <Text >
                      Language
                    </Text>
                    <select
                      value={preferredLang}
                      onChange={(e) => setPreferredLang(e.target.value as SupportedLanguage)}
                      
                    >
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.nativeLabel} ({lang.label})
                        </option>
                      ))}
                    </select>
                  </View>
                </View>

                {/* Phone Number */}
                <View >
                  <View >
                    <Text >
                      Code
                    </Text>
                    <input
                      type="text"
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      placeholder="+1"
                      
                    />
                  </View>
                  <View >
                    <Text >
                      Phone Number
                    </Text>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="415-555-0192"
                      
                    />
                  </View>
                </View>

                {/* Address & Landmark */}
                <View>
                  <Text >
                    Home Address (For Safe Zone & GPS)
                  </Text>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 512 Willow Street, Apt 3A"
                    
                  />
                </View>

                <View>
                  <Text >
                    Landmark / Nearby Safe Zone
                  </Text>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Willow Creek Community Center"
                    
                  />
                </View>

                {/* Medical Conditions */}
                <View>
                  <Text >
                    Medical Notes / Conditions (Comma-separated)
                  </Text>
                  <input
                    type="text"
                    value={medicalConditionsStr}
                    onChange={(e) => setMedicalConditionsStr(e.target.value)}
                    placeholder="e.g. Hypertension, Diabetes, Pacemaker"
                    
                  />
                </View>

                {profileError && (
                  <Text >
                    {profileError}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                id="submit-create-elder-profile-btn"
                type="submit"
                
              >
                <UserCheck  />
                <Text>Create & Add Elder Profile</Text>
              </TouchableOpacity>
            </form>
          )}
        </View>

        {/* Footer info */}
        <View >
          <ShieldCheck  />
          <Text>All elders synced in real-time with GPS safety & medicine alerts</Text>
        </View>
      </View>
    </View>
  );
};
