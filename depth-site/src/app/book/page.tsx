import { Container } from "@/components/ui/Container";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

const bookingOptions = [
  {
    title: "استشارة مجانية 30 دقيقة",
    duration: "30 دقيقة",
    price: "مجاناً",
    description: "مناقشة احتياجاتك والحلول المقترحة",
    features: [
      "تحليل وضعك الحالي",
      "اقتراح الاستراتيجية المناسبة", 
      "جدولة زمنية مبدئية",
      "تقدير مبدئي للتكلفة"
    ],
    recommended: false
  },
  {
    title: "جلسة تخطيط مفصلة",
    duration: "60 دقيقة", 
    price: "$100",
    description: "تخطيط شامل لاستراتيجيتك التسويقية",
    features: [
      "تحليل عميق للسوق والمنافسين",
      "وضع استراتيجية محتوى مفصلة",
      "خطة تنفيذية على 3 أشهر",
      "تحديد KPIs والأهداف",
      "ملف تنفيذي كامل PDF"
    ],
    recommended: true
  },
  {
    title: "جلسة تصوير في الاستوديو",
    duration: "3-4 ساعات",
    price: "حسب الباقة",
    description: "جلسة تصوير احترافية في استوديونا المجهز",
    features: [
      "استوديو كامل التجهيز",
      "فريق تصوير محترف",
      "تحرير احترافي للصور",
      "تسليم سريع خلال 48 ساعة",
      "صور عالية الجودة 4K"
    ],
    recommended: false
  }
];

const availableTimes = [
  { day: "الأحد - الخميس", hours: "10:00 صباحاً - 6:00 مساءً" },
  { day: "الجمعة", hours: "2:00 مساءً - 8:00 مساءً" },
  { day: "السبت", hours: "حسب الطلب (رسوم إضافية)" }
];

export default function BookPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />
      
      <main className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                احجز جلستك المجانية
              </h1>
              <p className="text-xl text-[var(--slate-600)] max-w-3xl mx-auto">
                اختر الجلسة المناسبة لاحتياجاتك ودعنا نناقش كيف يمكننا مساعدتك في تحقيق أهدافك
              </p>
            </div>

            {/* Booking Options */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {bookingOptions.map((option, index) => (
                <div key={index} className={`relative bg-[var(--card)] rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-lg ${
                  option.recommended 
                    ? 'border-[var(--primary)] transform scale-105' 
                    : 'border-[var(--elev)] hover:border-[var(--primary)]'
                }`}>
                  {option.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-medium">
                        الأكثر طلباً
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                    <div className="text-2xl font-bold text-[var(--primary)] mb-2">
                      {option.price}
                    </div>
                    <div className="text-sm text-[var(--slate-600)] mb-4">
                      المدة: {option.duration}
                    </div>
                    <p className="text-[var(--slate-600)] text-sm">
                      {option.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] flex-shrink-0 mt-2"></div>
                        <span className="text-[var(--slate-700)]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <WhatsAppButton
                    messageOptions={{
                      type: 'booking',
                      details: `أود حجز ${option.title} (${option.duration}) - ${option.price}. ${option.description}.

المواعيد المفضلة:
• اليوم والوقت المناسب: [يرجى التحديد]
• نوع الجلسة: ${option.title}
• المدة المتوقعة: ${option.duration}

معلومات إضافية:
• نوع المشروع/النشاط التجاري: [يرجى التحديد]
• الأهداف المطلوبة: [يرجى التحديد]
• أي متطلبات خاصة: [اختياري]`
                    }}
                    className="w-full"
                  >
                    احجز هذه الجلسة
                  </WhatsAppButton>
                </div>
              ))}
            </div>

            {/* Available Times */}
            <div className="bg-[var(--slate-50)] rounded-2xl p-8 mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">أوقات العمل المتاحة</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {availableTimes.map((time, index) => (
                  <div key={index} className="text-center">
                    <h3 className="font-semibold mb-2">{time.day}</h3>
                    <p className="text-[var(--slate-600)]">{time.hours}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-[var(--slate-600)]">
                  * جميع الأوقات بتوقيت بغداد (GMT+3). يمكن ترتيب جلسات خارج هذه الأوقات حسب الطلب.
                </p>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--elev)]">
                <h3 className="text-xl font-bold mb-4">🎯 للحجز السريع</h3>
                <p className="text-[var(--slate-600)] mb-6">
                  تواصل معنا مباشرة عبر الواتساب للحجز الفوري ومناقشة التفاصيل
                </p>
                <WhatsAppButton
                  messageOptions={{
                    type: 'booking',
                    details: `مرحباً! أود حجز جلسة مع فريق Depth Agency.

معلومات الحجز:
• نوع الجلسة المطلوبة: [استشارة مجانية / جلسة تخطيط / جلسة تصوير]
• المواعيد المفضلة: [يرجى تحديد يوم ووقت مناسب]
• نوع النشاط التجاري: [يرجى التحديد]

أنتظر ردكم لتأكيد الموعد. شكراً!`
                  }}
                  className="w-full"
                >
                  احجز عبر الواتساب
                </WhatsAppButton>
              </div>
              
              <div className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--elev)]">
                <h3 className="text-xl font-bold mb-4">📧 للاستفسارات التفصيلية</h3>
                <p className="text-[var(--slate-600)] mb-6">
                  أرسل لنا تفاصيل مشروعك عبر البريد الإلكتروني للحصول على رد مفصل
                </p>
                <a 
                  href="mailto:hello@depth-agency.com?subject=طلب حجز جلسة&body=مرحباً،%0A%0Aأود حجز جلسة مع فريق Depth Agency.%0A%0Aتفاصيل الطلب:%0A• نوع الجلسة: %0A• المواعيد المفضلة: %0A• نوع النشاط التجاري: %0A• الأهداف المطلوبة: %0A%0Aشكراً!"
                  className="inline-flex items-center gap-2 bg-[var(--slate-100)] hover:bg-[var(--slate-200)] text-[var(--text)] px-6 py-3 rounded-lg font-medium transition-colors w-full justify-center"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                  </svg>
                  راسلنا عبر البريد
                </a>
              </div>
            </div>

            {/* What to Expect */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-8">ماذا تتوقع من الجلسة؟</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    🎯
                  </div>
                  <h3 className="font-semibold mb-2">تحليل الوضع الحالي</h3>
                  <p className="text-sm text-[var(--slate-600)]">نراجع وضعك التسويقي ونحدد نقاط القوة والتحسين</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    💡
                  </div>
                  <h3 className="font-semibold mb-2">اقتراح الحلول</h3>
                  <p className="text-sm text-[var(--slate-600)]">نقدم حلول مخصصة تناسب أهدافك وميزانيتك</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    📋
                  </div>
                  <h3 className="font-semibold mb-2">خطة عمل واضحة</h3>
                  <p className="text-sm text-[var(--slate-600)]">تحصل على خطة تنفيذية مع الجدولة الزمنية</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    🚀
                  </div>
                  <h3 className="font-semibold mb-2">بداية سريعة</h3>
                  <p className="text-sm text-[var(--slate-600)]">يمكننا البدء فوراً بعد اتفاقنا على التفاصيل</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}


