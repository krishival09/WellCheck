import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
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
    <View 
      id="unified-login-page" 
      
    >
      {/* Header */}
      <View >
        <View className={`w-12 h-12 rounded-2xl border-2 border-[#1A2B4C] flex items-center justify-center shadow-[3px_3px_0px_#1A2B4C] ${
          selectedRole === 'elder' ? 'bg-[#FFB84D] text-[#1A2B4C]' : 'bg-[#4CAF50] text-white'
        }`}>
          {selectedRole === 'elder' ? (
            <User  />
          ) : (
            <HeartHandshake  />
          )}
        </View>
        <View>
          <Text >
            WellCheck Login & Account
          </Text>
          <Text >
            Choose your account role and enter your details below
          </Text>
        </View>
      </View>

      {/* Role Selection Switcher */}
      <View >
        <Text >
          Select Your Role
        </Text>
        <View >
          
          {/* Elder Option */}
          <TouchableOpacity
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
            <Text>Elder / Senior</Text>
          </TouchableOpacity>

          {/* Volunteer Option */}
          <TouchableOpacity
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
            <Text>Volunteer / Caregiver</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <View >
          <CheckCircle2  />
          <Text>{savedSuccess}</Text>
        </View>
      )}

      {/* FORM: Dynamic based on selected role */}
      <form onSubmit={handleSubmit} >
        
        {/* ========================================================================= */}
        {/* ELDER SPECIFIC FIELDS */}
        {/* ========================================================================= */}
        {selectedRole === 'elder' && (
          <View >
            
            {/* Senior Name & Age */}
            <View >
              <View >
                <Text >
                  <User  />
                  <Text>Senior Full Name *</Text>
                </Text>
                <input
                  id="elder-name-input"
                  type="text"
                  required
                  value={elderForm.name}
                  onChange={(e) => setElderForm({ ...elderForm, name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  
                />
              </View>

              <View>
                <Text >
                  Age
                </Text>
                <input
                  id="elder-age-input"
                  type="number"
                  value={elderForm.age}
                  onChange={(e) => setElderForm({ ...elderForm, age: Number(e.target.value) })}
                  
                />
              </View>
            </View>

            {/* Mobile Phone & Security PIN */}
            <View >
              <View>
                <Text >
                  <Phone  />
                  <Text>Senior Phone Number *</Text>
                </Text>
                <View >
                  <select
                    id="elder-country-code-select"
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
                    id="elder-phone-input"
                    type="tel"
                    required
                    value={elderForm.phoneNumber}
                    onChange={(e) => setElderForm({ ...elderForm, phoneNumber: e.target.value })}
                    placeholder="9845012345"
                    
                  />
                </View>
              </View>

              <View>
                <Text >
                  <Lock  />
                  <Text>Device PIN *</Text>
                </Text>
                <input
                  id="elder-pin-input"
                  type="text"
                  required
                  maxLength={6}
                  value={elderForm.pinCode}
                  onChange={(e) => setElderForm({ ...elderForm, pinCode: e.target.value })}
                  placeholder="7492"
                  
                />
              </View>
            </View>

            {/* Home Address */}
            <View>
              <Text >
                <MapPin  />
                <Text>Home / Flat Address</Text>
              </Text>
              <input
                id="elder-address-input"
                type="text"
                value={elderForm.address}
                onChange={(e) => setElderForm({ ...elderForm, address: e.target.value })}
                placeholder="Apartment 4B, Maple Green Lane"
                
              />
            </View>

            {/* Emergency Contact */}
            <View >
              <View>
                <Text >
                  <Heart  />
                  <Text>Emergency Contact Name</Text>
                </Text>
                <input
                  id="elder-emergency-name-input"
                  type="text"
                  value={elderForm.emergencyContactName}
                  onChange={(e) => setElderForm({ ...elderForm, emergencyContactName: e.target.value })}
                  placeholder="Sarah Chen (Daughter)"
                  
                />
              </View>

              <View>
                <Text >
                  <Phone  />
                  <Text>Emergency Phone</Text>
                </Text>
                <input
                  id="elder-emergency-phone-input"
                  type="tel"
                  value={elderForm.emergencyContactPhone}
                  onChange={(e) => setElderForm({ ...elderForm, emergencyContactPhone: e.target.value })}
                  placeholder="+91 98450 67890"
                  
                />
              </View>
            </View>

            {/* Language Preference */}
            <View>
              <Text >
                <Globe  />
                <Text>Voice Guidance & Subtitle Language</Text>
              </Text>
              <select
                id="elder-language-select"
                value={elderForm.preferredLanguage}
                onChange={(e) => setElderForm({ ...elderForm, preferredLanguage: e.target.value as SupportedLanguage })}
                
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeLabel} ({lang.label}) • {lang.region}
                  </option>
                ))}
              </select>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* VOLUNTEER SPECIFIC FIELDS */}
        {/* ========================================================================= */}
        {selectedRole === 'volunteer' && (
          <View >
            
            {/* Caregiver Name & Role */}
            <View >
              <View>
                <Text >
                  <User  />
                  <Text>Caregiver Name *</Text>
                </Text>
                <input
                  id="vol-name-input"
                  type="text"
                  required
                  value={volForm.name}
                  onChange={(e) => setVolForm({ ...volForm, name: e.target.value })}
                  placeholder="e.g. Sarah Chen"
                  
                />
              </View>

              <View>
                <Text >
                  <ShieldCheck  />
                  <Text>Relationship / Role *</Text>
                </Text>
                <input
                  id="vol-relationship-input"
                  type="text"
                  required
                  value={volForm.relationship}
                  onChange={(e) => setVolForm({ ...volForm, relationship: e.target.value })}
                  placeholder="e.g. Daughter / Nurse"
                  
                />
              </View>
            </View>

            {/* Mobile Phone & Linked PIN */}
            <View >
              <View>
                <Text >
                  <Phone  />
                  <Text>Caregiver Mobile Phone *</Text>
                </Text>
                <View >
                  <select
                    id="vol-country-code-select"
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
                    id="vol-phone-input"
                    type="tel"
                    required
                    value={volForm.phoneNumber}
                    onChange={(e) => setVolForm({ ...volForm, phoneNumber: e.target.value })}
                    placeholder="9845067890"
                    
                  />
                </View>
              </View>

              <View>
                <Text >
                  <Lock  />
                  <Text>Linked Elder PIN *</Text>
                </Text>
                <input
                  id="vol-pin-input"
                  type="text"
                  required
                  maxLength={6}
                  value={volForm.pinCode}
                  onChange={(e) => setVolForm({ ...volForm, pinCode: e.target.value })}
                  placeholder="7492"
                  
                />
              </View>
            </View>

            {/* Email & Organization */}
            <View >
              <View>
                <Text >
                  <Mail  />
                  <Text>Email Address</Text>
                </Text>
                <input
                  id="vol-email-input"
                  type="email"
                  value={volForm.email}
                  onChange={(e) => setVolForm({ ...volForm, email: e.target.value })}
                  placeholder="sarah.chen@caregiver.org"
                  
                />
              </View>

              <View>
                <Text >
                  <Building2  />
                  <Text>Organization</Text>
                </Text>
                <input
                  id="vol-org-input"
                  type="text"
                  value={volForm.organization}
                  onChange={(e) => setVolForm({ ...volForm, organization: e.target.value })}
                  placeholder="Family Care / Agency"
                  
                />
              </View>
            </View>

            {/* Caregiver Portal Language */}
            <View>
              <Text >
                <Globe  />
                <Text>Dashboard Language</Text>
              </Text>
              <select
                id="vol-language-select"
                value={volForm.preferredLanguage}
                onChange={(e) => setVolForm({ ...volForm, preferredLanguage: e.target.value as SupportedLanguage })}
                
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeLabel} ({lang.label}) • {lang.region}
                  </option>
                ))}
              </select>
            </View>

            {/* Alert Subscriptions */}
            <View >
              <Text >
                <Bell  />
                <Text>Real-Time Alert Subscriptions</Text>
              </Text>
              <View >
                <Text >
                  <input 
                    type="checkbox" 
                    checked={volForm.notifySos} 
                    onChange={(e) => setVolForm({ ...volForm, notifySos: e.target.checked })}
                    
                  />
                  <Text>🚨 SOS Siren</Text>
                </Text>
                <Text >
                  <input 
                    type="checkbox" 
                    checked={volForm.notifyMissedMeds} 
                    onChange={(e) => setVolForm({ ...volForm, notifyMissedMeds: e.target.checked })}
                    
                  />
                  <Text>💊 Missed Meds</Text>
                </Text>
                <Text >
                  <input 
                    type="checkbox" 
                    checked={volForm.notifyDailyReport} 
                    onChange={(e) => setVolForm({ ...volForm, notifyDailyReport: e.target.checked })}
                    
                  />
                  <Text>📊 Daily Report</Text>
                </Text>
              </View>
            </View>

          </View>
        )}

        {/* Submit Button */}
        <View >
          <TouchableOpacity
            id="login-submit-btn"
            type="submit"
            className={`w-full min-h-[50px] text-white font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-[#1A2B4C] shadow-[4px_4px_0px_#1A2B4C] flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer ${
              selectedRole === 'elder' 
                ? 'bg-[#1A2B4C] hover:bg-black' 
                : 'bg-[#4CAF50] hover:bg-[#43a047]'
            }`}
          >
            <CheckCircle2  />
            <Text>
              {selectedRole === 'elder' ? 'Log In as Elder Senior' : 'Log In as Volunteer Caregiver'}
            </Text>
            <ArrowRight  />
          </TouchableOpacity>
        </View>

      </form>

      {/* Footer Info */}
      <View >
        <Text>Device Sync PIN: <Text >{pairData.pinCode}</Text></Text>
        <Text>Secure Local & Firestore Sync</Text>
      </View>

    </View>
  );
};
