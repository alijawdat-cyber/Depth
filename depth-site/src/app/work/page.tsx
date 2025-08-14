"use client";
import { Container } from "@/components/ui/Container";

import ClientsGrid from "@/components/sections/ClientsGrid";
import PageLayout from "@/components/layout/PageLayout";
import { useState } from "react";

type CaseStudy = {
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    engagement?: string;
    visits?: string;
    bookings?: string;
    aov?: string;
    leads?: string;
    noShow?: string;
    cac?: string;
    satisfaction?: string;
    sales?: string;
    inventory?: string;
    onlineShare?: string;
    returns?: string;
    conversion?: string;
    followers?: string;
    reach?: string;
    averageValue?: string;
    homeVisits?: string;
    decisionTime?: string;
    monthlyReach?: string;
  };
  images: string[];
  video?: string;
  testimonial: string;
  author: string;
  expandable?: boolean;
  showBeforeAfter?: boolean;
};

const realCaseStudies: CaseStudy[] = [
  {
    client: "In Off",
    industry: "مطعم وكافيه إيطالي",
    challenge: "رفع الإشغال في منتصف الأسبوع وبناء زخم قبل إطلاق التوصيل، مع توحيد الهوية البصرية للأطباق الموقّعة.",
    solution: "سبريت محتوى 6 أسابيع: تصوير أطباق موقّعة (لسان العجل)، ريلز 'من داخل المطبخ' مع الشيف عمار، قصص يومية للعروض المحدودة. حملة تذوّق مصغّرة مع مؤثرين محليين + نموذج واتساب لجمع طلبات التوصيل المسبقة.",
    results: {
      engagement: "+260%",
      visits: "+38%",
      bookings: "+95%",
      aov: "+17%",
      leads: "1,200 جهة اتصال"
    },
    images: ["/cases/inoff-lisan-before.jpg", "/cases/inoff-lisan-after.jpg"],
    video: "/cases/inoff-lisan-reel.mp4",
    testimonial: "الزخم تغيّر فعلاً. صار عندنا طلب على أطباق التوقيع حتى بأيام هادئة.",
    author: "إدارة In Off",
    expandable: true,
    showBeforeAfter: true
  },
  {
    client: "Clinica A",
    industry: "مركز تجميل (DEKA Laser)",
    challenge: "بناء ثقة حول الليزر (DEKA)، تقليل الـNo-Show، ورفع الحجوزات المسبقة.",
    solution: "سلسلة ريلز تعليمية (موانع/قبل-بعد/العناية)، وبروتوكول تصوير موحّد قبل/بعد. نظام تأكيد تلقائي + تذكير قبل الموعد عبر واتساب؛ نموذج موافقة واستبيان حساسية.",
    results: {
      bookings: "+210%",
      noShow: "-35%",
      cac: "-28%",
      satisfaction: "4.8/5"
    },
    images: ["/cases/clinicaA-before.jpg", "/cases/clinicaA-after.jpg"],
    video: "/cases/clinicaA-testimonial.mp4",
    testimonial: "المحتوى التعليمي خفّف الأسئلة وخلّى القرار أسهل للعميلة.",
    author: "إدارة Clinica A",
    expandable: true,
    showBeforeAfter: true
  },
  {
    client: "Sport & More",
    industry: "متاجر رياضية (رجالي/نسائي)",
    challenge: "تصريف مخزون موسمي للأحذية، رفع الطلبات الأونلاين عبر شركة التوصيل، وتوضيح المقاسات.",
    solution: "ريلز On-Feet للأحذية + 'Drop' أسبوعي، أدلة مقاسات مختصرة، وFlat-lay سريع. ربط الطلبات مع شركة 'الوسيط' + تتبّع المرتجعات، وتوحيد سياسة الاستبدال الرقمية.",
    results: {
      sales: "+85%",
      inventory: "-42%",
      onlineShare: "0 → 28%",
      returns: "<6%"
    },
    images: ["/cases/sportmore-drop1.jpg", "/cases/sportmore-onfeet.jpg"],
    video: "/cases/sportmore-reel.mp4",
    testimonial: "الـ'دروب' الأسبوعي خلّى الزبون ينتظر التجديد، وصارت المبيعات أسرع.",
    author: "إدارة Sport & More",
    expandable: true,
    showBeforeAfter: false
  },
  {
    client: "NAVA",
    industry: "أزياء رجالية (رسمي/كاجوال)",
    challenge: "تحويل المتابعين إلى مشترين، وتخفيض ارتباك المقاسات/القصّات.",
    solution: "Lookbook موسمي + باقة 'إطلالة كاملة' بخصم تجميعي، صور موديل ثابت بخلفيات محايدة. بطاقات منتج واضحة (قماش/قصّة/عناية) + جدول مقاسات بسيط.",
    results: {
      conversion: "×2.6",
      aov: "+22%",
      followers: "12k → 26k"
    },
    images: ["/cases/nava-look1.jpg", "/cases/nava-look2.jpg"],
    video: "/cases/nava-lookbook-reel.mp4",
    testimonial: "التصوير النظيف واللوكبوك خلّى القرار سهل — الزبون عرف بالضبط شو يشتري.",
    author: "إدارة NAVA",
    expandable: true,
    showBeforeAfter: false
  },
  {
    client: "Blue",
    industry: "سجاد إيراني فاخر",
    challenge: "شرح قيمة القطع الفاخرة وتقليل الجدل السعري، وزيادة طلبات المعاينة المنزلية.",
    solution: "كتالوغ رقمي يبيّن (المقاس/العمر/العُقد/الأصباغ/المنشأ) + قصص 'قبل/بعد' لغرف حقيقية. استمارة طلب معاينة منزلية + شراكات مع مهندسين داخليين.",
    results: {
      averageValue: "+31%",
      homeVisits: "0 → 22 طلب/شهر",
      decisionTime: "-25%",
      monthlyReach: "6k → 38k"
    },
    images: ["/cases/blue-livingroom-before.jpg", "/cases/blue-livingroom-after.jpg"],
    video: "/cases/blue-roomtour.mp4",
    testimonial: "عرض التفاصيل الفنية مع صور قبل/بعد اختصر علينا الكلام — البيع صار أسرع.",
    author: "إدارة Blue",
    expandable: true,
    showBeforeAfter: true
  }
];

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [expanded, setExpanded] = useState(false);

  const getResultsArray = () => {
    const resultsArray = [];
    if (study.results.engagement) resultsArray.push({ label: "التفاعل", value: study.results.engagement });
    if (study.results.visits) resultsArray.push({ label: "زيارات منتصف الأسبوع", value: study.results.visits });
    if (study.results.bookings) resultsArray.push({ label: "الحجوزات", value: study.results.bookings });
    if (study.results.aov) resultsArray.push({ label: "متوسط قيمة الفاتورة", value: study.results.aov });
    if (study.results.leads) resultsArray.push({ label: "قائمة انتظار التوصيل", value: study.results.leads });
    if (study.results.noShow) resultsArray.push({ label: "تقليل No-Show", value: study.results.noShow });
    if (study.results.cac) resultsArray.push({ label: "تكلفة اكتساب العميل", value: study.results.cac });
    if (study.results.satisfaction) resultsArray.push({ label: "رضا العملاء", value: study.results.satisfaction });
    if (study.results.sales) resultsArray.push({ label: "المبيعات الأسبوعية", value: study.results.sales });
    if (study.results.inventory) resultsArray.push({ label: "تقادم المخزون", value: study.results.inventory });
    if (study.results.onlineShare) resultsArray.push({ label: "حصة الطلبات الأونلاين", value: study.results.onlineShare });
    if (study.results.returns) resultsArray.push({ label: "مرتجعات التوصيل", value: study.results.returns });
    if (study.results.conversion) resultsArray.push({ label: "معدل التحويل", value: study.results.conversion });
    if (study.results.followers) resultsArray.push({ label: "نمو المجتمع", value: study.results.followers });
    if (study.results.averageValue) resultsArray.push({ label: "متوسط قيمة الفاتورة", value: study.results.averageValue });
    if (study.results.homeVisits) resultsArray.push({ label: "طلبات المعاينة المنزلية", value: study.results.homeVisits });
    if (study.results.decisionTime) resultsArray.push({ label: "زمن اتخاذ القرار", value: study.results.decisionTime });
    if (study.results.monthlyReach) resultsArray.push({ label: "الوصول الشهري", value: study.results.monthlyReach });
    return resultsArray;
  };

  return (
    <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-[var(--text)] mb-1">{study.client}</h3>
            <p className="text-[var(--slate-600)] text-sm">{study.industry}</p>
          </div>
          {study.showBeforeAfter && (
            <span className="bg-[var(--primary)] text-white px-3 py-1 rounded-full text-xs font-medium">
              قبل/بعد
            </span>
          )}
        </div>

        {/* Challenge */}
        <div className="mb-4">
          <h4 className="font-semibold text-[var(--text)] mb-2">التحدي:</h4>
          <p className="text-[var(--slate-600)] text-sm leading-relaxed">{study.challenge}</p>
        </div>

        {/* Quick Results Preview */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {getResultsArray().slice(0, 2).map((result, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">{result.value}</div>
              <div className="text-xs text-[var(--slate-600)]">{result.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Content */}
      {expanded && (
        <div className="px-6 pb-4">
          {/* Solution */}
          <div className="mb-6">
            <h4 className="font-semibold text-[var(--text)] mb-2">الحل:</h4>
            <p className="text-[var(--slate-600)] text-sm leading-relaxed">{study.solution}</p>
          </div>

          {/* All Results */}
          <div className="mb-6">
            <h4 className="font-semibold text-[var(--text)] mb-3">النتائج (8 أسابيع):</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getResultsArray().map((result, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-[var(--bg)] rounded-[var(--radius)]">
                  <span className="text-sm text-[var(--slate-600)]">{result.label}</span>
                  <span className="font-semibold text-[var(--primary)]">{result.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-[var(--bg)] p-4 rounded-[var(--radius)] border-r-4 border-[var(--primary)]">
            <blockquote className="text-[var(--text)] italic mb-2">&ldquo;{study.testimonial}&rdquo;</blockquote>
            <cite className="text-sm text-[var(--slate-600)]">— {study.author}</cite>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {study.expandable && (
        <div className="px-6 pb-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2 text-sm text-[var(--primary)] hover:text-[var(--accent-700)] transition-colors flex items-center justify-center gap-2"
          >
            {expanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
            <svg 
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function StatsSection() {
  const stats = [
    { number: "40+", label: "مشروع مكتمل" },
    { number: "10+", label: "عميل نشط" },
    { number: "+220%", label: "متوسط نمو التفاعل" },
    { number: "+160%", label: "متوسط نمو الحجوزات" }
  ];

  return (
    <section className="py-16 bg-[var(--bg)]">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4">
            نتائج مثبتة عبر القطاعات
          </h2>
          <p className="text-xl text-[var(--slate-600)] max-w-2xl mx-auto">
            أرقام حقيقية من مشاريع حقيقية مع عملائنا
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-2">
                {stat.number}
              </div>
              <div className="text-[var(--slate-600)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default function WorkPage() {
  return (
    <PageLayout>
      <div className="py-16">
        <Container>
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              نتائج حقيقية لعملاء حقيقيين
            </h1>
            <p className="text-xl text-[var(--slate-600)] max-w-3xl mx-auto leading-relaxed">
              دراسات حالة مفصلة من مشاريعنا مع العلامات التجارية العراقية. 
              كل رقم موثق، كل نتيجة قابلة للقياس.
            </p>
          </div>

          {/* Case Studies Grid */}
          <div className="space-y-8 mb-16">
            {realCaseStudies.map((study, index) => (
              <CaseStudyCard key={index} study={study} />
            ))}
          </div>
        </Container>

        {/* Stats Section */}
        <StatsSection />

        {/* Clients Grid */}
        <Container className="mt-16">
          <ClientsGrid />
                </Container>
      </div>
    </PageLayout>
  );
}


