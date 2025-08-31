import { 
  Notification, 
  ProjectRequest, 
  Quote,
  Contract 
} from './types';

// ================================
// الإشعارات
// ================================

export const mockNotifications: Notification[] = [
  {
    id: 'notif_001_project_milestone',
    recipientId: 'cl_001_restaurant',
    recipientType: 'client',
    type: 'project_milestone',
    priority: 'high',
    title: 'تم إنجاز مرحلة التصوير',
    message: 'تم الانتهاء من جلسة التصوير بنجاح وسيتم البدء في المعالجة غداً صباحاً',
    isRead: false,
    actions: [
      { type: 'view', label: 'عرض المشروع', url: '/projects/p_001' },
      { type: 'approve', label: 'الموافقة على المرحلة', url: '/projects/p_001/approve' }
    ],
    details: {
      projectId: 'p_001',
      projectTitle: 'تصوير منيو مطعم بيت بغداد',
      creatorName: 'فاطمة أحمد علي',
      milestoneCompleted: 'photography_session'
    },
    createdAt: '2025-08-28T14:30:00.000Z',
    updatedAt: '2025-08-28T14:30:00.000Z'
  },
  {
    id: 'notif_002_payment_reminder',
    recipientId: 'cl_002_salon',
    recipientType: 'client',
    type: 'payment_reminder',
    priority: 'medium',
    title: 'تذكير بموعد دفع الفاتورة',
    message: 'فاتورة INV-2025-001235 مستحقة الدفع خلال 3 أيام',
    isRead: true,
    actions: [
      { type: 'pay', label: 'دفع الفاتورة', url: '/invoices/inv_002/pay' },
      { type: 'view', label: 'عرض التفاصيل', url: '/invoices/inv_002' }
    ],
    details: {
      invoiceId: 'inv_002',
      amount: 256215,
      dueDate: '2025-09-01T00:00:00.000Z'
    },
    createdAt: '2025-08-27T09:00:00.000Z',
    updatedAt: '2025-08-27T12:15:00.000Z'
  },
  {
    id: 'notif_003_creator_assigned',
    recipientId: 'c_001_fatima',
    recipientType: 'creator',
    type: 'project_assigned',
    priority: 'high',
    title: 'تم تعيينك لمشروع جديد',
    message: 'تم اختيارك لتنفيذ مشروع تصوير منتجات لصيدلية الشفاء الحديثة',
    isRead: false,
    actions: [
      { type: 'accept', label: 'قبول المشروع', url: '/projects/p_003/accept' },
      { type: 'view', label: 'عرض التفاصيل', url: '/projects/p_003' },
      { type: 'decline', label: 'رفض المشروع', url: '/projects/p_003/decline' }
    ],
    details: {
      projectId: 'p_003',
      projectTitle: 'تصوير منتجات صيدلية الشفاء الحديثة',
      clientName: 'هدى طالب كريم',
      deadline: '2025-09-05T17:00:00.000Z',
      rate: 136125 // مصحح حسب الحساب الجديد
    },
    createdAt: '2025-08-28T16:45:00.000Z',
    updatedAt: '2025-08-28T16:45:00.000Z'
  },
  {
    id: 'notif_004_admin_approval_needed',
    recipientId: 'sa_001_ali',
    recipientType: 'admin',
    type: 'admin_action_required',
    priority: 'urgent',
    title: 'طلب مشروع جديد يحتاج موافقة',
    message: 'عميل جديد (عمار طالب رشيد) أرسل طلب مشروع بميزانية 350,000 دينار',
    isRead: false,
    actions: [
      { type: 'approve', label: 'الموافقة على الطلب', url: '/admin/requests/req_005/approve' },
      { type: 'review', label: 'مراجعة الطلب', url: '/admin/requests/req_005' },
      { type: 'reject', label: 'رفض الطلب', url: '/admin/requests/req_005/reject' }
    ],
    details: {
      requestId: 'req_005',
      clientName: 'عمار طالب رشيد',
      projectType: 'portrait_photography',
      estimatedBudget: 30375, // مصحح حسب الحساب الجديد
      urgency: 'normal'
    },
    createdAt: '2025-08-29T08:20:00.000Z',
    updatedAt: '2025-08-29T08:20:00.000Z'
  },
  {
    id: 'notif_005_delivery_ready',
    recipientId: 'cl_004_individual',
    recipientType: 'client',
    type: 'project_delivery',
    priority: 'high',
    title: 'مشروعك جاهز للتسليم',
    message: 'تم الانتهاء من مشروع البورتريه الشخصي وهو جاهز للمراجعة والتسليم',
    isRead: false,
    actions: [
      { type: 'download', label: 'تحميل الملفات', url: '/projects/p_004/download' },
      { type: 'review', label: 'مراجعة النتائج', url: '/projects/p_004/review' },
      { type: 'feedback', label: 'إضافة تقييم', url: '/projects/p_004/feedback' }
    ],
    details: {
      projectId: 'p_004',
      projectTitle: 'بورتريه شخصي - عمار طالب رشيد',
      creatorName: 'كريم فاضل عبود',
      deliveredFiles: 8,
      deliveryDate: '2025-08-29T15:00:00.000Z'
    },
    createdAt: '2025-08-29T15:00:00.000Z',
    updatedAt: '2025-08-29T15:00:00.000Z'
  }
];

