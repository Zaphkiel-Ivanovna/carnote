/**
 * Generic AsyncStorage Repository
 * Provides CRUD operations for any entity type
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUUID, getCurrentTimestamp } from '../utils';

/**
 * Base entity interface with required fields
 */
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Generic AsyncStorage Repository class
 */
export class AsyncStorageRepository<T extends BaseEntity> {
  private storageKey: string;

  constructor(entityName: string) {
    this.storageKey = `carnote:${entityName}`;
  }

  /**
   * Get all entities
   */
  async getAll(): Promise<T[]> {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      if (!data) {
        return [];
      }
      return JSON.parse(data) as T[];
    } catch (error) {
      console.error(`Error getting all from ${this.storageKey}:`, error);
      throw new Error(`Failed to retrieve ${this.storageKey}`);
    }
  }

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<T | null> {
    try {
      const entities = await this.getAll();
      return entities.find((entity) => entity.id === id) || null;
    } catch (error) {
      console.error(`Error getting by ID from ${this.storageKey}:`, error);
      throw new Error(`Failed to retrieve entity with id ${id}`);
    }
  }

  /**
   * Create new entity
   */
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      const entities = await this.getAll();
      const now = getCurrentTimestamp();
      const newEntity: T = {
        ...data,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
      } as T;

      entities.push(newEntity);
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(entities));
      return newEntity;
    } catch (error) {
      console.error(`Error creating in ${this.storageKey}:`, error);
      throw new Error(`Failed to create entity in ${this.storageKey}`);
    }
  }

  /**
   * Update entity by ID
   */
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T> {
    try {
      const entities = await this.getAll();
      const index = entities.findIndex((entity) => entity.id === id);

      if (index === -1) {
        throw new Error(`Entity with id ${id} not found`);
      }

      const updatedEntity: T = {
        ...entities[index],
        ...data,
        updatedAt: getCurrentTimestamp(),
      };

      entities[index] = updatedEntity;
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(entities));
      return updatedEntity;
    } catch (error) {
      console.error(`Error updating in ${this.storageKey}:`, error);
      throw new Error(`Failed to update entity with id ${id}`);
    }
  }

  /**
   * Delete entity by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const entities = await this.getAll();
      const filteredEntities = entities.filter((entity) => entity.id !== id);

      if (entities.length === filteredEntities.length) {
        throw new Error(`Entity with id ${id} not found`);
      }

      await AsyncStorage.setItem(this.storageKey, JSON.stringify(filteredEntities));
    } catch (error) {
      console.error(`Error deleting from ${this.storageKey}:`, error);
      throw new Error(`Failed to delete entity with id ${id}`);
    }
  }

  /**
   * Delete all entities
   */
  async deleteAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error(`Error deleting all from ${this.storageKey}:`, error);
      throw new Error(`Failed to delete all from ${this.storageKey}`);
    }
  }

  /**
   * Count entities
   */
  async count(): Promise<number> {
    try {
      const entities = await this.getAll();
      return entities.length;
    } catch (error) {
      console.error(`Error counting in ${this.storageKey}:`, error);
      return 0;
    }
  }

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const entity = await this.getById(id);
      return entity !== null;
    } catch (error) {
      console.error(`Error checking existence in ${this.storageKey}:`, error);
      return false;
    }
  }

  /**
   * Batch create multiple entities
   */
  async createMany(dataArray: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<T[]> {
    try {
      const entities = await this.getAll();
      const now = getCurrentTimestamp();

      const newEntities: T[] = dataArray.map(data => ({
        ...data,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
      } as T));

      entities.push(...newEntities);
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(entities));
      return newEntities;
    } catch (error) {
      console.error(`Error batch creating in ${this.storageKey}:`, error);
      throw new Error(`Failed to batch create entities in ${this.storageKey}`);
    }
  }
}
