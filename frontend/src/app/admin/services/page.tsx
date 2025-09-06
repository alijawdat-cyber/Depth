'use client';

import React from 'react';
import { Container, Stack, Tabs } from '@mantine/core';
// استيراد الصفحات الفرعية كمكوّنات لإظهارها داخل التابات
import AdminCategoriesPage from '@/app/admin/services/categories/page';
import AdminSubcategoriesPage from '@/app/admin/services/subcategories/page';
import AdminIndustriesPage from '@/app/admin/services/industries/page';
import AdminMappingsPage from '@/app/admin/services/mappings/page';

export default function AdminServicesHubPage(){
  return (
    <Container size="xl" className="admin-main" px={0}>
      <Stack gap="lg">
        <Tabs defaultValue="categories">
          <Tabs.List>
            <Tabs.Tab value="categories">الفئات الرئيسية</Tabs.Tab>
            <Tabs.Tab value="subcategories">الفئات الفرعية</Tabs.Tab>
            <Tabs.Tab value="industries">المجالات الصناعية</Tabs.Tab>
            <Tabs.Tab value="mappings">ربط الفئات بالصناعات</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="categories" pt="md">
            <AdminCategoriesPage />
          </Tabs.Panel>
          <Tabs.Panel value="subcategories" pt="md">
            <AdminSubcategoriesPage />
          </Tabs.Panel>
          <Tabs.Panel value="industries" pt="md">
            <AdminIndustriesPage />
          </Tabs.Panel>
          <Tabs.Panel value="mappings" pt="md">
            <AdminMappingsPage />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
