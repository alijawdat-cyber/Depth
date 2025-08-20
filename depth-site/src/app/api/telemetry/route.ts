// 🔇 TELEMETRY PERMANENTLY DISABLED
// All telemetry collection has been permanently disabled per user request

import { NextResponse } from 'next/server';

export async function POST() {
  // Return success without any telemetry collection
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  // Return success without any telemetry collection  
  return new NextResponse(null, { status: 204 });
}
