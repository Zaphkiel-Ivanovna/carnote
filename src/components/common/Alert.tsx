/**
 * Alert Component
 * Toast-style alert for user feedback
 */

import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  visible: boolean;
  type: AlertType;
  message: string;
  duration?: number;
  onDismiss?: () => void;
}

const alertConfig = {
  success: {
    icon: 'checkmark-circle' as const,
    bgColor: 'bg-green-500',
    iconColor: '#ffffff',
  },
  error: {
    icon: 'close-circle' as const,
    bgColor: 'bg-red-500',
    iconColor: '#ffffff',
  },
  warning: {
    icon: 'warning' as const,
    bgColor: 'bg-yellow-500',
    iconColor: '#ffffff',
  },
  info: {
    icon: 'information-circle' as const,
    bgColor: 'bg-blue-500',
    iconColor: '#ffffff',
  },
};

export function Alert({
  visible,
  type,
  message,
  duration = 3000,
  onDismiss,
}: AlertProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideAlert();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideAlert();
    }
  }, [visible]);

  const hideAlert = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  };

  if (!visible) {
    return null;
  }

  const config = alertConfig[type];

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        zIndex: 9999,
      }}
    >
      <View className={`${config.bgColor} rounded-lg p-4 flex-row items-center shadow-lg`}>
        <Ionicons name={config.icon} size={24} color={config.iconColor} />
        <Text className="text-white text-base font-medium ml-3 flex-1">
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
