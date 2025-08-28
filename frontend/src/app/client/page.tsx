'use client';

import React from 'react';
import { Container, Title, Text, Badge, Stack } from '@mantine/core';
import classes from './styles.module.css';

export default function ClientDashboard() {
  return (
  <Container size="xl" py={0}>
      <Stack align="center" gap="md">
  <Badge size="lg" color="violet" variant="light">
          شاشات العميل
        </Badge>
        
  <Title order={1} ta="center" className={classes.pageTitle}>
          لوحة العميل
        </Title>
        
  <Text size="lg" ta="center" maw={500} className={classes.pageDescription}>
          هذه الصفحة قيد التطوير. ستحتوي على جميع الشاشات المخصصة للعميل مثل تصفح الخدمات وإنشاء الطلبات.
        </Text>
        
  <Text size="sm" className={classes.pageMuted}>
          قريباً: 12 شاشة مخصصة للعملاء
        </Text>
      </Stack>
    </Container>
  );
}
