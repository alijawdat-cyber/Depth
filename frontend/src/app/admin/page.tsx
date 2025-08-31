'use client';

import React from 'react';
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Stack,
  Badge,
  Button,
  Divider,
  Avatar,
  Table,
  Progress,
  ThemeIcon,
  Alert
} from '@mantine/core';
import {
  IconUsers,
  IconCurrencyDollar,
  IconClipboardList,
  IconChartLine,
  IconTrendingUp,
  IconAlertTriangle,
  IconEye,
  IconArrowRight
} from '@tabler/icons-react';

// البيانات من الموك
import { mockProjects } from '@/data/projects';
import { mockClients } from '@/data/clients';
import { mockCreators } from '@/data/creators';
import { mockInvoices, mockPayments } from '@/data/invoicing';
import { mockNotifications } from '@/data/notifications';
import { formatCurrencyIQD, formatNumber, formatDateYMD } from '@/shared/format';

export default function AdminDashboard() {
  // حساب الـ KPIs من البيانات الموجودة
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const totalClients = mockClients.length;
  const totalCreators = mockCreators.filter(c => c.isActive).length;
  
  // حساب الإجماليات المالية
  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.amount.total, 0);
  const totalLineItems = mockProjects.reduce((sum, p) => sum + p.lineItems.length, 0);
  
  // الإشعارات غير المقروءة
  const unreadNotifications = mockNotifications.filter(n => !n.isRead);
  
  // آخر الأنشطة
  const recentActivities = [
    { user: 'فاطمة أحمد علي', action: 'أكملت مشروع تصوير المطعم', time: 'منذ ساعتين' },
    { user: 'أحمد محمد حسن', action: 'وافق على طلب عميل جديد', time: 'منذ 3 ساعات' },
    { user: 'مريم كاظم جواد', action: 'سلمت تصميم الهوية البصرية', time: 'منذ 5 ساعات' },
  ];

  return (
  <Container size="xl" className="admin-main" px={0}>
      {/* عنوان الصفحة الموحد */}
      <Stack gap="lg">
  <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Title order={1} size="xl">
              لوحة التحكم الرئيسية
            </Title>
            <Text c="dimmed" size="sm">
              مرحباً علي جواد الربيعي، إليك نظرة عامة على نشاط المنصة
            </Text>
          </Stack>

        </Group>

        {/* مؤشرات الأداء الرئيسية - KPIs */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    إجمالي المشاريع
                  </Text>
                  <Text size="xl" fw={700}>
                    {formatNumber(totalProjects)}
                  </Text>
                  <Text size="xs" c="green">
                    {activeProjects} نشط
                  </Text>
                </Stack>
                <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                  <IconClipboardList size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    إجمالي العملاء
                  </Text>
                  <Text size="xl" fw={700}>
                    {formatNumber(totalClients)}
                  </Text>
                  <Text size="xs" c="blue">
                    كلهم نشطين
                  </Text>
                </Stack>
                <ThemeIcon size="xl" radius="md" variant="light" color="green">
                  <IconUsers size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    المبدعون النشطون
                  </Text>
                  <Text size="xl" fw={700}>
                    {formatNumber(totalCreators)}
                  </Text>
                  <Text size="xs" c="green">
                    متاحين للعمل
                  </Text>
                </Stack>
                <ThemeIcon size="xl" radius="md" variant="light" color="violet">
                  <IconUsers size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    إجمالي الإيرادات
                  </Text>
                  <Text size="xl" fw={700}>
                    {formatCurrencyIQD(totalRevenue)}
                  </Text>
                  <Text size="xs" c="green">
                    {totalLineItems} عنصر
                  </Text>
                </Stack>
                <ThemeIcon size="xl" radius="md" variant="light" color="green">
                  <IconCurrencyDollar size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

  <Divider my="lg" />

  {/* التنبيهات والأنشطة */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={3} size="lg">
                    آخر الأنشطة
                  </Title>
                  <Button variant="light" size="sm" rightSection={<IconEye size={16} />}>
                    عرض الكل
                  </Button>
                </Group>
                
                <Stack gap="sm">
                  {recentActivities.map((activity, index) => (
                    <Group key={index} justify="space-between" align="center">
                      <Group gap="sm">
                        <Avatar size="sm" radius="xl">
                          {activity.user.charAt(0)}
                        </Avatar>
                        <Stack gap={0}>
                          <Text size="sm" fw={500}>
                            {activity.user}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {activity.action}
                          </Text>
                        </Stack>
                      </Group>
                      <Text size="xs" c="dimmed">
                        {activity.time}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={3} size="lg">
                    التنبيهات العاجلة
                  </Title>
                  <Badge variant="filled" color="red" size="sm">
                    {unreadNotifications.length}
                  </Badge>
                </Group>
                
                <Stack gap="sm">
                  {unreadNotifications.slice(0, 3).map((notif) => (
                    <Group key={notif.id} align="flex-start" gap="sm">
                      <ThemeIcon 
                        size="sm" 
                        radius="xl" 
                        variant="light"
                        color={notif.priority === 'urgent' ? 'red' : notif.priority === 'high' ? 'orange' : 'blue'}
                      >
                        <IconAlertTriangle size={12} />
                      </ThemeIcon>
                      <Stack gap={0} style={{ flex: 1 }}>
                        <Text size="xs" fw={500}>
                          {notif.title}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          {notif.message}
                        </Text>
                      </Stack>
                    </Group>
                  ))}
                </Stack>
                
                <Button 
                  variant="light" 
                  size="sm" 
                  fullWidth
                  rightSection={<IconArrowRight size={16} />}
                >
                  عرض كل التنبيهات
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        <Divider my="lg" />

        {/* نظرة سريعة على المدفوعات والإيرادات */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder data-responsive="wide" data-fit="content" data-compact="true">
              <Stack gap="sm">
                <Group justify="space-between" align="center">
                  <Title order={3} size="lg">المدفوعات الأخيرة</Title>
                  <Group gap={6}>
                    <IconTrendingUp size={18} />
                    <Text size="sm" c="dimmed">اتجاه جيد</Text>
                  </Group>
                </Group>
                <div className="u-scroll-x">
                <Table striped highlightOnHover withRowBorders withColumnBorders className="m-row-tight" ta="center">
                  <Table.Thead>
                    <Table.Tr>
          <Table.Th data-cell="id" ta="center" style={{ verticalAlign: 'middle' }}>الرقم</Table.Th>
          <Table.Th data-cell="client" ta="center" style={{ verticalAlign: 'middle' }}>العميل</Table.Th>
          <Table.Th data-cell="num" ta="center" style={{ verticalAlign: 'middle' }}>المبلغ</Table.Th>
          <Table.Th data-cell="date" ta="center" style={{ verticalAlign: 'middle' }}>التاريخ</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockPayments.slice(0, 5).map((p) => (
                      <Table.Tr key={p.id}>
                        <Table.Td data-cell="id" ta="center" style={{ verticalAlign: 'middle' }}>{p.reference}</Table.Td>
                        <Table.Td ta="center" style={{ verticalAlign: 'middle' }}>{p.clientId}</Table.Td>
                        <Table.Td data-cell="num" ta="center" style={{ verticalAlign: 'middle' }}>{formatCurrencyIQD(p.amount)}</Table.Td>
                        <Table.Td data-cell="date" ta="center" style={{ verticalAlign: 'middle' }}>{formatDateYMD(p.receivedAt)}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                </div>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Group justify="space-between" align="center">
                  <Title order={3} size="lg">تقدّم الإيرادات الشهرية</Title>
                  <Text size="sm" c="dimmed">آخر 4 فواتير</Text>
                </Group>
                <Stack gap={4}>
                  {mockInvoices.slice(0, 4).map((inv) => (
                    <div key={inv.id}>
                      <Group justify="space-between" mb={4}>
                        <Text size="sm">{inv.invoiceNumber}</Text>
                        <Text size="xs" c="dimmed">{formatCurrencyIQD(inv.amount.total)}</Text>
                      </Group>
                      <Progress value={Math.min(100, (inv.amount.total % 1000000) / 10000)} size="sm" color="green" />
                    </div>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* الإجراءات السريعة */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="lg">
              الإجراءات السريعة
            </Title>
            
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="blue"
                  size="md"
                  fullWidth
                  leftSection={<IconUsers size={20} />}
                >
                  إدارة المبدعين
                </Button>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="green"
                  size="md"
                  fullWidth
                  leftSection={<IconClipboardList size={20} />}
                >
                  المشاريع النشطة
                </Button>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="orange"
                  size="md"
                  fullWidth
                  leftSection={<IconCurrencyDollar size={20} />}
                >
                  الفواتير المعلقة
                </Button>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="violet"
                  size="md"
                  fullWidth
                  leftSection={<IconChartLine size={20} />}
                >
                  التقارير المالية
                </Button>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* ملاحظة اختبار الأدمن */}
        <Alert variant="light" color="red" title="🧪 وضع الاختبار - سوبر أدمن">
          <Text size="sm">
            أنت الآن تختبر شاشة <strong>السوبر أدمن</strong>. هذا المستخدم يرى:
            <br />
            • كل شي في النظام (25+ شاشة)
            <br />
            • إدارة أدمنز آخرين + impersonate
            <br />
            • كل التقارير المالية والهوامش
            <br />
            • مراقبة النظام والصحة
            <br />
            <br />
            البيانات المعروضة مأخوذة من: <code>mockAdmins[0]</code> - علي جواد الربيعي
          </Text>
          
          <Group mt="md">
            <Button 
              variant="outline" 
              color="gray" 
              size="sm"
              component="a"
              href="/"
            >
              ← ارجع لصفحة اختبار الأدوار
            </Button>
            <Button 
              variant="light" 
              color="red" 
              size="sm"
            >
              🔄 جرب أدمن عادي
            </Button>
          </Group>
        </Alert>
      </Stack>
    </Container>
  );
}
