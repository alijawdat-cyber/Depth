"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { 
  Camera, 
  Video, 
  Palette, 
  Settings, 
  Calendar,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  TrendingUp,
  Award,
  Bell,
  MessageSquare
} from 'lucide-react';

interface CreatorData {
  id: string;
  fullName: string;
  role: string;
  status: 'pending' | 'intake_submitted' | 'under_review' | 'approved' | 'rejected';
  city: string;
  phone: string;
  canTravel: boolean;
  createdAt: string;
  intakeFormCompleted?: boolean;
}

interface ProjectStats {
  total: number;
  completed: number;
  ongoing: number;
  earnings: number;
}

export default function CreatorsPortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [creatorData, setCreatorData] = useState<CreatorData | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    total: 0,
    completed: 0,
    ongoing: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchCreatorData = useCallback(async () => {
    try {
      const response = await fetch('/api/creators/profile');
      if (response.ok) {
        const data = await response.json();
        setCreatorData(data.creator || data.profile);
        setProjectStats(data.stats || {
          total: 0,
          completed: 0,
          ongoing: 0,
          earnings: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch creator data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin?from=creators');
      return;
    }

    if (session.user.role !== 'creator') {
      router.push('/portal');
      return;
    }

    fetchCreatorData();
  }, [session, status, router, fetchCreatorData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'under_review': return 'text-yellow-600 bg-yellow-50';
      case 'intake_submitted': return 'text-blue-600 bg-blue-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'معتمد';
      case 'under_review': return 'قيد المراجعة';
      case 'intake_submitted': return 'تم تقديم النموذج';
      case 'rejected': return 'مرفوض';
      default: return 'في الانتظار';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'photographer': return <Camera size={20} className="text-blue-600" />;
      case 'videographer': return <Video size={20} className="text-red-600" />;
      case 'designer': return <Palette size={20} className="text-purple-600" />;
      case 'producer': return <Settings size={20} className="text-green-600" />;
      default: return <Camera size={20} className="text-blue-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      photographer: 'مصور',
      videographer: 'مصور فيديو',
      designer: 'مصمم',
      producer: 'منتج'
    };
    return labels[role as keyof typeof labels] || role;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)]" />
      </div>
    );
  }

  if (!creatorData) {
    return (
      <div className="min-h-screen bg-[var(--bg)] py-12">
        <Container>
          <div className="text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[var(--text)] mb-2">خطأ في تحميل البيانات</h1>
            <p className="text-[var(--muted)] mb-6">لم نتمكن من تحميل بيانات المبدع</p>
            <Button onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
                مرحباً، {creatorData.fullName}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRoleIcon(creatorData.role)}
                  <span className="text-[var(--muted)]">{getRoleLabel(creatorData.role)}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(creatorData.status)}`}>
                  {getStatusText(creatorData.status)}
                </div>
              </div>
            </div>
            <Button variant="outline">
              <Bell size={16} className="ml-1" />
              الإشعارات
            </Button>
          </div>

          {/* تنبيهات مهمة */}
          {creatorData.status === 'pending' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <FileText size={20} />
                <span className="font-medium">أكمل نموذج الانضمام التفصيلي</span>
              </div>
              <p className="text-blue-700 text-sm mb-3">
                يتطلب إكمال نموذج التفاصيل المهنية للبدء في استلام المشاريع
              </p>
              <Button 
                size="sm"
                onClick={() => router.push('/creators/intake')}
              >
                إكمال النموذج
              </Button>
            </div>
          )}

          {creatorData.status === 'under_review' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <Clock size={20} />
                <span className="font-medium">طلبك قيد المراجعة</span>
              </div>
              <p className="text-yellow-700 text-sm">
                سيتم الرد عليك خلال 2-3 أيام عمل بعد مراجعة ملفك الشخصي
              </p>
            </div>
          )}

          {creatorData.status === 'approved' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <CheckCircle size={20} />
                <span className="font-medium">🎉 تم قبولك كمبدع!</span>
              </div>
              <p className="text-green-700 text-sm">
                يمكنك الآن استلام المشاريع والبدء في العمل معنا
              </p>
            </div>
          )}
        </motion.div>

        {/* إحصائيات سريعة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{projectStats.total}</div>
                <div className="text-sm text-[var(--muted)]">إجمالي المشاريع</div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{projectStats.completed}</div>
                <div className="text-sm text-[var(--muted)]">مكتملة</div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{projectStats.ongoing}</div>
                <div className="text-sm text-[var(--muted)]">جارية</div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">${projectStats.earnings}</div>
                <div className="text-sm text-[var(--muted)]">الأرباح</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* القائمة الرئيسية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)]">المشاريع</h3>
                <p className="text-sm text-[var(--muted)]">إدارة مشاريعك الحالية</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/creators/projects')}
            >
              عرض المشاريع
            </Button>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)]">الأرباح</h3>
                <p className="text-sm text-[var(--muted)]">تتبع أرباحك والمدفوعات</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/creators/earnings')}
            >
              عرض الأرباح
            </Button>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <User size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)]">الملف الشخصي</h3>
                <p className="text-sm text-[var(--muted)]">تحديث معلوماتك</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/creators/profile')}
            >
              تحديث الملف
            </Button>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star size={24} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)]">التقييمات</h3>
                <p className="text-sm text-[var(--muted)]">آراء العملاء</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/creators/reviews')}
            >
              عرض التقييمات
            </Button>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <MessageSquare size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)]">الدعم</h3>
                <p className="text-sm text-[var(--muted)]">تواصل مع الفريق</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/creators/support')}
            >
              تواصل معنا
            </Button>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Award size={24} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)]">الإنجازات</h3>
                <p className="text-sm text-[var(--muted)]">شاراتك وإنجازاتك</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/creators/achievements')}
            >
              عرض الإنجازات
            </Button>
          </div>
        </motion.div>

        {/* نصائح للمبدعين الجدد */}
        {creatorData.status === 'approved' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200"
          >
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
              <TrendingUp className="text-[var(--accent-500)]" size={20} />
              نصائح لزيادة نجاحك:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-[var(--text)] mb-1">حافظ على جودة عالية</h4>
                  <p className="text-sm text-[var(--muted)]">اهتم بتفاصيل عملك لضمان رضا العملاء</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-[var(--text)] mb-1">التزم بالمواعيد</h4>
                  <p className="text-sm text-[var(--muted)]">سلم مشاريعك في الوقت المحدد</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-[var(--text)] mb-1">تواصل بفعالية</h4>
                  <p className="text-sm text-[var(--muted)]">ابق على تواصل مستمر مع العملاء</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-[var(--text)] mb-1">طور مهاراتك</h4>
                  <p className="text-sm text-[var(--muted)]">استمر في تعلم تقنيات جديدة</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
