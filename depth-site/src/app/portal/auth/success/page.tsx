"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle, Mail, Clock, Phone, ArrowRight, Users } from "lucide-react";

export default function SignUpSuccessPage() {
  const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER;
  const waHref = WA_NUMBER ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("مرحباً! أكملت التسجيل في بوابة العميل وأريد الاستفسار عن الخطوات القادمة")}` : "https://wa.me/";

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      
      <main className="py-12 md:py-20">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="bg-green-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-500" />
            </div>

            {/* Main Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4">
              🎉 تم التسجيل بنجاح!
            </h1>
            <p className="text-xl text-[var(--slate-600)] mb-8">
              مرحباً بك في عائلة Depth Agency! حسابك الآن في انتظار التفعيل
            </p>

            {/* Steps Card */}
            <div className="bg-[var(--card)] p-8 rounded-[var(--radius-lg)] border border-[var(--elev)] mb-8 text-left">
              <h2 className="text-2xl font-semibold text-[var(--text)] mb-6 text-center">الخطوات القادمة:</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-2">تحقق من بريدك الإلكتروني</h3>
                    <p className="text-[var(--slate-600)] text-sm">
                      أرسلنا لك رابط تسجيل دخول آمن. تحقق من صندوق الوارد (والرسائل المزعجة أيضاً)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-500/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-2">انتظار الموافقة</h3>
                    <p className="text-[var(--slate-600)] text-sm">
                      سيراجع فريقنا طلبك ويفعل حسابك خلال <strong>24 ساعة كحد أقصى</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-500/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users size={20} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-2">بداية المشروع</h3>
                    <p className="text-[var(--slate-600)] text-sm">
                      سيتواصل معك مدير حسابك لمناقشة تفاصيل مشروعك وإنشاء خطة العمل
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight size={20} className="text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-2">الوصول للبوابة</h3>
                    <p className="text-[var(--slate-600)] text-sm">
                      بعد التفعيل ستتمكن من الدخول لبوابتك ومتابعة تقدم مشروعك لحظة بلحظة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-[var(--accent-500)] p-6 rounded-[var(--radius-lg)] text-white mb-8">
              <h3 className="text-xl font-semibold mb-4">محتاج مساعدة أو عندك استعجال؟</h3>
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
                  راسلنا بريد إلكتروني
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button variant="primary" className="px-8 py-3">
                  تسجيل الدخول الآن
                </Button>
              </Link>
              <Link href="/">
                <Button variant="secondary" className="px-8 py-3">
                  العودة للرئيسية
                </Button>
              </Link>
            </div>

            {/* Timeline */}
            <div className="mt-12 p-6 bg-[var(--bg)] rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--elev)]">
              <h3 className="font-semibold text-[var(--text)] mb-4">ماذا يحدث بعدها؟</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-[var(--accent-500)] font-bold">خلال ساعة</div>
                  <div className="text-[var(--slate-600)]">استلام طلبك</div>
                </div>
                <div className="text-center">
                  <div className="text-[var(--accent-500)] font-bold">خلال 24 ساعة</div>
                  <div className="text-[var(--slate-600)]">تفعيل الحساب</div>
                </div>
                <div className="text-center">
                  <div className="text-[var(--accent-500)] font-bold">خلال 48 ساعة</div>
                  <div className="text-[var(--slate-600)]">بداية المشروع</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
