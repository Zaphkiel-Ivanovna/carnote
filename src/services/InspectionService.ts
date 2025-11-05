/**
 * Inspection Service
 * Business logic for Inspection operations
 */

import { InspectionRepository } from '../repositories';
import { daysBetween } from '../utils';
import type {
  Inspection,
  CreateInspectionInput,
  UpdateInspectionInput,
  InspectionUrgency,
  InspectionWithUrgency,
} from '../types';

export class InspectionService {
  /**
   * Validate inspection data
   */
  static validate(data: CreateInspectionInput | UpdateInspectionInput): string[] {
    const errors: string[] = [];

    if ('vehicleId' in data && !data.vehicleId) {
      errors.push('Vehicle is required');
    }

    if ('datePerformed' in data && !data.datePerformed) {
      errors.push('Date performed is required');
    }

    if ('expiryDate' in data && !data.expiryDate) {
      errors.push('Expiry date is required');
    }

    if ('datePerformed' in data && 'expiryDate' in data && data.datePerformed && data.expiryDate) {
      const performed = new Date(data.datePerformed);
      const expiry = new Date(data.expiryDate);
      if (expiry <= performed) {
        errors.push('Expiry date must be after date performed');
      }
    }

    if ('cost' in data && data.cost !== undefined) {
      if (data.cost < 0) {
        errors.push('Cost cannot be negative');
      }
    }

    return errors;
  }

  /**
   * Calculate inspection urgency based on expiry date
   */
  static getUrgency(expiryDate: string): InspectionUrgency {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = daysBetween(now, expiry);

    if (daysUntilExpiry < 0) {
      return 'expired';
    }

    if (daysUntilExpiry <= 30) {
      return 'urgent';
    }

    if (daysUntilExpiry <= 90) {
      return 'warning';
    }

    return 'good';
  }

  /**
   * Get inspection with calculated urgency
   */
  static getWithUrgency(inspection: Inspection): InspectionWithUrgency {
    const now = new Date();
    const expiryDate = new Date(inspection.expiryDate);
    const daysUntilExpiry = daysBetween(now, expiryDate);
    const urgency = this.getUrgency(inspection.expiryDate);

    return {
      ...inspection,
      urgency,
      daysUntilExpiry,
    };
  }

  /**
   * Get all inspections for a vehicle with urgency
   */
  static async getAllWithUrgency(vehicleId: string): Promise<InspectionWithUrgency[]> {
    const inspections = await InspectionRepository.getByVehicleId(vehicleId);
    return inspections.map(i => this.getWithUrgency(i));
  }

  /**
   * Get inspections requiring attention (expiring soon or expired)
   */
  static async getRequiringAttention(): Promise<InspectionWithUrgency[]> {
    const allInspections = await InspectionRepository.getAll();
    const withUrgency = allInspections.map(i => this.getWithUrgency(i));

    return withUrgency.filter(i =>
      i.urgency === 'urgent' || i.urgency === 'expired'
    );
  }

  /**
   * Update inspection status based on expiry
   */
  static async updateExpiredInspections(): Promise<void> {
    const inspections = await InspectionRepository.getAll();
    const now = new Date();

    for (const inspection of inspections) {
      const expiryDate = new Date(inspection.expiryDate);

      // Update status to expired if past expiry date and currently marked as passed
      if (expiryDate < now && inspection.status === 'passed') {
        await InspectionRepository.update(inspection.id, { status: 'expired' });
      }
    }
  }

  /**
   * Get inspection statistics
   */
  static async getStats(): Promise<{
    total: number;
    passed: number;
    expired: number;
    expiringSoon: number;
  }> {
    const inspections = await InspectionRepository.getAll();
    const withUrgency = inspections.map(i => this.getWithUrgency(i));

    return {
      total: inspections.length,
      passed: inspections.filter(i => i.status === 'passed').length,
      expired: withUrgency.filter(i => i.urgency === 'expired').length,
      expiringSoon: withUrgency.filter(i => i.urgency === 'urgent').length,
    };
  }
}
