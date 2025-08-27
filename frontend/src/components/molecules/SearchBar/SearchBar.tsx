'use client';

import React, { useState } from 'react';
import { TextInput, ActionIcon, Group } from '@mantine/core';
import { Search, X, Filter } from 'lucide-react';
import styles from './SearchBar.module.css';

export interface SearchBarProps {
  /** القيمة الحالية للبحث */
  value?: string;
  /** دالة تغيير قيمة البحث */
  onChange?: (value: string) => void;
  /** نص التلميح */
  placeholder?: string;
  /** إمكانية الفلترة */
  filterable?: boolean;
  /** دالة فتح الفلاتر */
  onFilterClick?: () => void;
  /** عدد الفلاتر النشطة */
  activeFiltersCount?: number;
  /** حالة التحميل */
  loading?: boolean;
  /** تعطيل المكون */
  disabled?: boolean;
  /** تخصيص إضافي لـ CSS */
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  placeholder = 'البحث...',
  filterable = false,
  onFilterClick,
  activeFiltersCount = 0,
  loading = false,
  disabled = false,
  className
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Group gap="xs" wrap="nowrap">
        <TextInput
          value={localValue}
          onChange={(e) => handleChange(e.currentTarget.value)}
          placeholder={placeholder}
          leftSection={<Search size={16} />}
          rightSection={
            localValue && (
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={handleClear}
                className={styles.clearButton}
              >
                <X size={14} />
              </ActionIcon>
            )
          }
          disabled={disabled}
          className={styles.searchInput}
        />
        
        {filterable && (
          <ActionIcon
            variant="outline"
            onClick={onFilterClick}
            disabled={disabled}
            className={`${styles.filterButton} ${
              activeFiltersCount > 0 ? styles.hasActiveFilters : ''
            }`}
          >
            <Filter size={16} />
            {activeFiltersCount > 0 && (
              <span className={styles.filterBadge}>
                {activeFiltersCount}
              </span>
            )}
          </ActionIcon>
        )}
      </Group>
    </div>
  );
};

export default SearchBar;
