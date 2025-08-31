export interface SubcategoryChangeRequest {
  id: string;
  creatorId: string;
  action: 'add' | 'remove';
  subcategoryId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reason?: string;
}

export const mockSubcategoryChangeRequests: SubcategoryChangeRequest[] = [
  {
    id: 'sub_req_001',
    creatorId: 'c_003_maryam',
    action: 'add',
    subcategoryId: 'sub_logo_design',
    status: 'pending',
    submittedAt: '2025-08-28T13:00:00.000Z',
  },
];
