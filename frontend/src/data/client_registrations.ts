export interface ClientRegistrationRequest {
  id: string;
  applicantType: 'individual' | 'company';
  fullName: string;
  companyName?: string;
  industryId?: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_info';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export const mockClientRegistrationRequests: ClientRegistrationRequest[] = [
  {
    id: 'cl_reg_001',
    applicantType: 'company',
    fullName: 'سيف عدنان حيدر',
    companyName: 'شركة الريادة الحديثة',
    industryId: 'ind_ecommerce',
    phone: '07734567890',
    status: 'pending',
    submittedAt: '2025-08-29T10:40:00.000Z',
  },
];
