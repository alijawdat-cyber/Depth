export interface ScheduleChangeRequest {
  id: string;
  creatorId: string;
  requestedBy: string; // نفس creatorId حالياً
  changes: {
    days?: Array<'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri'>;
    startHour?: string; // HH:mm
    endHour?: string;   // HH:mm
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reason?: string;
}

export const mockScheduleChangeRequests: ScheduleChangeRequest[] = [
  {
    id: 'sc_req_001',
    creatorId: 'c_001_fatima',
    requestedBy: 'c_001_fatima',
    changes: { days: ['sun', 'mon', 'wed'], startHour: '10:00', endHour: '18:00' },
    status: 'pending',
    submittedAt: '2025-08-26T09:30:00.000Z',
  },
];
