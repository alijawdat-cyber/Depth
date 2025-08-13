// Seed Demo Data for Client Portal
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    // This is for development only - add proper authentication in production
    const { secret } = await req.json();
    
    if (secret !== 'demo-seed-data-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Demo client data (for future user creation)
    // Note: This data is prepared for future client creation feature
    // const demoClients = [
    //   {
    //     email: 'demo@client.com',
    //     name: 'مطعم In Off',
    //     company: 'In Off Restaurant',
    //     phone: '+964 770 123 4567',
    //     status: 'active',
    //     createdAt: new Date(),
    //   },
    //   {
    //     email: 'test@example.com',
    //     name: 'عيادة A',
    //     company: 'Clinica A',
    //     phone: '+964 770 987 6543',
    //     status: 'active',
    //     createdAt: new Date(),
    //   }
    // ];

    // Demo projects
    const demoProjects = [
      {
        name: 'حملة التسويق الشتوية',
        description: 'حملة تسويقية شاملة لموسم الشتاء تتضمن إنتاج محتوى، إعلانات مدفوعة، وإدارة منصات التواصل الاجتماعي',
        clientEmail: 'demo@client.com',
        budget: 2500,
        spent: 1875,
        progress: 75,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        name: 'هوية بصرية جديدة',
        description: 'تصميم هوية بصرية كاملة تشمل الشعار، الألوان، والخطوط',
        clientEmail: 'test@example.com',
        budget: 1500,
        spent: 750,
        progress: 50,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        nextPayment: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      }
    ];

    // Demo files
    const demoFiles = [
      {
        name: 'تصاميم الحملة الشتوية',
        type: 'Design',
        size: '2.4 MB',
        status: 'reviewing',
        url: 'https://example.com/file1.pdf',
        description: 'تصاميم الحملة الإعلانية لموسم الشتاء',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(),
      },
      {
        name: 'فيديو ريلز - العروض الأسبوعية',
        type: 'Video',
        size: '45.2 MB',
        status: 'approved',
        url: 'https://example.com/video1.mp4',
        description: 'فيديو ترويجي للعروض الأسبوعية',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(),
      },
      {
        name: 'استراتيجية المحتوى - ديسمبر',
        type: 'Strategy',
        size: '1.1 MB',
        status: 'approved',
        url: 'https://example.com/strategy.pdf',
        description: 'خطة المحتوى لشهر ديسمبر',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(),
      }
    ];

    // Demo approvals
    const demoApprovals = [
      {
        title: 'حملة العروض الشتوية',
        type: 'Campaign',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        priority: 'high',
        status: 'pending',
        description: 'مراجعة وموافقة على تصاميم الحملة الشتوية',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'محتوى قصص الانستقرام - أسبوع 1',
        type: 'Content',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        priority: 'medium',
        status: 'pending',
        description: 'موافقة على محتوى قصص الانستقرام للأسبوع الأول',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Insert demo data
    const projectIds: string[] = [];

    // Insert projects and get their IDs
    for (const project of demoProjects) {
      const docRef = await adminDb.collection('projects').add(project);
      projectIds.push(docRef.id);
    }

    // Insert files with project IDs
    for (let i = 0; i < demoFiles.length; i++) {
      const file = { 
        ...demoFiles[i], 
        projectId: projectIds[i % projectIds.length] // Distribute files across projects
      };
      await adminDb.collection('files').add(file);
    }

    // Insert approvals with project IDs
    for (let i = 0; i < demoApprovals.length; i++) {
      const approval = { 
        ...demoApprovals[i], 
        projectId: projectIds[i % projectIds.length] // Distribute approvals across projects
      };
      await adminDb.collection('approvals').add(approval);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Demo data created successfully',
      data: {
        projects: projectIds.length,
        files: demoFiles.length,
        approvals: demoApprovals.length,
      }
    });

  } catch (error) {
    console.error('Seed Data Error:', error);
    return NextResponse.json(
      { error: 'Failed to create demo data' }, 
      { status: 500 }
    );
  }
}

// GET method to check if demo data exists
export async function GET() {
  try {
    const projectsSnapshot = await adminDb.collection('projects').limit(1).get();
    const filesSnapshot = await adminDb.collection('files').limit(1).get();
    const approvalsSnapshot = await adminDb.collection('approvals').limit(1).get();

    return NextResponse.json({
      success: true,
      exists: {
        projects: !projectsSnapshot.empty,
        files: !filesSnapshot.empty,
        approvals: !approvalsSnapshot.empty,
      }
    });
  } catch (error) {
    console.error('Check Demo Data Error:', error);
    return NextResponse.json(
      { error: 'Failed to check demo data' }, 
      { status: 500 }
    );
  }
}
