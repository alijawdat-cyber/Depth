import useSWR from 'swr';
import type { Project, ProjectFile, Approval } from '@/types/entities';

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error('Failed');
  return r.json();
});

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR('/api/portal/projects', fetcher);
  return {
    projects: data?.projects as Project[] | undefined,
    total: data?.total as number | undefined,
    isLoading,
    isError: !!error,
    refresh: mutate
  };
}

export function useFiles(projectId?: string) {
  const key = projectId ? `/api/portal/files?projectId=${projectId}` : null;
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return {
    files: data?.files as ProjectFile[] | undefined,
    total: data?.total as number | undefined,
    isLoading,
    isError: !!error,
    refresh: mutate
  };
}

export function useApprovals(projectId?: string) {
  const key = projectId ? `/api/portal/approvals?projectId=${projectId}` : '/api/portal/approvals';
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return {
    approvals: data?.approvals as Approval[] | undefined,
    total: data?.total as number | undefined,
    isLoading,
    isError: !!error,
    refresh: mutate
  };
}


