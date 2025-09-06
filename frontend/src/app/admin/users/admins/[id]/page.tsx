'use client';

import React, { useState } from 'react';
import { Badge, Card, Checkbox, Container, Group, Stack, Table, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { mockAdmins } from '@/data/admins';
import { formatDateEn } from '@/shared/format';

type PageProps = { params: { id: string } };

export default function AdminProfilePage({ params }: PageProps){
  const a = mockAdmins.find(x => x.id === params.id);
  const [perms, setPerms] = useState(a?.permissions);

  if (!a) {
    return (
      <Container>
        <Stack>
          <Title order={2}>الأدمن غير موجود</Title>
          <Text component={Link} href="/admin/users">رجوع</Text>
        </Stack>
      </Container>
    );
  }

  const toggle = (k: keyof NonNullable<typeof perms>) => {
    setPerms((p) => p ? { ...p, [k]: !p[k] } : p);
  };

  return (
    <Container size="lg" className="admin-main" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" wrap="wrap">
          <Stack gap={2}>
            <Title order={2}>{a.fullName}</Title>
            <Text c="dimmed">المعرّف: {a.id}</Text>
          </Stack>
          <Badge variant="light" color={a.isActive ? 'green' : 'red'}>{a.isActive ? 'نشط' : 'معطل'}</Badge>
        </Group>

        <Card withBorder radius="md">
          <Stack gap="sm">
            <Table withRowBorders={false} striped>
              <Table.Tbody>
                <Table.Tr><Table.Th>المستوى</Table.Th><Table.Td>{a.adminLevel}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>الهاتف</Table.Th><Table.Td dir="ltr">{a.phone}</Table.Td></Table.Tr>
                <Table.Tr><Table.Th>آخر دخول</Table.Th><Table.Td>{a.lastLoginAt ? formatDateEn(a.lastLoginAt) : '-'}</Table.Td></Table.Tr>
              </Table.Tbody>
            </Table>

            <Stack gap={6}>
              <Title order={4}>الصلاحيات</Title>
              <Group gap="lg" wrap="wrap">
                <Checkbox label="إدارة المستخدمين" checked={!!perms?.canManageUsers} onChange={() => toggle('canManageUsers')} />
                <Checkbox label="إدارة المشاريع" checked={!!perms?.canManageProjects} onChange={() => toggle('canManageProjects')} />
                <Checkbox label="إدارة الدفعات" checked={!!perms?.canManagePayments} onChange={() => toggle('canManagePayments')} />
                <Checkbox label="عرض التقارير" checked={!!perms?.canViewReports} onChange={() => toggle('canViewReports')} />
                <Checkbox label="إدارة الإعدادات" checked={!!perms?.canManageSettings} onChange={() => toggle('canManageSettings')} />
                <Checkbox label="إدارة الأدمنز" checked={!!perms?.canManageAdmins} onChange={() => toggle('canManageAdmins')} />
              </Group>
              <Text c="dimmed" size="sm">تغييرات الصلاحيات هنا محلية (Mock) ولا تحفظ خارجياً.</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
