"use client";
import React from "react";
import { Text, Group, Card } from "@mantine/core";
import { TrendingUp, TrendingDown } from "lucide-react";
import styles from "./StatsCard.module.css";

export type StatsCardColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatsCardProps {
  /** عنوان الإحصائية */
  title: string;
  /** القيمة الرئيسية */
  value: string | number;
  /** أيقونة اختيارية */
  icon?: React.ReactNode;
  /** معلومات الاتجاه/التغيير */
  trend?: {
    /** قيمة التغيير (نسبة مئوية أو رقم) */
    value: number;
    /** اتجاه التغيير */
    direction: 'up' | 'down' | 'neutral';
    /** نص وصفي للاتجاه */
    label?: string;
  };
  /** لون البطاقة */
  color?: StatsCardColor;
  /** وصف إضافي */
  description?: string;
  /** حالة التحميل */
  loading?: boolean;
  /** دالة النقر */
  onClick?: () => void;
  /** قابل للنقر */
  clickable?: boolean;
  /** الحجم */
  size?: 'sm' | 'md' | 'lg';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'neutral',
  description,
  loading = false,
  onClick,
  clickable = false,
  size = 'md',
}) => {
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up': return <TrendingUp size={14} />;
      case 'down': return <TrendingDown size={14} />;
      case 'neutral': return null;
      default: return null;
    }
  };

  return (
    <Card
      className={`${styles.statsCard} ${styles[`statsCard--${color}`]} ${styles[`statsCard--${size}`]} ${
        clickable ? styles.statsCardClickable : ''
      }`}
      padding="lg"
      onClick={handleClick}
    >
      <div className={styles.statsCardContent}>
        {/* Header - Title and Icon */}
        <div className={styles.statsCardHeader}>
          <Text 
            size="sm" 
            className={styles.statsCardTitle}
          >
            {title}
          </Text>
          {icon && (
            <div className={styles.statsCardIcon}>
              {icon}
            </div>
          )}
        </div>

        {/* Main Value */}
        <div className={styles.statsCardValue}>
          <Text 
            size={size === 'lg' ? '2xl' : size === 'sm' ? 'xl' : '2xl'}
            fw={700}
            className={styles.statsCardNumber}
          >
            {value}
          </Text>

          {/* Trend Indicator */}
          {trend && (
            <div className={styles.statsCardTrend}>
              <Group gap={4} className={styles.statsCardTrendGroup}>
                <span 
                  className={`${styles.statsCardTrendIcon} ${styles[`statsCardTrend${trend.direction.charAt(0).toUpperCase() + trend.direction.slice(1)}`]}`}
                >
                  {getTrendIcon(trend.direction)}
                </span>
                <Text 
                  size="sm" 
                  fw={500}
                  className={`${styles.statsCardTrendValue} ${styles[`statsCardTrend${trend.direction.charAt(0).toUpperCase() + trend.direction.slice(1)}`]}`}
                >
                  {trend.value > 0 && trend.direction !== 'neutral' ? '+' : ''}{trend.value}%
                </Text>
                {trend.label && (
                  <Text 
                    size="xs" 
                    className={styles.statsCardTrendLabel}
                  >
                    {trend.label}
                  </Text>
                )}
              </Group>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <Text 
            size="xs" 
            className={styles.statsCardDescription}
          >
            {description}
          </Text>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
