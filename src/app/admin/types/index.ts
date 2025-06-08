export interface Product {
  _id?: string;
  id: string;
  name: string;
  price: string;
  image: string;
  images: string[];
  category: string;
  showhome?: boolean;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  sku?: string;
  weight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  tags?: string[];
  discount?: string;
  color?: string;
  size?: string;
}

export interface FilterState {
  category: string;
  showhome: boolean | null;
  minPrice: string;
  maxPrice: string;
  inStock: boolean | null;
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: "name" | "price" | "stock" | "category";
  sortOrder: "asc" | "desc";
}

export interface Stats {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  lowStock: number;
  categoryDistribution: { [key: string]: number };
  stockValueByCategory: { [key: string]: number };
  recentActivity: Array<{
    type: 'add' | 'update' | 'delete';
    productName: string;
    timestamp: string;
  }>;
}

export interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  stock?: string;
  image?: string;
  description?: string;
}

export interface FormState {
  name: string;
  category: string;
  price: string;
  stock: string;
  image: string;
  images: string[];
  showhome: boolean;
  description: string;
  sku: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  tags: string[];
  discount: string;
  color: string;
  size: string;
}

export interface Notification {
  type: 'success' | 'error' | 'warning';
  message: string;
} 