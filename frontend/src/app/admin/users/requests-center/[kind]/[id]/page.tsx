'use client';

import React, { useMemo, useState } from 'react';
import { Container, Stack, Group, Title, Text, Card, Badge, Button, Divider, Tabs, Textarea, Table } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

import { formatCurrencyIQD, formatDateEn } from '@/shared/format';

import { mockClientRegistrationRequests, type ClientRegistrationRequest } from '@/data/client_registrations';
import { mockCreatorJoinRequests, type CreatorJoinRequest } from '@/data/creator_requests';
import { mockEquipmentRequests } from '@/data/equipmentRequests';
import type { EquipmentRequest } from '@/data/types';
import { mockCategoryChangeRequests, type CategoryChangeRequest } from '@/data/category_requests';
import { mockSubcategoryChangeRequests, type SubcategoryChangeRequest } from '@/data/subcategory_requests';
import { mockScheduleChangeRequests, type ScheduleChangeRequest } from '@/data/schedule_requests';
import { mockProjectRequests } from '@/data/project_requests';
import type { ProjectRequest } from '@/data/types';

// نتجنب تعريف نوع PageProps المصدّر كي لا يتعارض مع أنواع Next المولّدة

type Kind = 'clients' | 'creators' | 'equipment' | 'categories' | 'subcategories' | 'schedules' | 'projectRequests';

const kindLabel: Record<Kind, string> = {
  clients: 'العملاء',
  creators: 'المبدعون',
  equipment: 'المعدات',
  categories: 'الفئات',
  subcategories: 'الفئات الفرعية',
  schedules: 'الجداول',
  projectRequests: 'طلبات المشاريع',
};

const statusLabel = (s: string) => ({
  pending: 'معلّق',
  approved: 'موافق',
  rejected: 'مرفوض',
  needs_info: 'يحتاج معلومات',
  pending_review: 'قيد المراجعة',
  reviewing: 'تحت المراجعة',
  converted_to_project: 'تحول لمشروع',
} as Record<string,string>)[s] ?? s;

type ByKind =
  | { kind: 'clients'; item: ClientRegistrationRequest }
  | { kind: 'creators'; item: CreatorJoinRequest }
  | { kind: 'equipment'; item: EquipmentRequest }
  | { kind: 'categories'; item: CategoryChangeRequest }
  | { kind: 'subcategories'; item: SubcategoryChangeRequest }
  | { kind: 'schedules'; item: ScheduleChangeRequest }
  | { kind: 'projectRequests'; item: ProjectRequest };

