"use client";
import React, { useMemo, useState } from 'react';
import { Badge, Card, Divider, Group, Select, Stack, Table, Text, TextInput } from '@mantine/core';
import { Filter, Search } from 'lucide-react';
import { mockInvoices } from '@/data';
import { formatDate, formatEN } from './utils';

type InvoiceStatus = 'all' | 'issued' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export function InvoicesTab(){
  const [status, setStatus] = useState<InvoiceStatus>('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const s = search.trim().toLowerCase();
    return mockInvoices
      .filter((inv) => (status === 'all' ? true : inv.status === status))
      .filter((inv) => s === '' || inv.id.toLowerCase().includes(s) || inv.clientId.toLowerCase().includes(s));
  }, [status, search]);

  return (
    <Card withBorder radius="md" data-density="compact">
      <Stack gap="md">
        <Group gap="sm" wrap="wrap">
          <TextInput placeholder="بحث بمعرّف الفاتورة أو العميل" leftSection={<Search size={14} />} value={search} onChange={(e) => setSearch(e.currentTarget.value)} />
          <Select
            placeholder="الحالة"
            leftSection={<Filter size={14} />}
            value={status}
            onChange={(v) => {
              if (v === 'all' || v === 'issued' || v === 'partially_paid' || v === 'paid' || v === 'overdue' || v === 'cancelled') setStatus(v); else setStatus('all');
            }}
            data={[
              { value: 'all', label: 'الكل' },
              { value: 'issued', label: 'صادرة' },
              { value: 'partially_paid', label: 'مدفوعة جزئياً' },
              { value: 'paid', label: 'مدفوعة' },
              { value: 'overdue', label: 'متأخرة' },
              { value: 'cancelled', label: 'ملغاة' },
            ]}
          />
        </Group>

        <Divider />

        <div data-responsive="wide" data-wide-min="true">
          <Table stickyHeader highlightOnHover striped withRowBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>المعرّف</Table.Th>
                <Table.Th>العميل</Table.Th>
                <Table.Th>الحالة</Table.Th>
                <Table.Th>المبلغ</Table.Th>
                <Table.Th>الإصدار</Table.Th>
                <Table.Th>الاستحقاق</Table.Th>
                <Table.Th>مدفوعات</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((inv) => (
                <Table.Tr key={inv.id}>
                  <Table.Td>{inv.id}</Table.Td>
                  <Table.Td>{inv.clientId}</Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={
                        inv.status === 'paid' ? 'green' : inv.status === 'overdue' ? 'red' : inv.status === 'cancelled' ? 'gray' : 'yellow'
                      }
                    >
                      {inv.status === 'issued' && 'صادرة'}
                      {inv.status === 'partially_paid' && 'مدفوعة جزئياً'}
                      {inv.status === 'paid' && 'مدفوعة'}
                      {inv.status === 'overdue' && 'متأخرة'}
                      {inv.status === 'cancelled' && 'ملغاة'}
                    </Badge>
                  </Table.Td>
                  <Table.Td dir="ltr">{formatEN(inv.amount.total)}</Table.Td>
                  <Table.Td>{formatDate(inv.issuedAt)}</Table.Td>
                  <Table.Td>{formatDate(inv.dueDate)}</Table.Td>
                  <Table.Td dir="ltr">{inv.relatedPaymentsCount}</Table.Td>
                </Table.Tr>
              ))}
              {rows.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={7}><Text c="dimmed" ta="center">لا توجد فواتير</Text></Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </div>
      </Stack>
    </Card>
  );
}
