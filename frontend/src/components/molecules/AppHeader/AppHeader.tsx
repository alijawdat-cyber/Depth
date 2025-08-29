"use client";
import React from "react";
import { Group, Text, ActionIcon, Burger } from "@mantine/core";
import { Menu, MenuTarget, MenuDropdown, MenuItem, MenuDivider, Avatar } from "@mantine/core";
import { Bell, Settings, LogOut, User } from "lucide-react";
import Image from "next/image";
import styles from "./AppHeader.module.css";

export interface AppHeaderProps {
  /** عنوان التطبيق */
  title: string;
  /** مصدر الشعار */
  logoSrc?: string;
  /** صورة المستخدم */
  userAvatar?: string;
  /** اسم المستخدم */
  userName?: string;
  /** ايميل المستخدم */
  userEmail?: string;
  /** اسم الشركة */
  userCompany?: string;
  /** عدد الإشعارات */
  notifications?: number;
  /** وظيفة فتح القائمة الجانبية */
  onMenuClick?: () => void;
  /** وظيفة فتح الإشعارات */
  onNotificationsClick?: () => void;
  /** وظيفة تسجيل الخروج */
  onLogout?: () => void;
  /** إجراءات إضافية */
  actions?: React.ReactNode;
  /** إخفاء زر القائمة */
  hideBurger?: boolean;
  /** حالة فتح السايدبار لعرض حالة البورغر */
  burgerOpened?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  logoSrc = "/logo-depth.svg",
  userAvatar,
  userName = "المستخدم",
  userEmail,
  userCompany,
  notifications = 0,
  onMenuClick,
  onNotificationsClick,
  onLogout,
  actions,
  hideBurger = false,
  burgerOpened = false,
}) => {
  return (
    <div className={styles.appHeader}>
      {/* Left Section */}
      <Group gap="md">
        {!hideBurger && (
          <Burger
            opened={burgerOpened}
            onClick={onMenuClick}
            size="sm"
            className={styles.appHeaderBurger}
          />
        )}
        
        <Group gap="sm">
          <Image
            src={logoSrc}
            alt="Logo"
            width={24}
            height={24}
            className={styles.appHeaderLogo}
          />
          <Text
            size="lg"
            fw={600}
            className={styles.appHeaderTitle}
          >
            {title}
          </Text>
        </Group>
      </Group>

      {/* Right Section */}
      <Group gap="sm">
        {/* Custom Actions */}
        {actions}

        {/* Notifications */}
        {onNotificationsClick && (
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={onNotificationsClick}
            className={styles.appHeaderNotificationsButton}
          >
            <Bell size={18} />
            {notifications > 0 && (
              <div className={styles.appHeaderNotificationBadge}>
                {notifications > 99 ? '99+' : notifications}
              </div>
            )}
          </ActionIcon>
        )}

        {/* User Menu */}
        <Menu
          position="bottom-end"
          width={260}
        >
          <MenuTarget>
            <div className={styles.appHeaderUserMenu}>
              <Avatar
                src={userAvatar}
                name={userName}
                size="sm"
                variant="filled"
              />
              <div className={styles.appHeaderUserDetails}>
                <Text
                  size="sm"
                  fw={500}
                  className={styles.appHeaderUserText}
                >
                  {userName}
                </Text>
                {userCompany && (
                  <Text
                    size="xs"
                    c="dimmed"
                    className={styles.appHeaderUserText}
                  >
                    {userCompany}
                  </Text>
                )}
              </div>
            </div>
          </MenuTarget>

          <MenuDropdown>
            {/* User Info Header */}
            <div className={styles.appHeaderUserInfo}>
              <Group gap="sm">
                <Avatar
                  src={userAvatar}
                  name={userName}
                size="sm"
                variant="filled"
              />
              <div>
                <Text
                  size="sm"
                  fw={500}
                  className={styles.appHeaderUserText}
                >
                  {userName}
                </Text>
                {userEmail && (
                  <Text
                    size="xs"
                    c="dimmed"
                    className={styles.appHeaderUserText}
                  >
                    {userEmail}
                  </Text>
                )}
                {userCompany && (
                  <Text
                    size="xs"
                    c="dimmed"
                    className={styles.appHeaderUserText}
                  >
                    {userCompany}
                  </Text>
                )}
              </div>
            </Group>
          </div>

          {/* Menu Items */}
          <MenuItem
            leftSection={<User size={14} />}
            onClick={() => console.log('الملف الشخصي')}
          >
            الملف الشخصي
          </MenuItem>
          
          <MenuItem
            leftSection={<Settings size={14} />}
            onClick={() => console.log('الإعدادات')}
          >
            الإعدادات
          </MenuItem>

          <MenuDivider />

          <MenuItem
            leftSection={<LogOut size={14} />}
            color="red"
            onClick={onLogout}
          >
            تسجيل الخروج
          </MenuItem>
          </MenuDropdown>
        </Menu>
      </Group>
    </div>
  );
};

export default AppHeader;
