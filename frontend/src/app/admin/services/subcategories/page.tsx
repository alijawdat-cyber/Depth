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
import { Plus, Edit, Trash2, MoreHorizontal, Search, Filter, Layers } from 'lucide-react';
import { mockData } from '@/data';
import type { Subcategory, Category } from '@/data/types';
import { formatDateEn, formatNumber, formatCurrencyIQD } from '@/shared/format';

type StatusFilter = 'all' | 'active' | 'inactive';

type FormState = Pick<Subcategory, 'id' | 'categoryId' | 'nameAr' | 'nameEn' | 'code' | 'basePrice' | 'description' | 'displayOrder' | 'isActive'>;

const pageSizeDefault = 10;

// تنسيقات موحّدة من SSOT
function formatDate(dateIso: string) { try { return formatDateEn(dateIso); } catch { return dateIso; } }
function formatEN(n: number) { return formatNumber(n); }

export default function AdminSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>(() => [...mockData.subcategories]);
  const [categories] = useState<Category[]>(() => [...mockData.categories]);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);

  const categoryOptions = useMemo(() => [
    { value: 'all', label: 'كل الفئات' },
    ...categories.map((c) => ({ value: c.id, label: c.nameAr }))
  ], [categories]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return subcategories
      .filter((sc) => (status === 'all') ? true : status === 'active' ? sc.isActive : !sc.isActive)
      .filter((sc) => categoryFilter === 'all' ? true : sc.categoryId === categoryFilter)
      .filter((sc) => s === '' || sc.nameAr.toLowerCase().includes(s) || sc.nameEn.toLowerCase().includes(s) || sc.code.toLowerCase().includes(s))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [subcategories, search, status, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageSafe, pageSize]);

  const catName = (id: string) => categories.find((c) => c.id === id)?.nameAr ?? '—';
  const short = (t: string, n = 48) => t.length > n ? t.slice(0, n) + '…' : t;

  const openCreate = () => {
    setEditing({
      id: '',
      categoryId: categories[0]?.id ?? '',
      nameAr: '',
      nameEn: '',
      code: '',
      basePrice: 0,
      description: '',
      displayOrder: (subcategories.length || 0) + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (sc: Subcategory) => {
    setEditing({
      id: sc.id,
      categoryId: sc.categoryId,
      nameAr: sc.nameAr,
      nameEn: sc.nameEn,
      code: sc.code,
      basePrice: sc.basePrice,
      description: sc.description,
      displayOrder: sc.displayOrder,
      isActive: sc.isActive,
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const saveEditing = () => {
    if (!editing) return;
    const nowIso = new Date().toISOString();
    const isNew = editing.id === '';
    if (isNew) {
      const newSub: Subcategory = {
        id: `sub_${editing.code || Math.random().toString(36).slice(2, 8)}`,
        categoryId: editing.categoryId,
        nameAr: editing.nameAr.trim(),
        nameEn: editing.nameEn.trim(),
        code: editing.code.trim(),
        basePrice: editing.basePrice,
        description: editing.description,
        displayOrder: editing.displayOrder,
        isActive: editing.isActive,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setSubcategories((prev) => [...prev, newSub]);
      notifications.show({ color: 'green', message: 'تمت إضافة الفئة الفرعية' });
    } else {
      setSubcategories((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...editing, updatedAt: nowIso } as Subcategory : s));
      notifications.show({ color: 'green', message: 'تم حفظ التعديلات' });
    }
    closeModal();
  };

  const toggleActive = (sc: Subcategory) => {
    setSubcategories((prev) => prev.map((s) => s.id === sc.id ? { ...s, isActive: !s.isActive, updatedAt: new Date().toISOString() } : s));
  };

  const removeSubcategory = (sc: Subcategory) => {
    setSubcategories((prev) => prev.filter((s) => s.id !== sc.id));
    notifications.show({ color: 'red', message: 'تم حذف الفئة الفرعية' });
  };

  return (
    <Container size="xl" className="admin-main" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={1} size="xl">قائمة الفئات الفرعية</Title>
            <Text c="dimmed" size="sm">إدارة الفئات الفرعية المرتبطة بالفئات الرئيسية</Text>
          </Stack>
          <Group gap="sm">
            <Button leftSection={<Plus size={16} />} onClick={openCreate} variant="filled" color="brand">إضافة فئة فرعية</Button>
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
                  <Table.Th>الاسم (عربي)</Table.Th>
                  <Table.Th>الاسم (EN)</Table.Th>
                  <Table.Th>الفئة</Table.Th>
                  <Table.Th data-cell="code">الكود</Table.Th>
                  <Table.Th data-cell="num">السعر الأساسي</Table.Th>
                  <Table.Th>الوصف</Table.Th>
                  <Table.Th data-cell="num">الترتيب</Table.Th>
                  <Table.Th>الحالة</Table.Th>
                  <Table.Th data-cell="date">أُنشئت</Table.Th>
                  <Table.Th data-cell="date">آخر تحديث</Table.Th>
                  <Table.Th>إجراءات</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {pageSlice.map((sc) => (
                  <Table.Tr key={sc.id}>
                    <Table.Td>{sc.nameAr}</Table.Td>
                    <Table.Td>{sc.nameEn}</Table.Td>
                    <Table.Td>{catName(sc.categoryId)}</Table.Td>
                    <Table.Td data-cell="code">{sc.code}</Table.Td>
                    <Table.Td data-cell="num"><span dir="ltr">{formatCurrencyIQD(sc.basePrice)}</span></Table.Td>
                    <Table.Td>{short(sc.description)}</Table.Td>
                    <Table.Td data-cell="num"><span dir="ltr">{formatEN(sc.displayOrder)}</span></Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Badge variant="light" color={sc.isActive ? 'green' : 'gray'}>{sc.isActive ? 'نشط' : 'موقّف'}</Badge>
                        <Switch checked={sc.isActive} onChange={() => toggleActive(sc)} aria-label="تفعيل/تعطيل" />
                      </Group>
                    </Table.Td>
                    <Table.Td data-cell="date">{formatDate(sc.createdAt)}</Table.Td>
                    <Table.Td data-cell="date">{formatDate(sc.updatedAt)}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon variant="light" aria-label="تعديل" onClick={() => openEdit(sc)}>
                          <Edit size={16} />
                        </ActionIcon>
                        <Menu shadow="md" width={160}>
                          <Menu.Target>
                            <ActionIcon variant="light" aria-label="خيارات"><MoreHorizontal size={16} /></ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<Edit size={14} />} onClick={() => openEdit(sc)}>تعديل</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => removeSubcategory(sc)}>حذف</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
                {pageSlice.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={11}>
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

      <Modal opened={modalOpen} onClose={closeModal} title={editing?.id ? 'تعديل فئة فرعية' : 'إضافة فئة فرعية'} centered>
        {editing && (
          <Stack gap="sm">
            <Select
              label="الفئة الرئيسية"
              placeholder="اختيار الفئة"
              value={editing.categoryId}
              onChange={(v: string | null) => setEditing({ ...editing, categoryId: v ?? editing.categoryId })}
              data={categories.map((c) => ({ value: c.id, label: c.nameAr }))}
              leftSection={<Layers size={14} />}
              required
            />
            <TextInput label="الاسم (عربي)" placeholder="مثال: تصميم شعار" value={editing.nameAr} onChange={(e) => setEditing({ ...editing, nameAr: e.currentTarget.value })} required />
            <TextInput label="الاسم (EN)" placeholder="Logo Design" value={editing.nameEn} onChange={(e) => setEditing({ ...editing, nameEn: e.currentTarget.value })} required />
            <TextInput label="الكود" placeholder="logo_design" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.currentTarget.value })} required />
            <NumberInput label="السعر الأساسي (د.ع)" value={editing.basePrice} onChange={(v) => setEditing({ ...editing, basePrice: Number(v) || 0 })} min={0} />
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
