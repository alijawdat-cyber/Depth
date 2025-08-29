'use client';

import React from 'react';
import { AppShell } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { AppHeader } from '../../molecules/AppHeader/AppHeader';
import { AppSidebar } from '../../molecules/AppSidebar/AppSidebar';
import { adminMenuData } from '../AdminMenuData';
// يستخدم كلاسات عالمية معرفة في globals.css (adminShell, mainContent, ...)

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
      header={{ height: 50 }}
      navbar={{ 
        width: 250, 
        breakpoint: 'sm',
        collapsed: { mobile: !sidebarOpened, desktop: !sidebarOpened }
      }}
      className={`adminShell`}
      styles={{
        main: {
          minHeight: '100vh',
          transition: 'none',
          position: 'relative',
        },
        header: {
          backgroundColor: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border-primary)',
          padding: 0,
          zIndex: 'var(--z-header)',
        },
        navbar: {
          backgroundColor: 'var(--color-bg-secondary)',
          borderInlineEnd: '1px solid var(--color-border-primary)',
          zIndex: 'var(--z-sidebar)',
          padding: 0,
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
          hideBurger={false}
          burgerOpened={sidebarOpened}
        />
      </AppShell.Header>

      <AppShell.Navbar>
        <AppSidebar
          items={updatedMenuData}
          userRole="admin"
          isOpen={sidebarOpened}
          onClose={closeSidebar}
          onItemClick={handleMenuItemClick}
        />
      </AppShell.Navbar>

      <AppShell.Main className="mainContent">
        {/* تعتيم الخلفية عند فتح السايدبار - على الموبايل فقط */}
        {isMobile && sidebarOpened && (
          <div 
            className="mobileOverlay" 
            onClick={closeSidebar}
          />
        )}
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;
