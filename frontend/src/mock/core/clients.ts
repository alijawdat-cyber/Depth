// ================================
// العملاء (Clients) - SSOT V2.1
// - عميلان فقط مع ربط صناعة industryId
// ================================

import type { IndustrySSOT } from '../services/industries';

export interface ClientUser {
	id: string; // المعرّف
	userId?: string; // FK -> users (u_*)
	code?: string; // كود نمطي وفق الوثائق (cl_*) للاستخدام المرجعي دون كسر id الحالي
	name: string; // الاسم التجاري
	contactName: string; // جهة الاتصال
	email: string; // بريد
	phone?: string; // هاتف
	industryId: IndustrySSOT['id']; // صناعة
	location?: { city: 'Baghdad' | 'Erbil' | 'Basra' | 'Sulaymaniyah' | 'Najaf' | 'Karbala'; area?: string }; // موقع العميل (اختياري)
	isActive: boolean; // فعّال
	createdAt: string; // إنشاء
	updatedAt: string; // تحديث
}

export const CLIENTS_SCHEMA_VERSION = '2.1.0';

export const clients: ClientUser[] = [
	{
		id: 'client_001',
		userId: 'u_client_001',
		code: 'cl_001_fashion',
		name: 'بيت السماق للألبسة',
		contactName: 'سجاد محمد سامي',
		email: 'contact@sumaq-fashion.example',
		phone: '+964-770-333-4455',
		industryId: 'ind_fashion',
		location: { city: 'Baghdad', area: 'Al-Mansour' },
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'client_002',
		userId: 'u_client_002',
		code: 'cl_002_restaurant',
		name: 'خان الكبة والمشاوي',
		contactName: 'براء صباح العبودي',
		email: 'hello@khan-kibbeh.example',
		phone: '+964-771-888-9900',
		industryId: 'ind_food',
		location: { city: 'Baghdad', area: 'Karrada' },
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
];

export const clientById: Record<string, ClientUser> = Object.fromEntries(clients.map((c) => [c.id, c]));
export const clientByCode: Record<string, ClientUser> = Object.fromEntries(
  clients.filter((c) => !!c.code).map((c) => [c.code as string, c])
);
export const listClients = (): ClientUser[] => clients.slice();

export const clientsRegistry = {
	version: CLIENTS_SCHEMA_VERSION,
	count: clients.length,
	all: clients,
	byId: clientById,
  byCode: clientByCode,
};
// Clients V2.1 - العملاء
