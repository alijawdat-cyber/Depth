import { Creator } from './types';

export interface CreatorJoinRequest {
  id: string;
  creator: Pick<Creator, 'id' | 'fullName' | 'experienceLevel' | 'equipmentTier' | 'specialties' | 'location'>;
  status: 'pending' | 'approved' | 'rejected' | 'needs_info';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export const mockCreatorJoinRequests: CreatorJoinRequest[] = [
  {
    id: 'cr_req_001',
    creator: {
      id: 'c_006_placeholder',
      fullName: 'حسن علي كريم',
      experienceLevel: 'experienced',
      equipmentTier: 'gold',
      specialties: ['photo'],
      location: { city: 'بغداد', area: 'المنصور' },
    },
    status: 'pending',
    submittedAt: '2025-08-28T10:00:00.000Z',
    notes: 'سيرة ذاتية جيدة، يحتاج مراجعة بورتفوليو',
  },
];
