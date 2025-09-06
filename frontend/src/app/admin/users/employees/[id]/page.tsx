'use client';

import React from 'react';
import { Badge, Card, Container, Group, Stack, Table, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { mockSalariedEmployees } from '@/data';
import { formatCurrencyIQD, formatDateEn } from '@/shared/format';

type PageProps = { params: { id: string } };

export default function EmployeeProfilePage({ params }: PageProps){
  const e = mockSalariedEmployees.find((x) => x.id === params.id);
  if (!e) {
    return (
      <Container>
        <Stack>
          <Title order={2}>الموظف غير موجود</Title>
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
            <Title order={2}>{e.fullName}</Title>
            <Text c="dimmed">المعرّف: {e.id}</Text>
          </Stack>
          <Badge variant="light" color={e.isActive ? 'green' : 'red'}>{e.isActive ? 'نشط' : 'مغلق'}</Badge>
        </Group>

        <Card withBorder radius="md">
          <Stack gap="xs">
            <Table withRowBorders={false} striped>
              <Table.Tbody>
                <Table.Tr><Table.Th>القسم</Table.Th><Table.Td>{e.department}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>المسمى الوظيفي</Table.Th><Table.Td>{e.jobTitle}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>نوع التوظيف</Table.Th><Table.Td>{e.employmentType}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>الراتب الشهري</Table.Th><Table.Td style={{direction:'ltr'}}>{formatCurrencyIQD(e.monthlySalary)}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>المهارات</Table.Th><Table.Td>{e.skills.join(', ')}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>تاريخ البدء</Table.Th><Table.Td>{formatDateEn(e.startDate)}</Table.Td></Table.Tr>
              </Table.Tbody>
            </Table>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
