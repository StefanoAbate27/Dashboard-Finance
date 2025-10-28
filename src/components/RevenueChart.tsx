import { Card } from './ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../contexts/DataContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';

export function RevenueChart() {
  const { getMonthlyData } = useData();
  const { language } = useSettings();
  const t = useTranslation(language);
  
  const data = getMonthlyData();

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3>{t('revenueOverview')}</h3>
        <p className="text-muted-foreground">{t('monthlyRevenueOrders')}</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            labelFormatter={(label) => `${label}`}
            formatter={(value: number, name: string) => {
              if (name === 'revenue') return [`$${value.toLocaleString()}`, t('revenue')];
              if (name === 'orders') return [value, t('orders')];
              return [value, name];
            }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
