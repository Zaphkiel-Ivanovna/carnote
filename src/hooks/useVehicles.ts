/**
 * useVehicles Hook
 * Custom hook for managing Vehicle state
 */

import { useState, useEffect, useCallback } from 'react';
import { VehicleRepository } from '../repositories';
import { VehicleService } from '../services';
import type { Vehicle, CreateVehicleInput, UpdateVehicleInput } from '../types';

export interface UseVehiclesReturn {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  create: (data: CreateVehicleInput) => Promise<Vehicle>;
  update: (id: string, data: UpdateVehicleInput) => Promise<Vehicle>;
  delete: (id: string) => Promise<void>;
  getById: (id: string) => Vehicle | undefined;
  refresh: () => Promise<void>;
}

export function useVehicles(): UseVehiclesReturn {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await VehicleRepository.getAll();
      setVehicles(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load vehicles';
      setError(message);
      console.error('Error loading vehicles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const create = useCallback(async (data: CreateVehicleInput): Promise<Vehicle> => {
    try {
      setError(null);

      // Validate data
      const validationErrors = VehicleService.validate(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Check license plate uniqueness
      const isUnique = await VehicleService.isLicensePlateUnique(data.licensePlate);
      if (!isUnique) {
        throw new Error('License plate already exists');
      }

      const newVehicle = await VehicleRepository.create(data);
      setVehicles(prev => [...prev, newVehicle]);
      return newVehicle;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create vehicle';
      setError(message);
      throw err;
    }
  }, []);

  const update = useCallback(async (id: string, data: UpdateVehicleInput): Promise<Vehicle> => {
    try {
      setError(null);

      // Validate data
      const validationErrors = VehicleService.validate(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Check license plate uniqueness if it's being updated
      if (data.licensePlate) {
        const isUnique = await VehicleService.isLicensePlateUnique(data.licensePlate, id);
        if (!isUnique) {
          throw new Error('License plate already exists');
        }
      }

      const updatedVehicle = await VehicleRepository.update(id, data);
      setVehicles(prev => prev.map(v => v.id === id ? updatedVehicle : v));
      return updatedVehicle;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update vehicle';
      setError(message);
      throw err;
    }
  }, []);

  const deleteVehicle = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await VehicleRepository.delete(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete vehicle';
      setError(message);
      throw err;
    }
  }, []);

  const getById = useCallback((id: string): Vehicle | undefined => {
    return vehicles.find(v => v.id === id);
  }, [vehicles]);

  const refresh = useCallback(async (): Promise<void> => {
    await loadVehicles();
  }, [loadVehicles]);

  return {
    vehicles,
    loading,
    error,
    create,
    update,
    delete: deleteVehicle,
    getById,
    refresh,
  };
}
