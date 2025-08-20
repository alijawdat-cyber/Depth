// Processing utilities - consolidated after feature flags removal
// TODO: Standardize on one set of types (currently mixed 'raw' vs 'raw_only')

export type ProcessingLevel = 'raw' | 'raw_basic' | 'full_retouch';

export interface ProcessingConfig {
  value: ProcessingLevel;
  labelAr: string;
  labelEn: string;
  description: string;
}

export const PROCESSING_LEVELS: Record<ProcessingLevel, ProcessingConfig> = {
  raw: {
    value: 'raw',
    labelAr: 'خام',
    labelEn: 'Raw',
    description: 'تصوير أساسي بدون معالجة'
  },
  raw_basic: {
    value: 'raw_basic', 
    labelAr: 'معالجة أساسية',
    labelEn: 'Basic Processing',
    description: 'معالجة أساسية للصور'
  },
  full_retouch: {
    value: 'full_retouch',
    labelAr: 'معالجة كاملة',
    labelEn: 'Full Retouch', 
    description: 'معالجة متقدمة وتحسين شامل'
  }
};

// Safe mapper function - preserves compatibility
export function mapProcessingLabel(level?: ProcessingLevel | string): string {
  if (!level) return 'غير محدد';
  
  const config = PROCESSING_LEVELS[level as ProcessingLevel];
  return config?.labelAr || String(level);
}

// Adapter for outputLevel → processing term in UI (fallback for legacy data)
export function getProcessingDisplay(
  skill: { outputLevel?: ProcessingLevel; processing?: ProcessingLevel }
): {
  value: ProcessingLevel | undefined;
  label: string;
} {
  // Always prefer 'processing' over 'outputLevel' (fallback only)
  const value = skill.processing || skill.outputLevel;
  
  return {
    value,
    label: mapProcessingLabel(value)
  };
}
