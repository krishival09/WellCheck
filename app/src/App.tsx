import React from 'react';
import { SafeAreaView, View, StyleSheet, StatusBar, Platform } from 'react-native';
import { AppProvider } from './context/AppContext';
import { MobileApp } from './mobile/MobileApp';

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
        <View style={styles.container}>
          <MobileApp />
        </View>
      </SafeAreaView>
    </AppProvider>
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