import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { ReactNode } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react-native';

interface PhoneFrameProps {
  children: ReactNode;
  title: string;
  roleBadge?: 'Elder Mode' | 'Volunteer Mode' | string;
  badgeColor?: 'elder' | 'volunteer';
  showInspectionOverlay?: boolean;
  statusText?: string;
  modeTag?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  title,
  roleBadge = 'Elder Mode',
  badgeColor = 'elder',
  showInspectionOverlay = false,
  statusText,
  modeTag,
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Device Label & Mode Badge */}
      <View style={styles.headerArea}>
        <View style={styles.badgeContainer}>
          {modeTag && (
            <View style={[styles.modeTag, badgeColor === 'elder' ? styles.elderBadge : styles.volunteerBadge]}>
              <Text style={styles.modeTagText}>{modeTag}</Text>
            </View>
          )}
          <Text style={styles.titleText}>{title}</Text>
        </View>
        {statusText && (
          <Text style={styles.statusText}>
            {statusText}
          </Text>
        )}
      </View>

      {/* Realistic Mobile Device Frame */}
      <View style={styles.deviceFrame}>
        
        {/* Dynamic Island / Notch */}
        <View style={styles.notch}>
          <View style={styles.notchCam} />
          <View style={styles.notchIndicator} />
        </View>

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <Text style={styles.timeText}>{currentTime}</Text>
          <View style={styles.statusBarIcons}>
            <Signal size={14} color="#1A2B4C" />
            <Wifi size={14} color="#1A2B4C" />
            <Battery size={14} color="#1A2B4C" />
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.contentArea}>
          {children}

          {/* Dev Inspection Overlay for 60dp targets */}
          {showInspectionOverlay && (
            <View style={styles.overlay}>
              <View style={styles.overlayGrid}>
                <Text style={styles.overlayText}>60×60dp Touch Target Grid Active</Text>
              </View>
            </View>
          )}
        </View>

        {/* Home Indicator Bar */}
        <View style={styles.homeIndicatorContainer}>
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
  },
  headerArea: {
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#1A2B4C',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
  },
  elderBadge: { backgroundColor: '#1A2B4C' },
  volunteerBadge: { backgroundColor: '#FF6B4A' },
  modeTagText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A2B4C',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A2B4C',
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  deviceFrame: {
    width: 360,
    height: 760,
    backgroundColor: '#FAF7F2',
    borderRadius: 36,
    borderWidth: 6,
    borderColor: '#1A2B4C',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  notch: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 112,
    height: 20,
    backgroundColor: '#1A2B4C',
    borderRadius: 20,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  notchCam: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#000' },
  notchIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6B4A' },
  statusBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 4,
    borderBottomWidth: 1,
    borderColor: 'rgba(26, 43, 76, 0.1)',
  },
  timeText: { color: '#1A2B4C', fontSize: 12, fontWeight: '900' },
  statusBarIcons: { flexDirection: 'row', gap: 6, opacity: 0.9 },
  contentArea: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#FAF7F2',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 2,
    borderColor: '#059669',
    borderStyle: 'dashed',
    padding: 8,
  },
  overlayGrid: {
    backgroundColor: '#1A2B4C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  overlayText: { color: '#6ee7b7', fontSize: 10, fontWeight: '900' },
  homeIndicatorContainer: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 4,
  },
  homeIndicator: {
    width: 112,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(26, 43, 76, 0.4)',
  },
});
