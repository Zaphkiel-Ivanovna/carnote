/**
 * Oil Change Repository
 * Handles data access for OilChange entities
 */

import { AsyncStorageRepository } from './AsyncStorageRepository';
import type { OilChange } from '../types';

class OilChangeRepositoryClass extends AsyncStorageRepository<OilChange> {
  constructor() {
    super('oilChanges');
  }

  /**
   * Get all oil changes for a specific vehicle
   */
  async getByVehicleId(vehicleId: string): Promise<OilChange[]> {
    try {
      const oilChanges = await this.getAll();
      return oilChanges
        .filter(oc => oc.vehicleId === vehicleId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error getting oil changes by vehicle:', error);
      return [];
    }
  }

  /**
   * Get latest oil change for a vehicle
   */
  async getLatestByVehicleId(vehicleId: string): Promise<OilChange | null> {
    try {
      const oilChanges = await this.getByVehicleId(vehicleId);
      return oilChanges[0] || null;
    } catch (error) {
      console.error('Error getting latest oil change:', error);
      return null;
    }
  }

  /**
   * Delete all oil changes for a vehicle
   */
  async deleteByVehicleId(vehicleId: string): Promise<void> {
    try {
      const allOilChanges = await this.getAll();
      const filtered = allOilChanges.filter(oc => oc.vehicleId !== vehicleId);
      await this.deleteAll();
      if (filtered.length > 0) {
        await this.createMany(filtered);
      }
    } catch (error) {
      console.error('Error deleting oil changes by vehicle:', error);
      throw error;
    }
  }
}

export const OilChangeRepository = new OilChangeRepositoryClass();
