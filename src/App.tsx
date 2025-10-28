import { useState } from 'react';
import { Overview } from './components/Overview';
import { Analytics } from './components/Analytics';
import { Products } from './components/Products';
import { Users } from './components/Users';
import { Settings } from './components/Settings';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toaster } from './components/ui/sonner';
import { motion, AnimatePresence } from 'motion/react';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { DataProvider } from './contexts/DataContext';

type ViewType = 'overview' | 'analytics' | 'products' | 'users' | 'settings';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useSettings();

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Overview />;
      case 'analytics':
        return <Analytics />;
      case 'products':
        return <Products />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  const transitionDuration = theme.animations && !theme.reduceMotion ? 0.3 : 0;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Toaster position="top-right" />
      
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: theme.animations ? 20 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: theme.animations ? -20 : 0 }}
              transition={{ duration: transitionDuration, ease: "easeInOut" }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </SettingsProvider>
  );
}
