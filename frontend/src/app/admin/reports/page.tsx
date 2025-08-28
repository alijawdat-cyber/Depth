'use client';

import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Grid,
  Card,
  Text,
  Title,
  Table,
  Button,
  Select,
  Group,
  Badge,
  Progress,
  ActionIcon,
  Paper,
  Stack,
  ThemeIcon,
  Box,
  LoadingOverlay
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconBriefcase,
  IconCurrencyDollar,
  IconStar,
  IconDownload,
  IconCalendar,
  IconChartBar,
  IconFileText,
  IconExternalLink
} from '@tabler/icons-react';
import classes from './ReportsPage.module.css';

// أنواع البيانات
interface KPIData {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType;
}

interface BusinessReport {
  period: {
    start: string;
    end: string;
    description: string;
  };
  financial: {
    revenue: {
      gross: number;
      net: number;
      profitMargin: string;
      growth: string;
    };
    expenses: {
      creatorPayments: number;
      operational: number;
      marketing: number;
      total: number;
    };
    projections: {
      nextMonth: number;
      confidence: string;
    };
  };
  operations: {
    projects: {
      total: number;
      completed: number;
      active: number;
      cancelled: number;
      successRate: string;
      avgDuration: string;
    };
    clients: {
      active: number;
      new: number;
      returning: number;
      retention: string;
      satisfaction: number;
    };
    creators: {
      active: number;
      utilization: string;
      avgRating: number;
      earnings: number;
    };
  };
  growth: {
    userAcquisition: {
      clients: number;
      creators: number;
      cost: number;
      cac: number;
    };
    revenue: {
      monthOverMonth: string;
      yearOverYear: string;
      categories: {
        photo: string;
        video: string;
        design: string;
      };
    };
  };
  marketAnalysis: {
    topCategories: Array<{
      category: string;
      revenue: number;
      share: string;
    }>;
    geograficDistribution: Array<{
      location: string;
      revenue: number;
      share: string;
    }>;
    competitivePosition: string;
    marketShare: string;
  };
}

interface CreatorPerformance {
  rank: number;
  creator: {
    id: string;
    name: string;
    specialization: string;
  };
  metrics: {
    projects: number;
    revenue: number;
    rating: number;
    onTimeDelivery: string;
    clientRetention: string;
  };
  growth: string;
  badge?: string;
}

interface CreatorsReport {
  summary: {
    totalCreators: number;
    activeCreators: number;
    topPerformers: number;
    utilizationRate: string;
    avgRating: number;
  };
  rankings: CreatorPerformance[];
  categoryPerformance: {
    [key: string]: {
      creators: number;
      avgRevenue: number;
      topRating: number;
      demand: string;
    };
  };
  insights: {
    topSkills: string[];
    gapAnalysis: string[];
    retentionRate: string;
    recruitmentNeeds: string[];
  };
}

