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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Plus, Edit, Trash2, MoreHorizontal, Search, Filter } from 'lucide-react';
import { mockData } from '@/data';
import type { Category } from '@/data/types';

type FormState = Pick<Category, 'id' | 'nameAr' | 'nameEn' | 'code' | 'displayOrder' | 'isActive'>;

const pageSizeDefault = 10;

import { formatDateYMD, formatNumber } from '@/shared/format';
// تنسيق التاريخ بالأرقام الإنجليزية بشكل موحّد (YYYY/MM/DD)
function formatDate(dateIso: string) { try { return formatDateYMD(dateIso); } catch { return dateIso; } }
function formatEN(n: number) { return formatNumber(n); }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(() => [...mockData.categories]);
  const [search, setSearch] = useState('');
  type StatusFilter = 'all' | 'active' | 'inactive';
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return categories
      .filter((c) =>
        (status === 'all') ? true : status === 'active' ? c.isActive : !c.isActive
      )
      .filter((c) =>
        s === '' ||
        c.nameAr.toLowerCase().includes(s) ||
        c.nameEn.toLowerCase().includes(s) ||
        c.code.toLowerCase().includes(s)
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [categories, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageSafe, pageSize]);

  const openCreate = () => {
    setEditing({ id: '', nameAr: '', nameEn: '', code: '', displayOrder: (categories.length || 0) + 1, isActive: true });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing({ id: cat.id, nameAr: cat.nameAr, nameEn: cat.nameEn, code: cat.code, displayOrder: cat.displayOrder, isActive: cat.isActive });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const saveEditing = () => {
    if (!editing) return;
    const nowIso = new Date().toISOString();
    const isNew = editing.id === '';
    if (isNew) {
      const newCat: Category = {
        id: `cat_${editing.code || Math.random().toString(36).slice(2, 8)}`,
        nameAr: editing.nameAr.trim(),
        nameEn: editing.nameEn.trim(),
        code: editing.code.trim(),
        displayOrder: editing.displayOrder,
        isActive: editing.isActive,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setCategories((prev) => [...prev, newCat]);
      notifications.show({ color: 'green', message: 'تمت إضافة الفئة بنجاح' });
    } else {
      setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...editing, updatedAt: nowIso } as Category : c));
      notifications.show({ color: 'green', message: 'تم حفظ التعديلات' });
    }
    closeModal();
  };

  const toggleActive = (cat: Category) => {
    setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString() } : c));
  };

  const removeCategory = (cat: Category) => {
    // ملاحظة: ممكن نحصرها لاحقاً لسوبر أدمن فقط
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    notifications.show({ color: 'red', message: 'تم حذف الفئة' });
  };

  return (
    <Container size="xl" className="admin-main" px={0}>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={1} size="xl">قائمة الفئات</Title>
            <Text c="dimmed" size="sm">إدارة الفئات الرئيسية للنظام</Text>
          </Stack>
          <Group gap="sm">
            <Button leftSection={<Plus size={16} />} onClick={openCreate} variant="filled" color="brand">إضافة فئة</Button>
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
                  <Table.Th data-cell="num">الترتيب</Table.Th>
                  <Table.Th>الحالة</Table.Th>
                  <Table.Th data-cell="date">أُنشئت</Table.Th>
                  <Table.Th data-cell="date">آخر تحديث</Table.Th>
                  <Table.Th>إجراءات</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {pageSlice.map((cat) => (
                  <Table.Tr key={cat.id}>
                    <Table.Td>{cat.nameAr}</Table.Td>
                    <Table.Td>{cat.nameEn}</Table.Td>
                    <Table.Td data-cell="code">{cat.code}</Table.Td>
                    <Table.Td data-cell="num"><span dir="ltr">{formatEN(cat.displayOrder)}</span></Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Badge variant="light" color={cat.isActive ? 'green' : 'gray'}>{cat.isActive ? 'نشط' : 'موقّف'}</Badge>
                        <Switch
                          checked={cat.isActive}
                          onChange={() => toggleActive(cat)}
                          aria-label="تفعيل/تعطيل"
                        />
                      </Group>
                    </Table.Td>
                    <Table.Td data-cell="date">{formatDate(cat.createdAt)}</Table.Td>
                    <Table.Td data-cell="date">{formatDate(cat.updatedAt)}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon variant="light" aria-label="تعديل" onClick={() => openEdit(cat)}>
                          <Edit size={16} />
                        </ActionIcon>
                        <Menu shadow="md" width={160}>
                          <Menu.Target>
                            <ActionIcon variant="light" aria-label="خيارات"><MoreHorizontal size={16} /></ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<Edit size={14} />} onClick={() => openEdit(cat)}>تعديل</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => removeCategory(cat)}>حذف</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
                {pageSlice.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
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

      <Modal opened={modalOpen} onClose={closeModal} title={editing?.id ? 'تعديل فئة' : 'إضافة فئة'} centered>
        {editing && (
          <Stack gap="sm">
            <TextInput label="الاسم (عربي)" placeholder="مثال: تصوير فوتوغرافي" value={editing.nameAr} onChange={(e) => setEditing({ ...editing, nameAr: e.currentTarget.value })} required />
            <TextInput label="الاسم (EN)" placeholder="Photography" value={editing.nameEn} onChange={(e) => setEditing({ ...editing, nameEn: e.currentTarget.value })} required />
            <TextInput label="الكود" placeholder="photo" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.currentTarget.value })} required />
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
