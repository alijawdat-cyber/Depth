import { Metadata } from 'next';
import ClientDashboard from '@/components/client/ClientDashboard';

export const metadata: Metadata = {
  title: 'لوحة العميل - Depth',
  description: 'لوحة تحكم العميل الرئيسية',
};

export default function ClientPage() {
  return <ClientDashboard />;
}
