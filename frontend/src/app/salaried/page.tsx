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
  ThemeIcon,
  Avatar
} from '@mantine/core';
import {
  Briefcase,
  Upload,
  Calendar,
  Clock,
  Check,
  ClipboardList,
  User,
  LineChart
} from 'lucide-react';

import ProjectsTable from '@/components/projects/ProjectsTable';

// البيانات الوهمية للموظف الحالي
import { mockSalariedEmployees } from '@/data/employees';
import { mockProjects } from '@/data/projects';
import { CountUp } from '@/shared/motion';

export default function SalariedDashboard() {
  // الموظف الحالي (محاكاة - في الحقيقة يجي من authentication)
  const currentEmployee = mockSalariedEmployees[0]; // سارة عبد الله محمد - مصورة
  
  // المشاريع المسندة للموظف (محاكاة حتمية: نعتمد وجود معرف الموظف ضمن assignedCreators)
  const assignedProjects = mockProjects
    .filter(p => p.lineItems.some(item => item.assignedCreators.some(id => id === currentEmployee.id)))
    .slice(0, 3);
  
  // إحصائيات المهام
  const activeTasks = 3; // محاكاة
  const completedTasks = 24; // محاكاة  
  const pendingTasks = 2; // محاكاة

  return (
    <Container size="xl" py="lg">
      <Stack gap="xl">
        {/* ترحيب مخصص للموظف */}
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Avatar 
              size="xl" 
              radius="xl"
              color="brand"
            >
              {currentEmployee.fullName.charAt(0)}
            </Avatar>
            <Stack gap="xs">
              <Title order={1} size="xl">
                مرحباً، {currentEmployee.fullName}! 💼
              </Title>
              <Text c="dimmed" size="sm">
                {currentEmployee.jobTitle} - قسم {currentEmployee.department}
              </Text>
              <Group gap="xs">
                <Badge variant="light" color="brand">
                  {currentEmployee.employmentType === 'full_time' ? 'دوام كامل' : 
                   currentEmployee.employmentType === 'part_time' ? 'دوام جزئي' : 'تعاقد'}
                </Badge>
                <Badge variant="outline" color="green">
                  نشط منذ {currentEmployee.startDate}
                </Badge>
              </Group>
            </Stack>
          </Group>
          
          <Group gap="sm">
            <Button 
              variant="filled" 
              color="brand"
              leftSection={<Upload size={18} />}
            >
              رفع تقرير
            </Button>
            <ActionIcon variant="light" size="lg" color="brand">
              <Calendar size={20} />
            </ActionIcon>
          </Group>
        </Group>

        {/* مؤشرات المهام - بدون أسعار */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    مهام نشطة
                  </Text>
                  <Text size="xl" fw={700}>
                    <CountUp value={activeTasks} />
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
                    مهام مكتملة
                  </Text>
                  <Text size="xl" fw={700}>
                    <CountUp value={completedTasks} />
                  </Text>
                  <Text size="xs" c="green">
                    هذا الشهر
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
                    مهام معلقة
                  </Text>
                  <Text size="xl" fw={700}>
                    <CountUp value={pendingTasks} />
                  </Text>
                  <Text size="xs" c="orange">
                    تحتاج متابعة
                  </Text>
                </Stack>
                <ThemeIcon size="xl" radius="md" variant="light" color="orange">
                  <ClipboardList size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    معدل الإنجاز
                  </Text>
                  <Text size="xl" fw={700}>
                    96%
                  </Text>
                  <Text size="xs" c="green">
                    أداء ممتاز
                  </Text>
                </Stack>
                <ThemeIcon size="xl" radius="md" variant="light" color="green">
                  <LineChart size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Divider />

        {/* المهارات والتخصص */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="lg">
              مهاراتي والتخصص
            </Title>
            
            <Group gap="sm">
              {currentEmployee.skills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="light" 
                  color="brand" 
                  size="lg"
                >
                  {skill.replace('_', ' ')}
                </Badge>
              ))}
            </Group>
            
            <Text size="sm" c="dimmed">
              القسم: {currentEmployee.department} • 
              النوع: {currentEmployee.employmentType}
            </Text>
          </Stack>
        </Card>

        {/* مهامي */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3} size="lg">
                مهامي
              </Title>
              <Badge variant="light" color="brand">
                {assignedProjects.length} مهمة
              </Badge>
            </Group>
            
            <ProjectsTable role="salaried" userId={currentEmployee.id} />
          </Stack>
        </Card>

        {/* إجراءات سريعة للموظف */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="lg">
              إجراءات سريعة
          </Title>
            
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="brand"
                  size="md"
                  fullWidth
                  leftSection={<Briefcase size={20} />}
                >
                  مهامي
                </Button>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="blue"
                  size="md"
                  fullWidth
                  leftSection={<Calendar size={20} />}
                >
                  التقويم
                </Button>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="orange"
                  size="md"
                  fullWidth
                  leftSection={<Upload size={20} />}
                >
                  رفع تقرير
                </Button>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="green"
                  size="md"
                  fullWidth
                  leftSection={<User size={20} />}
                >
                  ملفي الشخصي
                </Button>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* تنبيه مهم حول عدم رؤية الأسعار */}
  <Alert variant="light" color="brand" title="🧪 وضع الاختبار - دور الموظف براتب">
          <Text size="sm">
            أنت الآن تختبر شاشة <strong>الموظف براتب الثابت</strong>. هذا الموظف يرى:
            <br />
            • مهامه المسندة فقط (لا يرى مهام موظفين آخرين)
            <br />
            • <strong>لا يرى أي أسعار إطلاقاً</strong> (creatorPrice أو clientPrice)
            <br />
            • تفاصيل المهام والتواريخ بدون أي معلومات مالية
            <br />
            • إمكانية رفع التقارير وتحديث حالة المهام
            <br />
            <br />
            البيانات المعروضة مأخوذة من: <code>mockSalariedEmployees[0]</code> - سارة عبد الله محمد
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
              color="brand" 
              size="sm"
            >
              🔄 جرب موظف آخر
            </Button>
          </Group>
        </Alert>

        {/* معلومات الوظيفة */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="lg">
              معلومات الوظيفة
            </Title>
            
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">القسم</Text>
                  <Badge variant="light" color="brand" size="lg">
                    {currentEmployee.department === 'photography' ? '📷 تصوير' :
                     currentEmployee.department === 'videography' ? '🎬 فيديو' :
                     currentEmployee.department === 'design' ? '🎨 تصميم' :
                     currentEmployee.department === 'editing' ? '✂️ مونتاج' : '🏢 إداري'}
        </Badge>
                </Stack>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">تاريخ الانضمام</Text>
                  <Text fw={500}>
                    {currentEmployee.startDate}
        </Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
