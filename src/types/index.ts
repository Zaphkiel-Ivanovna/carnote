/**
 * Central export for all TypeScript types and interfaces
 */

// Vehicle
export type {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput,
} from './vehicle';

// Oil Change
export type {
  OilChange,
  CreateOilChangeInput,
  UpdateOilChangeInput,
  OilChangeStatus,
  OilChangeWithStatus,
} from './oilChange';

// Maintenance
export type {
  Maintenance,
  MaintenanceType,
  MaintenanceStatus,
  MaintenancePart,
  CreateMaintenanceInput,
  UpdateMaintenanceInput,
} from './maintenance';

// Inspection
export type {
  Inspection,
  InspectionStatus,
  InspectionUrgency,
  InspectionWithUrgency,
  CreateInspectionInput,
  UpdateInspectionInput,
} from './inspection';

// Garage
export type {
  Garage,
  GarageService,
  CreateGarageInput,
  UpdateGarageInput,
} from './garage';
