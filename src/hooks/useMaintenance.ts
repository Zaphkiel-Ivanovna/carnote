/**
 * useMaintenance Hook
 * Custom hook for managing Maintenance state
 */

import { useState, useEffect, useCallback } from 'react';
import { MaintenanceRepository } from '../repositories';
import { MaintenanceService } from '../services';
import type { Maintenance, CreateMaintenanceInput, UpdateMaintenanceInput } from '../types';

export interface UseMaintenanceReturn {
  maintenance: Maintenance[];
  loading: boolean;
  error: string | null;
  create: (data: CreateMaintenanceInput) => Promise<Maintenance>;
  update: (id: string, data: UpdateMaintenanceInput) => Promise<Maintenance>;
  delete: (id: string) => Promise<void>;
  getById: (id: string) => Maintenance | undefined;
  getByVehicleId: (vehicleId: string) => Maintenance[];
  refresh: () => Promise<void>;
}

export function useMaintenance(vehicleId?: string): UseMaintenanceReturn {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMaintenance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = vehicleId
        ? await MaintenanceRepository.getByVehicleId(vehicleId)
        : await MaintenanceRepository.getAll();
      setMaintenance(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load maintenance records';
      setError(message);
      console.error('Error loading maintenance:', err);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    loadMaintenance();
  }, [loadMaintenance]);

  const create = useCallback(async (data: CreateMaintenanceInput): Promise<Maintenance> => {
    try {
      setError(null);

      // Validate data
      const validationErrors = MaintenanceService.validate(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const newMaintenance = await MaintenanceRepository.create(data);
      setMaintenance(prev => [...prev, newMaintenance]);
      return newMaintenance;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create maintenance record';
      setError(message);
      throw err;
    }
  }, []);

  const update = useCallback(async (id: string, data: UpdateMaintenanceInput): Promise<Maintenance> => {
    try {
      setError(null);

      // Validate data
      const validationErrors = MaintenanceService.validate(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const updatedMaintenance = await MaintenanceRepository.update(id, data);
      setMaintenance(prev => prev.map(m => m.id === id ? updatedMaintenance : m));
      return updatedMaintenance;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update maintenance record';
      setError(message);
      throw err;
    }
  }, []);

  const deleteMaintenance = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await MaintenanceRepository.delete(id);
      setMaintenance(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete maintenance record';
      setError(message);
      throw err;
    }
  }, []);

  const getById = useCallback((id: string): Maintenance | undefined => {
    return maintenance.find(m => m.id === id);
  }, [maintenance]);

  const getByVehicleId = useCallback((vId: string): Maintenance[] => {
    return maintenance.filter(m => m.vehicleId === vId);
  }, [maintenance]);

  const refresh = useCallback(async (): Promise<void> => {
    await loadMaintenance();
  }, [loadMaintenance]);

  return {
    maintenance,
    loading,
    error,
    create,
    update,
    delete: deleteMaintenance,
    getById,
    getByVehicleId,
    refresh,
  };
}
