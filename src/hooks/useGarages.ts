/**
 * useGarages Hook
 * Custom hook for managing Garage state
 */

import { useState, useEffect, useCallback } from 'react';
import { GarageRepository } from '../repositories';
import { GarageService } from '../services';
import type { Garage, CreateGarageInput, UpdateGarageInput } from '../types';

export interface UseGaragesReturn {
  garages: Garage[];
  loading: boolean;
  error: string | null;
  create: (data: CreateGarageInput) => Promise<Garage>;
  update: (id: string, data: UpdateGarageInput) => Promise<Garage>;
  delete: (id: string) => Promise<void>;
  getById: (id: string) => Garage | undefined;
  getFavorites: () => Garage[];
  refresh: () => Promise<void>;
}

export function useGarages(): UseGaragesReturn {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadGarages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GarageRepository.getAll();
      setGarages(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load garages';
      setError(message);
      console.error('Error loading garages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGarages();
  }, [loadGarages]);

  const create = useCallback(async (data: CreateGarageInput): Promise<Garage> => {
    try {
      setError(null);

      // Validate data
      const validationErrors = GarageService.validate(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const newGarage = await GarageRepository.create(data);
      setGarages(prev => [...prev, newGarage]);
      return newGarage;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create garage';
      setError(message);
      throw err;
    }
  }, []);

  const update = useCallback(async (id: string, data: UpdateGarageInput): Promise<Garage> => {
    try {
      setError(null);

      // Validate data
      const validationErrors = GarageService.validate(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const updatedGarage = await GarageRepository.update(id, data);
      setGarages(prev => prev.map(g => g.id === id ? updatedGarage : g));
      return updatedGarage;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update garage';
      setError(message);
      throw err;
    }
  }, []);

  const deleteGarage = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await GarageRepository.delete(id);
      setGarages(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete garage';
      setError(message);
      throw err;
    }
  }, []);

  const getById = useCallback((id: string): Garage | undefined => {
    return garages.find(g => g.id === id);
  }, [garages]);

  const getFavorites = useCallback((): Garage[] => {
    return garages.filter(g => g.isFavorite);
  }, [garages]);

  const refresh = useCallback(async (): Promise<void> => {
    await loadGarages();
  }, [loadGarages]);

  return {
    garages,
    loading,
    error,
    create,
    update,
    delete: deleteGarage,
    getById,
    getFavorites,
    refresh,
  };
}