// ================================
// طلبات المشاريع
// ================================

export const mockProjectRequests: ProjectRequest[] = [
  {
    id: 'req_001_restaurant_menu',
    clientId: 'cl_001_restaurant',
    title: 'تصوير منيو مطعم بيت بغداد الجديد',
    description: 'نحتاج تصوير احترافي لـ 25 طبق جديد في القائمة مع إبراز الألوان والتفاصيل',
    categoryId: 'cat_photo',
    subcategoryId: 'subcat_food',
    processingLevel: 'color_correction',
    requirements: {
      deliverables: [
        '25 صورة عالية الجودة',
        'معالجة احترافية للألوان',
        'تسليم خلال 7 أيام'
      ],
      style: 'طبيعي ومشرق مع إضاءة دافئة',
      usage: 'للقائمة الرقمية والمطبوعة ووسائل التواصل'
    },
    budget: { min: 450000, max: 650000, currency: 'IQD' },
    location: 'client',
    isRush: false,
    preferredDeliveryDate: '2025-09-05T17:00:00.000Z',
    status: 'approved',
    adminNotes: 'عميل مميز، يفضل التعامل مع مصور خبير في الطعام',
    reviewedBy: 'sa_001_ali',
    reviewedAt: '2025-08-20T11:30:00.000Z',
    assignedCreatorId: 'c_001_fatima',
    convertedProjectId: 'p_001',
    createdAt: '2025-08-18T14:20:00.000Z',
    updatedAt: '2025-08-20T11:30:00.000Z'
  },
  {
    id: 'req_002_salon_promotion',
    clientId: 'cl_002_salon',
    title: 'حملة إعلانية لصالون الوردة الذهبية',
    description: 'تصوير فيديو ترويجي قصير + صور للخدمات الجديدة في الصالون',
    categoryId: 'cat_video',
    subcategoryId: 'subcat_commercial',
    processingLevel: 'full_retouch',
    requirements: {
      deliverables: [
        'فيديو ترويجي 60 ثانية',
        '15 صورة للخدمات',
        'معالجة متقدمة',
        'موسيقى خلفية'
      ],
      style: 'عصري وأنيق مع ألوان زاهية',
      usage: 'وسائل التواصل الاجتماعي والموقع الإلكتروني'
    },
    budget: { min: 800000, max: 1200000, currency: 'IQD' },
    location: 'client',
    isRush: true,
    preferredDeliveryDate: '2025-09-10T17:00:00.000Z',
    status: 'approved',
    adminNotes: 'مشروع مستعجل، يحتاج مبدع متمرس في الفيديو التجاري',
    reviewedBy: 'sa_001_ali',
    reviewedAt: '2025-08-22T09:15:00.000Z',
    assignedCreatorId: 'c_002_ali',
    convertedProjectId: 'p_002',
    createdAt: '2025-08-20T16:30:00.000Z',
    updatedAt: '2025-08-22T09:15:00.000Z'
  },
  {
    id: 'req_003_pharmacy_products',
    clientId: 'cl_003_pharmacy',
    title: 'تصوير منتجات صيدلية الشفاء الحديثة',
    description: 'تصوير منتجات العناية والجمال الجديدة للكتالوج والموقع الإلكتروني',
    categoryId: 'cat_photo',
    subcategoryId: 'subcat_product',
    processingLevel: 'basic',
    requirements: {
      deliverables: [
        '40 صورة منتج',
        'خلفية بيضاء موحدة',
        'معالجة أساسية',
        'تسليم خلال 5 أيام'
      ],
      style: 'نظيف ومهني مع إضاءة ناعمة',
      usage: 'كتالوج المنتجات والموقع الإلكتروني'
    },
    budget: { min: 350000, max: 450000, currency: 'IQD' },
    location: 'studio',
    isRush: false,
    preferredDeliveryDate: '2025-09-08T17:00:00.000Z',
    status: 'approved',
    adminNotes: 'عميل منتظم، يفضل جودة عالية وسرعة في التسليم',
    reviewedBy: 'sa_001_ali',
    reviewedAt: '2025-08-25T13:45:00.000Z',
    assignedCreatorId: 'c_001_fatima',
    convertedProjectId: 'p_003',
    createdAt: '2025-08-23T10:00:00.000Z',
    updatedAt: '2025-08-25T13:45:00.000Z'
  },
  {
    id: 'req_004_portrait_session',
    clientId: 'cl_004_individual',
    title: 'جلسة بورتريه شخصية',
    description: 'جلسة تصوير بورتريه احترافية لشخص واحد للاستخدام المهني',
    categoryId: 'cat_photo',
    subcategoryId: 'subcat_portrait',
    processingLevel: 'color_correction',
    requirements: {
      deliverables: [
        '10 صور نهائية',
        'معالجة احترافية',
        'خلفيات متنوعة',
        'تسليم خلال 3 أيام'
      ],
      style: 'مهني وأنيق مع إضاءة طبيعية',
      usage: 'السيرة الذاتية والملفات المهنية'
    },
    budget: { min: 250000, max: 350000, currency: 'IQD' },
    location: 'studio',
    isRush: false,
    preferredDeliveryDate: '2025-09-02T17:00:00.000Z',
    status: 'approved',
    adminNotes: 'عميل جديد، مناسب للمصورين المبتدئين',
    reviewedBy: 'sa_001_ali',
    reviewedAt: '2025-08-26T14:20:00.000Z',
    assignedCreatorId: 'c_004_kareem',
    convertedProjectId: 'p_004',
    createdAt: '2025-08-25T09:30:00.000Z',
    updatedAt: '2025-08-26T14:20:00.000Z'
  },
  {
    id: 'req_005_pending_approval',
    clientId: 'cl_004_individual',
    title: 'فيديو تعريفي شخصي',
    description: 'فيديو قصير للتعريف بالشخص ومهاراته للاستخدام المهني على LinkedIn',
    categoryId: 'cat_video',
    subcategoryId: 'subcat_personal',
    processingLevel: 'basic',
    requirements: {
      deliverables: [
        'فيديو 30-45 ثانية',
        'معالجة أساسية',
        'عناوين نصية',
        'تسليم خلال 4 أيام'
      ],
      style: 'بسيط ومهني',
      usage: 'LinkedIn وملفات العمل'
    },
    budget: { min: 300000, max: 400000, currency: 'IQD' },
    location: 'studio',
    isRush: false,
    preferredDeliveryDate: '2025-09-12T17:00:00.000Z',
    status: 'pending_review',
    adminNotes: '',
    createdAt: '2025-08-29T08:20:00.000Z',
    updatedAt: '2025-08-29T08:20:00.000Z'
  }
];

