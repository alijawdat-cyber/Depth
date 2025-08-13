export const getSiteUrl = (): string => {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://depth-agency.com').replace(/\/$/, '');
};


