import { Div, Span, P, H2, Label, Button, Input, Option, Select, Strong, Form } from '../../rn-compat';
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Phone, 
  Lock, 
  User, 
  MapPin, 
  Heart, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  HeartHandshake,
  Mail,
  Building2,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { COUNTRY_CODES, SUPPORTED_LANGUAGES } from '../../utils/speech';
import { RoleMode, SupportedLanguage } from '../../types';
import { soundFx } from '../../utils/audio';

export const LoginPage: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    elderProfile,
    updateElderProfile,
    volunteerProfile,
    updateVolunteerProfile,
    loginUser,
    language,
    setLanguage,
    volunteerLanguage,
    setVolunteerLanguage,
    pairData,
    setElderScreen,
    setVolunteerScreen,
    pairVolunteerWithPin,
  } = useApp();

  // Role Selection: default to active role or 'elder'
  const [selectedRole, setSelectedRole] = useState<RoleMode>(activeRole || 'elder');
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Elder Form State
  const [elderForm, setElderForm] = useState({
    name: elderProfile.name || 'Eleanor Vance',
    age: elderProfile.age || 78,
    countryCode: elderProfile.phoneCountryCode || '+91',
    phoneNumber: elderProfile.phoneNumber || '9845012345',
    pinCode: pairData.pinCode || '749281',
    address: elderProfile.address || 'Apartment 4B, Maple Green Lane',
    emergencyContactName: elderProfile.emergencyContactName || 'Sarah Chen (Daughter)',
    emergencyContactPhone: elderProfile.emergencyContactPhone || '+91 98450 67890',
    medicalConditions: (elderProfile.medicalConditions || ['Hypertension', 'Mild Arthritis']).join(', '),
    preferredLanguage: (language || 'hi-IN') as SupportedLanguage,
  });

  // Volunteer Form State
  const [volForm, setVolForm] = useState({
    name: volunteerProfile.name || 'Sarah Chen',
    relationship: volunteerProfile.relationship || 'Daughter & Primary Caregiver',
    email: volunteerProfile.email || 'sarah.chen@caregiver.org',
    countryCode: volunteerProfile.phoneCountryCode || '+91',
    phoneNumber: volunteerProfile.phoneNumber || '9845067890',
    organization: 'Family & Community Care',
    pinCode: pairData.pinCode || '749281',
    preferredLanguage: (volunteerLanguage || 'en-US') as SupportedLanguage,
  });

  const handleRoleSelect = (role: RoleMode) => {
    soundFx.playTap();
    setSelectedRole(role);
    setSavedSuccess(null);
    setErrorMessage(null);
  };

  const handleSubmit = (e?: any) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setErrorMessage(null);

    if (selectedRole === 'elder') {
      if (!elderForm.name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (elderForm.pinCode.trim().length < 6) {
        setErrorMessage('Device PIN must be exactly 6 digits.');
        return;
      }

      soundFx.playSuccessChime();

      updateElderProfile({
        name: elderForm.name.trim(),
        age: Number(elderForm.age) || 78,
        address: elderForm.address.trim(),
        phoneNumber: elderForm.phoneNumber.trim(),
        phoneCountryCode: elderForm.countryCode,
        emergencyContactName: elderForm.emergencyContactName.trim(),
        emergencyContactPhone: elderForm.emergencyContactPhone.trim(),
        countryCode: elderForm.countryCode,
        medicalConditions: elderForm.medicalConditions.split(',').map(s => s.trim()).filter(Boolean),
        preferredLanguage: elderForm.preferredLanguage,
      });

      loginUser({
        name: elderForm.name.trim(),
        email: 'elder@wellcheck.app',
        phoneCountryCode: elderForm.countryCode,
        phoneNumber: elderForm.phoneNumber.trim(),
        role: 'elder',
        preferredLanguage: elderForm.preferredLanguage,
        emergencyContactName: elderForm.emergencyContactName.trim(),
        emergencyContactPhone: elderForm.emergencyContactPhone.trim(),
      });

      setLanguage(elderForm.preferredLanguage);
      setActiveRole('elder');
      setElderScreen('home');
      setSavedSuccess(`Logged in as Senior Citizen: ${elderForm.name}`);
    } else {
      if (!volForm.name.trim()) {
        setErrorMessage('Please enter your caregiver name.');
        return;
      }
      if (volForm.pinCode.trim().length < 6) {
        setErrorMessage('Linked Elder PIN must be 6 digits.');
        return;
      }

      soundFx.playSuccessChime();

      updateVolunteerProfile({
        name: volForm.name.trim(),
        relationship: volForm.relationship.trim(),
        email: volForm.email.trim(),
        phoneNumber: volForm.phoneNumber.trim(),
        phoneCountryCode: volForm.countryCode,
        preferredLanguage: volForm.preferredLanguage,
      });

      loginUser({
        name: volForm.name.trim(),
        email: volForm.email.trim(),
        phoneCountryCode: volForm.countryCode,
        phoneNumber: volForm.phoneNumber.trim(),
        role: 'volunteer',
        preferredLanguage: volForm.preferredLanguage,
      });

      if (volForm.pinCode.trim()) {
        pairVolunteerWithPin(volForm.pinCode.trim());
      }

      setVolunteerLanguage(volForm.preferredLanguage);
      setActiveRole('volunteer');
      setVolunteerScreen('dashboard');
      setSavedSuccess(`Logged in as Volunteer Caregiver: ${volForm.name}`);
    }

    setTimeout(() => {
      setSavedSuccess(null);
    }, 4000);
  };

  return (
    <Div 
      id="unified-login-page" 
      className="w-full max-w-xl bg-white rounded-3xl border-4 border-[#1A2B4C] shadow-[8px_8px_0px_#1A2B4C] p-5 sm:p-7 text-[#1A2B4C]"
    >
      {/* Header */}
      <Div className="flex items-center gap-3.5 pb-4 border-b-2 border-[#1A2B4C]/20">
        <Div className={`w-12 h-12 rounded-2xl border-2 border-[#1A2B4C] flex items-center justify-center shadow-[3px_3px_0px_#1A2B4C] ${
          selectedRole === 'elder' ? 'bg-[#FFB84D]' : 'bg-[#4CAF50]'
        }`}>
          {selectedRole === 'elder' ? (
            <User color="#1A2B4C" size={24} />
          ) : (
            <HeartHandshake color="#ffffff" size={24} />
          )}
        </Div>
        <Div>
          <H2 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none text-[#1A2B4C]">
            WellCheck Login & Account
          </H2>
          <P className="text-xs font-bold text-[#1A2B4C]/70 mt-1">
            Choose your account role and enter your details below
          </P>
        </Div>
      </Div>

      {/* Role Selection Switcher */}
      <Div className="mt-4">
        <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-2">
          Select Your Role
        </Label>
        <Div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border-2 border-[#1A2B4C]">
          
          {/* Elder Option */}
          <Button
            id="login-role-elder-btn"
            type="button"
            onClick={() => handleRoleSelect('elder')}
            onPress={() => handleRoleSelect('elder')}
            className={`py-3 px-3 rounded-xl font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition cursor-pointer border-2 ${
              selectedRole === 'elder'
                ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-[2px_2px_0px_#FFB84D]'
                : 'bg-white text-[#1A2B4C] border-transparent hover:border-[#1A2B4C]/30'
            }`}
          >
            <User color={selectedRole === 'elder' ? '#FFB84D' : '#1A2B4C'} size={18} />
            <Span className={selectedRole === 'elder' ? 'text-white font-black' : 'text-[#1A2B4C] font-black'}>
              Elder / Senior
            </Span>
          </Button>

          {/* Volunteer Option */}
          <Button
            id="login-role-volunteer-btn"
            type="button"
            onClick={() => handleRoleSelect('volunteer')}
            onPress={() => handleRoleSelect('volunteer')}
            className={`py-3 px-3 rounded-xl font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition cursor-pointer border-2 ${
              selectedRole === 'volunteer'
                ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-[2px_2px_0px_#4CAF50]'
                : 'bg-white text-[#1A2B4C] border-transparent hover:border-[#1A2B4C]/30'
            }`}
          >
            <HeartHandshake color={selectedRole === 'volunteer' ? '#4CAF50' : '#1A2B4C'} size={18} />
            <Span className={selectedRole === 'volunteer' ? 'text-white font-black' : 'text-[#1A2B4C] font-black'}>
              Volunteer / Caregiver
            </Span>
          </Button>

        </Div>
      </Div>

      {/* Error Message */}
      {errorMessage && (
        <Div className="mt-3 p-3 bg-red-50 border-2 border-red-500 rounded-2xl flex items-center gap-2 text-xs font-black text-red-700">
          <Span>⚠️ {errorMessage}</Span>
        </Div>
      )}

      {/* Success Notification Banner */}
      {savedSuccess && (
        <Div className="mt-3 p-3 bg-emerald-50 border-2 border-emerald-600 rounded-2xl flex items-center gap-2 text-xs font-black text-emerald-800">
          <CheckCircle2 color="#059669" size={20} />
          <Span className="text-emerald-800 font-black">{savedSuccess}</Span>
        </Div>
      )}

      {/* FORM: Dynamic based on selected role */}
      <Form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
        
        {/* ========================================================================= */}
        {/* ELDER SPECIFIC FIELDS */}
        {/* ========================================================================= */}
        {selectedRole === 'elder' && (
          <Div className="flex flex-col gap-3.5">
            
            {/* Senior Name & Age */}
            <Div className="flex flex-col gap-3">
              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <User color="#FF6B4A" size={14} />
                  <Span>Senior Full Name *</Span>
                </Label>
                <Input
                  id="elder-name-input"
                  type="text"
                  required
                  value={elderForm.name}
                  onChange={(e: any) => setElderForm({ ...elderForm, name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </Div>

              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1">
                  Age
                </Label>
                <Input
                  id="elder-age-input"
                  type="number"
                  value={elderForm.age}
                  onChange={(e: any) => setElderForm({ ...elderForm, age: Number(e.target.value) })}
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </Div>
            </Div>

            {/* Mobile Phone & Security PIN */}
            <Div className="flex flex-col gap-3">
              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Phone color="#4CAF50" size={14} />
                  <Span>Senior Phone Number *</Span>
                </Label>
                <Div className="flex gap-1.5">
                  <Select
                    id="elder-country-code-select"
                    value={elderForm.countryCode}
                    onChange={(e: any) => setElderForm({ ...elderForm, countryCode: e.target.value })}
                    className="text-xs font-black bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <Option 
                        key={c.code} 
                        value={c.code} 
                        label={`${c.flag} ${c.code} (${c.country})`}
                      >
                        {c.flag} {c.code} ({c.country})
                      </Option>
                    ))}
                  </Select>
                  <Input
                    id="elder-phone-input"
                    type="tel"
                    required
                    value={elderForm.phoneNumber}
                    onChange={(e: any) => setElderForm({ ...elderForm, phoneNumber: e.target.value })}
                    placeholder="9845012345"
                    className="flex-1 text-sm font-bold px-3 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                  />
                </Div>
              </Div>

              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Lock color="#1A2B4C" size={14} />
                  <Span>Device Pairing PIN (6 Digits) *</Span>
                </Label>
                <Input
                  id="elder-pin-input"
                  type="text"
                  required
                  maxLength={6}
                  value={elderForm.pinCode}
                  onChange={(e: any) => setElderForm({ ...elderForm, pinCode: e.target.value.replace(/\D/g, '') })}
                  placeholder="749281"
                  className="w-full text-center font-mono font-black text-2xl tracking-[0.25em] px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </Div>
            </Div>

            {/* Home Address */}
            <Div>
              <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                <MapPin color="#FF6B4A" size={14} />
                <Span>Home / Flat Address</Span>
              </Label>
              <Input
                id="elder-address-input"
                type="text"
                value={elderForm.address}
                onChange={(e: any) => setElderForm({ ...elderForm, address: e.target.value })}
                placeholder="Apartment 4B, Maple Green Lane"
                className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
              />
            </Div>

            {/* Emergency Contact */}
            <Div className="flex flex-col gap-3">
              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Heart color="#EF4444" size={14} />
                  <Span>Emergency Contact Name</Span>
                </Label>
                <Input
                  id="elder-emergency-name-input"
                  type="text"
                  value={elderForm.emergencyContactName}
                  onChange={(e: any) => setElderForm({ ...elderForm, emergencyContactName: e.target.value })}
                  placeholder="Sarah Chen (Daughter)"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </Div>

              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Phone color="#EF4444" size={14} />
                  <Span>Emergency Phone</Span>
                </Label>
                <Input
                  id="elder-emergency-phone-input"
                  type="tel"
                  value={elderForm.emergencyContactPhone}
                  onChange={(e: any) => setElderForm({ ...elderForm, emergencyContactPhone: e.target.value })}
                  placeholder="+91 98450 67890"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </Div>
            </Div>

            {/* Language Preference */}
            <Div>
              <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                <Globe color="#4CAF50" size={14} />
                <Span>Voice Guidance & Subtitle Language</Span>
              </Label>
              <Select
                id="elder-language-select"
                value={elderForm.preferredLanguage}
                onChange={(e: any) => setElderForm({ ...elderForm, preferredLanguage: e.target.value as SupportedLanguage })}
                className="w-full text-xs font-bold bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C]"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <Option 
                    key={lang.code} 
                    value={lang.code}
                    label={`${lang.flag} ${lang.nativeLabel} (${lang.label}) • ${lang.region}`}
                  >
                    {lang.flag} {lang.nativeLabel} ({lang.label}) • {lang.region}
                  </Option>
                ))}
              </Select>
            </Div>
          </Div>
        )}

        {/* ========================================================================= */}
        {/* VOLUNTEER SPECIFIC FIELDS */}
        {/* ========================================================================= */}
        {selectedRole === 'volunteer' && (
          <Div className="flex flex-col gap-3.5">
            
            {/* Caregiver Name & Role */}
            <Div className="flex flex-col gap-3">
              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <User color="#4CAF50" size={14} />
                  <Span>Caregiver Name *</Span>
                </Label>
                <Input
                  id="vol-name-input"
                  type="text"
                  required
                  value={volForm.name}
                  onChange={(e: any) => setVolForm({ ...volForm, name: e.target.value })}
                  placeholder="e.g. Sarah Chen"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </Div>

              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <ShieldCheck color="#FFB84D" size={14} />
                  <Span>Relationship / Role *</Span>
                </Label>
                <Input
                  id="vol-relationship-input"
                  type="text"
                  required
                  value={volForm.relationship}
                  onChange={(e: any) => setVolForm({ ...volForm, relationship: e.target.value })}
                  placeholder="e.g. Daughter / Nurse / Social Worker"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </Div>
            </Div>

            {/* Mobile Phone & Linked PIN */}
            <Div className="flex flex-col gap-3">
              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Phone color="#4CAF50" size={14} />
                  <Span>Caregiver Mobile Phone *</Span>
                </Label>
                <Div className="flex gap-1.5">
                  <Select
                    id="vol-country-code-select"
                    value={volForm.countryCode}
                    onChange={(e: any) => setVolForm({ ...volForm, countryCode: e.target.value })}
                    className="text-xs font-black bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <Option 
                        key={c.code} 
                        value={c.code}
                        label={`${c.flag} ${c.code} (${c.country})`}
                      >
                        {c.flag} {c.code} ({c.country})
                      </Option>
                    ))}
                  </Select>
                  <Input
                    id="vol-phone-input"
                    type="tel"
                    required
                    value={volForm.phoneNumber}
                    onChange={(e: any) => setVolForm({ ...volForm, phoneNumber: e.target.value })}
                    placeholder="9845067890"
                    className="flex-1 text-sm font-bold px-3 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                  />
                </Div>
              </Div>

              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Lock color="#1A2B4C" size={14} />
                  <Span>Linked Elder PIN (6 Digits) *</Span>
                </Label>
                <Input
                  id="vol-pin-input"
                  type="text"
                  required
                  maxLength={6}
                  value={volForm.pinCode}
                  onChange={(e: any) => setVolForm({ ...volForm, pinCode: e.target.value.replace(/\D/g, '') })}
                  placeholder="749281"
                  className="w-full text-center font-mono font-black text-2xl tracking-[0.25em] px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </Div>
            </Div>

            {/* Email & Organization */}
            <Div className="flex flex-col gap-3">
              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Mail color="#1A2B4C" size={14} />
                  <Span>Email Address</Span>
                </Label>
                <Input
                  id="vol-email-input"
                  type="email"
                  value={volForm.email}
                  onChange={(e: any) => setVolForm({ ...volForm, email: e.target.value })}
                  placeholder="sarah.chen@caregiver.org"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </Div>

              <Div>
                <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Building2 color="#FF6B4A" size={14} />
                  <Span>Organization / Community</Span>
                </Label>
                <Input
                  id="vol-org-input"
                  type="text"
                  value={volForm.organization}
                  onChange={(e: any) => setVolForm({ ...volForm, organization: e.target.value })}
                  placeholder="Family Care / Community Center"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </Div>
            </Div>

            {/* Caregiver Portal Language */}
            <Div>
              <Label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                <Globe color="#4CAF50" size={14} />
                <Span>Dashboard Language</Span>
              </Label>
              <Select
                id="vol-language-select"
                value={volForm.preferredLanguage}
                onChange={(e: any) => setVolForm({ ...volForm, preferredLanguage: e.target.value as SupportedLanguage })}
                className="w-full text-xs font-bold bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C]"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <Option 
                    key={lang.code} 
                    value={lang.code}
                    label={`${lang.flag} ${lang.nativeLabel} (${lang.label}) • ${lang.region}`}
                  >
                    {lang.flag} {lang.nativeLabel} ({lang.label}) • {lang.region}
                  </Option>
                ))}
              </Select>
            </Div>
          </Div>
        )}

        {/* Submit Button */}
        <Div className="mt-4">
          <Button
            id="login-submit-btn"
            type="button"
            onClick={handleSubmit}
            onPress={handleSubmit}
            className={`w-full min-h-[52px] text-white font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-[#1A2B4C] shadow-[4px_4px_0px_#1A2B4C] flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer ${
              selectedRole === 'elder' 
                ? 'bg-[#1A2B4C]' 
                : 'bg-[#4CAF50]'
            }`}
          >
            <CheckCircle2 color="#ffffff" size={20} />
            <Span className="text-white font-black">
              {selectedRole === 'elder' ? 'Log In as Elder Senior' : 'Log In as Volunteer Caregiver'}
            </Span>
            <ArrowRight color="#ffffff" size={16} />
          </Button>
        </Div>

      </Form>

      {/* Footer Info */}
      <Div className="mt-5 pt-3 border-t-2 border-[#1A2B4C]/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-[#1A2B4C]/60">
        <Span>Device Sync PIN: <Strong className="font-mono text-[#1A2B4C]">{pairData.pinCode || '749281'}</Strong></Span>
        <Span>Secure Local & Firestore Sync</Span>
      </Div>

    </Div>
  );
};
