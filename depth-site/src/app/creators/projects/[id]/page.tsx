import { Metadata } from 'next';
import CreatorProjectDetail from '@/components/creators/CreatorProjectDetail';

export const metadata: Metadata = {
  title: 'تفاصيل المشروع - Depth',
  description: 'عرض تفاصيل المشروع والمهام والملفات والأرباح',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CreatorProjectDetailPage({ params }: Props) {
  const { id } = await params;
  return <CreatorProjectDetail projectId={id} />;
}
