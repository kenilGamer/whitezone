"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

import BulkActionsBar from "./components/BulkActionsBar";
import StatsPanel from "./components/StatsPanel";
import FiltersPanel from "./components/FiltersPanel";
import Notification from "./components/Notification";
import { ProductFormSection } from "./components/ProductFormSection";
import { Product, FormState, FilterState, Stats, FormErrors, Notification as NotificationType } from "./types";
import {
  handleSearch,
  resetForm as resetFormState,
  showNotification,
  handleBulkDelete,
  handleEdit,
  handleToggleShowHome,
  handleDelete,
  filterAndSortProducts,
  handleSubmit as utilHandleSubmit,
  handleFilterChange,
  resetFilters,
  removeFilter,
  handleNameChange,
  handleCategoryChange,
  handleDescriptionChange,
  handleStockChange,
} from "./utils/functions";
import Header from './components/Header';
import ProductList from './components/ProductList';

const categories = ["T-Shirts", "Hoodies", "Shirts", "Caps"];

function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
    lowStock: 0,
    categoryDistribution: {},
    stockValueByCategory: {},
    recentActivity: []
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>(resetFormState());
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showForm, setShowForm] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lowStockThreshold] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const filteredAndSortedProducts = filterAndSortProducts(products, searchQuery, filters);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();

      const mappedProducts = data.products.map((product: Product) => ({
        ...product,
        id: product._id,
      }));

      setProducts(mappedProducts);
      
      // Calculate and set stats
      const newStats = {
        totalProducts: mappedProducts.length,
        totalStock: mappedProducts.reduce((sum: number, p: Product) => sum + (Number(p.stock) || 0), 0),
        totalValue: mappedProducts.reduce((sum: number, p: Product) => sum + (Number(p.price) * (Number(p.stock) || 0)), 0),
        lowStock: mappedProducts.filter((p: Product) => (Number(p.stock) || 0) <= lowStockThreshold).length,
        categoryDistribution: mappedProducts.reduce((acc: Record<string, number>, p: Product) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        stockValueByCategory: mappedProducts.reduce((acc: Record<string, number>, p: Product) => {
          acc[p.category] = (acc[p.category] || 0) + (Number(p.price) * (Number(p.stock) || 0));
          return acc;
        }, {} as Record<string, number>),
        recentActivity: [] // Initialize with empty array
      };
      
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification(setNotification, 'error', 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, [lowStockThreshold]);

  // Add auto-save effect
  useEffect(() => {
    if (!isDirty) return;

    const autoSaveTimer = setTimeout(() => {
      if (form.name || form.description) {
        localStorage.setItem('productDraft', JSON.stringify({
          form,
          timestamp: new Date().toISOString()
        }));
        setIsDirty(false);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [form, isDirty]);

  // Modify form change handlers to set dirty state
  const handleFormChange = useCallback((field: string, value: string | number | boolean | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected (e.g., cleared), clear the image and preview
      setPreviewImage(null);
      setForm(prev => ({ ...prev, image: "" }));
    }
  };

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  }, [tagInput]);

  const handleRemoveTag = useCallback((index: number) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  }, [form.tags]);

  const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  }, []);

  const handleTagInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    // Call the handleSubmit from utils/functions.ts
    utilHandleSubmit(
      e,
      form,
      editingProduct,
      setFormErrors,
      setIsSubmitting,
      setShowForm,
      setForm,
      setPreviewImage,
      setNotification,
      fetchProducts
    );
  }, [form, editingProduct, setFormErrors, setIsSubmitting, setShowForm, setForm, setPreviewImage, setNotification, fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddProduct={() => setShowForm(true)}
        onShowFilters={() => setShowFilters(true)}
        onShowStats={() => setShowStats(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={(query) => handleSearch(query, setSearchQuery, setSearchHistory)}
        searchHistory={searchHistory}
        showSearchHistory={showSearchHistory}
        onToggleSearchHistory={() => setShowSearchHistory(!showSearchHistory)}
        onSelectSearchHistory={(query) => handleSearch(query, setSearchQuery, setSearchHistory)}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {notification && (
            <Notification
              type={notification.type === 'info' ? 'warning' : notification.type}
              message={notification.message}
            />
          )}
        </AnimatePresence>

        <div className="mb-6">
          <BulkActionsBar
            selectedProducts={selectedProducts}
            onDeleteSelected={() => handleBulkDelete(selectedProducts, setSelectedProducts, setNotification, fetchProducts)}
            onClearSelection={() => setSelectedProducts([])}
          />
        </div>

        <ProductList
          products={filteredAndSortedProducts}
          selectedProduct={selectedProduct}
          isLoading={isLoading}
          onSelectProduct={(product) => {
            const id = product.id;
            setSelectedProducts(prev =>
              prev.includes(id)
                ? prev.filter(productId => productId !== id)
                : [...prev, id]
            );
          }}
          onEditProduct={(product) => handleEdit(product, setEditingProduct, setForm, setShowForm)}
          onDeleteProduct={(product) => handleDelete(product.id, setNotification, fetchProducts)}
          onToggleShowHome={(product) => handleToggleShowHome(product.id, !product.showhome, setNotification, fetchProducts)}
          onCloseDetails={handleCloseDetails}
        />

        <AnimatePresence>
          {showForm && (
            <ProductFormSection
              showForm={showForm}
              form={form}
              formErrors={formErrors}
              isSubmitting={isSubmitting}
              previewImage={previewImage}
              tagInput={tagInput}
              editingProduct={editingProduct}
              onFormChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleFormChange(e.target.name, e.target.value)}
              onImageChange={handleImageChange}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              onSubmit={handleSubmit}
              onClose={() => setShowForm(false)}
              onTagInputChange={handleTagInputChange}
              onTagInputKeyDown={handleTagInputKeyDown}
              onAutoCategorize={(e) => handleNameChange(e as React.ChangeEvent<HTMLInputElement>, form, handleFormChange)}
              onSuggestPrice={(e) => handleCategoryChange(e as React.ChangeEvent<HTMLSelectElement>, form, products, handleFormChange)}
              onGenerateTags={(e) => handleDescriptionChange(e as React.ChangeEvent<HTMLTextAreaElement>, form, handleFormChange)}
              onSuggestReorderQuantity={(e) => handleStockChange(e as React.ChangeEvent<HTMLInputElement>, lowStockThreshold, handleFormChange, setNotification)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFilters && (
            <FiltersPanel
              filters={filters}
              onFilterChange={(name, value) => handleFilterChange(name, value, setFilters, setActiveFilters)}
              onClose={() => setShowFilters(false)}
              activeFilters={activeFilters}
              categories={categories}
              onResetFilters={() => resetFilters(setFilters, setActiveFilters)}
              onRemoveFilter={(filterName) => removeFilter(filterName, setFilters, setActiveFilters)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStats && (
            <StatsPanel
              stats={stats}
              show={showStats}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Page;