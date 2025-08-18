import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// دالة تحديد دور المستخدم (نسخة محلية)
async function determineUserRole(email: string): Promise<string> {
  if (!email) return 'client';
  
  const emailLower = email.toLowerCase();
  
  try {
    // تحقق من قائمة الأدمن في متغيرات البيئة أولاً
    const adminList = (process.env.ADMIN_EMAILS || 'admin@depth-agency.com')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    if (adminList.includes(emailLower)) return 'admin';
    
    // افتراضي: client
    return 'client';
  } catch (error) {
    console.error('[determineUserRole] Error:', error);
    return 'client';
  }
}

// GET /api/admin/users
// جلب جميع المستخدمين مع الإحصائيات - للإدمن فقط
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للإدمن فقط' 
      }, { status: 403 });
    }

    // جلب جميع المستخدمين من مجموعة users الموحدة
    const users = [];

    // إحصائيات
    let totalUsers = 0;
    const statusCounts = {
      active: 0,
      inactive: 0,
      pending: 0,
      suspended: 0,
      banned: 0
    };

    const roleCounts = {
      admins: 0,
      employees: 0,
      creators: 0,
      clients: 0
    };

    let verifiedUsers = 0;
    let twoFactorUsers = 0;
    let newUsersThisMonth = 0;
    
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    try {
      // قراءة جميع المستخدمين من users collection
      const snapshot = await adminDb
        .collection('users')
        .orderBy('email', 'asc')
        .get();

      for (const doc of snapshot.docs) {
        const userData = doc.data();
        totalUsers++;
        
        // تحديد الدور باستخدام دالة determineUserRole
        const userRole = await determineUserRole(userData.email || '');
        
        // حساب الإحصائيات
        const status = userData.status || 'active';
        statusCounts[status as keyof typeof statusCounts]++;
        
        if (userRole === 'admin') roleCounts.admins++;
        else if (userRole === 'employee') roleCounts.employees++;
        else if (userRole === 'creator') roleCounts.creators++;
        else roleCounts.clients++;
        
        if (userData.emailVerified) verifiedUsers++;
        if (userData.twoFactorEnabled) twoFactorUsers++;
        
        const createdAt = userData.createdAt?.toDate?.() || new Date();
        if (createdAt >= currentMonth) newUsersThisMonth++;
        
        const user = {
          id: doc.id,
          role: userRole,
          status: status,
          name: userData.name || userData.displayName || 'غير محدد',
          email: userData.email || '',
          phone: userData.phone || null,
          avatar: userData.avatar || userData.photoURL || null,
          company: userData.company || null,
          industry: userData.industry || null,
          skills: userData.skills || null,
          tier: userData.tier || null,
          modifier: userData.modifier || null,
          portfolio: userData.portfolio || null,
          department: userData.department || null,
          position: userData.position || null,
          permissions: userRole === 'admin' ? ['all'] : userData.permissions || null,
          stats: null,
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString(),
          lastLoginAt: userData.lastLoginAt || null,
          emailVerified: userData.emailVerified || false,
          twoFactorEnabled: userData.twoFactorEnabled || false,
          loginAttempts: userData.loginAttempts || 0,
          lockedUntil: userData.lockedUntil || null,
        };

        users.push(user);
      }

    } catch (error) {
      console.warn(`Failed to fetch users:`, error);
    }

    const stats = {
      total: totalUsers,
      active: statusCounts.active,
      inactive: statusCounts.inactive,
      pending: statusCounts.pending,
      suspended: statusCounts.suspended,
      banned: statusCounts.banned,
      admins: roleCounts.admins,
      employees: roleCounts.employees,
      creators: roleCounts.creators,
      clients: roleCounts.clients,
      verifiedUsers,
      twoFactorUsers,
      newUsersThisMonth
    };

    return NextResponse.json({
      success: true,
      users,
      stats,
      total: users.length
    });

  } catch (error) {
    console.error('[admin.users.GET] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في الخادم' 
    }, { status: 500 });
  }
}
