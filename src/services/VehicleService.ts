/**
 * Vehicle Service
 * Business logic for Vehicle operations
 */

import { VehicleRepository } from '../repositories';
import type { Vehicle, CreateVehicleInput, UpdateVehicleInput } from '../types';

export class VehicleService {
  /**
   * Validate vehicle data
   */
  static validate(data: CreateVehicleInput | UpdateVehicleInput): string[] {
    const errors: string[] = [];

    if ('licensePlate' in data && !data.licensePlate) {
      errors.push('License plate is required');
    }

    if ('brand' in data && !data.brand) {
      errors.push('Brand is required');
    }

    if ('model' in data && !data.model) {
      errors.push('Model is required');
    }

    if ('year' in data && data.year) {
      const currentYear = new Date().getFullYear();
      if (data.year < 1900 || data.year > currentYear + 1) {
        errors.push(`Year must be between 1900 and ${currentYear + 1}`);
      }
    }

    if ('oilChangeIntervalKm' in data && data.oilChangeIntervalKm !== undefined) {
      if (data.oilChangeIntervalKm <= 0) {
        errors.push('Oil change interval (km) must be greater than 0');
      }
    }

    if ('oilChangeIntervalMonths' in data && data.oilChangeIntervalMonths !== undefined) {
      if (data.oilChangeIntervalMonths <= 0) {
        errors.push('Oil change interval (months) must be greater than 0');
      }
    }

    if ('currentMileage' in data && data.currentMileage !== undefined) {
      if (data.currentMileage < 0) {
        errors.push('Current mileage cannot be negative');
      }
    }

    return errors;
  }

  /**
   * Check if license plate is unique
   */
  static async isLicensePlateUnique(licensePlate: string, excludeId?: string): Promise<boolean> {
    return !(await VehicleRepository.licensePlateExists(licensePlate, excludeId));
  }

  /**
   * Calculate total maintenance cost for a vehicle
   * (This will be implemented when we have access to maintenance data)
   */
  static async calculateTotalCost(vehicleId: string): Promise<number> {
    // TODO: Implement when maintenance and oil change repositories are available
    return 0;
  }

  /**
   * Get vehicle statistics
   */
  static async getVehicleStats(vehicleId: string): Promise<{
    totalOilChanges: number;
    totalMaintenance: number;
    totalInspections: number;
    totalCost: number;
  }> {
    // TODO: Implement when all repositories are available
    return {
      totalOilChanges: 0,
      totalMaintenance: 0,
      totalInspections: 0,
      totalCost: 0,
    };
  }
}
