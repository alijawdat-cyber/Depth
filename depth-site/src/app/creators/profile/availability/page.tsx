// صفحة إدارة التوفر في لوحة المبدع
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, RefreshCw } from 'lucide-react';
import AvailabilityManager from '@/components/creators/dashboard/AvailabilityManager';
import Link from 'next/link';

export default function CreatorAvailabilityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // التحقق من الصلاحيات
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin?from=' + encodeURIComponent('/creators/profile/availability'));
      return;
    }

    if (session.user.role !== 'creator') {
      router.push('/portal');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={32} className="animate-spin text-[var(--accent-500)] mx-auto mb-4" />
          <p className="text-[var(--muted)]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'creator') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/creators/profile"
                className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                <ArrowLeft size={20} />
                <span>العودة للملف الشخصي</span>
              </Link>
              
              <div className="h-6 w-px bg-[var(--border)]"></div>
              
              <div className="flex items-center gap-3">
                <Calendar size={24} className="text-[var(--accent-500)]" />
                <div>
                  <h1 className="text-xl font-bold text-[var(--text)]">إدارة التوفر</h1>
                  <p className="text-sm text-[var(--muted)]">جدولك الأسبوعي وأوقات العمل</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-[var(--muted)]">
                مرحباً، {session.user.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* نصائح سريعة */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-blue-800 mb-2">💡 نصائح لإدارة التوفر</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <p className="font-medium mb-2">⏰ كن دقيقاً في أوقاتك:</p>
                    <ul className="space-y-1">
                      <li>• حدد أوقات البداية والنهاية بدقة</li>
                      <li>• أضف فترات استراحة إذا لزم الأمر</li>
                      <li>• احرص على الالتزام بالجدول المحدد</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">🎯 تحسين الفرص:</p>
                    <ul className="space-y-1">
                      <li>• التوفر في نهايات الأسبوع مطلوب</li>
                      <li>• المرونة في الأوقات تزيد الطلب</li>
                      <li>• يمكن تعديل الجدول في أي وقت</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* مكوّن إدارة التوفر */}
          <AvailabilityManager />

          {/* معلومات إضافية */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">كيف يؤثر جدولك على المشاريع؟</h3>
              <div className="space-y-3 text-sm text-[var(--muted)]">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>يتم مطابقة المشاريع حسب أوقات توفرك المحددة</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>العملاء يشوفون أوقات توفرك عند الحجز</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>التوفر في أوقات ذروة يزيد من الطلب عليك</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">المشاريع العاجلة</h3>
              <div className="space-y-3 text-sm text-[var(--muted)]">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>تسليم خلال 24-48 ساعة</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>أجر إضافي 25-50% حسب الاستعجال</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>يمكن تفعيل/إلغاء في أي وقت</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
