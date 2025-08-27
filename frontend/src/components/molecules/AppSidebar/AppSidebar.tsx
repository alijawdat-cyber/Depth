'use client';

import React from 'react';
import { Stack, ScrollArea, Divider, Text, Collapse } from '@mantine/core';
import { 
  Home, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  Clock,
  DollarSign,
  Shield,
  User,
  Briefcase,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  type LucideIcon
} from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { Button } from '../../atoms/Button/Button';
import styles from './AppSidebar.module.css';

// أنواع عناصر القائمة
export type MenuItemType = 'link' | 'group' | 'divider';

// عنصر القائمة الأساسي
export interface MenuItem {
  id: string;
  type: MenuItemType;
  title: string;
  icon?: LucideIcon;
  path?: string;
  badge?: string | number;
  children?: MenuItem[];
  roles?: UserRole[];
  isNew?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

// أدوار المستخدمين
export type UserRole = 'admin' | 'client' | 'creator' | 'salaried';

// خصائص المكون
export interface AppSidebarProps {
  /** عناصر القائمة */
  items?: MenuItem[];
  /** دور المستخدم الحالي */
  userRole: UserRole;
  /** هل الشريط الجانبي مفتوح على الجوال */
  isOpen?: boolean;
  /** دالة إغلاق الشريط الجانبي */
  onClose?: () => void;
  /** دالة النقر على عنصر القائمة */
  onItemClick?: (item: MenuItem) => void;
  /** تخصيص إضافي لـ CSS */
  className?: string;
}

// عناصر القائمة الافتراضية حسب كل دور
const getDefaultMenuItems = (userRole: UserRole): MenuItem[] => {
  const adminItems: MenuItem[] = [
    {
      id: 'dashboard',
      type: 'link',
      title: 'لوحة التحكم',
      icon: Home,
      path: '/admin/dashboard',
      roles: ['admin']
    },
    {
      id: 'divider1',
      type: 'divider',
      title: '',
      roles: ['admin']
    },
    {
      id: 'users-group',
      type: 'group',
      title: 'إدارة المستخدمين',
      icon: Users,
      roles: ['admin'],
      children: [
        {
          id: 'all-users',
          type: 'link',
          title: 'كل المستخدمين',
          icon: Users,
          path: '/admin/users',
          roles: ['admin']
        },
        {
          id: 'roles',
          type: 'link',
          title: 'الأدوار والصلاحيات',
          icon: Shield,
          path: '/admin/roles',
          roles: ['admin']
        }
      ]
    },
    {
      id: 'projects',
      type: 'link',
      title: 'المشاريع',
      icon: Briefcase,
      path: '/admin/projects',
      badge: '24',
      roles: ['admin']
    },
    {
      id: 'quotes',
      type: 'link',
      title: 'عروض الأسعار',
      icon: DollarSign,
      path: '/admin/quotes',
      badge: '12',
      roles: ['admin']
    },
    {
      id: 'reports',
      type: 'link',
      title: 'التقارير',
      icon: BarChart3,
      path: '/admin/reports',
      roles: ['admin']
    },
    {
      id: 'settings',
      type: 'link',
      title: 'الإعدادات',
      icon: Settings,
      path: '/admin/settings',
      roles: ['admin']
    }
  ];

  const clientItems: MenuItem[] = [
    {
      id: 'dashboard',
      type: 'link',
      title: 'لوحة التحكم',
      icon: Home,
      path: '/client/dashboard',
      roles: ['client']
    },
    {
      id: 'my-projects',
      type: 'link',
      title: 'مشاريعي',
      icon: Briefcase,
      path: '/client/projects',
      roles: ['client']
    },
    {
      id: 'quotes',
      type: 'link',
      title: 'طلبات الأسعار',
      icon: DollarSign,
      path: '/client/quotes',
      badge: '3',
      roles: ['client']
    },
    {
      id: 'messages',
      type: 'link',
      title: 'الرسائل',
      icon: MessageSquare,
      path: '/client/messages',
      badge: 'جديد',
      isNew: true,
      roles: ['client']
    },
    {
      id: 'profile',
      type: 'link',
      title: 'الملف الشخصي',
      icon: User,
      path: '/client/profile',
      roles: ['client']
    }
  ];

  const creatorItems: MenuItem[] = [
    {
      id: 'dashboard',
      type: 'link',
      title: 'لوحة التحكم',
      icon: Home,
      path: '/creator/dashboard',
      roles: ['creator']
    },
    {
      id: 'my-work',
      type: 'link',
      title: 'أعمالي',
      icon: FileText,
      path: '/creator/work',
      roles: ['creator']
    },
    {
      id: 'schedule',
      type: 'link',
      title: 'جدولي الزمني',
      icon: Calendar,
      path: '/creator/schedule',
      roles: ['creator']
    },
    {
      id: 'earnings',
      type: 'link',
      title: 'الأرباح',
      icon: DollarSign,
      path: '/creator/earnings',
      roles: ['creator']
    }
  ];

  const salariedItems: MenuItem[] = [
    {
      id: 'dashboard',
      type: 'link',
      title: 'لوحة التحكم',
      icon: Home,
      path: '/employee/dashboard',
      roles: ['salaried']
    },
    {
      id: 'tasks',
      type: 'link',
      title: 'المهام المسندة',
      icon: Clock,
      path: '/employee/tasks',
      badge: '8',
      roles: ['salaried']
    },
    {
      id: 'timesheet',
      type: 'link',
      title: 'سجل الوقت',
      icon: Calendar,
      path: '/employee/timesheet',
      roles: ['salaried']
    },
    {
      id: 'requests',
      type: 'link',
      title: 'الطلبات',
      icon: FileText,
      path: '/employee/requests',
      roles: ['salaried']
    }
  ];

  switch (userRole) {
    case 'admin':
      return adminItems;
    case 'client':
      return clientItems;
    case 'creator':
      return creatorItems;
    case 'salaried':
      return salariedItems;
    default:
      return [];
  }
};

// مكون عنصر القائمة
interface MenuItemComponentProps {
  item: MenuItem;
  level?: number;
  onItemClick?: (item: MenuItem) => void;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({ 
  item, 
  level = 0, 
  onItemClick 
}) => {
  const [opened, { toggle }] = useDisclosure(false);

  if (item.type === 'divider') {
    return <Divider className={styles.divider} />;
  }

  if (item.type === 'group') {
    return (
      <div className={styles.menuGroup}>
        <Button
          variant="ghost"
          fullWidth
          justify="space-between"
          leftSection={item.icon && <item.icon size={18} />}
          rightSection={
            item.children && item.children.length > 0 && (
              opened ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            )
          }
          className={styles.groupButton}
          onClick={toggle}
        >
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
        </Button>
        
        <Collapse in={opened}>
          <div className={styles.groupChildren}>
            {item.children?.map((child) => (
              <MenuItemComponent
                key={child.id}
                item={child}
                level={level + 1}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        </Collapse>
      </div>
    );
  }

  return (
    <Button
      variant={item.isActive ? "primary" : "ghost"}
      fullWidth
      justify="flex-start"
      leftSection={item.icon && <item.icon size={18} />}
      rightSection={
        item.badge && (
          <span className={`${styles.badge} ${item.isNew ? styles.badgeNew : ''}`}>
            {item.badge}
          </span>
        )
      }
      className={`${styles.menuItem} ${item.isActive ? styles.activeItem : ''} ${
        level > 0 ? styles.childItem : ''
      }`}
      onClick={() => onItemClick?.(item)}
    >
      <Text size="sm" fw={item.isActive ? 600 : 400}>
        {item.title}
      </Text>
    </Button>
  );
};

// المكون الأساسي
export const AppSidebar: React.FC<AppSidebarProps> = ({
  items,
  userRole,
  isOpen = true,
  onClose,
  onItemClick,
  className
}) => {
  const menuItems = items || getDefaultMenuItems(userRole);
  
  // فلترة العناصر حسب دور المستخدم
  const filteredItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const handleItemClick = (item: MenuItem) => {
    onItemClick?.(item);
    if (item.onClick) {
      item.onClick();
    }
    // إغلاق الشريط الجانبي على الجوال بعد النقر
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''} ${className || ''}`}>
      <ScrollArea className={styles.scrollArea}>
        <Stack gap="xs" p="md">
          {filteredItems.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              onItemClick={handleItemClick}
            />
          ))}
        </Stack>
      </ScrollArea>

      {/* زر الإغلاق للجوال */}
      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default AppSidebar;
