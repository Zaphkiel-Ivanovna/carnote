/**
 * Garage entity interface
 * Represents a service center, garage, or inspection center
 */
export interface Garage {
  id: string; // UUID
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  services: GarageService[]; // Services offered
  rating?: number; // 0-5 rating
  notes?: string;
  isFavorite: boolean;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * Services offered by a garage
 */
export type GarageService =
  | 'oil-change'
  | 'maintenance'
  | 'repair'
  | 'inspection'
  | 'tire-service'
  | 'diagnostic'
  | 'body-work'
  | 'other';

/**
 * Create Garage input (without system-generated fields)
 */
export type CreateGarageInput = Omit<Garage, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Update Garage input (partial, without system fields)
 */
export type UpdateGarageInput = Partial<Omit<Garage, 'id' | 'createdAt' | 'updatedAt'>>;
