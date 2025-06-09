import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaImage, FaTimes, FaInfoCircle, FaSpinner, FaLightbulb, FaPlus, FaMinus, FaExclamationCircle } from "react-icons/fa";
import Image from "next/image";
import { FormState, FormErrors } from "../types";

// Common product categories with subcategories
const CATEGORIES = {
  "T-Shirts": ["Graphic Tees", "Plain Tees", "Vintage Tees", "Sports Tees"],
  "Hoodies": ["Zip-up", "Pullover", "Oversized", "Athletic"],
  "Shirts": ["Casual", "Formal", "Polo", "Button-up"],
  "Caps": ["Baseball", "Snapback", "Dad Hat", "Beanie"]
};

// Common product tags
const COMMON_TAGS = [
  "New Arrival",
  "Best Seller",
  "Limited Edition",
  "Summer Collection",
  "Winter Collection",
  "Sale",
  "Premium",
  "Eco-friendly",
  "Vintage",
  "Modern"
];

// Common product name patterns
const NAME_PATTERNS = {
  "T-Shirts": ["Classic", "Essential", "Premium", "Vintage", "Graphic"],
  "Hoodies": ["Cozy", "Urban", "Street", "Athletic", "Premium"],
  "Shirts": ["Classic", "Essential", "Premium", "Casual", "Formal"],
  "Caps": ["Classic", "Sporty", "Street", "Vintage", "Modern"]
};

