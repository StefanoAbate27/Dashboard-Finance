import { Card } from './ui/card';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, RefreshCw, Download, ChevronDown } from 'lucide-react';
import { RevenueChart } from './RevenueChart';
import { TopProducts } from './TopProducts';
import { RecentActivity } from './RecentActivity';
import { motion } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';
import { useData } from '../contexts/DataContext';
import { toast } from 'sonner';
import { createExportMenu } from '../utils/exportUtils';

export function Overview() {
  const { language } = useSettings();
  const t = useTranslation(language);
  const { getTotalRevenue, getTotalOrders, getActiveUsers, products } = useData();

  const totalRevenue = getTotalRevenue();
  const totalOrders = getTotalOrders();
  const activeUsers = getActiveUsers();
  const totalProducts = products.filter(p => p.status === 'active').length;

  const stats = [
    {
      title: t('totalRevenue'),
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: t('orders'),
      value: totalOrders.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: t('activeUsers'),
      value: activeUsers.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      title: t('products'),
      value: totalProducts.toString(),
      change: '-3.1%',
      trend: 'down',
      icon: Package,
      color: 'from-orange-500 to-orange-600'
    },
  ];

  const handleRefresh = () => {
    toast.success(`✅ ${t('overview')} ${t('refresh').toLowerCase()}!`);
  };

  const handleExport = (format: 'csv' | 'txt' | 'pdf') => {
    const data = {
      totalRevenue,
      totalOrders,
      activeUsers,
      totalProducts,
      stats: stats.map(s => ({ title: s.title, value: s.value, change: s.change })),
      exportDate: new Date().toISOString(),
    };

    const exportMenu = createExportMenu(
      data,
      'overview-data',
      `${t('overview')} - Dashboard Report`,
      language,
      (fmt) => toast.success(`📊 ${t('overview')} exported as ${fmt}!`)
    );

    switch (format) {
      case 'csv': exportMenu.csv(); break;
      case 'txt': exportMenu.txt(); break;
      case 'pdf': exportMenu.pdf(); break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t('overview')}</h2>
          <p className="text-muted-foreground">{t('welcomeBack')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('refresh')}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {t('export')}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                {t('export')} CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('txt')}>
                {t('export')} {t('export')} Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                {t('export')} PDF (HTML)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">{stat.title}</p>
                    <h3>{stat.value}</h3>
                    <div className={`flex items-center gap-1 mt-2 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendIcon className="w-4 h-4" />
                      <span className="text-sm">{stat.change}</span>
                    </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TopProducts />
      </div>

      <RecentActivity />
    </div>
  );
}
