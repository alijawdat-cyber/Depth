import React from 'react';
import { Card, Group, Text, ThemeIcon, Box } from '@mantine/core';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatsCardProps {
  /** عنوان البطاقة */
  title: string;
  /** القيمة الرئيسية */
  value: string | number;
  /** الأيقونة */
  icon?: React.ReactNode;
  /** معلومات الاتجاه */
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  /** لون البطاقة */
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  /** حجم البطاقة */
  size?: 'sm' | 'md' | 'lg';
  /** وصف اضافي */
  description?: string;
  /** قابلة للنقر */
  clickable?: boolean;
  /** عند النقر */
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  size = 'md',
  description,
  clickable = false,
  onClick
}) => {
  // 🎯 تحديد الكلاسات من النظام المركزي حصراً
  const getCardClass = () => {
    let baseClass = 'card';
    
    // حجم البطاقة
    if (size === 'sm') baseClass += ' cardSmall';
    if (size === 'lg') baseClass += ' cardLarge';
    
    // لون البطاقة
    if (color === 'success') baseClass += ' cardSuccess';
    if (color === 'warning') baseClass += ' cardWarning';
    if (color === 'danger') baseClass += ' cardError';
    if (color === 'info') baseClass += ' cardInfo';
    if (color === 'neutral') baseClass += ' cardSecondary';
    
    // قابلية النقر
    if (clickable) baseClass += ' cursorPointer';
    
    return baseClass;
  };

  // 🎯 كلاس الشارة حسب الاتجاه
  const getTrendBadgeClass = () => {
    if (trend?.direction === 'up') return 'badge badgeSuccess';
    if (trend?.direction === 'down') return 'badge badgeError';
    return 'badge badgeSecondary'; // للحالة المحايدة
  };

  // 🎯 كلاس الأيقونة حسب الاتجاه
  const getTrendIconClass = () => {
    if (trend?.direction === 'up') return 'iconSuccess';
    if (trend?.direction === 'down') return 'iconError';
    return 'iconSecondary'; // للحالة المحايدة
  };

  return (
    <Card className={getCardClass()} onClick={clickable ? onClick : undefined}>
      <Group justify="space-between" mb="var(--space-sm)">
        {icon && (
          <ThemeIcon
            size={size === 'sm' ? 'md' : 'lg'}
            radius="var(--radius-md)"
          >
            {icon}
          </ThemeIcon>
        )}
        
        {trend && (
          <Group gap="var(--space-xs)">
            {trend.direction === 'up' ? (
              <TrendingUp size={14} className={getTrendIconClass()} />
            ) : trend.direction === 'down' ? (
              <TrendingDown size={14} className={getTrendIconClass()} />
            ) : null}
            <Text className={getTrendBadgeClass()}>
              {trend.value}%
            </Text>
          </Group>
        )}
      </Group>

      <Box mb="var(--space-xs)">
        <Text
          className="cardStatNumber"
          size={size === 'sm' ? 'var(--fs-xl)' : 'var(--fs-3xl)'}
          fw={700}
        >
          {value}
        </Text>
      </Box>

      <Text className="cardStatLabel">
        {title}
      </Text>

      {description && (
        <Text
          size="xs"
          c="dimmed"
          mt="var(--space-xs)"
        >
          {description}
        </Text>
      )}

      {trend?.label && (
        <Text
          size="var(--fs-xs)"
          mt="var(--space-xs)"
          className="textMuted"
        >
          {trend.label}
        </Text>
      )}
    </Card>
  );
};

// تصدير named export ايضاً لدعم import patterns مختلفة
export { StatsCard };

export default StatsCard;
