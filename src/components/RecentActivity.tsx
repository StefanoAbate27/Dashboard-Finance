import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ShoppingBag, UserPlus, Package, TrendingUp } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';

export function RecentActivity() {
  const { language } = useSettings();
  const t = useTranslation(language);

  const getActivities = () => {
    const translations = {
      'en-US': {
        newOrderPlaced: 'New order placed',
        newUserRegistered: 'New user registered',
        lowStockAlert: 'Low stock alert',
        orderCompleted: 'Order completed',
        system: 'System',
        product: 'Product',
        minAgo: 'min ago',
        hourAgo: 'hour ago',
        hoursAgo: 'hours ago',
      },
      'es-ES': {
        newOrderPlaced: 'Nuevo pedido realizado',
        newUserRegistered: 'Nuevo usuario registrado',
        lowStockAlert: 'Alerta de stock bajo',
        orderCompleted: 'Pedido completado',
        system: 'Sistema',
        product: 'Producto',
        minAgo: 'min atrás',
        hourAgo: 'hora atrás',
        hoursAgo: 'horas atrás',
      },
      'fr-FR': {
        newOrderPlaced: 'Nouvelle commande passée',
        newUserRegistered: 'Nouvel utilisateur inscrit',
        lowStockAlert: 'Alerte stock faible',
        orderCompleted: 'Commande terminée',
        system: 'Système',
        product: 'Produit',
        minAgo: 'min',
        hourAgo: 'heure',
        hoursAgo: 'heures',
      },
      'de-DE': {
        newOrderPlaced: 'Neue Bestellung aufgegeben',
        newUserRegistered: 'Neuer Benutzer registriert',
        lowStockAlert: 'Niedriger Lagerbestand',
        orderCompleted: 'Bestellung abgeschlossen',
        system: 'System',
        product: 'Produkt',
        minAgo: 'min',
        hourAgo: 'Std.',
        hoursAgo: 'Std.',
      },
      'pt-BR': {
        newOrderPlaced: 'Novo pedido realizado',
        newUserRegistered: 'Novo usuário registrado',
        lowStockAlert: 'Alerta de estoque baixo',
        orderCompleted: 'Pedido concluído',
        system: 'Sistema',
        product: 'Produto',
        minAgo: 'min atrás',
        hourAgo: 'hora atrás',
        hoursAgo: 'horas atrás',
      },
      'ja-JP': {
        newOrderPlaced: '新しい注文が入りました',
        newUserRegistered: '新規ユーザー登録',
        lowStockAlert: '在庫不足アラート',
        orderCompleted: '注文完了',
        system: 'システム',
        product: '製品',
        minAgo: '分前',
        hourAgo: '時間前',
        hoursAgo: '時間前',
      },
      'zh-CN': {
        newOrderPlaced: '新订单已下',
        newUserRegistered: '新用户已注册',
        lowStockAlert: '库存不足警报',
        orderCompleted: '订单已完成',
        system: '系统',
        product: '产品',
        minAgo: '分钟前',
        hourAgo: '小时前',
        hoursAgo: '小时前',
      },
    };

    const getLangCode = (lang: string): keyof typeof translations => {
      if (lang.startsWith('en')) return 'en-US';
      if (lang.startsWith('es')) return 'es-ES';
      if (lang.startsWith('fr')) return 'fr-FR';
      if (lang.startsWith('de')) return 'de-DE';
      if (lang.startsWith('pt')) return 'pt-BR';
      if (lang.startsWith('ja')) return 'ja-JP';
      if (lang.startsWith('zh')) return 'zh-CN';
      return 'en-US';
    };

    const langCode = getLangCode(language);
    const tr = translations[langCode];

    return [
      {
        id: 1,
        type: 'sale',
        user: 'John Doe',
        action: tr.newOrderPlaced,
        time: `2 ${tr.minAgo}`,
        amount: '$299.99',
        icon: ShoppingBag,
        color: 'text-blue-600 bg-blue-100'
      },
      {
        id: 2,
        type: 'user',
        user: 'Sarah Johnson',
        action: tr.newUserRegistered,
        time: `15 ${tr.minAgo}`,
        icon: UserPlus,
        color: 'text-green-600 bg-green-100'
      },
      {
        id: 3,
        type: 'product',
        user: tr.system,
        action: tr.lowStockAlert,
        time: `1 ${tr.hourAgo}`,
        product: 'USB-C Hub',
        icon: Package,
        color: 'text-orange-600 bg-orange-100'
      },
      {
        id: 4,
        type: 'sale',
        user: 'Michael Chen',
        action: tr.orderCompleted,
        time: `2 ${tr.hoursAgo}`,
        amount: '$159.99',
        icon: TrendingUp,
        color: 'text-purple-600 bg-purple-100'
      },
    ];
  };

  const activities = getActivities();

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3>{t('recentActivity')}</h3>
        <p className="text-muted-foreground">{t('latestUpdates')}</p>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p>{activity.user}</p>
                  {activity.amount && (
                    <Badge variant="outline">{activity.amount}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
                {activity.product && (
                  <p className="text-sm text-muted-foreground">{t('products')}: {activity.product}</p>
                )}
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
