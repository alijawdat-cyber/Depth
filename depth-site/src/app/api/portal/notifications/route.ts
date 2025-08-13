// Client Notifications API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Note: Future feature - filter notifications by project
    // const projectsSnapshot = await adminDb
    //   .collection('projects')
    //   .where('clientEmail', '==', session.user.email)
    //   .get();
    // const projectIds = projectsSnapshot.docs.map(doc => doc.id);

    // Get notifications for client's projects
    const notificationsQuery = adminDb
      .collection('notifications')
      .where('clientEmail', '==', session.user.email)
      .orderBy('createdAt', 'desc')
      .limit(20);

    const notificationsSnapshot = await notificationsQuery.get();
    const notifications = notificationsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toISOString() || new Date().toISOString(),
      };
    });

    // Get unread count
    const unreadCount = notifications.filter((n: Record<string, unknown>) => !n.read).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// Mark notification as read
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationId, action } = await req.json();

    if (action === 'markRead') {
      const notificationRef = adminDb.collection('notifications').doc(notificationId);
      const notificationDoc = await notificationRef.get();

      if (!notificationDoc.exists) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }

      const notificationData = notificationDoc.data();
      
      // Verify ownership
      if (notificationData?.clientEmail !== session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      await notificationRef.update({
        read: true,
        readAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read',
      });
    }

    if (action === 'markAllRead') {
      // Mark all notifications as read for this client
      const notificationsSnapshot = await adminDb
        .collection('notifications')
        .where('clientEmail', '==', session.user.email)
        .where('read', '==', false)
        .get();

      const batch = adminDb.batch();
      notificationsSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          read: true,
          readAt: new Date(),
        });
      });

      await batch.commit();

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

// Create sample notifications (for demo)
export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json();
    
    if (secret !== 'demo-notifications-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sampleNotifications = [
      {
        title: 'تم رفع ملف جديد',
        message: 'تم رفع تصاميم الحملة الشتوية للمراجعة',
        type: 'file_upload',
        priority: 'medium',
        clientEmail: 'demo@client.com',
        projectId: 'demo-project-1',
        read: false,
        createdAt: new Date(),
      },
      {
        title: 'موافقة مطلوبة',
        message: 'يرجى مراجعة محتوى قصص الانستقرام والموافقة عليه',
        type: 'approval_required',
        priority: 'high',
        clientEmail: 'demo@client.com',
        projectId: 'demo-project-1',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        title: 'تم إكمال مهمة',
        message: 'تم الانتهاء من تطوير استراتيجية المحتوى لشهر ديسمبر',
        type: 'task_completed',
        priority: 'low',
        clientEmail: 'demo@client.com',
        projectId: 'demo-project-1',
        read: true,
        readAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
    ];

    // Add notifications to Firestore
    const batch = adminDb.batch();
    sampleNotifications.forEach(notification => {
      const docRef = adminDb.collection('notifications').doc();
      batch.set(docRef, notification);
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: 'Sample notifications created',
      count: sampleNotifications.length,
    });

  } catch (error) {
    console.error('Create notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to create notifications' },
      { status: 500 }
    );
  }
}
