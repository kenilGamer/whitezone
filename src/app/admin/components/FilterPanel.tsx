import { FaTimes, FaUndo, FaCheck } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

interface FilterState {
  category: string;
  showhome: boolean | null;
  minPrice: string;
  maxPrice: string;
  inStock: boolean | null;
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: 'name' | 'price' | 'stock' | 'category';
  sortOrder: 'asc' | 'desc';
}

type FilterValue = string | boolean | null | { start: string; end: string };

interface FilterPanelProps {
  filters: FilterState;
  categories: string[];
  activeFilters: string[];
  onFilterChange: (name: keyof FilterState, value: FilterValue) => void;
  onReset: () => void;
  onRemove: (filterName: string) => void;
  onClose: () => void;
  show: boolean;
}

export default function FilterPanel({ filters, categories, activeFilters, onFilterChange, onReset, onRemove, onClose, show }: FilterPanelProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-[#FFE893] p-4 rounded-lg mb-6 overflow-hidden"
        >
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeFilters.map(filter => (
                <motion.div
                  key={filter}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-[#FB9EC6] text-white px-3 py-1 rounded-full flex items-center space-x-2"
                >
                  <span>{filter}</span>
                  <button
                    onClick={() => onRemove(filter)}
                    className="hover:text-red-200 transition"
                  >
                    <FaTimes />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={e => onFilterChange('category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] transition"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={e => onFilterChange('minPrice', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] transition"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={e => onFilterChange('maxPrice', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] transition"
                />
              </div>
            </div>
            {/* Stock Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
              <select
                value={filters.inStock === null ? '' : filters.inStock ? 'in' : 'out'}
                onChange={e => {
                  const value = e.target.value;
                  onFilterChange('inStock', value === '' ? null : value === 'in');
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] transition"
              >
                <option value="">All</option>
                <option value="in">In Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={e => onFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] transition"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={e => onFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] transition"
                />
              </div>
            </div>
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={e => {
                  const [field, order] = e.target.value.split('-');
                  onFilterChange('sortBy', field as FilterState['sortBy']);
                  onFilterChange('sortOrder', order as FilterState['sortOrder']);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] transition"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="stock-asc">Stock (Low to High)</option>
                <option value="stock-desc">Stock (High to Low)</option>
                <option value="category-asc">Category (A-Z)</option>
                <option value="category-desc">Category (Z-A)</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              <FaUndo />
              <span>Reset Filters</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex items-center space-x-2 bg-[#FB9EC6] text-white px-4 py-2 rounded-lg hover:bg-[#FBB4A5] transition"
            >
              <FaCheck />
              <span>Apply Filters</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}