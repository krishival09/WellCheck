import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React from 'react';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  X, 
  Clock, 
  CheckCircle2,
  Battery,
  Navigation
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audio';

interface VolunteerMissedCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledTime: string;
  alertId?: string;
  onOpenLocationTracker: () => void;
}

export const VolunteerMissedCheckinModal: React.FC<VolunteerMissedCheckinModalProps> = ({
  isOpen,
  onClose,
  scheduledTime,
  alertId,
  onOpenLocationTracker,
}) => {
  const {
    pairData,
    elderProfile,
    elderLocation,
    startCall,
    acknowledgeAlert,
    resolveAlert,
  } = useApp();

  if (!isOpen) return null;

  const handleCallElder = () => {
    soundFx.playTap();
    onClose();
    startCall({
      contactName: pairData.elderName || 'Eleanor Vance',
      contactRole: 'elder',
      phoneNumber: elderProfile.phoneNumber || '(555) 018-9923',
      reason: 'checkin',
    });
  };

  const handleCallEmergencyContact = () => {
    soundFx.playTap();
    onClose();
    startCall({
      contactName: elderProfile.emergencyContactName || 'Sarah Chen (Daughter)',
      contactRole: 'emergency',
      phoneNumber: elderProfile.emergencyContactPhone || '(555) 019-2834',
      reason: 'checkin',
    });
  };

  const handleTrackLocation = () => {
    soundFx.playTap();
    onClose();
    onOpenLocationTracker();
  };

  const handleResolveAndDismiss = () => {
    soundFx.playSuccessChime();
    if (alertId) {
      resolveAlert(alertId);
    }
    onClose();
  };

  return (
    <View 
      id="volunteer-missed-checkin-alert-modal"
      
    >
      <View >
        
        {/* Urgent Alert Header */}
        <View >
          <View >
            <View >
              <AlertTriangle  />
            </View>
            <View>
              <Text >
                URGENT ESCALATION
              </Text>
              <Text >
                Missed Check-In Alert!
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onClick={onClose}
            aria-label="Close modal"
            
          >
            <X  />
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <View >
          
          {/* Main Notice Box */}
          <View >
            <View >
              <View >
                <View >
                  {pairData.elderName.charAt(0)}
                </View>
                <Text >
                  {pairData.elderName}
                </Text>
              </View>
              <Text >
                <Clock  />
                {scheduledTime} Check-In
              </Text>
            </View>

            <Text >
              <Text >{pairData.elderName} did not check in</Text> within the required <Text >3-minute response window</Text> for the {scheduledTime} safety check.
            </Text>
          </View>

          {/* Elder Live Location & Battery Snapshot */}
          <View >
            <View >
              <View >
                <MapPin  />
              </View>
              <View >
                <Text >
                  Last Known GPS Location
                </Text>
                <Text >
                  {elderLocation.address}
                </Text>
              </View>
            </View>

            <View >
              <Battery  />
              <Text>{elderLocation.batteryLevel}%</Text>
            </View>
          </View>

          {/* Action Buttons Grid */}
          <View >
            
            {/* Primary Action 1: Call Elder Directly */}
            <TouchableOpacity
              id="missed-checkin-call-elder-btn"
              onClick={handleCallElder}
              
            >
              <Phone  />
              <Text>Call {pairData.elderName.split(' ')[0]} Directly</Text>
            </TouchableOpacity>

            {/* Primary Action 2: Track Live GPS Location */}
            <TouchableOpacity
              id="missed-checkin-track-location-btn"
              onClick={handleTrackLocation}
              
            >
              <Navigation  />
              <Text>Track Live GPS Location on Map</Text>
            </TouchableOpacity>

            {/* Primary Action 3: Call Emergency Family Contact */}
            <TouchableOpacity
              id="missed-checkin-call-emergency-btn"
              onClick={handleCallEmergencyContact}
              
            >
              <ShieldAlert  />
              <Text>Call Emergency Contact ({elderProfile.emergencyContactName?.split(' ')[0] || 'Family'})</Text>
            </TouchableOpacity>
          </View>

          {/* Dismiss & Acknowledge */}
          <View >
            <Text >
              Check in confirmed in person?
            </Text>
            <TouchableOpacity
              onClick={handleResolveAndDismiss}
              
            >
              <CheckCircle2  />
              <Text>Mark Resolved & Safe</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    </View>
  );
};
