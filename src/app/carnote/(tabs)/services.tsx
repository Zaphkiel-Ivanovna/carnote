/**
 * Services Screen
 * Shows all services (oil changes, maintenance, inspections)
 */

import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, Tabs } from 'heroui-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../../components/common';

export default function ServicesScreen() {
  const [activeTab, setActiveTab] = useState('oil-changes');

  return (
    <ScreenContainer>
      <View className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="oil-changes">
              <Ionicons name="water" size={16} />
              <Text className="ml-2">Oil Changes</Text>
            </Tabs.Trigger>
            <Tabs.Trigger value="maintenance">
              <Ionicons name="construct" size={16} />
              <Text className="ml-2">Maintenance</Text>
            </Tabs.Trigger>
            <Tabs.Trigger value="inspections">
              <Ionicons name="checkmark-circle" size={16} />
              <Text className="ml-2">Inspections</Text>
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="oil-changes">
            <ScrollView className="flex-1">
              <Card className="p-4 mt-4">
                <Text className="text-base text-muted-foreground text-center">
                  Oil changes list will be shown here
                </Text>
              </Card>
            </ScrollView>
          </Tabs.Content>

          <Tabs.Content value="maintenance">
            <ScrollView className="flex-1">
              <Card className="p-4 mt-4">
                <Text className="text-base text-muted-foreground text-center">
                  Maintenance records will be shown here
                </Text>
              </Card>
            </ScrollView>
          </Tabs.Content>

          <Tabs.Content value="inspections">
            <ScrollView className="flex-1">
              <Card className="p-4 mt-4">
                <Text className="text-base text-muted-foreground text-center">
                  Inspections will be shown here
                </Text>
              </Card>
            </ScrollView>
          </Tabs.Content>
        </Tabs>
      </View>
    </ScreenContainer>
  );
}
