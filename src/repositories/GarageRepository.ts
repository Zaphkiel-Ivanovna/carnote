/**
 * Garage Repository
 * Handles data access for Garage entities
 */

import { AsyncStorageRepository } from './AsyncStorageRepository';
import type { Garage, GarageService } from '../types';

class GarageRepositoryClass extends AsyncStorageRepository<Garage> {
  constructor() {
    super('garages');
  }

  /**
   * Get favorite garages
   */
  async getFavorites(): Promise<Garage[]> {
    try {
      const garages = await this.getAll();
      return garages.filter(g => g.isFavorite);
    } catch (error) {
      console.error('Error getting favorite garages:', error);
      return [];
    }
  }

  /**
   * Get garages that offer a specific service
   */
  async getByService(service: GarageService): Promise<Garage[]> {
    try {
      const garages = await this.getAll();
      return garages.filter(g => g.services.includes(service));
    } catch (error) {
      console.error('Error getting garages by service:', error);
      return [];
    }
  }

  /**
   * Search garages by name
   */
  async searchByName(query: string): Promise<Garage[]> {
    try {
      const garages = await this.getAll();
      const lowerQuery = query.toLowerCase();
      return garages.filter(g =>
        g.name.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching garages:', error);
      return [];
    }
  }
}

export const GarageRepository = new GarageRepositoryClass();
