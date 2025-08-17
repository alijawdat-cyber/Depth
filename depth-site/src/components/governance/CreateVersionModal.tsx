"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Download, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { RateCardVersion } from "@/types/governance";

interface CreateVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateVersionState {
  reason: string;
  effectiveFrom: string;
  rateCard: RateCardVersion['rateCard'] | null;
  loading: boolean;
  error: string | null;
  loadingCurrent: boolean;
}

export default function CreateVersionModal({ isOpen, onClose, onSuccess }: CreateVersionModalProps) {
  const [state, setState] = useState<CreateVersionState>({
    reason: '',
    effectiveFrom: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
    rateCard: null,
    loading: false,
    error: null,
    loadingCurrent: false
  });

  const handleLoadCurrentRateCard = async () => {
    setState(prev => ({ ...prev, loadingCurrent: true, error: null }));
    
    try {
      const response = await fetch('/api/governance/current-base');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'فشل في تحميل التسعير الحالي');
      }
      
      const result = await response.json();
      
      if (result.success && result.rateCard) {
        setState(prev => ({ 
          ...prev, 
          rateCard: result.rateCard,
          loadingCurrent: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error || 'فشل في تحميل التسعير الحالي',
          loadingCurrent: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'خطأ في الاتصال بالخادم',
        loadingCurrent: false 
      }));
    }
  };

  const handleCreate = async () => {
    if (!state.reason.trim()) {
      setState(prev => ({ ...prev, error: 'سبب التغيير مطلوب' }));
      return;
    }
    
    if (!state.rateCard) {
      setState(prev => ({ ...prev, error: 'يجب تحميل أساس التسعير أولاً' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/governance/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: state.reason.trim(),
          effectiveFrom: state.effectiveFrom,
          rateCard: state.rateCard
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'فشل في إنشاء الإصدار');
      }

      // إغلاق المودال والعودة للصفحة الرئيسية
      onSuccess();
      onClose();
      
      // إعادة تعيين الحالة
      setState({
        reason: '',
        effectiveFrom: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
        rateCard: null,
        loading: false,
        error: null,
        loadingCurrent: false
      });

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--elev)]">
          <h2 className="text-xl font-bold text-[var(--text)]">إنشاء إصدار جديد</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={state.loading}
          >
            <X size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Display */}
          {state.error && (
            <div className="p-4 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-[var(--radius)] text-[var(--danger-fg)]">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span className="font-medium">{state.error}</span>
              </div>
            </div>
          )}

          {/* Reason Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text)]">
              سبب التغيير <span className="text-red-500">*</span>
            </label>
            <textarea
              value={state.reason}
              onChange={(e) => setState(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="اكتب سبب إنشاء هذا الإصدار..."
              className="w-full p-3 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] resize-none"
              rows={3}
              disabled={state.loading}
            />
          </div>

          {/* Effective Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text)]">
              تاريخ السريان <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" size={16} />
              <input
                type="datetime-local"
                value={state.effectiveFrom.slice(0, 16)}
                onChange={(e) => setState(prev => ({ 
                  ...prev, 
                  effectiveFrom: e.target.value + ':00.000Z' 
                }))}
                className="w-full pl-10 p-3 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                disabled={state.loading}
              />
            </div>
          </div>

          {/* Rate Card Base */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[var(--text)]">
              أساس التسعير <span className="text-red-500">*</span>
            </label>
            
            {!state.rateCard ? (
              <div className="border-2 border-dashed border-[var(--elev)] rounded-[var(--radius)] p-6 text-center">
                <Download className="mx-auto mb-3 text-[var(--muted)]" size={32} />
                <p className="text-[var(--muted)] mb-4">
                  لإنشاء إصدار جديد، يجب تحميل التسعير الحالي كأساس
                </p>
                <Button
                  onClick={handleLoadCurrentRateCard}
                  disabled={state.loadingCurrent || state.loading}
                >
                  {state.loadingCurrent ? 'جاري التحميل...' : 'استخدام التسعير الحالي كأساس'}
                </Button>
              </div>
            ) : (
              <div className="border border-[var(--elev)] rounded-[var(--radius)] p-4 bg-[var(--bg)]">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="font-medium text-[var(--text)]">تم تحميل التسعير الأساسي</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--muted)]">الأسعار الأساسية:</span>
                    <span className="text-[var(--text)] font-medium mr-2">
                      {Object.keys(state.rateCard.baseRates).length} فئة
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">المحاور:</span>
                    <span className="text-[var(--text)] font-medium mr-2">
                      {Object.keys(state.rateCard.modifiers?.verticals || {}).length} محور
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">معدل FX:</span>
                    <span className="text-[var(--text)] font-medium mr-2">
                      {state.rateCard.fx?.rate || 'غير محدد'} د.ع/دولار
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">مصدر FX:</span>
                    <span className="text-[var(--text)] font-medium mr-2">
                      {state.rateCard.fx?.source || 'يدوي'}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadCurrentRateCard}
                  disabled={state.loadingCurrent || state.loading}
                  className="mt-3"
                >
                  إعادة تحميل
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--elev)]">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={state.loading}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleCreate}
            disabled={state.loading || !state.reason.trim() || !state.rateCard}
          >
            {state.loading ? 'جاري الإنشاء...' : 'إنشاء الإصدار'}
          </Button>
        </div>
      </div>
    </div>
  );
}
