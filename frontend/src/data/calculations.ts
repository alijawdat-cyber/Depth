import { ProjectLineItem } from './types';
import { mockPricingModifiers } from './pricing';
import { mockSubcategories } from './categories';
import { mockSystemSettings } from './system_settings';

// ================================
// دوال حساب التسعير الجديدة - نظام lineItems
// ================================

// دالة الحصول على المعدل بالمفتاح
export const getModifierByKey = (category: string, key: string): number => {
  const modifier = mockPricingModifiers.find(m => m.category === category && m.key === key);
  return modifier ? modifier.value : 1.0;
};

// دالة الحصول على السعر الأساسي للفئة الفرعية
export const getSubcategoryBasePrice = (subcategoryId: string): number => {
  const subcategory = mockSubcategories.find(sub => sub.id === subcategoryId);
  return subcategory ? subcategory.basePrice : 0;
};

// دالة حساب سعر المبدع للعنصر الواحد (lineItem)
export const calculateLineItemPrice = (
  basePrice: number,
  quantity: number,
  processingKey: string = 'basic',
  experienceKey: string = 'fresh',
  equipmentKey: string = 'silver',
  rushKey: string = 'normal',
  ownershipKey: string = 'owned',
  locationKey: 'studio' | 'client' | 'nearby' | 'outskirts' | 'far' = 'studio'
): { unitCreatorPrice: number; totalCreatorPrice: number; locationAddition: number } => {
  // الحصول على المعدلات
  const processingMod = getModifierByKey('processing', processingKey);
  const experienceMod = getModifierByKey('experience', experienceKey);
  const equipmentMod = getModifierByKey('equipment', equipmentKey);
  const rushMod = getModifierByKey('rush', rushKey);
  const ownershipMod = getModifierByKey('ownership', ownershipKey);
  const locationAddition = getLocationAddition(locationKey);
  
  // حساب سعر المبدع للوحدة الواحدة
  const unitCreatorPrice = Math.round(
    basePrice * ownershipMod * processingMod * experienceMod * equipmentMod * rushMod + (locationAddition / quantity)
  );
  
  // حساب السعر الإجمالي للعنصر
  const totalCreatorPrice = unitCreatorPrice * quantity;
  
  return {
    unitCreatorPrice,
    totalCreatorPrice,
    locationAddition
  };
};

// دالة حساب مشروع متعدد العناصر
export const calculateMultiItemProject = (
  lineItems: Omit<ProjectLineItem, 'unitCreatorPrice' | 'totalCreatorPrice'>[],
  globalModifiers: {
    experienceKey?: string;
    equipmentKey?: string;
    rushKey?: string;
    ownershipKey?: string;
    locationKey?: 'studio' | 'client' | 'nearby' | 'outskirts' | 'far';
  } = {}
): {
  calculatedLineItems: ProjectLineItem[];
  totalBasePrice: number;
  totalCreatorPrice: number;
  totalClientPrice: number;
  agencyMarginPercent: number;
  agencyMarginAmount: number;
} => {
  const {
    experienceKey = 'fresh',
    equipmentKey = 'silver',
    rushKey = 'normal',
    ownershipKey = 'owned',
    locationKey = 'studio'
  } = globalModifiers;

  let totalBasePrice = 0;
  let totalCreatorPrice = 0;
  
  // حساب كل عنصر على حدة
  const calculatedLineItems: ProjectLineItem[] = lineItems.map(item => {
    const subcategoryBasePrice = item.basePrice || getSubcategoryBasePrice(item.subcategoryId);
    
    const { unitCreatorPrice, totalCreatorPrice: itemTotal } = calculateLineItemPrice(
      subcategoryBasePrice,
      item.quantity,
      item.processingLevel,
      experienceKey,
      equipmentKey,
      rushKey,
      ownershipKey,
      locationKey
    );
    
    totalBasePrice += subcategoryBasePrice * item.quantity;
    totalCreatorPrice += itemTotal;
    
    return {
      ...item,
      basePrice: subcategoryBasePrice,
      unitCreatorPrice,
      totalCreatorPrice: itemTotal
    };
  });
  
  // حساب هامش الوكالة (من الإعدادات المركزية)
  const agencyMarginPercent = mockSystemSettings.defaultMarginPercent;
  const agencyMarginAmount = Math.round(totalCreatorPrice * agencyMarginPercent);
  const totalClientPrice = totalCreatorPrice + agencyMarginAmount;
  
  return {
    calculatedLineItems,
    totalBasePrice,
    totalCreatorPrice,
    totalClientPrice,
    agencyMarginPercent,
    agencyMarginAmount
  };
};

// دالة للحصول على معدل الموقع (طبقاً للمتطلبات V2.0)
export const getLocationAddition = (location: 'studio' | 'client' | 'outskirts' | 'nearby' | 'far'): number => {
  switch (location) {
    case 'studio':
      return 0; // استوديو الوكالة - بدون رسوم إضافية
    case 'client':
      return 0; // موقع العميل داخل بغداد - بدون رسوم إضافية
    case 'outskirts':
      return 25000; // أطراف بغداد - 25,000 دينار
    case 'nearby':
      return 50000; // محافظات مجاورة - 50,000 دينار
    case 'far':
      return 100000; // محافظات بعيدة - 100,000 دينار
    default:
      return 0;
  }
};

// دالة حساب سريع للأسعار (للمشاريع البسيطة - للتوافق مع النظام القديم)
export const quickPriceCalculation = (
  basePrice: number,
  agencyMarginPercent: number = mockSystemSettings.defaultMarginPercent
): { creatorPrice: number; clientPrice: number; margin: number; } => {
  const creatorPrice = basePrice;
  const margin = Math.round(creatorPrice * agencyMarginPercent);
  const clientPrice = creatorPrice + margin;
  
  return {
    creatorPrice,
    clientPrice,
    margin,
  };
};
