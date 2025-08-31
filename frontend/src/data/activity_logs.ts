export interface ActivityLog {
  id: string;
  actorId: string; // admin/creator/client id
  actorType: 'admin' | 'creator' | 'client' | 'employee';
  action: string;
  target?: { type: string; id: string };
  meta?: Record<string, string | number | boolean>;
  createdAt: string;
}

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'act_001',
    actorId: 'sa_001_ali',
    actorType: 'admin',
    action: 'approved_invoice',
    target: { type: 'invoice', id: 'inv_002_salon' },
    meta: { amount: 987372 },
    createdAt: '2025-08-28T14:30:00.000Z',
  },
];