interface ProductFormProps {
  form: FormState;
  errors: FormErrors;
  isSubmitting: boolean;
  previewImage: string | null;
  tagInput: string;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTag: () => void;
  onRemoveTag: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAutoCategorize: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSuggestPrice: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onGenerateTags: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSuggestReorderQuantity: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  errors,
  isSubmitting,
  previewImage,
  tagInput,
  onFormChange,
  onImageChange,
  onAddTag,
  onRemoveTag,
  onSubmit,
  onCancel,
  onTagInputChange,
  onTagInputKeyDown,
  onAutoCategorize,
  onSuggestPrice,
  onGenerateTags,
  onSuggestReorderQuantity
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = React.useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = React.useState(false);
  const [showNameSuggestions, setShowNameSuggestions] = React.useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = React.useState(false);
  const [showSubcategories, setShowSubcategories] = React.useState(false);
  const [filteredTags, setFilteredTags] = React.useState<string[]>([]);
  const [nameSuggestions, setNameSuggestions] = React.useState<string[]>([]);

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.suggestions-container')) {
        setShowNameSuggestions(false);
        setShowTagSuggestions(false);
        setShowSubcategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tags based on input
  React.useEffect(() => {
    if (tagInput.trim()) {
      const filtered = COMMON_TAGS.filter(tag => 
        tag.toLowerCase().includes(tagInput.toLowerCase()) &&
        !form.tags.includes(tag)
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(COMMON_TAGS.filter(tag => !form.tags.includes(tag)));
    }
  }, [tagInput, form.tags]);

  // Generate name suggestions based on category
  React.useEffect(() => {
    if (form.category) {
      const patterns = NAME_PATTERNS[form.category as keyof typeof NAME_PATTERNS] || [];
      const suggestions = patterns.map(pattern => `${pattern} ${form.category}`);
      setNameSuggestions(suggestions);
    } else {
      setNameSuggestions([]);
    }
  }, [form.category]);

  const handleNameSuggestionClick = (suggestion: string) => {
    onFormChange({ target: { name: "name", value: suggestion } } as React.ChangeEvent<HTMLInputElement>);
    setShowNameSuggestions(false);
  };

  const handleTagSuggestionClick = (tag: string) => {
    onTagInputChange({ target: { value: tag } } as React.ChangeEvent<HTMLInputElement>);
    onAddTag();
    setShowTagSuggestions(false);
  };

  const handleSubcategoryClick = (subcategory: string) => {
    onFormChange({ target: { name: "category", value: `${form.category} - ${subcategory}` } } as React.ChangeEvent<HTMLSelectElement>);
    setShowSubcategories(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("File size must be less than 5MB");
        return;
      }
      onImageChange(e);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > MAX_FILE_SIZE) {
        alert("File size must be less than 5MB");
        return;
      }
      const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      onImageChange(event);
    }
  };

  const handleDescriptionChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsGeneratingTags(true);
    await onGenerateTags(e);
    setIsGeneratingTags(false);
  };

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsSuggestingPrice(true);
    await onSuggestPrice(e);
    setIsSuggestingPrice(false);
  };

  const toggleNameSuggestions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNameSuggestions(!showNameSuggestions);
    setShowTagSuggestions(false);
    setShowSubcategories(false);
  };

  const toggleTagSuggestions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTagSuggestions(!showTagSuggestions);
    setShowNameSuggestions(false);
    setShowSubcategories(false);
  };

  const toggleSubcategories = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSubcategories(!showSubcategories);
    setShowNameSuggestions(false);
    setShowTagSuggestions(false);
  };

  const suggestionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const tagVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={onSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h2 id="product-form-title" className="text-2xl font-bold text-gray-800">Add New Product</h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close form"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative suggestions-container">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <button
                  type="button"
                  onClick={toggleNameSuggestions}
                  className={`p-1.5 rounded-full transition-all duration-200 ${
                    showNameSuggestions 
                      ? 'text-blue-500 bg-blue-50' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Toggle name suggestions"
                >
                  <FaLightbulb className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onAutoCategorize}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  placeholder="Enter product name"
                  required
                />
                <AnimatePresence>
                  {showNameSuggestions && nameSuggestions.length > 0 && (
                    <motion.div
                      variants={suggestionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
                    >
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200 bg-gray-50">
                        Suggested Names
                      </div>
                      {nameSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-200"
                          onClick={() => handleNameSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            <div className="relative suggestions-container">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <button
                  type="button"
                  onClick={toggleSubcategories}
                  className={`p-1.5 rounded-full transition-all duration-200 ${
                    showSubcategories 
                      ? 'text-blue-500 bg-blue-50' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Toggle subcategories"
                >
                  <FaLightbulb className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleCategoryChange}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${
                    errors.category ? "border-red-500" : ""
                  }`}
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? "category-error" : undefined}
                  required
                >
                  <option value="">Select a category</option>
                  {Object.keys(CATEGORIES).map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {isSuggestingPrice && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FaSpinner className="animate-spin text-blue-500" />
                  </div>
                )}
                <AnimatePresence>
                  {showSubcategories && form.category && CATEGORIES[form.category as keyof typeof CATEGORIES] && (
                    <motion.div
                      variants={suggestionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
                    >
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200 bg-gray-50">
                        Subcategories
                      </div>
                      {CATEGORIES[form.category as keyof typeof CATEGORIES].map((subcategory, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-200"
                          onClick={() => handleSubcategoryClick(subcategory)}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.category && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.category}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={onFormChange}
                  step="0.01"
                  min="0"
                  className={`w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 ${
                    errors.price ? "border-red-500" : ""
                  }`}
                  aria-invalid={!!errors.price}
                  aria-describedby={errors.price ? "price-error" : undefined}
                  placeholder="0.00"
                  required
                />
              </div>
              {errors.price && (
                <p id="price-error" className="mt-1 text-sm text-red-600" role="alert">{errors.price}</p>
              )}
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="stock"
                type="number"
                name="stock"
                value={form.stock}
                onChange={onSuggestReorderQuantity}
                min="0"
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 ${
                  errors.stock ? "border-red-500" : ""
                }`}
                aria-invalid={!!errors.stock}
                aria-describedby={errors.stock ? "stock-error" : undefined}
                placeholder="Enter quantity"
                required
              />
              {errors.stock && (
                <p id="stock-error" className="mt-1 text-sm text-red-600" role="alert">{errors.stock}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
                <span className="text-red-500 ml-1">*</span>
                <div className="inline-block ml-2 group relative">
                  <FaInfoCircle className="text-gray-400 hover:text-gray-600 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Write a detailed description to get tag suggestions
                  </div>
                </div>
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleDescriptionChange}
                  rows={4}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  placeholder="Enter product description..."
                  required
                />
                {isGeneratingTags && (
                  <div className="absolute right-3 top-3">
                    <FaSpinner className="animate-spin text-blue-500" />
                  </div>
                )}
              </div>
              {errors.description && (
                <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">{errors.description}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Image <span className="text-red-500">*</span>
              </label>
              <div
                className={`mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-200
                  ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"}
                  ${errors.image ? "border-red-500" : ""}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <div className="relative w-48 h-48 mx-auto mb-2 group">
                      <Image
                        src={previewImage}
                        alt="Product Preview"
                        width={192}
                        height={192}
                        className="rounded-md object-contain w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => onFormChange({ target: { name: "image", value: "" } } as React.ChangeEvent<HTMLInputElement>)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    errors.image ? (
                      <div className="flex flex-col items-center justify-center text-red-600 p-4 w-full h-full">
                        <FaExclamationCircle className="h-12 w-12 mb-2 text-red-500" />
                        <p className="text-sm font-medium text-red-700">{errors.image || "Image is required"}</p>
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer mt-2 bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image-upload"
                            name="image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                            aria-describedby="image-upload-description"
                          />
                        </label>
                      </div>
                    ) : (
                      <>
                        <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="image-upload"
                              name="image"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                              aria-describedby="image-upload-description"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p id="image-upload-description" className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )
                  )}
                </div>
              </div>
              {errors.image && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.image}
                </motion.p>
              )}
            </div>

            <div className="md:col-span-2 suggestions-container">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="tag-input" className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <button
                  type="button"
                  onClick={toggleTagSuggestions}
                  className={`p-1.5 rounded-full transition-all duration-200 ${
                    showTagSuggestions 
                      ? 'text-blue-500 bg-blue-50' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Toggle tag suggestions"
                >
                  <FaLightbulb className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2" role="list" aria-label="Product tags">
                <AnimatePresence>
                  {form.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      variants={tagVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 transition-colors duration-200"
                      role="listitem"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => onRemoveTag(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200 p-0.5 hover:bg-blue-200 rounded-full"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="relative">
                <input
                  id="tag-input"
                  type="text"
                  value={tagInput}
                  onChange={onTagInputChange}
                  onKeyDown={onTagInputKeyDown}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  aria-label="Add a new tag"
                />
                <button
                  type="button"
                  onClick={onAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  aria-label="Add tag"
                  disabled={!tagInput.trim()}
                >
                  <FaPlus className="w-3 h-3" />
                  Add
                </button>
                <AnimatePresence>
                  {showTagSuggestions && filteredTags.length > 0 && (
                    <motion.div
                      variants={suggestionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
                    >
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200 bg-gray-50">
                        Suggested Tags
                      </div>
                      {filteredTags.map((tag, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-200"
                          onClick={() => handleTagSuggestionClick(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Product"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProductForm; 