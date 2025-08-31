// ================================
// الملف المركزي للبيانات الوهمية - Depth
// ================================

// تصدير جميع الأنواع والواجهات
export * from './types';

// تصدير البيانات المتخصصة
export * from './admins';
export * from './pricing';
export * from './invoicing';
export * from './creators';
export * from './clients';
export * from './employees';
export * from './categories';
export * from './industries';
export * from './equipment';
export * from './additionalEquipment';
export * from './equipmentRequests';
export * from './availability';
export * from './projects';
// تصدير دوال الحساب الجديدة
export * from './calculations';
export * from './notifications';
export * from './creator_requests';
export * from './schedule_requests';
export * from './category_requests';
export * from './subcategory_requests';
export * from './client_registrations';
export * from './employee_invitations';
// ملاحظة: يتم تصدير mockProjectRequests, mockQuotes, mockContracts من notifications لتجنب تضارب الأسماء
// export * from './project_requests';
// export * from './quotes';
// export * from './contracts';
export * from './system_settings';
export * from './content_templates';
export * from './activity_logs';

// استيراد البيانات للمجموعة الشاملة
import { mockAdmins } from './admins';
import { mockPricingModifiers, mockAgencyMarginConfig } from './pricing';
import { mockSubcategoryIndustryMappings } from './subcategoryIndustryMappings';
import { mockInvoices, mockPayments } from './invoicing';
import { mockCreators } from './creators';
import { mockClients } from './clients';
import { mockSalariedEmployees } from './employees';
import { mockCategories, mockSubcategories } from './categories';
import { mockIndustries } from './industries';
import { mockEquipment } from './equipment';
import { mockEquipmentRequests } from './equipmentRequests';
import { mockCreatorAvailability, mockAvailabilityFlags } from './availability';
import { mockProjects } from './projects';
import { mockCreatorJoinRequests } from './creator_requests';
import { mockScheduleChangeRequests } from './schedule_requests';
import { mockCategoryChangeRequests } from './category_requests';
import { mockSubcategoryChangeRequests } from './subcategory_requests';
import { mockClientRegistrationRequests } from './client_registrations';
import { mockEmployeeInvitations } from './employee_invitations';
// استخدام النسخ المصدّرة من notifications لتجنب التضارب
import { mockProjectRequests, mockQuotes, mockContracts } from './notifications';
import { mockSystemSettings } from './system_settings';
import { mockContentTemplates } from './content_templates';
import { mockActivityLogs } from './activity_logs';

// تصدير مجموعة شاملة للبيانات الوهمية
export const mockData = {
  // الأدمن
  admins: mockAdmins,
  
  // التسعير
  // النظام المركزي للبيانات
  pricingModifiers: mockPricingModifiers,
  agencyMarginConfig: mockAgencyMarginConfig,
  subcategoryIndustryMappings: mockSubcategoryIndustryMappings,
  
  // الفوترة
  invoices: mockInvoices,
  payments: mockPayments,
  
  // المستخدمون
  creators: mockCreators,
  clients: mockClients,
  employees: mockSalariedEmployees,
  
  // الخدمات
  categories: mockCategories,
  subcategories: mockSubcategories,
  industries: mockIndustries,
  
  // المعدات
  equipment: mockEquipment,
  equipmentRequests: mockEquipmentRequests,
  
  // أوقات التوفر
  creatorAvailability: mockCreatorAvailability,
  availabilityFlags: mockAvailabilityFlags,
  
  // المشاريع
  projects: mockProjects,

  // مركز الطلبات (مجمّع)
  creatorJoinRequests: mockCreatorJoinRequests,
  scheduleChangeRequests: mockScheduleChangeRequests,
  categoryChangeRequests: mockCategoryChangeRequests,
  subcategoryChangeRequests: mockSubcategoryChangeRequests,
  clientRegistrationRequests: mockClientRegistrationRequests,
  employeeInvitations: mockEmployeeInvitations,
  projectRequests: mockProjectRequests,
  quotes: mockQuotes,
  contracts: mockContracts,

  // إعدادات ونُسخ
  systemSettings: mockSystemSettings,
  contentTemplates: mockContentTemplates,
  activityLogs: mockActivityLogs,
};

// دالة للحصول على جميع البيانات الوهمية
export const getAllMockData = () => mockData;

// دالة للحصول على إحصائيات سريعة - محدثة للنظام الجديد
export const getMockDataStats = () => {
  return {
    admins: mockData.admins.length,
    creators: mockData.creators.length,
    clients: mockData.clients.length,
    projects: mockData.projects.length,
    totalLineItems: mockData.projects.reduce((sum, p) => sum + p.lineItems.length, 0),
    totalQuantity: mockData.projects.reduce((sum, p) => 
      sum + p.lineItems.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
    invoices: mockData.invoices.length,
    payments: mockData.payments.length,
    categories: mockData.categories.length,
    subcategories: mockData.subcategories.length,
    industries: mockData.industries.length,
    equipment: mockData.equipment.length,
    equipmentRequests: mockData.equipmentRequests.length,
    creatorAvailability: mockData.creatorAvailability.length,
    availabilityFlags: mockData.availabilityFlags.length,
    pricingModifiers: mockData.pricingModifiers.length,
    employees: mockData.employees.length,
  creatorJoinRequests: mockData.creatorJoinRequests.length,
  scheduleChangeRequests: mockData.scheduleChangeRequests.length,
  categoryChangeRequests: mockData.categoryChangeRequests.length,
  subcategoryChangeRequests: mockData.subcategoryChangeRequests.length,
  clientRegistrationRequests: mockData.clientRegistrationRequests.length,
  employeeInvitations: mockData.employeeInvitations.length,
  projectRequests: mockData.projectRequests.length,
  quotes: mockData.quotes.length,
  contracts: mockData.contracts.length,
  activityLogs: mockData.activityLogs.length,
  };
};
