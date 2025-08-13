export type Inquiry = 'general' | 'pricing' | 'support' | 'social' | 'jobs';

export const TYPE_LABELS: Record<Inquiry, string> = {
  general: 'استفسار عام',
  pricing: 'طلب أسعار',
  support: 'دعم فني',
  social: 'سوشيال ميديا',
  jobs: 'طلب وظيفة',
};

export const SLA_MAP: Record<Inquiry, string> = {
  general: '24 ساعة',
  pricing: '8 ساعات',
  support: '6 ساعات',
  social: '12 ساعة',
  jobs: '72 ساعة',
};

export const AUTOREPLY_SUBJECTS: Record<Inquiry, string> = {
  general: '[DEPTH] تأكيد استلام — سنعود إليك خلال 24 ساعة',
  pricing: '[DEPTH] طلب عرض أسعار — سنعود إليك خلال 8 ساعات',
  support: '[DEPTH] طلب دعم فني — سنعود إليك خلال 6 ساعات',
  social: '[DEPTH] طلب سوشيال ميديا — سنعود إليك خلال 12 ساعة',
  jobs: '[DEPTH] طلب وظيفة — سنعود إليك خلال 72 ساعة',
};

export const ROUTING_MAP: Record<Inquiry, string> = {
  general: 'hello@depth-agency.com',
  pricing: 'sales@depth-agency.com',
  support: 'support@depth-agency.com',
  social: 'social@depth-agency.com',
  jobs: 'jobs@depth-agency.com',
};


