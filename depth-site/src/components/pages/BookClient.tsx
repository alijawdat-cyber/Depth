"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { clsx } from "clsx";

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL || "https://cal.com/";

export default function BookClient() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-[var(--radius)] border border-[var(--elev)] bg-[var(--card)] p-4 min-h-[520px]">
        <iframe
          title="Cal.com"
          src={CAL_URL}
          className="w-full h-[500px] rounded-[var(--radius-sm)] border border-[var(--elev)]"
          loading="lazy"
        />
      </section>

      <section className="rounded-[var(--radius)] border border-[var(--elev)] bg-[var(--card)] p-4">
        {submitted ? (
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">شكرًا، تم الاستلام ✅</h3>
            <p className="text-[var(--slate-600)] text-sm">
              ستصلك رسالة تأكيد مع رابط تقويم (ICS) وما الذي سيحدث لاحقًا.
            </p>
            <div className="flex gap-2 mt-2">
              <Link href="/" className={clsx(buttonStyles({ variant: "secondary" }))}>العودة للرئيسية</Link>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className={clsx(buttonStyles({ variant: "primary" }))}>تواصل واتساب</a>
            </div>
          </div>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <h3 className="text-lg font-semibold">نموذج أهلية سريع</h3>
            <div className="grid gap-2 text-sm">
              <label>
                القطاع
                <select className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--elev)] bg-transparent p-2">
                  <option>مطاعم/ضيافة</option>
                  <option>تجميل/عيادات</option>
                  <option>أزياء/تجزئة</option>
                  <option>خدمات/أخرى</option>
                </select>
              </label>
              <label>
                الميزانية الشهرية التقريبية (USD)
                <select className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--elev)] bg-transparent p-2">
                  <option>≤ 1,200</option>
                  <option>1,200–1,800</option>
                  <option>1,800–2,500</option>
                  <option>≥ 2,500</option>
                </select>
              </label>
              <label>
                الهدف الأساسي
                <select className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--elev)] bg-transparent p-2">
                  <option>حضور/أصول محتوى</option>
                  <option>تحويلات وإعلانات</option>
                  <option>كلاهما</option>
                </select>
              </label>
              <label>
                موقع العمل
                <input className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--elev)] bg-transparent p-2" placeholder="بغداد/أربيل/…" />
              </label>
              <label>
                رابط إنستغرام/موقع
                <input className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--elev)] bg-transparent p-2" placeholder="https://…" />
              </label>
              <label>
                بريد للتأكيد
                <input type="email" className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--elev)] bg-transparent p-2" placeholder="you@example.com" required />
              </label>
            </div>
            <button type="submit" className={clsx(buttonStyles({ variant: "primary" }))}>إرسال</button>
          </form>
        )}
      </section>
    </div>
  );
}


