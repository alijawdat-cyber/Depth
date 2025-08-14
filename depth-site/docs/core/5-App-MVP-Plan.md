## خطة التطبيق الإداري (MVP — Minimum Viable Product — الحد الأدنى من المنتج القابل للتطبيق)

- **المرحلة 1 (الآن)**: Google Sheets + Drive + تقويم مشترك.
  - تتبّع العملاء، الطلبات، التسعير، التسليمات، حالة المراجعات.
  - مجلدات Drive لكل عميل/مشروع؛ Template لتسمية الملفات.
- **المرحلة 2**: Flutter + Firebase (Auth/Firestore/Storage) 
  - **Features**: Kanban بسيط، Asset Library، Templates توقيع، تنبيهات مهام/مراجعات.
  - **الأدوار**: Admin، Producer، Editor، Client (عرض ومراجعة فقط).
  - **نموذج بيانات مختصر**: Clients، Projects، Deliverables، Tasks، Assets، Reviews، Invoices (أساسيات).
  - **التكاملات**: Frame.io/Drive، Webhooks للبريد/الاشعارات.
- **مؤشرات النجاح**: تقليل زمن الدورة من Intake إلى تسليم بنسبة 20–30% خلال 90 يوم؛ وضوح الحالة لكل مشروع؛ تقليل ضياع الأصول.
