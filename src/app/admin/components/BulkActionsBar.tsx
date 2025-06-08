import React from "react";
import { motion } from "framer-motion";
import { FaTrash, FaTimes } from "react-icons/fa";

interface BulkActionsBarProps {
  selectedProducts: string[];
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedProducts,
  onDeleteSelected,
  onClearSelection
}) => {
  if (selectedProducts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white shadow rounded-lg p-4 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={onDeleteSelected}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <FaTrash />
            <span>Delete Selected</span>
          </button>
        </div>
        <button
          onClick={onClearSelection}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
      </div>
    </motion.div>
  );
};

export default BulkActionsBar; 