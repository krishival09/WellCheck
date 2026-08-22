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
} from 'lucide-react';
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
    <div 
      id="auth-role-modal"
      className="fixed inset-0 z-50 bg-[#1A2B4C]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FAF7F2] w-full max-w-lg max-h-[90vh] rounded-3xl border-4 border-[#1A2B4C] shadow-[8px_8px_0px_#1A2B4C] p-4 sm:p-6 text-[#1A2B4C] flex flex-col gap-4 overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1A2B4C]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFB84D] border-2 border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C]">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight">
                Account & Role Switcher
              </h2>
              <p className="text-xs font-bold text-[#1A2B4C]/70">
                Configure profile details and active device mode
              </p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            aria-label="Close Profile Modal"
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center text-[#1A2B4C] active:scale-95 transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-200 p-1.5 rounded-2xl border border-[#1A2B4C]/30">
          <button
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
            <User className="w-4 h-4 text-[#FFB84D]" />
            <span>Elder (Senior Mode)</span>
          </button>

          <button
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
            <HeartHandshake className="w-4 h-4 text-[#4CAF50]" />
            <span>Volunteer Caregiver</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-3">
          
          {selectedRole === 'elder' ? (
            /* ELDER PROFILE FORM */
            <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C]">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-xs font-black uppercase text-[#1A2B4C]">
                  Senior Citizen Information
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                  PIN: {pairData.pinCode}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black uppercase text-[#1A2B4C] mb-1">
                    Senior Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={elderForm.name}
                    onChange={(e) => setElderForm({ ...elderForm, name: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-[#1A2B4C] mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={elderForm.age}
                    onChange={(e) => setElderForm({ ...elderForm, age: Number(e.target.value) })}
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-[#1A2B4C] mb-1">
                  Home / Apartment Address
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={elderForm.address}
                    onChange={(e) => setElderForm({ ...elderForm, address: e.target.value })}
                    className="w-full text-xs font-bold pl-8 pr-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black uppercase text-[#1A2B4C] mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={elderForm.emergencyContactName}
                    onChange={(e) => setElderForm({ ...elderForm, emergencyContactName: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-[#1A2B4C] mb-1">
                    Emergency Phone Number
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      value={elderForm.countryCode}
                      onChange={(e) => setElderForm({ ...elderForm, countryCode: e.target.value })}
                      className="text-xs font-bold px-2 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
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
                      className="flex-1 text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-[#1A2B4C] mb-1">
                  Medical Notes / Conditions (comma separated)
                </label>
                <input
                  type="text"
                  value={elderForm.medicalConditions}
                  onChange={(e) => setElderForm({ ...elderForm, medicalConditions: e.target.value })}
                  placeholder="e.g. Hypertension, Diabetes, Pacemaker"
                  className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                />
              </div>

              {/* Language Choice */}
              <div>
                <label className="block text-[11px] font-black uppercase text-[#1A2B4C] mb-1">
                  Elder Voice & Display Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeLabel} ({l.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            /* VOLUNTEER PROFILE FORM */
            <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C]">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-xs font-black uppercase text-[#1A2B4C]">
                  Volunteer Caregiver Profile
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-300">
                  Caregiver Role
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black uppercase text-[#1A2B4C] mb-1">
                    Caregiver Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={volForm.name}
                    onChange={(e) => setVolForm({ ...volForm, name: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-[#1A2B4C] mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={volForm.relationship}
                    onChange={(e) => setVolForm({ ...volForm, relationship: e.target.value })}
                    placeholder="e.g. Daughter, Neighbor, Nurse"
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-[#1A2B4C] mb-1">
                  Caregiver Contact Phone
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={volForm.countryCode}
                    onChange={(e) => setVolForm({ ...volForm, countryCode: e.target.value })}
                    className="text-xs font-bold px-2 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
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
                    className="flex-1 text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Language Choice */}
              <div>
                <label className="block text-[11px] font-black uppercase text-[#1A2B4C] mb-1">
                  Caregiver UI Language
                </label>
                <select
                  value={volunteerLanguage}
                  onChange={(e) => setVolunteerLanguage(e.target.value as SupportedLanguage)}
                  className="w-full text-xs font-bold px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C] focus:outline-none"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeLabel} ({l.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Quick Demo Presets */}
          <div className="p-3 bg-white rounded-2xl border-2 border-[#1A2B4C] flex items-center justify-between">
            <span className="text-[11px] font-black text-[#1A2B4C] uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" /> Preset Demo Accounts
            </span>
            <div className="flex gap-1.5">
              <button
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
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg text-[10px] font-bold text-amber-900 cursor-pointer"
              >
                Load Eleanor (Elder)
              </button>
              <button
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
                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-[10px] font-bold text-emerald-900 cursor-pointer"
              >
                Load Sarah (Caregiver)
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            id="auth-modal-save-btn"
            type="submit"
            className="w-full min-h-[50px] bg-[#1A2B4C] hover:bg-black text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#4CAF50] stroke-[3]" />
            <span>Save Profile & Activate {selectedRole === 'elder' ? 'Elder Mode' : 'Volunteer Mode'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
