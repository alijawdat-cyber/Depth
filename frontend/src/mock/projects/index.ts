// ================================ // ملف منظم
// مجمّع مشاريع (Projects Aggregator) - SSOT // وصف عام
// - يعيد تصدير وحدات المشاريع بشكل namespaced لتجنب تعارض الرموز // سياسة
// - يغطي: المهام، المشاريع، طلبات المشاريع، وترشيحات المبدعين // نطاق
// ================================ // فاصل

export * as tasks from './tasks'; // مهام المشاريع (إنشاء وتسعير ومؤشرات)
export * as projects from './projects'; // مشاريع موحّدة (تجميع وإجماليات)
export * as projectRequests from './projectRequests'; // طلبات المشاريع (تحويل لمسودات)
export * as creatorRecommendations from './creatorRecommendations'; // ترشيحات المبدعين (خوارزمية بسيطة)
