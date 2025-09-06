'use client';

import React from 'react';
import { Container, Stack, Tabs } from '@mantine/core';

export default function AdminSystemHubPage(){
  return (
    <Container size="xl" className="admin-main" px={0}>
      <Stack gap="lg">
        <Tabs defaultValue="settings">
          <Tabs.List>
            <Tabs.Tab value="settings">الإعدادات العامة</Tabs.Tab>
            <Tabs.Tab value="content">المحتوى والقوالب</Tabs.Tab>
            <Tabs.Tab value="tools">الأدوات المساعدة</Tabs.Tab>
            <Tabs.Tab value="monitoring">المراقبة والسجلات</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="settings" pt="md">{null}</Tabs.Panel>
          <Tabs.Panel value="content" pt="md">{null}</Tabs.Panel>
          <Tabs.Panel value="tools" pt="md">{null}</Tabs.Panel>
          <Tabs.Panel value="monitoring" pt="md">{null}</Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
