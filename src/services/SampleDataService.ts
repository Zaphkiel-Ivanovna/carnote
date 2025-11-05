/**
 * Sample Data Service
 * Provides sample data for testing and demonstration
 */

import {
  VehicleRepository,
  OilChangeRepository,
  MaintenanceRepository,
  InspectionRepository,
  GarageRepository,
} from '../repositories';
import { addMonths, addDays, getCurrentTimestamp } from '../utils';
import type {
  CreateVehicleInput,
  CreateOilChangeInput,
  CreateMaintenanceInput,
  CreateInspectionInput,
  CreateGarageInput,
  OilChange,
} from '../types';

export class SampleDataService {
  /**
   * Initialize sample data
   */
  static async initializeSampleData(): Promise<void> {
    try {
      // Check if data already exists
      const existingVehicles = await VehicleRepository.getAll();
      if (existingVehicles.length > 0) {
        console.log('Sample data already exists');
        return;
      }

      // Create sample garages
      const garages = await this.createSampleGarages();

      // Create sample vehicles
      const vehicles = await this.createSampleVehicles();

      // Create sample data for each vehicle
      for (const vehicle of vehicles) {
        await this.createSampleOilChanges(vehicle.id, garages[0]?.id);
        await this.createSampleMaintenance(vehicle.id, garages[0]?.id);
        await this.createSampleInspections(vehicle.id, garages[1]?.id);
      }

      console.log('Sample data initialized successfully');
    } catch (error) {
      console.error('Error initializing sample data:', error);
      throw error;
    }
  }

  /**
   * Reset all data
   */
  static async resetAllData(): Promise<void> {
    try {
      await VehicleRepository.deleteAll();
      await OilChangeRepository.deleteAll();
      await MaintenanceRepository.deleteAll();
      await InspectionRepository.deleteAll();
      await GarageRepository.deleteAll();
      console.log('All data reset successfully');
    } catch (error) {
      console.error('Error resetting data:', error);
      throw error;
    }
  }

  /**
   * Create sample garages
   */
  private static async createSampleGarages() {
    const garagesData: CreateGarageInput[] = [
      {
        name: 'AutoCare Center',
        address: '123 Main Street',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        phone: '+33 1 23 45 67 89',
        email: 'contact@autocare.fr',
        website: 'https://autocare.example.com',
        services: ['oil-change', 'maintenance', 'repair', 'diagnostic'],
        rating: 4.5,
        isFavorite: true,
        notes: 'Great service, friendly staff',
      },
      {
        name: 'TechniControl Inspection',
        address: '456 Avenue de la République',
        city: 'Lyon',
        postalCode: '69001',
        country: 'France',
        phone: '+33 4 78 90 12 34',
        email: 'info@technicontrol.fr',
        services: ['inspection'],
        rating: 4.8,
        isFavorite: true,
        notes: 'Official inspection center',
      },
      {
        name: 'Quick Oil Service',
        address: '789 Rue du Commerce',
        city: 'Marseille',
        postalCode: '13001',
        country: 'France',
        phone: '+33 4 91 23 45 67',
        services: ['oil-change', 'tire-service'],
        rating: 4.2,
        isFavorite: false,
        notes: 'Fast service, competitive prices',
      },
    ];

    return await GarageRepository.createMany(garagesData);
  }

  /**
   * Create sample vehicles
   */
  private static async createSampleVehicles() {
    const now = new Date();
    const vehiclesData: CreateVehicleInput[] = [
      {
        licensePlate: 'AB-123-CD',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        fuelType: 'hybrid',
        oilChangeIntervalKm: 10000,
        oilChangeIntervalMonths: 12,
        currentMileage: 45000,
        color: 'Silver',
        vin: 'JT2BF18K8X0123456',
        notes: 'Daily driver, excellent fuel economy',
      },
      {
        licensePlate: 'EF-456-GH',
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2018,
        fuelType: 'diesel',
        oilChangeIntervalKm: 15000,
        oilChangeIntervalMonths: 12,
        currentMileage: 82000,
        color: 'Blue',
        vin: 'WVWZZZ1KZBW123456',
        notes: 'Reliable commuter car',
      },
      {
        licensePlate: 'IJ-789-KL',
        brand: 'Tesla',
        model: 'Model 3',
        year: 2022,
        fuelType: 'electric',
        oilChangeIntervalKm: 0, // Electric - no oil changes needed
        oilChangeIntervalMonths: 12, // Still needs service
        currentMileage: 15000,
        color: 'White',
        notes: 'New electric vehicle, minimal maintenance',
      },
    ];

    return await VehicleRepository.createMany(vehiclesData);
  }

