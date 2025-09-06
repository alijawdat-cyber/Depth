'use client';

import React, { useMemo, useState } from 'react';
import { formatDateEn } from '@/shared/format';
import { Container, Stack, Group, Title, Text, Divider, Card, Table, TextInput, Select, Pagination, Badge, Modal, Button, Tabs, ActionIcon, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Search, Filter, LayoutGrid, Eye } from 'lucide-react';
import Link from 'next/link';

import { mockClientRegistrationRequests } from '@/data/client_registrations';
import { mockCreatorJoinRequests } from '@/data/creator_requests';
import { mockEquipmentRequests } from '@/data/equipmentRequests';
import { mockCategoryChangeRequests } from '@/data/category_requests';
import { mockSubcategoryChangeRequests } from '@/data/subcategory_requests';
import { mockScheduleChangeRequests } from '@/data/schedule_requests';
import { mockProjectRequests } from '@/data/project_requests';

type Unified = {
  kind: 'clients' | 'creators' | 'equipment' | 'categories' | 'subcategories' | 'schedules' | 'projectRequests';
  id: string;
  submittedAt: string;
  status: string;
  primaryInfo: string;
  extra?: string;
};

const statusMapByKind: Record<Unified['kind'], string[]> = {
  clients: ['pending','approved','rejected','needs_info'],
  creators: ['pending','approved','rejected','needs_info'],
  equipment: ['pending','approved','rejected','needs_info'],
  categories: ['pending','approved','rejected'],
  subcategories: ['pending','approved','rejected'],
  schedules: ['pending','approved','rejected'],
  projectRequests: ['pending_review','reviewing','approved','rejected','converted_to_project'],
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

const kindLabel = (k: Unified['kind']) => ({
  clients: 'العملاء',
  creators: 'المبدعون',
  equipment: 'المعدات',
  categories: 'الفئات',
  subcategories: 'الفئات الفرعية',
  schedules: 'الجداول',
  projectRequests: 'طلبات المشاريع',
} as Record<Unified['kind'], string>)[k];

export function RequestsCenter() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState('');
  const [modalKind, setModalKind] = useState<'reject' | 'needs_info' | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(() => ({
    clients: mockClientRegistrationRequests.length,
    creators: mockCreatorJoinRequests.length,
    equipment: mockEquipmentRequests.length,
    categories: mockCategoryChangeRequests.length,
    subcategories: mockSubcategoryChangeRequests.length,
    schedules: mockScheduleChangeRequests.length,
    projectRequests: mockProjectRequests.length,
  }), []);

  const allCount = Object.values(counts).reduce((a, b) => a + b, 0);

  const initialUnified: Unified[] = useMemo(() => {
    const L: Unified[] = [];
    for (const r of mockClientRegistrationRequests) {
      L.push({
        kind: 'clients', id: r.id, submittedAt: r.submittedAt, status: r.status,
        primaryInfo: `${r.fullName} — ${r.applicantType === 'company' ? (r.companyName || 'شركة') : 'فرد'}`,
        extra: r.industryId ? `industry: ${r.industryId}` : undefined,
      });
    }
    for (const r of mockCreatorJoinRequests) {
      L.push({
        kind: 'creators', id: r.id, submittedAt: r.submittedAt, status: r.status,
        primaryInfo: `${r.creator.fullName} — ${r.creator.experienceLevel}/${r.creator.equipmentTier}`,
        extra: r.creator.location?.city ? `@${r.creator.location.city}` : undefined,
      });
    }
    for (const r of mockEquipmentRequests) {
      L.push({
        kind: 'equipment', id: r.id, submittedAt: r.createdAt, status: r.status,
        primaryInfo: `${r.equipmentType} — ${r.brand} ${r.model}`,
        extra: r.creatorId,
      });
    }
    for (const r of mockCategoryChangeRequests) {
      L.push({
        kind: 'categories', id: r.id, submittedAt: r.submittedAt, status: r.status,
        primaryInfo: `${r.creatorId} — ${r.action} ${r.categoryId}`,
      });
    }
    for (const r of mockSubcategoryChangeRequests) {
      L.push({
        kind: 'subcategories', id: r.id, submittedAt: r.submittedAt, status: r.status,
        primaryInfo: `${r.creatorId} — ${r.action} ${r.subcategoryId}`,
      });
    }
    for (const r of mockScheduleChangeRequests) {
      L.push({
        kind: 'schedules', id: r.id, submittedAt: r.submittedAt, status: r.status,
        primaryInfo: `${r.creatorId} — ${r.changes.startHour || ''}-${r.changes.endHour || ''}`,
        extra: r.changes.days?.join(', '),
      });
    }
    for (const r of mockProjectRequests) {
      L.push({
        kind: 'projectRequests', id: r.id, submittedAt: r.createdAt, status: r.status,
        primaryInfo: `${r.title} — budget ${r.budget.min}-${r.budget.max}`,
        extra: r.preferredDeliveryDate,
      });
    }
    return L;
  }, []);

  const [items, setItems] = useState<Unified[]>(initialUnified);

  const filtered = useMemo(() => {
    let list = items;
    if (type !== 'all') list = list.filter(i => i.kind === type);
    if (status !== 'all') list = list.filter(i => i.status === status);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter(i => (i.primaryInfo + ' ' + (i.extra || '') + ' ' + i.id).toLowerCase().includes(q));
    return list;
  }, [items, type, status, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const pageSafe = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (pageSafe - 1) * 10;
    return filtered.slice(start, start + 10);
  }, [filtered, pageSafe]);

  const openModal = (kind: 'reject' | 'needs_info', id: string) => { setSelectedId(id); setModalKind(kind); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setModalReason(''); setSelectedId(null); setModalKind(null); };
  const confirmModal = () => {
    if (!selectedId || !modalKind) return closeModal();
    const newStatus = modalKind === 'reject' ? 'rejected' : 'needs_info';
    setItems(prev => prev.map(it => it.id === selectedId ? { ...it, status: newStatus, extra: modalReason ? `${it.extra ? it.extra + ' — ' : ''}سبب: ${modalReason}` : it.extra } : it));
    notifications.show({ message: modalKind === 'reject' ? 'تم رفض الطلب.' : 'تم طلب معلومات إضافية.', color: modalKind === 'reject' ? 'red' : 'yellow' });
    closeModal();
  };
  const onApprove = (id: string) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, status: 'approved' } : it));
    notifications.show({ message: 'تمت الموافقة على الطلب.', color: 'green' });
  };

  return (
    <Container size="xl" className="admin-main" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={1} size="xl">مركز الطلبات</Title>
            <Text c="dimmed" size="sm">عرض موحد لكل الطلبات المعلقة/المفتوحة</Text>
          </Stack>
          <Group gap="xs" wrap="wrap">
            <Badge variant="light" color="blue" title="إجمالي">الكل: {allCount}</Badge>
            <Badge variant="light" color="green" title="عملاء">عملاء: {counts.clients}</Badge>
            <Badge variant="light" color="green" title="مبدعون">مبدعون: {counts.creators}</Badge>
            <Badge variant="light" color="green" title="معدات">معدات: {counts.equipment}</Badge>
            <Badge variant="light" color="green" title="فئات رئيسية">فئات: {counts.categories}</Badge>
            <Badge variant="light" color="green" title="فئات فرعية">فرعية: {counts.subcategories}</Badge>
            <Badge variant="light" color="green" title="جدول">جداول: {counts.schedules}</Badge>
            <Badge variant="light" color="green" title="طلبات مشاريع">مشاريع: {counts.projectRequests}</Badge>
          </Group>
        </Group>

        <Card withBorder radius="md" data-density="compact" data-toolbar="true">
          <Stack gap="md">
            <Group gap="sm" wrap="wrap" data-role="toolbar">
              <TextInput
                placeholder="بحث بالاسم/العنوان/الكود"
                leftSection={<Search size={14} />}
                value={query}
                onChange={(e) => { setQuery(e.currentTarget.value); setPage(1); }}
                style={{ minWidth: 240 }}
              />

              <Select
                placeholder="نوع الطلب"
                leftSection={<LayoutGrid size={14} />}
                value={type}
                onChange={(v: string | null) => { setType(v ?? 'all'); setPage(1); }}
                data={[
                  { value: 'all', label: 'الكل' },
                  { value: 'clients', label: 'طلبات العملاء' },
                  { value: 'creators', label: 'طلبات المبدعين' },
                  { value: 'equipment', label: 'طلبات المعدات' },
                  { value: 'categories', label: 'طلبات الفئات' },
                  { value: 'subcategories', label: 'طلبات الفئات الفرعية' },
                  { value: 'schedules', label: 'طلبات الجداول' },
                  { value: 'projectRequests', label: 'طلبات المشاريع' },
                ]}
                style={{ minWidth: 200 }}
              />

              <Select
                placeholder="الحالة"
                leftSection={<Filter size={14} />}
                value={status}
                onChange={(v: string | null) => { setStatus(v ?? 'all'); setPage(1); }}
                data={useMemo(() => {
                  if (type === 'all') return [
                    { value: 'all', label: 'الكل' },
                    { value: 'pending', label: 'معلّق' },
                    { value: 'approved', label: 'موافق' },
                    { value: 'rejected', label: 'مرفوض' },
                    { value: 'needs_info', label: 'يحتاج معلومات' },
                    { value: 'pending_review', label: 'قيد المراجعة (مشاريع)' },
                    { value: 'reviewing', label: 'تحت المراجعة (مشاريع)' },
                    { value: 'converted_to_project', label: 'تحول لمشروع' },
                  ];
                  return [ { value: 'all', label: 'الكل' }, ...statusMapByKind[type as keyof typeof statusMapByKind].map(s => ({ value: s, label: s })) ];
                }, [type])}
                style={{ minWidth: 200 }}
              />
            </Group>

            <Divider />

            <Tabs value={type} onChange={(v) => setType(v as string)}>
              <Tabs.List>
                <Tabs.Tab value="all">الكل</Tabs.Tab>
                <Tabs.Tab value="clients">العملاء</Tabs.Tab>
                <Tabs.Tab value="creators">المبدعون</Tabs.Tab>
                <Tabs.Tab value="equipment">المعدات</Tabs.Tab>
                <Tabs.Tab value="categories">الفئات</Tabs.Tab>
                <Tabs.Tab value="subcategories">الفرعية</Tabs.Tab>
                <Tabs.Tab value="schedules">الجداول</Tabs.Tab>
                <Tabs.Tab value="projectRequests">طلبات المشاريع</Tabs.Tab>
              </Tabs.List>
            </Tabs>

            <Stack gap="sm" data-responsive="wide" data-wide-min="true">
              <Table stickyHeader highlightOnHover withRowBorders={false} striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>النوع</Table.Th>
                    <Table.Th>التفاصيل</Table.Th>
                    <Table.Th data-cell="date">تاريخ التقديم</Table.Th>
                    <Table.Th>الحالة</Table.Th>
                    <Table.Th>إجراءات</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {pageSlice.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={5}>
                        <Text c="dimmed" ta="center">لا توجد طلبات مطابقة</Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                  {pageSlice.map((row) => (
                    <Table.Tr key={row.id}>
                      <Table.Td>{kindLabel(row.kind)}</Table.Td>
                      <Table.Td>{row.primaryInfo}{row.extra ? ` — ${row.extra}` : ''}</Table.Td>
                      <Table.Td data-cell="date">{formatDateEn(row.submittedAt)}</Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={
                            row.status === 'approved' ? 'green' :
                            row.status === 'rejected' ? 'red' :
                            row.status === 'needs_info' ? 'yellow' :
                            row.status === 'converted_to_project' ? 'teal' :
                            'blue'
                          }
                        >{statusLabel(row.status)}</Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" justify="center">
                          <Tooltip label="عرض التفاصيل" withArrow>
                            <ActionIcon component={Link} href={`/admin/users/requests-center/${row.kind}/${row.id}`} variant="light" color="blue" size="sm" aria-label="تفاصيل">
                              <Eye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Button variant="light" color="green" size="xs" onClick={() => onApprove(row.id)}>موافقة</Button>
                          <Button variant="light" color="red" size="xs" onClick={() => openModal('reject', row.id)}>رفض</Button>
                          <Button variant="light" color="yellow" size="xs" onClick={() => openModal('needs_info', row.id)}>معلومات</Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Group justify="flex-end">
                <Pagination total={totalPages} value={pageSafe} onChange={setPage} />
              </Group>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      <Modal opened={modalOpen} onClose={closeModal} title={modalKind === 'needs_info' ? 'طلب معلومات إضافية' : 'سبب الرفض'} centered>
        <Stack gap="sm">
          <Text size="sm">اكتب ملاحظة مختصرة تبقى بسجل الطلب.</Text>
          <TextInput value={modalReason} onChange={(e) => setModalReason(e.currentTarget.value)} placeholder={modalKind === 'needs_info' ? 'اذكر شنو تحتاج من معلومات' : 'سبب الرفض'} />
          <Group justify="flex-end">
            <Button variant="light" color="gray" onClick={closeModal}>إلغاء</Button>
            <Button variant="filled" color={modalKind === 'needs_info' ? 'yellow' : 'red'} onClick={confirmModal} disabled={!modalReason.trim()}>
              {modalKind === 'needs_info' ? 'إرسال الطلب' : 'تأكيد الرفض'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
