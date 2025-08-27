'use client';

import React from 'react';
import { AppShell } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
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

  return (
    <AppShell
      header={{ height: 60 }}
      className={`${styles.adminShell} ${isMobile && sidebarOpened ? styles.isSidebarOpen : ''}`}
      styles={{
        main: {
          backgroundColor: 'var(--bg)',
          minHeight: '100vh',
          // إلغاء تحريك المحتوى على الموبايل؛ السايدبار يغطي كأوفرلاي
          transition: 'none',
        },
        header: {
          backgroundColor: 'var(--bg)',
          borderBottom: '1px solid var(--color-outline-variant)',
          padding: 0,
          zIndex: 1100,
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
          items={adminMenuData}
          userRole="admin"
          isOpen={!isMobile || sidebarOpened}
          onClose={closeSidebar}
          onItemClick={(item) => {
            console.log('تم النقر على:', item.title);
            if (isMobile) closeSidebar();
          }}
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
