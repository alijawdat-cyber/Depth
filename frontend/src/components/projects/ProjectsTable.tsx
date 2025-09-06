'use client';

import React, { useMemo, useState } from 'react';
import { 
  ActionIcon, 
  Badge, 
  Button, 
  Collapse, 
  Group, 
  Pagination, 
  Select, 
  Stack, 
  Table, 
  Text, 
  TextInput, 
  Tooltip,
  Card
} from '@mantine/core';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { mockProjects, mockClients, mockCreators, mockSubcategories, mockProjectRequests, mockIndustries } from '@/data';
import { formatCurrencyIQD, formatDateEn } from '@/shared/format';

type UserRole = 'admin' | 'client' | 'creator' | 'salaried';
type StatusFilter = 'all' | 'active' | 'pending' | 'completed' | 'cancelled';

interface ProjectsTableProps {
  role: UserRole;
  userId?: string;
}

const statusLabel: Record<string, string> = {
  active: 'نشط',
  pending: 'قيد الإعداد',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const statusColor: Record<string, string> = {
  active: 'green',
  pending: 'yellow',
  completed: 'teal',
  cancelled: 'red',
};

export default function ProjectsTable({ role, userId }: ProjectsTableProps) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<StatusFilter>(role === 'admin' ? 'all' : 'active');
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  
  const pageSize = role === 'admin' ? 8 : 5;

  // تحديد الأعمدة المرئية حسب الدور
  const isAdmin = role === 'admin';
  const isClient = role === 'client';
  const isCreator = role === 'creator';
  const isSalaried = role === 'salaried';

  // فلترة البيانات حسب الدور
  const filteredProjects = useMemo(() => {
    let projects = mockProjects.slice();

    // فلترة حسب الدور
    if (isClient && userId) {
      projects = projects.filter(p => p.clientId === userId);
    } else if (isCreator && userId) {
      projects = projects.filter(p => 
        p.creatorId === userId || 
        p.lineItems.some(item => item.assignedCreators?.includes(userId))
      );
    } else if (isSalaried && userId) {
      projects = projects.filter(p => 
        p.lineItems.some(item => item.assignedCreators?.includes(userId))
      );
    }

    // فلاتر إضافية
    const term = q.trim();
    if (status !== 'all') projects = projects.filter(p => p.status === status);
    if (subcategory) projects = projects.filter(p => p.lineItems.some(li => li.subcategoryId === subcategory));
    if (dateFrom) projects = projects.filter(p => new Date(p.createdAt) >= new Date(dateFrom));
    if (dateTo) projects = projects.filter(p => new Date(p.createdAt) <= new Date(dateTo));
    
    if (term) {
      projects = projects.filter(p => {
        const client = mockClients.find(c => c.id === p.clientId);
        const req = mockProjectRequests.find(r => r.convertedProjectId === p.id);
        const title = req?.title ?? '';
        const clientName = client ? (client.companyName || client.fullName) : '';
        return p.id.includes(term) || title.includes(term) || clientName.includes(term);
      });
    }

    // ترتيب: الأحدث أولاً
    projects.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const start = (page - 1) * pageSize;
    return {
      total: projects.length,
      current: projects.slice(start, start + pageSize),
    };
  }, [q, status, subcategory, dateFrom, dateTo, page, userId, pageSize, isClient, isCreator, isSalaried]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.total / pageSize));

  return (
    <Stack gap="sm">
      {/* فلاتر البحث */}
      <Group gap="sm" wrap="wrap">
        <TextInput 
          placeholder="بحث (معرف/عنوان/عميل)" 
          value={q} 
          onChange={(e) => { setPage(1); setQ(e.currentTarget.value); }} 
          style={{ minWidth: 240 }}
        />
        <Select
          placeholder="الحالة"
          style={{ minWidth: 160 }}
          value={status}
          onChange={(v) => { setPage(1); setStatus((v as StatusFilter) ?? 'all'); }}
          data={[
            { value: 'all', label: 'الكل' },
            { value: 'active', label: 'نشط' },
            { value: 'pending', label: 'قيد الإعداد' },
            { value: 'completed', label: 'مكتمل' },
            { value: 'cancelled', label: 'ملغي' },
          ]}
        />
        {isAdmin && (
          <>
            <Select
              placeholder="الفئة الفرعية"
              data={mockSubcategories.map(s => ({ value: s.id, label: s.nameAr }))}
              value={subcategory}
              onChange={(v) => { setPage(1); setSubcategory(v); }}
              searchable
              clearable
              style={{ minWidth: 220 }}
            />
            <TextInput type="date" placeholder="من" value={dateFrom} onChange={(e) => { setPage(1); setDateFrom(e.currentTarget.value); }} />
            <TextInput type="date" placeholder="إلى" value={dateTo} onChange={(e) => { setPage(1); setDateTo(e.currentTarget.value); }} />
          </>
        )}
      </Group>

      {/* الجدول */}
      <Table stickyHeader striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: 'center' }}>#</Table.Th>
            <Table.Th style={{ textAlign: 'center' }}>المعرف</Table.Th>
            <Table.Th style={{ textAlign: 'center' }}>العنوان</Table.Th>
            {(isAdmin || isCreator) && <Table.Th style={{ textAlign: 'center' }}>العميل</Table.Th>}
            {isAdmin && <Table.Th style={{ textAlign: 'center' }}>الصناعة</Table.Th>}
            {isAdmin && <Table.Th style={{ textAlign: 'center' }}>المبدع الرئيسي</Table.Th>}
            {!isSalaried && <Table.Th style={{ textAlign: 'center' }}>عناصر</Table.Th>}
            {!isSalaried && <Table.Th style={{ textAlign: 'center' }}>السعر الإجمالي</Table.Th>}
            <Table.Th style={{ textAlign: 'center' }}>التسليم</Table.Th>
            <Table.Th style={{ textAlign: 'center' }}>الحالة</Table.Th>
            <Table.Th style={{ textAlign: 'center' }}>تفاصيل</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredProjects.current.map((project, idx) => {
            const client = mockClients.find(c => c.id === project.clientId);
            const creator = project.creatorId ? mockCreators.find(c => c.id === project.creatorId) : undefined;
            const req = mockProjectRequests.find(r => r.convertedProjectId === project.id);
            const title = req?.title ?? `مشروع (${project.lineItems.length} عناصر)`;
            const isExpanded = !!expanded[project.id];
            const industryName = (() => {
              const indId = client?.industryId;
              if (!indId) return '—';
              return mockIndustries.find(i => i.id === indId)?.nameAr || '—';
            })();

            const totalCols = 6 + (isAdmin ? 3 : 0) + (isCreator && !isAdmin ? 1 : 0) + (!isSalaried ? 2 : 0);

            return (
              <React.Fragment key={project.id}>
                <Table.Tr>
                  <Table.Td style={{ textAlign: 'center' }}>
                    {(page - 1) * pageSize + idx + 1}
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'center', direction: 'ltr' }}>
                    {project.id}
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'center' }}>
                    {title}
                  </Table.Td>
                  {(isAdmin || isCreator) && (
                    <Table.Td style={{ textAlign: 'center' }}>
                      {client ? (client.companyName || client.fullName) : project.clientId}
                    </Table.Td>
                  )}
                  {isAdmin && (
                    <Table.Td style={{ textAlign: 'center' }}>
                      {industryName}
                    </Table.Td>
                  )}
                  {isAdmin && (
                    <Table.Td style={{ textAlign: 'center' }}>
                      {creator ? (creator.displayName || creator.fullName) : '—'}
                    </Table.Td>
                  )}
                  {!isSalaried && (
                    <Table.Td style={{ textAlign: 'center' }}>
                      {project.lineItems.length}
                    </Table.Td>
                  )}
                  {!isSalaried && (
                    <Table.Td style={{ textAlign: 'center', direction: 'ltr' }}>
                      {formatCurrencyIQD(project.totalClientPrice)}
                    </Table.Td>
                  )}
                  <Table.Td style={{ textAlign: 'center' }}>
                    {formatDateEn(project.deliveryDate)}
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Group gap={6} justify="center">
                      <Badge variant="light" color={statusColor[project.status]}>
                        {statusLabel[project.status] ?? project.status}
                      </Badge>
                      {project.isArchived && (
                        <Tooltip label="مؤرشف">
                          <Badge variant="outline" color="gray" size="sm">أرشيف</Badge>
                        </Tooltip>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Tooltip label={isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}>
                      <ActionIcon 
                        variant="light" 
                        onClick={() => setExpanded(prev => ({ ...prev, [project.id]: !prev[project.id] }))}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
                
                {/* صف التفاصيل */}
                <Table.Tr>
                  <Table.Td colSpan={totalCols} p={0}>
                    <Collapse in={isExpanded}>
                      <Card p="md" radius={0} bg="gray.0">
                        <Stack gap="sm">
                          <Group justify="space-between" wrap="wrap">
                            <Text size="sm" c="dimmed">
                              العناصر: {project.lineItems.length} | 
                              الإنشاء: {formatDateEn(project.createdAt)} | 
                              التحديث: {formatDateEn(project.updatedAt)}
                            </Text>
                            <Group gap="xs">
                              <Button size="xs" variant="light" color="blue">عرض</Button>
                              {isAdmin && (
                                <Button size="xs" variant="light" color="gray">تعديل</Button>
                              )}
                            </Group>
                          </Group>
                          
                          {/* عرض تفاصيل العناصر */}
                          <Stack gap="xs">
                            {project.lineItems.map((item, itemIdx) => {
                              const subcategoryItem = mockSubcategories.find(s => s.id === item.subcategoryId);
                              return (
                                <Group key={itemIdx} justify="space-between" p="xs" bg="gray.1">
                                  <Text size="sm">{subcategoryItem?.nameAr || item.subcategoryId}</Text>
                                  <Group gap="md">
                                    <Text size="sm" c="dimmed">الكمية: {item.quantity}</Text>
                                    {!isSalaried && (
                                      <Text size="sm" c="dimmed">السعر: {formatCurrencyIQD(item.basePrice)}</Text>
                                    )}
                                    {item.assignedCreators && item.assignedCreators.length > 0 && (
                                      <Badge variant="light" color="blue" size="sm">
                                        مُكلف: {item.assignedCreators.length}
                                      </Badge>
                                    )}
                                  </Group>
                                </Group>
                              );
                            })}
                          </Stack>

                          {/* الإجماليات للأدمن والعميل والمبدع فقط */}
                          {!isSalaried && (
                            <Group justify="flex-end" gap="lg" pt="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
                              {isAdmin && (
                                <>
                                  <Text size="sm" c="dimmed">المبدعين: {formatCurrencyIQD(project.totalCreatorPrice)}</Text>
                                  <Text size="sm" c="dimmed">الهامش: {formatCurrencyIQD(project.agencyMarginAmount)}</Text>
                                </>
                              )}
                              <Text fw={600} c="blue">الإجمالي: {formatCurrencyIQD(project.totalClientPrice)}</Text>
                            </Group>
                          )}
                        </Stack>
                      </Card>
                    </Collapse>
                  </Table.Td>
                </Table.Tr>
              </React.Fragment>
            );
          })}
        </Table.Tbody>
      </Table>

      {/* الصفحات */}
      <Group justify="space-between" mt="xs">
        <Text c="dimmed">المجموع: {filteredProjects.total} مشروع</Text>
        <Pagination 
          total={totalPages} 
          value={page} 
          onChange={setPage} 
          size="sm" 
          radius="md"
        />
      </Group>
    </Stack>
  );
}
