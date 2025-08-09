"use client";

export const dynamic = "force-dynamic";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonStyles } from "@/components/ui/Button";
import { clsx } from "clsx";

const schema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد غير صالح"),
  message: z.string().min(10, "الرسالة مطلوبة"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, setError } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        setError(field, { type: "manual", message: issue.message });
      });
      return;
    }
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) reset();
  };

  return (
    <main className="py-16 md:py-24">
      <Container>
        <SectionHeading title="تواصل" subtitle="رد سريع خلال 24 ساعة" align="center" className="mb-10" />
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl md:mx-auto grid gap-4">
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
            <label className="block text-sm mb-1">رسالتك</label>
            <textarea rows={5} className="w-full px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--elev)] bg-[var(--bg)]" {...register("message")} />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
          </div>
          <button disabled={isSubmitting} className={clsx(buttonStyles({ variant: "primary" }))}>
            {isSubmitting ? "يتم الإرسال..." : isSubmitSuccessful ? "تم الإرسال" : "أرسل"}
          </button>
        </form>
      </Container>
    </main>
  );
}


