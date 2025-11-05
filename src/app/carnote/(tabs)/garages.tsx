/**
 * Garages List Screen
 * Shows all garages/service centers
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { Card, Button, Chip } from 'heroui-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGarages } from '../../../hooks';
import { LoadingSpinner, EmptyState, ErrorView, ScreenContainer } from '../../../components/common';

export default function GaragesListScreen() {
  const router = useRouter();
  const { garages, loading, error, refresh } = useGarages();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading garages..." />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={refresh} />;
  }

  if (garages.length === 0) {
    return (
      <EmptyState
        icon="business-outline"
        title="No Garages"
        message="Add your favorite service centers"
        actionLabel="Add Garage"
        onAction={() => router.push('/carnote/garages/create')}
      />
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 gap-3">
          {garages.map((garage) => (
            <Pressable
              key={garage.id}
              onPress={() => router.push(`/carnote/garages/${garage.id}` as any)}
            >
              <Card className="p-4">
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-lg font-bold text-foreground">
                        {garage.name}
                      </Text>
                      {garage.isFavorite && (
                        <Ionicons
                          name="star"
                          size={16}
                          color="#F59E0B"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </View>
                    {garage.city && (
                      <Text className="text-sm text-muted-foreground">
                        {garage.city}
                      </Text>
                    )}
                  </View>
                  {garage.rating && (
                    <Chip className="bg-blue-500 text-white" size="sm">
                      {garage.rating.toFixed(1)} ★
                    </Chip>
                  )}
                </View>

                {garage.phone && (
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="call" size={14} color="#6B7280" />
                    <Text className="text-sm text-muted-foreground ml-2">
                      {garage.phone}
                    </Text>
                  </View>
                )}

                <View className="flex-row flex-wrap gap-2 mt-2">
                  {garage.services.slice(0, 3).map((service) => (
                    <Chip key={service} size="sm" className="bg-gray-200">
                      {service.replace(/-/g, ' ')}
                    </Chip>
                  ))}
                  {garage.services.length > 3 && (
                    <Chip size="sm" className="bg-gray-300">
                      +{garage.services.length - 3}
                    </Chip>
                  )}
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View className="p-4 bg-background border-t border-border">
        <Button
          variant="primary"
          onPress={() => router.push('/carnote/garages/create')}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="ml-2 text-white font-medium">Add Garage</Text>
        </Button>
      </View>
    </ScreenContainer>
  );
}
