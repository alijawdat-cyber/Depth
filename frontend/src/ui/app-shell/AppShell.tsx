"use client"; // مكوّن عميل
import React from "react"; // React
import "./app-shell.css"; // أنماط الشيل
import { Box, Group, Burger, ScrollArea, NavLink, Text, ActionIcon, Divider, Badge, useMantineColorScheme } from "@mantine/core"; // Mantine
import Image from "next/image"; // صورة
import Link from "next/link"; // روابط
import { useDisclosure } from "@mantine/hooks"; // فتح/غلق
import { IconBell, IconSettings, IconUser, IconHome2, IconLayoutGrid, IconCamera, IconBriefcase, IconFileText, IconCurrencyDollar, IconCalendar, IconSun, IconMoon, IconDevices, IconUsers, IconCategory, IconTool, IconChartBar } from "@tabler/icons-react"; // أيقونات
import { useTheme } from "@/shared/theme"; // ثيم

type Props = { children: React.ReactNode; userRole: 'admin' | 'creator' | 'client' | 'salariedEmployee' | 'guest'; }; // خصائص المكوّن

export function DepthAppShell({ children, userRole }: Props){ // غلاف التطبيق
  const [opened, { toggle, close }] = useDisclosure(false); // حالة الشريط
  const { theme, setTheme } = useTheme(); // حالة الثيم
  const { setColorScheme } = useMantineColorScheme(); // تزامن Mantine

  const shellClass = "app-shell"; // فئة CSS

  const ThemeSwitcher = () => { // مبدّل الثيم
    const getThemeIcon = () => { // أيقونة حسب الثيم
      switch (theme) { // اختيار
        case 'light': return <IconSun size={16} />; // فاتح
        case 'dark': return <IconMoon size={16} />; // داكن
        case 'system': return <IconDevices size={16} />; // نظام
        default: return <IconDevices size={16} />; // افتراضي
      }
    };

    const handleThemeChange = () => { // تدوير الثيم
      const nextTheme: 'light' | 'dark' | 'system' = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'; // التالي
      setTheme(nextTheme); // حفظ
      setColorScheme(nextTheme === 'system' ? 'auto' : nextTheme); // Mantine
    };

    return (
      <ActionIcon onClick={handleThemeChange} variant="light" size="sm" aria-label="تبديل الوضع" title={`الوضع الحالي: ${theme === 'light' ? 'فاتح' : theme === 'dark' ? 'داكن' : 'النظام'}`}>{getThemeIcon()}</ActionIcon>
    ); // زر تبديل
  };

  type NavItem = { label: string; href?: string; icon?: React.ElementType; children?: NavItem[]; defaultOpened?: boolean; }; // عنصر تنقل

  const getNavigationItems = (): NavItem[] => { // بناء القائمة
    const base: NavItem[] = [{ label: 'الرئيسية', href: `/${userRole}`, icon: IconHome2 }]; // أساس

    if (userRole === 'admin') { // أدمن
      return [ // قوائم الأدمن
        { label: 'لوحة التحكم', href: '/admin', icon: IconHome2 }, // داشبورد
        { label: 'إدارة المستخدمين', icon: IconUsers, children: [ // مستخدمين
          { label: 'الأدمنز', icon: IconUser, children: [ // أدمنز
            { label: 'قائمة الأدمنز', href: '/admin/users/admins' }, // قائمة
            { label: 'إضافة أدمن جديد', href: '/admin/users/admins/new' }, // إضافة
          ]},
          { label: 'المبدعون', icon: IconCamera, children: [ // مبدعون
            { label: 'قائمة المبدعين', href: '/admin/users/creators' }, // قائمة
            { label: 'طلبات الانضمام', href: '/admin/users/creators/pending' }, // انضمام
            { label: 'طلبات المعدات', href: '/admin/users/creators/equipment-requests' }, // معدات
            { label: 'طلبات الأوقات', href: '/admin/users/creators/schedule-requests' }, // أوقات
            { label: 'طلبات الفئات الرئيسية', href: '/admin/users/creators/category-requests' }, // فئات رئيسية
            { label: 'طلبات الفئات الفرعية', href: '/admin/users/creators/subcategory-requests' }, // فئات فرعية
          ]},
          { label: 'العملاء', icon: IconUsers, children: [ // عملاء
            { label: 'قائمة العملاء', href: '/admin/users/clients' }, // قائمة
            { label: 'طلبات الانضمام', href: '/admin/users/clients/pending-registrations' }, // انضمام
          ]},
          { label: 'الموظفون بالراتب', icon: IconBriefcase, children: [ // موظفون
            { label: 'قائمة الموظفين', href: '/admin/users/employees' }, // قائمة
            { label: 'دعوة موظف', href: '/admin/users/employees/invite' }, // دعوة
            { label: 'الدعوات المرسلة', href: '/admin/users/employees/invitations' }, // دعوات
          ]},
          { label: 'مركز الطلبات الشامل', href: '/admin/users/requests-center', icon: IconLayoutGrid }, // مركز الطلبات
        ]},
        { label: 'إدارة الخدمات والتصنيفات', icon: IconCategory, children: [ // خدمات وتصنيفات
          { label: 'الفئات الرئيسية', children: [ // رئيسية
            { label: 'قائمة الفئات', href: '/admin/services/categories' }, // قائمة
            { label: 'إضافة فئة جديدة', href: '/admin/services/categories/new' }, // إضافة
          ]},
          { label: 'الفئات الفرعية', children: [ // فرعية
            { label: 'قائمة الفئات الفرعية', href: '/admin/services/subcategories' }, // قائمة
            { label: 'إضافة فئة فرعية', href: '/admin/services/subcategories/new' }, // إضافة
          ]},
          { label: 'المجالات الصناعية', children: [ // صناعات
            { label: 'قائمة المجالات', href: '/admin/services/industries' }, // قائمة
            { label: 'إضافة مجال جديد', href: '/admin/services/industries/new' }, // إضافة
          ]},
          { label: 'ربط الفئات بالصناعات', href: '/admin/services/mappings', icon: IconLayoutGrid }, // ربط
        ]},
        { label: 'التسعير والماليات', icon: IconCurrencyDollar, children: [ // تسعير
          { label: 'معدلات التسعير', children: [ // معدلات
            { label: 'جميع المعدلات', href: '/admin/pricing/modifiers' }, // الكل
            { label: 'حاسبة التسعير', href: '/admin/pricing/modifiers/calculator' }, // حاسبة
          ]},
          { label: 'هوامش الوكالة', children: [ // هوامش
            { label: 'إدارة الهوامش', href: '/admin/pricing/margins' }, // إدارة
          ]},
          { label: 'الفواتير', children: [ // فواتير
            { label: 'قائمة الفواتير', href: '/admin/pricing/invoices' }, // قائمة
            { label: 'إنشاء فاتورة جديدة', href: '/admin/pricing/invoices/new' }, // إنشاء
          ]},
          { label: 'المدفوعات', children: [ // مدفوعات
            { label: 'قائمة المدفوعات', href: '/admin/pricing/payments' }, // قائمة
          ]},
          { label: 'التقارير المالية', href: '/admin/pricing/reports/financial' }, // تقارير
        ]},
        { label: 'إدارة المشاريع', icon: IconBriefcase, children: [ // مشاريع
          { label: 'طلبات المشاريع', children: [ // طلبات
            { label: 'قائمة الطلبات', href: '/admin/projects/requests' }, // قائمة
          ]},
          { label: 'المشاريع النشطة', children: [ // نشطة
            { label: 'قائمة المشاريع', href: '/admin/projects/active' }, // قائمة
          ]},
          { label: 'تعيين المبدعين', href: '/admin/projects/assignment' }, // تعيين
          { label: 'عروض الأسعار', children: [ // عروض
            { label: 'قائمة العروض', href: '/admin/projects/quotes' }, // قائمة
            { label: 'إنشاء عرض سعر', href: '/admin/projects/quotes/new' }, // إنشاء
          ]},
          { label: 'العقود', children: [ // عقود
            { label: 'قائمة العقود', href: '/admin/projects/contracts' }, // قائمة
            { label: 'إنشاء عقد', href: '/admin/projects/contracts/new' }, // إنشاء
          ]},
        ]},
        { label: 'النظام والإعدادات', icon: IconTool, children: [ // نظام
          { label: 'الإعدادات العامة', href: '/admin/system/settings' }, // عامة
          { label: 'المحتوى والقوالب', href: '/admin/system/content' }, // محتوى
          { label: 'الأدوات المساعدة', href: '/admin/system/tools' }, // أدوات
          { label: 'المراقبة والسجلات', href: '/admin/system/monitoring' }, // مراقبة
        ]},
        { label: 'التقارير والتحليلات', icon: IconChartBar, children: [ // تقارير
          { label: 'تقارير الأداء', href: '/admin/analytics/performance' }, // أداء
          { label: 'التحليلات المتقدمة', href: '/admin/analytics/advanced' }, // متقدمة
          { label: 'التصدير والمشاركة', href: '/admin/analytics/export' }, // تصدير
        ]},
      ];
    }

    switch (userRole) { // الأدوار الأخرى
      case 'creator': return [ // مبدع
        ...base, // أساس
        { label: 'مشاريعي', href: '/creator/projects', icon: IconCamera }, // مشاريع
        { label: 'معرض الأعمال', href: '/creator/portfolio', icon: IconLayoutGrid }, // معرض
        { label: 'التوفر', href: '/creator/availability', icon: IconCalendar }, // توفر
        { label: 'الملف الشخصي', href: '/creator/profile', icon: IconUser }, // ملف
      ];
      case 'client': return [ // عميل
        ...base, // أساس
        { label: 'طلب جديد', href: '/client/new-request', icon: IconFileText }, // طلب
        { label: 'مشاريعي', href: '/client/projects', icon: IconBriefcase }, // مشاريع
        { label: 'الفواتير', href: '/client/invoices', icon: IconCurrencyDollar }, // فواتير
        { label: 'الرسائل', href: '/client/messages', icon: IconBell }, // رسائل
      ];
      case 'salariedEmployee': return [ // موظف
        ...base, // أساس
        { label: 'مهامي', href: '/salaried/tasks', icon: IconBriefcase }, // مهام
        { label: 'المشاريع', href: '/salaried/projects', icon: IconLayoutGrid }, // مشاريع
        { label: 'التقويم', href: '/salaried/schedule', icon: IconCalendar }, // تقويم
      ];
      default: return base; // ضيف
    }
  }; // انتهى بناء القائمة

  const navigationItems: NavItem[] = getNavigationItems(); // عناصر التنقل

  const renderNavItem = (item: NavItem): React.ReactNode => { // عرض عنصر
    const LeftIcon = item.icon as React.ElementType | undefined; // نوع الأيقونة
    const left = LeftIcon ? <LeftIcon size={18} /> : undefined; // أيقونة يسار
    const hasChildren = Array.isArray(item.children) && item.children.length > 0; // هل يحتوي أبناء
    if (item.href) { // عنصر رابط
      return (
        <NavLink key={item.label + item.href} label={item.label} leftSection={left} component={Link} href={item.href} c="dimmed" defaultOpened={item.defaultOpened}>{hasChildren && item.children!.map(renderNavItem)}</NavLink>
      ); // NavLink كرابط
    }
    return (
      <NavLink key={item.label} label={item.label} leftSection={left} c="dimmed" defaultOpened={item.defaultOpened}>{hasChildren && item.children!.map(renderNavItem)}</NavLink>
    ); // NavLink كعنوان
  }; // انتهى عرض عنصر

  return (
    <Box className={shellClass} data-role={userRole}> {/* غلاف الشيل */}
      <Box component="header" className="app-header"> {/* الهيدر */}
        <Group h="100%" justify="space-between" w="100%" wrap="nowrap"> {/* توزيع */}
          <Group gap="sm" className="header-nav" wrap="nowrap"> {/* يسار الهيدر */}
            <Burger opened={opened} onClick={toggle} aria-label="فتح القائمة" className="md:hidden mobile:hidden" /> {/* زر برغر */}
            <Image src="/logo-depth.svg" alt="Depth" width={110} height={28} priority className="app-logo" /> {/* شعار */}
            <Badge size="sm" variant="light" color={userRole === 'admin' ? 'red' : 'blue'}>{userRole === 'admin' ? 'أدمن' : userRole === 'creator' ? 'مبدع' : userRole === 'client' ? 'عميل' : userRole === 'salariedEmployee' ? 'موظف' : 'ضيف'}</Badge> {/* دور */}
          </Group>
          <Group gap="sm" className="header-actions" wrap="nowrap"> {/* يمين الهيدر */}
            <ThemeSwitcher /> {/* تبديل ثيم */}
            <ActionIcon variant="light" size="sm" aria-label="إشعارات"><IconBell size={18} /></ActionIcon> {/* إشعارات */}
            <ActionIcon variant="light" size="sm" aria-label="إعدادات"><IconSettings size={18} /></ActionIcon> {/* إعدادات */}
            <ActionIcon variant="light" size="sm" aria-label="حساب"><IconUser size={18} /></ActionIcon> {/* حساب */}
          </Group>
        </Group>
      </Box>

      <Box component="aside" className="app-sidebar hidden md:block mobile:block"> {/* الشريط الجانبي */}
        <ScrollArea.Autosize mah="calc(100dvh - var(--header-height))" type="scroll"> {/* تمرير */}
          <Box p="lg" className="sidebar-inner"> {/* داخل الشريط */}
            <Text fw={700} size="sm" mb="sm" c="var(--color-text-primary)">القائمة</Text> {/* عنوان */}
            {navigationItems.map(renderNavItem)} {/* عناصر */}
            <Divider my="sm" /> {/* فاصل */}
            <NavLink label="الإعدادات" leftSection={<IconSettings size={18} />} c="dimmed" /> {/* إعدادات */}
          </Box>
        </ScrollArea.Autosize>
      </Box>

      <Box component="main" className="app-main"> {/* المحتوى */}
        {children} {/* محتوى الصفحة */}
      </Box>

      {opened && ( // شريط جانبي للموبايل
        <Box className="md:hidden mobile:hidden mobile-overlay" onClick={close}> {/* طبقة إغلاق */}
          <Box className="app-sidebar mobile-sidebar" onClick={(e) => e.stopPropagation()}> {/* لوحة جانبية */}
            <ScrollArea.Autosize mah="calc(100dvh - var(--header-height))" type="scroll"> {/* تمرير */}
              <Box p="md" className="sidebar-inner"> {/* داخل الشريط */}
                <Text fw={700} size="sm" mb="sm" c="var(--color-text-primary)">القائمة</Text> {/* عنوان */}
                {navigationItems.map(renderNavItem)} {/* عناصر */}
                <Divider my="sm" /> {/* فاصل */}
                <NavLink label="الإعدادات" leftSection={<IconSettings size={18} />} onClick={close} c="dimmed" /> {/* إعدادات */}
              </Box>
            </ScrollArea.Autosize>
          </Box>
        </Box>
      )}
    </Box>
  ); // انتهى العرض
}
