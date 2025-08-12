import { Container } from "@/components/ui/Container";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { PACKAGES } from "@/lib/whatsapp";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />
      
      <main className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                باقاتنا الشهرية
              </h1>
              <p className="text-xl text-[var(--slate-600)] max-w-3xl mx-auto">
                اختر الباقة التي تناسب احتياجاتك لنمو علامتك التجارية وزيادة تفاعل جمهورك
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Basic Package */}
              <div className="bg-white rounded-2xl p-8 border-2 border-[var(--elev)] hover:border-[var(--primary)] transition-colors">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{PACKAGES.basic.arabicName}</h3>
                  <div className="text-3xl font-bold text-[var(--primary)] mb-4">
                    {PACKAGES.basic.price}
                  </div>
                  <p className="text-[var(--slate-600)]">
                    مثالية للشركات الناشئة والأعمال الصغيرة
                  </p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {PACKAGES.basic.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-[var(--slate-700)]">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <WhatsAppButton
                  messageOptions={{
                    type: 'package',
                    packageName: PACKAGES.basic.arabicName,
                    details: `أود الاستفسار عن ${PACKAGES.basic.arabicName} بسعر ${PACKAGES.basic.price} والتي تشمل: ${PACKAGES.basic.features.join('، ')}`
                  }}
                  className="w-full"
                >
                  اختر هذه الباقة
                </WhatsAppButton>
              </div>

              {/* Growth Package */}
              <div className="bg-white rounded-2xl p-8 border-2 border-[var(--primary)] relative transform scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-medium">
                    الأكثر شعبية
                  </span>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{PACKAGES.growth.arabicName}</h3>
                  <div className="text-3xl font-bold text-[var(--primary)] mb-4">
                    {PACKAGES.growth.price}
                  </div>
                  <p className="text-[var(--slate-600)]">
                    الأفضل للشركات المتنامية والعلامات المتطورة
                  </p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {PACKAGES.growth.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-[var(--slate-700)]">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <WhatsAppButton
                  messageOptions={{
                    type: 'package',
                    packageName: PACKAGES.growth.arabicName,
                    details: `أود الاستفسار عن ${PACKAGES.growth.arabicName} بسعر ${PACKAGES.growth.price} والتي تشمل: ${PACKAGES.growth.features.join('، ')}`
                  }}
                  className="w-full"
                >
                  اختر هذه الباقة
                </WhatsAppButton>
              </div>

              {/* Pro Package */}
              <div className="bg-white rounded-2xl p-8 border-2 border-[var(--elev)] hover:border-[var(--primary)] transition-colors">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{PACKAGES.pro.arabicName}</h3>
                  <div className="text-3xl font-bold text-[var(--primary)] mb-4">
                    {PACKAGES.pro.price}
                  </div>
                  <p className="text-[var(--slate-600)]">
                    للشركات الكبيرة والمؤسسات المتقدمة
                  </p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {PACKAGES.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-[var(--slate-700)]">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <WhatsAppButton
                  messageOptions={{
                    type: 'package',
                    packageName: PACKAGES.pro.arabicName,
                    details: `أود الاستفسار عن ${PACKAGES.pro.arabicName} بسعر ${PACKAGES.pro.price} والتي تشمل: ${PACKAGES.pro.features.join('، ')}`
                  }}
                  className="w-full"
                >
                  اختر هذه الباقة
                </WhatsAppButton>
              </div>
            </div>

            {/* Additional Services */}
            <div className="bg-[var(--slate-50)] rounded-2xl p-8 mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">خدمات إضافية</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">إدارة الإعلانات</h3>
                  <p className="text-[var(--slate-600)]">
                    نسبة 12% من إنفاق الإعلانات (حد أدنى $350 للباقات الأساسية والنمو، $500 للباقة الاحترافية)
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">خدمات سريعة</h3>
                  <ul className="text-[var(--slate-600)] space-y-2">
                    <li>• التسليم السريع (أقل من 24 ساعة): +35%</li>
                    <li>• العمل في العطل/الليل: +25%</li>
                    <li>• الملفات المصدرية: +30-50% أو $250/شهر</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">هل تحتاج باقة مخصصة؟</h2>
              <p className="text-xl text-[var(--slate-600)] mb-8">
                نقدم باقات مخصصة حسب احتياجاتك الفريدة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <WhatsAppButton
                  messageOptions={{
                    type: 'pricing',
                    details: 'أود الحصول على باقة مخصصة تناسب احتياجات مشروعي الخاصة'
                  }}
                  size="lg"
                >
                  طلب باقة مخصصة
                </WhatsAppButton>
                
                <WhatsAppButton
                  messageOptions={{
                    type: 'pricing',
                    details: 'أود الحصول على جدول أسعار مفصل لجميع الخدمات والباقات'
                  }}
                  variant="ghost"
                  size="lg"
                >
                  جدول الأسعار الكامل
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}