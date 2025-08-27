'use client';

import React from 'react';
import { Container, Title, Text, Badge, Stack } from '@mantine/core';

export default function ClientDashboard() {
  return (
    <Container size="xl" py={60}>
      <Stack align="center" gap="md">
        <Badge size="lg" color="blue" variant="light">
          شاشات العميل
        </Badge>
        
        <Title order={1} ta="center" c="blue">
          لوحة العميل
        </Title>
        
        <Text size="lg" ta="center" c="dimmed" maw={500}>
          هذه الصفحة قيد التطوير. ستحتوي على جميع الشاشات المخصصة للعميل مثل تصفح الخدمات وإنشاء الطلبات.
        </Text>
        
        <Text size="sm" c="dimmed">
          قريباً: 12 شاشة مخصصة للعملاء
        </Text>
      </Stack>
    </Container>
  );
}
