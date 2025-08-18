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

    for (const collection of collections) {
      try {
        const snapshot = await adminDb
          .collection(collection)
          .orderBy('createdAt', 'desc')
          .get();

        for (const doc of snapshot.docs) {
          const userData = doc.data();
          
          // تحديد الدور حسب المجموعة
          let role = 'client';
          switch (collection) {
            case 'admins': role = 'admin'; break;
            case 'employees': role = 'employee'; break;
            case 'creators': role = 'creator'; break;
            case 'clients': role = 'client'; break;
          }

          // حساب الإحصائيات للمستخدم
          let userStats = null;
          if (collection === 'creators' || collection === 'clients') {
            userStats = await calculateUserStats(doc.id, role);
          }

          const user = {
            id: doc.id,
            role,
            status: userData.status || 'pending',
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
            permissions: userData.permissions || null,
            stats: userStats,
            createdAt: userData.createdAt || new Date().toISOString(),
            updatedAt: userData.updatedAt || new Date().toISOString(),
            lastLoginAt: userData.lastLoginAt || null,
            emailVerified: userData.emailVerified || false,
            phoneVerified: userData.phoneVerified || false,
            twoFactorEnabled: userData.twoFactorEnabled || false,
            location: userData.location || null
          };

          users.push(user);
          totalUsers++;

          // تحديث إحصائيات الحالة
          const status = user.status;
          if (status in statusCounts) {
            statusCounts[status as keyof typeof statusCounts]++;
          }

          // تحديث إحصائيات الأدوار
          roleCounts[collection as keyof typeof roleCounts]++;

          // تحديث الإحصائيات الأخرى
          if (user.emailVerified) verifiedUsers++;
          if (user.twoFactorEnabled) twoFactorUsers++;

          // المستخدمين الجدد هذا الشهر
          const createdAt = new Date(user.createdAt);
          if (createdAt >= currentMonth) {
            newUsersThisMonth++;
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch ${collection}:`, error);
      }
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
      stats
    });

  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في جلب المستخدمين' 
    }, { status: 500 });
  }
}

// POST /api/admin/users
// إنشاء مستخدم جديد - للإدمن فقط
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const {
      role,
      name,
      email,
      phone,
      company,
      department,
      position
    } = body;

    // التحقق من صحة البيانات
    if (!role || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'الدور والاسم والبريد الإلكتروني مطلوبة' 
      }, { status: 400 });
    }

    // التحقق من عدم وجود المستخدم مسبقاً
    const existingUserCollections = ['admins', 'employees', 'creators', 'clients'];
    for (const collection of existingUserCollections) {
      const existingQuery = await adminDb
        .collection(collection)
        .where('email', '==', email.toLowerCase())
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        return NextResponse.json({ 
          success: false, 
          error: 'المستخدم موجود مسبقاً' 
        }, { status: 400 });
      }
    }

    // تحديد المجموعة حسب الدور
    let collectionName = 'clients';
    switch (role) {
      case 'admin': collectionName = 'admins'; break;
      case 'employee': collectionName = 'employees'; break;
      case 'creator': collectionName = 'creators'; break;
      case 'client': collectionName = 'clients'; break;
    }

    // إنشاء بيانات المستخدم
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      status: 'pending',
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session.user.email,
      ...(phone && { phone: phone.trim() }),
      ...(company && { company: company.trim() }),
      ...(department && { department: department.trim() }),
      ...(position && { position: position.trim() })
    };

    // إضافة بيانات خاصة بكل دور
    if (role === 'creator') {
      userData.skills = [];
      userData.tier = 'bronze';
      userData.modifier = 1.0;
      userData.portfolio = [];
    } else if (role === 'employee') {
      userData.permissions = [];
    }

    const userRef = await adminDb
      .collection(collectionName)
      .add(userData);

    // إرجاع المستخدم المُنشأ
    const user = {
      id: userRef.id,
      role,
      ...userData
    };

    // تسجيل في Audit Log
    await adminDb
      .collection('audit_logs')
      .add({
        action: 'user_created',
        entityType: 'user',
        entityId: userRef.id,
        userId: session.user.email,
        details: {
          userRole: role,
          userName: name,
          userEmail: email,
          collection: collectionName
        },
        timestamp: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Admin user creation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في إنشاء المستخدم' 
    }, { status: 500 });
  }
}

// دالة حساب إحصائيات المستخدم
async function calculateUserStats(userId: string, role: string) {
  try {
    let projectsCount = 0;
    let totalValue = 0;
    let averageRating = 0;
    let completionRate = 0;
    let lastActivity = '';

    if (role === 'creator') {
      // جلب مشاريع المبدع
      const projectsQuery = await adminDb
        .collection('projects')
        .where('assignedCreators', 'array-contains', userId)
        .get();

      projectsCount = projectsQuery.size;

      let completedProjects = 0;
      let totalRatings = 0;
      let ratingsCount = 0;

      for (const doc of projectsQuery.docs) {
        const project = doc.data();
        
        // حساب القيمة للمبدع
        if (project.creatorRates && project.creatorRates[userId]) {
          totalValue += project.creatorRates[userId] || 0;
        }

        // حساب معدل الإكمال
        if (project.status === 'completed' || project.status === 'delivered') {
          completedProjects++;
        }

        // حساب التقييم
        if (project.creatorRatings && project.creatorRatings[userId]) {
          totalRatings += project.creatorRatings[userId];
          ratingsCount++;
        }

        // آخر نشاط
        if (project.updatedAt && project.updatedAt > lastActivity) {
          lastActivity = project.updatedAt;
        }
      }

      completionRate = projectsCount > 0 ? Math.round((completedProjects / projectsCount) * 100) : 0;
      averageRating = ratingsCount > 0 ? totalRatings / ratingsCount : 0;

    } else if (role === 'client') {
      // جلب مشاريع العميل
      const projectsQuery = await adminDb
        .collection('projects')
        .where('clientId', '==', userId)
        .get();

      projectsCount = projectsQuery.size;

      let completedProjects = 0;

      for (const doc of projectsQuery.docs) {
        const project = doc.data();
        
        // حساب القيمة الإجمالية
        totalValue += project.totalIQD || 0;

        // حساب معدل الإكمال
        if (project.status === 'completed' || project.status === 'delivered') {
          completedProjects++;
        }

        // آخر نشاط
        if (project.updatedAt && project.updatedAt > lastActivity) {
          lastActivity = project.updatedAt;
        }
      }

      completionRate = projectsCount > 0 ? Math.round((completedProjects / projectsCount) * 100) : 0;
    }

    return {
      projectsCount,
      totalValue,
      averageRating,
      completionRate,
      lastActivity: lastActivity || new Date().toISOString()
    };

  } catch (error) {
    console.warn('Failed to calculate user stats:', error);
    return {
      projectsCount: 0,
      totalValue: 0,
      averageRating: 0,
      completionRate: 0,
      lastActivity: new Date().toISOString()
    };
  }
}
