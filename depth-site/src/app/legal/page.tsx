import { Container } from "@/components/ui/Container";
import Link from "next/link";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />
      <main className="py-12">
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

            {/* 5. Payment Terms */}
            <section id="payment-terms" className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">5. شروط الدفع والتسعير</h2>
              <div className="space-y-4">
                
                <h3 className="text-lg font-semibold">العملة والدفع:</h3>
                <div className="bg-[var(--slate-50)] p-4 rounded-lg space-y-2">
                  <p><strong>العملة الأساسية:</strong> الدولار الأمريكي (USD)</p>
                  <p><strong>التحصيل:</strong> الدينار العراقي (IQD) بسعر السوق الموازي يوم الفاتورة</p>
                  <p><strong>بند التسوية:</strong> ±3% في حالة تغير سعر الصرف بين إصدار الفاتورة والتحصيل</p>
                  <p><strong>رسوم التحويل:</strong> على العميل</p>
                </div>

                <h3 className="text-lg font-semibold">جدولة الدفع:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li><strong>المشاريع المفردة:</strong> 50% مقدم عند توقيع SOW، 50% عند التسليم</li>
                  <li><strong>الباقات الشهرية:</strong> دفع شهري مقدم</li>
                  <li><strong>إدارة الإعلانات:</strong> فوترة شهرية بنسبة 12% من الإنفاق</li>
                </ul>

                <h3 className="text-lg font-semibold">رسوم التأخير والإلغاء:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li><strong>تأخير الدفع:</strong> 2% شهرياً بعد 10 أيام عمل من الاستحقاق</li>
                  <li><strong>حق التعليق:</strong> نحتفظ بحق تعليق العمل عند التأخير أكثر من 10 أيام</li>
                  <li><strong>رسوم الإلغاء (Kill Fee):</strong>
                    <ul className="list-disc list-inside ml-6 mt-2">
                      <li>30% قبل بدء الإنتاج</li>
                      <li>60% أثناء الإنتاج</li>
                      <li>100% بعد التسليم الأولي</li>
                    </ul>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold">رسوم إضافية:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li><strong>التسليم السريع (أقل من 24 ساعة):</strong> +35%</li>
                  <li><strong>العمل في العطل/الليل:</strong> +25%</li>
                  <li><strong>الملفات المصدرية (PSD/PR/AE):</strong> +30-50% أو $250 كحزمة شهرية</li>
                  <li><strong>خروج المعدات:</strong> $60/يوم + تأمين</li>
                </ul>
              </div>
            </section>

            {/* 6. Intellectual Property */}
            <section id="intellectual-property" className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">6. الملكية الفكرية</h2>
              <div className="space-y-4">
                
                <h3 className="text-lg font-semibold">انتقال الحقوق:</h3>
                <div className="bg-[var(--slate-50)] p-4 rounded-lg space-y-2">
                  <p>تنتقل جميع حقوق الملكية الفكرية للأعمال المنتجة إلى العميل بعد السداد الكامل.</p>
                  <p>نحتفظ بحق عرض الأعمال كسابقة عمل في معرض أعمالنا ما لم يُتفق على خلاف ذلك كتابياً.</p>
                </div>

                <h3 className="text-lg font-semibold">المحتوى المقدم من العميل:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li>العميل مسؤول عن ضمان امتلاكه حقوق استخدام جميع المواد المقدمة</li>
                  <li>العميل يتحمل المسؤولية عن أي انتهاك لحقوق الطبع والنشر</li>
                  <li>نحتفظ بحق رفض العمل على محتوى مشكوك في مشروعيته</li>
                </ul>

                <h3 className="text-lg font-semibold">الامتثال الطبي (Clinica A Compliance):</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li>موافقات خطية مطلوبة لصور قبل/بعد</li>
                  <li>عدم تقديم ادعاءات علاجية غير مثبتة</li>
                  <li>الالتزام بسياسات المنصات للمحتوى الطبي/التجميلي</li>
                </ul>
              </div>
            </section>

            {/* 7. SLA */}
            <section id="sla" className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">7. اتفاقية مستوى الخدمة (SLA)</h2>
              <div className="space-y-4">
                
                <h3 className="text-lg font-semibold">أوقات الاستجابة:</h3>
                <div className="bg-[var(--slate-50)] p-4 rounded-lg space-y-2">
                  <p><strong>الاستفسارات العامة:</strong> 24 ساعة</p>
                  <p><strong>طلبات الأسعار:</strong> 8 ساعات</p>
                  <p><strong>الدعم الفني:</strong> 6 ساعات</p>
                  <p><strong>السوشيال ميديا:</strong> 12 ساعة</p>
                  <p><strong>طلبات التوظيف:</strong> 72 ساعة</p>
                </div>

                <h3 className="text-lg font-semibold">أوقات التسليم:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li><strong>المهام القياسية:</strong> 48-72 ساعة للتسليم الأولي</li>
                  <li><strong>المراجعات:</strong> جولتان مشمولتان، الثالثة مدفوعة</li>
                  <li><strong>هدف القبول:</strong> 70% أو أكثر قبول من أول نسخة</li>
                </ul>

                <h3 className="text-lg font-semibold">قنوات التسليم:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li>Google Drive للملفات الكبيرة</li>
                  <li>Frame.io للفيديوهات والمراجعات</li>
                  <li>إشعارات فورية عبر البريد الإلكتروني</li>
                </ul>
              </div>
            </section>

            {/* 8. Liability */}
            <section id="liability" className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">8. المسؤولية والضمانات</h2>
              <div className="space-y-4">
                
                <h3 className="text-lg font-semibold">حدود المسؤولية:</h3>
                <div className="bg-[var(--slate-50)] p-4 rounded-lg space-y-2">
                  <p>مسؤوليتنا محدودة بقيمة الأتعاب المدفوعة خلال آخر 3 أشهر من تاريخ المطالبة.</p>
                  <p>لا نتحمل المسؤولية عن الأضرار غير المباشرة أو فقدان الأرباح.</p>
                </div>

                <h3 className="text-lg font-semibold">ضمانات الجودة:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li>نضمن جودة الإنتاج وفقاً للمعايير المتفق عليها</li>
                  <li>إعادة العمل مجاناً في حالة عدم الامتثال للمواصفات</li>
                  <li>استبدال الملفات التالفة تقنياً خلال 30 يوم من التسليم</li>
                </ul>

                <h3 className="text-lg font-semibold">استثناءات المسؤولية:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li>القوة القاهرة (حروب، كوارث طبيعية، انقطاع الإنترنت)</li>
                  <li>تأخير العميل في تقديم المواد أو الموافقات</li>
                  <li>تغيير المتطلبات بعد بدء الإنتاج</li>
                </ul>
              </div>
            </section>

            {/* 9. Termination */}
            <section id="termination" className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">9. إنهاء الخدمة</h2>
              <div className="space-y-4">
                
                <h3 className="text-lg font-semibold">إنهاء الباقات الشهرية:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li>إشعار مسبق 30 يوم لإنهاء الباقة</li>
                  <li>إكمال جميع الأعمال الجارية قبل الإنهاء</li>
                  <li>عدم استرداد المبالغ المدفوعة مقدماً</li>
                </ul>

                <h3 className="text-lg font-semibold">إنهاء فوري من جانبنا:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li>عدم السداد بعد 30 يوم من الاستحقاق</li>
                  <li>انتهاك شروط الاستخدام</li>
                  <li>طلب محتوى مخالف للقوانين أو الآداب العامة</li>
                </ul>

                <h3 className="text-lg font-semibold">إجراءات ما بعد الإنهاء:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li>تسليم جميع الملفات النهائية المدفوعة</li>
                  <li>حذف الملفات الخام بعد انتهاء فترة الاحتفاظ</li>
                  <li>إرجاع أو إتلاف المعلومات السرية</li>
                </ul>
              </div>
            </section>

            {/* 10. Governing Law */}
            <section id="governing-law" className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">10. القانون المطبق وحل النزاعات</h2>
              <div className="space-y-4">
                
                <h3 className="text-lg font-semibold">القانون المطبق:</h3>
                <div className="bg-[var(--slate-50)] p-4 rounded-lg space-y-2">
                  <p>تخضع هذه الاتفاقية للقوانين العراقية ولاختصاص محاكم بغداد.</p>
                  <p>في حالة تعارض القوانين، يُطبق القانون العراقي.</p>
                </div>

                <h3 className="text-lg font-semibold">آلية حل النزاعات:</h3>
                <ol className="list-decimal list-inside space-y-2 text-[var(--slate-700)]">
                  <li><strong>التسوية الودية:</strong> محاولة حل النزاع خلال 30 يوم من خلال التفاوض المباشر</li>
                  <li><strong>الوساطة:</strong> اللجوء لوسيط محايد إذا فشلت التسوية الودية</li>
                  <li><strong>التحكيم:</strong> تحكيم ملزم وفقاً لقواعد غرفة تجارة بغداد</li>
                  <li><strong>اللجوء للقضاء:</strong> كملاذ أخير أمام محاكم بغداد المختصة</li>
                </ol>

                <h3 className="text-lg font-semibold">الاختصاص القضائي:</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--slate-700)]">
                  <li>محاكم بغداد المختصة لجميع النزاعات</li>
                  <li>اللغة العربية هي لغة الإجراءات القانونية</li>
                  <li>تكاليف التقاضي على الطرف الخاسر</li>
                </ul>
              </div>
            </section>

            {/* 11. Contact */}
            <section id="contact" className="space-y-4">
              <h2 className="text-2xl font-bold border-b-2 border-[var(--primary)] pb-2">11. معلومات التواصل</h2>
              <div className="bg-[var(--slate-50)] p-6 rounded-lg space-y-4">
                
                <h3 className="text-lg font-semibold">للاستفسارات العامة:</h3>
                <div className="space-y-2">
                  <p><strong>البريد الإلكتروني:</strong> hello@depth-agency.com</p>
                  <p><strong>الموقع الإلكتروني:</strong> https://depth-agency.com</p>
                  <p><strong>العنوان:</strong> الطابق الثاني فوق Sport & More، العرصات/الكرادة/الناظمية، بغداد، العراق</p>
                </div>

                <h3 className="text-lg font-semibold">للاستفسارات المتخصصة:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>المبيعات:</strong> sales@depth-agency.com</p>
                    <p><strong>الدعم الفني:</strong> support@depth-agency.com</p>
                    <p><strong>السوشيال ميديا:</strong> social@depth-agency.com</p>
                  </div>
                  <div>
                    <p><strong>التوظيف:</strong> jobs@depth-agency.com</p>
                    <p><strong>المحاسبة:</strong> billing@depth-agency.com</p>
                    <p><strong>الشؤون القانونية:</strong> legal@depth-agency.com</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[var(--card)] rounded border-l-4 border-[var(--primary)]">
                  <h4 className="font-semibold text-[var(--primary)]">تحديثات الوثيقة:</h4>
                  <p className="text-sm text-[var(--slate-600)] mt-1">
                    نحتفظ بالحق في تحديث هذه الشروط والأحكام. سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على الموقع.
                    استمرار استخدامك لخدماتنا بعد التحديث يعني موافقتك على الشروط الجديدة.
                  </p>
                </div>
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

          {/* Footer */}
          <div className="text-center pt-8 border-t">
            <p className="text-sm text-[var(--slate-600)]">
              للعودة إلى الموقع الرئيسي: <Link href="/" className="text-[var(--primary)] hover:underline">depth-agency.com</Link>
            </p>
          </div>
        </div>
      </Container>
      </main>
      <Footer />
    </div>
  );
}