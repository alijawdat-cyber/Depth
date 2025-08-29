'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  Group,
  Text,
  Title,
  ActionIcon,
  Stack,
  Badge,
  Button as MantineButton,
  Modal,
  TextInput,
  Select,
  Textarea,
  LoadingOverlay,
  Box,
  Alert,
  Paper,
  Divider,
  Tooltip,
  Checkbox
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  Bell,
  MessageSquare,
  CreditCard,
  FolderOpen,
  AlertTriangle,
  Eye,
  Send,
  Clock,
  Calendar,
  User,
  ExternalLink,
  Search,
  Check,
  X,
  Settings,
  TrendingUp
} from 'lucide-react';

// استيراد المكونات الموجودة
import StatsCard from '@/components/molecules/StatsCard';
import { DataTable, DataTableColumn } from '@/components/molecules/DataTable/DataTable';

import styles from './NotificationsPage.module.css';

// أنواع البيانات
interface NotificationAction {
  type: string;
  label: string;
  url?: string;
  onClick?: () => void;
}

interface NotificationData extends Record<string, unknown> {
  id: string;
  recipientId: string;
  type: 'project_update' | 'payment_reminder' | 'message' | 'system_alert' | 'marketing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  status: 'read' | 'unread';
  actions?: NotificationAction[];
  details?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
  clickedAt?: string;
  expiresAt?: string;
}

interface NotificationSummary {
  total: number;
  unread: number;
  urgent: number;
  actionRequired: number;
}

interface NotificationsResponse {
  notifications: NotificationData[];
  summary: NotificationSummary;
}

// نموذج للإشعار الجديد
interface NewNotificationForm {
  recipientType: 'user' | 'role' | 'all';
  recipientId?: string;
  role?: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  channels: {
    inApp: boolean;
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
  expiresAt?: string;
}

// بيانات وهمية مؤقتة
const mockNotificationsData: NotificationsResponse = {
  notifications: [
    {
      id: 'notif_001',
      recipientId: 'cl_123abc',
      type: 'project_update',
      priority: 'high',
      title: 'تحديث مشروع تصوير منتجات المطعم',
      message: 'تم رفع الصور النهائية للمراجعة من قبل المبدع فاطمة الزهراء',
      status: 'unread',
      actions: [
        { type: 'view', label: 'عرض المشروع', url: '/projects/p_123abc' },
        { type: 'approve', label: 'الموافقة', url: '/projects/p_123abc/approve' }
      ],
      details: {
        projectId: 'p_123abc',
        projectTitle: 'تصوير منتجات المطعم - الدفعة الأولى',
        creatorName: 'فاطمة الزهراء'
      },
      createdAt: '2025-08-28T14:30:00.000Z'
    },
    {
      id: 'notif_002',
      recipientId: 'cl_456def',
      type: 'payment_reminder',
      priority: 'medium',
      title: 'تذكير بموعد دفع الفاتورة',
      message: 'فاتورة INV-2025-001234 مستحقة خلال 3 أيام',
      status: 'read',
      actions: [
        { type: 'view_invoice', label: 'عرض الفاتورة', url: '/invoices/inv_123abc' },
        { type: 'pay', label: 'دفع الآن', url: '/payments/invoice/inv_123abc' }
      ],
      details: {
        invoiceId: 'inv_123abc',
        invoiceNumber: 'INV-2025-001234',
        amount: 308000,
        dueDate: '2025-08-31T23:59:59.000Z'
      },
      createdAt: '2025-08-25T09:00:00.000Z',
      readAt: '2025-08-25T10:30:00.000Z'
    },
    {
      id: 'notif_003',
      recipientId: 'c_789ghi',
      type: 'message',
      priority: 'low',
      title: 'رسالة جديدة من العميل',
      message: 'محمد أحمد السوري أرسل رسالة حول موعد التصوير',
      status: 'unread',
      actions: [
        { type: 'reply', label: 'الرد', url: '/messages/conv_123abc' }
      ],
      details: {
        senderId: 'cl_123abc',
        senderName: 'محمد أحمد السوري',
        messagePreview: 'أود تأكيد موعد جلسة التصوير غداً...'
      },
      createdAt: '2025-08-27T16:45:00.000Z'
    },
    {
      id: 'notif_004',
      recipientId: 'admin_001',
      type: 'system_alert',
      priority: 'urgent',
      title: 'تنبيه أمني: محاولات دخول مشبوهة',
      message: 'تم رصد 5 محاولات دخول فاشلة من IP مجهول خلال آخر ساعة',
      status: 'unread',
      actions: [
        { type: 'view_logs', label: 'عرض السجلات', url: '/admin/security/logs' },
        { type: 'block_ip', label: 'حظر IP', url: '/admin/security/block' }
      ],
      details: {
        ipAddress: '192.168.1.100',
        attempts: 5,
        lastAttempt: '2025-08-28T15:30:00.000Z'
      },
      createdAt: '2025-08-28T15:35:00.000Z'
    },
    {
      id: 'notif_005',
      recipientId: 'all_users',
      type: 'marketing',
      priority: 'low',
      title: 'ميزة جديدة: تصوير المنتجات بتقنية 360 درجة',
      message: 'اكتشف الآن خدمة التصوير التفاعلي الجديدة لمنتجاتك',
      status: 'read',
      actions: [
        { type: 'learn_more', label: 'اعرف أكثر', url: '/services/360-photography' }
      ],
      details: {
        campaign: 'new_features_august_2025',
        category: 'product_announcement'
      },
      createdAt: '2025-08-20T10:00:00.000Z',
      readAt: '2025-08-21T14:20:00.000Z'
    }
  ],
  summary: {
    total: 5,
    unread: 3,
    urgent: 1,
    actionRequired: 4
  }
};

// تنسيق التواريخ
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// تنسيق الوقت النسبي
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'منذ قليل';
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
  if (diffInHours < 48) return 'أمس';
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `منذ ${diffInDays} يوم`;
};

