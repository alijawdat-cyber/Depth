'use client';

import React from 'react';
import { Container, Title, Text, Badge, Stack } from '@mantine/core';
import classes from './styles.module.css';

export default function ClientDashboard() {
  return (
    <Container size="xl" py={0} className={classes.clientContainer}>
      {/* Header موحد */}
      <div className={classes.pageHeader}>
        <Title order={1} className={classes.pageTitle}>
          لوحة العميل
        </Title>
        <Text className={classes.pageDescription}>
          هذه الصفحة قيد التطوير. ستحتوي على جميع الشاشات المخصصة للعميل مثل تصفح الخدمات وإنشاء الطلبات.
        </Text>
      </div>

      <Stack align="center" gap="md">
        <Badge size="lg" color="violet" variant="light">
          شاشات العميل
        </Badge>
        
        <Text size="sm" className={classes.pageMuted}>
          قريباً: 12 شاشة مخصصة للعملاء
        </Text>
      </Stack>
    </Container>
  );
}
