import { Search, Menu } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';
import { NotificationsPopover } from './NotificationsPopover';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { language } = useSettings();
  const t = useTranslation(language);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="text"
            placeholder={t('search')}
            className="pl-10 bg-accent/50 border-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationsPopover />
      </div>
    </header>
  );
}
