/**
 * Inspection Repository
 * Handles data access for Inspection entities
 */

import { AsyncStorageRepository } from './AsyncStorageRepository';
import type { Inspection } from '../types';

class InspectionRepositoryClass extends AsyncStorageRepository<Inspection> {
  constructor() {
    super('inspections');
  }

  /**
   * Get all inspections for a specific vehicle
   */
  async getByVehicleId(vehicleId: string): Promise<Inspection[]> {
    try {
      const inspections = await this.getAll();
      return inspections
        .filter(i => i.vehicleId === vehicleId)
        .sort((a, b) => new Date(b.datePerformed).getTime() - new Date(a.datePerformed).getTime());
    } catch (error) {
      console.error('Error getting inspections by vehicle:', error);
      return [];
    }
  }

  /**
   * Get latest valid inspection for a vehicle
   */
  async getLatestByVehicleId(vehicleId: string): Promise<Inspection | null> {
    try {
      const inspections = await this.getByVehicleId(vehicleId);
      return inspections[0] || null;
    } catch (error) {
      console.error('Error getting latest inspection:', error);
      return null;
    }
  }

  /**
   * Get inspections expiring within N days
   */
  async getExpiringSoon(days: number): Promise<Inspection[]> {
    try {
      const inspections = await this.getAll();
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      return inspections.filter(i => {
        const expiryDate = new Date(i.expiryDate);
        return expiryDate >= now && expiryDate <= futureDate && i.status === 'passed';
      });
    } catch (error) {
      console.error('Error getting expiring inspections:', error);
      return [];
    }
  }

  /**
   * Delete all inspections for a vehicle
   */
  async deleteByVehicleId(vehicleId: string): Promise<void> {
    try {
      const allInspections = await this.getAll();
      const filtered = allInspections.filter(i => i.vehicleId !== vehicleId);
      await this.deleteAll();
      if (filtered.length > 0) {
        await this.createMany(filtered);
      }
    } catch (error) {
      console.error('Error deleting inspections by vehicle:', error);
      throw error;
    }
  }
}

export const InspectionRepository = new InspectionRepositoryClass();
