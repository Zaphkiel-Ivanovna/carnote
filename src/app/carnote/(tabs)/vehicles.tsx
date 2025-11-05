/**
 * Vehicles List Screen
 * Shows all vehicles with quick stats
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { Card, Button, Chip } from 'heroui-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVehicles } from '../../../hooks';
import { LoadingSpinner, EmptyState, ErrorView, ScreenContainer } from '../../../components/common';
import { formatNumber } from '../../../utils';

export default function VehiclesListScreen() {
  const router = useRouter();
  const { vehicles, loading, error, refresh } = useVehicles();
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
    return <LoadingSpinner message="Loading vehicles..." />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={refresh} />;
  }

  if (vehicles.length === 0) {
    return (
      <EmptyState
        icon="car-outline"
        title="No Vehicles"
        message="Add your first vehicle to get started"
        actionLabel="Add Vehicle"
        onAction={() => router.push('/carnote/vehicles/create')}
      />
    );
  }

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'electric':
        return 'bg-green-100 text-green-800';
      case 'hybrid':
        return 'bg-blue-100 text-blue-800';
      case 'diesel':
        return 'bg-yellow-100 text-yellow-800';
      case 'gasoline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 gap-3">
          {vehicles.map((vehicle) => (
            <Pressable
              key={vehicle.id}
              onPress={() => router.push(`/carnote/vehicles/${vehicle.id}` as any)}
            >
              <Card className="p-4">
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-foreground">
                      {vehicle.licensePlate}
                    </Text>
                    <Text className="text-base text-muted-foreground">
                      {vehicle.brand} {vehicle.model}
                    </Text>
                  </View>
                  <Chip
                    className={getFuelTypeColor(vehicle.fuelType)}
                    size="sm"
                  >
                    {vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1)}
                  </Chip>
                </View>

                <View className="flex-row gap-4 mt-3">
                  <View className="flex-1">
                    <Text className="text-xs text-muted-foreground">Year</Text>
                    <Text className="text-sm font-medium text-foreground">
                      {vehicle.year}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted-foreground">Mileage</Text>
                    <Text className="text-sm font-medium text-foreground">
                      {formatNumber(vehicle.currentMileage)} km
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted-foreground">
                      Oil Change
                    </Text>
                    <Text className="text-sm font-medium text-foreground">
                      {formatNumber(vehicle.oilChangeIntervalKm)} km
                    </Text>
                  </View>
                </View>

                {vehicle.notes && (
                  <Text className="text-sm text-muted-foreground mt-2" numberOfLines={2}>
                    {vehicle.notes}
                  </Text>
                )}
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View className="p-4 bg-background border-t border-border">
        <Button
          variant="primary"
          onPress={() => router.push('/carnote/vehicles/create')}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="ml-2 text-white font-medium">Add Vehicle</Text>
        </Button>
      </View>
    </ScreenContainer>
  );
}
