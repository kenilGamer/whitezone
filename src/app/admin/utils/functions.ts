import { Product, FormState, FilterState, Stats, FormErrors, Notification as NotificationType } from "../types";

// Auto-categorization function
export const autoCategorize = (name: string, description: string): string | null => {
  const keywords = {
    "T-Shirts": ["tshirt", "t-shirt", "tee", "tank top"],
    "Hoodies": ["hoodie", "sweatshirt", "sweater"],
    "Shirts": ["shirt", "polo", "button-up", "dress shirt"],
    "Caps": ["cap", "hat", "beanie", "snapback"]
  };

  const text = (name + " " + description).toLowerCase();
  
  for (const [category, categoryWords] of Object.entries(keywords)) {
    if (categoryWords.some(word => text.includes(word))) {
      return category;
    }
  }
  
  return null;
};

// Price suggestion function
export const suggestPrice = (category: string, products: Product[]): string | null => {
  const categoryProducts = products.filter(p => p.category === category);
  if (categoryProducts.length === 0) return null;
  
  const prices = categoryProducts.map(p => Number(p.price));
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  return avgPrice.toFixed(2);
};

// Tag generation function
export const generateTags = (name: string, category: string, description: string): string[] => {
  const tags = new Set<string>();
  
  // Add category as a tag
  tags.add(category.toLowerCase());
  
  // Extract keywords from name and description
  const text = (name + " " + description).toLowerCase();

  
  // Add common keywords
  const commonKeywords = ["new", "sale", "popular", "trending", "featured"];
  commonKeywords.forEach(keyword => {
    if (text.includes(keyword)) tags.add(keyword);
  });
  
  // Add color keywords
  const colors = ["red", "blue", "green", "black", "white", "gray", "yellow"];
  colors.forEach(color => {
    if (text.includes(color)) tags.add(color);
  });
  
  return Array.from(tags);
};

// Reorder quantity suggestion
export const suggestReorderQuantity = (stock: string, lowStockThreshold: number): string | null => {
  const currentStock = Number(stock);
  if (currentStock <= lowStockThreshold) {
    return (lowStockThreshold * 2).toString();
  }
  return null;
};

// Form validation
export const validateForm = (form: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!form.name) errors.name = "Name is required";
  if (!form.category) errors.category = "Category is required";
  if (!form.price) errors.price = "Price is required";
  if (!form.stock) errors.stock = "Stock is required";
  if (!form.image) errors.image = "Image is required";

  console.log("Validation Errors:", errors); // Temporary log

  return errors;
};

// Filter products
export const filterAndSortProducts = (
  products: Product[],
  searchQuery: string,
  filters: FilterState
): Product[] => {
  return products
    .filter((product) => {
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory = filters.category
        ? product.category === filters.category
        : true;

      const matchesShowHome =
        filters.showhome !== null
          ? product.showhome === filters.showhome
          : true;

      const matchesPrice =
        (filters.minPrice ? Number(product.price) >= Number(filters.minPrice) : true) &&
        (filters.maxPrice ? Number(product.price) <= Number(filters.maxPrice) : true);

      const matchesStock =
        filters.inStock !== null
          ? (filters.inStock ? Number(product.stock) > 0 : Number(product.stock) === 0)
          : true;

      const matchesDateRange =
        filters.dateRange.start || filters.dateRange.end
          ? (() => {
              const productDate = new Date(String(product.createdAt));
              const startDate = filters.dateRange.start ? new Date(String(filters.dateRange.start)) : null;
              const endDate = filters.dateRange.end ? new Date(String(filters.dateRange.end)) : null;

              return (
                (!startDate || productDate >= startDate) &&
                (!endDate || productDate <= endDate)
              );
            })()
          : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesShowHome &&
        matchesPrice &&
        matchesStock &&
        matchesDateRange
      );
    })
    .sort((a: Product, b: Product) => {
      const sortOrder = filters.sortOrder === "asc" ? 1 : -1;
      const aValue = a[filters.sortBy as keyof Product];
      const bValue = b[filters.sortBy as keyof Product];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * sortOrder;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * sortOrder;
      }

      return 0;
    });
};

