"use client";

import { useState } from "react";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { clsx } from "clsx";

type PlanKey = "Basic" | "Growth" | "Pro";
type Detail = { label: string; values: Record<PlanKey, string>; };

const priceRow: Detail = {
  label: "السعر الشهري",
  values: { Basic: "$1,200", Growth: "$1,800", Pro: "$2,500" },
};

const keyOutcomes: Detail = {
  label: "نتائج متوقعة (شهر 2–3)",
  values: {
    Basic: "حضور منتظم + أصول أساسية",
    Growth: "زخم منشورات + اختبارات إعلانات",
    Pro: "آلة محتوى + حملات أداء ثابتة",
  },
};

const details: Detail[] = [
  { label: "أيام التصوير", values: { Basic: "2", Growth: "3", Pro: "4" } },
  { label: "تصاميم/شهر", values: { Basic: "8–10", Growth: "15–18", Pro: "22–25" } },
  { label: "ريلز/شهر", values: { Basic: "6–8", Growth: "10–12", Pro: "14–16 + موشن" } },
  { label: "التقارير", values: { Basic: "شهري", Growth: "نصف شهري", Pro: "أسبوعي + لوحة" } },
  { label: "إدارة الإعلانات", values: { Basic: "+12% (حد أدنى $350)", Growth: "+12% (حد أدنى $350)", Pro: "+12% (حد أدنى $500)" } },
  { label: "المراجعات", values: { Basic: "جولتان", Growth: "3 جولات", Pro: "غير حرجة حتى 4" } },
  { label: "التسليمات", values: { Basic: "Drive + روابط", Growth: "Drive + Dashboard", Pro: "Drive + Dashboard + نشر" } },
];

const exclusions: string[] = [
  "الوسائط المدفوعة غير مشمولة ضمن الأسعار (تدفع للمنصات)",
  "التصوير خارج بغداد أو مواقع خاصة بتكلفة إضافية",
  "المواهب/الممثلون والبروبز الخاصة بتكلفة منفصلة",
];

export default function PlansClient() {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div>
      <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--elev)] bg-[var(--card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--neutral-50)]">
              <th className="p-4 text-start">المعيار</th>
              <th className="p-4 text-center">Basic</th>
              <th className="p-4 text-center">Growth</th>
              <th className="p-4 text-center">Pro</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[var(--elev)]">
              <td className="p-4 font-medium">{priceRow.label}</td>
              {(["Basic","Growth","Pro"] as PlanKey[]).map((k) => (
                <td key={k} className="p-4 text-center">{priceRow.values[k]}</td>
              ))}
            </tr>
            <tr className="border-t border-[var(--elev)]">
              <td className="p-4 font-medium">{keyOutcomes.label}</td>
              {(["Basic","Growth","Pro"] as PlanKey[]).map((k) => (
                <td key={k} className="p-4 text-center">{keyOutcomes.values[k]}</td>
              ))}
            </tr>

            {details.map((row) => (
              <tr key={row.label} className="border-t border-[var(--elev)]">
                <td className="p-4">
                  <button
                    type="button"
                    className="underline decoration-dotted underline-offset-4 hover:text-[var(--accent-500)]"
                    onClick={() => setOpen((s) => ({ ...s, [row.label]: !s[row.label] }))}
                    aria-expanded={!!open[row.label]}
                  >
                    {row.label}
                  </button>
                  {open[row.label] ? (
                    <div className="mt-2 text-[var(--slate-600)] text-xs">
                      {row.label === "المراجعات" && "تشمل جولات على السكتش/المخطط ونسخة نهائية."}
                      {row.label === "التسليمات" && "تسليم منظم مع أسماء ملفات قياسية وملف تتبع."}
                    </div>
                  ) : null}
                </td>
                {(["Basic","Growth","Pro"] as PlanKey[]).map((k) => (
                  <td key={k} className="p-4 text-center">{row.values[k]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-[var(--radius)] border border-[var(--elev)] bg-[var(--card)] p-4">
        <h3 className="font-semibold mb-2">غير مشمول</h3>
        <ul className="list-disc space-y-1 ps-5 text-[var(--slate-600)]">
          {exclusions.map((e) => (<li key={e}>{e}</li>))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
        <a href="/book" className={clsx(buttonStyles({ variant: "primary", size: "lg" }))}>احجز جلسة 20 دقيقة</a>
        <a href="/legal" className={clsx(buttonStyles({ variant: "secondary", size: "lg" }))}>شروط مختصرة وFX Clause</a>
      </div>
    </div>
  );
}


