/**
 * Home Dashboard Screen
 * Main dashboard with stats, alerts, and quick actions
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { Card, Button, Chip, Divider } from 'heroui-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVehicles, useOilChanges, useMaintenance, useInspections } from '../../../hooks';
import { LoadingSpinner, EmptyState, ErrorView, ScreenContainer } from '../../../components/common';
import { SampleDataService } from '../../../services/SampleDataService';
import { OilChangeService, InspectionService } from '../../../services';
import { formatCurrency, daysBetween } from '../../../utils';
import type { OilChangeWithStatus, InspectionWithUrgency } from '../../../types';

export default function HomeScreen() {
  const router = useRouter();
  const { vehicles, loading: vehiclesLoading, error: vehiclesError, refresh: refreshVehicles } = useVehicles();
  const { oilChanges, refresh: refreshOilChanges } = useOilChanges();
  const { maintenance, refresh: refreshMaintenance } = useMaintenance();
  const { inspections, refresh: refreshInspections } = useInspections();

  const [refreshing, setRefreshing] = useState(false);
  const [oilChangeAlerts, setOilChangeAlerts] = useState<OilChangeWithStatus[]>([]);
  const [inspectionAlerts, setInspectionAlerts] = useState<InspectionWithUrgency[]>([]);

  useEffect(() => {
    loadAlerts();
  }, [oilChanges, inspections, vehicles]);

  const loadAlerts = async () => {
    // Get oil changes requiring attention
    const oilChangeAlertsTemp: OilChangeWithStatus[] = [];
    for (const vehicle of vehicles) {
      const vehicleOilChanges = await OilChangeService.getAllWithStatus(vehicle.id);
      const alertOilChanges = vehicleOilChanges.filter(
        oc => oc.status === 'overdue' || oc.status === 'due-soon'
      );
      oilChangeAlertsTemp.push(...alertOilChanges);
    }
    setOilChangeAlerts(oilChangeAlertsTemp);

    // Get inspections requiring attention
    const inspectionAlertsTemp = await InspectionService.getRequiringAttention();
    setInspectionAlerts(inspectionAlertsTemp);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshVehicles(),
        refreshOilChanges(),
        refreshMaintenance(),
        refreshInspections(),
      ]);
      await loadAlerts();
    } finally {
      setRefreshing(false);
    }
  };

  const initializeSampleData = async () => {
    try {
      await SampleDataService.initializeSampleData();
      await onRefresh();
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  };

  if (vehiclesLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (vehiclesError) {
    return <ErrorView error={vehiclesError} onRetry={refreshVehicles} />;
  }

  if (vehicles.length === 0) {
    return (
      <EmptyState
        icon="car-outline"
        title="No Vehicles Yet"
        message="Add your first vehicle to start tracking maintenance"
        actionLabel="Add Vehicle"
        onAction={() => router.push('/carnote/vehicles/create')}
      />
    );
  }

  const totalMaintenanceCost = maintenance
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + m.cost, 0);

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <View className="p-4 gap-4">
        {/* Welcome Header */}
        <View className="mb-2">
          <Text className="text-3xl font-bold text-foreground">CarNote</Text>
          <Text className="text-base text-muted-foreground mt-1">
            Vehicle Maintenance Tracker
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row gap-3">
          <Card className="flex-1 p-4">
            <View className="items-center">
              <Ionicons name="car" size={32} color="#3B82F6" />
              <Text className="text-2xl font-bold text-foreground mt-2">
                {vehicles.length}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {vehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
              </Text>
            </View>
          </Card>

          <Card className="flex-1 p-4">
            <View className="items-center">
              <Ionicons name="construct" size={32} color="#10B981" />
              <Text className="text-2xl font-bold text-foreground mt-2">
                {maintenance.filter(m => m.status === 'completed').length}
              </Text>
              <Text className="text-sm text-muted-foreground">Services</Text>
            </View>
          </Card>

          <Card className="flex-1 p-4">
            <View className="items-center">
              <Ionicons name="cash" size={32} color="#F59E0B" />
              <Text className="text-2xl font-bold text-foreground mt-2">
                {formatCurrency(totalMaintenanceCost)}
              </Text>
              <Text className="text-sm text-muted-foreground">Spent</Text>
            </View>
          </Card>
        </View>

        {/* Oil Change Alerts */}
        {oilChangeAlerts.length > 0 && (
          <Card className="p-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Ionicons name="water" size={24} color="#EF4444" />
                <Text className="text-lg font-semibold text-foreground ml-2">
                  Oil Change Alerts
                </Text>
              </View>
              <Chip className="bg-red-500 text-white" size="sm">{oilChangeAlerts.length}</Chip>
            </View>
            <Divider className="mb-3" />
            {oilChangeAlerts.slice(0, 3).map((oc) => {
              const vehicle = vehicles.find(v => v.id === oc.vehicleId);
              return (
                <View key={oc.id} className="mb-2">
                  <Text className="text-base font-medium text-foreground">
                    {vehicle?.licensePlate} - {vehicle?.brand} {vehicle?.model}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {oc.status === 'overdue'
                      ? 'Overdue'
                      : `Due in ${oc.daysUntilDue} days / ${oc.kmUntilDue} km`}
                  </Text>
                </View>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.push('/carnote/(tabs)/services')}
              className="mt-2"
            >
              View All
            </Button>
          </Card>
        )}

        {/* Inspection Alerts */}
        {inspectionAlerts.length > 0 && (
          <Card className="p-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#F59E0B" />
                <Text className="text-lg font-semibold text-foreground ml-2">
                  Inspection Alerts
                </Text>
              </View>
              <Chip className="bg-yellow-500 text-white" size="sm">{inspectionAlerts.length}</Chip>
            </View>
            <Divider className="mb-3" />
            {inspectionAlerts.slice(0, 3).map((inspection) => {
              const vehicle = vehicles.find(v => v.id === inspection.vehicleId);
              return (
                <View key={inspection.id} className="mb-2">
                  <Text className="text-base font-medium text-foreground">
                    {vehicle?.licensePlate} - {vehicle?.brand} {vehicle?.model}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {inspection.urgency === 'expired'
                      ? 'Expired'
                      : `Expires in ${inspection.daysUntilExpiry} days`}
                  </Text>
                </View>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.push('/carnote/(tabs)/services')}
              className="mt-2"
            >
              View All
            </Button>
          </Card>
        )}

        {/* No Alerts */}
        {oilChangeAlerts.length === 0 && inspectionAlerts.length === 0 && (
          <Card className="p-6">
            <View className="items-center">
              <Ionicons name="checkmark-circle" size={48} color="#10B981" />
              <Text className="text-lg font-semibold text-foreground mt-2">
                All Good!
              </Text>
              <Text className="text-base text-muted-foreground mt-1 text-center">
                No maintenance or inspections require immediate attention
              </Text>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="p-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Quick Actions
          </Text>
          <View className="gap-2">
            <Button
              variant="primary"
              onPress={() => router.push('/carnote/vehicles/create')}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="ml-2 text-white font-medium">Add Vehicle</Text>
            </Button>
            <Button
              variant="secondary"
              onPress={() => router.push('/carnote/(tabs)/services')}
            >
              <Ionicons name="construct" size={20} />
              <Text className="ml-2 font-medium">Log Service</Text>
            </Button>
          </View>
        </Card>

        {/* Dev Tools - Remove in production */}
        <Card className="p-4 bg-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-2">
            Development Tools
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={initializeSampleData}
          >
            Initialize Sample Data
          </Button>
        </Card>
      </View>
    </ScrollView>
    </ScreenContainer>
  );
}
