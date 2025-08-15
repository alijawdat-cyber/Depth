import { NextRequest, NextResponse } from 'next/server';
import { createCloudflareDirectUpload } from '@/lib/cloudflare';

// POST /api/test-cloudflare-upload
// Simple test endpoint to verify Cloudflare upload without Firebase/Auth dependencies
export async function POST(req: NextRequest) {
  try {
    console.log('🧪 Testing Cloudflare direct upload...');
    
    const { contentType, size } = await req.json();

    // Basic validation
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (contentType && !allowed.includes(contentType)) {
      return NextResponse.json({ error: 'نوع الملف غير مدعوم' }, { status: 400 });
    }
    if (size && Number(size) > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'الحجم أكبر من 50MB' }, { status: 400 });
    }

    // Test Cloudflare direct upload
    try {
      const meta = {
        owner: 'test-user',
        projectId: 'test-project',
        timestamp: new Date().toISOString()
      };
      
      console.log('🔄 Calling createCloudflareDirectUpload...');
      const { uploadURL, id } = await createCloudflareDirectUpload(meta);
      
      console.log('✅ Cloudflare upload URL created:', { id, uploadURL: uploadURL.substring(0, 50) + '...' });
      
      return NextResponse.json({ 
        success: true,
        uploadURL, 
        id,
        message: 'Cloudflare upload URL created successfully'
      });
    } catch (cfError) {
      console.error('❌ Cloudflare upload error:', cfError);
      
      const errorMessage = cfError instanceof Error ? cfError.message : 'Unknown error';
      console.error('📋 Detailed error:', {
        message: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({ 
        success: false,
        error: 'فشل في إنشاء رابط الرفع من Cloudflare',
        details: errorMessage
      }, { status: 500 });
    }
  } catch (e) {
    console.error('💥 API error:', e);
    return NextResponse.json({ 
      success: false,
      error: 'خطأ في API',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint for quick health check
export async function GET() {
  return NextResponse.json({ 
    message: 'Test Cloudflare Upload API is running',
    timestamp: new Date().toISOString()
  });
}
