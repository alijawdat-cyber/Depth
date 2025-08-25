// Icon Wrapper — يلف أيقونات Lucide بإعدادات موحّدة
// ملاحظة: سنضيف ESLint Rule لمنع استيراد lucide مباشرة خارج هذا الملف

import * as React from 'react';
import * as Icons from 'lucide-react';

export type IconName = Extract<keyof typeof Icons, string>;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: IconName;           // اسم الأيقونة من Lucide
  size?: 'sm' | 'md' | 'lg'; // أحجام موحدّة
  colorVar?: string;        // اسم CSS var للون (مثال: --color-fg-primary)
}

const SIZE_MAP = { sm: 16, md: 20, lg: 24 } as const;

export function Icon({ icon, size = 'md', colorVar = '--color-fg-primary', style, ...rest }: IconProps){
  const Cmp = Icons[icon] as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
  const pixel = SIZE_MAP[size] ?? 20;
  return (
    <Cmp
      width={pixel}
      height={pixel}
      stroke="currentColor"
      style={{ color: `var(${colorVar})`, ...(style||{}) }}
      {...rest}
    />
  );
}
