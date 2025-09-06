'use client';

import React from 'react';
import { Container, Stack, Tabs } from '@mantine/core';
import { RequestsCenter } from '@/ui/admin/users/RequestsCenter';
import { CreatorsTab } from '@/ui/admin/users/CreatorsTab';
import { ClientsTab } from '@/ui/admin/users/ClientsTab';
import { EmployeesTab } from '@/ui/admin/users/EmployeesTab';
import { AdminsTab } from '@/ui/admin/users/AdminsTab';

export default function AdminUsersHubPage(){
  // صفحة محورية: تجمع أقسام المستخدمين ضمن تبويبات بدل روابط سايدبار كثيرة
  return (
    <Container size="xl" className="admin-main" px={0}>
      <Stack gap="lg">
        <Tabs defaultValue="requests">
          <Tabs.List>
            <Tabs.Tab value="requests">مركز الطلبات الشامل</Tabs.Tab>
            <Tabs.Tab value="creators">المبدعون</Tabs.Tab>
            <Tabs.Tab value="clients">العملاء</Tabs.Tab>
            <Tabs.Tab value="employees">الموظفون بالراتب</Tabs.Tab>
            <Tabs.Tab value="admins">الأدمـنز</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="requests" pt="md">
            <RequestsCenter />
          </Tabs.Panel>

          <Tabs.Panel value="creators" pt="md"><CreatorsTab /></Tabs.Panel>

          <Tabs.Panel value="clients" pt="md"><ClientsTab /></Tabs.Panel>

          <Tabs.Panel value="employees" pt="md"><EmployeesTab /></Tabs.Panel>

          <Tabs.Panel value="admins" pt="md"><AdminsTab /></Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
