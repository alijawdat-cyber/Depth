// Creator-specific types for project details and earnings
// Separates creator data from client/admin data for security

// Processing levels (previously from feature-flags)
export type ProcessingLevel = 'raw' | 'raw_basic' | 'full_retouch';

// Creator Line Item Summary for quick display
export type CreatorLineItemSummary = {
  id?: string;                // optional for key stability
  subcategoryId: string;
  subcategoryName?: string;   // human-readable category name
  subcategory: string;        // fallback identifier
  processing: string;         // processing level
  processingLabel?: string;   // human-readable processing label
  quantity: number;           // qty
  baseUnit: number;          // base price per unit
  creatorUnit: number;       // creator price per unit
  lineSubtotal: number;      // quantity × creatorUnit
};

// Creator Line Item (مخفي منه clientUnit وagencyMargin)
export interface CreatorLineItem {
  id: string;
  subcategory: string;
  quantity: number;
  processing: ProcessingLevel;
  
  // Creator pricing (ما يراه المبدع)
  baseUnit: number;        // السعر الأساس/وحدة (IQD)
  creatorUnit: number;     // سعر المبدع/وحدة (IQD) - baseUnit + معامل المبدع
  lineSubtotal: number;    // quantity × creatorUnit
  
  // ❌ مخفي عن المبدع:
  // clientUnit: number;
  // agencyMargin: number;
  // clientSubtotal: number;
  
  // Metadata
  status: 'pending' | 'in_progress' | 'completed' | 'delivered';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Creator Project Overview (للمبدع فقط)
export interface CreatorProjectOverview {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'paused';
  
  // Timeline
  startDate: string;
  deadline: string;
  estimatedDuration: number; // hours
  
  // Creator earnings summary
  totalLineItems: number;
  totalQuantity: number;
  myEarnings: number;        // مجموع أرباح المبدع (IQD)
  
  // ❌ مخفي عن المبدع:
  // clientBudget: number;
  // agencyRevenue: number;
  // profitMargin: number;
  
  // Progress tracking
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
  
  // Files summary
  uploadedFiles: number;
  reviewedFiles: number;
  deliveredFiles: number;
}

// Creator Task
export interface CreatorTask {
  id: string;
  title: string;
  description: string;
  lineItemId: string;       // مرتبطة بسطر معين
  subcategory: string;
  
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Timeline
  assignedAt: string;
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  
  // Creator notes
  notes?: string;
  attachments?: string[];
}

// Creator File Upload
export interface CreatorFileUpload {
  id: string;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  url?: string;
  thumbnail?: string;
  
  // Project context
  projectId: string;
  lineItemId?: string;
  taskId?: string;
  
  // Upload flow: Creator → Admin Review → Client Delivery
  status: 'uploaded' | 'admin_reviewing' | 'admin_approved' | 'sent_to_client' | 'client_approved';
  
  // Creator metadata
  creatorNotes?: string;
  processingLevel?: ProcessingLevel;
  version: number;
  
  // Timeline
  uploadedAt: string;
  reviewedAt?: string;
  sentToClientAt?: string;
  
  // ❌ مخفي عن المبدع:
  // adminNotes: string;
  // clientFeedback: string;
  // internalNotes: string;
}

// Creator Project Activity Log
export interface CreatorActivity {
  id: string;
  type: 'task_completed' | 'file_uploaded' | 'note_added' | 'processing_changed' | 'deadline_updated';
  title: string;
  description: string;
  
  // Context
  projectId: string;
  lineItemId?: string;
  taskId?: string;
  fileId?: string;
  
  // Creator info
  creatorId: string;
  creatorName: string;
  
  // Metadata
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

// Creator Dashboard Project Card Data
export interface CreatorProjectCard {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'paused';
  deadline: string;
  progressPercentage: number;
  
  // Creator earnings (always enabled)
  totalLineItems?: number;
  myEarnings?: number;      // IQD
  
  // Quick stats
  completedTasks: number;
  totalTasks: number;
  uploadedFiles: number;
  
  // ❌ مخفي عن المبدع:
  // clientBudget: number;
  // agencyRevenue: number;
}

// Creator Earnings Summary
export interface CreatorEarningsSummary {
  projectId: string;
  currency: 'IQD';
  
  // Line items breakdown
  lineItems: Array<{
    subcategory: string;
    quantity: number;
    creatorUnit: number;
    subtotal: number;
  }>;
  
  // Totals
  totalQuantity: number;
  totalEarnings: number;    // مجموع أرباح المبدع
  
  // ❌ مخفي عن المبدع:
  // clientTotal: number;
  // agencyMargin: number;
  // profitMargin: number;
}
