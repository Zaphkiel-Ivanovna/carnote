/**
 * Oil Change entity interface
 * Represents an oil change service record
 */
export interface OilChange {
  id: string; // UUID
  vehicleId: string; // Reference to Vehicle
  date: string; // ISO 8601 date when oil change was performed
  mileage: number; // Odometer reading at time of service
  cost: number; // Cost of the oil change
  garageId?: string; // Reference to Garage (optional)
  oilType?: string; // Type of oil used (e.g., "5W-30 Synthetic")
  filterChanged: boolean; // Whether oil filter was changed
  notes?: string;
  nextChangeDate: string; // Calculated next oil change date
  nextChangeMileage: number; // Calculated next oil change mileage
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * Create Oil Change input (without system-generated fields)
 */
export type CreateOilChangeInput = Omit<
  OilChange,
  'id' | 'createdAt' | 'updatedAt' | 'nextChangeDate' | 'nextChangeMileage'
> & {
  // These will be calculated
  nextChangeDate?: string;
  nextChangeMileage?: number;
};

/**
 * Update Oil Change input (partial, without system fields)
 */
export type UpdateOilChangeInput = Partial<
  Omit<OilChange, 'id' | 'createdAt' | 'updatedAt'>
>;

/**
 * Oil Change status based on current vehicle mileage
 */
export type OilChangeStatus = 'good' | 'due-soon' | 'overdue';

/**
 * Oil Change with calculated status
 */
export interface OilChangeWithStatus extends OilChange {
  status: OilChangeStatus;
  daysUntilDue: number;
  kmUntilDue: number;
}
