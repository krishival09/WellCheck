import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image, 
  SafeAreaView, 
  TextInput,
  ActivityIndicator 
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { VolunteerSosModal } from './VolunteerSosModal';
import { VolunteerMedicineManagerModal } from './VolunteerMedicineManagerModal';
import { VolunteerCheckinScheduleModal } from './VolunteerCheckinScheduleModal';
import { VolunteerMissedCheckinModal } from './VolunteerMissedCheckinModal';
import { VolunteerLocationTrackerModal } from './VolunteerLocationTrackerModal';
import { VolunteerPairingView } from './VolunteerPairingView';
import { VolunteerAddElderModal } from './VolunteerAddElderModal';

export const VolunteerDashboard: React.FC = () => {
  const { 
    monitoredElders, 
    selectedElder, 
    selectElder, 
    alerts, 
    acknowledgeAlert, 
    resolveAlert, 
    medicines, 
    checkinSchedules,
    triggerCheckinPrompt,
    elderLocation,
    startCall,
    pairData,
    pairVolunteerWithPin
  } = useApp();

  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [isAddElderModalOpen, setIsAddElderModalOpen] = useState(false);
  const [pingSent, setPingSent] = useState(false);

  // Quick inline PIN state
  const [quickPin, setQuickPin] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinStatus, setPinStatus] = useState<{ text: string; error: boolean } | null>(null);

  const activeSos = alerts.find(a => a.type === 'sos' && a.status === 'active');

  const handlePingCheckin = () => {
    triggerCheckinPrompt();
    setPingSent(true);
    setTimeout(() => setPingSent(false), 3000);
  };

  const handleQuickPinConnect = async () => {
    if (quickPin.trim().length < 4) {
      setPinStatus({ text: 'Enter 4-digit PIN', error: true });
      return;
    }

    setPinLoading(true);
    setPinStatus(null);
    try {
      const success = await pairVolunteerWithPin(quickPin.trim());
      if (success) {
        setPinStatus({ text: `Connected to PIN ${quickPin}!`, error: false });
        setQuickPin('');
      } else {
        setPinStatus({ text: 'Pair not found. Check PIN on elder device.', error: true });
      }
    } catch {
      setPinStatus({ text: 'Connection error. Check PIN.', error: true });
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* ===================================================================== */}
        {/* 1. CRITICAL ACTIVE ALERTS BANNER (PRD §4.1, §5)                       */}
        {/* ===================================================================== */}
        {activeSos ? (
          <View style={styles.criticalSosBanner}>
            <View style={styles.sosBannerHeader}>
              <Text style={styles.sosBannerIcon}>🚨</Text>
              <View style={styles.sosBannerTextGroup}>
                <Text style={styles.sosBannerTitle}>CRITICAL SOS ALERT TRIGGERED!</Text>
                <Text style={styles.sosBannerSubtitle}>
                  {pairData.elderName || 'Eleanor Vance'} pressed emergency help button
                </Text>
              </View>
            </View>

            <View style={styles.sosBannerActions}>
              <TouchableOpacity 
                style={styles.sosViewBtn}
                onPress={() => setIsSosModalOpen(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.sosViewBtnText}>VIEW EMERGENCY</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sosCallBtn}
                onPress={() => startCall({ contactName: pairData.elderName, contactRole: 'elder', reason: 'sos' })}
                activeOpacity={0.8}
              >
                <Text style={styles.sosCallBtnText}>📞 CALL NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* ===================================================================== */}
        {/* 2. PROMINENT PIN PAIRING SECTION (PRD §2, §3)                         */}
        {/* ===================================================================== */}
        <View style={styles.pinSectionCard}>
          <View style={styles.pinCardHeader}>
            <Text style={styles.pinSectionTitle}>🔑 Connect to Elder via PIN</Text>
            <View style={styles.pinLiveStatus}>
              <Text style={styles.pinLiveStatusText}>
                Active: PIN {pairData.pinCode}
              </Text>
            </View>
          </View>

          <View style={styles.pinInputRow}>
            <TextInput
              style={styles.pinInput}
              value={quickPin}
              onChangeText={(t) => {
                setQuickPin(t);
                if (pinStatus) setPinStatus(null);
              }}
              placeholder="Enter 4-digit PIN"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={6}
            />

            <TouchableOpacity 
              style={[styles.pinConnectBtn, pinLoading && styles.pinConnectBtnDisabled]}
              onPress={handleQuickPinConnect}
              disabled={pinLoading}
              activeOpacity={0.8}
            >
              {pinLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.pinConnectBtnText}>Connect PIN</Text>
              )}
            </TouchableOpacity>
          </View>

          {pinStatus ? (
            <View style={[styles.pinStatusMsg, pinStatus.error ? styles.pinStatusMsgError : styles.pinStatusMsgSuccess]}>
              <Text style={[styles.pinStatusMsgText, pinStatus.error ? styles.pinStatusErrorText : styles.pinStatusSuccessText]}>
                {pinStatus.text}
              </Text>
            </View>
          ) : null}
        </View>

        {/* ===================================================================== */}
        {/* 3. ELDER SELECTOR & MULTI-ELDER SWITCHER                              */}
        {/* ===================================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>👥 Monitored Elders</Text>
            <TouchableOpacity 
              style={styles.addElderSmallBtn}
              onPress={() => setIsPairingModalOpen(true)}
            >
              <Text style={styles.addElderSmallBtnText}>+ Keypad PIN</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.elderScroll}>
            {monitoredElders.map((elder) => {
              const isSelected = elder.id === selectedElder.id;
              return (
                <TouchableOpacity
                  key={elder.id}
                  style={[styles.elderChip, isSelected && styles.elderChipSelected]}
                  onPress={() => selectElder(elder.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.elderChipAvatar}>{elder.avatarEmoji || '👵'}</Text>
                  <View>
                    <Text style={[styles.elderChipName, isSelected && styles.elderChipNameSelected]}>
                      {elder.name}
                    </Text>
                    <Text style={styles.elderChipRel}>{elder.relationship || 'Elder'} • PIN: {elder.pinCode}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ===================================================================== */}
        {/* 4. CURRENT ELDER LIVE STATUS CARD                                     */}
        {/* ===================================================================== */}
        <View style={styles.elderStatusCard}>
          <View style={styles.elderStatusTop}>
            <View style={styles.elderAvatarCircle}>
              <Text style={styles.elderAvatarText}>{selectedElder.avatarEmoji || '👵'}</Text>
            </View>
            
            <View style={styles.elderInfoGroup}>
              <View style={styles.elderNameRow}>
                <Text style={styles.elderMainName}>{selectedElder.name}</Text>
                <View style={styles.safeBadge}>
                  <Text style={styles.safeBadgeText}>
                    {activeSos ? '🔴 SOS ACTIVE' : '🟢 SAFE • ALL CLEAR'}
                  </Text>
                </View>
              </View>
              <Text style={styles.elderSubDetail}>
                Age: {selectedElder.age || 78} • Phone: {selectedElder.phoneNumber || '+91 98450 12345'}
              </Text>
              <Text style={styles.elderLocationDetail}>
                📍 {elderLocation.landmark || 'Home Safe Zone'} ({elderLocation.lastUpdated})
              </Text>
            </View>
          </View>

          <View style={styles.statusMetricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Battery</Text>
              <Text style={styles.metricValue}>🔋 {elderLocation.batteryLevel || 88}%</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Last Check-In</Text>
              <Text style={styles.metricValue}>⏱️ 2h ago</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Pairing PIN</Text>
              <Text style={styles.metricValue}>🔑 {pairData.pinCode}</Text>
            </View>
          </View>
        </View>

        {/* ===================================================================== */}
        {/* 5. QUICK ACTION SHORTCUTS GRID                                       */}
        {/* ===================================================================== */}
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={[styles.actionGridCard, styles.actionCall]}
            onPress={() => startCall({ contactName: selectedElder.name, contactRole: 'elder' })}
            activeOpacity={0.8}
          >
            <Text style={styles.actionGridIcon}>📞</Text>
            <Text style={styles.actionGridTitle}>Call Elder</Text>
            <Text style={styles.actionGridSub}>Direct audio line</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionGridCard, styles.actionPing]}
            onPress={handlePingCheckin}
            activeOpacity={0.8}
          >
            <Text style={styles.actionGridIcon}>🔔</Text>
            <Text style={styles.actionGridTitle}>
              {pingSent ? 'Ping Sent ✓' : 'Ping Check-In'}
            </Text>
            <Text style={styles.actionGridSub}>Prompt on elder phone</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionGridCard, styles.actionMeds]}
            onPress={() => setIsMedModalOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionGridIcon}>💊</Text>
            <Text style={styles.actionGridTitle}>Manage Meds</Text>
            <Text style={styles.actionGridSub}>{medicines.length} scheduled</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionGridCard, styles.actionSchedule]}
            onPress={() => setIsScheduleModalOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionGridIcon}>📅</Text>
            <Text style={styles.actionGridTitle}>Check-in Slots</Text>
            <Text style={styles.actionGridSub}>{checkinSchedules.length} active times</Text>
          </TouchableOpacity>
        </View>

        {/* ===================================================================== */}
        {/* 6. LIVE ALERT ACTIVITY FEED (PRD §3, §6)                               */}
        {/* ===================================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>🔔 Live Alert Feed</Text>
            <View style={styles.alertCountBadge}>
              <Text style={styles.alertCountText}>{alerts.length} Total</Text>
            </View>
          </View>

          {alerts.length === 0 ? (
            <Text style={styles.emptyFeedText}>No alerts recorded. All systems normal.</Text>
          ) : (
            <View style={styles.alertsList}>
              {alerts.slice(0, 5).map((alert) => (
                <View 
                  key={alert.id} 
                  style={[
                    styles.alertItem, 
                    alert.status === 'active' && styles.alertItemActive,
                    alert.type === 'sos' && styles.alertItemSos
                  ]}
                >
                  <Text style={styles.alertItemEmoji}>
                    {alert.type === 'sos' ? '🚨' : alert.type === 'checkin_missed' ? '⚠️' : '💊'}
                  </Text>
                  <View style={styles.alertItemDetails}>
                    <View style={styles.alertItemTopRow}>
                      <Text style={styles.alertItemType}>
                        {alert.type === 'sos' ? 'EMERGENCY SOS' : alert.type === 'checkin_missed' ? 'MISSED CHECK-IN' : 'MEDICATION MISSED'}
                      </Text>
                      <View style={[styles.statusPill, alert.status === 'active' ? styles.statusPillActive : styles.statusPillResolved]}>
                        <Text style={[styles.statusPillText, alert.status === 'active' ? styles.statusPillTextActive : styles.statusPillTextResolved]}>
                          {alert.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.alertItemNotes}>
                      {alert.notes || `Alert generated for ${alert.elderName || 'Elder'}`}
                    </Text>
                    <Text style={styles.alertItemTime}>
                      {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>

                  {alert.status === 'active' ? (
                    <View style={styles.alertActionButtons}>
                      <TouchableOpacity 
                        style={styles.ackBtn}
                        onPress={() => acknowledgeAlert(alert.id)}
                      >
                        <Text style={styles.ackBtnText}>ACK</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.resolveBtn}
                        onPress={() => resolveAlert(alert.id)}
                      >
                        <Text style={styles.resolveBtnText}>Resolve</Text>
                      </TouchableOpacity>
                    </View>
                  ) : alert.status === 'acknowledged' ? (
                    <TouchableOpacity 
                      style={styles.resolveBtnOnly}
                      onPress={() => resolveAlert(alert.id)}
                    >
                      <Text style={styles.resolveBtnText}>Resolve</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ===================================================================== */}
        {/* 7. TODAY'S MEDICATION COMPLIANCE                                     */}
        {/* ===================================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>💊 Today's Medication Tracker</Text>
            <TouchableOpacity onPress={() => setIsMedModalOpen(true)}>
              <Text style={styles.linkActionText}>+ Add Med</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.medsList}>
            {medicines.map((med) => (
              <View key={med.id} style={styles.medItemRow}>
                <Image 
                  source={{ uri: med.localPhotoRef || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80' }} 
                  style={styles.medThumb} 
                />
                <View style={styles.medItemInfo}>
                  <Text style={styles.medItemName}>{med.medicineName}</Text>
                  <Text style={styles.medItemTime}>⏰ {med.scheduledTime} • {med.dosage}</Text>
                </View>
                <View style={[styles.medStatusChip, med.taken ? styles.medStatusChipTaken : styles.medStatusChipPending]}>
                  <Text style={[styles.medStatusChipText, med.taken ? styles.medStatusChipTextTaken : styles.medStatusChipTextPending]}>
                    {med.taken ? '✓ Taken' : '⏳ Pending'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <VolunteerSosModal
        isOpen={isSosModalOpen || Boolean(activeSos)}
        onClose={() => setIsSosModalOpen(false)}
      />

      <VolunteerMedicineManagerModal
        isOpen={isMedModalOpen}
        onClose={() => setIsMedModalOpen(false)}
      />

      <VolunteerCheckinScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      <VolunteerLocationTrackerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <VolunteerPairingView
        isOpen={isPairingModalOpen}
        onClose={() => setIsPairingModalOpen(false)}
      />

      <VolunteerAddElderModal
        isOpen={isAddElderModalOpen}
        onClose={() => setIsAddElderModalOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  criticalSosBanner: {
    backgroundColor: '#DC2626',
    borderRadius: 18,
    padding: 16,
    borderWidth: 3,
    borderColor: '#991B1B',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  sosBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sosBannerIcon: {
    fontSize: 34,
    marginRight: 10,
  },
  sosBannerTextGroup: {
    flex: 1,
  },
  sosBannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sosBannerSubtitle: {
    color: '#FEE2E2',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '600',
  },
  sosBannerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  sosViewBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  sosViewBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '900',
  },
  sosCallBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  sosCallBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pinSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 2,
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  pinCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pinSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  pinLiveStatus: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pinLiveStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  pinInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: 2,
  },
  pinConnectBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  pinConnectBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  pinConnectBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pinStatusMsg: {
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  pinStatusMsgSuccess: {
    backgroundColor: '#DCFCE7',
  },
  pinStatusMsgError: {
    backgroundColor: '#FEE2E2',
  },
  pinStatusMsgText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pinStatusSuccessText: {
    color: '#15803D',
  },
  pinStatusErrorText: {
    color: '#991B1B',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  addElderSmallBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addElderSmallBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  elderScroll: {
    flexDirection: 'row',
  },
  elderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    gap: 8,
  },
  elderChipSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  elderChipAvatar: {
    fontSize: 24,
  },
  elderChipName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  elderChipNameSelected: {
    color: '#1D4ED8',
  },
  elderChipRel: {
    fontSize: 11,
    color: '#64748B',
  },
  elderStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  elderStatusTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  elderAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  elderAvatarText: {
    fontSize: 30,
  },
  elderInfoGroup: {
    flex: 1,
  },
  elderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  elderMainName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  safeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  safeBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#15803D',
  },
  elderSubDetail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  elderLocationDetail: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  statusMetricsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#CBD5E1',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionGridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'flex-start',
    minHeight: 100,
    justifyContent: 'space-between',
  },
  actionCall: {
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
  },
  actionPing: {
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
  },
  actionMeds: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  actionSchedule: {
    borderLeftWidth: 4,
    borderLeftColor: '#9333EA',
  },
  actionGridIcon: {
    fontSize: 24,
  },
  actionGridTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 2,
  },
  actionGridSub: {
    fontSize: 11,
    color: '#64748B',
  },
  alertCountBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  alertCountText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  emptyFeedText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 14,
  },
  alertsList: {
    gap: 8,
  },
  alertItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  alertItemActive: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  alertItemSos: {
    backgroundColor: '#FEF2F2',
    borderColor: '#DC2626',
  },
  alertItemEmoji: {
    fontSize: 22,
  },
  alertItemDetails: {
    flex: 1,
  },
  alertItemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertItemType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillActive: {
    backgroundColor: '#FEE2E2',
  },
  statusPillResolved: {
    backgroundColor: '#DCFCE7',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusPillTextActive: {
    color: '#991B1B',
  },
  statusPillTextResolved: {
    color: '#15803D',
  },
  alertItemNotes: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  alertItemTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  alertActionButtons: {
    flexDirection: 'column',
    gap: 4,
  },
  ackBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  ackBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  resolveBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  resolveBtnOnly: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  resolveBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  linkActionText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  medsList: {
    gap: 8,
  },
  medItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  medThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#CBD5E1',
  },
  medItemInfo: {
    flex: 1,
  },
  medItemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  medItemTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  medStatusChip: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  medStatusChipTaken: {
    backgroundColor: '#DCFCE7',
  },
  medStatusChipPending: {
    backgroundColor: '#FEF3C7',
  },
  medStatusChipText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  medStatusChipTextTaken: {
    color: '#15803D',
  },
  medStatusChipTextPending: {
    color: '#B45309',
  },
});