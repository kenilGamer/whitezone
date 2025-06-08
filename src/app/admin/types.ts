export interface Product {
  id: string;
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
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
  createdAt: string;
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
  tagInput: string;
  discount: string;
  color: string;
  size: string;
}

export interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  stock?: string;
  image?: string;
  description?: string;
  sku?: string;
  weight?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
  tags?: string;
  discount?: string;
  color?: string;
  size?: string;
  tagInput?: string;
  [key: string]: string | undefined | { length?: string; width?: string; height?: string; };
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
  sortBy: string;
  sortOrder: string;
}

export interface Stats {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  lowStock: number;
  categoryDistribution: {
    [key: string]: number;
  };
  stockValueByCategory: {
    [key: string]: number;
  };
  recentActivity: {
    type: string;
    product: string;
    timestamp: string;
  }[];
}

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
} 