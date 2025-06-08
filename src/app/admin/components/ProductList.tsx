import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { Product } from "../types";

interface ProductListProps {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  onSelectProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onToggleShowHome: (product: Product) => void;
  onCloseDetails: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  selectedProduct,
  isLoading,
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleShowHome,
  onCloseDetails
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FB9EC6]"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-48">
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.category}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">${product.price}</span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  product.stock > 10 ? "bg-green-100 text-green-800" :
                  product.stock > 0 ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {product.stock} in stock
                </span>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => onSelectProduct(product)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => onEditProduct(product)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDeleteProduct(product)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => onToggleShowHome(product)}
                  className={`${
                    product.showhome ? "text-green-600 hover:text-green-800" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {product.showhome ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto"
          >
            <div className="relative h-64 mb-4">
              <Image
                src={selectedProduct.image || "/placeholder.png"}
                alt={selectedProduct.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="text-gray-600 mb-4">{selectedProduct.category}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">${selectedProduct.price}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                selectedProduct.stock > 10 ? "bg-green-100 text-green-800" :
                selectedProduct.stock > 0 ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {selectedProduct.stock} in stock
              </span>
            </div>
            <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedProduct.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={onCloseDetails}
              className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList; 