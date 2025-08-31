export interface EmployeeInvitation {
  id: string;
  emailOrPhone: string;
  department: 'photography' | 'videography' | 'design' | 'editing' | 'admin';
  jobTitle: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  sentAt: string;
  acceptedAt?: string;
  revokedAt?: string;
}

export const mockEmployeeInvitations: EmployeeInvitation[] = [
  {
    id: 'emp_inv_001',
    emailOrPhone: 'hr@depth.example',
    department: 'design',
    jobTitle: 'مصمم واجهات',
    status: 'pending',
    sentAt: '2025-08-25T12:00:00.000Z',
  },
];
