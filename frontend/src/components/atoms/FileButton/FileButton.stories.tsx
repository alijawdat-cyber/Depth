import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FileButton, FileButton_Multiple } from './FileButton';
import { Button } from '../Button';

const meta: Meta<typeof FileButton> = {
  title: 'Atoms/FileButton',
  component: FileButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FileButton component provides file upload functionality by wrapping a hidden file input. Works with any trigger element and supports single or multiple file selection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    accept: {
      control: 'text',
      description: 'File types to accept',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether input is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileButton>;

export const Default: Story = {
  render: function DefaultComponent() {
    const [file, setFile] = React.useState<File | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <FileButton onChange={setFile} accept="image/*">
          {(props) => (
            <Button {...props} variant="outline">
              📁 Upload Image
            </Button>
          )}
        </FileButton>
        
        {file && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
              Selected file:
            </p>
            <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
              <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB)
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const MultipleFiles: StoryObj<typeof FileButton_Multiple> = {
  render: function MultipleComponent() {
    const [files, setFiles] = React.useState<File[]>([]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <FileButton_Multiple onChange={setFiles} accept="image/*">
          {(props) => (
            <Button {...props} variant="primary">
              📷 Upload Multiple Images
            </Button>
          )}
        </FileButton_Multiple>
        
        {files.length > 0 && (
          <div style={{ textAlign: 'center', maxWidth: '300px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
              Selected files ({files.length}):
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {files.map((file, index) => (
                <p key={index} style={{ margin: 0, fontSize: 'var(--fs-xs)' }}>
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const DifferentAcceptTypes: Story = {
  render: function AcceptTypesComponent() {
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [documentFile, setDocumentFile] = React.useState<File | null>(null);
    const [anyFile, setAnyFile] = React.useState<File | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Images Only</p>
          <FileButton onChange={setImageFile} accept="image/*">
            {(props) => (
              <Button {...props} variant="outline" size="sm">
                🖼️ Upload Image
              </Button>
            )}
          </FileButton>
          {imageFile && (
            <p style={{ margin: '8px 0 0 0', fontSize: 'var(--fs-xs)' }}>
              Selected: {imageFile.name}
            </p>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Documents Only</p>
          <FileButton onChange={setDocumentFile} accept=".pdf,.doc,.docx,.txt">
            {(props) => (
              <Button {...props} variant="outline" size="sm">
                📄 Upload Document
              </Button>
            )}
          </FileButton>
          {documentFile && (
            <p style={{ margin: '8px 0 0 0', fontSize: 'var(--fs-xs)' }}>
              Selected: {documentFile.name}
            </p>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Any File</p>
          <FileButton onChange={setAnyFile}>
            {(props) => (
              <Button {...props} variant="outline" size="sm">
                📎 Upload Any File
              </Button>
            )}
          </FileButton>
          {anyFile && (
            <p style={{ margin: '8px 0 0 0', fontSize: 'var(--fs-xs)' }}>
              Selected: {anyFile.name}
            </p>
          )}
        </div>
      </div>
    );
  },
};

export const CustomTriggers: Story = {
  render: function TriggersComponent() {
    const [file1, setFile1] = React.useState<File | null>(null);
    const [file2, setFile2] = React.useState<File | null>(null);
    const [file3, setFile3] = React.useState<File | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Button Trigger</p>
          <FileButton onChange={setFile1} accept="image/*">
            {(props) => (
              <Button {...props} variant="gradient">
                Click to Upload
              </Button>
            )}
          </FileButton>
          {file1 && <p style={{ margin: '8px 0 0 0', fontSize: 'var(--fs-xs)' }}>✓ {file1.name}</p>}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Custom Div Trigger</p>
          <FileButton onChange={setFile2} accept="*/*">
            {(props) => (
              <div 
                {...props}
                style={{
                  padding: '16px 24px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-400)';
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = file2 ? 'var(--color-success-300)' : 'var(--color-neutral-300)';
                  e.currentTarget.style.backgroundColor = file2 ? 'var(--color-success-50)' : 'var(--color-neutral-50)';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
                  {file2 ? `✓ ${file2.name}` : 'Drop file here or click to browse'}
                </div>
              </div>
            )}
          </FileButton>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Link Style Trigger</p>
          <FileButton onChange={setFile3} accept="image/*">
            {(props) => (
              <span 
                {...props}
                style={{
                  fontSize: 'var(--fs-sm)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 'var(--fw-medium)',
                }}
              >
                {file3 ? `Change file (${file3.name})` : 'Browse for image file'}
              </span>
            )}
          </FileButton>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Disabled State</p>
        <FileButton onChange={() => {}} disabled>
          {(props) => (
            <Button {...props} disabled>
              📁 Upload File (Disabled)
            </Button>
          )}
        </FileButton>
      </div>
    </div>
  ),
};

export const WithProgress: Story = {
  render: function ProgressComponent() {
    const [file, setFile] = React.useState<File | null>(null);
    const [uploading, setUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const simulateUpload = () => {
      if (!file) return;
      
      setUploading(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    };

    const handleFileChange = (newFile: File | null) => {
      setFile(newFile);
      setProgress(0);
      setUploading(false);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', minWidth: '300px' }}>
        <FileButton onChange={handleFileChange} accept="*/*">
          {(props) => (
            <Button {...props} variant="outline" disabled={uploading}>
              📁 Select File
            </Button>
          )}
        </FileButton>

        {file && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
              Selected: {file.name}
            </p>
            
            {!uploading && progress === 0 && (
              <Button onClick={simulateUpload} size="sm" variant="primary">
                🚀 Start Upload
              </Button>
            )}

            {uploading && (
              <div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  borderRadius: 'var(--radius-sm)', 
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'width 0.2s ease',
                  }} />
                </div>
                <p style={{ margin: 0, fontSize: 'var(--fs-xs)' }}>
                  Uploading... {progress}%
                </p>
              </div>
            )}

            {progress === 100 && !uploading && (
              <p style={{ margin: 0, fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
                ✅ Upload completed!
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
};
