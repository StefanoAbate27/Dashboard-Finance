import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ScrollArea } from './ui/scroll-area';
import { User, Bell, Shield, Palette, Globe, Upload, Trash2, Check, Smartphone, Monitor, Eye, EyeOff, Download, Moon, Sun, Zap, Volume2, VolumeX, Lock, Key, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';
import { getAdditionalTranslation } from '../utils/additionalTranslations';
import { createExportMenu } from '../utils/exportUtils';

interface Session {
  id: number;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export function Settings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    profile: globalProfile,
    setProfile: setGlobalProfile,
    notifications: globalNotifications,
    setNotifications: setGlobalNotifications,
    theme: globalTheme,
    setTheme: setGlobalTheme,
    appearance: globalAppearance,
    setAppearance: setGlobalAppearance,
    language: globalLanguage,
    setLanguage: setGlobalLanguage,
    dateFormat: globalDateFormat,
    setDateFormat: setGlobalDateFormat,
    timeFormat: globalTimeFormat,
    setTimeFormat: setGlobalTimeFormat,
    currency: globalCurrency,
    setCurrency: setGlobalCurrency,
    avatarUrl: globalAvatarUrl,
    setAvatarUrl: setGlobalAvatarUrl,
  } = useSettings();

  const t = useTranslation(globalLanguage);
  const ta = (key: string) => getAdditionalTranslation(globalLanguage, key as any);

  const [localProfile, setLocalProfile] = useState(globalProfile);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailFrequency, setEmailFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');
  const [notificationVolume, setNotificationVolume] = useState([75]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupCodesGenerated, setBackupCodesGenerated] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [show2FADialog, setShow2FADialog] = useState(false);
  const [showBackupCodesDialog, setShowBackupCodesDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<number | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, device: 'MacOS', browser: 'Chrome', location: 'San Francisco, CA', lastActive: '', isCurrent: true },
    { id: 2, device: 'iPhone', browser: 'Safari', location: 'San Francisco, CA', lastActive: '', isCurrent: false },
    { id: 3, device: 'Windows', browser: 'Edge', location: 'New York, NY', lastActive: '', isCurrent: false },
  ]);

  // Update session labels when language changes
  useEffect(() => {
    setSessions([
      { id: 1, device: 'MacOS', browser: 'Chrome', location: 'San Francisco, CA', lastActive: t('currentSession'), isCurrent: true },
      { id: 2, device: 'iPhone', browser: 'Safari', location: 'San Francisco, CA', lastActive: `2 ${ta('hoursAgo')}`, isCurrent: false },
      { id: 3, device: 'Windows', browser: 'Edge', location: 'New York, NY', lastActive: `1 ${ta('dayAgo')}`, isCurrent: false },
    ]);
  }, [globalLanguage]);

  const backupCodes = [
    'ABCD-1234-EFGH',
    'IJKL-5678-MNOP',
    'QRST-9012-UVWX',
    'YZAB-3456-CDEF',
    'GHIJ-7890-KLMN',
  ];

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
    { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  ];

  const timezones = [
    'America/Los_Angeles',
    'America/New_York',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  ];

  // Check for unsaved changes
  useEffect(() => {
    setUnsavedChanges(JSON.stringify(localProfile) !== JSON.stringify(globalProfile));
  }, [localProfile, globalProfile]);

  // Password strength calculator
  useEffect(() => {
    if (!passwords.new) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (passwords.new.length >= 8) strength += 25;
    if (passwords.new.length >= 12) strength += 25;
    if (/[a-z]/.test(passwords.new) && /[A-Z]/.test(passwords.new)) strength += 25;
    if (/[0-9]/.test(passwords.new)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(passwords.new)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
  }, [passwords.new]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setGlobalAvatarUrl(reader.result as string);
        toast.success('✅ Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setGlobalAvatarUrl('');
    toast.success('Profile picture removed');
  };

  const handleProfileSave = () => {
    if (!localProfile.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!localProfile.email.trim() || !localProfile.email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    setGlobalProfile(localProfile);
    setUnsavedChanges(false);
    toast.success('✅ Profile updated successfully!');
  };

  const handleProfileReset = () => {
    setLocalProfile(globalProfile);
    setUnsavedChanges(false);
    toast.info('Changes discarded');
  };

  const handleNotificationToggle = (key: keyof typeof globalNotifications, checked: boolean) => {
    const newNotifications = { ...globalNotifications, [key]: checked };
    setGlobalNotifications(newNotifications);
    
    const messages: Record<string, string> = {
      emailNotifications: checked ? '📧 Email notifications enabled' : '📧 Email notifications disabled',
      pushNotifications: checked ? '🔔 Push notifications enabled' : '🔔 Push notifications disabled',
      weeklyReport: checked ? '📊 Weekly reports enabled' : '📊 Weekly reports disabled',
      productUpdates: checked ? '🎉 Product updates enabled' : '🎉 Product updates disabled',
      securityAlerts: checked ? '🔒 Security alerts enabled' : '🔒 Security alerts disabled',
      orderUpdates: checked ? '📦 Order updates enabled' : '📦 Order updates disabled',
      promotions: checked ? '🎁 Promotions enabled' : '🎁 Promotions disabled',
      newsletter: checked ? '📰 Newsletter enabled' : '📰 Newsletter disabled',
      soundEnabled: checked ? '🔊 Sound enabled' : '🔇 Sound disabled',
      desktopNotifications: checked ? '💻 Desktop notifications enabled' : '💻 Desktop notifications disabled',
    };
    toast.success(messages[key] || 'Setting updated');
  };

  const handleThemeToggle = (key: keyof typeof globalTheme, checked: boolean) => {
    const newTheme = { ...globalTheme, [key]: checked };
    setGlobalTheme(newTheme);
    
    const messages: Record<string, string> = {
      darkMode: checked ? '🌙 Dark mode enabled' : '☀️ Light mode enabled',
      compactMode: checked ? '📐 Compact mode enabled' : '📐 Compact mode disabled',
      animations: checked ? '✨ Animations enabled' : '✨ Animations disabled',
      highContrast: checked ? '🎨 High contrast enabled' : '🎨 High contrast disabled',
      reduceMotion: checked ? '🎬 Reduced motion enabled' : '🎬 Reduced motion disabled',
    };
    toast.success(messages[key] || 'Theme updated');
  };

  const handleAppearanceChange = (key: keyof typeof globalAppearance, value: string) => {
    setGlobalAppearance({ ...globalAppearance, [key]: value } as typeof globalAppearance);
    toast.success('Appearance updated');
  };

  const handleLanguageChange = (newLanguage: string) => {
    setGlobalLanguage(newLanguage);
    setShowLanguageDialog(false);
    const selectedLang = languages.find(l => l.code === newLanguage);
    toast.success(`🌍 Language changed to ${selectedLang?.name}`);
  };

  const handlePasswordUpdate = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordStrength < 50) {
      toast.error('Password is too weak. Please use a stronger password.');
      return;
    }
    setPasswords({ current: '', new: '', confirm: '' });
    toast.success(`✅ ${ta('passwordUpdated')}`);
  };

  const confirmEnable2FA = () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    setTwoFactorEnabled(true);
    setShow2FADialog(false);
    setVerificationCode('');
    toast.success('✅ Two-factor authentication enabled!');
  };

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false);
    toast.success('Two-factor authentication disabled');
  };

  const handleGenerateBackupCodes = () => {
    setBackupCodesGenerated(true);
    setShowBackupCodesDialog(true);
    toast.success('Backup codes generated!');
  };

  const handleDownloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded!');
  };

  const confirmRevokeSession = () => {
    if (sessionToRevoke !== null) {
      setSessions(sessions.filter(s => s.id !== sessionToRevoke));
      setSessionToRevoke(null);
      toast.success('Session revoked successfully');
    }
  };

  const handleRevokeAllSessions = () => {
    setSessions(sessions.filter(s => s.isCurrent));
    toast.success('All other sessions have been revoked');
  };

  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'txt'>('pdf');
  const [showPreview, setShowPreview] = useState(false);

  const getExportData = () => ({
    profile: globalProfile,
    notifications: globalNotifications,
    theme: globalTheme,
    appearance: globalAppearance,
    language: globalLanguage,
    dateFormat: globalDateFormat,
    timeFormat: globalTimeFormat,
    currency: globalCurrency,
    exportDate: new Date().toISOString(),
  });

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const confirmExportData = () => {
    const data = getExportData();
    
    const exportMenu = createExportMenu(
      data,
      'dashboard-settings',
      t('accountSettings'),
      globalLanguage,
      (format) => {
        setShowExportDialog(false);
        setShowPreview(false);
        toast.success(`✅ ${t('dataExported')} (${format})`);
      }
    );

    if (exportFormat === 'pdf') {
      exportMenu.pdf();
    } else if (exportFormat === 'txt') {
      exportMenu.txt();
    }
  };

  const confirmDeleteAccount = () => {
    if (deleteConfirmText !== ta('deleteText')) {
      toast.error(ta('confirmDelete'));
      return;
    }
    setShowDeleteDialog(false);
    setDeleteConfirmText('');
    toast.error('Account deletion initiated. You will receive a confirmation email.');
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('Android')) return Smartphone;
    return Monitor;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-orange-500';
    if (passwordStrength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return ta('weak');
    if (passwordStrength < 60) return ta('fair');
    if (passwordStrength < 80) return ta('good');
    return ta('strong');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t('settings')}</h2>
          <p className="text-muted-foreground">{t('manageSettings')}</p>
        </div>
        {unsavedChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Badge variant="secondary" className="gap-1">
              <AlertCircle className="w-3 h-3" />
              {ta('unsavedChanges')}
            </Badge>
          </motion.div>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{t('profile')}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">{t('notifications')}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">{t('security')}</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">{t('appearance')}</span>
          </TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    {globalAvatarUrl ? (
                      <AvatarImage src={globalAvatarUrl} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                        <User className="w-12 h-12 text-white" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3>{t('profilePicture')}</h3>
                    <p className="text-muted-foreground mb-3">{ta('imageFormats')}</p>
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {t('uploadNew')}
                      </Button>
                      {globalAvatarUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleRemoveAvatar}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('remove')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('fullName')} *</Label>
                    <Input
                      id="name"
                      value={localProfile.name}
                      onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                      placeholder={t('fullName')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={localProfile.email}
                      onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                      placeholder={ta('emailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">{t('bio')}</Label>
                  <Textarea
                    id="bio"
                    value={localProfile.bio}
                    onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                    rows={3}
                    maxLength={500}
                    placeholder={ta('tellUsAboutYourself')}
                  />
                  <p className="text-sm text-muted-foreground">{localProfile.bio.length}/500 {ta('characters')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">{t('company')}</Label>
                    <Input
                      id="company"
                      value={localProfile.company}
                      onChange={(e) => setLocalProfile({ ...localProfile, company: e.target.value })}
                      placeholder={ta('yourCompanyName')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={localProfile.phone}
                      onChange={(e) => setLocalProfile({ ...localProfile, phone: e.target.value })}
                      placeholder={ta('phonePlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">{t('website')}</Label>
                    <Input
                      id="website"
                      type="url"
                      value={localProfile.website}
                      onChange={(e) => setLocalProfile({ ...localProfile, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">{t('location')}</Label>
                    <Input
                      id="location"
                      value={localProfile.location}
                      onChange={(e) => setLocalProfile({ ...localProfile, location: e.target.value })}
                      placeholder={ta('yourCity')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">{t('timezone')}</Label>
                   <Select
                    value={localProfile.timezone}
                    onValueChange={(value: string) => setLocalProfile(prev => ({ ...prev, timezone: value }))}
                    >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <h4>{ta('dataManagement')}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{ta('exportOrDeleteData')}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                      <Download className="w-4 h-4 mr-2" />
                      {t('exportData')}
                    </Button>
                    <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('deleteAccount')}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleProfileReset} disabled={!unsavedChanges}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t('reset')}
                  </Button>
                  <Button onClick={handleProfileSave}>
                    <Save className="w-4 h-4 mr-2" />
                    {t('saveChanges')}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3>{t('emailNotifications')}</h3>
                  <p className="text-muted-foreground">{ta('manageEmailPreferences')}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: t('emailNotifications'), desc: ta('receiveEmailNotifications') },
                    { key: 'orderUpdates', label: t('orderUpdates'), desc: ta('orderStatusChanges') },
                    { key: 'productUpdates', label: t('productUpdates'), desc: ta('newsAboutProducts') },
                    { key: 'promotions', label: t('promotions'), desc: ta('specialOffersDiscounts') },
                    { key: 'newsletter', label: t('newsletter'), desc: ta('weeklyNewsletter') },
                    { key: 'securityAlerts', label: t('securityAlerts'), desc: ta('securityNotifications') },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={item.key}>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        id={item.key}
                        checked={globalNotifications[item.key as keyof typeof globalNotifications]}
                        onCheckedChange={(checked: boolean) => handleNotificationToggle(item.key as keyof typeof globalNotifications, checked)}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label>{t('emailFrequency')}</Label>
                    <p className="text-sm text-muted-foreground mb-3">{ta('howOftenEmails')}</p>
                    <RadioGroup value={emailFrequency} onValueChange={(value: 'instant' | 'daily' | 'weekly') => {
                      setEmailFrequency(value);
                      toast.success(`Email frequency: ${value}`);
                    }}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="instant" id="instant" />
                        <Label htmlFor="instant">{t('instant')} - {ta('getEmailsImmediately')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily">{t('daily')} - {ta('dailyDigest')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">{t('weekly')} - {ta('weeklyDigest')}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3>{t('pushNotifications')}</h3>
                  <p className="text-muted-foreground">{ta('configurePushSettings')}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  {[
                    { key: 'pushNotifications', label: t('pushNotifications'), desc: ta('receivePushNotifications') },
                    { key: 'desktopNotifications', label: t('desktopNotifications'), desc: ta('showDesktopNotifications') },
                    { key: 'soundEnabled', label: t('soundAlerts'), desc: ta('playSoundForNotifications') },
                    { key: 'weeklyReport', label: t('weeklyReport'), desc: ta('getWeeklyReports') },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={item.key}>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        id={item.key}
                        checked={globalNotifications[item.key as keyof typeof globalNotifications]}
                        onCheckedChange={(checked: boolean) => handleNotificationToggle(item.key as keyof typeof globalNotifications, checked)}

                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t('notificationVolume')}</Label>
                    {globalNotifications.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <Slider
                    value={notificationVolume}
                    onValueChange={(value: number[] | number) => {
                    const newValue = Array.isArray(value) ? value : [value];
                    setNotificationVolume(newValue);
                    toast.success(`Volume: ${newValue[0]}%`);
                    }}
                    max={100}
                    step={1}
                    disabled={!globalNotifications.soundEnabled}
                  />
                  <p className="text-sm text-muted-foreground text-right">{notificationVolume[0]}%</p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => toast.success(`✅ ${ta('preferenceSaved')}`)}>
                    <Save className="w-4 h-4 mr-2" />
                    {t('savePreferences')}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3>{t('changePassword')}</h3>
                  <p className="text-muted-foreground">{ta('passwordSecurityDesc')}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">{t('currentPassword')}</Label>
                    <div className="relative">
                      <Input 
                        id="current-password" 
                        type={showPasswords.current ? "text" : "password"}
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        placeholder={ta('enterCurrentPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">{t('newPassword')}</Label>
                    <div className="relative">
                      <Input 
                        id="new-password" 
                        type={showPasswords.new ? "text" : "password"}
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        placeholder={ta('enterNewPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {passwords.new && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{ta('passwordStrength')}:</span>
                          <span className={passwordStrength >= 60 ? 'text-green-600' : 'text-orange-600'}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${getPasswordStrengthColor()}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">{ta('passwordRequirements')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>
                    <div className="relative">
                      <Input 
                        id="confirm-password" 
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        placeholder={ta('confirmNewPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handlePasswordUpdate}>
                    <Lock className="w-4 h-4 mr-2" />
                    {t('updatePassword')}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3>{t('twoFactorAuth')}</h3>
                  <p className="text-muted-foreground">{ta('additionalSecurityLayer')}</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${twoFactorEnabled ? 'bg-green-100' : 'bg-muted'}`}>
                      {twoFactorEnabled ? (
                        <Check className="w-6 h-6 text-green-600" />
                      ) : (
                        <Shield className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p>{t('twoFactorAuth')}</p>
                      <p className="text-sm text-muted-foreground">
                        {twoFactorEnabled ? ta('enabledAccountProtected') : ta('disabledEnhanceSecurity')}
                      </p>
                    </div>
                  </div>
                  {twoFactorEnabled ? (
                    <Button variant="outline" onClick={handleDisable2FA}>
                      {t('disable')}
                    </Button>
                  ) : (
                    <Button onClick={() => setShow2FADialog(true)}>
                      {t('enable')}
                    </Button>
                  )}
                </div>

                {twoFactorEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="p-4 rounded-lg border bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p>{t('backupCodes')}</p>
                          <p className="text-sm text-muted-foreground">
                            {backupCodesGenerated ? ta('generatedStoreSafely') : ta('notGeneratedYet')}
                          </p>
                        </div>
                        <Button variant="outline" onClick={handleGenerateBackupCodes}>
                          <Key className="w-4 h-4 mr-2" />
                          {backupCodesGenerated ? ta('regenerate') : t('generate')}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3>{t('activeSessions')}</h3>
                    <p className="text-muted-foreground">{ta('yourActiveSessions')}</p>
                  </div>
                  {sessions.length > 1 && (
                    <Button variant="outline" onClick={handleRevokeAllSessions}>
                      {t('revokeAllOthers')}
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  {sessions.map((session) => {
                    const DeviceIcon = getDeviceIcon(session.device);
                    
                    return (
                      <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <DeviceIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p>{session.browser} on {session.device}</p>
                              {session.isCurrent && (
                                <Badge variant="default" className="bg-green-500">{ta('current')}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {session.lastActive} • {session.location}
                            </p>
                          </div>
                        </div>
                        {!session.isCurrent && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSessionToRevoke(session.id)}
                          >
                            {t('revoke')}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3>{t('themeSettings')}</h3>
                  <p className="text-muted-foreground">{ta('customizeLookFeel')}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  {[
                    { key: 'darkMode', label: t('darkMode'), desc: ta('enableDarkTheme'), icon: Moon },
                    { key: 'compactMode', label: t('compactMode'), desc: ta('reduceSpacing'), icon: Zap },
                    { key: 'animations', label: t('animations'), desc: ta('enableSmoothAnimations'), icon: Zap },
                    { key: 'highContrast', label: t('highContrast'), desc: ta('increaseContrast'), icon: Sun },
                    { key: 'reduceMotion', label: t('reduceMotion'), desc: ta('minimizeAnimations'), icon: Zap },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <Label htmlFor={item.key}>{item.label}</Label>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <Switch
                        id={item.key}
                        checked={globalTheme[item.key as keyof typeof globalTheme]}
                        onCheckedChange={(checked: boolean) => handleThemeToggle(item.key as keyof typeof globalTheme, checked)}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>{t('fontSize')}</Label>
                    <RadioGroup
                    value={globalAppearance.fontSize}
                    onValueChange={(value: 'small' | 'medium' | 'large') => handleAppearanceChange('fontSize', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="small" />
                        <Label htmlFor="small">{t('small')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">{t('medium')} (Default)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="large" />
                        <Label htmlFor="large">{t('large')}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>{t('colorScheme')}</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'blue', color: 'from-blue-500 to-blue-600' },
                        { value: 'purple', color: 'from-purple-500 to-purple-600' },
                        { value: 'green', color: 'from-green-500 to-green-600' },
                        { value: 'orange', color: 'from-orange-500 to-orange-600' },
                      ].map((scheme) => (
                        <button
                          key={scheme.value}
                          onClick={() => handleAppearanceChange('colorScheme', scheme.value)}
                          className={`h-12 rounded-lg bg-gradient-to-r ${scheme.color} relative ${
                            globalAppearance.colorScheme === scheme.value ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                        >
                          {globalAppearance.colorScheme === scheme.value && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>{t('sidebarPosition')}</Label>
                    <RadioGroup
                        value={globalAppearance.sidebarPosition}
                        onValueChange={(value: 'left' | 'right') => handleAppearanceChange('sidebarPosition', value)}
                        >

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="left" id="left" />
                        <Label htmlFor="left">{t('left')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="right" id="right" />
                        <Label htmlFor="right">{t('right')}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => toast.success('✅ Settings saved!')}>
                    <Save className="w-4 h-4 mr-2" />
                    {t('saveSettings')}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3>{t('languageRegion')}</h3>
                  <p className="text-muted-foreground">{ta('selectYourLanguage')}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p>{t('language')}</p>
                        <p className="text-sm text-muted-foreground">
                          {languages.find(l => l.code === globalLanguage)?.flag} {languages.find(l => l.code === globalLanguage)?.name}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setShowLanguageDialog(true)}>
                      {t('change')}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('dateFormat')}</Label>
                    <Select
                     value={globalDateFormat}
                    onValueChange={(value: string) => {
                    setGlobalDateFormat(value);
                    toast.success(`📅 Date format: ${value}`);
                     }}
                      >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (10/24/2025)</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (24/10/2025)</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2025-10-24)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('timeFormat')}</Label>
                    <RadioGroup value={globalTimeFormat} onValueChange={(value: '12h' | '24h') => {
                      setGlobalTimeFormat(value);
                      toast.success(`⏰ Time format: ${value === '12h' ? '12-hour' : '24-hour'}`);
                    }}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="12h" id="12h" />
                        <Label htmlFor="12h">12-hour (2:30 PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="24h" id="24h" />
                        <Label htmlFor="24h">24-hour (14:30)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('currency')}</Label>
                    <Select
                     value={globalCurrency}
                      onValueChange={(value: string) => {
                      setGlobalCurrency(value);
                      const selectedCurr = currencies.find(c => c.code === value);
                      toast.success(`💰 Currency: ${selectedCurr?.name ?? value}`);
                       }}
                      >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.name} ({curr.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('enable')} {t('twoFactorAuth')}</DialogTitle>
            <DialogDescription>
              {ta('scanWithAuthenticator')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center p-6 bg-muted rounded-lg">
              <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-2 flex items-center justify-center">
                    <Key className="w-20 h-20 text-white opacity-50" />
                  </div>
                  <p className="text-xs text-muted-foreground">{ta('scanWithAuthenticator')}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{ta('verificationCode')}</Label>
              <Input 
                placeholder={ta('enterCode')} 
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {ta('cantScanQR')} <code className="bg-muted px-2 py-1 rounded">ABCD-EFGH-IJKL-MNOP</code>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShow2FADialog(false);
              setVerificationCode('');
            }}>
              {t('cancel')}
            </Button>
            <Button onClick={confirmEnable2FA}>
              <Check className="w-4 h-4 mr-2" />
              {ta('verify')} & {t('enable')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBackupCodesDialog} onOpenChange={setShowBackupCodesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ta('backupCodesTitle')}</DialogTitle>
            <DialogDescription>
              {ta('backupCodesDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              {backupCodes.map((code, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                  <code className="text-sm">{code}</code>
                  <Badge variant="secondary">{index + 1}/5</Badge>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleDownloadBackupCodes}>
                <Download className="w-4 h-4 mr-2" />
                {ta('downloadCodes')}
              </Button>
              <Button className="flex-1" onClick={() => setShowBackupCodesDialog(false)}>
                {ta('close')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
  open={showExportDialog}
  onOpenChange={(open: boolean) => {
    setShowExportDialog(open);
    if (!open) setShowPreview(false);
  }}
>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              {showPreview ? (
                globalLanguage.startsWith('es') ? 'Vista Previa de Exportación' :
                globalLanguage.startsWith('fr') ? 'Aperçu de l\'exportation' :
                globalLanguage.startsWith('de') ? 'Exportvorschau' :
                globalLanguage.startsWith('pt') ? 'Visualização da Exportação' :
                globalLanguage.startsWith('ja') ? 'エクスポートのプレビュー' :
                globalLanguage.startsWith('zh') ? '导出预览' :
                'Export Preview'
              ) : t('exportData')}
            </DialogTitle>
            <DialogDescription>
              {showPreview ? (
                globalLanguage.startsWith('es') ? 'Revisa tus datos antes de exportar' :
                globalLanguage.startsWith('fr') ? 'Vérifiez vos données avant l\'exportation' :
                globalLanguage.startsWith('de') ? 'Überprüfen Sie Ihre Daten vor dem Export' :
                globalLanguage.startsWith('pt') ? 'Revise seus dados antes de exportar' :
                globalLanguage.startsWith('ja') ? 'エクスポート前にデータを確認' :
                globalLanguage.startsWith('zh') ? '导出前查看您的数据' :
                'Review your data before exporting'
              ) : ta('exportOrDeleteData')}
            </DialogDescription>
          </DialogHeader>
          
          {!showPreview ? (
            <div className="space-y-6">
              {/* What's included section */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
                <h4 className="mb-3 flex items-center gap-2 text-primary">
                  <Check className="w-4 h-4" />
                  {ta('whatIncluded')}
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    {ta('profileSettings')}
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    {ta('notificationPreferences')}
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                    {ta('themeAppearance')}
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    {ta('languageRegion')}
                  </li>
                </ul>
              </div>

              {/* Format selection */}
              <div className="space-y-3">
                <Label>{t('format')}</Label>
                <RadioGroup value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                  <div className="space-y-2">
                    <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      exportFormat === 'pdf' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`} onClick={() => setExportFormat('pdf')}>
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">PDF Document</div>
                            <div className="text-sm text-muted-foreground">
                              {globalLanguage.startsWith('es') ? 'Formato profesional con diseño visual' : 
                               globalLanguage.startsWith('fr') ? 'Format professionnel avec design visuel' :
                               globalLanguage.startsWith('de') ? 'Professionelles Format mit visuellem Design' :
                               globalLanguage.startsWith('pt') ? 'Formato profissional com design visual' :
                               globalLanguage.startsWith('ja') ? 'ビジュアルデザイン付きプロフェッショナル形式' :
                               globalLanguage.startsWith('zh') ? '专业格式，带有视觉设计' :
                               'Professional format with visual design'}
                            </div>
                          </div>
                          <Badge variant="default" className="ml-2">{globalLanguage.startsWith('es') ? 'Recomendado' : 
                               globalLanguage.startsWith('fr') ? 'Recommandé' :
                               globalLanguage.startsWith('de') ? 'Empfohlen' :
                               globalLanguage.startsWith('pt') ? 'Recomendado' :
                               globalLanguage.startsWith('ja') ? '推奨' :
                               globalLanguage.startsWith('zh') ? '推荐' : 'Recommended'}</Badge>
                        </div>
                      </Label>
                    </div>
                    
                    <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      exportFormat === 'txt' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`} onClick={() => setExportFormat('txt')}>
                      <RadioGroupItem value="txt" id="txt" />
                      <Label htmlFor="txt" className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">
                            {globalLanguage.startsWith('es') ? 'Texto Plano' : 
                             globalLanguage.startsWith('fr') ? 'Texte Brut' :
                             globalLanguage.startsWith('de') ? 'Klartext' :
                             globalLanguage.startsWith('pt') ? 'Texto Simples' :
                             globalLanguage.startsWith('ja') ? 'プレーンテキスト' :
                             globalLanguage.startsWith('zh') ? '纯文本' :
                             'Plain Text'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {globalLanguage.startsWith('es') ? 'Formato simple y estructurado' : 
                             globalLanguage.startsWith('fr') ? 'Format simple et structuré' :
                             globalLanguage.startsWith('de') ? 'Einfaches und strukturiertes Format' :
                             globalLanguage.startsWith('pt') ? 'Formato simples e estruturado' :
                             globalLanguage.startsWith('ja') ? 'シンプ��で構造化された形式' :
                             globalLanguage.startsWith('zh') ? '简单且结构化的格式' :
                             'Simple and structured format'}
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-lg border p-4">
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    👤 {ta('profileSettings')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">✏️ {globalLanguage.startsWith('es') ? 'Nombre' : globalLanguage.startsWith('fr') ? 'Nom' : globalLanguage.startsWith('de') ? 'Name' : globalLanguage.startsWith('pt') ? 'Nome' : globalLanguage.startsWith('ja') ? '名前' : globalLanguage.startsWith('zh') ? '名称' : 'Name'}:</span> <span className="font-medium">{globalProfile.name}</span></p>
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">📧 Email:</span> <span className="font-medium">{globalProfile.email}</span></p>
                    {globalProfile.phone && <p className="flex items-center gap-2"><span className="text-muted-foreground">📱 {globalLanguage.startsWith('es') ? 'Teléfono' : globalLanguage.startsWith('fr') ? 'Téléphone' : globalLanguage.startsWith('de') ? 'Telefon' : globalLanguage.startsWith('pt') ? 'Telefone' : globalLanguage.startsWith('ja') ? '電話' : globalLanguage.startsWith('zh') ? '电话' : 'Phone'}:</span> <span className="font-medium">{globalProfile.phone}</span></p>}
                    {globalProfile.bio && <p className="flex items-center gap-2"><span className="text-muted-foreground">📝 Bio:</span> <span className="font-medium">{globalProfile.bio}</span></p>}
                    {globalProfile.company && <p className="flex items-center gap-2"><span className="text-muted-foreground">🏢 {globalLanguage.startsWith('es') ? 'Empresa' : globalLanguage.startsWith('fr') ? 'Entreprise' : globalLanguage.startsWith('de') ? 'Unternehmen' : globalLanguage.startsWith('pt') ? 'Empresa' : globalLanguage.startsWith('ja') ? '会社' : globalLanguage.startsWith('zh') ? '公司' : 'Company'}:</span> <span className="font-medium">{globalProfile.company}</span></p>}
                    {globalProfile.website && <p className="flex items-center gap-2"><span className="text-muted-foreground">🌐 Website:</span> <span className="font-medium">{globalProfile.website}</span></p>}
                    {globalProfile.location && <p className="flex items-center gap-2"><span className="text-muted-foreground">📍 {globalLanguage.startsWith('es') ? 'Ubicación' : globalLanguage.startsWith('fr') ? 'Emplacement' : globalLanguage.startsWith('de') ? 'Standort' : globalLanguage.startsWith('pt') ? 'Localização' : globalLanguage.startsWith('ja') ? '場所' : globalLanguage.startsWith('zh') ? '位置' : 'Location'}:</span> <span className="font-medium">{globalProfile.location}</span></p>}
                    {globalProfile.timezone && <p className="flex items-center gap-2"><span className="text-muted-foreground">🌍 {globalLanguage.startsWith('es') ? 'Zona Horaria' : globalLanguage.startsWith('fr') ? 'Fuseau Horaire' : globalLanguage.startsWith('de') ? 'Zeitzone' : globalLanguage.startsWith('pt') ? 'Fuso Horário' : globalLanguage.startsWith('ja') ? 'タイムゾーン' : globalLanguage.startsWith('zh') ? '时区' : 'Timezone'}:</span> <span className="font-medium">{globalProfile.timezone}</span></p>}
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-400">
                    🔔 {ta('notificationPreferences')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                   <span className="text-muted-foreground">📧 Email:</span>
                  <span className="font-medium">{globalNotifications.emailNotifications ? '✅' : '❌'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                  <span className="text-muted-foreground">📲 Push:</span>
                  <span className="font-medium">{globalNotifications.pushNotifications ? '✅' : '❌'}</span>
                  </p>
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">📊 {globalLanguage.startsWith('es') ? 'Reporte Semanal' : globalLanguage.startsWith('fr') ? 'Rapport Hebdomadaire' : globalLanguage.startsWith('de') ? 'Wöchentlicher Bericht' : globalLanguage.startsWith('pt') ? 'Relatório Semanal' : globalLanguage.startsWith('ja') ? '週次レポート' : globalLanguage.startsWith('zh') ? '每周报告' : 'Weekly Report'}:</span> <span className="font-medium">{globalNotifications.weeklyReport ? '✅' : '❌'}</span></p>
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">🆕 {globalLanguage.startsWith('es') ? 'Actualizaciones de Producto' : globalLanguage.startsWith('fr') ? 'Mises à Jour Produit' : globalLanguage.startsWith('de') ? 'Produktaktualisierungen' : globalLanguage.startsWith('pt') ? 'Atualizações de Produto' : globalLanguage.startsWith('ja') ? '製品アップデート' : globalLanguage.startsWith('zh') ? '产品更新' : 'Product Updates'}:</span> <span className="font-medium">{globalNotifications.productUpdates ? '✅' : '❌'}</span></p>
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">🔒 {globalLanguage.startsWith('es') ? 'Alertas de Seguridad' : globalLanguage.startsWith('fr') ? 'Alertes de Sécurité' : globalLanguage.startsWith('de') ? 'Sicherheitswarnungen' : globalLanguage.startsWith('pt') ? 'Alertas de Segurança' : globalLanguage.startsWith('ja') ? 'セキュリティアラート' : globalLanguage.startsWith('zh') ? '安全警报' : 'Security Alerts'}:</span> <span className="font-medium">{globalNotifications.securityAlerts ? '✅' : '❌'}</span></p>
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-pink-700 dark:text-pink-400">
                    🎨 {ta('themeAppearance')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">🌙 {globalLanguage.startsWith('es') ? 'Modo Oscuro' : globalLanguage.startsWith('fr') ? 'Mode Sombre' : globalLanguage.startsWith('de') ? 'Dunkler Modus' : globalLanguage.startsWith('pt') ? 'Modo Escuro' : globalLanguage.startsWith('ja') ? 'ダークモード' : globalLanguage.startsWith('zh') ? '深色模式' : 'Dark Mode'}:</span> <span className="font-medium">{globalTheme.darkMode ? '✅' : '❌'}</span></p>
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">📐 {globalLanguage.startsWith('es') ? 'Modo Compacto' : globalLanguage.startsWith('fr') ? 'Mode Compact' : globalLanguage.startsWith('de') ? 'Kompaktmodus' : globalLanguage.startsWith('pt') ? 'Modo Compacto' : globalLanguage.startsWith('ja') ? 'コンパクトモード' : globalLanguage.startsWith('zh') ? '紧凑模式' : 'Compact Mode'}:</span> <span className="font-medium">{globalTheme.compactMode ? '✅' : '❌'}</span></p>
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">✨ {globalLanguage.startsWith('es') ? 'Animaciones' : globalLanguage.startsWith('fr') ? 'Animations' : globalLanguage.startsWith('de') ? 'Animationen' : globalLanguage.startsWith('pt') ? 'Animações' : globalLanguage.startsWith('ja') ? 'アニメーション' : globalLanguage.startsWith('zh') ? '动画' : 'Animations'}:</span> <span className="font-medium">{globalTheme.animations ? '✅' : '❌'}</span></p>
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">🔤 {globalLanguage.startsWith('es') ? 'Tamaño de Fuente' : globalLanguage.startsWith('fr') ? 'Taille de Police' : globalLanguage.startsWith('de') ? 'Schriftgröße' : globalLanguage.startsWith('pt') ? 'Tamanho da Fonte' : globalLanguage.startsWith('ja') ? 'フォントサイズ' : globalLanguage.startsWith('zh') ? '字体大小' : 'Font Size'}:</span> <span className="font-medium">{globalAppearance.fontSize}</span></p>
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">🎨 {globalLanguage.startsWith('es') ? 'Esquema de Color' : globalLanguage.startsWith('fr') ? 'Schéma de Couleurs' : globalLanguage.startsWith('de') ? 'Farbschema' : globalLanguage.startsWith('pt') ? 'Esquema de Cores' : globalLanguage.startsWith('ja') ? 'カラースキーム' : globalLanguage.startsWith('zh') ? '配色方案' : 'Color Scheme'}:</span> <span className="font-medium">{globalAppearance.colorScheme}</span></p>
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                    🌐 {ta('languageRegion')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">🗣️ {globalLanguage.startsWith('es') ? 'Idioma' : globalLanguage.startsWith('fr') ? 'Langue' : globalLanguage.startsWith('de') ? 'Sprache' : globalLanguage.startsWith('pt') ? 'Idioma' : globalLanguage.startsWith('ja') ? '言語' : globalLanguage.startsWith('zh') ? '语言' : 'Language'}:</span> <span className="font-medium">{globalLanguage}</span></p>
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">📅 {globalLanguage.startsWith('es') ? 'Formato de Fecha' : globalLanguage.startsWith('fr') ? 'Format de Date' : globalLanguage.startsWith('de') ? 'Datumsformat' : globalLanguage.startsWith('pt') ? 'Formato de Data' : globalLanguage.startsWith('ja') ? '日付形式' : globalLanguage.startsWith('zh') ? '日期格式' : 'Date Format'}:</span> <span className="font-medium">{globalDateFormat}</span></p>
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">⏰ {globalLanguage.startsWith('es') ? 'Formato de Hora' : globalLanguage.startsWith('fr') ? 'Format d\'Heure' : globalLanguage.startsWith('de') ? 'Zeitformat' : globalLanguage.startsWith('pt') ? 'Formato de Hora' : globalLanguage.startsWith('ja') ? '時刻形式' : globalLanguage.startsWith('zh') ? '时间格式' : 'Time Format'}:</span> <span className="font-medium">{globalTimeFormat}</span></p>
                    <p className="flex items-center gap-2"><span className="text-muted-foreground">💰 {globalLanguage.startsWith('es') ? 'Moneda' : globalLanguage.startsWith('fr') ? 'Devise' : globalLanguage.startsWith('de') ? 'Währung' : globalLanguage.startsWith('pt') ? 'Moeda' : globalLanguage.startsWith('ja') ? '通貨' : globalLanguage.startsWith('zh') ? '货币' : 'Currency'}:</span> <span className="font-medium">{globalCurrency}</span></p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="gap-2">
            {showPreview ? (
              <>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  {globalLanguage.startsWith('es') ? 'Atrás' :
                   globalLanguage.startsWith('fr') ? 'Retour' :
                   globalLanguage.startsWith('de') ? 'Zurück' :
                   globalLanguage.startsWith('pt') ? 'Voltar' :
                   globalLanguage.startsWith('ja') ? '戻る' :
                   globalLanguage.startsWith('zh') ? '返回' :
                   'Back'}
                </Button>
                <Button onClick={confirmExportData} className="gap-2">
                  <Download className="w-4 h-4" />
                  {globalLanguage.startsWith('es') ? 'Confirmar y Exportar' :
                   globalLanguage.startsWith('fr') ? 'Confirmer et Exporter' :
                   globalLanguage.startsWith('de') ? 'Bestätigen und Exportieren' :
                   globalLanguage.startsWith('pt') ? 'Confirmar e Exportar' :
                   globalLanguage.startsWith('ja') ? '確認してエクスポート' :
                   globalLanguage.startsWith('zh') ? '确认并导出' :
                   'Confirm & Export'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={handlePreviewClick} className="gap-2">
                  <Eye className="w-4 h-4" />
                  {globalLanguage.startsWith('es') ? 'Ver Vista Previa' :
                   globalLanguage.startsWith('fr') ? 'Aperçu' :
                   globalLanguage.startsWith('de') ? 'Vorschau' :
                   globalLanguage.startsWith('pt') ? 'Visualizar' :
                   globalLanguage.startsWith('ja') ? 'プレビュー' :
                   globalLanguage.startsWith('zh') ? '预览' :
                   'Preview'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={sessionToRevoke !== null} onOpenChange={() => setSessionToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('revoke')} Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke this session? The device will be logged out immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRevokeSession}>
              {t('revoke')} Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ta('selectLanguage')}</DialogTitle>
            <DialogDescription>
              {ta('choosePreferredLanguage')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  globalLanguage === lang.code 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'hover:bg-accent'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.name}</span>
                {globalLanguage === lang.code && <Check className="w-5 h-5" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {t('deleteAccount')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {ta('accountDeletionWarning')}
              <br /><br />
              {ta('typeDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input 
            placeholder={ta('confirmDelete')} 
            className="border-destructive"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText('')}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteAccount}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteConfirmText !== ta('deleteText')}
            >
              {t('deleteAccount')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
