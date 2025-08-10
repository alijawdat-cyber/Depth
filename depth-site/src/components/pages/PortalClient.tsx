"use client";

import { useState } from "react";

type Tab = "summary" | "files" | "approvals" | "reports";

export default function PortalClient() {
  const [tab, setTab] = useState<Tab>("summary");

  return (
    <div className="rounded-[var(--radius)] border border-[var(--elev)] bg-[var(--card)]">
      <div className="flex gap-2 p-2 border-b border-[var(--elev)]">
        {(["summary","files","approvals","reports"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-[var(--radius-sm)] ${tab===t?"bg-[var(--neutral-50)]":"hover:bg-[var(--neutral-50)]"}`}
          >
            {t === "summary" && "ملخص"}
            {t === "files" && "الملفات"}
            {t === "approvals" && "الموافقات"}
            {t === "reports" && "التقارير"}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tab === "summary" && (
          <div className="grid gap-2 text-sm">
            <div>العقد: Pro (شهر-إلى-شهر)</div>
            <div>الفوترة: USD → تحصيل IQD (FX ±3%)</div>
            <div>الحالة: نشط — الدفعة القادمة 28/08</div>
          </div>
        )}
        {tab === "files" && (
          <div className="text-sm text-[var(--slate-600)]">إدراج روابط Drive/Frame.io هنا (Embed لاحقًا)</div>
        )}
        {tab === "approvals" && (
          <div className="text-sm text-[var(--slate-600)]">قائمة موافقات بسيطة مع حالة وزمن التعديل</div>
        )}
        {tab === "reports" && (
          <div className="text-sm text-[var(--slate-600)]">ملخص أسبوعي + تقرير شهري (روابط PDF/لوحة بيانات)</div>
        )}
      </div>
    </div>
  );
}


