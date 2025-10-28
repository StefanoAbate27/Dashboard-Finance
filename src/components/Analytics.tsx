import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Download, RefreshCw, Filter, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';
import { getCategoryTranslation } from '../utils/categoryTranslations';
import { useData } from '../contexts/DataContext';
import { toast } from 'sonner';
import { createExportMenu } from '../utils/exportUtils';

export function Analytics() {
  const { language } = useSettings();
  const t = useTranslation(language);
  const { getMonthlyData, getCategoryData, getRegionData, getTotalRevenue, getTotalOrders, getActiveUsers } = useData();

  const monthlyData = getMonthlyData();
  const categoryDataRaw = getCategoryData();
  const regionData = getRegionData();
  
  // Translate category names
  const categoryData = categoryDataRaw.map(cat => ({
    ...cat,
    name: getCategoryTranslation(language, cat.name.toLowerCase() as any)
  }));

  const totalRevenue = getTotalRevenue();
  const totalOrders = getTotalOrders();
  const newUsers = getActiveUsers();
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalSales = totalOrders;

  const handleRefresh = () => {
    toast.success(`✅ ${t('analytics')} ${t('refresh').toLowerCase()}!`);
  };

  const handleExportReport = (format: 'csv' | 'txt' | 'pdf') => {
    const data = {
      summary: {
        totalSales,
        totalRevenue,
        newUsers,
        avgOrder,
        totalOrders,
      },
      monthlyData,
      categoryData,
      regionData,
      exportDate: new Date().toISOString(),
    };

    const exportMenu = createExportMenu(
      data,
      'analytics-report',
      `${t('analytics')} - Complete Report`,
      language,
      (fmt) => toast.success(`📊 ${t('analytics')} report exported as ${fmt}!`)
    );

    switch (format) {
      case 'csv': 
        // For CSV, export monthly data
        createExportMenu(monthlyData, 'analytics-monthly', `${t('analytics')} Monthly Data`, language).csv();
        toast.success(`📊 Monthly data exported as CSV!`);
        break;
      case 'txt': exportMenu.txt(); break;
      case 'pdf': exportMenu.pdf(); break;
    }
  };

  const handleFilter = () => {
    toast.info(`🔍 ${t('filter')} options coming soon!`);
  };

  const stats = [
    { title: t('totalSales'), value: totalSales.toLocaleString(), change: '+18.2%', icon: ShoppingBag, color: 'from-blue-500 to-blue-600' },
    { title: t('newUsers'), value: newUsers.toString(), change: '+12.5%', icon: Users, color: 'from-purple-500 to-purple-600' },
    { title: t('conversion'), value: '3.24%', change: '+0.8%', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { title: t('avgOrder'), value: `$${avgOrder.toFixed(2)}`, change: '+5.2%', icon: DollarSign, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t('analytics')}</h2>
          <p className="text-muted-foreground">{t('detailedInsights')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleFilter}>
            <Filter className="w-4 h-4 mr-2" />
            {t('filter')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('refresh')}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                {t('exportReport')}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExportReport('csv')}>
                {t('export')} CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportReport('txt')}>
                {t('export')} Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportReport('pdf')}>
                {t('export')} PDF (HTML)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">{stat.title}</p>
                    <h3>{stat.value}</h3>
                    <p className="text-green-600 text-sm mt-2">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="categories">{t('category')}</TabsTrigger>
          <TabsTrigger value="regions">{t('salesByRegion')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="mb-4">{t('salesTrends')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name={t('sales')} />
                  <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} name={t('users')} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">{t('revenueComparison')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name={t('revenue')} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="mb-4">{t('salesByCategory')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">{t('categoryPerformance')}</h3>
              <div className="space-y-4 mt-8">
                {categoryData.map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between mb-2">
                      <span>{category.name}</span>
                      <span>{category.value} {t('sales')}</span>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${(category.value / Math.max(...categoryData.map(c => c.value))) * 100}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regions">
          <Card className="p-6">
            <h3 className="mb-4">{t('salesByRegion')}</h3>
            <div className="space-y-4">
              {regionData.map((region, index) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-accent/50"
                >
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span>{region.region}</span>
                      <span className="text-muted-foreground">{region.percentage}%</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                        style={{ width: `${region.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p>${region.sales.toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
