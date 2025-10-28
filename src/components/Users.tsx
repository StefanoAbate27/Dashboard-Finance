import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Mail,
  Phone,
  Download,
  RefreshCw,
  ChevronDown,
  Users as UsersIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';
import { useData, User } from '../contexts/DataContext';
import { createExportMenu } from '../utils/exportUtils';

type FormData = Partial<User> & {
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
};

export function Users() {
  const { language } = useSettings();
  const t = useTranslation(language);

  const { users, setUsers } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // setUsers expects an array (not an updater), build the new array and pass it
      const updated = users.map((u) =>
        u.id === editingUser.id ? ({ ...u, ...formData } as User) : u
      );
      setUsers(updated);
      toast.success(`✅ ${t('editUser')} successful!`);
    } else {
      const newUser: User = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        avatar:
          'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW18ZW58MXx8fHwxNzYxMjg4MzM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      };
      setUsers([...users, newUser]);
      toast.success(`✅ ${t('addUser')} successful!`);
    }

    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', phone: '', role: 'user', status: 'active' });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    // setUsers expects an array, so pass the filtered array directly
    setUsers(users.filter((u) => u.id !== id));
    toast.success(`✅ ${t('deleteUser')} successful!`);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', phone: '', role: 'user', status: 'active' });
  };

  const handleRefresh = () => {
    toast.success(`✅ ${t('users')} ${t('refresh').toLowerCase()}!`);
  };

  const handleExport = (format: 'csv' | 'txt' | 'pdf') => {
    const exportData = filteredUsers.map((u) => ({
      ID: u.id,
      Name: u.name,
      Email: u.email,
      Phone: u.phone,
      Role: u.role,
      Status: u.status,
    }));

    const exportMenu = createExportMenu(
      exportData,
      'users-data',
      `${t('users')} - User List Report`,
      language,
      (fmt) => toast.success(`👥 ${t('users')} exported as ${fmt}!`)
    );

    switch (format) {
      case 'csv':
        exportMenu.csv();
        break;
      case 'txt':
        exportMenu.txt();
        break;
      case 'pdf':
        exportMenu.pdf();
        break;
    }
  };

  const activeUsers = users.filter((u) => u.status === 'active').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t('users')}</h2>
          <p className="text-muted-foreground">{t('manageUsers')}</p>
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
                {t('export')} Excel/CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('txt')}>
                {t('export')} Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                {t('export')} PDF (HTML)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('addUser')}
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingUser ? t('editUser') : t('addUser')}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('fullName')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder={t('fullName')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder={t('email')}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder={t('phone')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">{t('role')}</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: 'admin' | 'user' | 'manager') =>
                        setFormData((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">{t('admin')}</SelectItem>
                        <SelectItem value="manager">{t('manager')}</SelectItem>
                        <SelectItem value="user">{t('user')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t('status')}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive') =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('active')}</SelectItem>
                      <SelectItem value="inactive">{t('inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingUser(null);
                      setFormData({ name: '', email: '', phone: '', role: 'user', status: 'active' });
                    }}
                  >
                    {t('cancel')}
                  </Button>
                  <Button type="submit">{editingUser ? t('save') : t('addUser')}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground">{t('totalUsers')}</p>
              <h3>{users.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground">{t('activeUsers')}</p>
              <h3>{activeUsers}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground">{t('admins')}</p>
              <h3>{adminCount}</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('searchUsers')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('user')}</TableHead>
                <TableHead>{t('contact')}</TableHead>
                <TableHead>{t('role')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-accent/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {user.phone}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {user.role === 'admin' ? t('admin') : user.role === 'manager' ? t('manager') : t('user')}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status === 'active' ? t('active') : t('inactive')}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Edit className="w-4 h-4 mr-2" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('noUsersFound')}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
