# Depth — توثيق الأدوار (Roles)

هذا المجلد يغطّي أدوار النظام داخل بوابة الوكالة ويرتّب الصلاحيات، التدفقات، السياسات الأمنية، والحوكمة.

## الهيكل
- admin/
  - 00-Overview.md — تعريف دور الأدمن والغرض.
  - 01-Permissions-Matrix.md — مصفوفة الصلاحيات (Modules × Actions).
  - 02-Role-Workflows.md — سيناريوهات شاشة واقعية خطوة بخطوة.
  - 03-Pricing-Catalog-Policies.md — سياسات الكتالوغ/التسعير والعملة وFX وGuardrails.
  - 04-Join-Flows.md — آليات الانضمام (Client/Creator/Employee).
  - 05-Rate-Override-Policy.md — سياسة الـ Override للمبدعين.
  - 06-Security-and-Access.md — الأمان، الجلسة، الأدوار/النطاقات.
  - 07-Governance-and-Versions.md — الإصدارات، الاعتمادات، اللقطات.
  - 08-KPIs-and-Reporting.md — مؤشرات الأداء والتقارير.
- creator/
  - 00-Overview.md — تعريف دور المبدع.
  - 01-Permissions-Matrix.md — صلاحيات المبدع.
  - 02-Role-Workflows.md — تدفّقات التسجيل/المهام/الرفع/Overrides.
  - 03-Profile-Spec.md — مواصفات بروفايل المبدع.
  - 05-Pricing-Visibility.md — سياسة رؤية التسعير للمبدع.
  - 07-KPIs-and-Reporting.md — مؤشرات أداء المبدع.
- client/
  - 00-Overview.md — تعريف دور العميل وحدود الوصول.
  - 01-Permissions-Matrix.md — صلاحيات العميل.
  - 02-Role-Workflows.md — تدفّقات العرض/الموافقة/المستندات/الملفات.
- employee/
  - 00-Overview.md — تعريف دور الموظف (راتب ثابت).
  - 01-Permissions-Matrix.md — صلاحيات الموظف.
  - 02-Role-Workflows.md — تدفّقات الدعوة/التعيين/الرفع.

- Permissions-Matrix-All.md — مصفوفة موحّدة (Roles × Modules) مختصرة.

ملاحظة: نوسّع أول ذكر لأي مصطلح إنكليزي داخل كل ملف (مثل SLA (Service Level Agreement — اتفاقية مستوى الخدمة)).
