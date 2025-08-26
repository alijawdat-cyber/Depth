# سياسة مكتبة وحدة لكل شغلة (One Library Per Job)

الغرض: نتجنّب تكرار مكتبات تقدم نفس الوظيفة حتى تبقى القاعدة نظيفة وواضحة.

المعتمد حالياً:
- Icons: lucide-react عبر `src/components/primitives/Icon.tsx` فقط.
- UI primitives: Radix UI (Dialog/DropdownMenu/Tabs) — بدون بدائل.
- Animations: framer-motion.
- Forms: react-hook-form + zod للتحقق.
- Data fetching: swr.
- Tables: @tanstack/react-table.
- Date picker: react-day-picker.
- Phone input: react-phone-number-input.
- Charts: recharts.

قواعد:
- ممنوع استيراد المكتبة مباشرة إذا عدنا wrapper (مثل الأيقونات) — استعمل اللفة الموحدة فقط.
- أي إضافة مكتبة جديدة لازم تحديث هذا الملف، وتبرير سبب اختيارها بدل بدائلها.
- إذا احتجنا ميزة ناقصة، ننشئ wrapper صغير بدل تبديل المكتبة كاملة.
