// ================================
// الموظفون براتب ثابت - SSOT V2.1
// - موظف واحد مصوّر فقط
// - ملاحظة: يتم استيراد نوع الدور من طبقة الأنواع العامة لتجنّب التعارض مع barrel الرئيسي
// ================================

import type { SalariedRole } from '../types/entities';

export interface SalariedEmployee {
	id: string; // المعرّف
	userId?: string; // FK -> users (u_*)
	name: string; // الاسم الكامل
	email: string; // البريد
	phone?: string; // الهاتف
	role: SalariedRole; // الدور
	monthlySalaryIQD: number; // الراتب الشهري بالدينار
	isActive: boolean; // فعّال
	hiredAt: string; // تاريخ التعيين
	updatedAt: string; // آخر تحديث
}

export const SALARIED_EMPLOYEES_SCHEMA_VERSION = '2.1.0';

export const salariedEmployees: SalariedEmployee[] = [
	{
		id: 'emp_photo_001',
		userId: 'u_emp_photo_001',
		name: 'مرتضى فلاح السوداني',
		email: 'murtadha.s@depth.example',
		phone: '+964-781-222-3344',
		role: 'photographer',
		monthlySalaryIQD: 1200000,
		isActive: true,
		hiredAt: '2024-02-20T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
];

export const salariedById: Record<string, SalariedEmployee> = Object.fromEntries(
	salariedEmployees.map((e) => [e.id, e])
);
export const listSalariedEmployees = (): SalariedEmployee[] => salariedEmployees.slice();

export const salariedEmployeesRegistry = {
	version: SALARIED_EMPLOYEES_SCHEMA_VERSION,
	count: salariedEmployees.length,
	all: salariedEmployees,
	byId: salariedById,
};
// Salaried Employees V2.1 - الموظفون براتب ثابت
