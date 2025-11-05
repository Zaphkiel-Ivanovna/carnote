/**
 * ErrorView Component
 * Displays an error message with optional retry action
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'heroui-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorViewProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorView({ error, onRetry }: ErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
      <Text className="text-xl font-semibold text-foreground mt-4 text-center">
        Something went wrong
      </Text>
      <Text className="text-base text-muted-foreground mt-2 text-center">
        {error}
      </Text>
      {onRetry && (
        <Button
          variant="primary"
          onPress={onRetry}
          className="mt-6"
        >
          Try Again
        </Button>
      )}
    </View>
  );
}
