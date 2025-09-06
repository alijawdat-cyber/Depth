"use client";

import React, { useMemo, useState } from "react";
import { Card, Stack, Group, TextInput, Select, Table, Badge, Pagination, Text, ActionIcon, Tooltip } from "@mantine/core";
import { Search, Eye } from "lucide-react";
import Link from "next/link";
import { mockCreators } from "@/data/creators";

export function CreatorsTab(){
  const [q, setQ] = useState("");
  type Specialty = 'photo' | 'video' | 'design' | 'editing' | 'all';
  type Level = 'fresh' | 'experienced' | 'expert' | 'all';
  type Tier = 'silver' | 'gold' | 'platinum' | 'all';
  type City = string | 'all';
  const [specialty, setSpecialty] = useState<Specialty>('all');
  const [level, setLevel] = useState<Level>('all');
  const [tier, setTier] = useState<Tier>('all');
  const [city, setCity] = useState<City>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let L = mockCreators.slice();
    const qq = q.trim().toLowerCase();
    if (qq) L = L.filter(c => (c.fullName + " " + (c.displayName||"") + " " + (c.location?.city||"")).toLowerCase().includes(qq));
  if (specialty !== 'all') L = L.filter(c => c.specialties.includes(specialty as Exclude<Specialty,'all'>));
    if (level !== "all") L = L.filter(c => c.experienceLevel === level);
    if (tier !== "all") L = L.filter(c => c.equipmentTier === tier);
    if (city !== "all") L = L.filter(c => c.location?.city === city);
    return L;
  }, [q, specialty, level, tier, city]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/10));
  const pageItems = filtered.slice((page-1)*10, (page-1)*10 + 10);

  const cities = Array.from(new Set(mockCreators.map(c => c.location?.city).filter(Boolean))) as string[];

  return (
    <Card withBorder radius="md" data-density="compact">
      <Stack gap="md">
        <Group gap="sm" wrap="wrap">
          <TextInput placeholder="بحث بالاسم/المدينة" leftSection={<Search size={14}/>} value={q} onChange={(e)=>{ setQ(e.currentTarget.value); setPage(1); }} style={{minWidth:220}}/>
          <Select placeholder="الاختصاص" value={specialty} onChange={(v)=>{ setSpecialty((v as Specialty) ?? 'all'); setPage(1); }} data={[{value:'all',label:'الكل'},{value:'photo',label:'تصوير'},{value:'video',label:'فيديو'},{value:'design',label:'تصميم'},{value:'editing',label:'مونتاج'}]} style={{minWidth:160}}/>
          <Select placeholder="الخبرة" value={level} onChange={(v)=>{ setLevel((v as Level) ?? 'all'); setPage(1); }} data={[{value:'all',label:'الكل'},{value:'fresh',label:'مبتدئ'},{value:'experienced',label:'متوسط'},{value:'expert',label:'خبير'}]} style={{minWidth:140}}/>
          <Select placeholder="المعدات" value={tier} onChange={(v)=>{ setTier((v as Tier) ?? 'all'); setPage(1); }} data={[{value:'all',label:'الكل'},{value:'silver',label:'Silver'},{value:'gold',label:'Gold'},{value:'platinum',label:'Platinum'}]} style={{minWidth:140}}/>
          <Select placeholder="المدينة" value={city} onChange={(v)=>{ setCity((v as City) ?? 'all'); setPage(1); }} data={[{value:'all',label:'الكل'}, ...cities.map(c=>({value:c,label:c}))]} style={{minWidth:140}}/>
        </Group>

        <Stack gap="sm" data-responsive="wide" data-wide-min="true">
          <Table stickyHeader highlightOnHover withRowBorders={false} striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>الاسم</Table.Th>
                <Table.Th>الاختصاص</Table.Th>
                <Table.Th>الخبرة</Table.Th>
                <Table.Th>المعدات</Table.Th>
                <Table.Th>المدينة</Table.Th>
                <Table.Th>الحالة</Table.Th>
                <Table.Th>إجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pageItems.length===0 && (
                <Table.Tr>
                  <Table.Td colSpan={7}><Text c="dimmed" ta="center">لا توجد نتائج</Text></Table.Td>
                </Table.Tr>
              )}
              {pageItems.map(c => (
                <Table.Tr key={c.id}>
                  <Table.Td>{c.fullName}</Table.Td>
                  <Table.Td>{c.specialties.join("، ")}</Table.Td>
                  <Table.Td>{c.experienceLevel}</Table.Td>
                  <Table.Td>{c.equipmentTier}</Table.Td>
                  <Table.Td>{c.location?.city}</Table.Td>
                  <Table.Td>
                    <Group gap={6} justify="center">
                      {c.isVerified && <Badge color="green" variant="light">موثّق</Badge>}
                      <Badge color={c.onboardingStatus==='approved'?'green':'blue'} variant="light">{c.onboardingStatus}</Badge>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <Tooltip label="عرض" withArrow>
                        <ActionIcon component={Link} href={`/admin/users/creators/${c.id}`} variant="light" size="sm" aria-label="عرض"><Eye size={16}/></ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Group justify="flex-end">
            <Pagination total={totalPages} value={page} onChange={setPage}/>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}
