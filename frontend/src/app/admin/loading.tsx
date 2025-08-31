import React from 'react';
import {
  Container,
  Center,
  Stack,
  Text,
  Loader
} from '@mantine/core';

// ================================
// شاشة التحميل الموحدة للأدمن
// ================================

export default function AdminLoading() {
  return (
    <Container size="xl" className="admin-main">
      <Center style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
        <Stack gap="md" align="center">
          <Loader size="lg" color="blue" />
          <Text size="lg" fw={500} c="dimmed">
            جاري تحميل لوحة التحكم...
          </Text>
        </Stack>
      </Center>
    </Container>
  );
}
