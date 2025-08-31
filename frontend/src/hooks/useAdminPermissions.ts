import { mockAdmins } from '@/data/admins';
import type { Admin } from '@/data/types';

// ================================
// Hook للتحقق من صلاحيات الأدمن
// ================================

export function useAdminPermissions() {
  // المستخدم الحالي - علي جواد الربيعي (سوبر أدمن)
  const currentUser: Admin = mockAdmins[0];
  
  return {
    // بيانات المستخدم
    user: currentUser,
    isSuperAdmin: currentUser.adminLevel === 'super_admin',
    isRegularAdmin: currentUser.adminLevel === 'admin',
    
    // الصلاحيات الأساسية
    canManageUsers: currentUser.permissions.canManageUsers,
    canManageProjects: currentUser.permissions.canManageProjects,
    canManagePayments: currentUser.permissions.canManagePayments,
    canViewReports: currentUser.permissions.canViewReports,
    canManageSettings: currentUser.permissions.canManageSettings,
    
    // الصلاحيات الحصرية للسوبر أدمن
    canManageAdmins: currentUser.permissions.canManageAdmins,
    canEditPricing: currentUser.adminLevel === 'super_admin',
    canAccessSystemTools: currentUser.adminLevel === 'super_admin',
    canViewFinancialReports: currentUser.adminLevel === 'super_admin',
    canManageSystemSettings: currentUser.adminLevel === 'super_admin',
    
    // دوال مساعدة للتحقق
    hasPermission: (permission: keyof Admin['permissions']) => {
      return currentUser.permissions[permission];
    },
    
    requiresSuperAdmin: () => {
      return currentUser.adminLevel === 'super_admin';
    },
    
    canAccessRoute: (route: string) => {
      // تحديد الصلاحيات حسب المسار
      if (route.includes('/admin/users/admins')) {
        return currentUser.adminLevel === 'super_admin';
      }
      if (route.includes('/admin/pricing/modifiers')) {
        return currentUser.adminLevel === 'super_admin';  
      }
      if (route.includes('/admin/system/settings')) {
        return currentUser.adminLevel === 'super_admin';
      }
      // باقي المسارات متاحة للأدمن العادي
      return true;
    }
  };
}
