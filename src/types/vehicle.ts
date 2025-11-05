/**
 * Vehicle entity interface
 * Represents a vehicle tracked in the CarNote application
 */
export interface Vehicle {
  id: string; // UUID
  licensePlate: string; // Unique identifier
  brand: string;
  model: string;
  year: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'other';
  oilChangeIntervalKm: number; // Kilometers between oil changes
  oilChangeIntervalMonths: number; // Months between oil changes
  currentMileage: number; // Current odometer reading
  color?: string;
  vin?: string; // Vehicle Identification Number
  notes?: string;
  photoUri?: string; // Local image URI
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * Create Vehicle input (without system-generated fields)
 */
export type CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Update Vehicle input (partial, without system fields)
 */
export type UpdateVehicleInput = Partial<Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>>;
