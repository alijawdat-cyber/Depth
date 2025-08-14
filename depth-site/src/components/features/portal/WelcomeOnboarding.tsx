"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { CheckCircle, ArrowRight, Rocket, Users, Calendar, Target, Star, MessageCircle, Clock, FileText } from "lucide-react";

interface WelcomeOnboardingProps {
  userName?: string;
  userEmail?: string;
  onRefresh?: () => void;
}

export default function WelcomeOnboarding({ userName, userEmail, onRefresh }: WelcomeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: "welcome",
      title: "أهلاً وسهلاً بك! 🎉",
      subtitle: "مرحباً بك في عائلة Depth Agency",
      icon: <Star size={48} className="text-yellow-500" />,
      content: (
        <div className="text-center space-y-6">
          <p className="text-lg text-[var(--slate-600)]">
            {userName ? `عزيزي ${userName}،` : 'عزيزنا العميل،'} حسابك تم تفعيله بنجاح! 
            نحن متحمسون للعمل معك وتحقيق أهدافك التسويقية.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)]">
              <Target size={32} className="text-[var(--accent-500)] mx-auto mb-2" />
              <h4 className="font-semibold text-[var(--text)] mb-1">استراتيجية واضحة</h4>
              <p className="text-sm text-[var(--slate-600)]">خطة مدروسة لتحقيق أهدافك</p>
            </div>
            <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)]">
              <Users size={32} className="text-[var(--accent-500)] mx-auto mb-2" />
              <h4 className="font-semibold text-[var(--text)] mb-1">فريق محترف</h4>
              <p className="text-sm text-[var(--slate-600)]">خبراء متخصصون في خدمتك</p>
            </div>
            <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)]">
              <Rocket size={32} className="text-[var(--accent-500)] mx-auto mb-2" />
              <h4 className="font-semibold text-[var(--text)] mb-1">نتائج مؤكدة</h4>
              <p className="text-sm text-[var(--slate-600)]">عائد استثمار ملموس</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "timeline",
      title: "الخطوات القادمة 📋",
      subtitle: "إليك ما سيحدث خلال الأيام القادمة",
      icon: <Calendar size={48} className="text-blue-500" />,
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 bg-[var(--card)] rounded-lg border border-[var(--elev)]">
              <div className="bg-green-500/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text)] mb-1">✅ تم تفعيل حسابك</h4>
                <p className="text-sm text-[var(--slate-600)]">يمكنك الآن الوصول لبوابة العميل</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="bg-blue-500/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text)] mb-1">⏳ خلال 24 ساعة: مكالمة التخطيط</h4>
                <p className="text-sm text-[var(--slate-600)]">سيتصل بك مدير حسابك لمناقشة تفاصيل مشروعك</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[var(--card)] rounded-lg border border-[var(--elev)]">
              <div className="bg-orange-500/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text)] mb-1">🎯 خلال 2-3 أيام: إنشاء المشروع</h4>
                <p className="text-sm text-[var(--slate-600)]">سيظهر مشروعك هنا مع كافة التفاصيل والملفات</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[var(--card)] rounded-lg border border-[var(--elev)]">
              <div className="bg-purple-500/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <Rocket size={20} className="text-purple-500" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text)] mb-1">🚀 خلال أسبوع: بداية التنفيذ</h4>
                <p className="text-sm text-[var(--slate-600)]">ستبدأ رؤية أولى النتائج والتصاميم</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "features",
      title: "تعرف على بوابتك 🔧",
      subtitle: "ميزات ستساعدك في متابعة مشروعك",
      icon: <Target size={48} className="text-purple-500" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FileText size={24} className="text-blue-500" />
              </div>
              <h4 className="font-semibold text-[var(--text)] mb-2">متابعة الملفات</h4>
              <p className="text-sm text-[var(--slate-600)]">عرض وتحميل جميع تصاميمك ومقاطع الفيديو والتقارير</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <div className="bg-green-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <h4 className="font-semibold text-[var(--text)] mb-2">الموافقات السريعة</h4>
              <p className="text-sm text-[var(--slate-600)]">وافق على التصاميم أو اطلب تعديلات بضغطة زر</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <div className="bg-purple-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Calendar size={24} className="text-purple-500" />
              </div>
              <h4 className="font-semibold text-[var(--text)] mb-2">تتبع التقدم</h4>
              <p className="text-sm text-[var(--slate-600)]">شاهد تقدم مشروعك والمراحل المكتملة</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <div className="bg-orange-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-orange-500" />
              </div>
              <h4 className="font-semibold text-[var(--text)] mb-2">التواصل المباشر</h4>
              <p className="text-sm text-[var(--slate-600)]">تواصل مع فريقك عبر WhatsApp أو البوابة</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "contact",
      title: "نحن هنا لمساعدتك! 🤝",
      subtitle: "طرق التواصل معنا",
      icon: <MessageCircle size={48} className="text-green-500" />,
      content: (
        <div className="text-center space-y-6">
          <p className="text-lg text-[var(--slate-600)]">
            لا تتردد في التواصل معنا في أي وقت. فريقنا جاهز لمساعدتك!
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h4 className="font-semibold text-[var(--text)] mb-3">للاستفسارات السريعة</h4>
              <WhatsAppButton
                messageOptions={{
                  type: 'general',
                  details: `مرحباً! أنا ${userName || 'عميل جديد'} وأريد الاستفسار عن مشروعي`
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white border-none"
              >
                <MessageCircle size={20} className="mr-2" />
                واتساب فوري
              </WhatsAppButton>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-[var(--text)] mb-3">للاستفسارات التفصيلية</h4>
              <a
                href={`mailto:admin@depth-agency.com?subject=استفسار من ${userName || 'عميل جديد'}&body=مرحباً، أريد الاستفسار عن مشروعي. البريد الإلكتروني: ${userEmail || 'غير متوفر'}`}
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                📧 بريد إلكتروني
              </a>
            </div>
          </div>

          <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)]">
            <p className="text-sm text-[var(--slate-600)]">
              <strong>أوقات العمل:</strong> الأحد - الخميس، 9 صباحاً - 6 مساءً (توقيت بغداد)
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToEnd = () => {
    setCurrentStep(steps.length - 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-[var(--slate-600)]">
            الخطوة {currentStep + 1} من {steps.length}
          </span>
          <button
            onClick={skipToEnd}
            className="text-sm text-[var(--accent-500)] hover:underline"
          >
            تخطي للنهاية
          </button>
        </div>
        <div className="w-full bg-[var(--elev)] rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)] h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)] p-8 text-white text-center">
          <div className="mb-4">
            {steps[currentStep].icon}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-white/90">
            {steps[currentStep].subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {steps[currentStep].content}
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              السابق
            </Button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-[var(--accent-500)]'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-[var(--elev)]'
                  }`}
                />
              ))}
            </div>

            {currentStep === steps.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => {
                  try {
                    if (userEmail) localStorage.setItem(`welcome-done-${userEmail}`, '1');
                  } catch {}
                  onRefresh?.();
                }}
                className="flex items-center gap-2"
              >
                ابدأ الاستخدام
                <Rocket size={16} />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                التالي
                <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)] text-center">
          <div className="text-2xl font-bold text-[var(--accent-500)] mb-1">500+</div>
          <div className="text-sm text-[var(--slate-600)]">مشروع مكتمل</div>
        </div>
        <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)] text-center">
          <div className="text-2xl font-bold text-[var(--accent-500)] mb-1">24 ساعة</div>
          <div className="text-sm text-[var(--slate-600)]">متوسط وقت الاستجابة</div>
        </div>
        <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)] text-center">
          <div className="text-2xl font-bold text-[var(--accent-500)] mb-1">98%</div>
          <div className="text-sm text-[var(--slate-600)]">رضا العملاء</div>
        </div>
      </div>
    </div>
  );
}