// ================================
// عروض الأسعار
// ================================

export const mockQuotes: Quote[] = [
  {
    id: 'quote_001_restaurant',
    projectRequestId: 'req_001_restaurant_menu',
    clientId: 'cl_001_restaurant',
    title: 'عرض سعر: تصوير منيو مطعم بيت بغداد',
    description: 'تصوير احترافي لـ 25 طبق مع معالجة الألوان',
    status: 'accepted',
    validUntil: '2025-09-15T23:59:59.000Z',
    pricing: {
      subtotal: 62530,
      discount: 0,
      tax: 0,
      total: 62530,
      currency: 'IQD'
    },
    breakdown: {
      baseService: 50000,
      additionalItems: 8530,
      rush: 0,
      location: 4000
    },
    assignedCreator: {
      id: 'c_001_fatima',
      name: 'فاطمة أحمد علي',
      rate: 19240
    },
    terms: [
      'الأسعار صالحة لمدة 15 يوم من تاريخ العرض',
      'الدفع 50% مقدماً و50% عند التسليم',
      'مراجعتان مجانيتان، المراجعات الإضافية 15,000 د.ع',
      'التسليم خلال 7 أيام عمل من تاريخ بدء التصوير'
    ],
    clientResponse: {
      status: 'accepted',
      respondedAt: '2025-08-19T16:30:00.000Z',
      notes: 'نوافق على العرض، متى يمكن البدء؟'
    },
    createdBy: 'sa_001_ali',
    createdAt: '2025-08-18T15:00:00.000Z',
    updatedAt: '2025-08-19T16:30:00.000Z'
  },
  {
    id: 'quote_002_salon_campaign',
    projectRequestId: 'req_002_salon_promotion',
    clientId: 'cl_002_salon',
    title: 'عرض سعر: حملة إعلانية لصالون الوردة الذهبية',
    description: 'فيديو ترويجي + صور للخدمات الجديدة',
    status: 'accepted',
    validUntil: '2025-09-20T23:59:59.000Z',
    pricing: {
      subtotal: 256215,
      discount: 12810, // خصم 5%
      tax: 0,
      total: 243405,
      currency: 'IQD'
    },
    breakdown: {
      videoProduction: 180000,
      photography: 50000,
      editing: 20215,
      rush: 6000
    },
    assignedCreator: {
      id: 'c_002_ali',
      name: 'علي حسين محمد',
      rate: 67425
    },
    terms: [
      'الأسعار صالحة لمدة 15 يوم من تاريخ العرض',
      'الدفع 60% مقدماً و40% عند التسليم لطبيعة المشروع المستعجل',
      'مراجعة واحدة مجانية للفيديو، المراجعات الإضافية 25,000 د.ع',
      'التسليم خلال 10 أيام عمل (مستعجل)'
    ],
    clientResponse: {
      status: 'accepted',
      respondedAt: '2025-08-22T10:45:00.000Z',
      notes: 'ممتاز، نريد البدء فوراً'
    },
    createdBy: 'sa_001_ali',
    createdAt: '2025-08-21T11:30:00.000Z',
    updatedAt: '2025-08-22T10:45:00.000Z'
  },
  {
    id: 'quote_003_pending_response',
    projectRequestId: 'req_005_pending_approval',
    clientId: 'cl_004_individual',
    title: 'عرض سعر: فيديو تعريفي شخصي',
    description: 'فيديو قصير للاستخدام المهني على LinkedIn',
    status: 'sent',
    validUntil: '2025-09-25T23:59:59.000Z',
    pricing: {
      subtotal: 320000,
      discount: 0,
      tax: 0,
      total: 320000,
      currency: 'IQD'
    },
    breakdown: {
      videoProduction: 250000,
      editing: 50000,
      titles: 20000
    },
    assignedCreator: {
      id: 'c_002_ali',
      name: 'علي حسين محمد',
      rate: 123077
    },
    terms: [
      'الأسعار صالحة لمدة 15 يوم من تاريخ العرض',
      'الدفع 100% مقدماً للعملاء الجدد',
      'مراجعة واحدة مجانية، المراجعات الإضافية 20,000 د.ع',
      'التسليم خلال 4 أيام عمل'
    ],
    createdBy: 'sa_001_ali',
    createdAt: '2025-08-29T10:00:00.000Z',
    updatedAt: '2025-08-29T10:00:00.000Z'
  }
];

