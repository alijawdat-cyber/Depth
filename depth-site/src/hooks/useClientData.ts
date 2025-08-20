import useSWR from 'swr';
import type { Project, ProjectFile, Approval } from '@/types/entities';

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error('Failed');
  return r.json();
});

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR('/api/client/projects', fetcher);
  return {
    projects: data?.projects as Project[] | undefined,
    total: data?.total as number | undefined,
    stats: data?.stats,
    isLoading,
    isError: !!error,
    refresh: mutate
  };
}

export function useFiles(projectId?: string) {
  const key = projectId ? `/api/client/files?projectId=${projectId}` : '/api/client/files';
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return {
    files: data?.files as ProjectFile[] | undefined,
    total: data?.total as number | undefined,
    stats: data?.stats,
    isLoading,
    isError: !!error,
    refresh: mutate
  };
}

export function useApprovals(projectId?: string) {
  // Make approvals truly lazy: do not fetch until a concrete projectId is available
  const key = projectId ? `/api/client/approvals?projectId=${projectId}` : '/api/client/approvals';
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return {
    approvals: data?.approvals as Approval[] | undefined,
    total: data?.total as number | undefined,
    stats: data?.stats,
    isLoading,
    isError: !!error,
    refresh: mutate
  };
}

export function useProjectDetails(projectId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    projectId ? `/api/client/projects/${projectId}` : null, 
    fetcher
  );
  return {
    project: data?.project as Project | undefined,
    isLoading,
    isError: !!error,
    refresh: mutate
  };
}

// Helper functions for client actions
export async function uploadFile(projectId: string, file: File, category: string = 'reference', notes: string = '') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectId', projectId);
  formData.append('category', category);
  formData.append('notes', notes);

  const response = await fetch('/api/client/files', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('فشل في رفع الملف');
  }

  return response.json();
}

export async function respondToApproval(
  approvalId: string, 
  action: 'approve' | 'reject' | 'request_changes',
  notes?: string,
  feedback?: string,
  requestedChanges?: string[]
) {
  const response = await fetch('/api/client/approvals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      approvalId,
      action,
      notes,
      feedback,
      requestedChanges
    })
  });

  if (!response.ok) {
    throw new Error('فشل في تسجيل الرد');
  }

  return response.json();
}
