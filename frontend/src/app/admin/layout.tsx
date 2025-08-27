'use client';

import React from 'react';
import { MantineProvider } from '@mantine/core';
import AdminLayout from '../../components/admin/AdminLayout/AdminLayout';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function RootAdminLayout({ children }: AdminLayoutProps) {
  return (
    <MantineProvider>
      <AdminLayout>{children}</AdminLayout>
    </MantineProvider>
  );
}