// ================================
// العقود
// ================================

export const mockContracts: Contract[] = [
  {
    id: 'contract_001_restaurant',
    projectId: 'p_001',
    clientId: 'cl_001_restaurant',
    creatorId: 'c_001_fatima',
    contractNumber: 'DEPTH-2025-001',
    title: 'عقد تصوير منيو مطعم بيت بغداد',
    status: 'signed',
    contractValue: 62530,
    currency: 'IQD',
    startDate: '2025-08-20T00:00:00.000Z',
    deliveryDate: '2025-08-30T17:00:00.000Z',
    paymentTerms: {
      schedule: 'advance_50',
      advance: 31265,
      onDelivery: 31265
    },
    scope: {
      deliverables: [
        'تصوير 25 طبق من قائمة المطعم',
        'معالجة احترافية للألوان',
        'تسليم الصور بدقة عالية',
        'مراجعتان مجانيتان'
      ],
      exclusions: [
        'التصوير خارج المطعم',
        'المراجعات الإضافية بعد الاثنتين المجانيتين',
        'استخدام الصور لأغراض غير متفق عليها'
      ]
    },
    signatures: {
      client: {
        signedBy: 'محمد صالح أحمد',
        signedAt: '2025-08-19T18:00:00.000Z',
        ipAddress: '185.60.216.35'
      },
      creator: {
        signedBy: 'فاطمة أحمد علي',
        signedAt: '2025-08-19T19:15:00.000Z',
        ipAddress: '185.60.216.42'
      },
      agency: {
        signedBy: 'علي جواد الربيعي',
        signedAt: '2025-08-19T20:00:00.000Z',
        ipAddress: '185.60.216.10'
      }
    },
    documentUrl: 'https://contracts.depth-agency.com/DEPTH-2025-001.pdf',
    createdBy: 'sa_001_ali',
    createdAt: '2025-08-19T17:00:00.000Z',
    updatedAt: '2025-08-19T20:00:00.000Z'
  },
  {
    id: 'contract_002_salon',
    projectId: 'p_002',
    clientId: 'cl_002_salon',
    creatorId: 'c_002_ali',
    contractNumber: 'DEPTH-2025-002',
    title: 'عقد حملة إعلانية لصالون الوردة الذهبية',
    status: 'signed',
    contractValue: 243405,
    currency: 'IQD',
    startDate: '2025-08-23T00:00:00.000Z',
    deliveryDate: '2025-09-05T17:00:00.000Z',
    paymentTerms: {
      schedule: 'advance_60',
      advance: 146043,
      onDelivery: 97362
    },
    scope: {
      deliverables: [
        'فيديو ترويجي 60 ثانية',
        '15 صورة للخدمات الجديدة',
        'معالجة متقدمة للفيديو والصور',
        'موسيقى خلفية مرخصة'
      ],
      exclusions: [
        'التصوير في مواقع أخرى غير الصالون',
        'أكثر من مراجعة واحدة مجانية',
        'تغيير المفهوم الإبداعي بعد الموافقة عليه'
      ]
    },
    signatures: {
      client: {
        signedBy: 'نور علي حسين',
        signedAt: '2025-08-22T14:30:00.000Z',
        ipAddress: '185.60.216.78'
      },
      creator: {
        signedBy: 'علي حسين محمد',
        signedAt: '2025-08-22T15:45:00.000Z',
        ipAddress: '185.60.216.91'
      },
      agency: {
        signedBy: 'علي جواد الربيعي',
        signedAt: '2025-08-22T16:00:00.000Z',
        ipAddress: '185.60.216.10'
      }
    },
    documentUrl: 'https://contracts.depth-agency.com/DEPTH-2025-002.pdf',
    createdBy: 'sa_001_ali',
    createdAt: '2025-08-22T13:00:00.000Z',
    updatedAt: '2025-08-22T16:00:00.000Z'
  },
  {
    id: 'contract_003_pending',
    projectId: 'p_003',
    clientId: 'cl_003_pharmacy',
    creatorId: 'c_001_fatima',
    contractNumber: 'DEPTH-2025-003',
    title: 'عقد تصوير منتجات صيدلية الشفاء الحديثة',
    status: 'pending_signatures',
    contractValue: 169400,
    currency: 'IQD',
    startDate: '2025-08-30T00:00:00.000Z',
    deliveryDate: '2025-09-08T17:00:00.000Z',
    paymentTerms: {
      schedule: 'net_15',
      advance: 0,
      onDelivery: 169400
    },
    scope: {
      deliverables: [
        'تصوير 40 صورة منتج',
        'خلفية بيضاء موحدة',
        'معالجة أساسية',
        'تسليم خلال 5 أيام عمل'
      ],
      exclusions: [
        'التصوير خارج الستوديو',
        'معالجة متقدمة (تكلفة إضافية)',
        'أكثر من مراجعة واحدة مجانية'
      ]
    },
    signatures: {
      client: {
        signedBy: 'هدى طالب كريم',
        signedAt: '2025-08-26T10:30:00.000Z',
        ipAddress: '185.60.216.156'
      }
    },
    documentUrl: 'https://contracts.depth-agency.com/DEPTH-2025-003.pdf',
    createdBy: 'sa_001_ali',
    createdAt: '2025-08-26T09:00:00.000Z',
    updatedAt: '2025-08-26T10:30:00.000Z'
  }
];
