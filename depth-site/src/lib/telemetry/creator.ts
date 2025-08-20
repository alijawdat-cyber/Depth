// Creator-specific telemetry for Sprint 3
// Tracks creator interactions with projects, files, and earnings

export interface CreatorTelemetryEvent {
  // Event identification
  event: CreatorEventType;
  timestamp: string;
  sessionId: string;
  userId: string;
  
  // Creator context
  projectId?: string;
  lineItemId?: string;
  taskId?: string;
  fileId?: string;
  
  // Event data (masked for sensitive info)
  data?: CreatorEventData;
}

export type CreatorEventType = 
  | 'cr_proj_view'              // فتح تفاصيل مشروع
  | 'cr_line_view'              // عرض تبويب Line Items
  | 'cr_file_upload'            // رفع ملف
  | 'cr_req_processing_change'  // طلب تغيير processing
  | 'cr_tabs_nav'               // التنقل بين التبويبات
  | 'cr_task_complete'          // إكمال مهمة
  | 'cr_earnings_view'          // عرض الأرباح
  | 'cr_note_add';              // إضافة ملاحظة

export interface CreatorEventData {
  // Tab navigation
  fromTab?: string;
  toTab?: string;
  
  // File upload
  fileSize?: number;
  fileType?: string;
  processingLevel?: string;
  
  // Processing change request
  fromProcessing?: string;
  toProcessing?: string;
  reason?: string;
  
  // Task completion
  taskType?: string;
  completionTime?: number; // minutes
  
  // Earnings view
  totalEarnings?: number;   // Masked: only ranges, not exact amounts
  lineItemsCount?: number;
  
  // Performance metrics
  loadTime?: number;
  userAgent?: string;
  
  // ❌ Never log sensitive data:
  // clientBudget, agencyMargin, specific amounts, personal info
}

// Telemetry helper functions
export class CreatorTelemetry {
  private static sessionId = typeof crypto?.randomUUID === 'function' 
    ? crypto.randomUUID() 
    : `session-${Date.now()}`;

  // Track project view
  static trackProjectView(projectId: string, userId: string) {
    this.track('cr_proj_view', userId, { projectId });
  }

  // Track line items view  
  static trackLineItemsView(projectId: string, userId: string, lineItemsCount: number) {
    this.track('cr_line_view', userId, { 
      projectId,
      data: { lineItemsCount }
    });
  }

  // Track file upload
  static trackFileUpload(
    projectId: string, 
    userId: string, 
    fileSize: number, 
    fileType: string,
    processingLevel?: string
  ) {
    this.track('cr_file_upload', userId, {
      projectId,
      data: {
        fileSize: this.maskFileSize(fileSize),
        fileType,
        processingLevel
      }
    });
  }

  // Track processing change request
  static trackProcessingChangeRequest(
    projectId: string,
    userId: string,
    fromProcessing: string,
    toProcessing: string,
    reason?: string
  ) {
    this.track('cr_req_processing_change', userId, {
      projectId,
      data: {
        fromProcessing,
        toProcessing,
        reason
      }
    });
  }

  // Track tab navigation
  static trackTabNavigation(
    projectId: string,
    userId: string,
    fromTab: string,
    toTab: string
  ) {
    this.track('cr_tabs_nav', userId, {
      projectId,
      data: { fromTab, toTab }
    });
  }

  // Track earnings view (with masking)
  static trackEarningsView(
    projectId: string,
    userId: string,
    totalEarnings: number,
    lineItemsCount: number
  ) {
    this.track('cr_earnings_view', userId, {
      projectId,
      data: {
        totalEarnings: this.maskEarnings(totalEarnings),
        lineItemsCount
      }
    });
  }

  // Core tracking method
  private static track(
    event: CreatorEventType,
    userId: string,
    context: {
      projectId?: string;
      lineItemId?: string;
      taskId?: string;
      fileId?: string;
      data?: Partial<CreatorEventData>;
    }
  ) {
    const telemetryEvent: CreatorTelemetryEvent = {
      event,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId,
      ...context
    };

    // Send to telemetry service (implementation depends on your setup)
    this.sendTelemetry(telemetryEvent);
  }

  // Data masking for privacy
  private static maskEarnings(amount: number): number {
    // Round to nearest 10k IQD for privacy
    return Math.round(amount / 10000) * 10000;
  }

  private static maskFileSize(size: number): number {
    // Round to nearest MB
    return Math.round(size / (1024 * 1024));
  }

  // Send telemetry (implement based on your analytics service)
  private static sendTelemetry(event: CreatorTelemetryEvent) {
    // Development: log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('[CreatorTelemetry]', event);
    }

    // Production: send to analytics service
    // Example: analytics.track(event);
    
    // Could also store in local analytics queue for batch sending
    if (typeof window !== 'undefined') {
      const queue = JSON.parse(localStorage.getItem('creator_telemetry_queue') || '[]');
      queue.push(event);
      
      // Keep only last 100 events
      if (queue.length > 100) {
        queue.shift();
      }
      
      localStorage.setItem('creator_telemetry_queue', JSON.stringify(queue));
    }
  }

  // Batch send telemetry (call periodically)
  static flushTelemetry() {
    if (typeof window === 'undefined') return;
    
    const queue = JSON.parse(localStorage.getItem('creator_telemetry_queue') || '[]');
    if (queue.length === 0) return;

    // Send batch to server
    fetch('/api/telemetry/creator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: queue })
    }).then(() => {
      // Clear queue on successful send
      localStorage.setItem('creator_telemetry_queue', '[]');
    }).catch(error => {
      console.warn('Failed to send creator telemetry:', error);
    });
  }
}
