import { LayoutDashboard, BarChart3, Package, Users, Settings, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';

type ViewType = 'overview' | 'analytics' | 'products' | 'users' | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ currentView, onViewChange, isOpen, onToggle }: SidebarProps) {
  const { language, appearance, avatarUrl, profile } = useSettings();
  const t = useTranslation(language);

  const menuItems = [
    { id: 'overview' as ViewType, label: t('overview'), icon: LayoutDashboard },
    { id: 'analytics' as ViewType, label: t('analytics'), icon: BarChart3 },
    { id: 'products' as ViewType, label: t('products'), icon: Package },
    { id: 'users' as ViewType, label: t('users'), icon: Users },
    { id: 'settings' as ViewType, label: t('settings'), icon: Settings },
  ];
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-card border-r border-border flex flex-col relative"
    >
      <div className="p-6 flex items-center justify-between">
        <motion.div
          initial={false}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-primary">Dashboard</h1>
        </motion.div>
        
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.div>
        </button>
      </div>

      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1
                transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent text-foreground'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <motion.span
                initial={false}
                animate={{ 
                  opacity: isOpen ? 1 : 0,
                  width: isOpen ? 'auto' : 0
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={profile.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white">{profile.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
          )}
          <motion.div
            initial={false}
            animate={{ 
              opacity: isOpen ? 1 : 0,
              width: isOpen ? 'auto' : 0
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-foreground">{profile.name}</p>
            <p className="text-muted-foreground text-sm">{t('admin')}</p>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
}
