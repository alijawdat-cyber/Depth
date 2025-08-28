'use client';

import React from 'react';
import { AppShell } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { AppHeader } from '../../molecules/AppHeader/AppHeader';
import { AppSidebar } from '../../molecules/AppSidebar/AppSidebar';
import { adminMenuData } from '../AdminMenuData';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpened, { toggle: toggleSidebar, close: closeSidebar }] = useDisclosure(false);
  // توحيد البريك-بوينت: موبايل < 768px (متوافق ويا md=768)
  const isMobile = useMediaQuery('(max-width: 767px)');
  const router = useRouter();
  const pathname = usePathname();

  // بيانات المستخدم الحالي (mock data - سيتم استبداله بـ context/store)
  const currentUser = {
    id: '1',
    name: 'أحمد محمد',
    email: 'admin@depth.com',
    role: 'admin' as const,
    avatar: undefined,
    isOnline: true,
  };

  const handleLogoutClick = () => {
    console.log('تسجيل خروج');
  };

  // تحديث حالة النشاط للقائمة حسب المسار الحالي
  const updatedMenuData = adminMenuData.map(item => {
    if (item.type === 'link') {
      return {
        ...item,
        isActive: pathname === item.path
      };
    } else if (item.type === 'group' && item.children) {
      return {
        ...item,
        children: item.children.map(child => ({
          ...child,
          isActive: pathname === child.path
        }))
      };
    }
    return item;
  });

  const handleMenuItemClick = (item: { path?: string; title: string }) => {
    if (item.path) {
      router.push(item.path);
    }
    console.log('تم النقر على:', item.title);
    if (isMobile) closeSidebar();
  };

  return (
    <AppShell
      header={{ height: 50 }}                                /* ارتفاع ثابت - Mantine ما يدعم CSS variables */
      className={`${styles.adminShell} ${isMobile && sidebarOpened ? styles.isSidebarOpen : ''}`}
      styles={{
        main: {
          minHeight: '100vh',
          paddingTop: 'var(--header-height)',                /* إضافة مسافة من الأعلى لتجنب تداخل الهيدر */
          // إلغاء تحريك المحتوى على الموبايل؛ السايدبار يغطي كأوفرلاي
          transition: 'none',
        },
        header: {
          backgroundColor: 'var(--color-bg-primary)',        /* خلفية رئيسية من tokens.css */
          borderBottom: '1px solid var(--color-border-primary)', /* حدود من tokens.css */
          padding: 0,
          zIndex: isMobile && sidebarOpened ? 1200 : 1100, // تقليل z-index عند فتح السايدبار
        },
      }}
    >
      <AppShell.Header>
        <AppHeader
          title="لوحة إدارة Depth"
          logoSrc="/logo-depth.svg"
          userName={currentUser.name}
          userEmail={currentUser.email}
          notifications={3}
          onMenuClick={toggleSidebar}
          onNotificationsClick={() => console.log('فتح الإشعارات')}
          onLogout={handleLogoutClick}
          hideBurger={!isMobile}
          burgerOpened={isMobile && sidebarOpened}
        />
      </AppShell.Header>

      <AppShell.Main className={`${styles.mainContent} ${!isMobile ? styles.mainContentDesktopPushed : ''}`}>
        {/* سايدبار: ديسكتوب ثابت دائمًا، وموبايل حسب الحالة */}
        <AppSidebar
          items={updatedMenuData}
          userRole="admin"
          isOpen={!isMobile || sidebarOpened}
          onClose={closeSidebar}
          onItemClick={handleMenuItemClick}
        />
        {isMobile && sidebarOpened && (
          <div
            className={styles.mobileOverlay}
            onClick={closeSidebar}
          />
        )}
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;
