/**
 * Create Vehicle Screen
 * Form for adding a new vehicle
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, Alert as RNAlert } from 'react-native';
import { Card, Button, TextField, Select } from 'heroui-native';
import { useRouter } from 'expo-router';
import { useVehicles } from '../../../hooks';
import { ScreenContainer } from '../../../components/common';
import type { CreateVehicleInput } from '../../../types';

export default function CreateVehicleScreen() {
  const router = useRouter();
  const { create } = useVehicles();

  const [formData, setFormData] = useState<CreateVehicleInput>({
    licensePlate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    fuelType: 'gasoline',
    oilChangeIntervalKm: 10000,
    oilChangeIntervalMonths: 12,
    currentMileage: 0,
    color: '',
    vin: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Basic validation
      if (!formData.licensePlate || !formData.brand || !formData.model) {
        RNAlert.alert('Error', 'Please fill in all required fields');
        return;
      }

      await create(formData);
      RNAlert.alert('Success', 'Vehicle added successfully');
      router.back();
    } catch (error) {
      RNAlert.alert('Error', error instanceof Error ? error.message : 'Failed to create vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        <View className="p-4 gap-4">
          <Card className="p-4">
            <Text className="text-xl font-bold text-foreground mb-4">
              Vehicle Information
            </Text>

            <View className="gap-3">
              <TextField isRequired>
                <TextField.Label>License Plate *</TextField.Label>
                <TextField.Input
                  value={formData.licensePlate}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, licensePlate: text })
                  }
                  placeholder="AB-123-CD"
                />
              </TextField>

              <TextField isRequired>
                <TextField.Label>Brand *</TextField.Label>
                <TextField.Input
                  value={formData.brand}
                  onChangeText={(text: string) => setFormData({ ...formData, brand: text })}
                  placeholder="Toyota"
                />
              </TextField>

              <TextField isRequired>
                <TextField.Label>Model *</TextField.Label>
                <TextField.Input
                  value={formData.model}
                  onChangeText={(text: string) => setFormData({ ...formData, model: text })}
                  placeholder="Corolla"
                />
              </TextField>

              <TextField>
                <TextField.Label>Year</TextField.Label>
                <TextField.Input
                  value={formData.year.toString()}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, year: parseInt(text) || 0 })
                  }
                  keyboardType="numeric"
                  placeholder="2020"
                />
              </TextField>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Fuel Type
                </Text>
                <Select
                  value={{ value: formData.fuelType, label: formData.fuelType.charAt(0).toUpperCase() + formData.fuelType.slice(1) }}
                  onValueChange={(option) => {
                    if (option && option.value) {
                      setFormData({ ...formData, fuelType: option.value as any });
                    }
                  }}
                >
                  <Select.Item value="gasoline" label="Gasoline" />
                  <Select.Item value="diesel" label="Diesel" />
                  <Select.Item value="electric" label="Electric" />
                  <Select.Item value="hybrid" label="Hybrid" />
                  <Select.Item value="other" label="Other" />
                </Select>
              </View>

              <TextField>
                <TextField.Label>Current Mileage (km)</TextField.Label>
                <TextField.Input
                  value={formData.currentMileage.toString()}
                  onChangeText={(text: string) =>
                    setFormData({
                      ...formData,
                      currentMileage: parseInt(text) || 0,
                    })
                  }
                  keyboardType="numeric"
                  placeholder="50000"
                />
              </TextField>

              <TextField>
                <TextField.Label>Oil Change Interval (km)</TextField.Label>
                <TextField.Input
                  value={formData.oilChangeIntervalKm.toString()}
                  onChangeText={(text: string) =>
                    setFormData({
                      ...formData,
                      oilChangeIntervalKm: parseInt(text) || 0,
                    })
                  }
                  keyboardType="numeric"
                  placeholder="10000"
                />
              </TextField>

              <TextField>
                <TextField.Label>Oil Change Interval (months)</TextField.Label>
                <TextField.Input
                  value={formData.oilChangeIntervalMonths.toString()}
                  onChangeText={(text: string) =>
                    setFormData({
                      ...formData,
                      oilChangeIntervalMonths: parseInt(text) || 0,
                    })
                  }
                  keyboardType="numeric"
                  placeholder="12"
                />
              </TextField>

              <TextField>
                <TextField.Label>Color</TextField.Label>
                <TextField.Input
                  value={formData.color}
                  onChangeText={(text: string) => setFormData({ ...formData, color: text })}
                  placeholder="Silver"
                />
              </TextField>

              <TextField>
                <TextField.Label>VIN</TextField.Label>
                <TextField.Input
                  value={formData.vin}
                  onChangeText={(text: string) => setFormData({ ...formData, vin: text })}
                  placeholder="1HGBH41JXMN109186"
                />
              </TextField>

              <TextField>
                <TextField.Label>Notes</TextField.Label>
                <TextField.Input
                  value={formData.notes}
                  onChangeText={(text: string) => setFormData({ ...formData, notes: text })}
                  placeholder="Additional notes..."
                  multiline
                  numberOfLines={3}
                />
              </TextField>
            </View>
          </Card>
        </View>
      </ScrollView>

      <View className="p-4 bg-background border-t border-border gap-2">
        <Button
          variant="primary"
          onPress={handleSubmit}
          isDisabled={loading}
        >
          {loading ? 'Creating...' : 'Create Vehicle'}
        </Button>
        <Button variant="ghost" onPress={() => router.back()}>
          Cancel
        </Button>
      </View>
    </ScreenContainer>
  );
}
