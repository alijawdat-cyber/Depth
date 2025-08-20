// Dev utility route: create test users (currently disabled / stub)
import { NextResponse } from 'next/server';

// In development you can implement logic here to seed creator/client/admin users.
// Left intentionally minimal to satisfy Next.js build (previous missing or invalid module).
// Prevent accidental usage in production.

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Disabled outside development' }, { status: 403 });
  }
  return NextResponse.json({ success: false, error: 'Not implemented. Add seeding logic locally.' }, { status: 501 });
}

export async function GET() {
  return NextResponse.json({ success: true, message: 'Dev create-test-users stub active' });
}
