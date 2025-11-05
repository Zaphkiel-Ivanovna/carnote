/**
 * Create Garage Screen
 * Form for adding a new garage
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, Alert as RNAlert } from 'react-native';
import { Card, Button, TextField } from 'heroui-native';
import { useRouter } from 'expo-router';
import { useGarages } from '../../../hooks';
import { ScreenContainer } from '../../../components/common';
import type { CreateGarageInput } from '../../../types';

export default function CreateGarageScreen() {
  const router = useRouter();
  const { create } = useGarages();

  const [formData, setFormData] = useState<CreateGarageInput>({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    services: [],
    rating: 0,
    notes: '',
    isFavorite: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!formData.name) {
        RNAlert.alert('Error', 'Please enter a garage name');
        return;
      }

      await create(formData);
      RNAlert.alert('Success', 'Garage added successfully');
      router.back();
    } catch (error) {
      RNAlert.alert('Error', error instanceof Error ? error.message : 'Failed to create garage');
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
              Garage Information
            </Text>

            <View className="gap-3">
              <TextField isRequired>
                <TextField.Label>Name *</TextField.Label>
                <TextField.Input
                  value={formData.name}
                  onChangeText={(text: string) => setFormData({ ...formData, name: text })}
                  placeholder="AutoCare Center"
                />
              </TextField>

              <TextField>
                <TextField.Label>Address</TextField.Label>
                <TextField.Input
                  value={formData.address}
                  onChangeText={(text: string) => setFormData({ ...formData, address: text })}
                  placeholder="123 Main Street"
                />
              </TextField>

              <TextField>
                <TextField.Label>City</TextField.Label>
                <TextField.Input
                  value={formData.city}
                  onChangeText={(text: string) => setFormData({ ...formData, city: text })}
                  placeholder="Paris"
                />
              </TextField>

              <TextField>
                <TextField.Label>Postal Code</TextField.Label>
                <TextField.Input
                  value={formData.postalCode}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, postalCode: text })
                  }
                  placeholder="75001"
                />
              </TextField>

              <TextField>
                <TextField.Label>Phone</TextField.Label>
                <TextField.Input
                  value={formData.phone}
                  onChangeText={(text: string) => setFormData({ ...formData, phone: text })}
                  placeholder="+33 1 23 45 67 89"
                  keyboardType="phone-pad"
                />
              </TextField>

              <TextField>
                <TextField.Label>Email</TextField.Label>
                <TextField.Input
                  value={formData.email}
                  onChangeText={(text: string) => setFormData({ ...formData, email: text })}
                  placeholder="contact@garage.com"
                  keyboardType="email-address"
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
          {loading ? 'Creating...' : 'Create Garage'}
        </Button>
        <Button variant="ghost" onPress={() => router.back()}>
          Cancel
        </Button>
      </View>
    </ScreenContainer>
  );
}
