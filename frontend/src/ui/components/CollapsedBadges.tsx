'use client';

import React from 'react';
import { Badge, Group, Popover, ScrollArea } from '@mantine/core';

type Item = { id: string; label: string };

type Props = {
  items: Array<Item | string>;
  maxVisible?: number; // عدد الشارات المعروضة
  color?: string; // لون Mantine
  size?: 'xs' | 'sm' | 'md';
  emptyFallback?: React.ReactNode; // عرض بديل إذا فارغة
};

export function CollapsedBadges({ items, maxVisible = 3, color = 'blue', size = 'sm', emptyFallback = <span>—</span> }: Props) {
  const norm: Item[] = React.useMemo(() => (
    (items || []).map((it) => typeof it === 'string' ? { id: it, label: it } : it)
  ), [items]);

  if (!norm.length) return <>{emptyFallback}</>;

  const visible = norm.slice(0, Math.max(0, maxVisible));
  const rest = norm.slice(visible.length);
  const hidden = rest.length;

  return (
    <Group gap="xs" justify="center" wrap="wrap" data-collapsed-badges>
      {visible.map((it) => (
        <Badge key={it.id} variant="light" color={color} size={size}>{it.label}</Badge>
      ))}

      {hidden > 0 && (
  <Popover position="bottom" withArrow>
          <Popover.Target>
            <Badge variant="outline" color={color} size={size} aria-label={`عرض ${hidden} المزيد`}>+{hidden}</Badge>
          </Popover.Target>
  <Popover.Dropdown>
            <ScrollArea.Autosize mah={240} maw={320}>
        <Group gap="xs" justify="center" wrap="wrap" data-collapsed-badges>
                {norm.map((it) => (
      <Badge key={`all-${it.id}`} variant="outline" color={color} size={size}>{it.label}</Badge>
                ))}
              </Group>
            </ScrollArea.Autosize>
          </Popover.Dropdown>
        </Popover>
      )}
    </Group>
  );
}

export default CollapsedBadges;
