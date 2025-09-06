'use client';

import React, { useMemo, useState } from 'react';
import { Container, Stack, Group, Title, Text, Card, Badge, Table, Tabs, Button } from '@mantine/core';
import Link from 'next/link';

import { mockCreators } from '@/data/creators';
import { mockEquipment } from '@/data/equipment';
import { mockEquipmentRequests } from '@/data/equipmentRequests';
import { mockScheduleChangeRequests } from '@/data/schedule_requests';
import { mockCategoryChangeRequests } from '@/data/category_requests';
import { mockSubcategoryChangeRequests } from '@/data/subcategory_requests';

type PageProps = { params: { id: string } };

export default function CreatorProfilePage({ params }: PageProps){
  const creator = useMemo(() => mockCreators.find(c => c.id === params.id), [params.id]);
  const [equipmentRequests, setEqReq] = useState(() => mockEquipmentRequests.filter(r => r.creatorId === params.id));

  const creatorEquipment = useMemo(() => mockEquipment.filter(e => e.ownerId === params.id), [params.id]);
  const scheduleReqs = useMemo(() => mockScheduleChangeRequests.filter(r => r.creatorId === params.id), [params.id]);
  const categoryReqs = useMemo(() => mockCategoryChangeRequests.filter(r => r.creatorId === params.id), [params.id]);
  const subcategoryReqs = useMemo(() => mockSubcategoryChangeRequests.filter(r => r.creatorId === params.id), [params.id]);

  if (!creator) {
    return (
      <Container>
        <Stack>
          <Title order={2}>المبدع غير موجود</Title>
          <Button component={Link} href="/admin/users" variant="light">رجوع</Button>
        </Stack>
      </Container>
    );
  }

  const approveEq = (id: string) => setEqReq(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
  const rejectEq = (id: string) => setEqReq(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));

  return (
    <Container size="xl" className="admin-main" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" wrap="wrap">
          <Stack gap={2}>
            <Title order={1}>{creator.fullName}</Title>
            <Text c="dimmed">{creator.displayName || ''} — {creator.location?.city}</Text>
          </Stack>
          <Group gap="xs" wrap="wrap">
            {creator.isVerified && <Badge color="green" variant="light">موثّق</Badge>}
            <Badge variant="light" color="blue">{creator.experienceLevel}</Badge>
            <Badge variant="light" color="blue">{creator.equipmentTier}</Badge>
            <Badge variant="light" color={creator.isAvailable ? 'green' : 'gray'}>{creator.isAvailable ? 'متاح' : 'مشغول'}</Badge>
          </Group>
        </Group>

        <Card withBorder radius="md" data-density="compact">
          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview">نظرة عامة</Tabs.Tab>
              <Tabs.Tab value="equipment">المعدات</Tabs.Tab>
              <Tabs.Tab value="equipmentRequests">طلبات المعدات</Tabs.Tab>
              <Tabs.Tab value="schedule">طلبات الجدول</Tabs.Tab>
              <Tabs.Tab value="categories">طلبات الفئات</Tabs.Tab>
              <Tabs.Tab value="subcategories">طلبات الفرعية</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="overview" pt="md">
              <Stack gap="sm" data-responsive="wide" data-wide-min="true">
                <Table withRowBorders={false} striped>
                  <Table.Tbody>
                    <Table.Tr><Table.Th>الاسم</Table.Th><Table.Td>{creator.fullName}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Th>الاختصاصات</Table.Th><Table.Td>{creator.specialties.join('، ')}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Th>الخبرة</Table.Th><Table.Td>{creator.experienceLevel}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Th>المعدات</Table.Th><Table.Td>{creator.equipmentTier}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Th>المدينة</Table.Th><Table.Td>{creator.location?.city}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Th>مشاريع منجزة</Table.Th><Table.Td>{creator.completedProjects}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Th>تقييم</Table.Th><Table.Td>{creator.rating} / {creator.totalReviews}</Table.Td></Table.Tr>
                  </Table.Tbody>
                </Table>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="equipment" pt="md">
              <Stack gap="sm" data-responsive="wide" data-wide-min="true">
                <Title order={4}>المعدات المعتمدة</Title>
                <Table stickyHeader highlightOnHover withRowBorders={false} striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>النوع</Table.Th>
                      <Table.Th>الماركة/الموديل</Table.Th>
                      <Table.Th>الحالة</Table.Th>
                      <Table.Th>تاريخ الشراء</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {creatorEquipment.length === 0 ? (
                      <Table.Tr><Table.Td colSpan={4}><Text c="dimmed" ta="center">لا توجد معدات</Text></Table.Td></Table.Tr>
                    ) : creatorEquipment.map(eq => (
                      <Table.Tr key={eq.id}>
                        <Table.Td>{eq.type}</Table.Td>
                        <Table.Td>{eq.brand} {eq.model}</Table.Td>
                        <Table.Td>{eq.status}</Table.Td>
                        <Table.Td>{eq.purchaseDate || '-'}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="equipmentRequests" pt="md">
              <Stack gap="sm" data-responsive="wide" data-wide-min="true">
                <Title order={4}>طلبات المعدات</Title>
                <Table stickyHeader highlightOnHover withRowBorders={false} striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>النوع</Table.Th>
                      <Table.Th>الماركة/الموديل</Table.Th>
                      <Table.Th>الوصف</Table.Th>
                      <Table.Th>الحالة</Table.Th>
                      <Table.Th>إجراءات</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {equipmentRequests.length === 0 ? (
                      <Table.Tr><Table.Td colSpan={5}><Text c="dimmed" ta="center">لا توجد طلبات</Text></Table.Td></Table.Tr>
                    ) : equipmentRequests.map(req => (
                      <Table.Tr key={req.id}>
                        <Table.Td>{req.equipmentType}</Table.Td>
                        <Table.Td>{req.brand} {req.model}</Table.Td>
                        <Table.Td>{req.description || '-'}</Table.Td>
                        <Table.Td><Badge variant="light" color={req.status === 'approved' ? 'green' : req.status === 'rejected' ? 'red' : req.status === 'needs_info' ? 'yellow' : 'blue'}>{req.status}</Badge></Table.Td>
                        <Table.Td>
                          <Group gap="xs" justify="center">
                            <Button size="xs" variant="light" color="green" onClick={() => approveEq(req.id)}>موافقة</Button>
                            <Button size="xs" variant="light" color="red" onClick={() => rejectEq(req.id)}>رفض</Button>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="schedule" pt="md">
              <Stack gap="sm" data-responsive="wide" data-wide-min="true">
                <Title order={4}>طلبات الجدول</Title>
                <Table withRowBorders={false} striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>الأيام</Table.Th>
                      <Table.Th>الساعات</Table.Th>
                      <Table.Th>الحالة</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {scheduleReqs.length === 0 ? (
                      <Table.Tr><Table.Td colSpan={3}><Text c="dimmed" ta="center">لا توجد طلبات</Text></Table.Td></Table.Tr>
                    ) : scheduleReqs.map(r => (
                      <Table.Tr key={r.id}>
                        <Table.Td>{r.changes.days?.join(', ')}</Table.Td>
                        <Table.Td>{r.changes.startHour || ''} - {r.changes.endHour || ''}</Table.Td>
                        <Table.Td>{r.status}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="categories" pt="md">
              <Stack gap="sm" data-responsive="wide" data-wide-min="true">
                <Title order={4}>طلبات الفئات</Title>
                <Table withRowBorders={false} striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>الإجراء</Table.Th>
                      <Table.Th>الفئة</Table.Th>
                      <Table.Th>الحالة</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {categoryReqs.length === 0 ? (
                      <Table.Tr><Table.Td colSpan={3}><Text c="dimmed" ta="center">لا توجد طلبات</Text></Table.Td></Table.Tr>
                    ) : categoryReqs.map(r => (
                      <Table.Tr key={r.id}>
                        <Table.Td>{r.action}</Table.Td>
                        <Table.Td>{r.categoryId}</Table.Td>
                        <Table.Td>{r.status}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="subcategories" pt="md">
              <Stack gap="sm" data-responsive="wide" data-wide-min="true">
                <Title order={4}>طلبات الفئات الفرعية</Title>
                <Table withRowBorders={false} striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>الإجراء</Table.Th>
                      <Table.Th>الفئة الفرعية</Table.Th>
                      <Table.Th>الحالة</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {subcategoryReqs.length === 0 ? (
                      <Table.Tr><Table.Td colSpan={3}><Text c="dimmed" ta="center">لا توجد طلبات</Text></Table.Td></Table.Tr>
                    ) : subcategoryReqs.map(r => (
                      <Table.Tr key={r.id}>
                        <Table.Td>{r.action}</Table.Td>
                        <Table.Td>{r.subcategoryId}</Table.Td>
                        <Table.Td>{r.status}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Stack>
            </Tabs.Panel>

          </Tabs>
        </Card>
      </Stack>
    </Container>
  );
}
