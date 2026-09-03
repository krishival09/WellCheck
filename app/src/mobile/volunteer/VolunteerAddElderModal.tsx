import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form } from '../../rn-compat';
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
} from 'lucide-react';
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
    <Div 
      id="volunteer-add-elder-modal"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3.5 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Div className="bg-[#FAF7F2] w-full max-w-lg rounded-3xl border-3 border-[#1A2B4C] shadow-[8px_8px_0px_#1A2B4C] max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <Div className="bg-[#1A2B4C] text-white p-4 flex items-center justify-between">
          <Div className="flex items-center gap-2.5">
            <Div className="w-9 h-9 rounded-xl bg-[#FFB84D] text-[#1A2B4C] flex items-center justify-center font-black shadow-xs">
              <UserPlus className="w-5 h-5 stroke-[2.5]" />
            </Div>
            <Div>
              <H2 className="text-base font-black tracking-tight leading-tight">
                Add Elder to Account
              </H2>
              <P className="text-[11px] font-bold text-white/70">
                Care for and monitor multiple family members or clients
              </P>
            </Div>
          </Div>

          <Button
            id="close-add-elder-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 active:scale-95 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        </Div>

        {/* Tab Switcher */}
        <Div className="p-3 bg-white border-b-2 border-[#1A2B4C]/20 flex items-center gap-2">
          <Button
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
            <KeyRound className="w-3.5 h-3.5 text-[#FFB84D]" />
            <Span>Connect via PIN</Span>
          </Button>

          <Button
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
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            <Span>New Profile</Span>
          </Button>
        </Div>

        {/* Modal Body */}
        <Div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">

          {/* TAB 1: CONNECT VIA PIN CODE */}
          {tab === 'pin' && (
            <Form onSubmit={handlePairWithPin} className="flex flex-col gap-3.5">
              <Div className="bg-white p-3.5 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex flex-col gap-2.5">
                <Label className="text-xs font-black uppercase tracking-wider text-[#1A2B4C] block">
                  Elder Pairing PIN Code
                </Label>
                <P className="text-[11px] font-bold text-slate-500">
                  Enter the 4-digit PIN code displayed on the elder's device screen.
                </P>

                <Input
                  id="add-elder-pin-input"
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value.replace(/\D/g, ''));
                    setPinError('');
                  }}
                  placeholder="e.g. 7492"
                  className="w-full h-14 text-center text-3xl font-black tracking-[0.25em] font-mono bg-[#FAF7F2] border-2 border-[#1A2B4C] focus:border-[#FF6B4A] rounded-xl outline-none transition text-[#1A2B4C]"
                />

                <Div className="grid grid-cols-2 gap-2 mt-1">
                  <Div>
                    <Label className="text-[11px] font-black text-[#1A2B4C] block mb-1">
                      Elder Name (Optional)
                    </Label>
                    <Input
                      type="text"
                      value={pinElderName}
                      onChange={(e) => setPinElderName(e.target.value)}
                      placeholder="e.g. Arthur"
                      className="w-full h-9 px-2.5 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-lg text-xs font-bold text-[#1A2B4C] outline-none"
                    />
                  </Div>
                  <Div>
                    <Label className="text-[11px] font-black text-[#1A2B4C] block mb-1">
                      Relationship
                    </Label>
                    <select
                      value={pinRelationship}
                      onChange={(e) => setPinRelationship(e.target.value)}
                      className="w-full h-9 px-2 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-lg text-xs font-bold text-[#1A2B4C] outline-none"
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
                  </Div>
                </Div>

                {pinError && (
                  <P className="text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    {pinError}
                  </P>
                )}
              </Div>

              {/* Quick Demo PIN Chips */}
              <Div className="flex flex-col gap-1.5">
                <Span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Quick Demo Elders (Tap to Auto-Fill):
                </Span>
                <Div className="grid grid-cols-2 gap-2">
                  {quickDemoPins.map((item) => (
                    <Button
                      key={item.pin}
                      type="button"
                      onClick={() => {
                        soundFx.playTap();
                        setPinCode(item.pin);
                        setPinElderName(item.name);
                        setPinRelationship(item.rel);
                        setPinError('');
                      }}
                      className="p-2 bg-white hover:bg-amber-50 rounded-xl border border-[#1A2B4C]/30 text-left flex items-center gap-2 shadow-xs transition active:scale-98 cursor-pointer"
                    >
                      <Span className="text-xl">{item.icon}</Span>
                      <Div className="min-w-0 flex-1">
                        <Div className="text-xs font-black text-[#1A2B4C] truncate">{item.name}</Div>
                        <Div className="text-[10px] font-bold text-slate-500">
                          {item.rel} • PIN <Span className="font-mono font-black text-[#1A2B4C]">{item.pin}</Span>
                        </Div>
                      </Div>
                    </Button>
                  ))}
                </Div>
              </Div>

              <Button
                id="submit-add-elder-pin-btn"
                type="submit"
                className="w-full min-h-[48px] bg-[#1A2B4C] hover:bg-black text-white font-black text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-[2px_2px_0px_#1A2B4C] active:scale-98 transition cursor-pointer mt-1"
              >
                <KeyRound className="w-4 h-4 text-[#FFB84D]" />
                <Span>Pair & Add Elder</Span>
              </Button>
            </Form>
          )}

          {/* TAB 2: REGISTER FULL NEW ELDER PROFILE */}
          {tab === 'profile' && (
            <Form onSubmit={handleCreateProfile} className="flex flex-col gap-3">
              <Div className="bg-white p-3.5 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex flex-col gap-3">
                
                {/* Full Name & Relationship */}
                <Div className="flex flex-col gap-2.5">
                  <Div>
                    <Label className="text-[11px] font-black uppercase text-[#1A2B4C] block mb-1">
                      Full Name *
                    </Label>
                    <Input
                      id="new-elder-name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Margaret Smith"
                      className="w-full h-10 px-3 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-xl text-xs font-bold text-[#1A2B4C] outline-none focus:border-[#1A2B4C]"
                    />
                  </Div>
                  <Div>
                    <Label className="text-[11px] font-black uppercase text-[#1A2B4C] block mb-1">
                      Relationship
                    </Label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full h-10 px-2.5 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-xl text-xs font-bold text-[#1A2B4C] outline-none"
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
                  </Div>
                </Div>

                {/* Age & Preferred Language */}
                <Div className="grid grid-cols-2 gap-2.5">
                  <Div>
                    <Label className="text-[11px] font-black uppercase text-[#1A2B4C] block mb-1">
                      Age
                    </Label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="78"
                      className="w-full h-10 px-3 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-xl text-xs font-bold text-[#1A2B4C] outline-none"
                    />
                  </Div>
                  <Div>
                    <Label className="text-[11px] font-black uppercase text-[#1A2B4C] block mb-1">
                      Language
                    </Label>
                    <select
                      value={preferredLang}
                      onChange={(e) => setPreferredLang(e.target.value as SupportedLanguage)}
                      className="w-full h-10 px-2 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-xl text-xs font-bold text-[#1A2B4C] outline-none"
                    >
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.nativeLabel} ({lang.label})
                        </option>
                      ))}
                    </select>
                  </Div>
                </Div>

                {/* Phone Number */}
                <Div className="grid grid-cols-3 gap-2">
                  <Div className="col-span-1">
                    <Label className="text-[11px] font-black uppercase text-[#1A2B4C] block mb-1">
                      Code
                    </Label>
                    <Input
                      type="text"
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      placeholder="+1"
                      className="w-full h-10 px-2 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-xl text-xs font-bold text-[#1A2B4C] text-center outline-none"
                    />
                  </Div>
                  <Div className="col-span-2">
                    <Label className="text-[11px] font-black uppercase text-[#1A2B4C] block mb-1">
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="415-555-0192"
                      className="w-full h-10 px-3 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-xl text-xs font-bold text-[#1A2B4C] outline-none"
                    />
                  </Div>
                </Div>

                {/* Address & Landmark */}
                <Div>
                  <Label className="text-[11px] font-black uppercase text-[#1A2B4C] block mb-1">
                    Home Address (For Safe Zone & GPS)
                  </Label>
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 512 Willow Street, Apt 3A"
                    className="w-full h-10 px-3 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-xl text-xs font-bold text-[#1A2B4C] outline-none"
                  />
                </Div>

                <Div>
                  <Label className="text-[11px] font-black uppercase text-[#1A2B4C] block mb-1">
                    Landmark / Nearby Safe Zone
                  </Label>
                  <Input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Willow Creek Community Center"
                    className="w-full h-10 px-3 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-xl text-xs font-bold text-[#1A2B4C] outline-none"
                  />
                </Div>

                {/* Medical Conditions */}
                <Div>
                  <Label className="text-[11px] font-black uppercase text-[#1A2B4C] block mb-1">
                    Medical Notes / Conditions (Comma-separated)
                  </Label>
                  <Input
                    type="text"
                    value={medicalConditionsStr}
                    onChange={(e) => setMedicalConditionsStr(e.target.value)}
                    placeholder="e.g. Hypertension, Diabetes, Pacemaker"
                    className="w-full h-10 px-3 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-xl text-xs font-bold text-[#1A2B4C] outline-none"
                  />
                </Div>

                {profileError && (
                  <P className="text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    {profileError}
                  </P>
                )}
              </Div>

              <Button
                id="submit-create-elder-profile-btn"
                type="submit"
                className="w-full min-h-[48px] bg-[#4CAF50] hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-[2px_2px_0px_#1A2B4C] active:scale-98 transition cursor-pointer"
              >
                <UserCheck className="w-4 h-4 stroke-[3]" />
                <Span>Create & Add Elder Profile</Span>
              </Button>
            </Form>
          )}
        </Div>

        {/* Footer info */}
        <Div className="p-3 bg-white border-t border-slate-200 text-center text-[11px] font-bold text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <Span>All elders synced in real-time with GPS safety & medicine alerts</Span>
        </Div>
      </Div>
    </Div>
  );
};
