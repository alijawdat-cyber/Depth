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
  Textarea,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Plus, Edit, Trash2, MoreHorizontal, Search, Filter } from 'lucide-react';
import { mockData } from '@/data';
import type { Industry } from '@/data/types';
import { formatDateEn, formatNumber } from '@/shared/format';

type FormState = Pick<Industry, 'id' | 'nameAr' | 'nameEn' | 'code' | 'description' | 'displayOrder' | 'isActive'>;
type StatusFilter = 'all' | 'active' | 'inactive';

const pageSizeDefault = 10;

// تنسيقات موحدة من SSOT
function formatDate(dateIso: string) { try { return formatDateEn(dateIso); } catch { return dateIso; } }
function formatEN(n: number) { return formatNumber(n); }

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>(() => [...mockData.industries]);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);

  // عدّاد الفئات الفرعية المرتبطة بكل مجال
  const mappingCountByIndustry = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ind of industries) counts[ind.id] = 0;
    for (const m of mockData.subcategoryIndustryMappings) {
      const uniq = Array.from(new Set(m.industryIds));
      for (const iid of uniq) if (iid in counts) counts[iid] += 1;
    }
    return counts;
  }, [industries]);

  // عدّاد العملاء لكل مجال
  const clientsCountByIndustry = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ind of industries) counts[ind.id] = 0;
    for (const c of mockData.clients) {
      if (c.industry && c.industry in counts) counts[c.industry] += 1;
    }
    return counts;
  }, [industries]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return industries
      .filter((i) => (status === 'all') ? true : status === 'active' ? i.isActive : !i.isActive)
      .filter((i) => s === '' || i.nameAr.toLowerCase().includes(s) || i.nameEn.toLowerCase().includes(s) || i.code.toLowerCase().includes(s))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [industries, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageSafe, pageSize]);

  const openCreate = () => {
    setEditing({ id: '', nameAr: '', nameEn: '', code: '', description: '', displayOrder: (industries.length || 0) + 1, isActive: true });
    setModalOpen(true);
  };

  const openEdit = (ind: Industry) => {
    setEditing({ id: ind.id, nameAr: ind.nameAr, nameEn: ind.nameEn, code: ind.code, description: ind.description, displayOrder: ind.displayOrder, isActive: ind.isActive });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const saveEditing = () => {
    if (!editing) return;
    const nowIso = new Date().toISOString();
    const isNew = editing.id === '';
    if (isNew) {
      const newInd: Industry = {
        id: `ind_${editing.code || Math.random().toString(36).slice(2, 8)}`,
        nameAr: editing.nameAr.trim(),
        nameEn: editing.nameEn.trim(),
        code: editing.code.trim(),
        description: editing.description.trim(),
        displayOrder: editing.displayOrder,
        isActive: editing.isActive,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setIndustries((prev) => [...prev, newInd]);
      notifications.show({ color: 'green', message: 'تمت إضافة المجال بنجاح' });
    } else {
      setIndustries((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...editing, updatedAt: nowIso } as Industry : i));
      notifications.show({ color: 'green', message: 'تم حفظ التعديلات' });
    }
    closeModal();
  };

  const toggleActive = (ind: Industry) => {
    setIndustries((prev) => prev.map((i) => i.id === ind.id ? { ...i, isActive: !i.isActive, updatedAt: new Date().toISOString() } : i));
  };

  const removeIndustry = (ind: Industry) => {
    setIndustries((prev) => prev.filter((i) => i.id !== ind.id));
    notifications.show({ color: 'red', message: 'تم حذف المجال' });
  };

  return (
    <Container size="xl" className="admin-main" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={1} size="xl">قائمة المجالات</Title>
            <Text c="dimmed" size="sm">إدارة المجالات الصناعية المستخدمة بالنظام</Text>
          </Stack>
          <Group gap="sm">
            <Button leftSection={<Plus size={16} />} onClick={openCreate} variant="filled" color="brand">إضافة مجال</Button>
          </Group>
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
            </Group>

            <Divider />

            {/* غلاف تمرير أفقي خاص بالجدول فقط */}
            <div data-responsive="wide" data-wide-min="true">
              <Table stickyHeader highlightOnHover withRowBorders={false} striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>الاسم (عربي)</Table.Th>
                    <Table.Th>الاسم (EN)</Table.Th>
                    <Table.Th data-cell="code">الكود</Table.Th>
                    <Table.Th data-cell="num">فئات فرعية مرتبطة</Table.Th>
                    <Table.Th data-cell="num">عدد العملاء</Table.Th>
                    <Table.Th data-cell="num">الترتيب</Table.Th>
                    <Table.Th>الحالة</Table.Th>
                    <Table.Th data-cell="date">أُنشئت</Table.Th>
                    <Table.Th data-cell="date">آخر تحديث</Table.Th>
                    <Table.Th>إجراءات</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {pageSlice.map((ind) => (
                    <Table.Tr key={ind.id}>
                      <Table.Td>{ind.nameAr}</Table.Td>
                      <Table.Td>{ind.nameEn}</Table.Td>
                      <Table.Td data-cell="code">{ind.code}</Table.Td>
                      <Table.Td data-cell="num"><span dir="ltr">{formatEN(mappingCountByIndustry[ind.id] ?? 0)}</span></Table.Td>
                      <Table.Td data-cell="num"><span dir="ltr">{formatEN(clientsCountByIndustry[ind.id] ?? 0)}</span></Table.Td>
                      <Table.Td data-cell="num"><span dir="ltr">{formatEN(ind.displayOrder)}</span></Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Badge variant="light" color={ind.isActive ? 'green' : 'gray'}>{ind.isActive ? 'نشط' : 'موقّف'}</Badge>
                          <Switch checked={ind.isActive} onChange={() => toggleActive(ind)} aria-label="تفعيل/تعطيل" />
                        </Group>
                      </Table.Td>
                      <Table.Td data-cell="date">{formatDate(ind.createdAt)}</Table.Td>
                      <Table.Td data-cell="date">{formatDate(ind.updatedAt)}</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="light" aria-label="تعديل" onClick={() => openEdit(ind)}>
                            <Edit size={16} />
                          </ActionIcon>
                          <Menu shadow="md" width={160}>
                            <Menu.Target>
                              <ActionIcon variant="light" aria-label="خيارات"><MoreHorizontal size={16} /></ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item leftSection={<Edit size={14} />} onClick={() => openEdit(ind)}>تعديل</Menu.Item>
                              <Menu.Divider />
                              <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => removeIndustry(ind)}>حذف</Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {pageSlice.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={10}>
                        <Text c="dimmed" ta="center">لا توجد نتائج مطابقة</Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </div>

            <Group justify="space-between" align="center">
              <Group gap="xs">
                <Text size="sm" c="dimmed">المجموع: {filtered.length}</Text>
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

      <Modal opened={modalOpen} onClose={closeModal} title={editing?.id ? 'تعديل مجال' : 'إضافة مجال'} centered>
        {editing && (
          <Stack gap="sm">
            <TextInput label="الاسم (عربي)" placeholder="مثال: شركات عقارية" value={editing.nameAr} onChange={(e) => setEditing({ ...editing, nameAr: e.currentTarget.value })} required />
            <TextInput label="الاسم (EN)" placeholder="Real Estate" value={editing.nameEn} onChange={(e) => setEditing({ ...editing, nameEn: e.currentTarget.value })} required />
            <TextInput label="الكود" placeholder="realestate" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.currentTarget.value })} required />
            <Textarea label="الوصف" minRows={2} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.currentTarget.value })} />
            <NumberInput label="ترتيب العرض" value={editing.displayOrder} onChange={(v) => setEditing({ ...editing, displayOrder: Number(v) || 1 })} min={1} />
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
