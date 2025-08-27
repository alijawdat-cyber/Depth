'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Container, 
  Title, 
  Text, 
  Grid, 
  Card, 
  Button, 
  Badge,
  Group,
  Stack,
  Box
} from '@mantine/core';
import { 
  Shield, 
  Users, 
  Palette, 
  Building,
  CreditCard,
  FileText,
  Settings,
  ChevronRight
} from 'lucide-react';
import styles from './HomePage.module.css';

// بيانات البطاقات للأدوار المختلفة
const roleCards = [
  {
    id: 'admin',
    title: 'شاشات الإدارة',
    description: 'إدارة النظام، المستخدمين، والطلبات',
    icon: <Shield size={32} />,
    color: 'red',
    href: '/admin',
    features: ['لوحة التحكم', 'إدارة المستخدمين', 'تقارير النظام', 'إعدادات الأمان'],
    screensCount: 16
  },
  {
    id: 'client',
    title: 'شاشات العميل',
    description: 'تصفح وطلب الخدمات الإبداعية',
    icon: <Building size={32} />,
    color: 'blue',
    href: '/client',
    features: ['تصفح الخدمات', 'إنشاء طلبات', 'متابعة المشاريع', 'المدفوعات'],
    screensCount: 12
  },
  {
    id: 'creator',
    title: 'شاشات المبدع',
    description: 'إدارة الأعمال والمشاريع الإبداعية',
    icon: <Palette size={32} />,
    color: 'green',
    href: '/creator',
    features: ['معرض الأعمال', 'إدارة الطلبات', 'الملف الشخصي', 'الإحصائيات'],
    screensCount: 14
  },
  {
    id: 'salaried',
    title: 'شاشات الموظف',
    description: 'إدارة المهام والمشاريع المُكلف بها',
    icon: <Users size={32} />,
    color: 'orange',
    href: '/salaried',
    features: ['لوحة المهام', 'تتبع الوقت', 'التقارير', 'التعاون'],
    screensCount: 10
  }
];

export default function Home() {
  return (
    <Box className={styles.homeContainer}>
      <Container size="xl" py={60}>
        {/* Header Section */}
        <Stack align="center" mb={60}>
          <Title 
            order={1} 
            size="3.5rem" 
            fw={800} 
            ta="center"
            className={styles.titleGradient}
          >
            منصة Depth
          </Title>
          
          <Text 
            size="xl" 
            ta="center" 
            c="dimmed" 
            maw={600}
            style={{ lineHeight: 1.6 }}
          >
            مرحباً بك في منصة Depth للخدمات الإبداعية. اختر نوع المستخدم لاستكشاف الشاشات والوظائف المخصصة لكل دور.
          </Text>
          
          <Badge size="lg" variant="light" color="blue">
            نظام اختبار الشاشات والواجهات
          </Badge>
        </Stack>

        {/* Role Cards Grid */}
        <Grid>
          {roleCards.map((role) => (
            <Grid.Col key={role.id} span={{ base: 12, sm: 6, lg: 6 }}>
              <Card 
                shadow="md" 
                padding="xl" 
                radius="lg"
                className={styles.roleCard}
              >
                <Stack gap="md">
                  {/* Card Header */}
                  <Group justify="space-between" align="flex-start">
                    <Box className={`${styles.iconBox} ${styles[role.color]}`}>
                      {role.icon}
                    </Box>
                    <Badge 
                      color={role.color} 
                      size="sm"
                      variant="light"
                    >
                      {role.screensCount} شاشة
                    </Badge>
                  </Group>

                  {/* Card Content */}
                  <Stack gap="sm">
                    <Title order={3} size="1.5rem" fw={600}>
                      {role.title}
                    </Title>
                    
                    <Text c="dimmed" size="md" style={{ lineHeight: 1.5 }}>
                      {role.description}
                    </Text>

                    {/* Features List */}
                    <Stack gap="xs" mt="sm">
                      {role.features.map((feature, index) => (
                        <Group key={index} gap="xs">
                          <Box className={`${styles.featureDot} ${styles[role.color]}`} />
                          <Text size="sm" c="dimmed">
                            {feature}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </Stack>

                  {/* Card Action */}
                  <Link href={role.href} style={{ textDecoration: 'none' }}>
                    <Button
                      fullWidth
                      size="md"
                      color={role.color}
                      variant="light"
                      rightSection={<ChevronRight size={16} />}
                      mt="auto"
                    >
                      استكشاف الشاشات
                    </Button>
                  </Link>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Footer Section */}
        <Stack align="center" mt={80} gap="md">
          <Group gap="lg">
            <Badge leftSection={<FileText size={14} />} variant="outline">
              وثائق التطوير
            </Badge>
            <Badge leftSection={<Settings size={14} />} variant="outline">
              إعدادات النظام
            </Badge>
            <Badge leftSection={<CreditCard size={14} />} variant="outline">
              معلومات الدفع
            </Badge>
          </Group>
          
          <Text size="sm" c="dimmed" ta="center">
            © 2025 منصة Depth. جميع الحقوق محفوظة.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
