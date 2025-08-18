// صفحة إدارة المعدات المخصصة المقترحة من المبدعين
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Check, 
  X, 
  Edit, 
  Clock,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CustomEquipmentModifications {
  name?: string;
  brand?: string;
  model?: string;
  description?: string;
  category?: string;
}

interface CustomEquipment {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  description: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'changes_requested';
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  changeRequests?: string;
  adminModifications?: CustomEquipmentModifications;
}

export default function CustomEquipmentManagement() {
  const [equipment, setEquipment] = useState<CustomEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('pending_review');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<CustomEquipment | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'request_changes'>('approve');
  const [feedback, setFeedback] = useState('');
  const [modifications, setModifications] = useState({
    name: '',
    brand: '',
    model: '',
    description: ''
  });

  // جلب المعدات المخصصة
  const fetchCustomEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filter) params.append('status', filter);
      
      const response = await fetch(`/api/admin/catalog/equipment/custom?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setEquipment(data.data || []);
      } else {
        setError(data.error || 'فشل في جلب البيانات');
      }
    } catch {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // مراجعة معدة
  const reviewEquipment = async () => {
    if (!selectedItem) return;

    try {
      const response = await fetch('/api/admin/catalog/equipment/custom', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: selectedItem.id,
          action: reviewAction,
          feedback,
          modifications: reviewAction === 'approve' ? modifications : undefined
        })
      });

      if (response.ok) {
        setShowReviewModal(false);
        setSelectedItem(null);
        setFeedback('');
        setModifications({ name: '', brand: '', model: '', description: '' });
        fetchCustomEquipment(); // إعادة تحميل البيانات
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'حدث خطأ في المراجعة');
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    }
  };

  // فلترة البيانات
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  useEffect(() => {
    fetchCustomEquipment();
  }, [filter, fetchCustomEquipment]);

  // فتح مودال المراجعة
  const openReviewModal = (item: CustomEquipment, action: 'approve' | 'reject' | 'request_changes') => {
    setSelectedItem(item);
    setReviewAction(action);
    setModifications({
      name: item.name,
      brand: item.brand,
      model: item.model,
      description: item.description
    });
    setShowReviewModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-500" size={16} />;
      case 'rejected': return <XCircle className="text-red-500" size={16} />;
      case 'changes_requested': return <Edit className="text-orange-500" size={16} />;
      default: return <Clock className="text-yellow-500" size={16} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'معتمد';
      case 'rejected': return 'مرفوض';
      case 'changes_requested': return 'يحتاج تعديل';
      default: return 'قيد المراجعة';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-3">
            <Package size={28} />
            إدارة المعدات المخصصة
          </h1>
          <p className="text-[var(--muted)] mt-1">
            مراجعة واعتماد المعدات المقترحة من المبدعين
          </p>
        </div>
        
        <Button onClick={fetchCustomEquipment} disabled={loading}>
          تحديث البيانات
        </Button>
      </div>

      {/* فلاتر وبحث */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* فلتر الحالة */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              حالة المراجعة
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
            >
              <option value="pending_review">قيد المراجعة</option>
              <option value="approved">معتمد</option>
              <option value="rejected">مرفوض</option>
              <option value="changes_requested">يحتاج تعديل</option>
              <option value="">الكل</option>
            </select>
          </div>

          {/* البحث */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              البحث
            </label>
            <div className="relative">
              <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم، الماركة، أو المبدع..."
                className="w-full pl-4 pr-10 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
              />
            </div>
          </div>

          {/* عداد النتائج */}
          <div className="flex items-end">
            <div className="text-sm text-[var(--muted)]">
              {filteredEquipment.length} من {equipment.length} معدة
            </div>
          </div>
        </div>
      </div>

      {/* قائمة المعدات */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-[var(--accent-500)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">جاري التحميل...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-700">{error}</p>
        </div>
      ) : filteredEquipment.length === 0 ? (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-12 text-center">
          <Package size={48} className="text-[var(--muted)] mx-auto mb-4" />
          <p className="text-[var(--muted)]">لا توجد معدات مخصصة حسب المعايير المحددة</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEquipment.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-[var(--text)]">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className="text-sm">{getStatusLabel(item.status)}</span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>الماركة:</strong> {item.brand}</p>
                      <p><strong>الموديل:</strong> {item.model || 'غير محدد'}</p>
                      <p><strong>الفئة:</strong> {item.category}</p>
                    </div>
                    <div>
                      <p><strong>المبدع:</strong> {item.submittedBy}</p>
                      <p><strong>تاريخ الإرسال:</strong> {new Date(item.submittedAt).toLocaleDateString('ar-IQ')}</p>
                      {item.reviewedAt && (
                        <p><strong>تاريخ المراجعة:</strong> {new Date(item.reviewedAt).toLocaleDateString('ar-IQ')}</p>
                      )}
                    </div>
                  </div>
                  
                  {item.description && (
                    <div className="mt-3 p-3 bg-[var(--bg-alt)] rounded-lg">
                      <p className="text-sm text-[var(--text)]">{item.description}</p>
                    </div>
                  )}
                </div>

                {/* أزرار الإجراءات */}
                {item.status === 'pending_review' && (
                  <div className="flex gap-2 mr-4">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => openReviewModal(item, 'approve')}
                    >
                      <Check size={16} />
                      اعتماد
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openReviewModal(item, 'request_changes')}
                    >
                      <Edit size={16} />
                      طلب تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openReviewModal(item, 'reject')}
                    >
                      <X size={16} />
                      رفض
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* مودال المراجعة */}
      {showReviewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {reviewAction === 'approve' ? 'اعتماد المعدة' :
                 reviewAction === 'reject' ? 'رفض المعدة' :
                 'طلب تعديلات'}
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X size={24} />
              </button>
            </div>

            {/* معلومات المعدة */}
            <div className="bg-[var(--bg-alt)] rounded-lg p-4 mb-6">
              <h4 className="font-bold mb-2">{selectedItem.name}</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>الماركة:</strong> {selectedItem.brand}</p>
                  <p><strong>الموديل:</strong> {selectedItem.model}</p>
                  <p><strong>الفئة:</strong> {selectedItem.category}</p>
                </div>
                <div>
                  <p><strong>المبدع:</strong> {selectedItem.submittedBy}</p>
                  <p><strong>تاريخ الإرسال:</strong> {new Date(selectedItem.submittedAt).toLocaleDateString('ar-IQ')}</p>
                </div>
              </div>
              {selectedItem.description && (
                <div className="mt-3">
                  <p><strong>الوصف:</strong> {selectedItem.description}</p>
                </div>
              )}
            </div>

            {/* تعديلات الأدمن (للاعتماد فقط) */}
            {reviewAction === 'approve' && (
              <div className="space-y-4 mb-6">
                <h4 className="font-bold">تعديلات اختيارية قبل الاعتماد:</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">اسم المعدة</label>
                    <input
                      type="text"
                      value={modifications.name}
                      onChange={(e) => setModifications(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">الماركة</label>
                    <input
                      type="text"
                      value={modifications.brand}
                      onChange={(e) => setModifications(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">الموديل</label>
                  <input
                    type="text"
                    value={modifications.model}
                    onChange={(e) => setModifications(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">الوصف</label>
                  <textarea
                    value={modifications.description}
                    onChange={(e) => setModifications(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg resize-none"
                  />
                </div>
              </div>
            )}

            {/* ملاحظات المراجعة */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                {reviewAction === 'approve' ? 'ملاحظات الاعتماد (اختياري)' :
                 reviewAction === 'reject' ? 'سبب الرفض' :
                 'التعديلات المطلوبة'}
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={
                  reviewAction === 'approve' ? 'ملاحظات إضافية...' :
                  reviewAction === 'reject' ? 'اذكر سبب رفض هذه المعدة...' :
                  'حدد التعديلات المطلوبة...'
                }
                rows={4}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg resize-none"
                required={reviewAction !== 'approve'}
              />
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowReviewModal(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button
                variant={reviewAction === 'approve' ? 'primary' : reviewAction === 'reject' ? 'ghost' : 'secondary'}
                onClick={reviewEquipment}
                disabled={reviewAction !== 'approve' && !feedback.trim()}
                className="flex-1"
              >
                {reviewAction === 'approve' ? 'اعتماد وإضافة للكاتالوج' :
                 reviewAction === 'reject' ? 'رفض المعدة' :
                 'طلب التعديلات'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
