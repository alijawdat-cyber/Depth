import React from 'react';
import { NumberFormatterProps } from '@mantine/core';

/**
 * خصائص مكون منسق الأرقام
 */
export interface NumberFormatterComponentProps extends Omit<NumberFormatterProps, 'style' | 'value'> {
  /** القيمة الرقمية المراد تنسيقها */
  value: number | string;
  /** رمز العملة (اختياري) */
  prefix?: string;
  /** نص اللاحقة (اختياري) */
  suffix?: string;
  /** عدد المنازل العشرية */
  decimalScale?: number;
  /** فاصل الآلاف */
  thousandSeparator?: string | boolean;
  /** فاصل العشريات */
  decimalSeparator?: string;
  /** إخفاء الأصفار الزائدة */
  hideEmptyDecimals?: boolean;
  /** تحديد اللغة للتنسيق */
  locale?: string;
  /** نمط التنسيق */
  numberStyle?: 'decimal' | 'currency' | 'percent' | 'unit';
  /** رمز العملة للتنسيق */
  currency?: string;
  /** وحدة القياس للتنسيق */
  unit?: string;
}

/**
 * مكون منسق الأرقام - NumberFormatter
 * يقوم بتنسيق وعرض الأرقام بطرق مختلفة (عملة، نسبة مئوية، وحدات)
 */
const NumberFormatter = React.forwardRef<HTMLSpanElement, NumberFormatterComponentProps>(
  ({ 
    value,
    prefix,
    suffix,
    decimalScale = 2,
    thousandSeparator = true,
    decimalSeparator = '.',
    hideEmptyDecimals = false,
    locale = 'ar-SA',
    numberStyle = 'decimal',
    currency = 'SAR',
    unit,
    ...props 
  }, ref) => {
    // تحويل القيمة لرقم
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // إذا كانت القيمة غير صحيحة
    if (isNaN(numericValue)) {
      return <span ref={ref}>--</span>;
    }

    // استخدام Intl.NumberFormat للتنسيق المحلي
    let formattedValue: string;
    
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: numberStyle,
        currency: numberStyle === 'currency' ? currency : undefined,
        unit: numberStyle === 'unit' ? unit : undefined,
        minimumFractionDigits: hideEmptyDecimals ? 0 : decimalScale,
        maximumFractionDigits: decimalScale,
        useGrouping: !!thousandSeparator,
      });
      
      formattedValue = formatter.format(numericValue);
      
      // تخصيص فاصل العشريات إذا لم يكن النقطة
      if (decimalSeparator !== '.' && formattedValue.includes('.')) {
        formattedValue = formattedValue.replace('.', decimalSeparator);
      }
      
      // تخصيص فاصل الآلاف إذا كان نص
      if (typeof thousandSeparator === 'string' && formattedValue.includes(',')) {
        formattedValue = formattedValue.replace(/,/g, thousandSeparator);
      }
      
    } catch {
      // الرجوع للتنسيق الأساسي في حالة الخطأ
      formattedValue = numericValue.toLocaleString(locale, {
        minimumFractionDigits: hideEmptyDecimals ? 0 : decimalScale,
        maximumFractionDigits: decimalScale,
      });
    }

    // إضافة البادئة واللاحقة
    const finalValue = `${prefix || ''}${formattedValue}${suffix || ''}`;

    return (
      <span
        ref={ref}
        {...props}
      >
        {finalValue}
      </span>
    );
  }
);

NumberFormatter.displayName = 'NumberFormatter';

export default NumberFormatter;
