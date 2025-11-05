/**
 * LoadingSpinner Component
 * Displays a loading indicator
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export function LoadingSpinner({ message, size = 'large' }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size={size} color="#3B82F6" />
      {message && (
        <Text className="text-base text-muted-foreground mt-4 text-center">
          {message}
        </Text>
      )}
    </View>
  );
}
