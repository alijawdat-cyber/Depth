'use client';

import React, { useMemo, useState } from 'react';
import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  Divider,
  Card,
  Table,
  TextInput,
  Select,
  Button,
  Modal,
  NumberInput,
  Switch,
  Badge,
  Menu,
  ActionIcon,
  Pagination,
  MultiSelect,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Edit, MoreHorizontal, Search, Filter, Layers } from 'lucide-react';
import { mockData } from '@/data';
import type { Subcategory, Category, Industry } from '@/data/types';
import { formatDateEn, formatNumber } from '@/shared/format';
import CollapsedBadges from '@/ui/components/CollapsedBadges';

type StatusFilter = 'all' | 'active' | 'inactive';

// شكل التحرير للمابينغ
type MappingForm = {
  subcategoryId: string;
  industryIds: string[];
  isActive: boolean;
};

const pageSizeDefault = 10;

function formatDate(dateIso: string) { try { return formatDateEn(dateIso); } catch { return dateIso; } }
function formatEN(n: number) { return formatNumber(n); }

export default function AdminMappingsPage() {
  const [subcategories] = useState<Subcategory[]>(() => [...mockData.subcategories]);
  const [categories] = useState<Category[]>(() => [...mockData.categories]);
  const [industries] = useState<Industry[]>(() => [...mockData.industries]);

  const [mappings, setMappings] = useState(() => [...mockData.subcategoryIndustryMappings]);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MappingForm | null>(null);

  const categoryOptions = useMemo(() => [
    { value: 'all', label: 'كل الفئات' },
    ...categories.map((c) => ({ value: c.id, label: c.nameAr }))
  ], [categories]);

  const indOptions = useMemo(() => industries.map((i) => ({ value: i.id, label: i.nameAr })), [industries]);

  // قواميس سريعة
  const catById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const indById = useMemo(() => Object.fromEntries(industries.map((i) => [i.id, i])), [industries]);
  const mappingBySubId = useMemo(() => Object.fromEntries(mappings.map((m) => [m.subcategoryId, m])), [mappings]);

  const filteredSubs = useMemo(() => {
    const s = search.trim().toLowerCase();
    return subcategories
      .filter((sc) => categoryFilter === 'all' ? true : sc.categoryId === categoryFilter)
      .filter((sc) => {
        if (status === 'all') return true;
        const m = mappingBySubId[sc.id];
        return status === 'active' ? m?.isActive === true : m?.isActive === false;
      })
      .filter((sc) => s === '' || sc.nameAr.toLowerCase().includes(s) || sc.nameEn.toLowerCase().includes(s) || sc.code.toLowerCase().includes(s))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [subcategories, categoryFilter, status, search, mappingBySubId]);

  const totalPages = Math.max(1, Math.ceil(filteredSubs.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return filteredSubs.slice(start, start + pageSize);
  }, [filteredSubs, pageSafe, pageSize]);

  const catName = (id: string) => catById[id]?.nameAr ?? '—';
  const indName = (id: string) => indById[id]?.nameAr ?? id;

  // فتح محرر مابينغ
  const openEdit = (subcategoryId: string) => {
    const current = mappingBySubId[subcategoryId];
    const uniq = Array.from(new Set(current?.industryIds ?? []));
    setEditing({ subcategoryId, industryIds: uniq, isActive: current?.isActive ?? true });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const saveEditing = () => {
    if (!editing) return;
    const nowIso = new Date().toISOString();
    const uniq = Array.from(new Set(editing.industryIds));
    const exists = mappings.find((m) => m.subcategoryId === editing.subcategoryId);
    if (exists) {
      setMappings((prev) => prev.map((m) => m.subcategoryId === editing.subcategoryId
        ? { ...m, industryIds: uniq, isActive: editing.isActive, updatedAt: nowIso }
        : m
      ));
      notifications.show({ color: 'green', message: 'تم حفظ الربط' });
    } else {
      setMappings((prev) => [
        ...prev,
        {
          subcategoryId: editing.subcategoryId,
          industryIds: uniq,
          isActive: editing.isActive,
          createdAt: nowIso,
          updatedAt: nowIso,
        },
      ]);
      notifications.show({ color: 'green', message: 'تم إنشاء ربط جديد' });
    }
    closeModal();
  };

  const toggleActive = (subcategoryId: string) => {
    const nowIso = new Date().toISOString();
    const current = mappingBySubId[subcategoryId];
    if (!current) return; // لا شيء
    setMappings((prev) => prev.map((m) => m.subcategoryId === subcategoryId ? { ...m, isActive: !m.isActive, updatedAt: nowIso } : m));
  };

  return (
    <Container size="xl" className="admin-main" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={1} size="xl">ربط الفئات الفرعية بالمجالات</Title>
            <Text c="dimmed" size="sm">إدارة الصناعات المسموحة لكل فئة فرعية</Text>
          </Stack>
        </Group>

        <Card withBorder radius="md" data-density="compact" data-toolbar="true">
          <Stack gap="md">
            <Group gap="sm" wrap="wrap" data-role="toolbar">
              <TextInput
                placeholder="بحث بالاسم أو الكود"
                leftSection={<Search size={14} />}
                value={search}
                onChange={(e) => { setSearch(e.currentTarget.value); setPage(1); }}
                style={{ minWidth: 240 }}
              />
              <Select
                placeholder="كل الحالات"
                leftSection={<Filter size={14} />}
                value={status}
                onChange={(v: string | null) => { setStatus((v as StatusFilter) ?? 'all'); setPage(1); }}
                data={[
                  { value: 'all', label: 'الكل' },
                  { value: 'active', label: 'نشط' },
                  { value: 'inactive', label: 'موقّف' },
                ]}
                style={{ minWidth: 160 }}
              />
              <Select
                placeholder="كل الفئات"
                leftSection={<Layers size={14} />}
                value={categoryFilter}
                onChange={(v: string | null) => { setCategoryFilter(v ?? 'all'); setPage(1); }}
                data={categoryOptions}
                style={{ minWidth: 200 }}
              />
            </Group>

            <Divider />

            {/* غلاف تمرير أفقي خاص بالجدول فقط */}
            <div data-responsive="wide" data-wide-min="true">
              <Table stickyHeader highlightOnHover withRowBorders={false} striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>الفئة الفرعية</Table.Th>
                    <Table.Th>الفئة الرئيسية</Table.Th>
                    <Table.Th data-cell="code">الكود</Table.Th>
                    <Table.Th>المجالات المرتبطة</Table.Th>
                    <Table.Th data-cell="num">عدد المجالات</Table.Th>
                    <Table.Th>الحالة</Table.Th>
                    <Table.Th data-cell="date">أُنشئ الربط</Table.Th>
                    <Table.Th data-cell="date">آخر تحديث</Table.Th>
                    <Table.Th>إجراءات</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {pageSlice.map((sc) => {
                    const map = mappingBySubId[sc.id];
                    const inds = Array.from(new Set(map?.industryIds ?? []));
                    return (
                      <Table.Tr key={sc.id}>
                        <Table.Td>{sc.nameAr}</Table.Td>
                        <Table.Td>{catName(sc.categoryId)}</Table.Td>
                        <Table.Td data-cell="code">{sc.code}</Table.Td>
                        <Table.Td>
                          {inds.length > 0 ? (
                            <CollapsedBadges items={inds.map((iid) => ({ id: iid, label: indName(iid) }))} maxVisible={3} color="blue" />
                          ) : (
                            <Text c="dimmed" size="sm">—</Text>
                          )}
                        </Table.Td>
                        <Table.Td data-cell="num"><span dir="ltr">{formatEN(inds.length)}</span></Table.Td>
                        <Table.Td>
                          {map ? (
                            <Group gap="xs">
                              <Badge variant="light" color={map.isActive ? 'green' : 'gray'}>{map.isActive ? 'نشط' : 'موقّف'}</Badge>
                              <Switch checked={map.isActive} onChange={() => toggleActive(sc.id)} aria-label="تفعيل/تعطيل" />
                            </Group>
                          ) : (
                            <Badge variant="light" color="yellow">لا يوجد ربط</Badge>
                          )}
                        </Table.Td>
                        <Table.Td data-cell="date">{map ? formatDate(map.createdAt) : '—'}</Table.Td>
                        <Table.Td data-cell="date">{map ? formatDate(map.updatedAt) : '—'}</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon variant="light" aria-label="تعديل" onClick={() => openEdit(sc.id)}>
                              <Edit size={16} />
                            </ActionIcon>
                            <Menu shadow="md" width={160}>
                              <Menu.Target>
                                <ActionIcon variant="light" aria-label="خيارات"><MoreHorizontal size={16} /></ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item leftSection={<Edit size={14} />} onClick={() => openEdit(sc.id)}>تعديل الربط</Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                  {pageSlice.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={9}>
                        <Text c="dimmed" ta="center">لا توجد نتائج مطابقة</Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </div>

            <Group justify="space-between" align="center">
              <Group gap="xs">
                <Text size="sm" c="dimmed">المجموع: {filteredSubs.length}</Text>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <NumberInput
                  min={5}
                  max={50}
                  value={pageSize}
                  onChange={(v) => { const n = Number(v) || pageSizeDefault; setPageSize(n); setPage(1); }}
                  size="xs"
                  aria-label="حجم الصفحة"
                />
                <Pagination total={totalPages} value={pageSafe} onChange={setPage} />
              </Group>
            </Group>
          </Stack>
        </Card>
      </Stack>

      <Modal opened={modalOpen} onClose={closeModal} title="تعديل ربط الصناعات" centered>
        {editing && (
          <Stack gap="sm">
            <MultiSelect
              label="الصناعات المسموحة"
              placeholder="اختيار صناعات"
              data={indOptions}
              value={editing.industryIds}
              onChange={(vals) => setEditing({ ...editing, industryIds: vals })}
              searchable
              clearable
            />
            <Group align="center" gap="sm">
              <Switch checked={editing.isActive} onChange={(e) => setEditing({ ...editing, isActive: e.currentTarget.checked })} />
              <Text size="sm">نشط</Text>
            </Group>
            <Divider my="xs" />
            <Group justify="flex-end" gap="sm">
              <Button variant="light" color="gray" onClick={closeModal}>إلغاء</Button>
              <Button variant="filled" color="brand" onClick={saveEditing}>حفظ</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
