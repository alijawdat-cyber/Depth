import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// GET /api/creators/profile
// الحصول على بيانات المبدع المسجل دخوله
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    if (session.user.role !== 'creator') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للمبدعين فقط' 
      }, { status: 403 });
    }

    const email = session.user.email.toLowerCase();

    // البحث في creators collection
    const creatorQuery = await adminDb
      .collection('creators')
      .where('contact.email', '==', email)
      .limit(1)
      .get();

    if (creatorQuery.empty) {
      // البحث في المجموعة الجديدة للمبدعين
      const newCreatorQuery = await adminDb
        .collection('creators')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (newCreatorQuery.empty) {
        return NextResponse.json({ 
          success: false, 
          error: 'لم يتم العثور على بيانات المبدع' 
        }, { status: 404 });
      }

      const creatorDoc = newCreatorQuery.docs[0];
      const creatorData = creatorDoc.data();

      // إحصائيات افتراضية للمبدعين الجدد
      const stats = {
        total: 0,
        completed: 0,
        ongoing: 0,
        earnings: 0
      };

      return NextResponse.json({
        success: true,
        creator: {
          id: creatorDoc.id,
          fullName: creatorData.fullName,
          role: creatorData.role,
          status: creatorData.status,
          city: creatorData.city,
          phone: creatorData.phone,
          canTravel: creatorData.canTravel,
          createdAt: creatorData.createdAt,
          intakeFormCompleted: creatorData.intakeFormCompleted || false
        },
        stats
      });
    }

    const creatorDoc = creatorQuery.docs[0];
    const creatorData = creatorDoc.data();

    // حساب الإحصائيات من المشاريع
    const stats = {
      total: 0,
      completed: 0,
      ongoing: 0,
      earnings: 0
    };

    try {
      // البحث عن المشاريع المرتبطة بالمبدع
      const projectsQuery = await adminDb
        .collection('projects')
        .where('creatorId', '==', creatorDoc.id)
        .get();

      stats.total = projectsQuery.docs.length;
      
      projectsQuery.docs.forEach(doc => {
        const project = doc.data();
        if (project.status === 'completed') {
          stats.completed++;
          stats.earnings += project.amount || 0;
        } else if (['in_progress', 'assigned'].includes(project.status)) {
          stats.ongoing++;
        }
      });
    } catch (error) {
      console.warn('[creator.profile] Failed to calculate stats:', error);
    }

    return NextResponse.json({
      success: true,
      creator: {
        id: creatorDoc.id,
        fullName: creatorData.fullName,
        role: creatorData.role,
        status: creatorData.status,
        city: creatorData.city,
        phone: creatorData.contact?.phone || '',
        canTravel: creatorData.canTravel,
        createdAt: creatorData.createdAt,
        intakeFormCompleted: creatorData.intakeFormCompleted || false
      },
      stats
    });

  } catch (error) {
    console.error('[creator.profile] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم'
    }, { status: 500 });
  }
}
