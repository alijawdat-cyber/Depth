import { Container } from "@/components/ui/Container";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { SERVICES } from "@/lib/whatsapp";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

const services = [
  {
    id: 'content_production',
    title: "إنتاج المحتوى المرئي",
    description: "محتوى عالي الجودة يحرك النتائج ويزيد التفاعل",
    icon: "🎬",
    features: [
      "ريلز قصيرة 30-45 ثانية",
      "صور منتجات محررة احترافياً", 
      "تصميمات سوشيال ميديا",
      "نسخ إعلانية جذابة (Copy)",
      "موشن جرافيك خفيف"
    ],
    benefits: [
      "زيادة التفاعل بنسبة تصل إلى 300%",
      "تحسين معدل التحويل",
      "بناء هوية بصرية قوية"
    ]
  },
  {
    id: 'photography',
    title: "جلسات التصوير المحترفة",
    description: "تصوير في استوديو مجهز أو في المواقع الخارجية",
    icon: "📸",
    features: [
      "جلسات استوديو كاملة التجهيز",
      "تصوير خارجي (On Location)",
      "تصوير مع موديلز محترفين",
      "تحرير احترافي للصور",
      "تسليم سريع خلال 48 ساعة"
    ],
    benefits: [
      "صور عالية الجودة 4K",
      "إضاءة احترافية",
      "تنوع في الزوايا والمفاهيم"
    ]
  },
  {
    id: 'ads_management',
    title: "إدارة الحملات الإعلانية",
    description: "حملات مُحسّنة للأداء على جميع المنصات",
    icon: "🎯",
    features: [
      "إعلانات Meta (Facebook/Instagram)",
      "إعلانات Google Ads",
      "Landing Pages محسّنة",
      "UTM Tracking متقدم",
      "تقارير أداء مفصلة"
    ],
    benefits: [
      "خفض تكلفة التحويل بنسبة 40%",
      "زيادة ROI بشكل ملحوظ",
      "استهداف دقيق للجمهور"
    ]
  },
  {
    id: 'motion_graphics',
    title: "موشن جرافيك وتحرير الفيديو",
    description: "أنيميشن وتحرير احترافي يجذب الانتباه",
    icon: "🎨",
    features: [
      "موشن جرافيك ثنائي وثلاثي الأبعاد",
      "تحرير فيديو احترافي",
      "تأثيرات بصرية متقدمة",
      "تحرير المواد المستلمة من العملاء",
      "تصدير بجودات متعددة"
    ],
    benefits: [
      "محتوى بصري مميز",
      "زيادة مدة المشاهدة",
      "تفاعل أعلى على المنصات"
    ]
  },
  {
    id: 'social_media',
    title: "إدارة السوشيال ميديا",
    description: "إدارة شاملة لحساباتك مع استراتيجية محكمة",
    icon: "📱",
    features: [
      "تخطيط محتوى شهري وربع سنوي",
      "جدولة ونشر آلي",
      "إدارة التفاعلات والردود",
      "تحليلات وتقارير دورية",
      "CRM وAutomation Flows"
    ],
    benefits: [
      "نمو متواصل في المتابعين",
      "تحسين معدل التفاعل",
      "بناء مجتمع متفاعل"
    ]
  },
  {
    id: 'strategy',
    title: "الاستراتيجية والاستشارات",
    description: "تخطيط استراتيجي لنمو علامتك التجارية",
    icon: "🧠",
    features: [
      "تحليل السوق والمنافسين",
      "وضع استراتيجية محتوى شاملة",
      "خطط تسويقية طويلة المدى",
      "تحسينات مستمرة للأداء",
      "جلسات استشارية دورية"
    ],
    benefits: [
      "رؤية واضحة للنمو",
      "استغلال أمثل للميزانية",
      "تطوير مستمر للاستراتيجية"
    ]
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />
      
      <main className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                خدماتنا المتكاملة
              </h1>
              <p className="text-xl text-[var(--slate-600)] max-w-3xl mx-auto">
                حلول شاملة من التخطيط والإنتاج إلى التوزيع والقياس لنمو علامتك التجارية
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-2xl p-8 border border-[var(--elev)] hover:border-[var(--primary)] transition-all duration-300 hover:shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-[var(--slate-600)] text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm">ما نقدمه:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-[var(--slate-700)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] flex-shrink-0 mt-2"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm">الفوائد:</h4>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-[var(--slate-700)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-2"></div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <WhatsAppButton
                    messageOptions={{
                      type: 'service',
                      serviceName: service.title,
                      details: `أود الاستفسار عن خدمة ${service.title}. ${service.description}. أرغب في معرفة المزيد عن: ${service.features.slice(0, 3).join('، ')}`
                    }}
                    className="w-full"
                    size="sm"
                  >
                    استفسر عن هذه الخدمة
                  </WhatsAppButton>
                </div>
              ))}
            </div>

            {/* Process Section */}
            <div className="bg-[var(--slate-50)] rounded-2xl p-8 mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">كيف نعمل معك</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">1</div>
                  <h3 className="font-semibold mb-2">الاستشارة الأولية</h3>
                  <p className="text-sm text-[var(--slate-600)]">نناقش أهدافك ونضع الاستراتيجية المناسبة</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">2</div>
                  <h3 className="font-semibold mb-2">التخطيط والتصميم</h3>
                  <p className="text-sm text-[var(--slate-600)]">نطور المفاهيم ونضع خطة العمل التفصيلية</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">3</div>
                  <h3 className="font-semibold mb-2">الإنتاج والتنفيذ</h3>
                  <p className="text-sm text-[var(--slate-600)]">ننتج المحتوى وننفذ الحملات بأعلى جودة</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">4</div>
                  <h3 className="font-semibold mb-2">المتابعة والتحسين</h3>
                  <p className="text-sm text-[var(--slate-600)]">نراقب النتائج ونحسن الأداء باستمرار</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">جاهز لبدء مشروعك؟</h2>
              <p className="text-xl text-[var(--slate-600)] mb-8">
                تواصل معنا للحصول على استشارة مجانية وخطة مخصصة لعلامتك التجارية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <WhatsAppButton
                  messageOptions={{
                    type: 'general',
                    details: 'أود الحصول على استشارة مجانية ومناقشة احتياجات مشروعي. أرغب في معرفة كيف يمكن لخدماتكم المتكاملة أن تساعد في نمو علامتي التجارية.'
                  }}
                  size="lg"
                >
                  احصل على استشارة مجانية
                </WhatsAppButton>
                
                <WhatsAppButton
                  messageOptions={{
                    type: 'pricing',
                    details: 'أود الحصول على عرض سعر مخصص لمجموعة الخدمات التي أحتاجها'
                  }}
                  variant="outline"
                  size="lg"
                >
                  احصل على عرض سعر
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


