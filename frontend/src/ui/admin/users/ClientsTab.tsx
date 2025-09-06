"use client";

import React, { useMemo, useState } from "react";
import { Card, Stack, Group, TextInput, Select, Table, Pagination, Text } from "@mantine/core";
import { Search } from "lucide-react";
import { mockClients } from "@/data/clients";
import { formatCurrencyIQD } from "@/shared/format";

export function ClientsTab(){
  const [q, setQ] = useState("");
  const [type, setType] = useState<string|"all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let L = mockClients.slice();
    const qq = q.trim().toLowerCase();
    if (qq) L = L.filter(c => (c.fullName + " " + (c.companyName||"") + " " + (c.location?.city||"")).toLowerCase().includes(qq));
    if (type !== 'all') L = L.filter(c => c.businessType === type);
    return L;
  }, [q, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/10));
  const pageItems = filtered.slice((page-1)*10, (page-1)*10+10);

  return (
    <Card withBorder radius="md" data-density="compact">
      <Stack gap="md">
        <Group gap="sm" wrap="wrap">
          <TextInput placeholder="بحث بالاسم/الشركة" leftSection={<Search size={14}/>} value={q} onChange={(e)=>{ setQ(e.currentTarget.value); setPage(1); }} style={{minWidth:220}}/>
          <Select placeholder="النوع" value={type} onChange={(v)=>{ setType((v as string|null)||'all'); setPage(1); }} data={[{value:'all',label:'الكل'},{value:'individual',label:'فرد'},{value:'company',label:'شركة'}]} style={{minWidth:140}}/>
        </Group>

        <Table stickyHeader highlightOnHover withRowBorders={false} striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>الاسم</Table.Th>
              <Table.Th>الشركة</Table.Th>
              <Table.Th>المدينة</Table.Th>
              <Table.Th>المشاريع</Table.Th>
              <Table.Th>الإنفاق</Table.Th>
              <Table.Th>التقييم</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pageItems.length===0 && (
              <Table.Tr><Table.Td colSpan={6}><Text c="dimmed" ta="center">لا توجد نتائج</Text></Table.Td></Table.Tr>
            )}
            {pageItems.map(c => (
              <Table.Tr key={c.id}>
                <Table.Td>{c.fullName}</Table.Td>
                <Table.Td>{c.companyName||'-'}</Table.Td>
                <Table.Td>{c.location?.city}</Table.Td>
                <Table.Td>{c.totalProjects}</Table.Td>
                <Table.Td style={{direction:'ltr'}}>{formatCurrencyIQD(c.totalSpent)}</Table.Td>
                <Table.Td>{c.rating}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Group justify="flex-end"><Pagination total={totalPages} value={page} onChange={setPage}/></Group>
      </Stack>
    </Card>
  );
}
