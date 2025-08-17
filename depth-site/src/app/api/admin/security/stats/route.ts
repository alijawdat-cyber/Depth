import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// GET /api/admin/security/stats
// جلب إحصائيات الأمان - للإدمن فقط
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

    // جلب إحصائيات من المجموعات المختلفة
    const collections = ['admins', 'employees', 'creators', 'clients'];
    
    let totalUsers = 0;
    let activeUsers = 0;
    let users2FA = 0;
    let lockedAccounts = 0;

    // حساب إحصائيات المستخدمين
    for (const collection of collections) {
      try {
        const snapshot = await adminDb.collection(collection).get();
        
        for (const doc of snapshot.docs) {
          const userData = doc.data();
          totalUsers++;
          
          if (userData.status === 'active') {
            activeUsers++;
          }
          
          if (userData.twoFactorEnabled) {
            users2FA++;
          }
          
          if (userData.status === 'locked' || userData.status === 'suspended') {
            lockedAccounts++;
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch ${collection} for security stats:`, error);
      }
    }

    // حساب الأحداث الأمنية اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let failedLoginsToday = 0;
    let securityEventsToday = 0;
    let criticalEvents = 0;

    try {
      const eventsSnapshot = await adminDb
        .collection('security_events')
        .where('timestamp', '>=', today.toISOString())
        .get();
      
      securityEventsToday = eventsSnapshot.size;
      
      eventsSnapshot.docs.forEach(doc => {
        const eventData = doc.data();
        
        if (eventData.type === 'failed_login') {
          failedLoginsToday++;
        }
        
        if (eventData.severity === 'critical') {
          criticalEvents++;
        }
      });
    } catch (error) {
      console.warn('Failed to fetch security events:', error);
    }

    // حساب نقاط الامتثال
    let complianceScore = 100;
    
    // تقليل النقاط حسب المعايير
    if (users2FA / totalUsers < 0.8) { // أقل من 80% يستخدمون 2FA
      complianceScore -= 10;
    }
    
    if (lockedAccounts / totalUsers > 0.05) { // أكثر من 5% حسابات مقفلة
      complianceScore -= 15;
    }
    
    if (failedLoginsToday > 10) { // أكثر من 10 محاولات فاشلة اليوم
      complianceScore -= 5;
    }
    
    if (criticalEvents > 0) { // وجود أحداث حرجة
      complianceScore -= 20;
    }

    const stats = {
      totalUsers,
      activeUsers,
      users2FA,
      lockedAccounts,
      failedLoginsToday,
      securityEventsToday,
      criticalEvents,
      complianceScore: Math.max(0, complianceScore) // لا تقل عن 0
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Security stats fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في جلب إحصائيات الأمان' 
    }, { status: 500 });
  }
}
