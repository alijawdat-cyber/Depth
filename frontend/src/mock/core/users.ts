// ================================
// المستخدمون (Users) - Registry/Resolver V2.1
// - توحيد هوية المستخدمين (FK -> users) وربط جميع الكيانات بها
// - تضمين مجموعة مستخدمين موحدة (seed) مع خرائط وصول سريعة
// ================================

export type UserKind = 'admin' | 'creator' | 'client' | 'salaried';

export interface BasicUserRef {
	id: string;
	name: string;
	kind: UserKind;
}

// تعريف مستخدم موحد للنظام
export interface UnifiedUser {
	id: string; // u_*
	entityId: string; // admin_* | client_* | creator_* | emp_* ...
	kind: UserKind;
	name: string;
	email?: string;
	phone?: string;
	isActive: boolean;
	isVerified?: boolean;
	createdAt: string;
	updatedAt: string;
}

// خريطة هوية مستخدمين موحدة (u_*) تربط كيانات النظام إلى userId
// ملاحظة: عند إضافة وحدة users حقيقية، يمكن توليد هذه القيم آلياً
const usersUnifiedIds: Record<string, string> = {
	// clients
	client_001: 'u_client_001',
	client_002: 'u_client_002',
	// creators
	creator_001: 'u_creator_001',
	creator_002: 'u_creator_002',
	creator_003: 'u_creator_003',
	// admins
	admin_super_001: 'u_admin_super_001',
	admin_001: 'u_admin_001',
	// salaried
	emp_photo_001: 'u_emp_photo_001',
};

// مجموعة مستخدمين موحدة (seed) تغطي الكيانات الحالية
export const users: UnifiedUser[] = [
	{ id: 'u_admin_super_001', entityId: 'admin_super_001', kind: 'admin', name: 'علي جودت الربيعي', email: 'alijawdat4@gmail.com', phone: '+964-771-995-6000', isActive: true, isVerified: true, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-09-04T10:00:00.000Z' },
	{ id: 'u_admin_001', entityId: 'admin_001', kind: 'admin', name: 'ميس عبد الله الربيعي', email: 'mais.r@depth.example', phone: '+964-781-555-6677', isActive: true, isVerified: true, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-09-04T10:00:00.000Z' },
	{ id: 'u_client_001', entityId: 'client_001', kind: 'client', name: 'بيت السماق للألبسة', email: 'contact@sumaq-fashion.example', phone: '+964-770-333-4455', isActive: true, isVerified: true, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-09-04T10:00:00.000Z' },
	{ id: 'u_client_002', entityId: 'client_002', kind: 'client', name: 'خان الكبة والمشاوي', email: 'hello@khan-kibbeh.example', phone: '+964-771-888-9900', isActive: true, isVerified: false, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-09-04T10:00:00.000Z' },
	{ id: 'u_creator_001', entityId: 'creator_001', kind: 'creator', name: 'سيف ذاخر العزاوي', email: 'saif.dh@depth.example', phone: '+964-780-101-2020', isActive: true, isVerified: true, createdAt: '2024-11-11T00:00:00.000Z', updatedAt: '2025-09-04T10:00:00.000Z' },
	{ id: 'u_creator_002', entityId: 'creator_002', kind: 'creator', name: 'مناف أيهم البياتي', email: 'munaf.a@depth.example', phone: '+964-781-303-4040', isActive: true, isVerified: true, createdAt: '2024-10-05T00:00:00.000Z', updatedAt: '2025-09-04T10:00:00.000Z' },
	{ id: 'u_creator_003', entityId: 'creator_003', kind: 'creator', name: 'ماريز عماد الخالدي', email: 'mariz.k@depth.example', phone: '+964-770-505-6060', isActive: true, isVerified: true, createdAt: '2025-01-20T00:00:00.000Z', updatedAt: '2025-09-04T10:00:00.000Z' },
	{ id: 'u_emp_photo_001', entityId: 'emp_photo_001', kind: 'salaried', name: 'مرتضى فلاح السوداني', email: 'murtadha.s@depth.example', phone: '+964-781-222-3344', isActive: true, isVerified: true, createdAt: '2024-02-20T00:00:00.000Z', updatedAt: '2025-09-04T10:00:00.000Z' },
];

export const resolveUserId = (entityId: string): string => usersUnifiedIds[entityId] ?? entityId;

export const usersById: Record<string, UnifiedUser> = Object.fromEntries(users.map(u => [u.id, u]));
export const usersByEntityId: Record<string, UnifiedUser> = Object.fromEntries(users.map(u => [u.entityId, u]));

export const usersRegistry = {
	byEntityId: usersUnifiedIds,
	resolveUserId,
	all: users,
	byId: usersById,
	byEntity: usersByEntityId,
};
