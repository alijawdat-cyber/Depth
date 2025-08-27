'use client';

import React from 'react';
import { Badge } from '@mantine/core';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  Pause,
  Play,
  type LucideIcon 
} from 'lucide-react';
import styles from './StatusBadge.module.css';

// أنواع الحالات المختلفة
export type StatusType = 
  | 'active' 
  | 'inactive' 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'warning'
  | 'draft'
  | 'published'
  | 'archived'
  | 'processing';

// خصائص المكون
export interface StatusBadgeProps {
  /** نوع الحالة */
  status: StatusType;
  /** النص المخصص (اختياري) */
  label?: string;
  /** عرض الأيقونة */
  withIcon?: boolean;
  /** الحجم */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** النمط */
  variant?: 'filled' | 'light' | 'outline';
  /** تخصيص إضافي لـ CSS */
  className?: string;
}

// تكوين الحالات
const statusConfig: Record<StatusType, {
  label: string;
  color: string;
  icon: LucideIcon;
}> = {
  active: {
    label: 'نشط',
    color: 'green',
    icon: CheckCircle
  },
  inactive: {
    label: 'غير نشط',
    color: 'gray',
    icon: Pause
  },
  pending: {
    label: 'في الانتظار',
    color: 'yellow',
    icon: Clock
  },
  completed: {
    label: 'مكتمل',
    color: 'green',
    icon: CheckCircle
  },
  failed: {
    label: 'فشل',
    color: 'red',
    icon: XCircle
  },
  warning: {
    label: 'تحذير',
    color: 'orange',
    icon: AlertCircle
  },
  draft: {
    label: 'مسودة',
    color: 'gray',
    icon: Clock
  },
  published: {
    label: 'منشور',
    color: 'green',
    icon: Play
  },
  archived: {
    label: 'مؤرشف',
    color: 'gray',
    icon: Pause
  },
  processing: {
    label: 'قيد المعالجة',
    color: 'blue',
    icon: Clock
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  withIcon = true,
  size = 'sm',
  variant = 'light',
  className
}) => {
  const config = statusConfig[status];
  const displayLabel = label || config.label;
  const Icon = config.icon;

  return (
    <Badge
      color={config.color}
      variant={variant}
      size={size}
      className={`${styles.badge} ${styles[status]} ${className || ''}`}
      leftSection={
        withIcon && (
          <Icon 
            size={size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'md' ? 14 : size === 'lg' ? 16 : 18} 
            className={styles.icon}
          />
        )
      }
    >
      {displayLabel}
    </Badge>
  );
};

export default StatusBadge;
