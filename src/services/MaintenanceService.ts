/**
 * Maintenance Service
 * Business logic for Maintenance operations
 */

import { MaintenanceRepository } from '../repositories';
import type {
  Maintenance,
  CreateMaintenanceInput,
  UpdateMaintenanceInput,
  MaintenanceType,
  MaintenanceStatus,
} from '../types';

export class MaintenanceService {
  /**
   * Validate maintenance data
   */
  static validate(data: CreateMaintenanceInput | UpdateMaintenanceInput): string[] {
    const errors: string[] = [];

    if ('vehicleId' in data && !data.vehicleId) {
      errors.push('Vehicle is required');
    }

    if ('title' in data && !data.title) {
      errors.push('Title is required');
    }

    if ('date' in data && !data.date) {
      errors.push('Date is required');
    }

    if ('mileage' in data && data.mileage !== undefined) {
      if (data.mileage < 0) {
        errors.push('Mileage cannot be negative');
      }
    }

    if ('cost' in data && data.cost !== undefined) {
      if (data.cost < 0) {
        errors.push('Cost cannot be negative');
      }
    }

    if ('parts' in data && data.parts) {
      data.parts.forEach((part, index) => {
        if (!part.name) {
          errors.push(`Part ${index + 1}: Name is required`);
        }
        if (part.quantity <= 0) {
          errors.push(`Part ${index + 1}: Quantity must be greater than 0`);
        }
        if (part.cost < 0) {
          errors.push(`Part ${index + 1}: Cost cannot be negative`);
        }
      });
    }

    return errors;
  }

  /**
   * Calculate total cost from parts
   */
  static calculateTotalCost(data: CreateMaintenanceInput | Maintenance): number {
    if (!data.parts || data.parts.length === 0) {
      return data.cost || 0;
    }

    const partsCost = data.parts.reduce((total, part) => {
      return total + (part.cost * part.quantity);
    }, 0);

    return partsCost + (data.cost || 0);
  }

  /**
   * Get maintenance statistics for a vehicle
   */
  static async getVehicleStats(vehicleId: string): Promise<{
    total: number;
    byType: Record<MaintenanceType, number>;
    byStatus: Record<MaintenanceStatus, number>;
    totalCost: number;
  }> {
    const maintenanceRecords = await MaintenanceRepository.getByVehicleId(vehicleId);

    const stats = {
      total: maintenanceRecords.length,
      byType: {} as Record<MaintenanceType, number>,
      byStatus: {} as Record<MaintenanceStatus, number>,
      totalCost: 0,
    };

    maintenanceRecords.forEach(m => {
      // Count by type
      stats.byType[m.type] = (stats.byType[m.type] || 0) + 1;

      // Count by status
      stats.byStatus[m.status] = (stats.byStatus[m.status] || 0) + 1;

      // Sum total cost
      if (m.status === 'completed') {
        stats.totalCost += this.calculateTotalCost(m);
      }
    });

    return stats;
  }

  /**
   * Filter maintenance records
   */
  static async filterRecords(filters: {
    vehicleId?: string;
    type?: MaintenanceType;
    status?: MaintenanceStatus;
    startDate?: string;
    endDate?: string;
  }): Promise<Maintenance[]> {
    let records: Maintenance[];

    if (filters.vehicleId) {
      records = await MaintenanceRepository.getByVehicleId(filters.vehicleId);
    } else {
      records = await MaintenanceRepository.getAll();
    }

    // Apply filters
    if (filters.type) {
      records = records.filter(m => m.type === filters.type);
    }

    if (filters.status) {
      records = records.filter(m => m.status === filters.status);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      records = records.filter(m => new Date(m.date) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      records = records.filter(m => new Date(m.date) <= endDate);
    }

    return records;
  }
}
