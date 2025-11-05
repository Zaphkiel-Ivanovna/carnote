/**
 * useInspections Hook
 * Custom hook for managing Inspection state
 */

import { useState, useEffect, useCallback } from 'react';
import { InspectionRepository } from '../repositories';
import { InspectionService } from '../services';
import type { Inspection, CreateInspectionInput, UpdateInspectionInput, InspectionWithUrgency } from '../types';

export interface UseInspectionsReturn {
  inspections: Inspection[];
  loading: boolean;
  error: string | null;
  create: (data: CreateInspectionInput) => Promise<Inspection>;
  update: (id: string, data: UpdateInspectionInput) => Promise<Inspection>;
  delete: (id: string) => Promise<void>;
  getById: (id: string) => Inspection | undefined;
  getByVehicleId: (vehicleId: string) => Inspection[];
  getWithUrgency: (vehicleId: string) => Promise<InspectionWithUrgency[]>;
  refresh: () => Promise<void>;
}

export function useInspections(vehicleId?: string): UseInspectionsReturn {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInspections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = vehicleId
        ? await InspectionRepository.getByVehicleId(vehicleId)
        : await InspectionRepository.getAll();
      setInspections(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load inspections';
      setError(message);
      console.error('Error loading inspections:', err);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    loadInspections();
  }, [loadInspections]);

  const create = useCallback(async (data: CreateInspectionInput): Promise<Inspection> => {
    try {
      setError(null);

      // Validate data
      const validationErrors = InspectionService.validate(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const newInspection = await InspectionRepository.create(data);
      setInspections(prev => [...prev, newInspection]);
      return newInspection;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create inspection';
      setError(message);
      throw err;
    }
  }, []);

  const update = useCallback(async (id: string, data: UpdateInspectionInput): Promise<Inspection> => {
    try {
      setError(null);

      // Validate data
      const validationErrors = InspectionService.validate(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const updatedInspection = await InspectionRepository.update(id, data);
      setInspections(prev => prev.map(i => i.id === id ? updatedInspection : i));
      return updatedInspection;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update inspection';
      setError(message);
      throw err;
    }
  }, []);

  const deleteInspection = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await InspectionRepository.delete(id);
      setInspections(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete inspection';
      setError(message);
      throw err;
    }
  }, []);

  const getById = useCallback((id: string): Inspection | undefined => {
    return inspections.find(i => i.id === id);
  }, [inspections]);

  const getByVehicleId = useCallback((vId: string): Inspection[] => {
    return inspections.filter(i => i.vehicleId === vId);
  }, [inspections]);

  const getWithUrgency = useCallback(async (vId: string): Promise<InspectionWithUrgency[]> => {
    return await InspectionService.getAllWithUrgency(vId);
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    await loadInspections();
  }, [loadInspections]);

  return {
    inspections,
    loading,
    error,
    create,
    update,
    delete: deleteInspection,
    getById,
    getByVehicleId,
    getWithUrgency,
    refresh,
  };
}