// Update stats
export const updateStats = (products: Product[]): Stats => {
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
  const totalValue = products.reduce((sum, product) => {
    const price = Number(product.price) || 0;
    const stock = Number(product.stock) || 0;
    return sum + (price * stock);
  }, 0);
  const lowStock = products.filter(product => (product.stock || 0) < 10).length;

  // Calculate category distribution
  const categoryDistribution = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Calculate stock value by category
  const stockValueByCategory = products.reduce((acc, product) => {
    const price = Number(product.price) || 0;
    const stock = Number(product.stock) || 0;
    const value = price * stock;
    acc[product.category] = (acc[product.category] || 0) + value;
    return acc;
  }, {} as { [key: string]: number });

  return {
    totalProducts,
    totalStock,
    totalValue,
    lowStock,
    categoryDistribution,
    stockValueByCategory,
    recentActivity: [] // Initialize with empty array, can be updated later if needed
  };
};

// Reset form
export const resetForm = (): FormState => ({
  name: "",
  category: "",
  price: "",
  stock: "",
  image: "",
  showhome: false,
  description: "",
  sku: "",
  weight: "",
  dimensions: {
    length: "",
    width: "",
    height: ""
  },
  tags: [],
  tagInput: "",
  discount: "",
  color: "",
  size: "",
  images: []
});

// Show notification
export const showNotification = (
  setNotification: React.Dispatch<React.SetStateAction<NotificationType | null>>,
  type: "success" | "error" | "warning",
  message: string
) => {
  setNotification({ type, message });
  setTimeout(() => setNotification(null), 3000);
};

// Handle bulk delete
export const handleBulkDelete = async (
  selectedProducts: string[],
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>,
  setNotification: React.Dispatch<React.SetStateAction<NotificationType | null>>,
  fetchProducts: () => Promise<void>
) => {
  try {
    const response = await fetch('/api/products/bulk-delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: selectedProducts }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete products');
    }

    showNotification(setNotification, 'success', 'Products deleted successfully');
    setSelectedProducts([]);
    fetchProducts();
  } catch (err) {
    console.error('Error deleting products:', err);
    showNotification(setNotification, 'error', err instanceof Error ? err.message : 'Failed to delete products');
  }
};

// Handle search
export const handleSearch = (
  query: string,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
  setSearchHistory: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setSearchQuery(query);
  if (query.trim()) {
    setSearchHistory(prev => {
      const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, 5);
      return newHistory;
    });
  }
};

// Handle filter change
export const handleFilterChange = (
  name: keyof FilterState,
  value: string | number | boolean | { start: string | null; end: string | null } | null,
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>,
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setFilters(prev => ({
    ...prev,
    [name]: value
  }));

  // Update active filters
  if (value) {
    setActiveFilters(prev => [...prev, name]);
  } else {
    setActiveFilters(prev => prev.filter(f => f !== name));
  }
};

// Reset filters
export const resetFilters = (
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>,
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setFilters({
    category: "",
    showhome: null,
    minPrice: "",
    maxPrice: "",
    inStock: null,
    dateRange: {
      start: "",
      end: ""
    },
    sortBy: "name",
    sortOrder: "asc"
  });
  setActiveFilters([]);
};

// Remove filter
export const removeFilter = (
  filterName: string,
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>,
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setFilters(prev => {
    const newFilters = { ...prev };
    if (filterName === 'dateRange') {
      newFilters.dateRange = { start: "", end: "" };
    } else {
      (newFilters[filterName as keyof FilterState] as string | number | boolean | null) = null;
    }
    return newFilters;
  });
  setActiveFilters(prev => prev.filter(f => f !== filterName));
};

// Handle edit
export const handleEdit = (
  product: Product,
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>,
  setForm: React.Dispatch<React.SetStateAction<FormState>>,
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setEditingProduct(product);
  setForm({
    name: product.name || '',
    category: product.category || '',
    price: (product.price || 0).toString(),
    stock: (product.stock || 0).toString(),
    image: product.image || '',
    images: product.images || [],
    showhome: product.showhome || false,
    description: product.description || '',
    sku: product.sku || '',
    weight: product.weight || '',
    dimensions: product.dimensions || { length: '', width: '', height: '' },
    tags: product.tags || [],
    tagInput: '',
    discount: product.discount || '',
    color: product.color || '',
    size: product.size || '',
  });
  setShowForm(true);
};

// Handle delete
export const handleDelete = async (
  id: string,
  setNotification: React.Dispatch<React.SetStateAction<NotificationType | null>>,
  fetchProducts: () => Promise<void>
) => {
  try {
    const response = await fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    await fetchProducts();
    showNotification(setNotification, 'success', 'Product deleted successfully');
  } catch (err) {
    console.error('Error deleting product:', err);
    showNotification(setNotification, 'error', err instanceof Error ? err.message : 'Failed to delete product');
  }
};

