/**
 * Maintenance Repository
 * Handles data access for Maintenance entities
 */

import { AsyncStorageRepository } from './AsyncStorageRepository';
import type { Maintenance, MaintenanceStatus } from '../types';

class MaintenanceRepositoryClass extends AsyncStorageRepository<Maintenance> {
  constructor() {
    super('maintenance');
  }

  /**
   * Get all maintenance records for a specific vehicle
   */
  async getByVehicleId(vehicleId: string): Promise<Maintenance[]> {
    try {
      const maintenance = await this.getAll();
      return maintenance
        .filter(m => m.vehicleId === vehicleId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error getting maintenance by vehicle:', error);
      return [];
    }
  }

  /**
   * Get maintenance records by status
   */
  async getByStatus(status: MaintenanceStatus): Promise<Maintenance[]> {
    try {
      const maintenance = await this.getAll();
      return maintenance.filter(m => m.status === status);
    } catch (error) {
      console.error('Error getting maintenance by status:', error);
      return [];
    }
  }

  /**
   * Delete all maintenance records for a vehicle
   */
  async deleteByVehicleId(vehicleId: string): Promise<void> {
    try {
      const allMaintenance = await this.getAll();
      const filtered = allMaintenance.filter(m => m.vehicleId !== vehicleId);
      await this.deleteAll();
      if (filtered.length > 0) {
        await this.createMany(filtered);
      }
    } catch (error) {
      console.error('Error deleting maintenance by vehicle:', error);
      throw error;
    }
  }
}

export const MaintenanceRepository = new MaintenanceRepositoryClass();
