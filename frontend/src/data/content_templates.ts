export interface ContentTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'notification';
  subject?: string;
  body: string;
  isActive: boolean;
  updatedAt: string;
}

export const mockContentTemplates: ContentTemplate[] = [
  {
    id: 'tpl_approve_creator',
    name: 'موافقة مبدع',
    type: 'notification',
    body: 'تمت الموافقة على حسابك كمبدع في منصة Depth. أهلاً بك!',
    isActive: true,
    updatedAt: '2025-08-28T10:20:00.000Z',
  },
];