// تنسيق الأرقام العراقية
const formatIQD = (amount: number) => {
  return new Intl.NumberFormat('ar-IQ', {
    style: 'currency',
    currency: 'IQD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [customDateRange, setCustomDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [businessData, setBusinessData] = useState<BusinessReport | null>(null);
  const [creatorsData, setCreatorsData] = useState<CreatorsReport | null>(null);
  const [loading, setLoading] = useState(true);

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchReportsData();
  }, [selectedPeriod]);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      // محاكاة البيانات إذا الـ API مش جاهز
      const mockBusinessData: BusinessReport = {
        period: {
          start: "2025-08-01T00:00:00.000Z",
          end: "2025-08-31T23:59:59.000Z",
          description: "تقرير شهر أغسطس 2025"
        },
        financial: {
          revenue: {
            gross: 28450000,
            net: 5265000,
            profitMargin: "18.5%",
            growth: "+28.7%"
          },
          expenses: {
            creatorPayments: 20790000,
            operational: 1845000,
            marketing: 550000,
            total: 23185000
          },
          projections: {
            nextMonth: 32500000,
            confidence: "87%"
          }
        },
        operations: {
          projects: {
            total: 89,
            completed: 81,
            active: 8,
            cancelled: 0,
            successRate: "100%",
            avgDuration: "6.2 أيام"
          },
          clients: {
            active: 73,
            new: 15,
            returning: 58,
            retention: "79.5%",
            satisfaction: 4.7
          },
          creators: {
            active: 23,
            utilization: "78%",
            avgRating: 4.6,
            earnings: 20790000
          }
        },
        growth: {
          userAcquisition: {
            clients: 15,
            creators: 4,
            cost: 450000,
            cac: 23684
          },
          revenue: {
            monthOverMonth: "+28.7%",
            yearOverYear: "+145%",
            categories: {
              photo: "+22%",
              video: "+45%",
              design: "+18%"
            }
          }
        },
        marketAnalysis: {
          topCategories: [
            {category: "photo", revenue: 17870000, share: "62.8%"},
            {category: "video", revenue: 7125000, share: "25.0%"},
            {category: "design", revenue: 3455000, share: "12.2%"}
          ],
          geograficDistribution: [
            {location: "بغداد", revenue: 20515000, share: "72.1%"},
            {location: "البصرة", revenue: 5122000, share: "18.0%"},
            {location: "أربيل", revenue: 2813000, share: "9.9%"}
          ],
          competitivePosition: "market_leader",
          marketShare: "15.2%"
        }
      };

      const mockCreatorsData: CreatorsReport = {
        summary: {
          totalCreators: 67,
          activeCreators: 23,
          topPerformers: 8,
          utilizationRate: "78%",
          avgRating: 4.6
        },
        rankings: [
          {
            rank: 1,
            creator: {
              id: "c_789ghi",
              name: "فاطمة الزهراء",
              specialization: "Food Photography"
            },
            metrics: {
              projects: 12,
              revenue: 5240000,
              rating: 4.9,
              onTimeDelivery: "100%",
              clientRetention: "83%"
            },
            growth: "+34%",
            badge: "top_performer"
          },
          {
            rank: 2,
            creator: {
              id: "c_456def",
              name: "أحمد محمد الربيعي",
              specialization: "Commercial Photography"
            },
            metrics: {
              projects: 9,
              revenue: 4185000,
              rating: 4.7,
              onTimeDelivery: "96%",
              clientRetention: "78%"
            },
            growth: "+28%"
          }
        ],
        categoryPerformance: {
          photo: {
            creators: 15,
            avgRevenue: 285000,
            topRating: 4.9,
            demand: "high"
          },
          video: {
            creators: 6,
            avgRevenue: 420000,
            topRating: 4.8,
            demand: "very_high"
          },
          design: {
            creators: 2,
            avgRevenue: 195000,
            topRating: 4.5,
            demand: "medium"
          }
        },
        insights: {
          topSkills: ["food_photography", "product_photography", "video_editing"],
          gapAnalysis: ["motion_graphics", "3d_rendering", "drone_photography"],
          retentionRate: "94%",
          recruitmentNeeds: ["video_specialists", "designers"]
        }
      };

      setBusinessData(mockBusinessData);
      setCreatorsData(mockCreatorsData);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format: 'pdf' | 'excel', reportType: string) => {
    try {
      const response = await fetch(`/api/admin/reports/export?type=${format}&report=${reportType}`, {
        method: 'GET'
      });
      
      if (response.ok) {
        const data = await response.json();
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  // حساب الـ KPIs للنظرة العامة
  const getOverviewKPIs = (): KPIData[] => {
    if (!businessData) return [];

    return [
      {
        title: 'إجمالي الإيرادات',
        value: formatIQD(businessData.financial.revenue.gross),
        change: businessData.financial.revenue.growth,
        trend: 'up',
        icon: IconCurrencyDollar
      },
      {
        title: 'المشاريع المكتملة',
        value: businessData.operations.projects.completed,
        change: `${businessData.operations.projects.successRate}`,
        trend: 'up',
        icon: IconBriefcase
      },
      {
        title: 'العملاء النشطون',
        value: businessData.operations.clients.active,
        change: businessData.operations.clients.retention,
        trend: 'up',
        icon: IconUsers
      },
      {
        title: 'رضا العملاء',
        value: `${businessData.operations.clients.satisfaction}/5`,
        change: 'ممتاز',
        trend: 'up',
        icon: IconStar
      }
    ];
  };

  const renderOverviewTab = () => {
    if (!businessData) return null;

    const kpis = getOverviewKPIs();

    return (
      <Stack gap="lg">
        {/* KPI Cards */}
        <Grid>
          {kpis.map((kpi, index) => (
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }} key={index}>
              <Card className={classes.kpiCard} padding="lg">
                <Group justify="space-between" mb="xs">
                  <ThemeIcon
                    size="lg"
                    radius="md"
                    variant="light"
                    color="blue"
                  >
                    <kpi.icon />
                  </ThemeIcon>
                  <Badge 
                    color={kpi.trend === 'up' ? 'green' : kpi.trend === 'down' ? 'red' : 'gray'}
                    variant="light"
                    leftSection={kpi.trend === 'up' ? <IconTrendingUp size={12} /> : 
                                kpi.trend === 'down' ? <IconTrendingDown size={12} /> : null}
                  >
                    {kpi.change}
                  </Badge>
                </Group>
                <Text size="lg" fw={700} className={classes.kpiValue}>
                  {kpi.value}
                </Text>
                <Text size="sm" c="dimmed">
                  {kpi.title}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* التوزيع الجغرافي والفئات */}
        <Grid>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Card className={classes.chartCard} padding="lg">
              <Title order={4} mb="md">أهم الفئات حسب الإيرادات</Title>
              <Stack gap="sm">
                {businessData.marketAnalysis.topCategories.map((category, index) => (
                  <Box key={index}>
                    <Group justify="space-between" mb={5}>
                      <Text size="sm" fw={500}>
                        {category.category === 'photo' ? 'التصوير' : 
                         category.category === 'video' ? 'الفيديو' : 'التصميم'}
                      </Text>
                      <Group gap="xs">
                        <Text size="sm" c="dimmed">{category.share}</Text>
                        <Text size="sm" fw={500}>{formatIQD(category.revenue)}</Text>
                      </Group>
                    </Group>
                    <Progress 
                      value={parseFloat(category.share)} 
                      color={index === 0 ? 'blue' : index === 1 ? 'green' : 'orange'}
                      size="sm" 
                    />
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Card className={classes.chartCard} padding="lg">
              <Title order={4} mb="md">التوزيع الجغرافي</Title>
              <Stack gap="sm">
                {businessData.marketAnalysis.geograficDistribution.map((location, index) => (
                  <Box key={index}>
                    <Group justify="space-between" mb={5}>
                      <Text size="sm" fw={500}>{location.location}</Text>
                      <Group gap="xs">
                        <Text size="sm" c="dimmed">{location.share}</Text>
                        <Text size="sm" fw={500}>{formatIQD(location.revenue)}</Text>
                      </Group>
                    </Group>
                    <Progress 
                      value={parseFloat(location.share)} 
                      color={index === 0 ? 'blue' : index === 1 ? 'green' : 'yellow'}
                      size="sm" 
                    />
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* المعلومات المالية */}
        <Card className={classes.financialCard} padding="lg">
          <Title order={4} mb="md">التحليل المالي</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">صافي الربح</Text>
              <Text size="lg" fw={700} c="green">{formatIQD(businessData.financial.revenue.net)}</Text>
              <Text size="xs" c="dimmed">هامش الربح: {businessData.financial.revenue.profitMargin}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">مدفوعات المبدعين</Text>
              <Text size="lg" fw={700}>{formatIQD(businessData.financial.expenses.creatorPayments)}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">المصاريف التشغيلية</Text>
              <Text size="lg" fw={700}>{formatIQD(businessData.financial.expenses.operational)}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">التوقعات الشهر القادم</Text>
              <Text size="lg" fw={700} c="blue">{formatIQD(businessData.financial.projections.nextMonth)}</Text>
              <Text size="xs" c="dimmed">ثقة: {businessData.financial.projections.confidence}</Text>
            </Grid.Col>
          </Grid>
        </Card>
      </Stack>
    );
  };

  const renderCreatorsTab = () => {
    if (!creatorsData) return null;

    return (
      <Stack gap="lg">
        {/* ملخص المبدعين */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card className={classes.kpiCard} padding="lg">
              <Text size="lg" fw={700} c="blue">{creatorsData.summary.totalCreators}</Text>
              <Text size="sm" c="dimmed">إجمالي المبدعين</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card className={classes.kpiCard} padding="lg">
              <Text size="lg" fw={700} c="green">{creatorsData.summary.activeCreators}</Text>
              <Text size="sm" c="dimmed">مبدعون نشطون</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card className={classes.kpiCard} padding="lg">
              <Text size="lg" fw={700}>{creatorsData.summary.utilizationRate}</Text>
              <Text size="sm" c="dimmed">معدل الاستخدام</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card className={classes.kpiCard} padding="lg">
              <Group gap="xs">
                <Text size="lg" fw={700}>{creatorsData.summary.avgRating}</Text>
                <IconStar size={16} className={classes.starIcon} />
              </Group>
              <Text size="sm" c="dimmed">متوسط التقييم</Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* ترتيب المبدعين */}
        <Card className={classes.tableCard} padding="lg">
          <Title order={4} mb="md">ترتيب أفضل المبدعين</Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>الترتيب</Table.Th>
                <Table.Th>المبدع</Table.Th>
                <Table.Th>التخصص</Table.Th>
                <Table.Th>المشاريع</Table.Th>
                <Table.Th>الإيرادات</Table.Th>
                <Table.Th>التقييم</Table.Th>
                <Table.Th>النمو</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {creatorsData.rankings.map((creator) => (
                <Table.Tr key={creator.creator.id}>
                  <Table.Td>
                    <Group gap="xs">
                      <Text fw={700}>#{creator.rank}</Text>
                      {creator.badge && (
                        <Badge size="xs" color="gold" variant="light">
                          ⭐ متميز
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>{creator.creator.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{creator.creator.specialization}</Text>
                  </Table.Td>
                  <Table.Td>{creator.metrics.projects}</Table.Td>
                  <Table.Td>{formatIQD(creator.metrics.revenue)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Text>{creator.metrics.rating}</Text>
                      <IconStar size={12} className={classes.starIcon} />
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="green" variant="light">{creator.growth}</Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {/* أداء التخصصات */}
        <Card className={classes.chartCard} padding="lg">
          <Title order={4} mb="md">أداء التخصصات</Title>
          <Grid>
            {Object.entries(creatorsData.categoryPerformance).map(([category, data]) => (
              <Grid.Col span={{ base: 12, sm: 4 }} key={category}>
                <Paper className={classes.categoryCard} p="md">
                  <Text fw={600} mb="xs">
                    {category === 'photo' ? 'التصوير' : 
                     category === 'video' ? 'الفيديو' : 'التصميم'}
                  </Text>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">عدد المبدعين</Text>
                      <Text size="sm" fw={500}>{data.creators}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">متوسط الإيرادات</Text>
                      <Text size="sm" fw={500}>{formatIQD(data.avgRevenue)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">أعلى تقييم</Text>
                      <Group gap="xs">
                        <Text size="sm" fw={500}>{data.topRating}</Text>
                        <IconStar size={12} className={classes.starIcon} />
                      </Group>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">الطلب</Text>
                      <Badge 
                        size="sm" 
                        color={data.demand === 'very_high' ? 'red' : data.demand === 'high' ? 'orange' : 'blue'}
                        variant="light"
                      >
                        {data.demand === 'very_high' ? 'عالي جداً' : 
                         data.demand === 'high' ? 'عالي' : 'متوسط'}
                      </Badge>
                    </Group>
                  </Stack>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Card>
      </Stack>
    );
  };

  const renderExportTab = () => {
    return (
      <Stack gap="lg">
        <Card className={classes.exportCard} padding="lg">
          <Title order={4} mb="md">تصدير التقارير</Title>
          <Text size="sm" c="dimmed" mb="lg">
            يمكنك تحميل التقارير بصيغة PDF أو Excel للاستخدام الخارجي أو الأرشفة
          </Text>

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Paper className={classes.exportOption} p="md">
                <Group justify="space-between" mb="md">
                  <div>
                    <Text fw={600} mb="xs">تقرير الأعمال الشامل</Text>
                    <Text size="sm" c="dimmed">
                      الإيرادات، المصاريف، التحليلات المالية والتشغيلية
                    </Text>
                  </div>
                  <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                    <IconChartBar size={18} />
                  </ThemeIcon>
                </Group>
                <Group gap="sm">
                  <Button 
                    size="sm" 
                    variant="light"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => handleExportReport('pdf', 'business')}
                  >
                    PDF
                  </Button>
                  <Button 
                    size="sm" 
                    variant="light" 
                    color="green"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => handleExportReport('excel', 'business')}
                  >
                    Excel
                  </Button>
                </Group>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Paper className={classes.exportOption} p="md">
                <Group justify="space-between" mb="md">
                  <div>
                    <Text fw={600} mb="xs">تقرير أداء المبدعين</Text>
                    <Text size="sm" c="dimmed">
                      ترتيب المبدعين، الأداء، التخصصات والإحصائيات
                    </Text>
                  </div>
                  <ThemeIcon size="lg" radius="md" variant="light" color="green">
                    <IconUsers size={18} />
                  </ThemeIcon>
                </Group>
                <Group gap="sm">
                  <Button 
                    size="sm" 
                    variant="light"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => handleExportReport('pdf', 'creators')}
                  >
                    PDF
                  </Button>
                  <Button 
                    size="sm" 
                    variant="light" 
                    color="green"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => handleExportReport('excel', 'creators')}
                  >
                    Excel
                  </Button>
                </Group>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Paper className={classes.exportOption} p="md">
                <Group justify="space-between" mb="md">
                  <div>
                    <Text fw={600} mb="xs">ملخص المشاريع</Text>
                    <Text size="sm" c="dimmed">
                      حالة المشاريع، معدلات الإنجاز ومتوسط الأداء
                    </Text>
                  </div>
                  <ThemeIcon size="lg" radius="md" variant="light" color="orange">
                    <IconBriefcase size={18} />
                  </ThemeIcon>
                </Group>
                <Group gap="sm">
                  <Button 
                    size="sm" 
                    variant="light"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => handleExportReport('pdf', 'projects-summary')}
                  >
                    PDF
                  </Button>
                  <Button 
                    size="sm" 
                    variant="light" 
                    color="green"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => handleExportReport('excel', 'projects-summary')}
                  >
                    Excel
                  </Button>
                </Group>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Paper className={classes.exportOption} p="md">
                <Group justify="space-between" mb="md">
                  <div>
                    <Text fw={600} mb="xs">تحليل العملاء</Text>
                    <Text size="sm" c="dimmed">
                      أداء العملاء، الاحتفاظ، الرضا والنشاط
                    </Text>
                  </div>
                  <ThemeIcon size="lg" radius="md" variant="light" color="purple">
                    <IconFileText size={18} />
                  </ThemeIcon>
                </Group>
                <Group gap="sm">
                  <Button 
                    size="sm" 
                    variant="light"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => handleExportReport('pdf', 'clients')}
                  >
                    PDF
                  </Button>
                  <Button 
                    size="sm" 
                    variant="light" 
                    color="green"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => handleExportReport('excel', 'clients')}
                  >
                    Excel
                  </Button>
                </Group>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* أرشيف التقارير */}
        <Card className={classes.archiveCard} padding="lg">
          <Title order={4} mb="md">التقارير المؤرشفة</Title>
          <Text size="sm" c="dimmed" mb="md">
            التقارير التي تم إنشاؤها سابقاً ومتاحة للتحميل
          </Text>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>التقرير</Table.Th>
                <Table.Th>الفترة</Table.Th>
                <Table.Th>تاريخ الإنشاء</Table.Th>
                <Table.Th>الحجم</Table.Th>
                <Table.Th>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>تقرير الأعمال الشامل</Table.Td>
                <Table.Td>يوليو 2025</Table.Td>
                <Table.Td>2025-08-01</Table.Td>
                <Table.Td>2.1 MB</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="light" size="sm">
                      <IconDownload size={14} />
                    </ActionIcon>
                    <ActionIcon variant="light" size="sm" color="blue">
                      <IconExternalLink size={14} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>تقرير أداء المبدعين</Table.Td>
                <Table.Td>يوليو 2025</Table.Td>
                <Table.Td>2025-08-01</Table.Td>
                <Table.Td>1.8 MB</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="light" size="sm">
                      <IconDownload size={14} />
                    </ActionIcon>
                    <ActionIcon variant="light" size="sm" color="blue">
                      <IconExternalLink size={14} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Card>
      </Stack>
    );
  };

  return (
    <div className={classes.reportsContainer}>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      
      {/* العنوان وأدوات التحكم */}
      <div className={classes.pageHeader}>
        <Title order={2} className={classes.pageTitle}>
          التقارير والتحليلات
        </Title>
        <Text size="sm" c="dimmed" mb="lg">
          تحليلات شاملة لأداء المنصة والأعمال والمبدعين
        </Text>

        {/* أدوات الفلترة */}
        <Group gap="md" mb="xl">
          <Select
            placeholder="اختر الفترة الزمنية"
            data={[
              { value: 'today', label: 'اليوم' },
              { value: 'week', label: 'هذا الأسبوع' },
              { value: 'month', label: 'هذا الشهر' },
              { value: 'quarter', label: 'هذا الربع' },
              { value: 'year', label: 'هذه السنة' },
              { value: 'custom', label: 'فترة مخصصة' }
            ]}
            value={selectedPeriod}
            onChange={(value) => setSelectedPeriod(value || 'month')}
            leftSection={<IconCalendar size={16} />}
            style={{ minWidth: 200 }}
          />
          
          {selectedPeriod === 'custom' && (
            <DatePickerInput
              type="range"
              placeholder="اختر الفترة"
              value={customDateRange}
              onChange={(value) => setCustomDateRange(value as [Date | null, Date | null])}
              style={{ minWidth: 250 }}
            />
          )}
        </Group>
      </div>

      {/* التابات الرئيسية */}
      <Tabs value={activeTab} onChange={setActiveTab} className={classes.mainTabs}>
        <Tabs.List grow>
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            نظرة عامة
          </Tabs.Tab>
          <Tabs.Tab value="creators" leftSection={<IconUsers size={16} />}>
            أداء المبدعين
          </Tabs.Tab>
          <Tabs.Tab value="clients" leftSection={<IconBriefcase size={16} />}>
            تحليل العملاء
          </Tabs.Tab>
          <Tabs.Tab value="export" leftSection={<IconDownload size={16} />}>
            التصدير والأرشفة
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="lg">
          {renderOverviewTab()}
        </Tabs.Panel>

        <Tabs.Panel value="creators" pt="lg">
          {renderCreatorsTab()}
        </Tabs.Panel>

        <Tabs.Panel value="clients" pt="lg">
          <Stack gap="lg">
            <Card className={classes.comingSoonCard} padding="xl" style={{ textAlign: 'center' }}>
              <Title order={4} mb="md">تحليل العملاء</Title>
              <Text c="dimmed" mb="lg">
                هذا القسم قيد التطوير وسيتم إضافته قريباً
              </Text>
              <Text size="sm" c="dimmed">
                سيشمل: أداء العملاء، معدل الاحتفاظ، الرضا، وتحليل النشاط
              </Text>
            </Card>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="export" pt="lg">
          {renderExportTab()}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
