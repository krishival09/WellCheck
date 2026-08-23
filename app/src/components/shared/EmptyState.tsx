import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React from 'react';
import { BellOff, Pill, ShieldCheck, Plus } from 'lucide-react-native';

interface EmptyStateProps {
  type: 'alerts' | 'medicines' | 'general';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'alerts':
        return <BellOff  />;
      case 'medicines':
        return <Pill  />;
      default:
        return <ShieldCheck  />;
    }
  };

  const defaultTitle = 
    type === 'alerts' 
      ? 'No Active Alerts' 
      : type === 'medicines' 
      ? 'No Medicine Reminders Set' 
      : 'All Clear';

  const defaultDesc = 
    type === 'alerts'
      ? 'Everything is quiet and safe. Past events will show up here.'
      : type === 'medicines'
      ? 'Add daily prescriptions and vitamins to track adherence.'
      : 'No pending items at this time.';

  return (
    <View 
      id={`empty-state-${type}`}
      
    >
      <View >
        {getIcon()}
      </View>
      <Text >
        {title || defaultTitle}
      </Text>
      <Text >
        {description || defaultDesc}
      </Text>
      {actionText && onAction && (
        <TouchableOpacity
          onClick={onAction}
          
        >
          <Plus  />
          <Text>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
