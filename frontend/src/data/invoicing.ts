import { Invoice, Payment } from './types';

// ================================
// الفواتير - محدثة حسب نظام lineItems الجديد
// ================================

export const mockInvoices: Invoice[] = [
  {
    id: 'inv_001_restaurant',
    invoiceNumber: 'INV-2025-001234',
    projectId: 'p_001_restaurant',
    clientId: 'cl_001_restaurant',
    status: 'issued',
    currency: 'IQD',
    amount: {
      subtotal: 619800,
      discount: 0,
      tax: 0,
      total: 619800,
    },
    dueDate: new Date('2025-09-15'),
    issuedAt: new Date('2025-08-25'),
    paymentTerms: 'advance_50',
    lineItems: [
      {
        id: 'line_001',
        description: 'صور طعام عراقي - منيو المطعم',
        quantity: 15,
        unitPrice: 41320, // 619800 ÷ 15 = السعر النهائي للعميل مقسوم على الكمية
        total: 619800, // يطابق totalClientPrice من المشروع الجديد
      },
    ],
    relatedPaymentsCount: 1,
    notes: 'دفع مقدم 50% - المتبقي عند التسليم',
    createdAt: new Date('2025-08-25T10:00:00.000Z'),
    updatedAt: new Date('2025-08-29T08:15:00.000Z'),
  },
  {
    id: 'inv_002_salon',
    invoiceNumber: 'INV-2025-001235',
    projectId: 'p_002_salon_campaign',
    clientId: 'cl_002_salon',
    status: 'paid',
    currency: 'IQD',
    amount: {
      subtotal: 987372,
      discount: 0,
      tax: 0,
      total: 987372,
    },
    dueDate: new Date('2025-09-05'),
    issuedAt: new Date('2025-08-18'),
    paidAt: new Date('2025-08-28'),
    paymentTerms: 'advance_100',
    lineItems: [
      {
        id: 'line_002',
        description: 'حملة إعلانية شاملة - فيديو وصور',
        quantity: 8, // 3 فيديوهات + 5 صور
        unitPrice: 123421, // 987372 ÷ 8 متوسط سعر العنصر
        total: 987372, // يطابق totalClientPrice من المشروع الجديد
      },
    ],
    relatedPaymentsCount: 1,
    notes: 'دفع كامل قبل البدء في العمل',
    createdAt: new Date('2025-08-18T09:30:00.000Z'),
    updatedAt: new Date('2025-08-28T16:45:00.000Z'),
  },
  {
    id: 'inv_003_pharmacy',
    invoiceNumber: 'INV-2025-001236',
    projectId: 'p_003_pharmacy_branding',
    clientId: 'cl_003_pharmacy',
    status: 'issued',
    currency: 'IQD',
    amount: {
      subtotal: 359222,
      discount: 0,
      tax: 0,
      total: 359222,
    },
    dueDate: new Date('2025-09-15'),
    issuedAt: new Date('2025-08-28'),
    paymentTerms: 'net_15',
    lineItems: [
      {
        id: 'line_003',
        description: 'هوية بصرية أولية - شعار وبطاقات',
        quantity: 3, // شعار + 2 تصميم بطاقات
        unitPrice: 119741, // 359222 ÷ 3 متوسط سعر العنصر
        total: 359222, // يطابق totalClientPrice من المشروع الجديد
      },
    ],
    relatedPaymentsCount: 0,
    notes: 'فاتورة مشروع الهوية البصرية للصيدلية',
    createdAt: new Date('2025-08-28T13:20:00.000Z'),
    updatedAt: new Date('2025-08-29T08:15:00.000Z'),
  },
  {
    id: 'inv_004_personal',
    invoiceNumber: 'INV-2025-001237',
    projectId: 'p_004_personal_session',
    clientId: 'cl_004_individual',
    status: 'issued',
    currency: 'IQD',
    amount: {
      subtotal: 308880,
      discount: 0,
      tax: 0,
      total: 308880,
    },
    dueDate: new Date('2025-09-08'),
    issuedAt: new Date('2025-08-25'),
    paymentTerms: 'advance_100',
    lineItems: [
      {
        id: 'line_004',
        description: 'جلسة بورتريه احترافية',
        quantity: 8, // 8 صور بورتريه نهائية
        unitPrice: 38610, // 308880 ÷ 8 سعر الصورة الواحدة للعميل
        total: 308880, // يطابق totalClientPrice من المشروع الجديد
      },
    ],
    relatedPaymentsCount: 1,
    notes: 'جلسة تصوير شخصية - دفع مقدم كامل',
    createdAt: new Date('2025-08-25T14:45:00.000Z'),
    updatedAt: new Date('2025-08-28T11:30:00.000Z'),
  },
];

// ================================
// المدفوعات - محدثة حسب الفواتير الجديدة
// ================================

export const mockPayments: Payment[] = [
  {
    id: 'pay_001_restaurant',
    invoiceId: 'inv_001_restaurant',
    clientId: 'cl_001_restaurant',
    amount: 309900, // 50% من 619800
    method: 'manual',
    reference: 'TRF-2025-08-25-001',
    receivedAt: new Date('2025-08-25T16:30:00.000Z'),
    verifiedBy: 'sa_001_ali',
    verifiedAt: new Date('2025-08-25T17:00:00.000Z'),
    status: 'verified',
    notes: 'دفع مقدم 50% للمطعم - تحويل بنكي',
    createdAt: new Date('2025-08-25T16:30:00.000Z'),
    updatedAt: new Date('2025-08-25T17:00:00.000Z'),
  },
  {
    id: 'pay_002_salon',
    invoiceId: 'inv_002_salon',
    clientId: 'cl_002_salon',
    amount: 987372, // دفع كامل
    method: 'manual',
    reference: 'CASH-2025-08-28-001',
    receivedAt: new Date('2025-08-28T14:15:00.000Z'),
    verifiedBy: 'ad_002_ahmed',
    verifiedAt: new Date('2025-08-28T14:30:00.000Z'),
    status: 'verified',
    notes: 'دفع كامل نقداً للصالون',
    createdAt: new Date('2025-08-28T14:15:00.000Z'),
    updatedAt: new Date('2025-08-28T14:30:00.000Z'),
  },
  {
    id: 'pay_003_personal',
    invoiceId: 'inv_004_personal',
    clientId: 'cl_004_individual',
    amount: 308880, // دفع كامل مقدم
    method: 'manual',
    reference: 'TRF-2025-08-27-001',
    receivedAt: new Date('2025-08-27T10:45:00.000Z'),
    verifiedBy: 'sa_001_ali',
    verifiedAt: new Date('2025-08-27T11:00:00.000Z'),
    status: 'verified',
    notes: 'دفع مقدم كامل لجلسة البورتريه - تحويل بنكي',
    createdAt: new Date('2025-08-27T10:45:00.000Z'),
    updatedAt: new Date('2025-08-27T11:00:00.000Z'),
  },
];
