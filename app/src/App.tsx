import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './context/AppContext';
import { MobileApp } from './mobile/MobileApp';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" translucent={false} />
          <View style={styles.container}>
            <MobileApp />
          </View>
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    width: '100%',
    ...Platform.select({
      web: {
        maxWidth: 448, // max-w-md on web
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
      } as any,
      default: {},
    }),
  },
});