// الحصول على أيقونة حسب النوع
const getNotificationIcon = (type: string, priority: string = 'medium') => {
  const iconProps = {
    size: 18,
    color: priority === 'urgent' ? '#ff4444' : 
           priority === 'high' ? '#ff8800' : 
           priority === 'medium' ? '#0066cc' : '#666666'
  };

  switch (type) {
    case 'project_update':
      return <FolderOpen {...iconProps} />;
    case 'payment_reminder':
      return <CreditCard {...iconProps} />;
    case 'message':
      return <MessageSquare {...iconProps} />;
    case 'system_alert':
      return <AlertTriangle {...iconProps} />;
    case 'marketing':
      return <TrendingUp {...iconProps} />;
    default:
      return <Bell {...iconProps} />;
  }
};

// ألوان الأولوية - محجوزة للاستخدام المستقبلي
const getPriorityBadgeColor = (priority: string): 'red' | 'orange' | 'blue' | 'gray' => {
  switch (priority) {
    case 'urgent':
      return 'red';
    case 'high':
      return 'orange';
    case 'medium':
      return 'blue';
    default:
      return 'gray';
  }
};

export default function NotificationsPage() {
  const [notificationsData, setNotificationsData] = useState<NotificationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);
  
  // نوافذ منبثقة
  const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
  const [sendModalOpened, { open: openSendModal, close: closeSendModal }] = useDisclosure(false);
  
  // فلاتر
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // نموذج الإشعار الجديد
  const [newNotificationForm, setNewNotificationForm] = useState<NewNotificationForm>({
    recipientType: 'all',
    type: 'system_alert',
    priority: 'medium',
    title: '',
    message: '',
    channels: {
      inApp: true,
      email: true,
      whatsapp: false,
      sms: false
    }
  });
  
  const [submitting, setSubmitting] = useState(false);
  // المتغير محجوز للميزات المستقبلية
  // const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchNotificationsData();
  }, []);

  const fetchNotificationsData = async () => {
    setLoading(true);
    try {
      // محاكاة API call
      // const response = await fetch('/api/admin/notifications');
      // const data = await response.json();
      
      // استخدام البيانات المؤقتة
      setTimeout(() => {
        setNotificationsData(mockNotificationsData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  // تفصيل الإشعار
  const showNotificationDetails = (notification: NotificationData) => {
    setSelectedNotification(notification);
    openDetailsModal();
    
    // تحديد كمقروء إذا لم يكن مقروءاً
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }
  };

  // تحديد كمقروء
  const markAsRead = async (notificationId: string) => {
    try {
      // محاكاة API call
      // await fetch(`/api/notifications/${notificationId}/mark-read`, { method: 'PUT' });
      
      // تحديث الحالة محلياً
      setNotificationsData(prev => {
        if (!prev) return prev;
        
        const updatedNotifications = prev.notifications.map(n => 
          n.id === notificationId 
            ? { ...n, status: 'read' as const, readAt: new Date().toISOString() }
            : n
        );
        
        const unreadCount = updatedNotifications.filter(n => n.status === 'unread').length;
        
        return {
          ...prev,
          notifications: updatedNotifications,
          summary: { ...prev.summary, unread: unreadCount }
        };
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // تحديد الكل كمقروء
  const markAllAsRead = async () => {
    setSubmitting(true);
    try {
      // محاكاة API call
      // await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      
      setTimeout(() => {
        setNotificationsData(prev => {
          if (!prev) return prev;
          
          const updatedNotifications = prev.notifications.map(n => ({
            ...n,
            status: 'read' as const,
            readAt: n.readAt || new Date().toISOString()
          }));
          
          return {
            ...prev,
            notifications: updatedNotifications,
            summary: { ...prev.summary, unread: 0 }
          };
        });

        notifications.show({
          title: 'تم بنجاح',
          message: 'تم تحديد جميع الإشعارات كمقروءة',
          color: 'green',
          icon: <Check size={18} />
        });
        
        setSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error('Error marking all as read:', error);
      notifications.show({
        title: 'خطأ',
        message: 'حدث خطأ أثناء التحديث',
        color: 'red',
        icon: <X size={18} />
      });
      setSubmitting(false);
    }
  };

  // إرسال إشعار جديد
  const handleSendNotification = async () => {
    if (!newNotificationForm.title.trim() || !newNotificationForm.message.trim()) {
      notifications.show({
        title: 'خطأ في البيانات',
        message: 'يرجى إدخال العنوان والرسالة',
        color: 'red',
        icon: <X size={18} />
      });
      return;
    }

    setSubmitting(true);
    try {
      // محاكاة API call
      // const response = await fetch('/api/notifications/send', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newNotificationForm)
      // });

      setTimeout(() => {
        notifications.show({
          title: 'تم بنجاح',
          message: 'تم إرسال الإشعار بنجاح',
          color: 'green',
          icon: <Check size={18} />
        });

        closeSendModal();
        resetForm();
        fetchNotificationsData(); // إعادة جلب البيانات
        setSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending notification:', error);
      notifications.show({
        title: 'خطأ',
        message: 'حدث خطأ أثناء إرسال الإشعار',
        color: 'red',
        icon: <X size={18} />
      });
      setSubmitting(false);
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setNewNotificationForm({
      recipientType: 'all',
      type: 'system_alert',
      priority: 'medium',
      title: '',
      message: '',
      channels: {
        inApp: true,
        email: true,
        whatsapp: false,
        sms: false
      }
    });
  };

  // فلترة الإشعارات
  const filteredNotifications = useMemo(() => {
    if (!notificationsData) return [];

    return notificationsData.notifications.filter(notification => {
      // البحث النصي
      const matchesSearch = searchQuery === '' || 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase());

      // فلتر النوع
      const matchesType = typeFilter === 'all' || notification.type === typeFilter;

      // فلتر الحالة  
      const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;

      // فلتر الأولوية
      const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;

      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });
  }, [notificationsData, searchQuery, typeFilter, statusFilter, priorityFilter]);

  // حساب إحصائيات الإشعارات
  const statsData = useMemo(() => {
    if (!notificationsData) return [];

    return [
      {
        title: 'إجمالي الإشعارات',
        value: notificationsData.summary.total,
        icon: <Bell size={20} />,
        color: 'primary' as const,
        trend: { value: 12, direction: 'up' as const, label: '+12 هذا الأسبوع' }
      },
      {
        title: 'غير مقروءة',
        value: notificationsData.summary.unread,
        icon: <MessageSquare size={20} />,
        color: 'warning' as const,
        trend: { 
          value: notificationsData.summary.unread, 
          direction: notificationsData.summary.unread > 0 ? 'up' as const : 'neutral' as const, 
          label: notificationsData.summary.unread > 0 ? 'يحتاج متابعة' : 'ممتاز' 
        }
      },
      {
        title: 'عالية الأولوية',
        value: notificationsData.summary.urgent,
        icon: <AlertTriangle size={20} />,
        color: 'danger' as const,
        trend: { 
          value: notificationsData.summary.urgent, 
          direction: notificationsData.summary.urgent > 0 ? 'up' as const : 'neutral' as const, 
          label: notificationsData.summary.urgent > 0 ? 'عاجل' : 'مستقر' 
        }
      },
      {
        title: 'تتطلب إجراء',
        value: notificationsData.summary.actionRequired,
        icon: <Clock size={20} />,
        color: 'info' as const,
        trend: { value: 75, direction: 'up' as const, label: '75% معدل الاستجابة' }
      }
    ];
  }, [notificationsData]);

  // إعداد أعمدة الجدول
  const tableColumns: DataTableColumn[] = [
    {
      key: 'notification',
      label: 'الإشعار',
      render: (_, row) => {
        const notification = row as unknown as NotificationData;
        return (
          <Group gap="sm" align="flex-start">
            {getNotificationIcon(notification.type, notification.priority)}
            <Box flex={1}>
              <Group gap="xs" align="center" mb="xs">
                <Text fw={600} size="sm" c={notification.status === 'unread' ? 'blue' : undefined}>
                  {notification.title}
                </Text>
                {notification.status === 'unread' && (
                  <Badge size="xs" color="blue" variant="light">
                    جديد
                  </Badge>
                )}
              </Group>
              <Text size="xs" c="dimmed" lineClamp={2}>
                {notification.message}
              </Text>
              {notification.actions && notification.actions.length > 0 && (
                <Group gap="xs" mt="xs">
                  {notification.actions.slice(0, 2).map((action, index) => (
                    <Badge
                      key={index}
                      size="xs"
                      variant="light"
                      color="gray"
                      style={{ cursor: 'pointer' }}
                    >
                      {action.label}
                    </Badge>
                  ))}
                </Group>
              )}
            </Box>
          </Group>
        );
      }
    },
    {
      key: 'type',
      label: 'النوع',
      render: (value) => {
        const typeLabels = {
          project_update: 'مشروع',
          payment_reminder: 'دفع',
          message: 'رسالة',
          system_alert: 'نظام',
          marketing: 'تسويق'
        };
        return (
          <Badge size="sm" variant="light" color="gray">
            {typeLabels[value as keyof typeof typeLabels] || String(value)}
          </Badge>
        );
      }
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (value) => {
        const priorityLabels = {
          urgent: 'عاجل',
          high: 'عالي',
          medium: 'متوسط',
          low: 'منخفض'
        };
        return (
          <Badge
            size="sm"
            variant="light"
            color={getPriorityBadgeColor(value as string)}
          >
            {priorityLabels[value as keyof typeof priorityLabels]}
          </Badge>
        );
      }
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value) => (
        <Badge
          size="sm"
          variant="light"
          color={value === 'unread' ? 'blue' : 'green'}
        >
          {value === 'unread' ? 'غير مقروء' : 'مقروء'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'التاريخ',
      render: (value) => (
        <Group gap="xs" align="center">
          <Calendar size={12} />
          <Box>
            <Text size="sm">{formatRelativeTime(value as string)}</Text>
            <Text size="xs" c="dimmed">{formatDate(value as string)}</Text>
          </Box>
        </Group>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (_, row) => {
        const notification = row as unknown as NotificationData;
        return (
          <Group gap="xs">
            <Tooltip label="عرض التفاصيل">
              <ActionIcon
                size="sm"
                variant="light"
                color="blue"
                onClick={() => showNotificationDetails(notification)}
              >
                <Eye size={14} />
              </ActionIcon>
            </Tooltip>
            
            {notification.status === 'unread' && (
              <Tooltip label="تحديد كمقروء">
                <ActionIcon
                  size="sm"
                  variant="light"
                  color="green"
                  onClick={() => markAsRead(notification.id)}
                >
                  <Check size={14} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        );
      }
    }
  ];

  return (
    <div className={styles.notificationsContainer}>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      
      {/* العنوان والأزرار */}
      <div className={styles.pageHeader}>
        <Group justify="space-between" align="flex-start">
          <Box>
            <Title order={1} className={styles.pageTitle}>
              إدارة الإشعارات
            </Title>
            <Text className={styles.pageDescription}>
              مراقبة وإدارة جميع إشعارات النظام والمستخدمين
            </Text>
          </Box>
          
          <Group gap="sm">
            <MantineButton
              variant="light"
              leftSection={<Check size={18} />}
              onClick={markAllAsRead}
              loading={submitting}
              disabled={!notificationsData?.summary.unread}
            >
              تحديد الكل كمقروء
            </MantineButton>
            
            <MantineButton
              leftSection={<Send size={18} />}
              onClick={openSendModal}
              color="blue"
              size="md"
            >
              إرسال إشعار جديد
            </MantineButton>
          </Group>
        </Group>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className={styles.statsSection}>
        <Grid>
          {statsData.map((stat, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                color={stat.color}
              />
            </Grid.Col>
          ))}
        </Grid>
      </div>

      {/* أدوات الفلترة والبحث */}
      <Paper className={styles.filtersSection} p="md" radius="md" shadow="xs" mb="lg">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              placeholder="البحث في الإشعارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<Search size={16} />}
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Select
              placeholder="النوع"
              value={typeFilter}
              onChange={(value) => setTypeFilter(value || 'all')}
              data={[
                { value: 'all', label: 'جميع الأنواع' },
                { value: 'project_update', label: 'تحديثات المشاريع' },
                { value: 'payment_reminder', label: 'تذكير الدفع' },
                { value: 'message', label: 'الرسائل' },
                { value: 'system_alert', label: 'تنبيهات النظام' },
                { value: 'marketing', label: 'تسويقية' }
              ]}
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Select
              placeholder="الحالة"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value || 'all')}
              data={[
                { value: 'all', label: 'جميع الحالات' },
                { value: 'unread', label: 'غير مقروء' },
                { value: 'read', label: 'مقروء' }
              ]}
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Select
              placeholder="الأولوية"
              value={priorityFilter}
              onChange={(value) => setPriorityFilter(value || 'all')}
              data={[
                { value: 'all', label: 'جميع الأولويات' },
                { value: 'urgent', label: 'عاجل' },
                { value: 'high', label: 'عالي' },
                { value: 'medium', label: 'متوسط' },
                { value: 'low', label: 'منخفض' }
              ]}
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Group justify="center">
              <Badge size="sm" variant="light" color="blue">
                {filteredNotifications.length} إشعار
              </Badge>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* جدول الإشعارات */}
      <div className={styles.tableSection}>
        <Paper className={styles.tableContainer} p="lg" radius="md" shadow="xs">
          <DataTable
            columns={tableColumns}
            data={filteredNotifications}
            loading={loading}
            searchable={false} // استخدمنا البحث المخصص
            emptyText="لا توجد إشعارات"
            pageSize={15}
          />
        </Paper>
      </div>

      {/* نافذة تفاصيل الإشعار */}
      <Modal
        opened={detailsModalOpened}
        onClose={closeDetailsModal}
        title={
          <Group gap="sm">
            <Eye size={20} />
            <Text fw={600}>تفاصيل الإشعار</Text>
          </Group>
        }
        size="lg"
        centered
      >
        {selectedNotification && (
          <Stack gap="md">
            <Group gap="md" align="flex-start">
              {getNotificationIcon(selectedNotification.type, selectedNotification.priority)}
              <Box flex={1}>
                <Group gap="xs" align="center" mb="sm">
                  <Text fw={700} size="lg">{selectedNotification.title}</Text>
                  <Badge
                    size="sm"
                    variant="light"
                    color={getPriorityBadgeColor(selectedNotification.priority)}
                  >
                    {selectedNotification.priority}
                  </Badge>
                </Group>
                <Text size="sm" mb="md">{selectedNotification.message}</Text>
              </Box>
            </Group>

            <Divider />

            <Grid>
              <Grid.Col span={6}>
                <Paper p="sm" radius="md" bg="gray.0">
                  <Group gap="xs" align="center">
                    <Calendar size={16} />
                    <Box>
                      <Text size="xs" c="dimmed">تاريخ الإرسال</Text>
                      <Text size="sm" fw={500}>
                        {formatDate(selectedNotification.createdAt)}
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <Paper p="sm" radius="md" bg="blue.0">
                  <Group gap="xs" align="center">
                    <User size={16} />
                    <Box>
                      <Text size="xs" c="dimmed">المستلم</Text>
                      <Text size="sm" fw={500}>
                        {selectedNotification.recipientId}
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              </Grid.Col>
            </Grid>

            {selectedNotification.details && (
              <>
                <Divider label="تفاصيل إضافية" labelPosition="center" />
                <Paper p="md" radius="md" bg="gray.0">
                  <Stack gap="xs">
                    {Object.entries(selectedNotification.details).map(([key, value]) => (
                      <Group key={key} gap="xs" justify="space-between">
                        <Text size="sm" fw={500}>{key}:</Text>
                        <Text size="sm" c="dimmed">{String(value)}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Paper>
              </>
            )}

            {selectedNotification.actions && selectedNotification.actions.length > 0 && (
              <>
                <Divider label="الإجراءات المتاحة" labelPosition="center" />
                <Group gap="sm">
                  {selectedNotification.actions.map((action, index) => (
                    <MantineButton
                      key={index}
                      variant="light"
                      size="sm"
                      leftSection={<ExternalLink size={14} />}
                      component="a"
                      href={action.url}
                      target="_blank"
                    >
                      {action.label}
                    </MantineButton>
                  ))}
                </Group>
              </>
            )}
          </Stack>
        )}
      </Modal>

      {/* نافذة إرسال إشعار جديد */}
      <Modal
        opened={sendModalOpened}
        onClose={closeSendModal}
        title={
          <Group gap="sm">
            <Send size={20} />
            <Text fw={600}>إرسال إشعار جديد</Text>
          </Group>
        }
        size="lg"
        centered
        closeOnClickOutside={!submitting}
        withCloseButton={!submitting}
      >
        <Stack gap="md">
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="نوع المستلم"
                required
                value={newNotificationForm.recipientType}
                onChange={(value) => 
                  setNewNotificationForm(prev => ({ 
                    ...prev, 
                    recipientType: value as 'user' | 'role' | 'all' 
                  }))
                }
                data={[
                  { value: 'all', label: 'جميع المستخدمين' },
                  { value: 'role', label: 'دور محدد' },
                  { value: 'user', label: 'مستخدم محدد' }
                ]}
                disabled={submitting}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="نوع الإشعار"
                required
                value={newNotificationForm.type}
                onChange={(value) => 
                  setNewNotificationForm(prev => ({ ...prev, type: value || 'system_alert' }))
                }
                data={[
                  { value: 'system_alert', label: 'تنبيه نظام' },
                  { value: 'project_update', label: 'تحديث مشروع' },
                  { value: 'payment_reminder', label: 'تذكير دفع' },
                  { value: 'marketing', label: 'تسويقي' }
                ]}
                disabled={submitting}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Select
                label="الأولوية"
                required
                value={newNotificationForm.priority}
                onChange={(value) => 
                  setNewNotificationForm(prev => ({ 
                    ...prev, 
                    priority: value as 'low' | 'medium' | 'high' | 'urgent' 
                  }))
                }
                data={[
                  { value: 'low', label: 'منخفضة' },
                  { value: 'medium', label: 'متوسطة' },
                  { value: 'high', label: 'عالية' },
                  { value: 'urgent', label: 'عاجلة' }
                ]}
                disabled={submitting}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="عنوان الإشعار"
                placeholder="أدخل عنوان واضح ومختصر"
                required
                value={newNotificationForm.title}
                onChange={(e) => 
                  setNewNotificationForm(prev => ({ ...prev, title: e.target.value }))
                }
                disabled={submitting}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Textarea
                label="نص الإشعار"
                placeholder="أدخل تفاصيل الإشعار..."
                required
                minRows={4}
                maxRows={6}
                value={newNotificationForm.message}
                onChange={(e) => 
                  setNewNotificationForm(prev => ({ ...prev, message: e.target.value }))
                }
                disabled={submitting}
              />
            </Grid.Col>
          </Grid>

          <Divider my="md" label="قنوات الإرسال" labelPosition="center" />

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Checkbox
                label="داخل التطبيق"
                checked={newNotificationForm.channels.inApp}
                onChange={(e) => 
                  setNewNotificationForm(prev => ({
                    ...prev,
                    channels: { ...prev.channels, inApp: e.target.checked }
                  }))
                }
                disabled={submitting}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Checkbox
                label="البريد الإلكتروني"
                checked={newNotificationForm.channels.email}
                onChange={(e) => 
                  setNewNotificationForm(prev => ({
                    ...prev,
                    channels: { ...prev.channels, email: e.target.checked }
                  }))
                }
                disabled={submitting}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Checkbox
                label="واتساب"
                checked={newNotificationForm.channels.whatsapp}
                onChange={(e) => 
                  setNewNotificationForm(prev => ({
                    ...prev,
                    channels: { ...prev.channels, whatsapp: e.target.checked }
                  }))
                }
                disabled={submitting}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Checkbox
                label="رسائل نصية"
                checked={newNotificationForm.channels.sms}
                onChange={(e) => 
                  setNewNotificationForm(prev => ({
                    ...prev,
                    channels: { ...prev.channels, sms: e.target.checked }
                  }))
                }
                disabled={submitting}
              />
            </Grid.Col>
          </Grid>

          <Alert variant="light" color="blue" icon={<Settings size={16} />}>
            <Text size="sm">
              <strong>ملاحظة:</strong> سيتم إرسال الإشعار عبر القنوات المحددة حسب تفضيلات كل مستلم.
            </Text>
          </Alert>

          <Group justify="flex-end" mt="xl">
            <MantineButton
              variant="light"
              onClick={closeSendModal}
              disabled={submitting}
            >
              إلغاء
            </MantineButton>
            <MantineButton
              onClick={handleSendNotification}
              loading={submitting}
              leftSection={<Send size={16} />}
            >
              إرسال الإشعار
            </MantineButton>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
