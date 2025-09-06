"use client";
import React, { useState } from 'react';
import { Badge, Card, Divider, Group, NumberInput, Stack, Text, Title } from '@mantine/core';
import { PercentDiamond } from 'lucide-react';
import { mockAgencyMarginConfig, mockSystemSettings } from '@/data';

export function MarginsTab(){
  const [previewMargin, setPreviewMargin] = useState<number>(mockSystemSettings.defaultMarginPercent);
  return (
    <Card withBorder radius="md" data-density="compact">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs" align="center">
            <PercentDiamond size={18} />
            <Title order={3}>إعدادات الهامش</Title>
          </Group>
          <Badge variant="light" color="blue">عرض تجريبي</Badge>
        </Group>

        <Stack gap="xs">
          <Text c="dimmed">الهامش الافتراضي المستخدم بالحسابات (من النظام):</Text>
          <Text fw={600}><span dir="ltr">{mockSystemSettings.defaultMarginPercent}%</span></Text>
        </Stack>

        <Divider />

        <Stack gap="xs">
          <Text c="dimmed">إعداد هوامش الوكالة (موك للعرض):</Text>
          <Text>القاعدة: <span dir="ltr">{mockAgencyMarginConfig.basePercentage}%</span></Text>
          <Text c="dimmed">معاينة قيمة مختلفة (لا تحفظ):</Text>
          <Group gap="sm" wrap="wrap">
            <NumberInput
              value={previewMargin}
              onChange={(v) => setPreviewMargin(Number(v) || mockSystemSettings.defaultMarginPercent)}
              step={0.25}
              min={0}
              max={100}
              suffix=" %"
              aria-label="معاينة الهامش"
            />
            <Badge variant="light">المعاينة: <span dir="ltr">{previewMargin}%</span></Badge>
          </Group>
          <Text size="sm" c="dimmed">التغيير هنا للعرض فقط ولا يؤثر على الحسابات.</Text>
        </Stack>
      </Stack>
    </Card>
  );
}
