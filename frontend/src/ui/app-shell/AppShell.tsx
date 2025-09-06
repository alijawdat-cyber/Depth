"use client"; // مكوّن عميل
import React from "react"; // React
import { Box, Group, Burger, ScrollArea, NavLink, Text, ActionIcon, Badge, useMantineColorScheme } from "@mantine/core"; // Mantine
import Image from "next/image"; // صورة
import Link from "next/link"; // روابط
import { useDisclosure } from "@mantine/hooks"; // فتح/غلق
import { Bell, Settings, User, Home, LayoutGrid, Camera, Briefcase, FileText, DollarSign, Calendar, Sun, Moon, Monitor, Users, Shapes, BarChart3 } from "lucide-react"; // أيقونات
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
  case 'light': return <Sun size={16} />; // فاتح
  case 'dark': return <Moon size={16} />; // داكن
  case 'system': return <Monitor size={16} />; // نظام
  default: return <Monitor size={16} />; // افتراضي
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
  const base: NavItem[] = [{ label: 'الرئيسية', href: `/${userRole}`, icon: Home }]; // أساس

    if (userRole === 'admin') { // أدمن
      return [
        { label: 'لوحة التحكم', href: '/admin', icon: Home },
        { label: 'المستخدمون', href: '/admin/users', icon: Users },
        { label: 'الخدمات والتصنيفات', href: '/admin/services', icon: Shapes },
        { label: 'المشاريع', href: '/admin/projects', icon: Briefcase },
        { label: 'التسعير والماليات', href: '/admin/pricing', icon: DollarSign },
        { label: 'النظام والإعدادات', href: '/admin/system', icon: Settings },
        { label: 'التقارير والتحليلات', href: '/admin/analytics', icon: BarChart3 },
      ];
    }

    switch (userRole) { // الأدوار الأخرى
      case 'creator': return [ // مبدع
        ...base, // أساس
        { label: 'مشاريعي', href: '/creator/projects', icon: Camera }, // مشاريع
        { label: 'معرض الأعمال', href: '/creator/portfolio', icon: LayoutGrid }, // معرض
        { label: 'التوفر', href: '/creator/availability', icon: Calendar }, // توفر
        { label: 'الملف الشخصي', href: '/creator/profile', icon: User }, // ملف
      ];
      case 'client': return [ // عميل
        ...base, // أساس
        { label: 'طلب جديد', href: '/client/new-request', icon: FileText }, // طلب
        { label: 'مشاريعي', href: '/client/projects', icon: Briefcase }, // مشاريع
        { label: 'الفواتير', href: '/client/invoices', icon: DollarSign }, // فواتير
        { label: 'الرسائل', href: '/client/messages', icon: Bell }, // رسائل
      ];
      case 'salariedEmployee': return [ // موظف
        ...base, // أساس
        { label: 'مهامي', href: '/salaried/tasks', icon: Briefcase }, // مهام
        { label: 'المشاريع', href: '/salaried/projects', icon: LayoutGrid }, // مشاريع
        { label: 'التقويم', href: '/salaried/schedule', icon: Calendar }, // تقويم
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
            <Burger opened={opened} onClick={toggle} aria-label="فتح القائمة" className="md:hidden" /> {/* زر برغر */}
            <Image src="/logo-depth.svg" alt="Depth" width={110} height={28} priority className="app-logo" /> {/* شعار */}
            <Badge size="sm" variant="light" color={userRole === 'admin' ? 'red' : 'blue'}>{userRole === 'admin' ? 'أدمن' : userRole === 'creator' ? 'مبدع' : userRole === 'client' ? 'عميل' : userRole === 'salariedEmployee' ? 'موظف' : 'ضيف'}</Badge> {/* دور */}
          </Group>
          <Group gap="sm" className="header-actions" wrap="nowrap"> {/* يمين الهيدر */}
            <ThemeSwitcher /> {/* تبديل ثيم */}
            <ActionIcon variant="light" size="sm" aria-label="إشعارات"><Bell size={18} /></ActionIcon> {/* إشعارات */}
            <ActionIcon variant="light" size="sm" aria-label="إعدادات"><Settings size={18} /></ActionIcon> {/* إعدادات */}
            <ActionIcon variant="light" size="sm" aria-label="حساب"><User size={18} /></ActionIcon> {/* حساب */}
          </Group>
        </Group>
      </Box>

  <Box component="aside" className="app-sidebar hidden md:block"> {/* الشريط الجانبي */}
        <ScrollArea.Autosize mah="calc(100dvh - var(--header-height))" type="scroll"> {/* تمرير */}
          <Box p="lg" className="sidebar-inner"> {/* داخل الشريط */}
            <Text fw={700} size="sm" mb="sm" c="var(--color-text-primary)">القائمة</Text> {/* عنوان */}
            {navigationItems.map(renderNavItem)} {/* عناصر */}
            {/* أزلنا عنصر إعدادات المكرر لأن "النظام والإعدادات" موجود ضمن العناصر */}
          </Box>
        </ScrollArea.Autosize>
      </Box>

      <Box component="main" className="app-main"> {/* المحتوى */}
        {children} {/* محتوى الصفحة */}
      </Box>

      {opened && ( // شريط جانبي للموبايل
  <Box className="md:hidden mobile-overlay" onClick={close}> {/* طبقة إغلاق */}
          <Box className="app-sidebar mobile-sidebar" onClick={(e) => e.stopPropagation()}> {/* لوحة جانبية */}
            <ScrollArea.Autosize mah="calc(100dvh - var(--header-height))" type="scroll"> {/* تمرير */}
              <Box p="md" className="sidebar-inner"> {/* داخل الشريط */}
                <Text fw={700} size="sm" mb="sm" c="var(--color-text-primary)">القائمة</Text> {/* عنوان */}
                {navigationItems.map(renderNavItem)} {/* عناصر */}
                {/* أزلنا عنصر إعدادات المكرر في الموبايل أيضًا */}
              </Box>
            </ScrollArea.Autosize>
          </Box>
        </Box>
      )}
    </Box>
  ); // انتهى العرض
}
