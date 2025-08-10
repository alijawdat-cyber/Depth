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

const schema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد غير صالح"),
  message: z.string().min(10, "الرسالة مطلوبة"),
  type: z.enum(["general", "pricing", "support", "press", "jobs"]).default("general"),
  source: z.string().optional(),
  honeypot: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, setError } = useForm<FormData>();

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
        toast.success("تم إرسال الرسالة بنجاح — سنعاودك خلال 24 ساعة");
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

  return (
    <main className="py-16 md:py-24">
      <Container>
        {/* زر الرجوع */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-[var(--slate-600)] hover:text-[var(--text)] transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            رجوع
          </button>
        </div>
        <SectionHeading title="تواصل" subtitle="رد سريع خلال 24 ساعة" align="center" className="mb-10" />
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl md:mx-auto grid gap-4">
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
          <div>
            <label className="block text-sm mb-1">الاسم</label>
            <input className="w-full h-11 px-3 rounded-[var(--radius-sm)] border border-[var(--elev)] bg-[var(--bg)]" {...register("name")} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">البريد</label>
            <input type="email" className="w-full h-11 px-3 rounded-[var(--radius-sm)] border border-[var(--elev)] bg-[var(--bg)]" {...register("email")} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">نوع الطلب</label>
            <select 
              className="w-full h-11 px-3 rounded-[var(--radius-sm)] border border-[var(--elev)] bg-[var(--bg)]" 
              {...register("type")}
              defaultValue="general"
            >
              <option value="general">استفسار عام</option>
              <option value="pricing">عرض أسعار / باقات</option>
              <option value="support">دعم فني</option>
              <option value="press">إعلام وصحافة</option>
              <option value="jobs">وظائف</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">رسالتك</label>
            <textarea rows={5} className="w-full px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--elev)] bg-[var(--bg)]" {...register("message")} />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
          </div>
          <button disabled={isSubmitting} className={clsx(buttonStyles({ variant: "primary" }), "disabled:opacity-60 disabled:cursor-not-allowed")}
            aria-live="polite" aria-busy={isSubmitting}
          >
            {isSubmitting ? "يتم الإرسال..." : isSubmitSuccessful ? "تم الإرسال" : "أرسل"}
          </button>
        </form>
      </Container>
    </main>
  );
}


