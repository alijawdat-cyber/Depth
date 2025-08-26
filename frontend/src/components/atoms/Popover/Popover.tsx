import React from 'react';
import { Popover as MantinePopover, PopoverProps } from '@mantine/core';

/**
 * خصائص مكون النافذة المنبثقة
 */
export interface PopoverComponentProps extends Omit<PopoverProps, 'children'> {
  /** المحتوى المُحفِّز للنافذة المنبثقة */
  children: React.ReactNode;
  /** محتوى النافذة المنبثقة */
  target?: React.ReactNode;
  /** النص المعروض داخل النافذة المنبثقة */
  content?: React.ReactNode;
  /** موضع النافذة المنبثقة نسبة للمُحفِّز */
  position?: 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 
             'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 
             'left-start' | 'left-end';
  /** الحدث المُحفِّز للنافذة المنبثقة */
  trigger?: 'click' | 'hover' | 'focus';
  /** المسافة بين النافذة المنبثقة والمُحفِّز */
  offset?: number;
  /** عرض النافذة المنبثقة */
  width?: number | string;
  /** إمكانية الوصول - معرف للتحكم */
  ariaLabel?: string;
}

/**
 * مكون النافذة المنبثقة - Popover
 * يعرض محتوى إضافي في نافذة منبثقة عند التفاعل مع عنصر معين
 */
const Popover = React.forwardRef<HTMLDivElement, PopoverComponentProps>(
  ({ 
    children, 
    target,
    content,
    position = 'bottom',
    trigger = 'click',
    offset = 5,
    width = 200,
    ariaLabel,
    ...props 
  }, ref) => {
    return (
      <MantinePopover
        position={position}
        offset={offset}
        width={width}
        {...(trigger === 'click' && { clickOutsideEvents: ['mousedown', 'touchstart'] })}
        {...(trigger === 'hover' && { 
          mouseEnterDelay: 0,
          mouseLeaveDelay: 150
        })}
        {...props}
      >
        <MantinePopover.Target>
          <div ref={ref} role="button" aria-label={ariaLabel}>
            {children}
          </div>
        </MantinePopover.Target>
        <MantinePopover.Dropdown>
          {content || target}
        </MantinePopover.Dropdown>
      </MantinePopover>
    );
  }
);

Popover.displayName = 'Popover';

export default Popover;
