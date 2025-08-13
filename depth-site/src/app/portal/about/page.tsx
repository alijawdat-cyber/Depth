"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Link from "next/link";
import { CheckCircle, BarChart3, FileText, Bell, Shield, Clock, Zap, Users } from "lucide-react";

export default function PortalAboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />
      
      <main className="py-12 md:py-20">
        <Container>
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              بوابة العميل الذكية 🚀
            </h1>
            <p className="text-xl text-[var(--slate-600)] max-w-3xl mx-auto leading-relaxed">
              مركز تحكم شخصي لمتابعة مشاريعك، ملفاتك، والتواصل مع فريقنا بكل سهولة وشفافية
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] text-center">
              <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-3">متابعة التقدم المباشر</h3>
              <p className="text-[var(--slate-600)]">
                شاهد تقدم مشروعك لحظة بلحظة مع إحصائيات دقيقة ومؤشرات بصرية واضحة
              </p>
            </div>

            <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] text-center">
              <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-3">إدارة الملفات</h3>
              <p className="text-[var(--slate-600)]">
                عرض وتحميل جميع ملفات مشروعك - تصاميم، مقاطع فيديو، تقارير، ومستندات
              </p>
            </div>

            <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] text-center">
              <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-3">موافقات سريعة</h3>
              <p className="text-[var(--slate-600)]">
                راجع ووافق على التصاميم والمحتوى مباشرة من البوابة بضغطة زر واحدة
              </p>
            </div>

            <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] text-center">
              <div className="bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-3">إشعارات فورية</h3>
              <p className="text-[var(--slate-600)]">
                استلم تنبيهات فورية عند رفع ملفات جديدة أو طلب موافقات أو تحديثات مهمة
              </p>
            </div>

            <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] text-center">
              <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-3">أمان متقدم</h3>
              <p className="text-[var(--slate-600)]">
                بياناتك محمية بأعلى معايير الأمان مع تشفير قوي وحماية خصوصية كاملة
              </p>
            </div>

            <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] text-center">
              <div className="bg-teal-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-3">سرعة الاستجابة</h3>
              <p className="text-[var(--slate-600)]">
                تواصل مباشر مع فريق العمل عبر WhatsApp وردود سريعة على جميع استفساراتك
              </p>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-[var(--card)] p-8 md:p-12 rounded-[var(--radius-lg)] border border-[var(--elev)] mb-16">
            <h2 className="text-3xl font-bold text-center text-[var(--text)] mb-12">كيف تعمل البوابة؟</h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-[var(--accent-500)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[var(--accent-500)]">1</span>
                </div>
                <h3 className="font-semibold text-[var(--text)] mb-2">سجل حسابك</h3>
                <p className="text-sm text-[var(--slate-600)]">أدخل بياناتك الأساسية وانتظر تفعيل الحساب</p>
              </div>

              <div className="text-center">
                <div className="bg-[var(--accent-500)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[var(--accent-500)]">2</span>
                </div>
                <h3 className="font-semibold text-[var(--text)] mb-2">استلم مشروعك</h3>
                <p className="text-sm text-[var(--slate-600)]">فريقنا ينشئ مشروعك ويضيف التفاصيل</p>
              </div>

              <div className="text-center">
                <div className="bg-[var(--accent-500)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[var(--accent-500)]">3</span>
                </div>
                <h3 className="font-semibold text-[var(--text)] mb-2">تابع التقدم</h3>
                <p className="text-sm text-[var(--slate-600)]">شاهد الملفات والتحديثات أولاً بأول</p>
              </div>

              <div className="text-center">
                <div className="bg-[var(--accent-500)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[var(--accent-500)]">4</span>
                </div>
                <h3 className="font-semibold text-[var(--text)] mb-2">تفاعل ووافق</h3>
                <p className="text-sm text-[var(--slate-600)]">راجع التصاميم ووافق عليها فوراً</p>
              </div>
            </div>
          </div>

          {/* Client Examples */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-[var(--text)] mb-12">عملاؤنا يحبون البوابة</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[var(--accent-500)]/10 rounded-full flex items-center justify-center">
                    <Users size={24} className="text-[var(--accent-500)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">مطعم In Off</h3>
                    <p className="text-sm text-[var(--slate-600)]">حملة التسويق الشتوية</p>
                  </div>
                </div>
                <p className="text-[var(--slate-600)] text-sm leading-relaxed">
                  &ldquo;البوابة خلتني أتابع تصاميم الإعلانات وأوافق عليها بسرعة. وفرت علي وقت كثير ومكالمات لا نهاية لها!&rdquo;
                </p>
              </div>

              <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[var(--accent-500)]/10 rounded-full flex items-center justify-center">
                    <Users size={24} className="text-[var(--accent-500)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">عيادة Clinica A</h3>
                    <p className="text-sm text-[var(--slate-600)]">هوية بصرية متكاملة</p>
                  </div>
                </div>
                <p className="text-[var(--slate-600)] text-sm leading-relaxed">
                  &ldquo;شفافية كاملة في العمل! أشوف تقدم مشروعي يومياً وأحمل الملفات بأي وقت أريده.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)] p-8 md:p-12 rounded-[var(--radius-lg)] text-white">
            <h2 className="text-3xl font-bold mb-4">جاهز لتجربة البوابة؟</h2>
            <p className="text-xl mb-8 text-white/90">
              انضم إلى عملائنا واستمتع بتجربة إدارة مشاريع لا مثيل لها
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/portal/auth/signup">
                <Button variant="secondary" className="bg-white text-[var(--accent-500)] hover:bg-gray-100 px-8 py-3">
                  ابدأ التسجيل الآن
                </Button>
              </Link>
              <Link href="/portal/auth/signin">
                <Button variant="ghost" className="text-white border-white hover:bg-white/10 px-8 py-3">
                  لدي حساب بالفعل
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-white/80">
              <Clock size={16} />
              <span className="text-sm">التسجيل يستغرق دقيقتين فقط</span>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
