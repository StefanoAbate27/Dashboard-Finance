import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useData } from '../contexts/DataContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';
import { getCategoryTranslation } from '../utils/categoryTranslations';

export function TopProducts() {
  const { getTopProducts } = useData();
  const { language } = useSettings();
  const t = useTranslation(language);
  
  const products = getTopProducts();

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3>{t('topProducts')}</h3>
        <p className="text-muted-foreground">{t('bestSellingItems')}</p>
      </div>
      
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {index + 1}
            </div>
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="truncate">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {getCategoryTranslation(language, product.category.toLowerCase() as any)}
              </p>
            </div>
            <div className="text-right">
              <p>${product.price.toFixed(2)}</p>
              <Badge variant="secondary" className="mt-1">
                {product.sales} {t('sales')}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
