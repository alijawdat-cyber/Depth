'use client';

import React from 'react';
import { Badge } from '@mantine/core';
import { Clock, AlertTriangle, Flame } from 'lucide-react';

type PriorityType = 'low' | 'normal' | 'high' | 'urgent';

interface PriorityBadgeProps {
  priority: PriorityType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'light' | 'outline';
}

const priorityConfig = {
  low: {
    color: 'gray',
    label: 'منخفض',
    icon: Clock,
  },
  normal: {
    color: 'blue',
    label: 'عادي',
    icon: Clock,
  },
  high: {
    color: 'orange',
    label: 'عالي',
    icon: AlertTriangle,
  },
  urgent: {
    color: 'red',
    label: 'عاجل',
    icon: Flame,
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'sm',
  variant = 'light',
}) => {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Badge
      color={config.color}
      size={size}
      variant={variant}
      leftSection={<Icon size={12} />}
    >
      {config.label}
    </Badge>
  );
};
