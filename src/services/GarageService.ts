/**
 * Garage Service
 * Business logic for Garage operations
 */

import { GarageRepository } from '../repositories';
import type { Garage, CreateGarageInput, UpdateGarageInput } from '../types';

export class GarageService {
  /**
   * Validate garage data
   */
  static validate(data: CreateGarageInput | UpdateGarageInput): string[] {
    const errors: string[] = [];

    if ('name' in data && !data.name) {
      errors.push('Name is required');
    }

    if ('email' in data && data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push('Invalid email format');
      }
    }

    if ('phone' in data && data.phone) {
      // Basic phone validation (allow various formats)
      const phoneRegex = /^[\d\s()+-]+$/;
      if (!phoneRegex.test(data.phone)) {
        errors.push('Invalid phone format');
      }
    }

    if ('website' in data && data.website) {
      try {
        new URL(data.website);
      } catch {
        errors.push('Invalid website URL');
      }
    }

    if ('rating' in data && data.rating !== undefined) {
      if (data.rating < 0 || data.rating > 5) {
        errors.push('Rating must be between 0 and 5');
      }
    }

    return errors;
  }

  /**
   * Get garage statistics
   */
  static async getStats(): Promise<{
    total: number;
    favorites: number;
    averageRating: number;
  }> {
    const garages = await GarageRepository.getAll();
    const favorites = garages.filter(g => g.isFavorite).length;

    const ratingsSum = garages.reduce((sum, g) => {
      return sum + (g.rating || 0);
    }, 0);

    const averageRating = garages.length > 0
      ? ratingsSum / garages.length
      : 0;

    return {
      total: garages.length,
      favorites,
      averageRating,
    };
  }

  /**
   * Format garage address
   */
  static formatAddress(garage: Garage): string {
    const parts: string[] = [];

    if (garage.address) parts.push(garage.address);
    if (garage.city) parts.push(garage.city);
    if (garage.postalCode) parts.push(garage.postalCode);
    if (garage.country) parts.push(garage.country);

    return parts.join(', ');
  }

  /**
   * Format contact info
   */
  static formatContact(garage: Garage): string {
    const parts: string[] = [];

    if (garage.phone) parts.push(`Phone: ${garage.phone}`);
    if (garage.email) parts.push(`Email: ${garage.email}`);
    if (garage.website) parts.push(`Website: ${garage.website}`);

    return parts.join(' | ');
  }
}
