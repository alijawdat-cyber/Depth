// API لإدارة تقييمات المبدعين
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

interface ReviewData {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  isPublic: boolean;
}

interface ReviewsResponse {
  reviews: ReviewData[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// GET /api/creators/reviews - جلب تقييمات المبدع
export async function GET() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح - يتطلب تسجيل الدخول',
        requestId
      }, { status: 401 });
    }

    if (session.user.role !== 'creator') {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح - مخصص للمبدعين فقط',
        requestId
      }, { status: 403 });
    }

    const email = session.user.email.toLowerCase();

    // البحث عن المبدع
    const creatorQuery = await adminDb
      .collection('creators')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (creatorQuery.empty) {
      return NextResponse.json({
        success: false,
        error: 'لم يتم العثور على بيانات المبدع',
        requestId
      }, { status: 404 });
    }

    const creatorId = creatorQuery.docs[0].id;

    // جلب التقييمات للمبدع
    const reviewsQuery = await adminDb
      .collection('reviews')
      .where('creatorId', '==', creatorId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const reviews: ReviewData[] = reviewsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ReviewData));

    // حساب الإحصائيات
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    const responseData: ReviewsResponse = {
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      requestId
    });

  } catch (error) {
    console.error('[GET /api/creators/reviews] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم',
      requestId
    }, { status: 500 });
  }
}
