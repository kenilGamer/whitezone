import { FaSearch } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  searchHistory: string[];
  showSearchHistory: boolean;
  onHistoryClick: (query: string) => void;
}

export default function SearchBar({ value, onChange, onFocus, searchHistory, showSearchHistory, onHistoryClick }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] transition w-full"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  className="py-1 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onHistoryClick(query)}
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