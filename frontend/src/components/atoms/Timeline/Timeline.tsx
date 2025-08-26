import React from 'react';
import { Timeline as MantineTimeline, TimelineProps, TimelineItemProps } from '@mantine/core';

/**
 * خصائص عنصر الخط الزمني
 */
export interface TimelineItemComponentProps extends TimelineItemProps {
  /** عنوان العنصر */
  title?: React.ReactNode;
  /** محتوى العنصر */
  children?: React.ReactNode;
  /** أيقونة العنصر */
  bullet?: React.ReactNode;
  /** حجم النقطة */
  bulletSize?: number;
  /** لون العنصر */
  color?: string;
  /** موضع الخط */
  lineVariant?: 'solid' | 'dashed' | 'dotted';
}

/**
 * خصائص مكون الخط الزمني
 */
export interface TimelineComponentProps extends TimelineProps {
  /** عناصر الخط الزمني */
  children: React.ReactNode;
}

/**
 * عنصر الخط الزمني
 */
export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemComponentProps>(
  ({ 
    title,
    children,
    bullet,
    color,
    ...props 
  }, ref) => {
    return (
      <MantineTimeline.Item
        ref={ref}
        title={title}
        bullet={bullet}
        color={color}
        {...props}
      >
        {children}
      </MantineTimeline.Item>
    );
  }
);

TimelineItem.displayName = 'TimelineItem';

/**
 * مكون الخط الزمني - Timeline
 * يعرض سلسلة من الأحداث بشكل زمني مرتب
 */
const Timeline = React.forwardRef<HTMLDivElement, TimelineComponentProps>(
  ({ 
    children,
    ...props 
  }, ref) => {
    return (
      <MantineTimeline
        ref={ref}
        {...props}
      >
        {children}
      </MantineTimeline>
    );
  }
);

Timeline.displayName = 'Timeline';

// إضافة TimelineItem كـ sub-component
const TimelineWithItem = Timeline as typeof Timeline & {
  Item: typeof TimelineItem;
};

TimelineWithItem.Item = TimelineItem;

export default TimelineWithItem;
