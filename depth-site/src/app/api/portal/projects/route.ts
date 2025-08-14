// Client Portal - Projects API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { PROJECT_STATUSES } from '@/types/entities';

// GET: Fetch client projects
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get client projects from Firestore
    const projectsRef = adminDb.collection('projects');
    // Firestore limitation: avoid '!=' without matching orderBy; use inclusive statuses instead
    const allowedStatuses = PROJECT_STATUSES.filter(s => s !== 'deleted');
    const snapshot = await projectsRef
      .where('clientEmail', '==', session.user.email)
      .where('status', 'in', allowedStatuses)
      .get();

    const projects = snapshot.docs.map(doc => {
      const data = doc.data() as Record<string, unknown>;
      // Normalize schema: admin creates {title}, client UI expects {name, description, budget, progress}
      const name = (data.name as string) || (data.title as string) || '';
      const description = (data.description as string) || '';
      const budget = typeof data.budget === 'number' ? (data.budget as number) : 0;
      const progress = typeof data.progress === 'number' ? (data.progress as number) : 0;
      const status = (data.status as string) || 'active';
      const createdAt =
        data.createdAt &&
        typeof data.createdAt === 'object' &&
        'toDate' in (data.createdAt as Record<string, unknown>) &&
        typeof (data.createdAt as { toDate: () => Date }).toDate === 'function'
          ? (data.createdAt as { toDate: () => Date }).toDate().toISOString()
          : null;
      const updatedAt =
        data.updatedAt &&
        typeof data.updatedAt === 'object' &&
        'toDate' in (data.updatedAt as Record<string, unknown>) &&
        typeof (data.updatedAt as { toDate: () => Date }).toDate === 'function'
          ? (data.updatedAt as { toDate: () => Date }).toDate().toISOString()
          : null;
      return {
        id: doc.id,
        name,
        description,
        budget,
        progress,
        status,
        clientEmail: data.clientEmail as string,
        createdAt,
        updatedAt,
      };
    });

    return NextResponse.json({ 
      success: true, 
      projects,
      total: projects.length 
    });

  } catch (error) {
    console.error('Projects API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' }, 
      { status: 500 }
    );
  }
}

// POST: Create new project (Admin only - for demo purposes)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Restrict project creation to admins only
    const role = (session.user as unknown as { role?: string }).role;
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can create projects' }, { status: 403 });
    }

    const { name, description, budget, clientEmail } = await req.json();

    // Validation
    if (!name || !clientEmail) {
      return NextResponse.json(
        { error: 'Name and client email are required' }, 
        { status: 400 }
      );
    }

    // Create project in Firestore
    const projectData = {
      name,
      description: description || '',
      budget: budget || 0,
      clientEmail,
      status: 'active',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.email,
    };

    const docRef = await adminDb.collection('projects').add(projectData);

    return NextResponse.json({ 
      success: true, 
      projectId: docRef.id,
      message: 'Project created successfully' 
    });

  } catch (error) {
    console.error('Create Project Error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' }, 
      { status: 500 }
    );
  }
}
