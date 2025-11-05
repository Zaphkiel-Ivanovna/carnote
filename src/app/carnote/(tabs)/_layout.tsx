/**
 * CarNote Tabs Layout
 * Native bottom tab navigation for iOS and Android using NativeTabs
 */

import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon />
        <Label>Dashboard</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="vehicles">
        <Icon />
        <Label>Vehicles</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="services">
        <Icon />
        <Label>Services</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="garages">
        <Icon />
        <Label>Garages</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
