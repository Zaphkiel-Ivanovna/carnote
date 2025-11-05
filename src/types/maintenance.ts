/**
 * Maintenance entity interface
 * Represents a general maintenance or repair record
 */
export interface Maintenance {
  id: string; // UUID
  vehicleId: string; // Reference to Vehicle
  type: MaintenanceType;
  title: string; // Short description (e.g., "Brake pad replacement")
  description?: string; // Detailed description
  date: string; // ISO 8601 date when maintenance was performed
  mileage: number; // Odometer reading at time of service
  cost: number; // Total cost of maintenance
  garageId?: string; // Reference to Garage (optional)
  parts: MaintenancePart[]; // Parts used/replaced
  status: MaintenanceStatus;
  attachments?: string[]; // URIs to photos/documents
  notes?: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * Maintenance types
 */
export type MaintenanceType =
  | 'repair'
  | 'replacement'
  | 'inspection'
  | 'tune-up'
  | 'diagnostic'
  | 'cleaning'
  | 'upgrade'
  | 'other';

/**
 * Maintenance status
 */
export type MaintenanceStatus =
  | 'scheduled'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

/**
 * Part used in maintenance
 */
export interface MaintenancePart {
  name: string;
  partNumber?: string;
  quantity: number;
  cost: number;
}

/**
 * Create Maintenance input (without system-generated fields)
 */
export type CreateMaintenanceInput = Omit<
  Maintenance,
  'id' | 'createdAt' | 'updatedAt'
>;

/**
 * Update Maintenance input (partial, without system fields)
 */
export type UpdateMaintenanceInput = Partial<
  Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>
>;
