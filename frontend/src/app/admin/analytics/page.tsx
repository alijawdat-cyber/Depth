'use client';

import React from 'react';
import { Container, Stack, Tabs } from '@mantine/core';

export default function AdminAnalyticsHubPage(){
  return (
    <Container size="xl" className="admin-main" px={0}>
      <Stack gap="lg">
        <Tabs defaultValue="performance">
          <Tabs.List>
            <Tabs.Tab value="performance">تقارير الأداء</Tabs.Tab>
            <Tabs.Tab value="advanced">تحليلات متقدمة</Tabs.Tab>
            <Tabs.Tab value="export">تصدير ومشاركة</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="performance" pt="md">{null}</Tabs.Panel>
          <Tabs.Panel value="advanced" pt="md">{null}</Tabs.Panel>
          <Tabs.Panel value="export" pt="md">{null}</Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
