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
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد غير صالح"),
  message: z.string().min(10, "الرسالة مطلوبة"),
  type: z.enum(["general", "pricing", "support", "press", "jobs"]).default("general"),
  source: z.string().optional(),
  honeypot: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inquiryTypes = [
  { value: "general", label: "استفسار عام", icon: "💬", desc: "أسئلة عامة حول الخدمات" },
  { value: "pricing", label: "عرض أسعار", icon: "💰", desc: "طلب عرض أسعار مخصص" },
  { value: "support", label: "دعم فني", icon: "🔧", desc: "مساعدة تقنية ودعم" },
  { value: "press", label: "إعلام وصحافة", icon: "📰", desc: "استفسارات إعلامية" },
  { value: "jobs", label: "وظائف", icon: "👥", desc: "فرص العمل والتوظيف" }
];

export default function ContactPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("general");
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, setError, setValue } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
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
      if (res.ok) {
        reset();
        setSelectedType("general");
        const selectedInquiry = inquiryTypes.find(t => t.value === data.type);
        toast.success(`تم إرسال ${selectedInquiry?.label} بنجاح — سنعاود اتصال خلال ${data.type === "pricing" ? "8 ساعات" : data.type === "support" ? "6 ساعات" : data.type === "jobs" ? "72 ساعة" : "24 ساعة"}`);
      } else {
        const { error } = (await res.json().catch(() => ({ error: "" }))) as {
          error?: string;
        };
        toast.error(error === "missing_api_key" ? "الخدمة غير مفعّلة مؤقتاً — جرّب لاحقاً" : "تعذّر الإرسال، حاول مجدداً");
      }
    } catch {
      toast.error("تعذّر الاتصال بالخادم، تأكّد من الشبكة");
    }
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setValue("type", type as any);
  };

  return (
    <main className="py-16 md:py-24 min-h-screen bg-gradient-to-br from-[var(--bg)] to-[var(--elev)]">
      <Container>
        {/* Header with Logo and Back Button */}
        <div className="mb-12 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-[var(--slate-600)] hover:text-[var(--text)] transition-colors duration-200 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            رجوع
          </button>
          
          <div className="flex items-center gap-3">
            <Image 
              src="/brand/logo.svg"
              alt="Depth"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-lg font-semibold text-[var(--text)]">Depth</span>
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

            {/* Inquiry Type Selection */}
            <div className="space-y-4">
              <label className="block text-base font-medium text-[var(--text)] mb-4">
                نوع الطلب <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {inquiryTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeSelect(type.value)}
                    className={clsx(
                      "p-4 rounded-xl border-2 text-right transition-all duration-200 hover:scale-[1.02]",
                      selectedType === type.value
                        ? "border-[#621cf0] bg-[#621cf0]/5 shadow-lg shadow-[#621cf0]/20"
                        : "border-[var(--elev)] bg-[var(--card)] hover:border-[#621cf0]/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-[var(--text)] mb-1">{type.label}</div>
                        <div className="text-xs text-[var(--slate-600)]">{type.desc}</div>
                      </div>
                      {selectedType === type.value && (
                        <svg className="w-5 h-5 text-[#621cf0] mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <input type="hidden" {...register("type")} value={selectedType} />
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-[var(--text)]">
                الاسم <span className="text-red-500">*</span>
              </label>
              <input 
                className={clsx(
                  "w-full h-12 px-4 rounded-xl border bg-[var(--card)] transition-all duration-200 focus:ring-2 focus:ring-[#621cf0] focus:border-[#621cf0]",
                  errors.name ? "border-red-500" : "border-[var(--elev)]"
                )}
                placeholder="أدخل اسمك الكامل"
                {...register("name")} 
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-[var(--text)]">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                className={clsx(
                  "w-full h-12 px-4 rounded-xl border bg-[var(--card)] transition-all duration-200 focus:ring-2 focus:ring-[#621cf0] focus:border-[#621cf0]",
                  errors.email ? "border-red-500" : "border-[var(--elev)]"
                )}
                placeholder="example@domain.com"
                {...register("email")} 
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-[var(--text)]">
                رسالتك <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={6} 
                className={clsx(
                  "w-full px-4 py-3 rounded-xl border bg-[var(--card)] transition-all duration-200 focus:ring-2 focus:ring-[#621cf0] focus:border-[#621cf0] resize-none",
                  errors.message ? "border-red-500" : "border-[var(--elev)]"
                )}
                placeholder="اكتب رسالتك بالتفصيل..."
                {...register("message")} 
              />
              {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
            </div>

            {/* Submit Button */}
            <button 
              disabled={isSubmitting} 
              className={clsx(
                buttonStyles({ variant: "primary" }), 
                "w-full h-12 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100",
                isSubmitting && "cursor-wait"
              )}
              aria-live="polite" 
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
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

            {/* Response Time Info */}
            <div className="bg-[var(--card)] border border-[var(--elev)] rounded-xl p-4 text-center">
              <p className="text-sm text-[var(--slate-600)]">
                ⏱️ <strong>وقت الاستجابة المتوقع:</strong> {" "}
                {selectedType === "pricing" ? "8 ساعات" : 
                 selectedType === "support" ? "6 ساعات" : 
                 selectedType === "jobs" ? "72 ساعة" : "24 ساعة"}
              </p>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
}