  /**
   * Create sample oil changes for a vehicle
   */
  private static async createSampleOilChanges(vehicleId: string, garageId?: string) {
    const now = new Date();
    const vehicle = await VehicleRepository.getById(vehicleId);

    if (!vehicle || vehicle.fuelType === 'electric') {
      return [];
    }

    const oilChange1Date = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const oilChange2Date = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    const oilChange3Date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const oilChangesData: Omit<OilChange, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        vehicleId,
        date: oilChange1Date.toISOString(),
        mileage: vehicle.currentMileage - 20000,
        cost: 75,
        garageId,
        oilType: '5W-30 Synthetic',
        filterChanged: true,
        notes: 'Regular maintenance',
        nextChangeDate: addMonths(oilChange1Date, vehicle.oilChangeIntervalMonths).toISOString(),
        nextChangeMileage: vehicle.currentMileage - 20000 + vehicle.oilChangeIntervalKm,
      },
      {
        vehicleId,
        date: oilChange2Date.toISOString(),
        mileage: vehicle.currentMileage - 10000,
        cost: 80,
        garageId,
        oilType: '5W-30 Synthetic',
        filterChanged: true,
        notes: 'Scheduled service',
        nextChangeDate: addMonths(oilChange2Date, vehicle.oilChangeIntervalMonths).toISOString(),
        nextChangeMileage: vehicle.currentMileage - 10000 + vehicle.oilChangeIntervalKm,
      },
      {
        vehicleId,
        date: oilChange3Date.toISOString(),
        mileage: vehicle.currentMileage,
        cost: 85,
        garageId,
        oilType: '5W-30 Full Synthetic',
        filterChanged: true,
        notes: 'Latest oil change',
        nextChangeDate: addMonths(oilChange3Date, vehicle.oilChangeIntervalMonths).toISOString(),
        nextChangeMileage: vehicle.currentMileage + vehicle.oilChangeIntervalKm,
      },
    ];

    return await OilChangeRepository.createMany(oilChangesData);
  }

  /**
   * Create sample maintenance records for a vehicle
   */
  private static async createSampleMaintenance(vehicleId: string, garageId?: string) {
    const now = new Date();
    const vehicle = await VehicleRepository.getById(vehicleId);

    if (!vehicle) {
      return [];
    }

    const maintenanceData: CreateMaintenanceInput[] = [
      {
        vehicleId,
        type: 'replacement',
        title: 'Brake Pad Replacement',
        description: 'Front brake pads worn, replaced with OEM parts',
        date: new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        mileage: vehicle.currentMileage - 12000,
        cost: 150,
        garageId,
        parts: [
          { name: 'Front Brake Pads', partNumber: 'BP-123', quantity: 1, cost: 80 },
          { name: 'Brake Fluid', partNumber: 'BF-456', quantity: 1, cost: 25 },
        ],
        status: 'completed',
        notes: 'Also checked brake rotors - still good',
      },
      {
        vehicleId,
        type: 'repair',
        title: 'Battery Replacement',
        description: 'Original battery failed, replaced with new one',
        date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        mileage: vehicle.currentMileage - 5000,
        cost: 120,
        garageId,
        parts: [
          { name: 'Battery', partNumber: 'BAT-789', quantity: 1, cost: 110 },
        ],
        status: 'completed',
        notes: 'Battery tested at 8.2V, below minimum threshold',
      },
      {
        vehicleId,
        type: 'replacement',
        title: 'Air Filter Replacement',
        description: 'Engine air filter replacement during routine maintenance',
        date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        mileage: vehicle.currentMileage,
        cost: 35,
        garageId,
        parts: [
          { name: 'Air Filter', partNumber: 'AF-321', quantity: 1, cost: 25 },
        ],
        status: 'completed',
        notes: 'Part of regular service',
      },
    ];

    return await MaintenanceRepository.createMany(maintenanceData);
  }

  /**
   * Create sample inspections for a vehicle
   */
  private static async createSampleInspections(vehicleId: string, garageId?: string) {
    const now = new Date();

    const inspectionsData: CreateInspectionInput[] = [
      {
        vehicleId,
        datePerformed: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: addDays(now, 185).toISOString(), // Expires in ~6 months
        cost: 75,
        garageId,
        certificateNumber: 'INSP-2024-001234',
        status: 'passed',
        inspectorName: 'Jean Dupont',
        notes: 'All systems checked - vehicle in good condition',
      },
    ];

    return await InspectionRepository.createMany(inspectionsData);
  }
}
