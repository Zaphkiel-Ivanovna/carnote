/**
 * CarNote Theme Configuration
 * Defines colors, spacing, and other theme-related constants
 */

export const colors = {
  // Status colors for oil changes
  oilChange: {
    good: '#10B981', // Green
    dueSoon: '#F59E0B', // Yellow/Orange
    overdue: '#EF4444', // Red
  },

  // Urgency colors for inspections
  inspection: {
    good: '#10B981', // Green
    warning: '#F59E0B', // Orange
    urgent: '#EF4444', // Red
    expired: '#DC2626', // Dark Red
  },

  // Maintenance status colors
  maintenance: {
    scheduled: '#3B82F6', // Blue
    inProgress: '#8B5CF6', // Purple
    completed: '#10B981', // Green
    cancelled: '#6B7280', // Gray
  },

  // Fuel type colors
  fuelType: {
    gasoline: '#EF4444',
    diesel: '#F59E0B',
    electric: '#10B981',
    hybrid: '#3B82F6',
    other: '#6B7280',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
