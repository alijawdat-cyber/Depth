// Domain types for Catalog, Rate Card, and Quotes (light)

export type ProcessingLevel = 'raw_only' | 'raw_basic' | 'full_retouch';

export interface Category {
  id: string;
  nameAr: string;
  nameEn?: string;
  order?: number;
}

export interface SubcategoryDefaults {
  ratios?: string[];
  formats?: string[];
  processingLevels?: ProcessingLevel[];
  verticalsAllowed?: string[];
  complianceTags?: string[];
}

export interface Subcategory {
  id: string;
  categoryId: string; // ref Category.id
  nameAr: string;
  nameEn?: string;
  desc?: string;
  defaults?: SubcategoryDefaults;
  priceRangeKey?: string; // used to lookup baseRangesIQD
}

export interface Vertical {
  id: string; // e.g., beauty, furniture, fashion
  nameAr: string;
  nameEn?: string;
  modifierPct?: number; // optional per docs; final engine uses rate card verticalModifiers
}

export interface RateCardProcessingLevels {
  raw_only?: number; // negative discount as fraction (e.g., -0.10)
  raw_basic?: number; // 0.0 typical
  full_retouch?: [number, number] | number; // min/max percent or fixed percent
}

export interface RateCardGuardrails {
  minMarginDefault?: number; // e.g., 0.50
  minMarginHardStop?: number; // e.g., 0.45
}

export interface RateCardFXPolicy {
  mode?: 'manual' | 'source';
  lastRate?: number | null;
  lastDate?: string | null; // ISO
  source?: string | null;
}

export interface RateCard {
  versionId: string;
  status: 'active' | 'archived' | 'draft';
  effectiveFrom?: string; // ISO date
  basePricesIQD?: Record<string, number>; // key → IQD unit price
  baseRangesIQD?: Record<string, [number, number]>; // key → [min,max]
  processingLevels?: RateCardProcessingLevels;
  modifiers?: {
    rushPct?: number;
    creatorTierPct?: { T1?: number; T2?: number; T3?: number };
    rawPct?: number;
    retouchMinPct?: number;
    retouchMaxPct?: number;
  };
  verticalModifiers?: Record<string, number>;
  locationZonesIQD?: Record<string, number>;
  overrideCapPercent?: number;
  guardrails?: RateCardGuardrails;
  roundingIQD?: number; // e.g., 250
  fxPolicy?: RateCardFXPolicy;
  createdAt?: string;
  updatedAt?: string;
}

// Light quote types for preview/create
export interface QuoteLineInput {
  subcategoryId: string;
  qty: number;
  vertical: string;
  processing: ProcessingLevel;
  conditions?: { rush?: boolean; locationZone?: string };
  tier?: 'T1' | 'T2' | 'T3';
  overrideIQD?: number | null;
  estimatedCostIQD?: number | null;
}

export interface QuotePreviewBreakdown {
  base: number;
  afterVertical: number;
  afterProcessing: number;
  afterRush: number;
  ['+location']?: number;
  afterTier?: number;
  overrideApplied?: number;
  final: number;
  finalRounded: number;
}

export interface QuotePreviewLineResult {
  subcategoryId: string;
  qty: number;
  breakdown: QuotePreviewBreakdown;
  unitPriceIQD: number;
  lineTotalIQD: number;
  warnings?: string[];
}

export interface QuotePreviewResponse {
  lines: QuotePreviewLineResult[];
  totals: { iqd: number; usd?: number };
  guardrails?: { margin?: number; status?: 'ok' | 'warn' | 'hard_stop'; warnings?: string[] };
}

export interface SOWLight {
  quoteId: string;
  projectId?: string | null;
  pdfUrl?: string | null;
  status: 'generated' | 'sent' | 'signed';
  createdAt?: string;
}


