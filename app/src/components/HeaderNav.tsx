import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Smartphone, 
  Columns, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Pill, 
  KeyRound, 
  LayoutDashboard,
  CheckCircle,
  Clock,
  Loader2,
  BellOff,
  LogIn,
  HeartHandshake
} from 'lucide-react-native';
import { soundFx } from '../utils/audio';
import { SUPPORTED_LANGUAGES, speakText, TRANSLATIONS } from '../utils/speech';

export type ViewLayout = 'dual_live' | 'elder_solo' | 'volunteer_solo' | 'login_view';

interface HeaderNavProps {
  viewLayout: ViewLayout;
  setViewLayout: (layout: ViewLayout) => void;
  showTouchGrid: boolean;
  setShowTouchGrid: (show: boolean) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  viewLayout,
  setViewLayout,
}) => {
  const {
    setActiveRole,
    elderScreen,
    setElderScreen,
    volunteerScreen,
    setVolunteerScreen,
    isSimulationLoading,
    setIsSimulationLoading,
    isSimulationEmpty,
    setIsSimulationEmpty,
    currentUser,
    setIsAuthModalOpen,
    language,
    setLanguage,
    volunteerLanguage,
    setVolunteerLanguage,
  } = useApp();

  const [isMuted, setIsMuted] = React.useState(soundFx.getMuted());

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
  };

  const activeLang = viewLayout === 'volunteer_solo' ? volunteerLanguage : language;
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === activeLang);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>W</Text>
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandName}>WellCheck</Text>
              <Text style={styles.specTag}>SPEC v1.0</Text>
            </View>
            <Text style={styles.tagline}>Elder Safety & Caregiver Spec</Text>
          </View>
        </View>

        <TouchableOpacity onPress={toggleSound} style={styles.muteButton}>
          {isMuted ? <VolumeX size={20} color="#FFF" /> : <Volume2 size={20} color="#FFF" />}
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        <TouchableOpacity 
          onPress={() => setViewLayout('dual_live')}
          style={[styles.tab, viewLayout === 'dual_live' && styles.activeTab]}
        >
          <Columns size={16} color={viewLayout === 'dual_live' ? '#FFF' : '#FFF8'} />
          <Text style={styles.tabText}>Dual Live</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => { setViewLayout('elder_solo'); setActiveRole('elder'); }}
          style={[styles.tab, viewLayout === 'elder_solo' && styles.activeTab]}
        >
          <Smartphone size={16} color={viewLayout === 'elder_solo' ? '#FFF' : '#FFF8'} />
          <Text style={styles.tabText}>Elder Solo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => { setViewLayout('volunteer_solo'); setActiveRole('volunteer'); }}
          style={[styles.tab, viewLayout === 'volunteer_solo' && styles.activeTab]}
        >
          <LayoutDashboard size={16} color={viewLayout === 'volunteer_solo' ? '#FFF' : '#FFF8'} />
          <Text style={styles.tabText}>Volunteer Solo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A2B4C',
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderColor: '#1A2B4C',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#FF6B4A',
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 18,
  },
  specTag: {
    color: '#FFB84D',
    fontSize: 10,
    fontWeight: '900',
  },
  tagline: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },
  muteButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FF6B4A',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  tabText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
});
