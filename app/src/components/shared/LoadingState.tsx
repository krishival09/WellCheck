import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading WellCheck...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0F172A" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginVertical: 16,
  },
  text: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },
});