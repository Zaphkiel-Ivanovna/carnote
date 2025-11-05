/**
 * ScreenContainer Component
 * Provides consistent background colors for all screens based on theme
 */

import React from 'react';
import { View, ViewProps } from 'react-native';
import { useAppTheme } from '../../contexts/app-theme-context';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
}

export function ScreenContainer({ children, style, ...props }: ScreenContainerProps) {
  const { isDark } = useAppTheme();

  const backgroundColor = isDark ? '#000000' : '#F2F2F7'; // iOS native backgrounds

  return (
    <View style={[{ flex: 1, backgroundColor }, style]} {...props}>
      {children}
    </View>
  );
}
