'use client';

import React from 'react';
import { Badge, Card, Container, Group, Stack, Table, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { mockClients } from '@/data/clients';
import { formatCurrencyIQD } from '@/shared/format';

type PageProps = { params: { id: string } };

export default function ClientProfilePage({ params }: PageProps){
  const c = mockClients.find(x => x.id === params.id);
  if (!c) {
    return (
      <Container>
        <Stack>
          <Title order={2}>العميل غير موجود</Title>
          <Text component={Link} href="/admin/users">رجوع</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" className="admin-main" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" wrap="wrap">
          <Stack gap={2}>
            <Title order={2}>{c.companyName || c.fullName}</Title>
            <Text c="dimmed">المعرّف: {c.id}</Text>
          </Stack>
          <Badge variant="light" color={c.isActive ? 'green' : 'red'}>{c.isActive ? 'نشط' : 'مغلق'}</Badge>
        </Group>

        <Card withBorder radius="md">
          <Stack gap="xs">
            <Table withRowBorders={false} striped>
              <Table.Tbody>
                <Table.Tr><Table.Th>الاسم</Table.Th><Table.Td>{c.fullName}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>النوع</Table.Th><Table.Td>{c.businessType === 'company' ? 'شركة' : 'فرد'}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>المدينة</Table.Th><Table.Td>{c.location.city}، {c.location.area}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>المشاريع الكلية</Table.Th><Table.Td>{c.totalProjects}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>إجمالي الإنفاق</Table.Th><Table.Td style={{direction:'ltr'}}>{formatCurrencyIQD(c.totalSpent)}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>شروط الدفع</Table.Th><Table.Td>{c.paymentTerms}</Table.Td></Table.Tr>
              </Table.Tbody>
            </Table>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
