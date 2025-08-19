import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import type { UnifiedUser } from '@/types/unified-user';
import type { Query, DocumentData } from 'firebase-admin/firestore';

// GET /api/admin/users - النظام الموحد
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    // تحقق من أن المستخدم admin
    const userRole = (session.user as { role?: string }).role;
    
    if (userRole !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للإدمن فقط' 
      }, { status: 403 });
    }

    // استخراج معاملات البحث والفلترة
    const { searchParams } = new URL(req.url);
    const roleFilter = searchParams.get('role');
    const statusFilter = searchParams.get('status');
    const searchQuery = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');

    // بناء الاستعلام الأساسي
    let query: Query<DocumentData> = adminDb.collection('users');

    // فلترة حسب الدور
    if (roleFilter && roleFilter !== 'all') {
      query = query.where('role', '==', roleFilter);
    }

    // فلترة حسب الحالة
    if (statusFilter && statusFilter !== 'all') {
      query = query.where('status', '==', statusFilter);
    }

    // ترتيب حسب تاريخ الإنشاء
    query = query.orderBy('createdAt', 'desc').limit(limit);

    const snapshot = await query.get();
    const users: UnifiedUser[] = [];

    // معالجة النتائج
    snapshot.docs.forEach((doc) => {
      const userData = doc.data() as Omit<UnifiedUser, 'id'>;
      const user: UnifiedUser = {
        id: doc.id,
        ...userData
      };

      // فلترة البحث النصي
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          (user.phone && user.phone.includes(searchQuery));
        
        if (matchesSearch) {
          users.push(user);
        }
      } else {
        users.push(user);
      }
    });

    // حساب الإحصائيات
    const allUsersSnapshot = await adminDb.collection('users').get();
    const stats = {
      total: allUsersSnapshot.size,
      pending: 0,
      active: 0,
      inactive: 0,
      suspended: 0,
      byRole: { 
        admin: 0, 
        creator: 0, 
        client: 0, 
        employee: 0 
      }
    };

    let verified = 0;

    allUsersSnapshot.docs.forEach(doc => {
      const userData = doc.data() as UnifiedUser;
      
      // إحصائيات الحالة (اعتبار كل حالات الانضمام قيد الانتظار)
      if (userData.status === 'active') {
        stats.active++;
      } else if (
        userData.status === 'pending' ||
        userData.status === 'onboarding_started' ||
        userData.status === 'intake_submitted' ||
        userData.status === 'under_review'
      ) {
        stats.pending++;
      } else if (userData.status === 'suspended') {
        stats.suspended++;
      } else {
        stats.inactive++;
      }

      // إحصائيات الأدوار
      if (userData.role === 'admin') stats.byRole.admin++;
      else if (userData.role === 'creator') stats.byRole.creator++;
      else if (userData.role === 'client') stats.byRole.client++;
      else if (userData.role === 'employee') stats.byRole.employee++;

      // المستخدمين المفعلين
      if (userData.emailVerified) verified++;
    });

    console.log(`✅ [ADMIN] تم جلب ${users.length} مستخدم - المجموع: ${stats.total}`);

    return NextResponse.json({
      success: true,
      users,
      stats: {
        ...stats,
        verified
      },
      pagination: {
        total: users.length,
        limit,
        hasMore: users.length === limit
      }
    });

  } catch (error) {
    console.error('❌ خطأ في جلب المستخدمين:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم'
    }, { status: 500 });
  }
}
