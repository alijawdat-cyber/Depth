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
  ActionIcon,
  Divider,
  Alert,
  ThemeIcon
} from '@mantine/core';
import {
  Plus,
  Eye,
  FileText,
  DollarSign,
  Clock,
  Check,
  AlertTriangle,
  LineChart
} from 'lucide-react';

// البيانات الوهمية للعميل الحالي
import { mockClients } from '@/data/clients';
import { mockProjects } from '@/data/projects';
import { mockInvoices } from '@/data/invoicing';
import { formatCurrencyIQD } from '@/shared/format';
import { CountUp, AnimatedProgress } from '@/shared/motion';

export default function ClientDashboard() {
  // العميل الحالي (محاكاة - في الحقيقة يجي من authentication)
  const currentClient = mockClients[0]; // محمد صالح أحمد - مطعم بيت بغداد
  
  // فلترة البيانات للعميل الحالي
  const clientProjects = mockProjects.filter(p => p.clientId === currentClient.id);
  // const clientRequests = mockProjectRequests.filter(r => r.clientId === currentClient.id);
  const clientInvoices = mockInvoices.filter(i => i.clientId === currentClient.id);
  
  // إحصائيات سريعة
  const activeProjects = clientProjects.filter(p => p.status === 'active').length;
  const completedProjects = clientProjects.filter(p => p.status === 'completed').length;
  const pendingInvoices = clientInvoices.filter(i => i.status === 'issued').length;
  // const totalRevenue = clientProjects.reduce((sum, p) => sum + p.totalClientPrice, 0);

  return (
    <Container size="xl" py="lg">
      <Stack gap="xl">
        {/* ترحيب مخصص */}
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Title order={1} size="xl">
              مرحباً، {currentClient.fullName}! 👋
            </Title>
            <Text c="dimmed" size="sm">
              {currentClient.companyName} • {currentClient.location.city} - {currentClient.location.area}
            </Text>
          </Stack>
          
          <Group gap="sm">
            <Button 
              variant="filled" 
              color="blue"
              leftSection={<Plus size={18} />}
            >
              طلب جديد
            </Button>
          </Group>
        </Group>

        {/* مؤشرات الأداء - مخصصة للعميل */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    المشاريع النشطة
                  </Text>
                  <Text size="xl" fw={700}>
                    <CountUp value={activeProjects} />
                  </Text>
                  <Text size="xs" c="blue">
                    يجري العمل عليها
                  </Text>
                </Stack>
                <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                  <Clock size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    مشاريع مكتملة
                  </Text>
                  <Text size="xl" fw={700}>
                    <CountUp value={completedProjects} />
                  </Text>
                  <Text size="xs" c="green">
                    تم تسليمها بنجاح
                  </Text>
                </Stack>
                <ThemeIcon size="xl" radius="md" variant="light" color="green">
                  <Check size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    إجمالي الاستثمار
                  </Text>
                  <Text size="xl" fw={700}>
                    <CountUp value={currentClient.totalSpent} format={formatCurrencyIQD} />
                  </Text>
                  <Text size="xs" c="green">
                    نمو مستمر
                  </Text>
                </Stack>
                <ThemeIcon size="xl" radius="md" variant="light" color="green">
                  <DollarSign size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    فواتير معلقة
                  </Text>
                  <Text size="xl" fw={700} c={pendingInvoices > 0 ? "orange" : "green"}>
                    <CountUp value={pendingInvoices} />
                  </Text>
                  <Text size="xs" c={pendingInvoices > 0 ? "orange" : "green"}>
                    {pendingInvoices > 0 ? 'تحتاج متابعة' : 'كل شي مدفوع'}
                  </Text>
                </Stack>
                <ThemeIcon 
                  size="xl" 
                  radius="md" 
                  variant="light" 
                  color={pendingInvoices > 0 ? "orange" : "green"}
                >
                  {pendingInvoices > 0 ? <AlertTriangle size={28} /> : <Check size={28} />}
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Divider />

        {/* المشاريع النشطة */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3} size="lg">
                مشاريعي النشطة
              </Title>
              <Button variant="light" size="sm" rightSection={<Eye size={16} />}>
                عرض الكل
              </Button>
            </Group>
            
            {clientProjects.length > 0 ? (
              <Stack gap="sm">
                {clientProjects.slice(0, 3).map((project) => (
                  <Card key={project.id} p="md" withBorder>
                    <Group justify="space-between" align="flex-start">
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Group gap="sm">
                          <Badge 
                            variant="light" 
                            color={
                              project.status === 'active' ? 'blue' :
                              project.status === 'completed' ? 'green' :
                              project.status === 'pending' ? 'orange' : 'gray'
                            }
                          >
                            {project.status === 'active' ? '🔄 نشط' :
                             project.status === 'completed' ? '✅ مكتمل' :
                             project.status === 'pending' ? '⏳ معلق' : '❌ ملغي'}
                          </Badge>
                          <Text size="xs" c="dimmed">
                            {project.id}
                          </Text>
                        </Group>
                        
                        <Text fw={500} size="sm">
                          {project.notes || 'مشروع بدون وصف'}
                        </Text>
                        
                        <Group gap="sm">
                          <Text size="xs" c="dimmed">
                            📅 التسليم: {project.deliveryDate}
                          </Text>
                          <Text size="xs" c="dimmed">
                            💰 {formatCurrencyIQD(project.totalClientPrice)}
                          </Text>
                        </Group>
                        
                        {/* شريط التقدم للمشاريع النشطة */}
                        {project.status === 'active' && (
                          <AnimatedProgress value={Math.floor(Math.random() * 100)} />
                        )}
                      </Stack>
                      
                      <Group gap="xs">
                        <ActionIcon variant="light" color="blue">
                          <Eye size={16} />
                        </ActionIcon>
                        <ActionIcon variant="light" color="gray">
                          <FileText size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Alert variant="light" color="blue" icon={<FileText size={16} />}>
                ما عندك مشاريع حالياً. ابدأ بإنشاء طلب جديد!
              </Alert>
            )}
          </Stack>
        </Card>

        {/* إجراءات سريعة */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="lg">
              إجراءات سريعة
            </Title>
            
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="blue"
                  size="md"
                  fullWidth
                  leftSection={<FileText size={20} />}
                >
                  طلب مشروع جديد
                </Button>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="green"
                  size="md"
                  fullWidth
                  leftSection={<Eye size={20} />}
                >
                  عرض المشاريع
                </Button>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="orange"
                  size="md"
                  fullWidth
                  leftSection={<DollarSign size={20} />}
                >
                  الفواتير والدفع
                </Button>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="brand"
                  size="md"
                  fullWidth
                  leftSection={<LineChart size={20} />}
                >
                  تقاريري
                </Button>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* معلومات الحساب */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="sm">
            <Title order={3} size="lg">
              معلومات الحساب
          </Title>
            
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">تقييم الحساب</Text>
                  <Group gap="sm">
                    <Text size="lg" fw={500} style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      ⭐ {currentClient.rating}/5
          </Text>
                    <Badge variant="light" color="green">
                      عميل ممتاز
                    </Badge>
                  </Group>
                </Stack>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">شروط الدفع</Text>
                  <Badge variant="outline" color="blue">
                    {currentClient.paymentTerms === 'advance_50' ? '50% مقدم' :
                     currentClient.paymentTerms === 'advance_100' ? '100% مقدم' :
                     currentClient.paymentTerms === 'net_15' ? 'صافي 15 يوم' : 'صافي 30 يوم'}
        </Badge>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* ملاحظة اختبار */}
        <Alert variant="light" color="blue" title="🧪 وضع الاختبار">
        <Text size="sm">
            أنت الآن تختبر شاشة <strong>العميل</strong>. هذا العميل يرى:
            <br />
            • مشاريعه ومدفوعاته فقط
            <br />
            • السعر النهائي بدون تفاصيل هامش الوكالة
            <br />
            • إمكانية إنشاء طلبات جديدة ومتابعة الحالة
            <br />
            <br />
            البيانات المعروضة مأخوذة من: <code>mockClients[0]</code> - محمد صالح أحمد
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
              color="blue" 
              size="sm"
            >
              🔄 جرب عميل آخر
            </Button>
          </Group>
        </Alert>
      </Stack>
    </Container>
  );
}
