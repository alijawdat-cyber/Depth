export interface SystemSettings {
  id: string;
  defaultMarginPercent: number; // 2.25
  notificationEmail: string;
  currency: 'IQD';
  language: 'ar' | 'en';
  updatedAt: string;
}

export const mockSystemSettings: SystemSettings = {
  id: 'sys_cfg_001',
  defaultMarginPercent: 2.25,
  notificationEmail: 'admin@depth.example',
  currency: 'IQD',
  language: 'ar',
  updatedAt: '2025-08-29T17:00:00.000Z',
};
