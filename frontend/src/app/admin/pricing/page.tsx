"use client";

import React from 'react';
import { Container, Stack, Tabs } from '@mantine/core';
import { ModifiersTab } from '@/ui/admin/pricing/ModifiersTab';
import { MarginsTab } from '@/ui/admin/pricing/MarginsTab';
import { InvoicesTab } from '@/ui/admin/pricing/InvoicesTab';
import { PaymentsTab } from '@/ui/admin/pricing/PaymentsTab';
import { ReportsTab } from '@/ui/admin/pricing/ReportsTab';

export default function AdminPricingHubPage(){
  return (
    <Container size="xl" className="admin-main" px={0}>
      <Stack gap="lg">
        <Tabs defaultValue="modifiers">
          <Tabs.List>
            <Tabs.Tab value="modifiers">معدلات التسعير</Tabs.Tab>
            <Tabs.Tab value="margins">هوامش الوكالة</Tabs.Tab>
            <Tabs.Tab value="invoices">الفواتير</Tabs.Tab>
            <Tabs.Tab value="payments">المدفوعات</Tabs.Tab>
            <Tabs.Tab value="reports">تقارير مالية</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="modifiers" pt="md"><ModifiersTab /></Tabs.Panel>
          <Tabs.Panel value="margins" pt="md"><MarginsTab /></Tabs.Panel>
          <Tabs.Panel value="invoices" pt="md"><InvoicesTab /></Tabs.Panel>
          <Tabs.Panel value="payments" pt="md"><PaymentsTab /></Tabs.Panel>
          <Tabs.Panel value="reports" pt="md"><ReportsTab /></Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
