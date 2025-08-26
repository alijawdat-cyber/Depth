import React from 'react';
import { List as MantineList, ListProps, ListItemProps } from '@mantine/core';

/**
 * خصائص عنصر القائمة
 */
export interface ListItemComponentProps extends ListItemProps {
  /** محتوى العنصر */
  children: React.ReactNode;
  /** أيقونة العنصر */
  icon?: React.ReactNode;
}

/**
 * خصائص مكون القائمة
 */
export interface ListComponentProps extends ListProps {
  /** عناصر القائمة */
  children: React.ReactNode;
  /** نوع القائمة */
  type?: 'ordered' | 'unordered';
  /** ترقيم القائمة المرتبة */
  withPadding?: boolean;
  /** رمز القائمة غير المرتبة */
  icon?: React.ReactNode;
  /** المسافات */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** حجم النص */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** موضع الأيقونة */
  listStyleType?: string;
  /** وسط العنصر */
  center?: boolean;
}

/**
 * عنصر القائمة
 */
export const ListItem = React.forwardRef<HTMLLIElement, ListItemComponentProps>(
  ({ 
    children,
    icon,
    ...props 
  }, ref) => {
    return (
      <MantineList.Item
        ref={ref}
        icon={icon}
        {...props}
      >
        {children}
      </MantineList.Item>
    );
  }
);

ListItem.displayName = 'ListItem';

/**
 * مكون القائمة - List
 * يعرض قائمة من العناصر بشكل مرتب أو غير مرتب
 */
const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListComponentProps>(
  ({ 
    children,
    type = 'unordered',
    withPadding = true,
    icon,
    spacing = 'sm',
    size = 'sm',
    listStyleType,
    center = false,
    ...props 
  }, ref) => {
    return (
      <MantineList
        ref={ref}
        type={type}
        withPadding={withPadding}
        icon={icon}
        spacing={spacing}
        size={size}
        listStyleType={listStyleType}
        center={center}
        {...props}
      >
        {children}
      </MantineList>
    );
  }
);

List.displayName = 'List';

// إضافة ListItem كـ sub-component
const ListWithItem = List as typeof List & {
  Item: typeof ListItem;
};

ListWithItem.Item = ListItem;

export default ListWithItem;
