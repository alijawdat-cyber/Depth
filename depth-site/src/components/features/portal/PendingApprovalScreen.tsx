"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Clock, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react";

interface PendingApprovalScreenProps {
  userEmail?: string;
  userName?: string;
}

export default function PendingApprovalScreen({ userEmail, userName }: PendingApprovalScreenProps) {
  const router = useRouter();
  const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER;
  const waHref = WA_NUMBER ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`مرحباً! أنا ${userName || 'عميل جديد'} وحسابي في انتظار التفعيل. البريد الإلكتروني: ${userEmail || 'غير متوفر'}`)}` : "https://wa.me/";

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      
      <main className="py-12 md:py-20">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            {/* Pending Icon */}
            <div className="bg-orange-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={48} className="text-orange-500" />
            </div>

            {/* Main Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4">
              حسابك في انتظار الموافقة ⏳
            </h1>
            <p className="text-xl text-[var(--slate-600)] mb-8">
              {userName ? `مرحباً ${userName}!` : 'مرحباً!'} حسابك تم إنشاؤه بنجاح ونحن نراجعه الآن
            </p>

            {/* Status Card */}
            <div className="bg-[var(--card)] p-8 rounded-[var(--radius-lg)] border border-[var(--elev)] mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold text-[var(--text)]">حالة الحساب: في انتظار الموافقة</span>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <span className="text-green-800 text-sm">تم استلام طلب التسجيل</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <Clock size={20} className="text-orange-500 flex-shrink-0" />
                  <span className="text-orange-800 text-sm">جاري مراجعة البيانات من قبل الفريق</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <AlertCircle size={20} className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">في انتظار التفعيل وإنشاء المشروع</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[var(--bg)] p-6 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--elev)] mb-8">
              <h3 className="font-semibold text-[var(--text)] mb-4">التوقيت المتوقع:</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-green-500 font-bold">✅ مكتمل</div>
                  <div className="text-[var(--slate-600)]">استلام الطلب</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-500 font-bold">⏳ جاري</div>
                  <div className="text-[var(--slate-600)]">مراجعة البيانات</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 font-bold">⏰ قريباً</div>
                  <div className="text-[var(--slate-600)]">التفعيل والبدء</div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-[var(--accent-500)] p-6 rounded-[var(--radius-lg)] text-white mb-8">
              <h3 className="text-xl font-semibold mb-4">هل تحتاج مساعدة أو لديك استعجال؟</h3>
              <p className="text-white/90 mb-6 text-sm">
                فريقنا جاهز لمساعدتك! عادة نكمل المراجعة خلال 24 ساعة كحد أقصى
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Phone size={20} />
                  تواصل واتساب
                </a>
                <a
                  href="mailto:admin@depth-agency.com"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
                >
                  <Mail size={20} />
                  راسل الإدارة
                </a>
              </div>
            </div>

            {/* What to Expect */}
            <div className="text-left space-y-6">
              <h3 className="text-xl font-semibold text-[var(--text)] text-center">ماذا نراجع؟</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)]">
                  <h4 className="font-semibold text-[var(--text)] mb-2">معلومات الاتصال</h4>
                  <p className="text-sm text-[var(--slate-600)]">التأكد من صحة البريد الإلكتروني ورقم الهاتف</p>
                </div>
                
                <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)]">
                  <h4 className="font-semibold text-[var(--text)] mb-2">نوع المشروع</h4>
                  <p className="text-sm text-[var(--slate-600)]">تحديد الخدمات المناسبة لاحتياجاتك</p>
                </div>
                
                <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)]">
                  <h4 className="font-semibold text-[var(--text)] mb-2">إعداد البوابة</h4>
                  <p className="text-sm text-[var(--slate-600)]">تخصيص واجهتك وإضافة مشاريعك</p>
                </div>
                
                <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)]">
                  <h4 className="font-semibold text-[var(--text)] mb-2">تعيين الفريق</h4>
                  <p className="text-sm text-[var(--slate-600)]">ربطك بمدير الحساب المناسب</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                onClick={() => window.location.reload()}
                className="px-8 py-3"
              >
                تحديث الحالة
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/')}
                className="px-8 py-3"
              >
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
