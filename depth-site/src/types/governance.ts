// Types for Governance and Version Management System

export interface RateCardVersion {
  id: string;
  versionId: string; // e.g., "2025.01.15"
  status: 'draft' | 'active' | 'archived';
  effectiveFrom: string; // ISO date string
  effectiveTo?: string; // ISO date string
  createdAt: string;
  createdBy: string; // admin email
  reason?: string; // reason for change
  changes?: VersionChange[];
  rateCard: {
    baseRates: Record<string, number>;
    modifiers: {
      verticals: Record<string, number>;
      processing: Record<string, number>;
      conditions: Record<string, number>;
    };
    fx: {
      rate: number;
      source: string;
      updatedAt: string;
    };
  };
}

export interface VersionChange {
  type: 'base_rate' | 'modifier' | 'fx_rate';
  subcategoryId?: string;
  vertical?: string;
  processing?: string;
  condition?: string;
  oldValue: number;
  newValue: number;
  changePercent: number; // calculated percentage change
}

export interface VersionDiff {
  versionFrom: string;
  versionTo: string;
  changes: VersionChange[];
  summary: {
    totalChanges: number;
    increasedCount: number;
    decreasedCount: number;
    avgChangePercent: number;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'version_create' | 'version_publish' | 'version_archive' | 'quote_approve' | 'override_request' | 'override_approve';
  userId: string; // admin/client email
  userRole: 'admin' | 'client' | 'creator';
  entityType: 'rate_card' | 'quote' | 'override';
  entityId: string;
  details: {
    versionId?: string;
    quoteId?: string;
    overrideId?: string;
    reason?: string;
    oldValue?: unknown;
    newValue?: unknown;
  };
  metadata?: Record<string, unknown>;
}

export interface GovernanceStats {
  activeVersion: string;
  totalVersions: number;
  pendingQuotes: number;
  pendingOverrides: number;
  lastVersionDate: string;
  avgChangePercent: number;
  recentAuditCount: number;
}

// Version Snapshot (captured when quote is approved)
export interface VersionSnapshot {
  id: string;
  quoteId: string;
  versionId: string;
  capturedAt: string;
  rateCardData: RateCardVersion['rateCard'];
  fxSnapshot: {
    rate: number;
    date: string;
    source: string;
  };
}

// API Request/Response types
export interface VersionListRequest {
  status?: 'draft' | 'active' | 'archived';
  limit?: number;
  offset?: number;
}

export interface VersionListResponse {
  versions: RateCardVersion[];
  total: number;
  stats: GovernanceStats;
}

export interface VersionDiffRequest {
  fromVersionId: string;
  toVersionId: string;
}

export interface VersionDiffResponse {
  diff: VersionDiff;
  fromVersion: RateCardVersion;
  toVersion: RateCardVersion;
}

export interface AuditLogRequest {
  entityType?: 'rate_card' | 'quote' | 'override';
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AuditLogResponse {
  entries: AuditLogEntry[];
  total: number;
}

export interface VersionCreateRequest {
  reason: string;
  effectiveFrom: string;
  rateCard: RateCardVersion['rateCard'];
}

export interface VersionUpdateRequest {
  id: string;
  status: 'active' | 'archived';
  reason?: string;
}

// Override Management Types (for future implementation)
export interface PriceOverride {
  id: string;
  creatorEmail: string;
  subcategoryId: string;
  vertical: string;
  processing: string;
  currentPriceIQD: number;
  requestedPriceIQD: number;
  changePercent: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'countered';
  adminResponse?: {
    adminEmail: string;
    decision: 'approve' | 'reject' | 'counter';
    counterPriceIQD?: number;
    reason: string;
    decidedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OverrideStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
  avgChangePercent: number;
}
