import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Profile {
  name: string;
  email: string;
  bio: string;
  company: string;
  website: string;
  phone: string;
  location: string;
  timezone: string;
}

interface Notifications {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
}

interface Theme {
  darkMode: boolean;
  compactMode: boolean;
  animations: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
}

interface Appearance {
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'blue' | 'purple' | 'green' | 'orange';
  sidebarPosition: 'left' | 'right';
}

interface SettingsContextType {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  notifications: Notifications;
  setNotifications: (notifications: Notifications) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  language: string;
  setLanguage: (language: string) => void;
  dateFormat: string;
  setDateFormat: (format: string) => void;
  timeFormat: '12h' | '24h';
  setTimeFormat: (format: '12h' | '24h') => void;
  currency: string;
  setCurrency: (currency: string) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : {
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Dashboard administrator',
      company: 'Tech Corp',
      website: 'https://example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      timezone: 'America/Los_Angeles',
    };
  });

  const [notifications, setNotifications] = useState<Notifications>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReport: false,
      productUpdates: true,
      securityAlerts: true,
      orderUpdates: true,
      promotions: false,
      newsletter: true,
      soundEnabled: true,
      desktopNotifications: true,
    };
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      compactMode: false,
      animations: true,
      highContrast: false,
      reduceMotion: false,
    };
  });

  const [appearance, setAppearance] = useState<Appearance>(() => {
    const saved = localStorage.getItem('appearance');
    return saved ? JSON.parse(saved) : {
      fontSize: 'medium',
      colorScheme: 'blue',
      sidebarPosition: 'left',
    };
  });

  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('language') || 'en-US';
  });

  const [dateFormat, setDateFormat] = useState<string>(() => {
    return localStorage.getItem('dateFormat') || 'MM/DD/YYYY';
  });

  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>(() => {
    return (localStorage.getItem('timeFormat') as '12h' | '24h') || '12h';
  });

  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('currency') || 'USD';
  });

  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('avatarUrl') || 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW18ZW58MXx8fHwxNzYxMjg4MzM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('appearance', JSON.stringify(appearance));
  }, [appearance]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('dateFormat', dateFormat);
  }, [dateFormat]);

  useEffect(() => {
    localStorage.setItem('timeFormat', timeFormat);
  }, [timeFormat]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('avatarUrl', avatarUrl);
  }, [avatarUrl]);

  // Apply theme changes to document
  useEffect(() => {
    if (theme.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (theme.compactMode) {
      document.documentElement.classList.add('compact');
    } else {
      document.documentElement.classList.remove('compact');
    }

    if (theme.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    if (theme.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [theme]);

  // Apply font size
  useEffect(() => {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    document.documentElement.style.setProperty('--font-size', sizes[appearance.fontSize]);
  }, [appearance.fontSize]);

  // Apply color scheme
  useEffect(() => {
    const schemes = {
      blue: { primary: '#3b82f6', secondary: '#60a5fa' },
      purple: { primary: '#8b5cf6', secondary: '#a78bfa' },
      green: { primary: '#10b981', secondary: '#34d399' },
      orange: { primary: '#f97316', secondary: '#fb923c' },
    };
    const scheme = schemes[appearance.colorScheme];
    document.documentElement.style.setProperty('--color-primary-custom', scheme.primary);
    document.documentElement.style.setProperty('--color-secondary-custom', scheme.secondary);
  }, [appearance.colorScheme]);

  return (
    <SettingsContext.Provider
      value={{
        profile,
        setProfile,
        notifications,
        setNotifications,
        theme,
        setTheme,
        appearance,
        setAppearance,
        language,
        setLanguage,
        dateFormat,
        setDateFormat,
        timeFormat,
        setTimeFormat,
        currency,
        setCurrency,
        avatarUrl,
        setAvatarUrl,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
