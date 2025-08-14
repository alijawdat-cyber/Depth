export type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/plans', label: 'الخطط' },
  { href: '/services', label: 'الخدمات' },
  { href: '/work', label: 'الأعمال' },
  { href: '/about', label: 'من نحن' },
  { href: '/blog', label: 'المدونة' },
  { href: '/contact', label: 'تواصل' },
  { href: '/portal', label: 'بوابة العميل' },
];

export const CTA_ITEMS = {
  book: { href: '/book', label: 'احجز جلسة' },
  signin: { href: '/portal/auth/signin', label: 'تسجيل الدخول' },
};


