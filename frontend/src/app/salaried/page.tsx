'use client';

import React from 'react';
import { Container, Title, Text, Badge, Stack } from '@mantine/core';

export default function SalariedDashboard() {
  return (
    <Container size="xl" py={60}>
      <Stack align="center" gap="md">
        <Badge size="lg" color="orange" variant="light">
          شاشات الموظف
        </Badge>
        
        <Title order={1} ta="center" c="orange">
          لوحة الموظف
        </Title>
        
        <Text size="lg" ta="center" c="dimmed" maw={500}>
          هذه الصفحة قيد التطوير. ستحتوي على جميع الشاشات المخصصة للموظفين مثل لوحة المهام وتتبع الوقت.
        </Text>
        
        <Text size="sm" c="dimmed">
          قريباً: 10 شاشات مخصصة للموظفين
        </Text>
      </Stack>
    </Container>
  );
}
