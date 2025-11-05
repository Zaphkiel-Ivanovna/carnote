/**
 * EmptyState Component
 * Displays a message when there's no data to show
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'heroui-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'information-circle-outline',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Ionicons name={icon} size={64} color="#9CA3AF" />
      <Text className="text-xl font-semibold text-foreground mt-4 text-center">
        {title}
      </Text>
      {message && (
        <Text className="text-base text-muted-foreground mt-2 text-center">
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          onPress={onAction}
          className="mt-6"
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
