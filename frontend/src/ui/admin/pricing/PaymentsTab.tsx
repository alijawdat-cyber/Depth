"use client";
import React, { useMemo, useState } from 'react';
import { Card, Divider, Group, Stack, Table, Text, TextInput } from '@mantine/core';
import { Search } from 'lucide-react';
import { mockPayments } from '@/data';
import { formatDate, formatEN } from './utils';

export function PaymentsTab(){
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const s = search.trim().toLowerCase();
    return mockPayments.filter((p) => s === '' || p.id.toLowerCase().includes(s) || p.invoiceId.toLowerCase().includes(s));
  }, [search]);

  return (
    <Card withBorder radius="md" data-density="compact">
      <Stack gap="md">
        <Group gap="sm" wrap="wrap">
          <TextInput placeholder="بحث بالمدفوع/الفاتورة" leftSection={<Search size={14} />} value={search} onChange={(e) => setSearch(e.currentTarget.value)} />
        </Group>

        <Divider />

        <div data-responsive="wide" data-wide-min="true">
          <Table stickyHeader highlightOnHover striped withRowBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>المعرّف</Table.Th>
                <Table.Th>فاتورة</Table.Th>
                <Table.Th>المبلغ</Table.Th>
                <Table.Th>الطريقة</Table.Th>
                <Table.Th>التاريخ</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>{p.id}</Table.Td>
                  <Table.Td>{p.invoiceId}</Table.Td>
                  <Table.Td dir="ltr">{formatEN(p.amount)}</Table.Td>
                  <Table.Td>{p.method === 'manual' ? 'يدوي' : p.method}</Table.Td>
                  <Table.Td>{formatDate(p.receivedAt)}</Table.Td>
                </Table.Tr>
              ))}
              {rows.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={5}><Text c="dimmed" ta="center">لا توجد مدفوعات</Text></Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </div>
      </Stack>
    </Card>
  );
}
