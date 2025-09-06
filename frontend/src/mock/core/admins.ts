// ================================
// المدراء (Admins) - SSOT V2.1
// - مدير سوبر واحد + مدير عادي واحد
// - بيانات خفيفة مع دوال مساعدة
// ================================

export type AdminRole = 'super_admin' | 'admin';

export interface AdminUser {
	id: string; // المعرّف
	userId?: string; // FK -> users (u_*)
	name: string; // الاسم الكامل
	email: string; // البريد
	phone?: string; // هاتف
	role: AdminRole; // الدور
	isActive: boolean; // فعّال
	createdAt: string; // إنشاء
	updatedAt: string; // تحديث
}

export const ADMINS_SCHEMA_VERSION = '2.1.0';

export const admins: AdminUser[] = [
	{
		id: 'admin_super_001',
	userId: 'u_admin_super_001',
	name: 'علي جودت الربيعي',
	email: 'alijawdat4@gmail.com',
	phone: '+964-771-995-6000',
		role: 'super_admin',
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'admin_001',
		userId: 'u_admin_001',
		name: 'ميس عبد الله الربيعي',
		email: 'mais.r@depth.example',
		phone: '+964-781-555-6677',
		role: 'admin',
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
];

// خرائط ودوال مساعدة
export const adminById: Record<string, AdminUser> = Object.fromEntries(admins.map((a) => [a.id, a]));
export const listAdmins = (): AdminUser[] => admins.slice();
export const getAdminsByRole = (role: AdminRole): AdminUser[] => admins.filter((a) => a.role === role);

export const adminsRegistry = {
	version: ADMINS_SCHEMA_VERSION,
	count: admins.length,
	all: admins,
	byId: adminById,
};
// Admins V2.1 - المدراء
