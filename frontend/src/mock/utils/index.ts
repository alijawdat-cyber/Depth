// ================================
// Utils Aggregator - تجميعة أدوات الموك
// ================================
export * from './mockService'; // تصدير خدمات CRUD/الاستعلام الموحدة
export * from './dataGenerator'; // تصدير مولّد البيانات المترابطة

// أداة وقت ISO موحّدة لتقليل التكرار عبر الموك
export const nowIso = (): string => new Date().toISOString();
