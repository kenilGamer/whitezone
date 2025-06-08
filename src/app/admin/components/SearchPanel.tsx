import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";

interface SearchPanelProps {
  searchQuery: string;
  searchHistory: string[];
  showSearchHistory: boolean;
  onSearch: (query: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export default function SearchPanel({
  searchQuery,
  searchHistory,
  showSearchHistory,
  onSearch,
  onFocus,
  onBlur
}: SearchPanelProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] transition w-full"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

      {/* Search History Dropdown */}
      <AnimatePresence>
        {showSearchHistory && searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50"
          >
            <div className="p-2">
              {searchHistory.map((query, index) => (
                <div
                  key={index}
                  onClick={() => onSearch(query)}
                  className="py-1 px-4 hover:bg-gray-100 cursor-pointer"
                >
                  {query}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 