export default function RequestReviewPage(props: unknown){
  const { params } = props as { params: { kind: string; id: string } };
  const kind = params.kind as Kind;
  const id = params.id;

  const data: ByKind | null = useMemo(() => {
    switch (kind) {
      case 'clients': {
        const item = mockClientRegistrationRequests.find(r => r.id === id);
        return item ? { kind, item } : null;
      }
      case 'creators': {
        const item = mockCreatorJoinRequests.find(r => r.id === id);
        return item ? { kind, item } : null;
      }
      case 'equipment': {
        const item = (mockEquipmentRequests as EquipmentRequest[]).find(r => r.id === id);
        return item ? { kind, item } : null;
      }
      case 'categories': {
        const item = mockCategoryChangeRequests.find(r => r.id === id);
        return item ? { kind, item } : null;
      }
      case 'subcategories': {
        const item = mockSubcategoryChangeRequests.find(r => r.id === id);
        return item ? { kind, item } : null;
      }
      case 'schedules': {
        const item = mockScheduleChangeRequests.find(r => r.id === id);
        return item ? { kind, item } : null;
      }
      case 'projectRequests': {
        const item = (mockProjectRequests as ProjectRequest[]).find(r => r.id === id);
        return item ? { kind, item } : null;
      }
      default:
        return null;
    }
  }, [kind, id]);

  const [status, setStatus] = useState<string>(() => {
    if (!data) return 'pending';
    return data.item.status as string;
  });
  const [note, setNote] = useState('');
  const [events, setEvents] = useState<Array<{ at: string; action: 'approved'|'rejected'|'needs_info'|'converted'; note?: string }>>([]);

  if (!data) {
    return (
      <Container>
        <Stack>
          <Title order={2}>الطلب غير موجود</Title>
          <Button component={Link} href="/admin/users/requests-center" variant="light">رجوع لمركز الطلبات</Button>
        </Stack>
      </Container>
    );
  }

  const submittedAt: string | undefined = (() => {
    if (!data) return undefined;
    switch (data.kind) {
      case 'equipment':
      case 'projectRequests':
        return (data.item as EquipmentRequest | ProjectRequest).createdAt;
      default:
        return (data.item as ClientRegistrationRequest | CreatorJoinRequest | CategoryChangeRequest | SubcategoryChangeRequest | ScheduleChangeRequest).submittedAt;
    }
  })();

  const approve = () => {
    setStatus('approved');
    setEvents((e) => [...e, { at: new Date().toISOString(), action: 'approved', note: note || undefined }]);
    notifications.show({ message: 'تمت الموافقة على الطلب.', color: 'green' });
  };
  const reject = () => {
    setStatus('rejected');
    setEvents((e) => [...e, { at: new Date().toISOString(), action: 'rejected', note: note || undefined }]);
    notifications.show({ message: 'تم رفض الطلب.', color: 'red' });
  };
  const needInfo = () => {
    setStatus('needs_info');
    setEvents((e) => [...e, { at: new Date().toISOString(), action: 'needs_info', note: note || undefined }]);
    notifications.show({ message: 'تم طلب معلومات إضافية.', color: 'yellow' });
  };
  const convertToProjectLink = `/admin/projects/convert/${id}`;

  return (
    <Container>
      <Stack gap="lg">
        <Group justify="space-between" wrap="wrap">
          <Stack gap={4}>
            <Title order={2}>مراجعة طلب</Title>
            <Text c="dimmed">نوع: {kindLabel[kind]} — رقم: {id}</Text>
          </Stack>
          <Group gap="xs">
            <Button component={Link} href="/admin/users/requests-center" variant="default">رجوع</Button>
            <Badge variant="light" color={
              status === 'approved' ? 'green' : status === 'rejected' ? 'red' : status === 'needs_info' ? 'yellow' : 'blue'
            }>{statusLabel(status)}</Badge>
          </Group>
        </Group>

  <Card withBorder radius="md" data-density="compact">
          <Stack gap="sm">
            <Group justify="space-between" wrap="wrap">
              <Stack gap={2}>
                <Text><strong>التاريخ:</strong> {submittedAt ? formatDateEn(submittedAt) : '-'}</Text>
                {/* نبذة مختصرة حسب النوع */}
                {kind === 'clients' && (() => {
                  const i = (data.item as ClientRegistrationRequest);
                  return <Text><strong>مقدم الطلب:</strong> {i.fullName} — {i.companyName || 'فرد'}</Text>;
                })()}
                {kind === 'creators' && (() => {
                  const i = (data.item as CreatorJoinRequest);
                  return <Text><strong>المبدع:</strong> {i.creator.fullName} — {i.creator.experienceLevel}/{i.creator.equipmentTier}</Text>;
                })()}
                {kind === 'equipment' && (() => {
                  const i = (data.item as EquipmentRequest);
                  return <Text><strong>المعدة:</strong> {i.brand} {i.model} — {i.equipmentType}</Text>;
                })()}
                {kind === 'categories' && (() => {
                  const i = (data.item as CategoryChangeRequest);
                  return <Text><strong>التغيير:</strong> {i.action} {i.categoryId}</Text>;
                })()}
                {kind === 'subcategories' && (() => {
                  const i = (data.item as SubcategoryChangeRequest);
                  return <Text><strong>التغيير:</strong> {i.action} {i.subcategoryId}</Text>;
                })()}
                {kind === 'schedules' && (() => {
                  const i = (data.item as ScheduleChangeRequest);
                  const days = i.changes.days?.join(', ');
                  return <Text><strong>الجدول:</strong> {i.changes.startHour || ''} - {i.changes.endHour || ''} ({days})</Text>;
                })()}
                {kind === 'projectRequests' && (() => {
                  const i = (data.item as ProjectRequest);
                  return <Text><strong>العنوان:</strong> {i.title} — الميزانية {i.budget.min}-{i.budget.max}</Text>;
                })()}
              </Stack>
              <Group gap="xs">
                <Button variant="light" color="green" onClick={approve}>موافقة</Button>
                <Button variant="light" color="red" onClick={reject}>رفض</Button>
                <Button variant="light" color="yellow" onClick={needInfo}>معلومات</Button>
                {kind === 'projectRequests' && (
                  <Button component={Link} href={convertToProjectLink} variant="light" color="blue">تحويل لمشروع</Button>
                )}
              </Group>
            </Group>

            <Textarea
              placeholder="أضف ملاحظة تُسجل مع القرار (اختياري)"
              value={note}
              onChange={(e) => setNote(e.currentTarget.value)}
              autosize
              minRows={2}
            />

            <Divider />

            <Tabs defaultValue="details">
              <Tabs.List>
                <Tabs.Tab value="details">تفاصيل</Tabs.Tab>
                <Tabs.Tab value="history">السجل</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="details">
                <Stack gap="xs" mt="sm" data-responsive="wide" data-wide-min="true">
                  {/* تفاصيل نوعية: جدول بسيط كـ key/value لتجنب اللف بالموبايل */}
                  <Table withRowBorders={false} striped>
                    <Table.Tbody>
                      {kind === 'clients' && (() => {
                        const i = data.item as ClientRegistrationRequest;
                        return (
                          <>
                            <Table.Tr><Table.Th>النوع</Table.Th><Table.Td>عميل ({i.applicantType === 'company' ? 'شركة' : 'فرد'})</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الاسم</Table.Th><Table.Td>{i.fullName}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الشركة</Table.Th><Table.Td>{i.companyName || '-'}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الهاتف</Table.Th><Table.Td dir="ltr">{i.phone}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>المجال</Table.Th><Table.Td>{i.industryId || '-'}</Table.Td></Table.Tr>
                          </>
                        );
                      })()}

                      {kind === 'creators' && (() => {
                        const i = data.item as CreatorJoinRequest;
                        return (
                          <>
                            <Table.Tr><Table.Th>الاسم</Table.Th><Table.Td>{i.creator.fullName}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الخبرة/المعدات</Table.Th><Table.Td>{i.creator.experienceLevel}/{i.creator.equipmentTier}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>التخصصات</Table.Th><Table.Td>{i.creator.specialties?.join(', ')}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>المدينة</Table.Th><Table.Td>{i.creator.location?.city}</Table.Td></Table.Tr>
                          </>
                        );
                      })()}

                      {kind === 'equipment' && (() => {
                        const i = data.item as EquipmentRequest;
                        return (
                          <>
                            <Table.Tr><Table.Th>النوع</Table.Th><Table.Td>{i.equipmentType}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الماركة/الموديل</Table.Th><Table.Td>{i.brand} {i.model}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الوصف</Table.Th><Table.Td>{i.description || '-'}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>المبدع</Table.Th><Table.Td>{i.creatorId}</Table.Td></Table.Tr>
                          </>
                        );
                      })()}

                      {kind === 'categories' && (() => {
                        const i = data.item as CategoryChangeRequest;
                        return (
                          <>
                            <Table.Tr><Table.Th>المبدع</Table.Th><Table.Td>{i.creatorId}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الإجراء</Table.Th><Table.Td>{i.action}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الفئة</Table.Th><Table.Td>{i.categoryId}</Table.Td></Table.Tr>
                          </>
                        );
                      })()}

                      {kind === 'subcategories' && (() => {
                        const i = data.item as SubcategoryChangeRequest;
                        return (
                          <>
                            <Table.Tr><Table.Th>المبدع</Table.Th><Table.Td>{i.creatorId}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الإجراء</Table.Th><Table.Td>{i.action}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الفئة الفرعية</Table.Th><Table.Td>{i.subcategoryId}</Table.Td></Table.Tr>
                          </>
                        );
                      })()}

                      {kind === 'schedules' && (() => {
                        const i = data.item as ScheduleChangeRequest;
                        return (
                          <>
                            <Table.Tr><Table.Th>المبدع</Table.Th><Table.Td>{i.creatorId}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الأيام</Table.Th><Table.Td>{i.changes.days?.join(', ')}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الساعات</Table.Th><Table.Td>{i.changes.startHour || ''} - {i.changes.endHour || ''}</Table.Td></Table.Tr>
                          </>
                        );
                      })()}

                      {kind === 'projectRequests' && (() => {
                        const i = data.item as ProjectRequest;
                        return (
                          <>
                            <Table.Tr><Table.Th>العنوان</Table.Th><Table.Td>{i.title}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الوصف</Table.Th><Table.Td>{i.description}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الميزانية</Table.Th><Table.Td><span style={{direction:'ltr'}}>{formatCurrencyIQD(i.budget.min)}</span> - <span style={{direction:'ltr'}}>{formatCurrencyIQD(i.budget.max)}</span></Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>الموقع</Table.Th><Table.Td>{i.location}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>مستعجل</Table.Th><Table.Td>{i.isRush ? 'نعم' : 'لا'}</Table.Td></Table.Tr>
                            <Table.Tr><Table.Th>تاريخ التسليم</Table.Th><Table.Td>{formatDateEn(i.preferredDeliveryDate)}</Table.Td></Table.Tr>
                          </>
                        );
                      })()}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="history">
                <Stack gap="xs" mt="sm" data-responsive="wide" data-wide-min="true">
                  {events.length === 0 ? (
                    <Text c="dimmed">لا توجد أحداث بعد.</Text>
                  ) : (
                    <Table withRowBorders={false} striped>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>الوقت</Table.Th>
                          <Table.Th>الحدث</Table.Th>
                          <Table.Th>ملاحظة</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {events.map((e, idx) => (
                          <Table.Tr key={idx}>
                            <Table.Td>{formatDateEn(e.at)}</Table.Td>
                            <Table.Td>
                              <Badge variant="light" color={e.action === 'approved' ? 'green' : e.action === 'rejected' ? 'red' : e.action === 'needs_info' ? 'yellow' : 'blue'}>
                                {e.action === 'approved' ? 'موافقة' : e.action === 'rejected' ? 'رفض' : e.action === 'needs_info' ? 'طلب معلومات' : 'تحويل لمشروع'}
                              </Badge>
                            </Table.Td>
                            <Table.Td>{e.note || '-'}</Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  )}
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
