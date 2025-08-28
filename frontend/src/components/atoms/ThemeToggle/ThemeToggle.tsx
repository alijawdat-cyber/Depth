'use client';

import React from 'react';
import { SegmentedControl, Box, Group, Text } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { Sun, Moon, Monitor, type LucideIcon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

// نوع الثيم المتاح
export type ColorSchemeType = 'light' | 'dark' | 'auto';

// خصائص المكون
interface ThemeToggleProps {
  /** حجم المكون */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** عرض النص مع الأيكونات */
  withLabels?: boolean;
  /** كلاس إضافي */
  className?: string;
}

// بيانات خيارات الثيم
interface ThemeOption {
  value: ColorSchemeType;
  label: string;
  icon: LucideIcon;
  description: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'فاتح',
    icon: Sun,
    description: 'الوضع النهاري الفاتح'
  },
  {
    value: 'dark', 
    label: 'داكن',
    icon: Moon,
    description: 'الوضع الليلي الداكن'
  },
  {
    value: 'auto',
    label: 'تلقائي',
    icon: Monitor,
    description: 'حسب إعدادات النظام'
  }
];

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'sm',
  withLabels = true,
  className
}) => {
  const [highlight, setHighlight] = React.useState(false);
  const highlightRef = React.useRef<number | null>(null);
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const handleSchemeChange = (value: string) => {
    const newScheme = value as ColorSchemeType;
    setColorScheme(newScheme);
    // إبراز الإطار لمدة ثانيتين
    setHighlight(true);
    if (highlightRef.current) {
      window.clearTimeout(highlightRef.current);
    }
    highlightRef.current = window.setTimeout(() => {
      setHighlight(false);
      highlightRef.current = null;
    }, 2000);
  };

  // إنشاء البيانات للـ SegmentedControl
  const segmentedData = themeOptions.map(option => {
    const Icon = option.icon;
    
    // تعيين كلاس يحدد لون الأيقونة من CSS حسب القيمة
    const iconClass =
      option.value === 'auto' ? styles.iconAuto :
      option.value === 'dark' ? styles.iconDark :
      styles.iconLight;

    return {
      value: option.value,
      label: withLabels ? (
        <Group gap="xs" justify="center" wrap="nowrap">
          <Icon size={16} className={`${styles.icon} ${iconClass}`} />
          <Text size={size === 'xs' ? 'xs' : 'sm'} className={styles.label}>
            {option.label}
          </Text>
        </Group>
      ) : (
        <Box className={`${styles.iconOnly} ${iconClass}`}>
          <Icon size={size === 'xs' ? 14 : size === 'sm' ? 16 : 18} />
        </Box>
      )
    };
  });

  return (
    <Box className={`${styles.themeToggle} ${highlight ? styles.highlight : ''} ${className || ''}`}>
      <SegmentedControl
        value={colorScheme}
        onChange={handleSchemeChange}
        data={segmentedData}
        size={size}
        radius="md"
        className={styles.segmentedControl}
        aria-label="تبديل وضع الثيم"
        styles={{
          root: {
            backgroundColor: 'var(--color-bg-primary)',      /* عكس السايدبار: السايدبار ثانوي */
            border: '1px solid var(--color-border-primary)',
          },
          control: {
            border: 'none !important',
          },
          indicator: {
            backgroundColor: 'transparent',                  /* لا خلفية للمؤشر */
            boxShadow: 'none',
          },
        }}
      />
    </Box>
  );
};

export default ThemeToggle;
