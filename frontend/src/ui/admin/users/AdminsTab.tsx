"use client";

import React, { useMemo, useState } from "react";
import { Card, Stack, Group, TextInput, Select, Table, Badge, Pagination, Text } from "@mantine/core";
import { Search } from "lucide-react";
import { mockAdmins } from "@/data/admins";
import { formatDateEn } from "@/shared/format";

export function AdminsTab(){
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<string|"all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(()=>{
    let L = mockAdmins.slice();
    const qq = q.trim().toLowerCase();
    if (qq) L = L.filter(a => (a.fullName + " " + a.phone).toLowerCase().includes(qq));
    if (level !== 'all') L = L.filter(a => a.adminLevel === level);
    return L;
  },[q, level]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/10));
  const pageItems = filtered.slice((page-1)*10, (page-1)*10+10);

  return (
    <Card withBorder radius="md" data-density="compact">
      <Stack gap="md">
        <Group gap="sm" wrap="wrap">
          <TextInput placeholder="بحث بالاسم/الهاتف" leftSection={<Search size={14}/>} value={q} onChange={(e)=>{ setQ(e.currentTarget.value); setPage(1); }} style={{minWidth:220}}/>
          <Select placeholder="المستوى" value={level} onChange={(v)=>{ setLevel((v as string|null)||'all'); setPage(1); }} data={[{value:'all',label:'الكل'},{value:'super_admin',label:'Super Admin'},{value:'admin',label:'Admin'}]} style={{minWidth:160}}/>
        </Group>

        <Table stickyHeader highlightOnHover withRowBorders={false} striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>الاسم</Table.Th>
              <Table.Th>الهاتف</Table.Th>
              <Table.Th>الصلاحيات</Table.Th>
              <Table.Th>نشط</Table.Th>
              <Table.Th>آخر دخول</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pageItems.length===0 && (<Table.Tr><Table.Td colSpan={5}><Text c="dimmed" ta="center">لا توجد نتائج</Text></Table.Td></Table.Tr>)}
            {pageItems.map(a => (
              <Table.Tr key={a.id}>
                <Table.Td>{a.fullName}</Table.Td>
                <Table.Td>{a.phone}</Table.Td>
                <Table.Td>
                  <Group gap={6}>
                    {a.permissions.canManageUsers && <Badge variant="light">Users</Badge>}
                    {a.permissions.canManageProjects && <Badge variant="light">Projects</Badge>}
                    {a.permissions.canManagePayments && <Badge variant="light">Payments</Badge>}
                    {a.permissions.canViewReports && <Badge variant="light">Reports</Badge>}
                    {a.permissions.canManageSettings && <Badge variant="light">Settings</Badge>}
                    {a.permissions.canManageAdmins && <Badge variant="light">Admins</Badge>}
                  </Group>
                </Table.Td>
                <Table.Td>{a.isActive ? 'نعم' : 'لا'}</Table.Td>
                <Table.Td>{a.lastLoginAt? formatDateEn(a.lastLoginAt): '-'}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Group justify="flex-end"><Pagination total={totalPages} value={page} onChange={setPage}/></Group>
      </Stack>
    </Card>
  );
}
