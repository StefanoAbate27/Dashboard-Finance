import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
  sales: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
  avatar: string;
}

export interface Sale {
  id: number;
  productId: number;
  userId: number;
  amount: number;
  quantity: number;
  date: string;
  region: string;
}

interface DataContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  getTotalRevenue: () => number;
  getTotalOrders: () => number;
  getActiveUsers: () => number;
  getMonthlyData: () => any[];
  getCategoryData: () => any[];
  getRegionData: () => any[];
  getTopProducts: () => Product[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialProducts: Product[] = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 199.99, stock: 45, status: 'active', image: 'https://images.unsplash.com/photo-1652819804299-eea887780ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjEzMzc0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080', sales: 1245 },
  { id: 2, name: 'Smart Watch Pro', category: 'Electronics', price: 299.99, stock: 28, status: 'active', image: 'https://images.unsplash.com/photo-1652819804299-eea887780ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjEzMzc0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080', sales: 892 },
  { id: 3, name: 'Laptop Stand', category: 'Accessories', price: 49.99, stock: 67, status: 'active', image: 'https://images.unsplash.com/photo-1652819804299-eea887780ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjEzMzc0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080', sales: 634 },
  { id: 4, name: 'USB-C Hub', category: 'Accessories', price: 39.99, stock: 0, status: 'inactive', image: 'https://images.unsplash.com/photo-1652819804299-eea887780ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjEzMzc0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080', sales: 421 },
  { id: 5, name: 'Mechanical Keyboard', category: 'Electronics', price: 159.99, stock: 34, status: 'active', image: 'https://images.unsplash.com/photo-1652819804299-eea887780ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjEzMzc0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080', sales: 758 },
];

const initialUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900', role: 'admin', status: 'active', avatar: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW18ZW58MXx8fHwxNzYxMjg4MzM0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 234 567 8901', role: 'manager', status: 'active', avatar: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW18ZW58MXx8fHwxNzYxMjg4MzM0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 3, name: 'Michael Chen', email: 'michael@example.com', phone: '+1 234 567 8902', role: 'user', status: 'active', avatar: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW18ZW58MXx8fHwxNzYxMjg4MzM0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', phone: '+1 234 567 8903', role: 'user', status: 'inactive', avatar: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW18ZW58MXx8fHwxNzYxMjg4MzM0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 5, name: 'David Brown', email: 'david@example.com', phone: '+1 234 567 8904', role: 'manager', status: 'active', avatar: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW18ZW58MXx8fHwxNzYxMjg4MzM0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
];

const generateSales = (): Sale[] => {
  const sales: Sale[] = [];
  const regions = ['North America', 'Europe', 'Asia', 'South America', 'Others'];
  const months = ['2024-07', '2024-08', '2024-09', '2024-10'];
  
  let id = 1;
  months.forEach(month => {
    initialProducts.forEach(product => {
      const numSales = Math.floor(Math.random() * 50) + 20;
      for (let i = 0; i < numSales; i++) {
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        sales.push({
          id: id++,
          productId: product.id,
          userId: initialUsers[Math.floor(Math.random() * initialUsers.length)].id,
          amount: product.price,
          quantity: Math.floor(Math.random() * 3) + 1,
          date: `${month}-${day}`,
          region: regions[Math.floor(Math.random() * regions.length)],
        });
      }
    });
  });
  
  return sales;
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(() => {
    const saved = localStorage.getItem('dashboard-products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [users, setUsersState] = useState<User[]>(() => {
    const saved = localStorage.getItem('dashboard-users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [sales, setSalesState] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('dashboard-sales');
    return saved ? JSON.parse(saved) : generateSales();
  });

  useEffect(() => {
    localStorage.setItem('dashboard-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('dashboard-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('dashboard-sales', JSON.stringify(sales));
  }, [sales]);

  const setProducts = (newProducts: Product[]) => {
    setProductsState(newProducts);
  };

  const setUsers = (newUsers: User[]) => {
    setUsersState(newUsers);
  };

  const setSales = (newSales: Sale[]) => {
    setSalesState(newSales);
  };

  const getTotalRevenue = () => {
    return sales.reduce((sum, sale) => sum + (sale.amount * sale.quantity), 0);
  };

  const getTotalOrders = () => {
    return sales.length;
  };

  const getActiveUsers = () => {
    return users.filter(u => u.status === 'active').length;
  };

  const getMonthlyData = () => {
    const monthlyMap: Record<string, { sales: number; users: Set<number>; revenue: number; orders: number }> = {};
    
    sales.forEach(sale => {
      const month = sale.date.substring(0, 7);
      if (!monthlyMap[month]) {
        monthlyMap[month] = { sales: 0, users: new Set(), revenue: 0, orders: 0 };
      }
      monthlyMap[month].sales += sale.quantity;
      monthlyMap[month].users.add(sale.userId);
      monthlyMap[month].revenue += sale.amount * sale.quantity;
      monthlyMap[month].orders += 1;
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => {
        const [year, monthNum] = month.split('-');
        return {
          month: monthNames[parseInt(monthNum) - 1],
          sales: data.sales,
          users: data.users.size,
          revenue: Math.round(data.revenue),
          orders: data.orders,
        };
      })
      .slice(-7);
  };

  const getCategoryData = () => {
    const categoryMap: Record<string, number> = {};
    
    sales.forEach(sale => {
      const product = products.find(p => p.id === sale.productId);
      if (product) {
        categoryMap[product.category] = (categoryMap[product.category] || 0) + sale.quantity;
      }
    });

    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    
    return Object.entries(categoryMap).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  };

  const getRegionData = () => {
    const regionMap: Record<string, number> = {};
    
    sales.forEach(sale => {
      regionMap[sale.region] = (regionMap[sale.region] || 0) + (sale.amount * sale.quantity);
    });

    const total = Object.values(regionMap).reduce((sum, val) => sum + val, 0);
    
    return Object.entries(regionMap)
      .map(([region, sales]) => ({
        region,
        sales: Math.round(sales),
        percentage: Math.round((sales / total) * 100),
      }))
      .sort((a, b) => b.sales - a.sales);
  };

  const getTopProducts = () => {
    const productSales: Record<number, number> = {};
    
    sales.forEach(sale => {
      productSales[sale.productId] = (productSales[sale.productId] || 0) + sale.quantity;
    });

    return products
      .map(product => ({
        ...product,
        sales: productSales[product.id] || 0,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  };

  const value = {
    products,
    setProducts,
    users,
    setUsers,
    sales,
    setSales,
    getTotalRevenue,
    getTotalOrders,
    getActiveUsers,
    getMonthlyData,
    getCategoryData,
    getRegionData,
    getTopProducts,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
