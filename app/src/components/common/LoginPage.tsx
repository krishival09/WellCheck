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
  Sparkles,
  ArrowRight,
  HeartHandshake,
  Mail,
  Building2,
  Bell,
  Smartphone,
  LayoutDashboard
} from 'lucide-react';
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
  } = useApp();

  // Role Selection: default to active role or 'elder'
  const [selectedRole, setSelectedRole] = useState<RoleMode>(activeRole || 'elder');
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Elder Form State
  const [elderForm, setElderForm] = useState({
    name: elderProfile.name || 'Eleanor Vance',
    age: elderProfile.age || 78,
    countryCode: elderProfile.phoneCountryCode || '+91',
    phoneNumber: elderProfile.phoneNumber || '9845012345',
    pinCode: pairData.pinCode || '7492',
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
    pinCode: pairData.pinCode || '7492',
    preferredLanguage: (volunteerLanguage || 'en-US') as SupportedLanguage,
    notifySos: true,
    notifyMissedMeds: true,
    notifyDailyReport: true,
  });

  const handleRoleSelect = (role: RoleMode) => {
    soundFx.playTap();
    setSelectedRole(role);
    setSavedSuccess(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccessChime();

    if (selectedRole === 'elder') {
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
        isLoggedIn: true,
      });

      setLanguage(elderForm.preferredLanguage);
      setActiveRole('elder');
      setElderScreen('home');
      setSavedSuccess(`Logged in as Senior Citizen: ${elderForm.name}`);
    } else {
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
        isLoggedIn: true,
      });

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
    <div 
      id="unified-login-page" 
      className="w-full max-w-xl bg-white rounded-3xl border-4 border-[#1A2B4C] shadow-[8px_8px_0px_#1A2B4C] p-5 sm:p-7 text-[#1A2B4C] animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b-2 border-[#1A2B4C]/20">
        <div className={`w-12 h-12 rounded-2xl border-2 border-[#1A2B4C] flex items-center justify-center shadow-[3px_3px_0px_#1A2B4C] ${
          selectedRole === 'elder' ? 'bg-[#FFB84D] text-[#1A2B4C]' : 'bg-[#4CAF50] text-white'
        }`}>
          {selectedRole === 'elder' ? (
            <User className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <HeartHandshake className="w-6 h-6 stroke-[2.5]" />
          )}
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none">
            WellCheck Login & Account
          </h2>
          <p className="text-xs font-bold text-[#1A2B4C]/70 mt-1">
            Choose your account role and enter your details below
          </p>
        </div>
      </div>

      {/* Role Selection Switcher */}
      <div className="mt-4">
        <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-2">
          Select Your Role
        </label>
        <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border-2 border-[#1A2B4C]">
          
          {/* Elder Option */}
          <button
            id="login-role-elder-btn"
            type="button"
            onClick={() => handleRoleSelect('elder')}
            className={`py-3 px-3 rounded-xl font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition cursor-pointer border-2 ${
              selectedRole === 'elder'
                ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-[2px_2px_0px_#FFB84D]'
                : 'bg-white text-[#1A2B4C] border-transparent hover:border-[#1A2B4C]/30'
            }`}
          >
            <User className={`w-4 h-4 ${selectedRole === 'elder' ? 'text-[#FFB84D]' : 'text-[#1A2B4C]'}`} />
            <span>Elder / Senior</span>
          </button>

          {/* Volunteer Option */}
          <button
            id="login-role-volunteer-btn"
            type="button"
            onClick={() => handleRoleSelect('volunteer')}
            className={`py-3 px-3 rounded-xl font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition cursor-pointer border-2 ${
              selectedRole === 'volunteer'
                ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-[2px_2px_0px_#4CAF50]'
                : 'bg-white text-[#1A2B4C] border-transparent hover:border-[#1A2B4C]/30'
            }`}
          >
            <HeartHandshake className={`w-4 h-4 ${selectedRole === 'volunteer' ? 'text-[#4CAF50]' : 'text-[#1A2B4C]'}`} />
            <span>Volunteer / Caregiver</span>
          </button>

        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="mt-4 p-3 bg-emerald-50 border-2 border-emerald-600 rounded-2xl flex items-center gap-2 text-xs font-black text-emerald-800 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* FORM: Dynamic based on selected role */}
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
        
        {/* ========================================================================= */}
        {/* ELDER SPECIFIC FIELDS */}
        {/* ========================================================================= */}
        {selectedRole === 'elder' && (
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
            
            {/* Senior Name & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF6B4A]" />
                  <span>Senior Full Name *</span>
                </label>
                <input
                  id="elder-name-input"
                  type="text"
                  required
                  value={elderForm.name}
                  onChange={(e) => setElderForm({ ...elderForm, name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1">
                  Age
                </label>
                <input
                  id="elder-age-input"
                  type="number"
                  value={elderForm.age}
                  onChange={(e) => setElderForm({ ...elderForm, age: Number(e.target.value) })}
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </div>
            </div>

            {/* Mobile Phone & Security PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#4CAF50]" />
                  <span>Senior Phone Number *</span>
                </label>
                <div className="flex gap-1.5">
                  <select
                    id="elder-country-code-select"
                    value={elderForm.countryCode}
                    onChange={(e) => setElderForm({ ...elderForm, countryCode: e.target.value })}
                    className="text-xs font-black px-2 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="elder-phone-input"
                    type="tel"
                    required
                    value={elderForm.phoneNumber}
                    onChange={(e) => setElderForm({ ...elderForm, phoneNumber: e.target.value })}
                    placeholder="9845012345"
                    className="flex-1 text-sm font-bold px-3 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#1A2B4C]" />
                  <span>Device PIN *</span>
                </label>
                <input
                  id="elder-pin-input"
                  type="text"
                  required
                  maxLength={6}
                  value={elderForm.pinCode}
                  onChange={(e) => setElderForm({ ...elderForm, pinCode: e.target.value })}
                  placeholder="7492"
                  className="w-full text-sm font-mono font-black px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] tracking-widest focus:outline-none focus:bg-white transition"
                />
              </div>
            </div>

            {/* Home Address */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B4A]" />
                <span>Home / Flat Address</span>
              </label>
              <input
                id="elder-address-input"
                type="text"
                value={elderForm.address}
                onChange={(e) => setElderForm({ ...elderForm, address: e.target.value })}
                placeholder="Apartment 4B, Maple Green Lane"
                className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
              />
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-500" />
                  <span>Emergency Contact Name</span>
                </label>
                <input
                  id="elder-emergency-name-input"
                  type="text"
                  value={elderForm.emergencyContactName}
                  onChange={(e) => setElderForm({ ...elderForm, emergencyContactName: e.target.value })}
                  placeholder="Sarah Chen (Daughter)"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-red-500" />
                  <span>Emergency Phone</span>
                </label>
                <input
                  id="elder-emergency-phone-input"
                  type="tel"
                  value={elderForm.emergencyContactPhone}
                  onChange={(e) => setElderForm({ ...elderForm, emergencyContactPhone: e.target.value })}
                  placeholder="+91 98450 67890"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#4CAF50]" />
                <span>Voice Guidance & Subtitle Language</span>
              </label>
              <select
                id="elder-language-select"
                value={elderForm.preferredLanguage}
                onChange={(e) => setElderForm({ ...elderForm, preferredLanguage: e.target.value as SupportedLanguage })}
                className="w-full text-xs font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeLabel} ({lang.label}) • {lang.region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VOLUNTEER SPECIFIC FIELDS */}
        {/* ========================================================================= */}
        {selectedRole === 'volunteer' && (
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
            
            {/* Caregiver Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#4CAF50]" />
                  <span>Caregiver Name *</span>
                </label>
                <input
                  id="vol-name-input"
                  type="text"
                  required
                  value={volForm.name}
                  onChange={(e) => setVolForm({ ...volForm, name: e.target.value })}
                  placeholder="e.g. Sarah Chen"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FFB84D]" />
                  <span>Relationship / Role *</span>
                </label>
                <input
                  id="vol-relationship-input"
                  type="text"
                  required
                  value={volForm.relationship}
                  onChange={(e) => setVolForm({ ...volForm, relationship: e.target.value })}
                  placeholder="e.g. Daughter / Nurse"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </div>
            </div>

            {/* Mobile Phone & Linked PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#4CAF50]" />
                  <span>Caregiver Mobile Phone *</span>
                </label>
                <div className="flex gap-1.5">
                  <select
                    id="vol-country-code-select"
                    value={volForm.countryCode}
                    onChange={(e) => setVolForm({ ...volForm, countryCode: e.target.value })}
                    className="text-xs font-black px-2 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="vol-phone-input"
                    type="tel"
                    required
                    value={volForm.phoneNumber}
                    onChange={(e) => setVolForm({ ...volForm, phoneNumber: e.target.value })}
                    placeholder="9845067890"
                    className="flex-1 text-sm font-bold px-3 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#1A2B4C]" />
                  <span>Linked Elder PIN *</span>
                </label>
                <input
                  id="vol-pin-input"
                  type="text"
                  required
                  maxLength={6}
                  value={volForm.pinCode}
                  onChange={(e) => setVolForm({ ...volForm, pinCode: e.target.value })}
                  placeholder="7492"
                  className="w-full text-sm font-mono font-black px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] tracking-widest focus:outline-none focus:bg-white transition"
                />
              </div>
            </div>

            {/* Email & Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#1A2B4C]" />
                  <span>Email Address</span>
                </label>
                <input
                  id="vol-email-input"
                  type="email"
                  value={volForm.email}
                  onChange={(e) => setVolForm({ ...volForm, email: e.target.value })}
                  placeholder="sarah.chen@caregiver.org"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#FF6B4A]" />
                  <span>Organization</span>
                </label>
                <input
                  id="vol-org-input"
                  type="text"
                  value={volForm.organization}
                  onChange={(e) => setVolForm({ ...volForm, organization: e.target.value })}
                  placeholder="Family Care / Agency"
                  className="w-full text-sm font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none focus:bg-white transition"
                />
              </div>
            </div>

            {/* Caregiver Portal Language */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#1A2B4C] mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#4CAF50]" />
                <span>Dashboard Language</span>
              </label>
              <select
                id="vol-language-select"
                value={volForm.preferredLanguage}
                onChange={(e) => setVolForm({ ...volForm, preferredLanguage: e.target.value as SupportedLanguage })}
                className="w-full text-xs font-bold px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border-2 border-[#1A2B4C] focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeLabel} ({lang.label}) • {lang.region}
                  </option>
                ))}
              </select>
            </div>

            {/* Alert Subscriptions */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border-2 border-[#1A2B4C]/30 flex flex-col gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1A2B4C] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#FF6B4A]" />
                <span>Real-Time Alert Subscriptions</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold text-[#1A2B4C]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={volForm.notifySos} 
                    onChange={(e) => setVolForm({ ...volForm, notifySos: e.target.checked })}
                    className="w-4 h-4 accent-[#FF6B4A] rounded"
                  />
                  <span>🚨 SOS Siren</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={volForm.notifyMissedMeds} 
                    onChange={(e) => setVolForm({ ...volForm, notifyMissedMeds: e.target.checked })}
                    className="w-4 h-4 accent-[#4CAF50] rounded"
                  />
                  <span>💊 Missed Meds</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={volForm.notifyDailyReport} 
                    onChange={(e) => setVolForm({ ...volForm, notifyDailyReport: e.target.checked })}
                    className="w-4 h-4 accent-[#1A2B4C] rounded"
                  />
                  <span>📊 Daily Report</span>
                </label>
              </div>
            </div>

          </div>
        )}

        {/* Submit Button */}
        <div className="mt-2">
          <button
            id="login-submit-btn"
            type="submit"
            className={`w-full min-h-[50px] text-white font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-[#1A2B4C] shadow-[4px_4px_0px_#1A2B4C] flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer ${
              selectedRole === 'elder' 
                ? 'bg-[#1A2B4C] hover:bg-black' 
                : 'bg-[#4CAF50] hover:bg-[#43a047]'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-white stroke-[2.5]" />
            <span>
              {selectedRole === 'elder' ? 'Log In as Elder Senior' : 'Log In as Volunteer Caregiver'}
            </span>
            <ArrowRight className="w-4 h-4 ml-1 text-white" />
          </button>
        </div>

      </form>

      {/* Footer Info */}
      <div className="mt-5 pt-3 border-t-2 border-[#1A2B4C]/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-[#1A2B4C]/60">
        <span>Device Sync PIN: <strong className="font-mono text-[#1A2B4C]">{pairData.pinCode}</strong></span>
        <span>Secure Local & Firestore Sync</span>
      </div>

    </div>
  );
};
