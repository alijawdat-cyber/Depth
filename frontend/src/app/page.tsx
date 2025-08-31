'use client';

import React, { useState } from 'react';
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
  Avatar,
  Divider,
  Select,
  Alert,
  ActionIcon,
  Tabs
} from '@mantine/core';
import {
  ShieldCheck,
  User,
  Camera,
  Briefcase,
  UsersRound,
  LogIn,
  Eye,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// استيراد البيانات الوهمية لكل الأدوار
import { mockAdmins } from '@/data/admins';
import { mockCreators } from '@/data/creators';
import { mockClients } from '@/data/clients';
import { mockSalariedEmployees } from '@/data/employees';
import { formatCurrencyIQD } from '@/shared/format';

// نوع المستخدم الموحد لكل الأدوار
type UnifiedUser = {
  id: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'creator' | 'client' | 'salariedEmployee';
  userType: string;
  description: string;
  screensCount: string;
  route: string;
  color: string;
  stats?: string;
  onboardingStatus?: string;
  onboardingStep?: number;
};

type UserRole = 'super_admin' | 'admin' | 'creator' | 'client' | 'salariedEmployee' | 'all';

export default function RoleTestingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('all');

  // تجميع كل المستخدمين حسب الدور
  const allUsers: Record<Exclude<UserRole, 'all'>, UnifiedUser[]> = {
    super_admin: [
      {
        ...mockAdmins[0],
        role: 'super_admin',
        userType: 'سوبر أدمن',
        description: 'صلاحيات كاملة + إدارة أدمنز + impersonate',
        screensCount: '25+ شاشة',
        route: '/admin',
        color: 'red'
      }
    ],
    admin: [
      {
        ...mockAdmins[1],
        role: 'admin',
        userType: 'أدمن',
        description: 'صلاحيات إدارية (بدون إدارة أدمنز)',
        screensCount: '20+ شاشة',
        route: '/admin',
        color: 'orange'
      }
    ],
    creator: mockCreators.map(creator => ({
      ...creator,
      role: 'creator',
      userType: 'مبدع فريلانسر',
      description: `${creator.specialties.join('، ')} - ${creator.experienceLevel}`,
      screensCount: '14 شاشة',
      route: '/creator',
      color: 'green',
      stats: `⭐ ${creator.rating} - 🎯 ${creator.completedProjects} مشروع`
    })),
    client: mockClients.map(client => ({
      ...client,
      role: 'client',
      userType: client.businessType === 'company' ? 'عميل شركة' : 'عميل فرد',
      description: client.companyName || 'عميل فردي',
      screensCount: '12 شاشة',
      route: '/client',
      color: 'blue',
      stats: `💰 ${formatCurrencyIQD(client.totalSpent)} - 📊 ${client.totalProjects} مشروع`
    })),
    salariedEmployee: mockSalariedEmployees.map(emp => ({
      ...emp,
      role: 'salariedEmployee',
      userType: 'موظف براتب',
      description: `${emp.jobTitle} - ${emp.department}`,
      screensCount: '10 شاشات',
      route: '/salaried',
      color: 'violet',
      stats: `💼 ${emp.employmentType} - 📅 ${emp.startDate}`
    }))
  };

  // دالة محاكاة تسجيل الدخول
  const simulateLogin = (user: UnifiedUser) => {
    // في التطبيق الحقيقي هنا راح يكون authentication
    console.log(`محاكاة تسجيل دخول: ${user.fullName} - ${user.role}`);
    
    // توجيه للشاشة المناسبة حسب الدور
    router.push(user.route);
  };

  const filteredUsers: UnifiedUser[] = selectedRole === 'all' 
    ? Object.values(allUsers).flat()
    : selectedRole in allUsers ? allUsers[selectedRole as Exclude<UserRole, 'all'>] : [];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* عنوان الصفحة */}
        <Group justify="center">
          <Stack align="center" gap="xs">
            <Title order={1} ta="center" c="var(--color-primary)">
              🧪 صفحة اختبار الأدوار - Depth Platform
            </Title>
            <Text size="lg" ta="center" c="dimmed">
              اختبر تسجيل الدخول والتنقل لكل دور حسب الصلاحيات والبيانات الوهمية
            </Text>
            <Badge size="lg" variant="filled" color="green">
              5 أدوار × 80+ مستخدم وهمي
            </Badge>
          </Stack>
        </Group>

        {/* نظرة عامة على النظام */}
        <Alert variant="light" color="blue" title="📋 نظرة عامة على نظام الأدوار">
          <Text size="sm">
            • **Super Admin**: علي جواد الربيعي - صلاحيات كاملة (25+ شاشة)
            <br />
            • **Admin**: أحمد محمد حسن - صلاحيات إدارية محدودة (20+ شاشة)  
            <br />
            • **Creator**: 6 مبدعين فريلانسرز - مشاريعهم فقط (14 شاشة)
            <br />
            • **Client**: 4 عملاء - طلباتهم ومدفوعاتهم (12 شاشة)
            <br />
            • **SalariedEmployee**: 5 موظفين براتب - مهامهم بدون أسعار (10 شاشات)
          </Text>
        </Alert>

        {/* فلتر الأدوار */}
        <Group justify="center">
          <Select
            label="فلترة حسب الدور"
            placeholder="اختر دور للتصفية"
            value={selectedRole}
            onChange={(value) => setSelectedRole((value as UserRole) || 'all')}
            data={[
              { value: 'all', label: 'كل الأدوار' },
              { value: 'super_admin', label: '🔴 سوبر أدمن (1)' },
              { value: 'admin', label: '🟠 أدمن (1)' },
              { value: 'creator', label: '🟢 مبدع (6)' },
              { value: 'client', label: '🔵 عميل (4)' },
              { value: 'salariedEmployee', label: '🟣 موظف (5)' }
            ]}
            w={300}
            mb="md"
          />
        </Group>

        <Divider />

        {/* عرض المستخدمين */}
        <Tabs value={selectedRole} onChange={(value) => setSelectedRole((value as UserRole) || 'all')}>
          <Tabs.List justify="center" mb="xl">
            <Tabs.Tab value="all" leftSection={<UsersRound size={16} />}>
              الكل ({Object.values(allUsers).flat().length})
            </Tabs.Tab>
            <Tabs.Tab value="super_admin" leftSection={<ShieldCheck size={16} />} color="red">
              سوبر أدمن
            </Tabs.Tab>
            <Tabs.Tab value="admin" leftSection={<Settings size={16} />} color="orange">
              أدمن
            </Tabs.Tab>
            <Tabs.Tab value="creator" leftSection={<Camera size={16} />} color="green">
              مبدع (6)
            </Tabs.Tab>
            <Tabs.Tab value="client" leftSection={<Briefcase size={16} />} color="blue">
              عميل (4)
            </Tabs.Tab>
            <Tabs.Tab value="salariedEmployee" leftSection={<User size={16} />} color="brand">
              موظف (5)
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={selectedRole}>
            <Grid>
              {filteredUsers.map((user) => (
                <Grid.Col key={user.id} span={{ base: 12, sm: 6, lg: 4 }}>
                  <Card 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder
                    style={{ height: '100%' }}
                  >
                    <Stack gap="md" style={{ height: '100%' }}>
                      {/* هيدر المستخدم */}
                      <Group justify="space-between" align="flex-start">
                        <Group gap="sm">
                          <Avatar 
                            size="lg" 
                            radius="xl"
                            color={user.color}
                          >
                            {user.fullName.charAt(0)}
                          </Avatar>
                          <Stack gap={0}>
                            <Text fw={600} size="sm" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                              {user.fullName}
                            </Text>
                            <Badge 
                              size="xs" 
                              variant="light" 
                              color={user.color}
                            >
                              {user.userType}
                            </Badge>
                          </Stack>
                        </Group>
                        
                        <ActionIcon 
                          variant="light" 
                          color={user.color}
                          onClick={() => simulateLogin(user)}
                        >
                          <LogIn size={16} />
                        </ActionIcon>
                      </Group>

                      {/* تفاصيل المستخدم */}
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">
                          {user.description}
                        </Text>
                        
                        {user.stats && (
                          <Text size="xs" c="dimmed">
                            {user.stats}
                          </Text>
                        )}

                        <Group gap="xs" mt="xs">
                          <Badge size="xs" variant="outline">
                            {user.screensCount}
                          </Badge>
                          <Badge size="xs" variant="outline" color="gray">
                            {user.route}
                          </Badge>
                        </Group>

                        {/* صلاحيات خاصة */}
                        {user.role === 'super_admin' && (
                          <Alert color="red" variant="light">
                            <Text size="xs">🔐 impersonate + إدارة أدمنز</Text>
                          </Alert>
                        )}
                        
                        {user.role === 'creator' && user.onboardingStatus !== 'approved' && (
                          <Alert color="yellow" variant="light">
                            <Text size="xs">⏳ تحت المراجعة (خطوة {user.onboardingStep}/5)</Text>
                          </Alert>
                        )}
                        
                        {user.role === 'salariedEmployee' && (
                          <Alert color="brand" variant="light">
                            <Text size="xs">💰 لا يرى الأسعار (ضمن الراتب)</Text>
                          </Alert>
                        )}
                      </Stack>

                      {/* أزرار الاختبار */}
                      <Group gap="xs" mt="auto">
                        <Button
                          variant="light"
                          color={user.color}
                          size="sm"
                          fullWidth
                          leftSection={<LogIn size={16} />}
                          rightSection={<ChevronRight size={16} />}
                          onClick={() => simulateLogin(user)}
                        >
                          تسجيل دخول
                        </Button>
                        
                        <ActionIcon variant="subtle" color="gray">
                          <Eye size={16} />
                        </ActionIcon>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Tabs.Panel>
        </Tabs>

        <Divider />

        {/* إحصائيات سريعة */}
        <Card withBorder padding="lg">
          <Stack gap="md">
            <Title order={3} ta="center">
              📊 إحصائيات نظام الاختبار
            </Title>
            
            <Grid>
              <Grid.Col span={{ base: 6, sm: 3, lg: 2 }}>
                <Group justify="center">
                  <Stack align="center" gap={0}>
                    <Text size="xl" fw={700} c="red">
                      1
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      سوبر أدمن
                    </Text>
                  </Stack>
                </Group>
              </Grid.Col>
              
              <Grid.Col span={{ base: 6, sm: 3, lg: 2 }}>
                <Group justify="center">
                  <Stack align="center" gap={0}>
                    <Text size="xl" fw={700} c="orange">
                      1
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      أدمن
                    </Text>
                  </Stack>
                </Group>
              </Grid.Col>
              
              <Grid.Col span={{ base: 6, sm: 3, lg: 2 }}>
                <Group justify="center">
                  <Stack align="center" gap={0}>
                    <Text size="xl" fw={700} c="green">
                      {mockCreators.length}
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      مبدع
                    </Text>
                  </Stack>
                </Group>
              </Grid.Col>
              
              <Grid.Col span={{ base: 6, sm: 3, lg: 2 }}>
                <Group justify="center">
                  <Stack align="center" gap={0}>
                    <Text size="xl" fw={700} c="blue">
                      {mockClients.length}
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      عميل
                    </Text>
                  </Stack>
                </Group>
              </Grid.Col>
              
              <Grid.Col span={{ base: 6, sm: 3, lg: 2 }}>
                <Group justify="center">
                  <Stack align="center" gap={0}>
                    <Text size="xl" fw={700} c="brand">
                      {mockSalariedEmployees.length}
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      موظف براتب
                    </Text>
                  </Stack>
                </Group>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 3, lg: 2 }}>
                <Group justify="center">
                  <Stack align="center" gap={0}>
                    <Text size="xl" fw={700} c="dark">
                      {Object.values(allUsers).flat().length}
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      إجمالي المستخدمين
                    </Text>
                  </Stack>
      </Group>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* إرشادات الاختبار */}
        <Alert variant="light" color="green" title="🎯 كيفية اختبار الأدوار">
          <Stack gap="xs">
            <Text size="sm">
              <strong>1.</strong> اختر أي مستخدم من القائمة أعلاه
            </Text>
            <Text size="sm">
              <strong>2.</strong> اضغط &ldquo;تسجيل دخول&rdquo; لمحاكاة دخوله للنظام
            </Text>
            <Text size="sm">
              <strong>3.</strong> ستنتقل لشاشته المخصصة مع القائمة والصلاحيات المناسبة
            </Text>
            <Text size="sm">
              <strong>4.</strong> اختبر التنقل والبيانات المعروضة حسب دوره
            </Text>
            <Text size="sm">
              <strong>5.</strong> ارجع هنا لاختبار دور آخر
            </Text>
          </Stack>
        </Alert>

        {/* مقارنة سريعة للصلاحيات */}
        <Card withBorder padding="lg">
          <Title order={3} mb="md" ta="center">
            🔐 مقارنة الصلاحيات والشاشات
          </Title>
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Stack gap="xs">
                <Badge color="red" fullWidth size="lg">🔴 سوبر أدمن</Badge>
                <Text size="xs" fw={600} style={{ fontWeight: 'var(--font-weight-semibold)' }}>علي جواد الربيعي</Text>
                <Text size="xs">✅ إدارة كل شي (25+ شاشة)</Text>
                <Text size="xs">✅ إدارة أدمنز + إضافة/حذف</Text>
                <Text size="xs">✅ impersonate (دخول نيابة)</Text>
                <Text size="xs">✅ مراقبة النظام والصحة</Text>
                <Text size="xs">✅ كل التقارير المالية</Text>
                <Text size="xs">✅ تعديل هامش الوكالة</Text>
                <Divider my="xs" />
                <Badge size="xs" color="red" variant="outline">
                  صلاحيات غير محدودة
                </Badge>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Stack gap="xs">
                <Badge color="orange" fullWidth size="lg">🟠 أدمن عادي</Badge>
                <Text size="xs" fw={600} style={{ fontWeight: 'var(--font-weight-semibold)' }}>أحمد محمد حسن</Text>
                <Text size="xs">✅ إدارة مستخدمين (20+ شاشة)</Text>
                <Text size="xs">✅ إدارة مشاريع وتعيين</Text>
                <Text size="xs">❌ إدارة أدمنز آخرين</Text>
                <Text size="xs">❌ impersonate</Text>
                <Text size="xs">✅ تقارير محدودة</Text>
                <Text size="xs">❌ تعديل هامش الوكالة</Text>
                <Divider my="xs" />
                <Badge size="xs" color="orange" variant="outline">
                  صلاحيات محدودة
                </Badge>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Stack gap="xs">
                <Badge color="green" fullWidth size="lg">🟢 مبدع فريلانسر</Badge>
                <Text size="xs" fw={600} style={{ fontWeight: 'var(--font-weight-semibold)' }}>فاطمة أحمد علي (+ 5 آخرين)</Text>
                <Text size="xs">✅ مشاريعه المسندة فقط (14 شاشة)</Text>
                <Text size="xs">✅ سعره بعد موافقة الأدمن</Text>
                <Text size="xs">❌ أسعار العملاء أو الهامش</Text>
                <Text size="xs">✅ معرض أعماله (≤10 صور)</Text>
                <Text size="xs">✅ إدارة التوفر والجدولة</Text>
                <Text size="xs">✅ رفع ملفات العمل</Text>
                <Divider my="xs" />
                <Badge size="xs" color="green" variant="outline">
                  محدود بمشاريعه
                </Badge>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Stack gap="xs">
                <Badge color="blue" fullWidth size="lg">🔵 عميل</Badge>
                <Text size="xs" fw={600} style={{ fontWeight: 'var(--font-weight-semibold)' }}>محمد صالح أحمد (+ 3 آخرين)</Text>
                <Text size="xs">✅ مشاريعه فقط (12 شاشة)</Text>
                <Text size="xs">✅ السعر النهائي فقط</Text>
                <Text size="xs">❌ هامش الوكالة أو تفاصيل التكلفة</Text>
                <Text size="xs">✅ الفواتير والدفع</Text>
                <Text size="xs">✅ طلبات جديدة</Text>
                <Text size="xs">✅ تقييم المبدعين</Text>
                <Divider my="xs" />
                <Badge size="xs" color="blue" variant="outline">
                  محدود بأعماله
                </Badge>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Stack gap="xs">
                <Badge color="brand" fullWidth size="lg">🟣 موظف براتب</Badge>
                <Text size="xs" fw={600} style={{ fontWeight: 'var(--font-weight-semibold)' }}>سارة عبد الله محمد (+ 4 آخرين)</Text>
                <Text size="xs">✅ مهامه المسندة فقط (10 شاشات)</Text>
                <Text size="xs">❌ أي أسعار إطلاقاً</Text>
                <Text size="xs">✅ رفع تقارير العمل</Text>
                <Text size="xs">✅ تحديث حالة المهام</Text>
                <Text size="xs">✅ تقويم المهام</Text>
                <Text size="xs">✅ ملف شخصي محدود</Text>
                <Divider my="xs" />
                <Badge size="xs" color="brand" variant="outline">
                  مهام فقط - ضمن الراتب
                </Badge>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Stack gap="xs">
                <Alert color="gray" variant="light">
                  <Title order={5} size="xs">🔗 الربط والتكامل</Title>
                  <Text size="xs">
                    • كل دور يستخدم نفس التخطيط الأساسي
                    <br />
                    • البيانات مفلترة حسب الصلاحيات
                    <br />
                    • الألوان والأنماط من tokens.css
                    <br />
                    • القوائم ديناميكية حسب الدور
                  </Text>
                </Alert>
              </Stack>
            </Grid.Col>
          </Grid>
    </Card>

        {/* ملاحظة مطور */}
        <Alert variant="light" color="gray" title="🛠️ ملاحظة للمطور">
          <Text size="sm">
            هذه الصفحة للاختبار فقط. في الإنتاج، تسجيل الدخول يتم عبر Firebase Auth + OTP.
            كل دور له layout مخصص وبيانات مفلترة حسب الصلاحيات من roles-matrix.md.
          </Text>
        </Alert>
      </Stack>
    </Container>
  );
}