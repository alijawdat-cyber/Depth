import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Button,
  Hr,
  Preview,
  Tailwind
} from '@react-email/components';

interface QuoteNotificationProps {
  type: 'new_quote' | 'quote_approved' | 'quote_rejected';
  recipientName: string;
  recipientEmail: string;
  quoteId: string;
  projectTitle?: string;
  totalAmountIQD: number;
  totalAmountUSD?: number;
  clientMessage?: string;
  adminMessage?: string;
  quoteUrl: string;
  brandLogo?: string;
}

const QuoteNotification = ({
  type,
  recipientName,
  recipientEmail,
  quoteId,
  projectTitle,
  totalAmountIQD,
  totalAmountUSD,
  clientMessage,
  adminMessage,
  quoteUrl,
  brandLogo = "https://depth-agency.com/brand/logo-wordmark.svg"
}: QuoteNotificationProps) => {
  const getSubject = () => {
    switch (type) {
      case 'new_quote':
        return `عرض سعر جديد من Depth Agency - ${quoteId}`;
      case 'quote_approved':
        return `تم قبول عرض السعر - ${quoteId}`;
      case 'quote_rejected':
        return `تم رفض عرض السعر - ${quoteId}`;
      default:
        return `تحديث عرض السعر - ${quoteId}`;
    }
  };

  const getHeading = () => {
    switch (type) {
      case 'new_quote':
        return 'عرض سعر جديد';
      case 'quote_approved':
        return 'تم قبول عرض السعر';
      case 'quote_rejected':
        return 'تم رفض عرض السعر';
      default:
        return 'تحديث عرض السعر';
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'new_quote':
        return `مرحباً ${recipientName}، تم إرسال عرض سعر جديد لمشروعك. يمكنك مراجعة التفاصيل والموافقة عليه من خلال البوابة.`;
      case 'quote_approved':
        return `شكراً لك ${recipientName} على موافقتك على عرض السعر. سنبدأ العمل على مشروعك قريباً وسنرسل لك بيان العمل (SOW).`;
      case 'quote_rejected':
        return `تم رفض عرض السعر بنجاح. يمكنك التواصل معنا لمناقشة التعديلات المطلوبة.`;
      default:
        return `تم تحديث عرض السعر الخاص بك.`;
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'new_quote':
        return 'مراجعة العرض';
      case 'quote_approved':
        return 'عرض المستندات';
      case 'quote_rejected':
        return 'عرض التفاصيل';
      default:
        return 'عرض العرض';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'new_quote':
        return '#6C2BFF';
      case 'quote_approved':
        return '#10B981';
      case 'quote_rejected':
        return '#EF4444';
      default:
        return '#6C2BFF';
    }
  };

  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <Preview>{getSubject()}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            {/* Header */}
            <Section className="bg-white rounded-t-lg border border-gray-200 p-6">
              <div className="text-center">
                <Img
                  src={brandLogo}
                  alt="Depth Agency"
                  width="120"
                  height="32"
                  className="mx-auto mb-4"
                />
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  {getHeading()}
                </Text>
                <Text className="text-gray-600 text-sm">
                  رقم العرض: {quoteId}
                </Text>
              </div>
            </Section>

            {/* Main Content */}
            <Section className="bg-white border-x border-gray-200 p-6">
              <Text className="text-gray-800 leading-relaxed mb-4">
                {getMessage()}
              </Text>

              {projectTitle && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <Text className="text-sm text-gray-600 mb-1">المشروع:</Text>
                  <Text className="font-semibold text-gray-900">{projectTitle}</Text>
                </div>
              )}

              {/* Quote Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <Text className="text-sm text-gray-600 mb-2">تفاصيل العرض:</Text>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Text className="text-gray-800">المبلغ (دينار عراقي):</Text>
                    <Text className="font-bold text-gray-900">
                      {totalAmountIQD.toLocaleString('ar-IQ')} د.ع
                    </Text>
                  </div>
                  {totalAmountUSD && (
                    <div className="flex justify-between">
                      <Text className="text-gray-600 text-sm">المبلغ (دولار أمريكي):</Text>
                      <Text className="text-gray-700 text-sm">
                        ${totalAmountUSD.toLocaleString('en-US')}
                      </Text>
                    </div>
                  )}
                </div>
              </div>

              {/* Client or Admin Message */}
              {(clientMessage || adminMessage) && (
                <div className="bg-blue-50 border-r-4 border-blue-400 p-4 mb-6">
                  <Text className="text-sm text-blue-600 mb-1">
                    {clientMessage ? 'رسالة من العميل:' : 'ملاحظات إضافية:'}
                  </Text>
                  <Text className="text-blue-800">
                    {clientMessage || adminMessage}
                  </Text>
                </div>
              )}

              {/* Action Button */}
              <div className="text-center">
                <Button
                  href={quoteUrl}
                  className="inline-block px-6 py-3 text-white font-medium rounded-lg text-decoration-none"
                  style={{ backgroundColor: getButtonColor() }}
                >
                  {getButtonText()}
                </Button>
              </div>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-100 rounded-b-lg border border-gray-200 p-6 text-center">
              <Text className="text-gray-600 text-sm mb-2">
                هذا الإيميل تم إرساله إلى {recipientEmail}
              </Text>
              <Hr className="border-gray-300 my-4" />
              <div className="space-y-2">
                <Text className="text-gray-600 text-xs">
                  © 2025 Depth Agency. جميع الحقوق محفوظة.
                </Text>
                <div className="space-x-4 rtl:space-x-reverse">
                  <Link href="https://depth-agency.com" className="text-blue-600 text-xs">
                    الموقع الرسمي
                  </Link>
                  <Link href="https://depth-agency.com/contact" className="text-blue-600 text-xs">
                    تواصل معنا
                  </Link>
                  <Link href="https://depth-agency.com/legal" className="text-blue-600 text-xs">
                    الشروط والأحكام
                  </Link>
                </div>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

QuoteNotification.PreviewProps = {
  type: 'new_quote',
  recipientName: 'أحمد محمد',
  recipientEmail: 'ahmed@example.com',
  quoteId: 'Q-2025-001',
  projectTitle: 'تصوير منتجات الأزياء - مجموعة الخريف',
  totalAmountIQD: 2500000,
  totalAmountUSD: 1923,
  clientMessage: undefined,
  adminMessage: 'يشمل العرض التصوير والمعالجة الأساسية',
  quoteUrl: 'https://depth-agency.com/portal/quotes',
  brandLogo: 'https://depth-agency.com/brand/logo-wordmark.svg'
} as QuoteNotificationProps;

export default QuoteNotification;
