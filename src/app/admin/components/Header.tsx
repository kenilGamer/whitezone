import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaChartBar, FaPlus } from 'react-icons/fa';

interface HeaderProps {
  onAddProduct: () => void;
  onShowFilters: () => void;
  onShowStats: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
  searchHistory: string[];
  showSearchHistory: boolean;
  onToggleSearchHistory: () => void;
  onSelectSearchHistory: (query: string) => void;
}

export default function Header({
  onAddProduct,
  onShowFilters,
  onShowStats,
  searchQuery,
  onSearchChange,
  onSearch,
  searchHistory,
  showSearchHistory,
  onToggleSearchHistory,
  onSelectSearchHistory
}: HeaderProps) {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-[#FB9EC6]">Product Management</h1>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSearch(searchQuery)}
                  className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] transition"
                  placeholder="Search products..."
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSearch(searchQuery)}
                  className="p-2 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#FBB4A5] transition"
                >
                  <FaSearch />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleSearchHistory}
                  className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  History
                </motion.button>
              </div>

              {/* Search History Dropdown */}
              {showSearchHistory && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 w-64 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
                    <div className="space-y-1">
                      {searchHistory.map((query, index) => (
                        <button
                          key={index}
                          onClick={() => onSelectSearchHistory(query)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowFilters}
                className="p-2 bg-[#FFE893] text-gray-700 rounded-lg hover:bg-[#FFE893]/80 transition"
              >
                <FaFilter />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowStats}
                className="p-2 bg-[#FFE893] text-gray-700 rounded-lg hover:bg-[#FFE893]/80 transition"
              >
                <FaChartBar />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddProduct}
                className="flex items-center space-x-2 px-4 py-2 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#FBB4A5] transition"
              >
                <FaPlus />
                <span>Add Product</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 