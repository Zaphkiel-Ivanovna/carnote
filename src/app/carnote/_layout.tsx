/**
 * CarNote Root Layout
 * Main navigation layout for the CarNote application
 */

import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { ThemeToggle } from '../../components/theme-toggle';
import { useAppTheme } from '../../contexts/app-theme-context';

export default function CarNoteLayout() {
  const { isDark } = useAppTheme();

  // Native colors for iOS and Android
  const colors = {
    light: {
      card: '#FFFFFF',
      text: '#000000',
    },
    dark: {
      card: '#1C1C1E',
      text: '#FFFFFF',
    },
  };

  const theme = isDark ? colors.dark : colors.light;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerRight: () => <ThemeToggle />,
        headerStyle: Platform.select({
          ios: {
            backgroundColor: theme.card,
          },
          android: {
            backgroundColor: theme.card,
          },
          default: {
            backgroundColor: theme.card,
          },
        }),
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen
        name="(tabs)/index"
        options={{
          title: 'Dashboard',
        }}
      />
      <Stack.Screen
        name="(tabs)/vehicles"
        options={{
          title: 'Vehicles',
        }}
      />
      <Stack.Screen
        name="(tabs)/services"
        options={{
          title: 'Services',
        }}
      />
      <Stack.Screen
        name="(tabs)/garages"
        options={{
          title: 'Garages',
        }}
      />
      <Stack.Screen
        name="vehicles/create"
        options={{
          title: 'Add Vehicle',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="garages/create"
        options={{
          title: 'Add Garage',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
