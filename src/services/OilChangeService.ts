/**
 * Oil Change Service
 * Business logic for Oil Change operations including calculations
 */

import { OilChangeRepository, VehicleRepository } from '../repositories';
import { addMonths, daysBetween } from '../utils';
import type {
  OilChange,
  CreateOilChangeInput,
  UpdateOilChangeInput,
  OilChangeStatus,
  OilChangeWithStatus,
} from '../types';

export class OilChangeService {
  /**
   * Validate oil change data
   */
  static validate(data: CreateOilChangeInput | UpdateOilChangeInput): string[] {
    const errors: string[] = [];

    if ('vehicleId' in data && !data.vehicleId) {
      errors.push('Vehicle is required');
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

    return errors;
  }

  /**
   * Calculate next oil change date and mileage
   */
  static async calculateNextChange(
    vehicleId: string,
    currentDate: string,
    currentMileage: number
  ): Promise<{ nextChangeDate: string; nextChangeMileage: number }> {
    const vehicle = await VehicleRepository.getById(vehicleId);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Calculate next change date (add months from vehicle settings)
    const nextDate = addMonths(new Date(currentDate), vehicle.oilChangeIntervalMonths);

    // Calculate next change mileage (add km from vehicle settings)
    const nextMileage = currentMileage + vehicle.oilChangeIntervalKm;

    return {
      nextChangeDate: nextDate.toISOString(),
      nextChangeMileage: nextMileage,
    };
  }

  /**
   * Get oil change status based on current vehicle state
   */
  static async getOilChangeStatus(
    oilChange: OilChange,
    currentMileage: number
  ): Promise<OilChangeStatus> {
    const kmUntilDue = oilChange.nextChangeMileage - currentMileage;
    const now = new Date();
    const nextChangeDate = new Date(oilChange.nextChangeDate);
    const daysUntilDue = daysBetween(now, nextChangeDate);

    // Overdue if either condition is met
    if (kmUntilDue <= 0 || daysUntilDue <= 0) {
      return 'overdue';
    }

    // Due soon if within 1000km or 30 days
    if (kmUntilDue <= 1000 || daysUntilDue <= 30) {
      return 'due-soon';
    }

    return 'good';
  }

  /**
   * Get oil change with calculated status
   */
  static async getWithStatus(
    oilChange: OilChange,
    currentMileage: number
  ): Promise<OilChangeWithStatus> {
    const status = await this.getOilChangeStatus(oilChange, currentMileage);
    const now = new Date();
    const nextChangeDate = new Date(oilChange.nextChangeDate);
    const daysUntilDue = daysBetween(now, nextChangeDate);
    const kmUntilDue = oilChange.nextChangeMileage - currentMileage;

    return {
      ...oilChange,
      status,
      daysUntilDue,
      kmUntilDue,
    };
  }

  /**
   * Get all oil changes for a vehicle with status
   */
  static async getAllWithStatus(vehicleId: string): Promise<OilChangeWithStatus[]> {
    const vehicle = await VehicleRepository.getById(vehicleId);
    if (!vehicle) {
      return [];
    }

    const oilChanges = await OilChangeRepository.getByVehicleId(vehicleId);
    return Promise.all(
      oilChanges.map(oc => this.getWithStatus(oc, vehicle.currentMileage))
    );
  }

  /**
   * Validate mileage progression (mileage should not decrease)
   */
  static async validateMileageProgression(
    vehicleId: string,
    newMileage: number,
    excludeId?: string
  ): Promise<boolean> {
    const oilChanges = await OilChangeRepository.getByVehicleId(vehicleId);
    const filteredOilChanges = excludeId
      ? oilChanges.filter(oc => oc.id !== excludeId)
      : oilChanges;

    if (filteredOilChanges.length === 0) {
      return true;
    }

    const latestMileage = Math.max(...filteredOilChanges.map(oc => oc.mileage));
    return newMileage >= latestMileage;
  }
}
