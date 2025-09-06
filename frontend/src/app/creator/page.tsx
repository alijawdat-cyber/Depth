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
  Alert,
  ThemeIcon,
  Avatar
} from '@mantine/core';
  import {
    Camera,
    Upload,
    Calendar,
    Star,
    Clock,
    Check,
  LineChart
  } from 'lucide-react';

import ProjectsTable from '@/components/projects/ProjectsTable';

// البيانات الوهمية للمبدع الحالي
import { mockCreators } from '@/data/creators';
import { mockProjects } from '@/data/projects';
import { CountUp } from '@/shared/motion';

export default function CreatorDashboard() {
  // المبدع الحالي (محاكاة - في الحقيقة يجي من authentication)
  const currentCreator = mockCreators[0]; // فاطمة أحمد علي - خبيرة التصوير
  
  // فلترة المشاريع المسندة للمبدع الحالي
  const assignedProjects = mockProjects.filter(p => 
    p.creatorId === currentCreator.id || 
    p.lineItems.some(item => item.assignedCreators.includes(currentCreator.id))
  );
  
  // إحصائيات المبدع
  const activeProjects = assignedProjects.filter(p => p.status === 'active').length;
  const completedProjects = currentCreator.completedProjects;
  // const pendingProjects = assignedProjects.filter(p => p.status === 'pending').length;

  return (
    <Container size="xl" py="lg">
      <Stack gap="xl">
        {/* ترحيب مخصص للمبدع */}
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Avatar 
              size="xl" 
              radius="xl"
              color="green"
              src={currentCreator.profileImage}
            >
              {currentCreator.fullName.charAt(0)}
            </Avatar>
            <Stack gap="xs">
              <Title order={1} size="xl">
                مرحباً، {currentCreator.displayName}! 🎨
              </Title>
              <Text c="dimmed" size="sm">
                {currentCreator.bio}
              </Text>
              <Group gap="xs">
                <Badge variant="light" color="green">
                  {currentCreator.experienceLevel === 'expert' ? 'خبير' :
                   currentCreator.experienceLevel === 'experienced' ? 'متمرس' : 'مبتدئ'}
                </Badge>
                <Badge variant="outline" color="blue">
                  ⭐ {currentCreator.rating}/5
                </Badge>
                <Badge variant="outline" color="brand">
                  {currentCreator.equipmentTier === 'platinum' ? '🥇 بلاتيني' :
                   currentCreator.equipmentTier === 'gold' ? '🥈 ذهبي' : '🥉 فضي'}
                </Badge>
              </Group>
            </Stack>
          </Group>
          
          <Group gap="sm">
            <Button 
              variant="filled" 
              color="green"
              leftSection={<Upload size={18} />}
            >
              رفع عمل جديد
            </Button>
          </Group>
        </Group>

        {/* مؤشرات الأداء - مخصصة للمبدع */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    مشاريع نشطة
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
                    إنجاز ممتاز
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
                    التقييم الحالي
                  </Text>
                  <Text size="xl" fw={700}>
                    ⭐ {currentCreator.rating}/5
                  </Text>
                  <Text size="xs" c="green">
                    {currentCreator.totalReviews} تقييم
                  </Text>
                </Stack>
                <ThemeIcon size="xl" radius="md" variant="light" color="yellow">
                  <Star size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    زمن الاستجابة
                  </Text>
                  <Text size="xl" fw={700}>
                    {currentCreator.responseTimeHours}ساعة
                  </Text>
                  <Text size="xs" c="green">
                    سرعة ممتازة
                  </Text>
                </Stack>
                <ThemeIcon size="xl" radius="md" variant="light" color="green">
                  <Clock size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Divider />

        {/* التخصصات والمهارات */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="lg">
              تخصصاتي ومهاراتي
            </Title>
            
            <Group gap="sm">
              {currentCreator.specialties.map((specialty) => (
                <Badge 
                  key={specialty} 
                  variant="light" 
                  color="green" 
                  size="lg"
                  leftSection={
                    specialty === 'photo' ? '📷' :
                    specialty === 'video' ? '🎬' :
                    specialty === 'design' ? '🎨' : '✂️'
                  }
                >
                  {specialty === 'photo' ? 'تصوير' :
                   specialty === 'video' ? 'فيديو' :
                   specialty === 'design' ? 'تصميم' : 'مونتاج'}
                </Badge>
              ))}
            </Group>
            
            <Text size="sm" c="dimmed">
              سنوات الخبرة: {currentCreator.yearsOfExperience} سنة • 
              حالة التوفر: {currentCreator.isAvailable ? '🟢 متاح' : '🔴 مشغول'}
            </Text>
          </Stack>
        </Card>

        {/* مشاريعي */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3} size="lg">
                مشاريعي
              </Title>
              <Badge variant="light" color="green">
                {assignedProjects.length} مشروع
              </Badge>
            </Group>
            
            <ProjectsTable role="creator" userId={currentCreator.id} />
          </Stack>
        </Card>

        {/* إجراءات سريعة للمبدع */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3} size="lg">
              إجراءات سريعة
        </Title>
        
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button
                  variant="light"
                  color="green"
                  size="md"
                  fullWidth
                  leftSection={<Camera size={20} />}
                >
                  معرض أعمالي
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
                  إدارة التوفر
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
                  رفع ملفات
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
                  إحصائياتي
                </Button>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* ملاحظة حول رؤية الأسعار */}
        <Alert variant="light" color="green" title="🧪 وضع الاختبار - دور المبدع">
          <Text size="sm">
            أنت الآن تختبر شاشة <strong>المبدع الفريلانسر</strong>. هذا المبدع يرى:
            <br />
            • مشاريعه المسندة فقط (لا يرى مشاريع مبدعين آخرين)
            <br />
            • سعره الشخصي <strong>بعد موافقة الأدمن فقط</strong>
            <br />
            • <strong>لا يرى أبداً</strong> السعر النهائي للعميل أو هامش الوكالة
            <br />
            • معرض أعماله (≤10 صور) وإدارة التوفر
            <br />
            <br />
            البيانات المعروضة مأخوذة من: <code>mockCreators[0]</code> - فاطمة أحمد علي
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
              color="green" 
              size="sm"
            >
              🔄 جرب مبدع آخر
            </Button>
          </Group>
        </Alert>

        {/* معرض الأعمال (عينة) */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3} size="lg">
                معرض أعمالي (≤10 صور)
              </Title>
        <Text size="sm" c="dimmed">
                {currentCreator.portfolioImages?.length || 0}/10 صور
        </Text>
            </Group>
            
            <Grid>
              {currentCreator.portfolioImages?.slice(0, 6).map((image, index) => (
                <Grid.Col key={index} span={{ base: 6, sm: 4, md: 2 }}>
                  <Card p="xs" withBorder style={{ aspectRatio: '1/1' }}>
                    <Group justify="center" align="center" style={{ height: '100%' }}>
                      <Text size="xl">🖼️</Text>
                    </Group>
                  </Card>
                </Grid.Col>
              )) || (
                <Grid.Col span={12}>
                  <Alert variant="light" color="yellow" icon={<Camera size={16} />}>
                    أضف أعمالك لمعرض البورتفوليو لجذب عملاء أكثر!
                  </Alert>
                </Grid.Col>
              )}
            </Grid>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
