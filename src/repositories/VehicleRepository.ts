/**
 * Vehicle Repository
 * Handles data access for Vehicle entities
 */

import { AsyncStorageRepository } from './AsyncStorageRepository';
import type { Vehicle } from '../types';

class VehicleRepositoryClass extends AsyncStorageRepository<Vehicle> {
  constructor() {
    super('vehicles');
  }

  /**
   * Find vehicle by license plate
   */
  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    try {
      const vehicles = await this.getAll();
      return vehicles.find(v => v.licensePlate === licensePlate) || null;
    } catch (error) {
      console.error('Error finding vehicle by license plate:', error);
      return null;
    }
  }

  /**
   * Check if license plate already exists (for validation)
   */
  async licensePlateExists(licensePlate: string, excludeId?: string): Promise<boolean> {
    try {
      const vehicles = await this.getAll();
      return vehicles.some(v =>
        v.licensePlate === licensePlate && v.id !== excludeId
      );
    } catch (error) {
      console.error('Error checking license plate existence:', error);
      return false;
    }
  }
}

export const VehicleRepository = new VehicleRepositoryClass();
