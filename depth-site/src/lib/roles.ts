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


