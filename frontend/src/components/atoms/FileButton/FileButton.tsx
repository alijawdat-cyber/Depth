"use client";
import React from 'react';
import { FileButton as MantineFileButton } from '@mantine/core';

export interface FileButtonProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** File change handler */
  onChange: (file: File | null) => void;
  /** Accept attribute for file input */
  accept?: string;
  /** Whether input allows multiple files */
  multiple?: boolean;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Children to render (button content) */
  children: (props: { onClick: () => void }) => React.ReactNode;
  /** Name attribute for file input */
  name?: string;
  /** Form attribute */
  form?: string;
  /** Input props */
  inputProps?: React.ComponentPropsWithoutRef<'input'>;
}

export interface FileButtonMultipleProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** File change handler for multiple files */
  onChange: (files: File[]) => void;
  /** Accept attribute for file input */
  accept?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Children to render (button content) */
  children: (props: { onClick: () => void }) => React.ReactNode;
  /** Name attribute for file input */
  name?: string;
  /** Form attribute */
  form?: string;
  /** Input props */
  inputProps?: React.ComponentPropsWithoutRef<'input'>;
}

/**
 * FileButton component for file uploads
 * Built on top of Mantine FileButton with design token integration
 */
export const FileButton: React.FC<FileButtonProps> = ({
  onChange,
  accept,
  multiple = false,
  disabled = false,
  children,
  name,
  form,
  inputProps,
  ...props
}) => {

  const handleChange = (payload: File | File[] | null) => {
    if (multiple) {
      // This shouldn't happen in single file mode, but handle it gracefully
      onChange(Array.isArray(payload) ? payload[0] : payload);
    } else {
      onChange(Array.isArray(payload) ? payload[0] : payload);
    }
  };

  return (
    <MantineFileButton
      onChange={handleChange}
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      name={name}
      form={form}
      inputProps={inputProps}
      {...props}
    >
      {children}
    </MantineFileButton>
  );
};

/**
 * FileButton component for multiple file uploads
 */
export const FileButton_Multiple: React.FC<FileButtonMultipleProps> = ({
  onChange,
  accept,
  disabled = false,
  children,
  name,
  form,
  inputProps,
  ...props
}) => {

  const handleChange = (payload: File | File[] | null) => {
    if (Array.isArray(payload)) {
      onChange(payload);
    } else if (payload) {
      onChange([payload]);
    } else {
      onChange([]);
    }
  };

  return (
    <MantineFileButton
      onChange={handleChange}
      accept={accept}
      multiple
      disabled={disabled}
      name={name}
      form={form}
      inputProps={inputProps}
      {...props}
    >
      {children}
    </MantineFileButton>
  );
};

export default FileButton;
