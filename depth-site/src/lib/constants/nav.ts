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
  // سنقوم بتوليد رابط اللوحة المناسب حسب الدور في الترويسة؛ نُبقي هذا كبلاسي هولدر افتراضي
  { href: '/portal', label: 'لوحة العميل' },
];

export const CTA_ITEMS = {
  book: { href: '/book', label: 'احجز جلسة' },
  signin: { href: '/portal/auth/signin', label: 'تسجيل الدخول' },
};


