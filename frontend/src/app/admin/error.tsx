'use client';

import React from 'react';
import {
  Container,
  Center,
  Stack,
  Text,
  Button,
  ThemeIcon,
  Alert,
  Group
} from '@mantine/core';
import {
  AlertTriangle,
  RefreshCw,
  Home
} from 'lucide-react';

// ================================
// شاشة الخطأ الموحدة للأدمن
// ================================

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: Props) {
  return (
    <Container size="xl" className="admin-main">
  <Center style={{ minHeight: 'calc(100dvh - var(--header-height))' }}>
  <Stack gap="lg" align="center" style={{ maxWidth: 'min(100%, var(--sidebar-width))' }}>
          <ThemeIcon size="xl" radius="xl" variant="light" color="red">
            <AlertTriangle size={40} />
          </ThemeIcon>
          
          <Stack gap="sm" align="center">
            <Text size="xl" fw={700} c="red" ta="center">
              حدث خطأ غير متوقع
            </Text>
            <Text size="md" c="dimmed" ta="center">
              عذراً، حدث خطأ أثناء تحميل لوحة التحكم. يرجى المحاولة مرة أخرى.
            </Text>
          </Stack>

          {/* تفاصيل الخطأ للمطورين */}
          {process.env.NODE_ENV === 'development' && (
            <Alert
              variant="light"
              color="red"
              title="تفاصيل الخطأ (للمطورين فقط)"
              style={{ width: '100%', textAlign: 'left', direction: 'ltr' }}
            >
              <Text size="xs" ff="monospace">
                {error.message}
              </Text>
              {error.digest && (
                <Text size="xs" c="dimmed" mt="xs">
                  Error ID: {error.digest}
                </Text>
              )}
            </Alert>
          )}

          {/* أزرار الإجراءات */}
          <Group gap="sm">
            <Button
              variant="filled"
              color="blue"
              leftSection={<RefreshCw size={16} />}
              onClick={reset}
            >
              المحاولة مرة أخرى
            </Button>
            <Button
              variant="light"
              color="gray"
              leftSection={<Home size={16} />}
              component="a"
              href="/admin"
            >
              العودة للرئيسية
            </Button>
          </Group>
        </Stack>
      </Center>
    </Container>
  );
}
