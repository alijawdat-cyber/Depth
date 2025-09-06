"use client";
import React, { useMemo, useState } from 'react';
import { Badge, Card, Divider, Group, Select, Stack, Table, Text, TextInput } from '@mantine/core';
import { Search, Filter } from 'lucide-react';
import { mockPricingModifiers } from '@/data';
import { formatDate, formatEN } from './utils';

export function ModifiersTab(){
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'multiplier' | 'addition'>('all');

  const rows = useMemo(() => {
    const s = search.trim().toLowerCase();
    return mockPricingModifiers
      .filter((m) => (typeFilter === 'all' ? true : m.type === typeFilter))
      .filter((m) => s === '' || m.category.toLowerCase().includes(s) || m.key.toLowerCase().includes(s));
  }, [search, typeFilter]);

  return (
    <Card withBorder radius="md" data-density="compact">
      <Stack gap="md">
        <Group gap="sm" wrap="wrap">
          <TextInput placeholder="بحث بالفئة أو المفتاح" leftSection={<Search size={14} />} value={search} onChange={(e) => setSearch(e.currentTarget.value)} />
          <Select
            placeholder="نوع المعدّل"
            leftSection={<Filter size={14} />}
            value={typeFilter}
            onChange={(v) => {
              if (v === 'all' || v === 'multiplier' || v === 'addition') setTypeFilter(v); else setTypeFilter('all');
            }}
            data={[{ value: 'all', label: 'الكل' }, { value: 'multiplier', label: 'مضاعف' }, { value: 'addition', label: 'إضافة ثابتة' }]}
          />
        </Group>

        <Divider />

        <div data-responsive="wide" data-wide-min="true">
          <Table stickyHeader highlightOnHover striped withRowBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>الفئة</Table.Th>
                <Table.Th>المفتاح</Table.Th>
                <Table.Th>النوع</Table.Th>
                <Table.Th>القيمة</Table.Th>
                <Table.Th>الحالة</Table.Th>
                <Table.Th>آخر تحديث</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((m) => (
                <Table.Tr key={`${m.category}:${m.key}`}>
                  <Table.Td>{m.category}</Table.Td>
                  <Table.Td>{m.key}</Table.Td>
                  <Table.Td>{m.type === 'multiplier' ? 'مضاعف' : 'إضافة ثابتة'}</Table.Td>
                  <Table.Td>{m.type === 'multiplier' ? <span dir="ltr">× {m.value}</span> : <span dir="ltr">{formatEN(m.value)}</span>}</Table.Td>
                  <Table.Td>
                    <Badge variant="light" color={m.isActive ? 'green' : 'gray'}>{m.isActive ? 'نشط' : 'موقّف'}</Badge>
                  </Table.Td>
                  <Table.Td>{formatDate(m.updatedAt)}</Table.Td>
                </Table.Tr>
              ))}
              {rows.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={6}><Text c="dimmed" ta="center">لا توجد نتائج</Text></Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </div>
      </Stack>
    </Card>
  );
}
