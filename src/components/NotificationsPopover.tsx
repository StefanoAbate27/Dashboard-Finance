import { useState } from 'react';
import { Bell, Check, X, Trash2, CheckCheck, Package, Shield, TrendingUp, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useSettings } from '../contexts/SettingsContext';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  type: 'order' | 'security' | 'product' | 'user';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notificationIcons = {
  order: Package,
  security: Shield,
  product: TrendingUp,
  user: User,
};

const notificationColors = {
  order: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
  security: 'text-red-500 bg-red-50 dark:bg-red-950/30',
  product: 'text-green-500 bg-green-50 dark:bg-green-950/30',
  user: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30',
};

export function NotificationsPopover() {
  const { language } = useSettings();
  
  const getInitialNotifications = (): Notification[] => {
    if (language.startsWith('es')) {
      return [
        {
          id: '1',
          type: 'order',
          title: 'Nuevo pedido recibido',
          message: 'Pedido #12345 de John Doe por $299.99',
          time: 'Hace 5 min',
          read: false,
        },
        {
          id: '2',
          type: 'security',
          title: 'Alerta de seguridad',
          message: 'Nuevo inicio de sesión desde Chrome en Windows',
          time: 'Hace 1 hora',
          read: false,
        },
        {
          id: '3',
          type: 'product',
          title: 'Producto con stock bajo',
          message: 'iPhone 13 Pro tiene solo 5 unidades restantes',
          time: 'Hace 2 horas',
          read: false,
        },
        {
          id: '4',
          type: 'user',
          title: 'Nuevo usuario registrado',
          message: 'Sarah Johnson se unió a tu plataforma',
          time: 'Hace 3 horas',
          read: true,
        },
        {
          id: '5',
          type: 'order',
          title: 'Pedido completado',
          message: 'Pedido #12340 ha sido entregado exitosamente',
          time: 'Hace 5 horas',
          read: true,
        },
      ];
    } else if (language.startsWith('fr')) {
      return [
        {
          id: '1',
          type: 'order',
          title: 'Nouvelle commande reçue',
          message: 'Commande #12345 de John Doe pour 299,99 $',
          time: 'Il y a 5 min',
          read: false,
        },
        {
          id: '2',
          type: 'security',
          title: 'Alerte de sécurité',
          message: 'Nouvelle connexion depuis Chrome sur Windows',
          time: 'Il y a 1 heure',
          read: false,
        },
        {
          id: '3',
          type: 'product',
          title: 'Produit en rupture de stock',
          message: "L'iPhone 13 Pro n'a que 5 unités restantes",
          time: 'Il y a 2 heures',
          read: false,
        },
        {
          id: '4',
          type: 'user',
          title: 'Nouvel utilisateur inscrit',
          message: 'Sarah Johnson a rejoint votre plateforme',
          time: 'Il y a 3 heures',
          read: true,
        },
        {
          id: '5',
          type: 'order',
          title: 'Commande terminée',
          message: 'La commande #12340 a été livrée avec succès',
          time: 'Il y a 5 heures',
          read: true,
        },
      ];
    } else if (language.startsWith('de')) {
      return [
        {
          id: '1',
          type: 'order',
          title: 'Neue Bestellung erhalten',
          message: 'Bestellung #12345 von John Doe für 299,99 $',
          time: 'Vor 5 Min.',
          read: false,
        },
        {
          id: '2',
          type: 'security',
          title: 'Sicherheitswarnung',
          message: 'Neue Anmeldung von Chrome auf Windows',
          time: 'Vor 1 Stunde',
          read: false,
        },
        {
          id: '3',
          type: 'product',
          title: 'Produkt mit niedrigem Bestand',
          message: 'iPhone 13 Pro hat nur noch 5 Einheiten',
          time: 'Vor 2 Stunden',
          read: false,
        },
        {
          id: '4',
          type: 'user',
          title: 'Neuer Benutzer registriert',
          message: 'Sarah Johnson ist Ihrer Plattform beigetreten',
          time: 'Vor 3 Stunden',
          read: true,
        },
        {
          id: '5',
          type: 'order',
          title: 'Bestellung abgeschlossen',
          message: 'Bestellung #12340 wurde erfolgreich zugestellt',
          time: 'Vor 5 Stunden',
          read: true,
        },
      ];
    } else if (language.startsWith('pt')) {
      return [
        {
          id: '1',
          type: 'order',
          title: 'Novo pedido recebido',
          message: 'Pedido #12345 de John Doe por $299.99',
          time: 'Há 5 min',
          read: false,
        },
        {
          id: '2',
          type: 'security',
          title: 'Alerta de segurança',
          message: 'Novo login do Chrome no Windows',
          time: 'Há 1 hora',
          read: false,
        },
        {
          id: '3',
          type: 'product',
          title: 'Produto com estoque baixo',
          message: 'iPhone 13 Pro tem apenas 5 unidades restantes',
          time: 'Há 2 horas',
          read: false,
        },
        {
          id: '4',
          type: 'user',
          title: 'Novo usuário registrado',
          message: 'Sarah Johnson entrou em sua plataforma',
          time: 'Há 3 horas',
          read: true,
        },
        {
          id: '5',
          type: 'order',
          title: 'Pedido concluído',
          message: 'Pedido #12340 foi entregue com sucesso',
          time: 'Há 5 horas',
          read: true,
        },
      ];
    } else if (language.startsWith('ja')) {
      return [
        {
          id: '1',
          type: 'order',
          title: '新規注文を受信',
          message: 'John Doeからの注文#12345、$299.99',
          time: '5分前',
          read: false,
        },
        {
          id: '2',
          type: 'security',
          title: 'セキュリティアラート',
          message: 'Windows上のChromeから新しいログイン',
          time: '1時間前',
          read: false,
        },
        {
          id: '3',
          type: 'product',
          title: '在庫不足の製品',
          message: 'iPhone 13 Proの在庫が5個のみです',
          time: '2時間前',
          read: false,
        },
        {
          id: '4',
          type: 'user',
          title: '新規ユーザー登録',
          message: 'Sarah Johnsonがあなたのプラットフォームに参加しました',
          time: '3時間前',
          read: true,
        },
        {
          id: '5',
          type: 'order',
          title: '注文完了',
          message: '注文#12340が正常に配送されました',
          time: '5時間前',
          read: true,
        },
      ];
    } else if (language.startsWith('zh')) {
      return [
        {
          id: '1',
          type: 'order',
          title: '收到新订单',
          message: 'John Doe的订单#12345，金额$299.99',
          time: '5分钟前',
          read: false,
        },
        {
          id: '2',
          type: 'security',
          title: '安全警报',
          message: '来自Windows上Chrome的新登录',
          time: '1小时前',
          read: false,
        },
        {
          id: '3',
          type: 'product',
          title: '库存不足的产品',
          message: 'iPhone 13 Pro仅剩5件',
          time: '2小时前',
          read: false,
        },
        {
          id: '4',
          type: 'user',
          title: '新用户注册',
          message: 'Sarah Johnson加入了您的平台',
          time: '3小时前',
          read: true,
        },
        {
          id: '5',
          type: 'order',
          title: '订单已完成',
          message: '订单#12340已成功送达',
          time: '5小时前',
          read: true,
        },
      ];
    } else {
      return [
        {
          id: '1',
          type: 'order',
          title: 'New order received',
          message: 'Order #12345 from John Doe for $299.99',
          time: '5 min ago',
          read: false,
        },
        {
          id: '2',
          type: 'security',
          title: 'Security alert',
          message: 'New login from Chrome on Windows',
          time: '1 hour ago',
          read: false,
        },
        {
          id: '3',
          type: 'product',
          title: 'Low stock product',
          message: 'iPhone 13 Pro has only 5 units remaining',
          time: '2 hours ago',
          read: false,
        },
        {
          id: '4',
          type: 'user',
          title: 'New user registered',
          message: 'Sarah Johnson joined your platform',
          time: '3 hours ago',
          read: true,
        },
        {
          id: '5',
          type: 'order',
          title: 'Order completed',
          message: 'Order #12340 has been delivered successfully',
          time: '5 hours ago',
          read: true,
        },
      ];
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>(getInitialNotifications());
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getHeaderText = () => {
    if (language.startsWith('es')) return 'Notificaciones';
    if (language.startsWith('fr')) return 'Notifications';
    if (language.startsWith('de')) return 'Benachrichtigungen';
    if (language.startsWith('pt')) return 'Notificações';
    if (language.startsWith('ja')) return '通知';
    if (language.startsWith('zh')) return '通知';
    return 'Notifications';
  };

  const getMarkAllText = () => {
    if (language.startsWith('es')) return 'Marcar todo como leído';
    if (language.startsWith('fr')) return 'Tout marquer comme lu';
    if (language.startsWith('de')) return 'Alle als gelesen markieren';
    if (language.startsWith('pt')) return 'Marcar tudo como lido';
    if (language.startsWith('ja')) return 'すべて既読にする';
    if (language.startsWith('zh')) return '全部标为已读';
    return 'Mark all as read';
  };

  const getClearAllText = () => {
    if (language.startsWith('es')) return 'Limpiar todo';
    if (language.startsWith('fr')) return 'Tout effacer';
    if (language.startsWith('de')) return 'Alles löschen';
    if (language.startsWith('pt')) return 'Limpar tudo';
    if (language.startsWith('ja')) return 'すべてクリア';
    if (language.startsWith('zh')) return '清除全部';
    return 'Clear all';
  };

  const getNoNotificationsText = () => {
    if (language.startsWith('es')) return 'No hay notificaciones';
    if (language.startsWith('fr')) return 'Aucune notification';
    if (language.startsWith('de')) return 'Keine Benachrichtigungen';
    if (language.startsWith('pt')) return 'Sem notificações';
    if (language.startsWith('ja')) return '通知はありません';
    if (language.startsWith('zh')) return '无通知';
    return 'No notifications';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">{getHeaderText()}</h3>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 text-xs"
              >
                <CheckCheck className="w-3.5 h-3.5 mr-1" />
                {getMarkAllText()}
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-8 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                {getClearAllText()}
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[400px]">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-muted-foreground"
              >
                <Bell className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">{getNoNotificationsText()}</p>
              </motion.div>
            ) : (
              notifications.map((notification, index) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div
                      className={`p-4 border-b hover:bg-accent/50 transition-colors ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notificationColors[notification.type]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                            <div className="flex gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 px-2 text-xs"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  {language.startsWith('es') ? 'Leído' :
                                   language.startsWith('fr') ? 'Lu' :
                                   language.startsWith('de') ? 'Gelesen' :
                                   language.startsWith('pt') ? 'Lido' :
                                   language.startsWith('ja') ? '既読' :
                                   language.startsWith('zh') ? '已读' :
                                   'Read'}
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
