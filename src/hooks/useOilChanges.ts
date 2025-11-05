/**
 * useOilChanges Hook
 * Custom hook for managing Oil Change state
 */

import { useState, useEffect, useCallback } from 'react';
import { OilChangeRepository } from '../repositories';
import { OilChangeService } from '../services';
import type { OilChange, CreateOilChangeInput, UpdateOilChangeInput, OilChangeWithStatus } from '../types';

export interface UseOilChangesReturn {
  oilChanges: OilChange[];
  loading: boolean;
  error: string | null;
  create: (data: CreateOilChangeInput) => Promise<OilChange>;
  update: (id: string, data: UpdateOilChangeInput) => Promise<OilChange>;
  delete: (id: string) => Promise<void>;
  getById: (id: string) => OilChange | undefined;
  getByVehicleId: (vehicleId: string) => OilChange[];
  getWithStatus: (vehicleId: string) => Promise<OilChangeWithStatus[]>;
  refresh: () => Promise<void>;
}

export function useOilChanges(vehicleId?: string): UseOilChangesReturn {
  const [oilChanges, setOilChanges] = useState<OilChange[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOilChanges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = vehicleId
        ? await OilChangeRepository.getByVehicleId(vehicleId)
        : await OilChangeRepository.getAll();
      setOilChanges(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load oil changes';
      setError(message);
      console.error('Error loading oil changes:', err);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    loadOilChanges();
  }, [loadOilChanges]);

  const create = useCallback(async (data: CreateOilChangeInput): Promise<OilChange> => {
    try {
      setError(null);

      // Validate data
      const validationErrors = OilChangeService.validate(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Validate mileage progression
      const isValid = await OilChangeService.validateMileageProgression(
        data.vehicleId,
        data.mileage
      );
      if (!isValid) {
        throw new Error('Mileage cannot be less than previous oil changes');
      }

      // Calculate next change date and mileage
      const { nextChangeDate, nextChangeMileage } = await OilChangeService.calculateNextChange(
        data.vehicleId,
        data.date,
        data.mileage
      );

      const newOilChange = await OilChangeRepository.create({
        ...data,
        nextChangeDate,
        nextChangeMileage,
      });

      setOilChanges(prev => [...prev, newOilChange]);
      return newOilChange;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create oil change';
      setError(message);
      throw err;
    }
  }, []);

  const update = useCallback(async (id: string, data: UpdateOilChangeInput): Promise<OilChange> => {
    try {
      setError(null);

      // Validate data
      const validationErrors = OilChangeService.validate(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Get current oil change
      const current = await OilChangeRepository.getById(id);
      if (!current) {
        throw new Error('Oil change not found');
      }

      // Validate mileage progression if mileage is being updated
      if (data.mileage !== undefined) {
        const isValid = await OilChangeService.validateMileageProgression(
          current.vehicleId,
          data.mileage,
          id
        );
        if (!isValid) {
          throw new Error('Mileage cannot be less than previous oil changes');
        }
      }

      // Recalculate next change if date or mileage changed
      let updateData = { ...data };
      if (data.date || data.mileage) {
        const { nextChangeDate, nextChangeMileage } = await OilChangeService.calculateNextChange(
          current.vehicleId,
          data.date || current.date,
          data.mileage || current.mileage
        );
        updateData = {
          ...updateData,
          nextChangeDate,
          nextChangeMileage,
        };
      }

      const updatedOilChange = await OilChangeRepository.update(id, updateData);
      setOilChanges(prev => prev.map(oc => oc.id === id ? updatedOilChange : oc));
      return updatedOilChange;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update oil change';
      setError(message);
      throw err;
    }
  }, []);

  const deleteOilChange = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await OilChangeRepository.delete(id);
      setOilChanges(prev => prev.filter(oc => oc.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete oil change';
      setError(message);
      throw err;
    }
  }, []);

  const getById = useCallback((id: string): OilChange | undefined => {
    return oilChanges.find(oc => oc.id === id);
  }, [oilChanges]);

  const getByVehicleId = useCallback((vId: string): OilChange[] => {
    return oilChanges.filter(oc => oc.vehicleId === vId);
  }, [oilChanges]);

  const getWithStatus = useCallback(async (vId: string): Promise<OilChangeWithStatus[]> => {
    return await OilChangeService.getAllWithStatus(vId);
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    await loadOilChanges();
  }, [loadOilChanges]);

  return {
    oilChanges,
    loading,
    error,
    create,
    update,
    delete: deleteOilChange,
    getById,
    getByVehicleId,
    getWithStatus,
    refresh,
  };
}
