/**
 * StatusBadge Component
 * Displays status indicators for oil changes, inspections, etc.
 */

import React from 'react';
import { Chip } from 'heroui-native';
import type { OilChangeStatus, InspectionUrgency, MaintenanceStatus, InspectionStatus } from '../../types';

interface StatusBadgeProps {
  status: OilChangeStatus | InspectionUrgency | MaintenanceStatus | InspectionStatus;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const getClassName = () => {
    switch (status) {
      // Oil Change Status
      case 'good':
        return 'bg-green-500 text-white';
      case 'due-soon':
        return 'bg-yellow-500 text-white';
      case 'overdue':
        return 'bg-red-500 text-white';

      // Inspection Urgency
      case 'urgent':
      case 'expired':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-orange-500 text-white';

      // Maintenance Status
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      case 'scheduled':
        return 'bg-indigo-500 text-white';
      case 'cancelled':
        return 'bg-gray-400 text-white';

      // Inspection Status
      case 'passed':
        return 'bg-green-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';

      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <Chip className={getClassName()} size="sm">
      {label}
    </Chip>
  );
}