// Handle toggle show home
export const handleToggleShowHome = async (
  id: string,
  showhome: boolean,
  setNotification: React.Dispatch<React.SetStateAction<NotificationType | null>>,
  fetchProducts: () => Promise<void>
) => {
  try {
    const response = await fetch(`/api/products?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ showhome }),
    });

    if (!response.ok) {
      throw new Error('Failed to update product visibility');
    }

    await fetchProducts();
    showNotification(setNotification, 'success', 'Product visibility updated successfully');
  } catch (err) {
    console.error('Error updating product visibility:', err);
    showNotification(setNotification, 'error', err instanceof Error ? err.message : 'Failed to update product visibility');
  }
};

// Handle submit
export const handleSubmit = async (
  e: React.FormEvent,
  form: FormState,
  editingProduct: Product | null,
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>,
  setForm: React.Dispatch<React.SetStateAction<FormState>>,
  setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>,
  setNotification: React.Dispatch<React.SetStateAction<NotificationType | null>>,
  fetchProducts: () => Promise<void>
) => {
  e.preventDefault();
  setIsSubmitting(true);
  setFormErrors({});

  try {
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const url = editingProduct ? `/api/products?id=${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error('Failed to save product');
    }

    await fetchProducts();
    setShowForm(false);
    setForm(resetForm());
    setPreviewImage(null);
    showNotification(
      setNotification,
      'success',
      `Product ${editingProduct ? 'updated' : 'created'} successfully`
    );
  } catch (err) {
    console.error('Error saving product:', err);
    showNotification(setNotification, 'error', err instanceof Error ? err.message : 'Failed to save product');
  } finally {
    setIsSubmitting(false);
  }
};

// Handle image change
export const handleImageChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>,
  setForm: React.Dispatch<React.SetStateAction<FormState>>
) => {
  const file = e.target.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setFormErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      setForm(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
    setFormErrors(prev => ({ ...prev, image: undefined }));
  }
};

// Handle add tag
export const handleAddTag = (
  tagInput: string,
  form: FormState,
  setForm: React.Dispatch<React.SetStateAction<FormState>>,
  setTagInput: React.Dispatch<React.SetStateAction<string>>
) => {
  if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
    setForm(prev => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }));
    setTagInput('');
  }
};

// Handle remove tag
export const handleRemoveTag = (
  index: number,
  setForm: React.Dispatch<React.SetStateAction<FormState>>
) => {
  setForm(prev => ({
    ...prev,
    tags: prev.tags.filter((_, i) => i !== index)
  }));
};

// Handle name change
export const handleNameChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  form: FormState,
  handleFormChange: (field: string, value: string | number | boolean | string[]) => void
) => {
  const name = e.target.value;
  handleFormChange('name', name);
  
  // Auto-categorize if category is empty
  if (!form.category) {
    const suggestedCategory = autoCategorize(name, form.description);
    if (suggestedCategory) {
      handleFormChange('category', suggestedCategory);
    }
  }
};

// Handle category change
export const handleCategoryChange = (
  e: React.ChangeEvent<HTMLSelectElement>,
  form: FormState,
  products: Product[],
  handleFormChange: (field: string, value: string | number | boolean | string[]) => void
) => {
  const category = e.target.value;
  handleFormChange('category', category);
  
  // Suggest price if price is empty
  if (!form.price) {
    const suggestedPrice = suggestPrice(category, products);
    if (suggestedPrice) {
      handleFormChange('price', suggestedPrice);
    }
  }
};

// Handle description change
export const handleDescriptionChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>,
  form: FormState,
  handleFormChange: (field: string, value: string | number | boolean | string[]) => void
) => {
  const description = e.target.value;
  handleFormChange('description', description);
  
  // Auto-generate tags if tags array is empty
  if (form.tags.length === 0) {
    const suggestedTags = generateTags(form.name, form.category, description);
    if (suggestedTags.length > 0) {
      handleFormChange('tags', suggestedTags);
    }
  }
};

// Handle stock change
export const handleStockChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  lowStockThreshold: number,
  handleFormChange: (field: string, value: string | number | boolean | string[]) => void,
  setNotification: React.Dispatch<React.SetStateAction<NotificationType | null>>
) => {
  const stock = e.target.value;
  handleFormChange('stock', stock);
  
  // Show warning if stock is below threshold
  if (parseInt(stock) <= lowStockThreshold) {
    showNotification(setNotification, 'warning', 'Stock is below recommended threshold');
  }
}; 