export interface CategoryChangeRequest {
  id: string;
  creatorId: string;
  action: 'add' | 'remove';
  categoryId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reason?: string;
}

export const mockCategoryChangeRequests: CategoryChangeRequest[] = [
  {
    id: 'cat_req_001',
    creatorId: 'c_002_ali',
    action: 'add',
    categoryId: 'cat_design',
    status: 'pending',
    submittedAt: '2025-08-27T11:10:00.000Z',
  },
];
