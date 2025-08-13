// Client Portal - Projects API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';

// GET: Fetch client projects
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get client projects from Firestore
    const projectsRef = adminDb.collection('projects');
    const snapshot = await projectsRef
      .where('clientEmail', '==', session.user.email)
      .where('status', '!=', 'deleted')
      .get();

    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }));

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
