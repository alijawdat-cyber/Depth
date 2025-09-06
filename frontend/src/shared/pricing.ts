// ملاحظة: نقبل شكلاً ضيقاً لتجنب فرض نوع Project كامل
export type ClientAllocationInput = {
  lineItems: Array<{ id: string; quantity: number; totalCreatorPrice: number }>;
  totalClientPrice: number;
  totalCreatorPrice: number;
};

/**
 * allocateClientPricePerLine
 * توزع إجمالي سعر العميل على البنود بنسبة مساهمة إجمالي سعر المبدعين لكل بند.
 * لا تقوم بتخزين دائم؛ مخصصة للعرض فقط (client view / quotes breakdown).
 */
export function allocateClientPricePerLine(project: ClientAllocationInput): Array<{
  lineId: string;
  quantity: number;
  clientUnit: number;
  clientTotal: number;
}> {
  const items = project.lineItems;
  const totalCreator = items.reduce((s, li) => s + (li.totalCreatorPrice || 0), 0);
  if (totalCreator <= 0) {
    // لا يمكن التوزيع، رجّع أصفارًا آمنة
    return items.map((li) => ({
      lineId: li.id,
      quantity: li.quantity,
      clientUnit: 0,
      clientTotal: 0,
    }));
  }

  // نسبة مساهمة كل بند من إجمالي سعر المبدعين
  // ثم خصّص إجمالي سعر العميل بناءً على النسب
  const allocations = items.map((li) => {
    const share = li.totalCreatorPrice / totalCreator; // 0..1
    const lineClientTotalRaw = project.totalClientPrice * share;
    // قسّم على الكمية للحصول على سعر عميل للوحدة
    const unit = li.quantity > 0 ? Math.round(lineClientTotalRaw / li.quantity) : 0;
    const total = Math.round(unit * li.quantity);
    return {
      lineId: li.id,
      quantity: li.quantity,
      clientUnit: unit,
      clientTotal: total,
    };
  });

  return allocations;
}
