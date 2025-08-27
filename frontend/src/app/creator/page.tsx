'use client';

import React from 'react';
import { Container, Title, Text, Badge, Stack } from '@mantine/core';

export default function CreatorDashboard() {
  return (
    <Container size="xl" py={60}>
      <Stack align="center" gap="md">
        <Badge size="lg" color="green" variant="light">
          شاشات المبدع
        </Badge>
        
        <Title order={1} ta="center" c="green">
          لوحة المبدع
        </Title>
        
        <Text size="lg" ta="center" c="dimmed" maw={500}>
          هذه الصفحة قيد التطوير. ستحتوي على جميع الشاشات المخصصة للمبدعين مثل معرض الأعمال وإدارة الطلبات.
        </Text>
        
        <Text size="sm" c="dimmed">
          قريباً: 14 شاشة مخصصة للمبدعين
        </Text>
      </Stack>
    </Container>
  );
}
