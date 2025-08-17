export type UserRole = 'admin' | 'client' | 'creator' | 'employee' | 'guest';

export function normalizeRole(role?: string | null): UserRole {
  if (role === 'admin' || role === 'client' || role === 'creator' || role === 'employee') {
    return role;
  }
  return 'guest';
}

export function profilePathForRole(role?: string | null): string {
  const r = normalizeRole(role);
  switch (r) {
    case 'admin':
      return '/admin/profile';
    case 'creator':
      return '/creators/profile';
    case 'employee':
      return '/employees/profile';
    case 'client':
      return '/portal/profile';
    case 'guest':
    default:
      return '/auth/signin?from=profile';
  }
}

// المسار الرئيسي (لوحة التحكم) لكل دور
export function dashboardPathForRole(role?: string | null): string {
  const r = normalizeRole(role);
  switch (r) {
    case 'admin':
      return '/admin';
    case 'creator':
      return '/creators';
    case 'employee':
      return '/employees';
    case 'client':
      return '/portal';
    case 'guest':
    default:
      return '/auth/signin';
  }
}

// التسمية العربية للوحة لكل دور
export function dashboardLabelForRole(role?: string | null): string {
  const r = normalizeRole(role);
  switch (r) {
    case 'admin':
      return 'لوحة الأدمن';
    case 'creator':
      return 'لوحة المبدع';
    case 'employee':
      return 'لوحة الموظف';
    case 'client':
      return 'لوحة العميل';
    case 'guest':
    default:
      return 'حسابي';
  }
}


