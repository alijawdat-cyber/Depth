'use client';

import React from 'react';
import { Menu, Avatar, Text, Group, Divider, Badge, Button } from '@mantine/core';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Moon,
  Sun,
  Shield,
  CreditCard,
  HelpCircle,
  Palette,
  type LucideIcon
} from 'lucide-react';
import styles from './UserMenu.module.css';

// نوع عنصر القائمة
export interface UserMenuItem {
  id: string;
  type: 'action' | 'link' | 'divider' | 'toggle';
  label?: string;
  icon?: LucideIcon;
  path?: string;
  badge?: string | number;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  // للعناصر القابلة للتبديل
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
}

// معلومات المستخدم
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'client' | 'creator' | 'salaried';
  plan?: string;
  isOnline?: boolean;
}

// خصائص المكون
export interface UserMenuProps {
  /** معلومات المستخدم */
  user: UserInfo;
  /** عناصر القائمة المخصصة */
  menuItems?: UserMenuItem[];
  /** حالة الوضع الليلي */
  isDarkMode?: boolean;
  /** دالة تغيير الوضع الليلي */
  onThemeToggle?: (isDark: boolean) => void;
  /** دالة تسجيل الخروج */
  onLogout?: () => void;
  /** دالة النقر على عنصر القائمة */
  onItemClick?: (item: UserMenuItem) => void;
  /** تخصيص إضافي لـ CSS */
  className?: string;
}

// عناصر القائمة الافتراضية
const getDefaultMenuItems = (userRole: string, isDarkMode?: boolean): UserMenuItem[] => {
  const baseItems: UserMenuItem[] = [
    {
      id: 'profile',
      type: 'link',
      label: 'الملف الشخصي',
      icon: User,
      path: '/profile'
    },
    {
      id: 'notifications',
      type: 'link',
      label: 'الإشعارات',
      icon: Bell,
      path: '/notifications',
      badge: '3'
    },
    {
      id: 'theme-toggle',
      type: 'toggle',
      label: isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي',
      icon: isDarkMode ? Sun : Moon,
      checked: isDarkMode
    },
    {
      id: 'divider1',
      type: 'divider'
    },
    {
      id: 'settings',
      type: 'link',
      label: 'الإعدادات',
      icon: Settings,
      path: '/settings'
    },
    {
      id: 'help',
      type: 'link',
      label: 'المساعدة',
      icon: HelpCircle,
      path: '/help'
    }
  ];

  // إضافة عناصر خاصة بالأدوار
  const roleSpecificItems: UserMenuItem[] = [];
  
  if (userRole === 'admin') {
    roleSpecificItems.push(
      {
        id: 'admin-panel',
        type: 'link',
        label: 'لوحة الإدارة',
        icon: Shield,
        path: '/admin'
      }
    );
  }

  if (userRole === 'client') {
    roleSpecificItems.push(
      {
        id: 'billing',
        type: 'link',
        label: 'الفواتير',
        icon: CreditCard,
        path: '/billing'
      }
    );
  }

  if (userRole === 'creator' || userRole === 'salaried') {
    roleSpecificItems.push(
      {
        id: 'workspace',
        type: 'link',
        label: 'مساحة العمل',
        icon: Palette,
        path: '/workspace'
      }
    );
  }

  const logoutItems: UserMenuItem[] = [
    {
      id: 'divider2',
      type: 'divider'
    },
    {
      id: 'logout',
      type: 'action',
      label: 'تسجيل الخروج',
      icon: LogOut,
      variant: 'danger'
    }
  ];

  return [
    ...baseItems.slice(0, 4), // الأساسيات + divider
    ...roleSpecificItems,
    ...baseItems.slice(4), // الإعدادات والمساعدة
    ...logoutItems
  ];
};

// ترجمة الأدوار
const getRoleLabel = (role: string): string => {
  const roleLabels: Record<string, string> = {
    admin: 'مدير',
    client: 'عميل',
    creator: 'منشئ محتوى',
    salaried: 'موظف'
  };
  return roleLabels[role] || role;
};

// مكون عنصر القائمة
interface MenuItemComponentProps {
  item: UserMenuItem;
  onItemClick?: (item: UserMenuItem) => void;
  onThemeToggle?: (isDark: boolean) => void;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({ 
  item, 
  onItemClick, 
  onThemeToggle 
}) => {
  if (item.type === 'divider') {
    return <Menu.Divider />;
  }

  const handleClick = () => {
    if (item.type === 'toggle' && item.onToggle) {
      const newChecked = !item.checked;
      item.onToggle(newChecked);
      if (item.id === 'theme-toggle') {
        onThemeToggle?.(newChecked);
      }
    } else {
      onItemClick?.(item);
    }
  };

  const icon = item.icon && <item.icon size={16} />;

  return (
    <Menu.Item
      leftSection={icon}
      rightSection={
        item.badge && (
          <Badge size="xs" variant="filled" color={item.variant === 'danger' ? 'red' : 'blue'}>
            {item.badge}
          </Badge>
        )
      }
      disabled={item.disabled}
      className={`${styles.menuItem} ${item.variant === 'danger' ? styles.dangerItem : ''}`}
      onClick={handleClick}
    >
      <Text size="sm" fw={item.variant === 'danger' ? 500 : 400}>
        {item.label}
      </Text>
    </Menu.Item>
  );
};

// المكون الأساسي
export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  menuItems,
  isDarkMode = false,
  onThemeToggle,
  onLogout,
  onItemClick,
  className
}) => {
  const items = menuItems || getDefaultMenuItems(user.role, isDarkMode);

  const handleItemClick = (item: UserMenuItem) => {
    if (item.id === 'logout') {
      onLogout?.();
    } else {
      onItemClick?.(item);
      if (item.onClick) {
        item.onClick();
      }
    }
  };

  return (
    <div className={className}>
      <Menu 
        position="bottom-end" 
        withArrow 
        arrowPosition="center"
        offset={8}
        classNames={{
          dropdown: styles.dropdown
        }}
      >
        <Menu.Target>
          <Button
            variant="ghost"
            className={styles.trigger}
            leftSection={
              <Avatar
                src={user.avatar}
                size={32}
                radius="xl"
                className={styles.avatar}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            }
          >
            <div className={styles.userInfo}>
              <Text size="sm" fw={600} truncate>
                {user.name}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {getRoleLabel(user.role)}
              </Text>
            </div>
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {/* رأس القائمة */}
          <div className={styles.dropdownHeader}>
            <Group gap="sm" wrap="nowrap">
              <Avatar
                src={user.avatar}
                size={40}
                radius="xl"
                className={styles.headerAvatar}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" fw={600} truncate>
                  {user.name}
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  {user.email}
                </Text>
                {user.plan && (
                  <Badge size="xs" variant="light" mt={4}>
                    {user.plan}
                  </Badge>
                )}
              </div>
              {user.isOnline && (
                <div className={styles.onlineIndicator} />
              )}
            </Group>
          </div>

          <Divider />

          {/* عناصر القائمة */}
          {items.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              onItemClick={handleItemClick}
              onThemeToggle={onThemeToggle}
            />
          ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default UserMenu;
