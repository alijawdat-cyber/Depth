"use client";
import React from "react";
import { Box, Group, Burger, ScrollArea, NavLink, Text, ActionIcon, Divider, Badge, useMantineColorScheme } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { IconBell, IconSettings, IconUser, IconHome2, IconLayoutGrid, IconCamera, IconBriefcase, IconFileText, IconCurrencyDollar, IconCalendar, IconSun, IconMoon, IconDevices, IconUsers, IconCategory, IconTool, IconChartBar } from "@tabler/icons-react";
import { useTheme } from "@/shared/theme";

type Props = { 
  children: React.ReactNode;
  userRole: 'admin' | 'creator' | 'client' | 'salariedEmployee' | 'guest';
};

export function DepthAppShell({ children, userRole }: Props){
  const [opened, { toggle, close }] = useDisclosure(false);
  const { theme, setTheme } = useTheme();
  const { setColorScheme } = useMantineColorScheme();

  const shellClass = `app-shell`; // شيل موحّد: نعتمد Mantine AppShell (CSS) بدون depth-shell

  // مكون تبديل الثيم المركزي
  const ThemeSwitcher = () => {
    const getThemeIcon = () => {
      switch (theme) {
        case 'light': return <IconSun size={16} />;
        case 'dark': return <IconMoon size={16} />;
        case 'system': return <IconDevices size={16} />;
        default: return <IconDevices size={16} />;
      }
    };

    const handleThemeChange = () => {
      const nextTheme: 'light' | 'dark' | 'system' = 
        theme === 'light' ? 'dark' : 
        theme === 'dark' ? 'system' : 'light';
      
      setTheme(nextTheme);
      setColorScheme(nextTheme === 'system' ? 'auto' : nextTheme);
    };

    return (
      <ActionIcon
        onClick={handleThemeChange}
        variant="subtle"
        size="sm"
        aria-label="تبديل الوضع"
        title={`الوضع الحالي: ${theme === 'light' ? 'فاتح' : theme === 'dark' ? 'داكن' : 'النظام'}`}
      >
        {getThemeIcon()}
      </ActionIcon>
    );
  };

  // تعريف نوع عنصر التنقل لدعم الأطفال
  type NavItem = {
    label: string;
    href?: string;
    icon?: React.ElementType;
    children?: NavItem[];
    defaultOpened?: boolean;
  };

  // توليد قوائم التنقل حسب الدور مع دعم التفرعات (الأدمن مفصّل حسب الموك)
  const getNavigationItems = (): NavItem[] => {
    const base: NavItem[] = [
      { label: 'الرئيسية', href: `/${userRole}`, icon: IconHome2 }
    ];

    if (userRole === 'admin') {
      return [
        { label: 'لوحة التحكم', href: '/admin', icon: IconHome2 },
        {
          label: 'إدارة المستخدمين', icon: IconUsers,
          children: [
            {
              label: 'الأدمنز', icon: IconUser,
              children: [
                { label: 'قائمة الأدمنز', href: '/admin/users/admins' },
                { label: 'إضافة أدمن جديد', href: '/admin/users/admins/new' },
              ]
            },
            {
              label: 'المبدعون', icon: IconCamera,
              children: [
                { label: 'قائمة المبدعين', href: '/admin/users/creators' },
                { label: 'طلبات الانضمام', href: '/admin/users/creators/pending' },
                { label: 'طلبات المعدات', href: '/admin/users/creators/equipment-requests' },
                { label: 'طلبات الأوقات', href: '/admin/users/creators/schedule-requests' },
                { label: 'طلبات الفئات الرئيسية', href: '/admin/users/creators/category-requests' },
                { label: 'طلبات الفئات الفرعية', href: '/admin/users/creators/subcategory-requests' },
              ]
            },
            {
              label: 'العملاء', icon: IconUsers,
              children: [
                { label: 'قائمة العملاء', href: '/admin/users/clients' },
                { label: 'طلبات الانضمام', href: '/admin/users/clients/pending-registrations' },
              ]
            },
            {
              label: 'الموظفون بالراتب', icon: IconBriefcase,
              children: [
                { label: 'قائمة الموظفين', href: '/admin/users/employees' },
                { label: 'دعوة موظف', href: '/admin/users/employees/invite' },
                { label: 'الدعوات المرسلة', href: '/admin/users/employees/invitations' },
              ]
            },
            { label: 'مركز الطلبات الشامل', href: '/admin/users/requests-center', icon: IconLayoutGrid },
          ]
        },
        {
          label: 'إدارة الخدمات والتصنيفات', icon: IconCategory,
          children: [
            {
              label: 'الفئات الرئيسية',
              children: [
                { label: 'قائمة الفئات', href: '/admin/services/categories' },
                { label: 'إضافة فئة جديدة', href: '/admin/services/categories/new' },
              ]
            },
            {
              label: 'الفئات الفرعية',
              children: [
                { label: 'قائمة الفئات الفرعية', href: '/admin/services/subcategories' },
                { label: 'إضافة فئة فرعية', href: '/admin/services/subcategories/new' },
              ]
            },
            {
              label: 'المجالات الصناعية',
              children: [
                { label: 'قائمة المجالات', href: '/admin/services/industries' },
                { label: 'إضافة مجال جديد', href: '/admin/services/industries/new' },
              ]
            },
            { label: 'ربط الفئات بالصناعات', href: '/admin/services/mappings', icon: IconLayoutGrid },
          ]
        },
        {
          label: 'التسعير والماليات', icon: IconCurrencyDollar,
          children: [
            {
              label: 'معدلات التسعير',
              children: [
                { label: 'جميع المعدلات', href: '/admin/pricing/modifiers' },
                { label: 'حاسبة التسعير', href: '/admin/pricing/modifiers/calculator' },
              ]
            },
            {
              label: 'هوامش الوكالة',
              children: [
                { label: 'إدارة الهوامش', href: '/admin/pricing/margins' },
              ]
            },
            {
              label: 'الفواتير',
              children: [
                { label: 'قائمة الفواتير', href: '/admin/pricing/invoices' },
                { label: 'إنشاء فاتورة جديدة', href: '/admin/pricing/invoices/new' },
              ]
            },
            {
              label: 'المدفوعات',
              children: [
                { label: 'قائمة المدفوعات', href: '/admin/pricing/payments' },
              ]
            },
            { label: 'التقارير المالية', href: '/admin/pricing/reports/financial' },
          ]
        },
        {
          label: 'إدارة المشاريع', icon: IconBriefcase,
          children: [
            {
              label: 'طلبات المشاريع',
              children: [
                { label: 'قائمة الطلبات', href: '/admin/projects/requests' },
              ]
            },
            {
              label: 'المشاريع النشطة',
              children: [
                { label: 'قائمة المشاريع', href: '/admin/projects/active' },
              ]
            },
            { label: 'تعيين المبدعين', href: '/admin/projects/assignment' },
            {
              label: 'عروض الأسعار',
              children: [
                { label: 'قائمة العروض', href: '/admin/projects/quotes' },
                { label: 'إنشاء عرض سعر', href: '/admin/projects/quotes/new' },
              ]
            },
            {
              label: 'العقود',
              children: [
                { label: 'قائمة العقود', href: '/admin/projects/contracts' },
                { label: 'إنشاء عقد', href: '/admin/projects/contracts/new' },
              ]
            },
          ]
        },
        {
          label: 'النظام والإعدادات', icon: IconTool,
          children: [
            { label: 'الإعدادات العامة', href: '/admin/system/settings' },
            { label: 'المحتوى والقوالب', href: '/admin/system/content' },
            { label: 'الأدوات المساعدة', href: '/admin/system/tools' },
            { label: 'المراقبة والسجلات', href: '/admin/system/monitoring' },
          ]
        },
        {
          label: 'التقارير والتحليلات', icon: IconChartBar,
          children: [
            { label: 'تقارير الأداء', href: '/admin/analytics/performance' },
            { label: 'التحليلات المتقدمة', href: '/admin/analytics/advanced' },
            { label: 'التصدير والمشاركة', href: '/admin/analytics/export' },
          ]
        },
      ];
    }

    // بقية الأدوار تبقى بسيطة حالياً
    switch (userRole) {
      case 'creator':
        return [
          ...base,
          { label: 'مشاريعي', href: '/creator/projects', icon: IconCamera },
          { label: 'معرض الأعمال', href: '/creator/portfolio', icon: IconLayoutGrid },
          { label: 'التوفر', href: '/creator/availability', icon: IconCalendar },
          { label: 'الملف الشخصي', href: '/creator/profile', icon: IconUser },
        ];
      case 'client':
        return [
          ...base,
          { label: 'طلب جديد', href: '/client/new-request', icon: IconFileText },
          { label: 'مشاريعي', href: '/client/projects', icon: IconBriefcase },
          { label: 'الفواتير', href: '/client/invoices', icon: IconCurrencyDollar },
          { label: 'الرسائل', href: '/client/messages', icon: IconBell },
        ];
      case 'salariedEmployee':
        return [
          ...base,
          { label: 'مهامي', href: '/salaried/tasks', icon: IconBriefcase },
          { label: 'المشاريع', href: '/salaried/projects', icon: IconLayoutGrid },
          { label: 'التقويم', href: '/salaried/schedule', icon: IconCalendar },
        ];
      default:
        return base;
    }
  };

  const navigationItems: NavItem[] = getNavigationItems();

  // مُقدّم عرض عنصر تنقل متداخل
  const renderNavItem = (item: NavItem): React.ReactNode => {
    const LeftIcon = item.icon as React.ElementType | undefined;
    const left = LeftIcon ? <LeftIcon size={18} /> : undefined;
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    if (item.href) {
      return (
        <NavLink
          key={item.label + item.href}
          label={item.label}
          leftSection={left}
          component={Link}
          href={item.href}
          c="dimmed"
          defaultOpened={item.defaultOpened}
        >
          {hasChildren && item.children!.map(renderNavItem)}
        </NavLink>
      );
    }
    return (
      <NavLink
        key={item.label}
        label={item.label}
        leftSection={left}
  c="dimmed"
        defaultOpened={item.defaultOpened}
      >
        {hasChildren && item.children!.map(renderNavItem)}
      </NavLink>
    );
  };

  return (
    <Box className={shellClass} data-role={userRole}>
      {/* الهيدر */}
      <Box component="header" className="app-header">
        <Group h="100%" justify="space-between" w="100%" wrap="nowrap">
          <Group gap="sm" className="header-nav" wrap="nowrap">
            <Burger opened={opened} onClick={toggle} aria-label="فتح القائمة" className="md:hidden" />
            <Image src="/logo-depth.svg" alt="Depth" width={110} height={28} priority className="app-logo" />
            <Badge size="sm" variant="light" color={userRole === 'admin' ? 'red' : 'blue'}>
              {userRole === 'admin' ? 'أدمن' :
               userRole === 'creator' ? 'مبدع' : 
               userRole === 'client' ? 'عميل' :
               userRole === 'salariedEmployee' ? 'موظف' : 'ضيف'}
            </Badge>
          </Group>
          <Group gap="sm" className="header-actions" wrap="nowrap">
            <ThemeSwitcher />
            <ActionIcon variant="subtle" size="sm" aria-label="إشعارات">
              <IconBell size={18} />
            </ActionIcon>
            <ActionIcon variant="subtle" size="sm" aria-label="إعدادات">
              <IconSettings size={18} />
            </ActionIcon>
            <ActionIcon variant="subtle" size="sm" aria-label="حساب">
              <IconUser size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      {/* الشريط الجانبي */}
  <Box component="aside" className="app-sidebar">
  <ScrollArea.Autosize mah="calc(100dvh - var(--header-height))" type="scroll">
          <Box p="lg" className="sidebar-inner">
            <Text fw={700} size="sm" mb="sm" c="var(--color-text-primary)">القائمة</Text>
            {navigationItems.map(renderNavItem)}
            <Divider my="sm" />
            <NavLink 
              label="الإعدادات" 
              leftSection={<IconSettings size={18} />} 
              c="dimmed"
            />
          </Box>
        </ScrollArea.Autosize>
      </Box>

      {/* المحتوى */}
      <Box component="main" className="app-main">
        {children}
      </Box>

      {/* الشريط الجانبي للموبايل */}
      {opened && (
        <Box className="md:hidden mobile-overlay" onClick={close}>
          <Box className="app-sidebar mobile-sidebar" onClick={(e) => e.stopPropagation()}>
            <ScrollArea.Autosize mah="calc(100dvh - var(--header-height))" type="scroll">
              <Box p="md" className="sidebar-inner">
                <Text fw={700} size="sm" mb="sm" c="var(--color-text-primary)">القائمة</Text>
                {navigationItems.map(renderNavItem)}
                <Divider my="sm" />
                <NavLink 
                  label="الإعدادات" 
                  leftSection={<IconSettings size={18} />} 
                  onClick={close}
                  c="dimmed"
                />
              </Box>
            </ScrollArea.Autosize>
          </Box>
        </Box>
      )}
    </Box>
  );
}
