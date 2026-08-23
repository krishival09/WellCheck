import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React from 'react';
import { Loader2 } from 'lucide-react-native';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading live Firestore data...' 
}) => {
  return (
    <View 
      id="loading-skeleton-container" 
      
    >
      {/* Skeleton Header */}
      <View >
        <View  />
        <View  />
      </View>

      {/* Skeleton Top Banner */}
      <View >
        <View  />
        <View >
          <View  />
          <View  />
        </View>
      </View>

      {/* Skeleton Main Card */}
      <View >
        <View >
          <View  />
          <View  />
        </View>
        <View  />
        <View  />
      </View>

      {/* Skeleton Feed List */}
      <View >
        <View  />
        <View  />
        <View  />
      </View>

      {/* Center Spinner Indicator */}
      <View >
        <Loader2  />
        <Text >{message}</Text>
        <Text >Syncing with Firestore collections</Text>
      </View>
    </View>
  );
};
