/**
 * Technical Inspection entity interface
 * Represents a technical/safety inspection record
 */
export interface Inspection {
  id: string; // UUID
  vehicleId: string; // Reference to Vehicle
  datePerformed: string; // ISO 8601 date when inspection was performed
  expiryDate: string; // ISO 8601 date when inspection expires
  cost: number; // Cost of the inspection
  garageId?: string; // Reference to Garage (optional)
  certificateNumber?: string; // Official certificate number
  status: InspectionStatus;
  inspectorName?: string;
  notes?: string;
  attachments?: string[]; // URIs to certificate photos/documents
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * Inspection status
 */
export type InspectionStatus = 'passed' | 'failed' | 'pending' | 'expired';

/**
 * Inspection urgency level based on expiry date
 */
export type InspectionUrgency = 'good' | 'warning' | 'urgent' | 'expired';

/**
 * Inspection with calculated urgency
 */
export interface InspectionWithUrgency extends Inspection {
  urgency: InspectionUrgency;
  daysUntilExpiry: number;
}

/**
 * Create Inspection input (without system-generated fields)
 */
export type CreateInspectionInput = Omit<Inspection, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Update Inspection input (partial, without system fields)
 */
export type UpdateInspectionInput = Partial<
  Omit<Inspection, 'id' | 'createdAt' | 'updatedAt'>
>;
