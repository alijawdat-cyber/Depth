"use client";

export const dynamic = "force-dynamic";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const schema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين").max(100, "الاسم طويل جداً"),
  email: z.string().email("بريد إلكتروني غير صحيح").max(255, "البريد طويل جداً"),
  message: z.string().min(10, "الرسالة يجب أن تكون أكثر من 10 أحرف").max(2000, "الرسالة طويلة جداً"),
  type: z.enum(["general", "pricing", "support", "social", "jobs"]).default("general"),
  source: z.string().optional(),
  honeypot: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inquiryTypes = [
  { value: "general", label: "استفسار عام", icon: "💬", desc: "أسئلة عامة حول الخدمات", sla: "24 ساعة" },
  { value: "pricing", label: "عرض أسعار", icon: "💰", desc: "طلب عرض أسعار مخصص", sla: "8 ساعات" },
  { value: "support", label: "دعم فني", icon: "🔧", desc: "مساعدة تقنية ودعم", sla: "6 ساعات" },
  { value: "social", label: "سوشيال ميديا", icon: "📱", desc: "إدارة منصات التواصل", sla: "12 ساعة" },
  { value: "jobs", label: "وظائف", icon: "👥", desc: "فرص العمل والتوظيف", sla: "72 ساعة" }
];

export default function ContactPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("general");
  const [isOnline, setIsOnline] = useState(true);
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, setError, setValue, watch } = useForm<FormData>();

  // Real-time validation
  const watchName = watch("name");
  const watchEmail = watch("email");
  const watchMessage = watch("message");

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time email validation
  const isValidEmail = (email: string) => {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const onSubmit = async (data: FormData) => {
    if (!isOnline) {
      toast.error("لا يوجد اتصال بالإنترنت. تحقق من الشبكة وحاول مرة أخرى");
      return;
    }

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        setError(field, { type: "manual", message: issue.message });
      });
      toast.error("يرجى تصحيح الحقول المحددة");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        reset();
        setSelectedType("general");
        const selectedInquiry = inquiryTypes.find(t => t.value === data.type);
        
        // Enhanced success message with request ID
        const successMsg = result.requestId 
          ? `تم إرسال ${selectedInquiry?.label} بنجاح! سنرد خلال ${selectedInquiry?.sla} • معرف الطلب: ${result.requestId.slice(0, 8)}`
          : `تم إرسال ${selectedInquiry?.label} بنجاح! سنرد خلال ${selectedInquiry?.sla}`;
        
        toast.success(successMsg, { duration: 6000 });
      } else {
        // Enhanced error handling
        const errorMessages = {
          rate_limit: result.message || "تم إرسال عدد كبير من الطلبات. حاول مرة أخرى خلال 10 دقائق",
          validation: "بيانات غير صحيحة. تحقق من الحقول وحاول مرة أخرى",
          missing_api_key: "الخدمة غير مفعّلة مؤقتاً. حاول مرة أخرى خلال دقائق قليلة",
          server_error: result.message || "حدث خطأ في الخادم. حاول مرة أخرى"
        };

        const errorMsg = errorMessages[result.error as keyof typeof errorMessages] || "تعذّر الإرسال. حاول مرة أخرى";
        toast.error(errorMsg);
      }
    } catch {
      toast.error("تعذّر الاتصال بالخادم. تحقق من الشبكة وحاول مرة أخرى");
    }
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setValue("type", type as "general" | "pricing" | "support" | "social" | "jobs");
  };

  const selectedInquiry = inquiryTypes.find(t => t.value === selectedType);

  // Smart back button functionality for Instagram in-app browser
  const handleBackButton = () => {
    if (typeof window !== 'undefined') {
      // Check if we have valid history
      if (window.history.length > 1 && document.referrer && 
          document.referrer.includes(window.location.hostname)) {
        router.back();
      } else {
        // Fallback to home page for Instagram/external browsers
        router.push('/');
      }
    }
  };

  return (
    <main className="py-8 md:py-16 min-h-screen bg-gradient-to-br from-[var(--bg)] to-[var(--elev)] overflow-x-hidden">
      <Container className="overflow-x-hidden">
        {/* Fixed Header with Centered Logo */}
        <div className="mb-8 md:mb-12">
          {/* Back Button Row */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackButton}
              className="inline-flex items-center gap-2 text-sm text-[var(--slate-600)] hover:text-[var(--text)] transition-colors duration-200 hover:scale-105 touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              رجوع
            </button>
            
            {/* Network Status Indicator */}
            <div className={clsx(
              "px-2 py-1 rounded-full text-xs font-medium shrink-0",
              isOnline 
                ? "bg-green-100 text-green-800 border border-green-200" 
                : "bg-red-100 text-red-800 border border-red-200"
            )}>
              {isOnline ? "🟢 متصل" : "🔴 غير متصل"}
            </div>
          </div>

          {/* Centered Logo */}
          <div className="flex justify-center">
            <Link 
              href="/"
              className="flex items-center gap-3 hover:scale-105 transition-transform duration-200 touch-manipulation"
            >
              <Image 
                src="/brand/logo.svg"
                alt="Depth"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-[var(--text)]">Depth</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <SectionHeading 
            title="تواصل معنا" 
            subtitle="نعمل على الرد خلال ساعات قليلة حسب نوع طلبك" 
            align="center" 
            className="mb-12" 
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* honeypot anti-spam field (should remain empty) */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              {...register("honeypot")}
            />
            {/* source marker */}
            <input type="hidden" defaultValue="/contact" {...register("source")}/>

            {/* Inquiry Type Selection - Mobile Optimized */}
            <div className="space-y-4 w-full overflow-hidden">
              <label className="block text-base font-medium text-[var(--text)] mb-4">
                نوع الطلب <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {inquiryTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeSelect(type.value)}
                    className={clsx(
                      "w-full max-w-full p-3 sm:p-4 rounded-xl border-2 text-right transition-all duration-200 hover:scale-[1.01] touch-manipulation overflow-hidden",
                      selectedType === type.value
                        ? "border-[#621cf0] bg-[#621cf0]/5 shadow-lg shadow-[#621cf0]/20"
                        : "border-[var(--elev)] bg-[var(--card)] hover:border-[#621cf0]/50"
                    )}
                  >
                    <div className="flex items-start gap-2 sm:gap-3 w-full min-w-0">
                      <span className="text-xl sm:text-2xl shrink-0">{type.icon}</span>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="font-semibold text-[var(--text)] mb-1 text-sm sm:text-base truncate">{type.label}</div>
                        <div className="text-xs text-[var(--slate-600)] mb-1 leading-tight">{type.desc}</div>
                        <div className="text-xs font-medium text-[#621cf0]">SLA: {type.sla}</div>
                      </div>
                      {selectedType === type.value && (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#621cf0] mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <input type="hidden" {...register("type")} value={selectedType} />
            </div>

            {/* Name Field with Real-time Validation */}
            <div className="space-y-2 w-full">
              <label className="block text-base font-medium text-[var(--text)]">
                الاسم <span className="text-red-500">*</span>
                {watchName && watchName.length >= 2 && (
                  <span className="text-green-600 text-sm ml-2">✓</span>
                )}
              </label>
              <input 
                className={clsx(
                  "w-full max-w-full h-12 px-4 rounded-xl border bg-[var(--card)] transition-all duration-200 focus:ring-2 focus:ring-[#621cf0] focus:border-[#621cf0] box-border",
                  errors.name ? "border-red-500" : 
                  watchName && watchName.length >= 2 ? "border-green-500" : "border-[var(--elev)]"
                )}
                placeholder="أدخل اسمك الكامل"
                {...register("name")} 
              />
              {errors.name && <p className="text-red-500 text-sm break-words">{errors.name.message}</p>}
              <p className="text-xs text-[var(--slate-600)]">
                {watchName ? `${watchName.length}/100` : "2-100 حرف"}
              </p>
            </div>

            {/* Email Field with Real-time Validation */}
            <div className="space-y-2 w-full">
              <label className="block text-base font-medium text-[var(--text)]">
                البريد الإلكتروني <span className="text-red-500">*</span>
                {watchEmail && isValidEmail(watchEmail) && (
                  <span className="text-green-600 text-sm ml-2">✓</span>
                )}
              </label>
              <input 
                type="email" 
                className={clsx(
                  "w-full max-w-full h-12 px-4 rounded-xl border bg-[var(--card)] transition-all duration-200 focus:ring-2 focus:ring-[#621cf0] focus:border-[#621cf0] box-border",
                  errors.email ? "border-red-500" : 
                  watchEmail && isValidEmail(watchEmail) ? "border-green-500" : "border-[var(--elev)]"
                )}
                placeholder="example@domain.com"
                {...register("email")} 
              />
              {errors.email && <p className="text-red-500 text-sm break-words">{errors.email.message}</p>}
            </div>

            {/* Message Field with Real-time Validation */}
            <div className="space-y-2 w-full">
              <label className="block text-base font-medium text-[var(--text)]">
                رسالتك <span className="text-red-500">*</span>
                {watchMessage && watchMessage.length >= 10 && (
                  <span className="text-green-600 text-sm ml-2">✓</span>
                )}
              </label>
              <textarea 
                rows={6} 
                className={clsx(
                  "w-full max-w-full px-4 py-3 rounded-xl border bg-[var(--card)] transition-all duration-200 focus:ring-2 focus:ring-[#621cf0] focus:border-[#621cf0] resize-none box-border",
                  errors.message ? "border-red-500" : 
                  watchMessage && watchMessage.length >= 10 ? "border-green-500" : "border-[var(--elev)]"
                )}
                placeholder="اكتب رسالتك بالتفصيل..."
                {...register("message")} 
              />
              {errors.message && <p className="text-red-500 text-sm break-words">{errors.message.message}</p>}
              <p className="text-xs text-[var(--slate-600)]">
                {watchMessage ? `${watchMessage.length}/2000` : "10-2000 حرف"}
              </p>
            </div>

            {/* Submit Button - Mobile Optimized */}
            <button 
              disabled={isSubmitting || !isOnline} 
              className={clsx(
                buttonStyles({ variant: "primary" }), 
                "w-full max-w-full h-12 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] disabled:hover:scale-100 touch-manipulation box-border",
                (isSubmitting || !isOnline) && "cursor-wait"
              )}
              aria-live="polite" 
              aria-busy={isSubmitting}
            >
              {!isOnline ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  لا يوجد اتصال
                </span>
              ) : isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  يتم الإرسال...
                </span>
              ) : isSubmitSuccessful ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  تم الإرسال بنجاح
                </span>
              ) : (
                "إرسال الرسالة"
              )}
            </button>

            {/* Response Time Info - Mobile Optimized */}
            <div className="bg-[var(--card)] border border-[var(--elev)] rounded-xl p-3 sm:p-4 text-center w-full max-w-full overflow-hidden">
              <p className="text-sm text-[var(--slate-600)] break-words">
                ⏱️ <strong>وقت الاستجابة المتوقع:</strong> {selectedInquiry?.sla}
              </p>
              <p className="text-xs text-[var(--slate-600)] mt-1 break-words leading-relaxed">
                📧 يصل إليك تأكيد فوري + رد من {selectedInquiry?.value === "pricing" ? "فريق المبيعات" : selectedInquiry?.value === "support" ? "فريق الدعم" : selectedInquiry?.value === "press" ? "فريق الإعلام" : selectedInquiry?.value === "jobs" ? "فريق التوظيف" : "فريق خدمة العملاء"}
              </p>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
}