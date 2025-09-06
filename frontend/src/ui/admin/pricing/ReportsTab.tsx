"use client";
import React, { useMemo } from 'react';
import { Card, Divider, Group, Stack, Text } from '@mantine/core';
import { Coins } from 'lucide-react';
import { getMockDataStats, mockInvoices, mockPayments } from '@/data';
import { formatEN } from './utils';

export function ReportsTab(){
  const stats = getMockDataStats();

  const totals = useMemo(() => {
    const sum = (predicate: (i: import('@/data/types').Invoice) => boolean) =>
      mockInvoices.filter(predicate).reduce((acc, i) => acc + (i.amount.total || 0), 0);
    const count = (predicate: (i: import('@/data/types').Invoice) => boolean) =>
      mockInvoices.filter(predicate).length;

    const paidCount = count((i) => i.status === 'paid');
    const issuedCount = count((i) => i.status === 'issued');
    const partialCount = count((i) => i.status === 'partially_paid');
    const overdueCount = count((i) => i.status === 'overdue');

    const paidTotal = sum((i) => i.status === 'paid');
    const issuedTotal = sum((i) => i.status === 'issued');
    const partialTotal = sum((i) => i.status === 'partially_paid');
    const overdueTotal = sum((i) => i.status === 'overdue');

    return { paidCount, issuedCount, partialCount, overdueCount, paidTotal, issuedTotal, partialTotal, overdueTotal };
  }, []);

  return (
    <Stack gap="md">
      <Group gap="md" wrap="wrap">
        <Card withBorder radius="md">
          <Stack gap="xs">
            <Text c="dimmed">إجمالي الفواتير</Text>
            <Text fw={700} size="lg" dir="ltr">{formatEN(mockInvoices.length)}</Text>
          </Stack>
        </Card>
        <Card withBorder radius="md">
          <Stack gap="xs">
            <Text c="dimmed">إجمالي المدفوعات</Text>
            <Text fw={700} size="lg" dir="ltr">{formatEN(mockPayments.length)}</Text>
          </Stack>
        </Card>
        <Card withBorder radius="md">
          <Stack gap="xs">
            <Text c="dimmed">عدد المشاريع</Text>
            <Text fw={700} size="lg" dir="ltr">{formatEN(stats.projects)}</Text>
          </Stack>
        </Card>
        <Card withBorder radius="md">
          <Stack gap="xs">
            <Text c="dimmed">إجمالي العناصر بالمشاريع</Text>
            <Text fw={700} size="lg" dir="ltr">{formatEN(stats.totalLineItems)}</Text>
          </Stack>
        </Card>
      </Group>

      <Divider />

      <Group gap="md" wrap="wrap">
        <Card withBorder radius="md">
          <Stack gap="xs">
            <Group gap="xs" align="center"><Coins size={16} /><Text fw={600}>مدفوعة</Text></Group>
            <Text>عدد: <span dir="ltr">{formatEN(totals.paidCount)}</span></Text>
            <Text>مجموع: <span dir="ltr">{formatEN(totals.paidTotal)}</span></Text>
          </Stack>
        </Card>
        <Card withBorder radius="md">
          <Stack gap="xs">
            <Text fw={600}>صادرة</Text>
            <Text>عدد: <span dir="ltr">{formatEN(totals.issuedCount)}</span></Text>
            <Text>مجموع: <span dir="ltr">{formatEN(totals.issuedTotal)}</span></Text>
          </Stack>
        </Card>
        <Card withBorder radius="md">
          <Stack gap="xs">
            <Text fw={600}>مدفوعة جزئياً</Text>
            <Text>عدد: <span dir="ltr">{formatEN(totals.partialCount)}</span></Text>
            <Text>مجموع: <span dir="ltr">{formatEN(totals.partialTotal)}</span></Text>
          </Stack>
        </Card>
        <Card withBorder radius="md">
          <Stack gap="xs">
            <Text fw={600}>متأخرة</Text>
            <Text>عدد: <span dir="ltr">{formatEN(totals.overdueCount)}</span></Text>
            <Text>مجموع: <span dir="ltr">{formatEN(totals.overdueTotal)}</span></Text>
          </Stack>
        </Card>
      </Group>
    </Stack>
  );
}
