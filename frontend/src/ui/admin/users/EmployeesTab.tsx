"use client";

import React, { useMemo, useState } from "react";
import { Card, Stack, Group, TextInput, Select, Table, Pagination, Text } from "@mantine/core";
import { Search } from "lucide-react";
import { mockSalariedEmployees } from "@/data";
import { formatCurrencyIQD, formatDateEn } from "@/shared/format";

export function EmployeesTab(){
  const [q, setQ] = useState("");
  const [dept, setDept] = useState<string|"all">("all");
  const [type, setType] = useState<string|"all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(()=>{
    let L = mockSalariedEmployees.slice();
    const qq = q.trim().toLowerCase();
    if (qq) L = L.filter((e) => (e.fullName + " " + e.jobTitle).toLowerCase().includes(qq));
    if (dept !== 'all') L = L.filter((e) => e.department === dept);
    if (type !== 'all') L = L.filter((e) => e.employmentType === type);
    return L;
  },[q, dept, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/10));
  const pageItems = filtered.slice((page-1)*10, (page-1)*10+10);

  return (
    <Card withBorder radius="md" data-density="compact">
      <Stack gap="md">
        <Group gap="sm" wrap="wrap">
          <TextInput placeholder="بحث بالاسم/المسمى" leftSection={<Search size={14}/>} value={q} onChange={(e)=>{ setQ(e.currentTarget.value); setPage(1); }} style={{minWidth:220}}/>
          <Select placeholder="القسم" value={dept} onChange={(v)=>{ setDept((v as string|null)||'all'); setPage(1); }} data={[{value:'all',label:'الكل'},{value:'photography',label:'تصوير'},{value:'videography',label:'فيديو'},{value:'design',label:'تصميم'},{value:'editing',label:'مونتاج'},{value:'admin',label:'إداري'}]} style={{minWidth:160}}/>
          <Select placeholder="نمط التوظيف" value={type} onChange={(v)=>{ setType((v as string|null)||'all'); setPage(1); }} data={[{value:'all',label:'الكل'},{value:'full_time',label:'دوام كامل'},{value:'part_time',label:'جزئي'},{value:'contract',label:'عقد'}]} style={{minWidth:160}}/>
        </Group>

        <Table stickyHeader highlightOnHover withRowBorders={false} striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>الاسم</Table.Th>
              <Table.Th>القسم</Table.Th>
              <Table.Th>المسمى</Table.Th>
              <Table.Th>الراتب</Table.Th>
              <Table.Th>البداية</Table.Th>
              <Table.Th>نشط</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pageItems.length===0 && (<Table.Tr><Table.Td colSpan={6}><Text c="dimmed" ta="center">لا توجد نتائج</Text></Table.Td></Table.Tr>)}
            {pageItems.map((e) => (
              <Table.Tr key={e.id}>
                <Table.Td>{e.fullName}</Table.Td>
                <Table.Td>{e.department}</Table.Td>
                <Table.Td>{e.jobTitle}</Table.Td>
                <Table.Td style={{direction:'ltr'}}>{formatCurrencyIQD(e.monthlySalary)}</Table.Td>
                <Table.Td>{formatDateEn(e.startDate)}</Table.Td>
                <Table.Td>{e.isActive ? 'نعم' : 'لا'}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Group justify="flex-end"><Pagination total={totalPages} value={page} onChange={setPage}/></Group>
      </Stack>
    </Card>
  );
}
