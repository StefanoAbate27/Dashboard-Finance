// Category translations for all languages
export const categoryTranslations = {
  'en-US': {
    selectCategory: 'Select category',
    electronics: 'Electronics',
    accessories: 'Accessories',
    clothing: 'Clothing',
    home: 'Home',
  },
  'es-ES': {
    selectCategory: 'Seleccionar categoría',
    electronics: 'Electrónicos',
    accessories: 'Accesorios',
    clothing: 'Ropa',
    home: 'Hogar',
  },
  'fr-FR': {
    selectCategory: 'Sélectionner une catégorie',
    electronics: 'Électronique',
    accessories: 'Accessoires',
    clothing: 'Vêtements',
    home: 'Maison',
  },
  'de-DE': {
    selectCategory: 'Kategorie auswählen',
    electronics: 'Elektronik',
    accessories: 'Zubehör',
    clothing: 'Kleidung',
    home: 'Haushalt',
  },
  'pt-BR': {
    selectCategory: 'Selecionar categoria',
    electronics: 'Eletrônicos',
    accessories: 'Acessórios',
    clothing: 'Roupas',
    home: 'Casa',
  },
  'ja-JP': {
    selectCategory: 'カテゴリを選択',
    electronics: '電子機器',
    accessories: 'アクセサリー',
    clothing: '衣類',
    home: 'ホーム',
  },
  'zh-CN': {
    selectCategory: '选择类别',
    electronics: '电子产品',
    accessories: '配件',
    clothing: '服装',
    home: '家居',
  },
  'en-UK': {
    selectCategory: 'Select category',
    electronics: 'Electronics',
    accessories: 'Accessories',
    clothing: 'Clothing',
    home: 'Home',
  },
};

export function getCategoryTranslation(language: string, key: keyof typeof categoryTranslations['en-US']): string {
  const getLangCode = (lang: string): keyof typeof categoryTranslations => {
    if (lang === 'en-UK' || lang.startsWith('en-GB')) return 'en-UK';
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
  return categoryTranslations[langCode][key] || categoryTranslations['en-US'][key] || key;
}
