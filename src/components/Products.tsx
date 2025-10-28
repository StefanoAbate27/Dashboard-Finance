import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Plus, Search, Edit, Trash2, MoreVertical, Download, RefreshCw, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';
import { getCategoryTranslation } from '../utils/categoryTranslations';
import { useData, Product } from '../contexts/DataContext';
import { createExportMenu } from '../utils/exportUtils';

// Tipado para fila animada
const MotionTr = motion.tr as unknown as React.ComponentType<any>;

type FormData = {
  name: string;
  category: string;
  price: string;
  stock: string;
  status: 'active' | 'inactive';
};

export function Products() {
  const { language } = useSettings();
  const t = useTranslation(language);

  const { products, setProducts } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ name: '', category: '', price: '', stock: '', status: 'active' });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const price = Number.isNaN(Number(formData.price)) ? 0 : parseFloat(formData.price);
    const stock = Number.isNaN(Number(formData.stock)) ? 0 : parseInt(formData.stock, 10);

    if (editingProduct) {
      const updated = products.map(p =>
        p.id === editingProduct.id
          ? ({ ...p, ...formData, price, stock } as Product)
          : p
      );
      setProducts(updated);
      toast.success(`✅ ${t('editProduct')} successful!`);
    } else {
      const newProduct: Product = {
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: formData.name,
        category: formData.category,
        price,
        stock,
        status: formData.status,
        image: 'https://images.unsplash.com/photo-1652819804299-eea887780ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        sales: 0,
      };
      setProducts([...products, newProduct]);
      toast.success(`✅ ${t('addProduct')} successful!`);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: (product.price ?? 0).toString(),
      stock: (product.stock ?? 0).toString(),
      status: product.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success(`✅ ${t('deleteProduct')} successful!`);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleRefresh = () => {
    toast.success(`✅ ${t('products')} ${t('refresh').toLowerCase()}!`);
  };

  const handleExport = (format: 'csv' | 'txt' | 'pdf') => {
    const exportData = filteredProducts.map(p => ({
      ID: p.id,
      Name: p.name,
      Category: p.category,
      Price: `$${p.price.toFixed(2)}`,
      Stock: p.stock,
      Status: p.status,
      Sales: p.sales,
    }));

    const exportMenu = createExportMenu(
      exportData,
      'products-data',
      `${t('products')} - Inventory Report`,
      language,
      (fmt) => toast.success(`📦 ${t('products')} exported as ${fmt}!`)
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
          <h2>{t('products')}</h2>
          <p className="text-muted-foreground">{t('manageInventory')}</p>
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

          {/* Botón Agregar producto: abre el Dialog con el formulario (misma estética) */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('addProduct')}
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingProduct ? t('editProduct') : t('addProduct')}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('productName')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('productName')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">{t('category')}</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, category: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={getCategoryTranslation(language, 'selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">{getCategoryTranslation(language, 'electronics')}</SelectItem>
                        <SelectItem value="Accessories">{getCategoryTranslation(language, 'accessories')}</SelectItem>
                        <SelectItem value="Clothing">{getCategoryTranslation(language, 'clothing')}</SelectItem>
                        <SelectItem value="Home">{getCategoryTranslation(language, 'home')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">{t('price')}</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">{t('stock')}</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t('status')}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
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
                  <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    {t('cancel')}
                  </Button>
                  <Button type="submit">
                    {editingProduct ? t('save') : t('addProduct')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('searchProducts')}
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
                <TableHead>{t('productName')}</TableHead>
                <TableHead>{t('category')}</TableHead>
                <TableHead>{t('price')}</TableHead>
                <TableHead>{t('stock')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <MotionTr
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-accent/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span>{product.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>{getCategoryTranslation(language, product.category.toLowerCase() as any)}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={product.stock === 0 ? 'text-destructive' : ''}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                      {product.status === 'active' ? t('active') : t('inactive')}
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
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4 mr-2" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </MotionTr>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('noProductsFound')}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
