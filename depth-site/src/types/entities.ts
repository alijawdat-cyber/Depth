// Shared domain types and enums

export type ProjectStatus = 'active' | 'pending' | 'completed' | 'deleted';
export type FileType = 'image' | 'video' | 'document';
export type FileStatus = 'uploaded' | 'processing' | 'approved' | 'reviewing' | 'deleted';
export type ApprovalStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'needs_revision';
export type NotificationType = 'file_upload' | 'approval_update' | 'task_completed' | 'message';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  budget: number;
  clientEmail: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: FileType;
  size: number; // bytes
  status: FileStatus;
  createdAt: string | null;
  url: string; // for documents: R2 key; for images/videos: public url/iframe url
  projectId?: string;
}

export interface Approval {
  id: string;
  title: string;
  type: string;
  deadline: string | null;
  priority: 'high' | 'medium' | 'low';
  status: ApprovalStatus;
  description?: string;
  projectId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  createdAt: string;
}


