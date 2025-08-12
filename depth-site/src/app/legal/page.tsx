import { Container } from "@/components/ui/Container";
import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] py-12">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">الشروط والأحكام وسياسة الخصوصية</h1>
            <p className="text-[var(--slate-600)]">
              آخر تحديث: {new Date().toLocaleDateString('ar-IQ', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div className="bg-[var(--slate-50)] p-4 rounded-lg">
              <p className="text-sm text-[var(--slate-600)]">
                هذه الوثيقة تحكم استخدامك لموقع depth-agency.com وخدمات Depth Agency. 
                <br/>باستخدام موقعنا أو خدماتنا، فإنك توافق على هذه الشروط.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-[var(--slate-50)] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">المحتويات</h2>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <a href="#about-company" className="text-[var(--primary)] hover:underline">1. معلومات الشركة</a>
              <a href="#services" className="text-[var(--primary)] hover:underline">2. الخدمات المقدمة</a>
              <a href="#privacy-policy" className="text-[var(--primary)] hover:underline">3. سياسة الخصوصية</a>
              <a href="#data-collection" className="text-[var(--primary)] hover:underline">4. جمع واستخدام البيانات</a>
              <a href="#payment-terms" className="text-[var(--primary)] hover:underline">5. شروط الدفع والتسعير</a>
              <a href="#intellectual-property" className="text-[var(--primary)] hover:underline">6. الملكية الفكرية</a>
              <a href="#sla" className="text-[var(--primary)] hover:underline">7. اتفاقية مستوى الخدمة</a>
              <a href="#liability" className="text-[var(--primary)] hover:underline">8. المسؤولية والضمانات</a>
              <a href="#termination" className="text-[var(--primary)] hover:underline">9. إنهاء الخدمة</a>
              <a href="#governing-law" className="text-[var(--primary)] hover:underline">10. القانون المطبق</a>
              <a href="#contact" className="text-[var(--primary)] hover:underline">11. معلومات التواصل</a>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            
            {/* 1. About Company */}
            <section id="about-company" className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">1. معلومات الشركة</h2>
              <div className="space-y-3">
                <p><strong>اسم الشركة:</strong> Depth Agency (وكالة العُمق)</p>
                <p><strong>طبيعة العمل:</strong> وكالة محتوى وتسويق أداء مبنية على استوديو خاص مجهز</p>
                <p><strong>الموقع:</strong> الطابق الثاني فوق Sport & More - العرصات/الكرادة/الناظمية - بغداد، العراق</p>
                <p><strong>البريد الإلكتروني:</strong> hello@depth-agency.com</p>
                <p><strong>الموقع الإلكتروني:</strong> https://depth-agency.com</p>
              </div>
            </section>

            {/* 2. Services */}
            <section id="services" className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">2. الخدمات المقدمة</h2>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">الخدمات الأساسية:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li>إنتاج المحتوى المرئي (ريلز 30-45 ثانية، صور منتج محررة)</li>
                  <li>جلسات التصوير (استوديو، لوكيشن، مودلز)</li>
                  <li>إدارة الحملات الإعلانية والسوشيال ميديا</li>
                  <li>موشن جرافيك وتحرير الفيديو</li>
                  <li>تحرير المواد المستلمة من العملاء</li>
                </ul>
                
                <h3 className="text-lg font-semibold">الباقات الشهرية:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li><strong>Basic:</strong> $1,200/شهر - 2 أيام تصوير، 8-10 تصاميم، 6-8 ريلز</li>
                  <li><strong>Growth:</strong> $1,800/شهر - 3 أيام تصوير، 15-18 تصميم، 10-12 ريل</li>
                  <li><strong>Pro:</strong> $2,500/شهر - 4 أيام تصوير، 22-25 تصميم، 14-16 ريل</li>
                </ul>
                
                <p className="text-sm text-[var(--slate-600)]">
                  * إدارة الإعلانات: 12% من الإنفاق (حد أدنى: $350 للباقات Basic/Growth، $500 للباقة Pro)
                </p>
              </div>
            </section>

            {/* 3. Privacy Policy */}
            <section id="privacy-policy" className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">3. سياسة الخصوصية</h2>
              <div className="space-y-3">
                <p>
                  نحن في Depth Agency نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية. 
                  هذه السياسة توضح كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك.
                </p>
                
                <h3 className="text-lg font-semibold">التزامنا بالخصوصية:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li>جمع المعلومات بشفافية كاملة</li>
                  <li>استخدام المعلومات للأغراض المحددة فقط</li>
                  <li>عدم مشاركة المعلومات مع أطراف ثالثة بدون موافقة</li>
                  <li>تطبيق أعلى معايير الأمان</li>
                </ul>
              </div>
            </section>

            {/* 4. Data Collection */}
            <section id="data-collection" className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">4. جمع واستخدام البيانات</h2>
              <div className="space-y-4">
                
                <h3 className="text-lg font-semibold">البيانات التي نجمعها:</h3>
                <div className="bg-[var(--slate-50)] p-4 rounded-lg space-y-3">
                  <div>
                    <h4 className="font-semibold">معلومات الاتصال:</h4>
                    <ul className="list-disc list-inside text-sm text-[var(--slate-700)]">
                      <li>الاسم الكامل</li>
                      <li>عنوان البريد الإلكتروني</li>
                      <li>رقم الهاتف</li>
                      <li>نوع الاستفسار (عام، أسعار، دعم فني، سوشيال ميديا، وظائف)</li>
                      <li>محتوى الرسالة</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">بيانات الموقع التقنية:</h4>
                    <ul className="list-disc list-inside text-sm text-[var(--slate-700)]">
                      <li>عنوان IP</li>
                      <li>نوع المتصفح ونظام التشغيل</li>
                      <li>تاريخ ووقت الزيارة</li>
                      <li>الصفحات المُتصفحة</li>
                      <li>مصدر الزيارة (UTM tracking)</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-semibold">كيف نستخدم البيانات:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li><strong>التواصل المباشر:</strong> الرد على استفساراتك خلال المواعيد المحددة في SLA</li>
                  <li><strong>تحسين الخدمة:</strong> فهم احتياجات العملاء وتطوير خدماتنا</li>
                  <li><strong>التسويق:</strong> إرسال عروض وتحديثات (بموافقتك فقط)</li>
                  <li><strong>الامتثال القانوني:</strong> الاحتفاظ بالسجلات وفقاً للقوانين العراقية</li>
                </ul>

                <h3 className="text-lg font-semibold">مدة الاحتفاظ بالبيانات:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li><strong>بيانات التواصل:</strong> 3 سنوات من آخر تفاعل</li>
                  <li><strong>ملفات المشاريع:</strong> 180 يوم للملفات النهائية، 90 يوم للملفات الخام</li>
                  <li><strong>السجلات المالية:</strong> 7 سنوات وفقاً للقوانين العراقية</li>
                </ul>
              </div>
            </section>

            {/* Cookie Notice */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">إشعار ملفات تعريف الارتباط (Cookies)</h2>
              <div className="bg-[var(--slate-50)] p-4 rounded-lg space-y-3">
                <p>
                  يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل الأداء.
                </p>
                
                <h3 className="font-semibold">أنواع ملفات تعريف الارتباط المستخدمة:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-[var(--slate-700)]">
                  <li><strong>ضرورية:</strong> لضمان عمل الموقع بشكل صحيح</li>
                  <li><strong>تحليلية:</strong> Google Analytics لفهم سلوك الزوار</li>
                  <li><strong>إعلانية:</strong> Meta Pixel لتتبع فعالية الحملات</li>
                  <li><strong>وظيفية:</strong> لحفظ تفضيلاتك (اللغة، المظهر)</li>
                </ul>
                
                <p className="text-sm text-[var(--slate-600)]">
                  يمكنك ضبط إعدادات المتصفح لرفض ملفات تعريف الارتباط، ولكن قد يؤثر ذلك على بعض وظائف الموقع.
                </p>
              </div>
            </section>

          </div>

          {/* Back to Home */}
          <div className="text-center pt-8 border-t">
            <p className="text-sm text-[var(--slate-600)]">
              للعودة إلى الموقع الرئيسي: <Link href="/" className="text-[var(--primary)] hover:underline">depth-agency.com</Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}