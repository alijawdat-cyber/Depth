'use client';

import React from 'react';
import { Container, Title, Text, Badge, Stack } from '@mantine/core';
import classes from './styles.module.css';

export default function SalariedDashboard() {
  return (
    <Container size="xl" py={0} className={classes.salariedContainer}>
      {/* Header موحد */}
      <div className={classes.pageHeader}>
        <Title order={1} className={classes.pageTitle}>
          لوحة الموظف
        </Title>
        <Text className={classes.pageDescription}>
          هذه الصفحة قيد التطوير. ستحتوي على جميع الشاشات المخصصة للموظفين مثل لوحة المهام وتتبع الوقت.
        </Text>
      </div>

      <Stack align="center" gap="md">
        <Badge size="lg" color="violet" variant="light">
          شاشات الموظف
        </Badge>
        
        <Text size="sm" className={classes.pageMuted}>
          قريباً: 10 شاشات مخصصة للموظفين
        </Text>
      </Stack>
    </Container>
  );
}
