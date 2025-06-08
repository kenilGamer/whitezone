import { motion } from 'framer-motion';
import { FaTimes, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  images: string[];
  category: string;
  showhome?: boolean;
  stock?: number;
  description?: string;
  sku?: string;
  weight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  tags?: string[];
  discount?: string;
  color?: string;
  size?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleShowHome: (id: string, showhome: boolean) => void;
}

export default function ProductDetails({
  product,
  onClose,
  onEdit,
  onDelete,
  onToggleShowHome
}: ProductDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#FB9EC6]">Product Details</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <FaTimes size={24} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <Image
                  src={product.images?.[0] || product.image || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {(product.images || [product.image]).map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={img || "/placeholder.png"}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-[#FB9EC6] font-bold text-lg">${product.price}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium">{product.stock} units</span>
                </div>
                {product.sku && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium">{product.sku}</span>
                  </div>
                )}
                {product.discount && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium">{product.discount}%</span>
                  </div>
                )}
              </div>

              {product.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-[#FFE893] text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Physical Attributes */}
              {(product.weight || product.dimensions) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Physical Attributes</h4>
                  <div className="space-y-2">
                    {product.weight && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{product.weight} kg</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Dimensions:</span>
                        <span className="font-medium">
                          {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Product Variants */}
              {(product.color || product.size) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Product Variants</h4>
                  <div className="space-y-2">
                    {product.color && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium">{product.color}</span>
                      </div>
                    )}
                    {product.size && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{product.size}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              {(product.createdAt || product.updatedAt) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Timestamps</h4>
                  <div className="space-y-2">
                    {product.createdAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {product.updatedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{new Date(product.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(product)}
                    className="flex items-center space-x-2 bg-[#FB9EC6] text-white px-4 py-2 rounded-lg hover:bg-[#FBB4A5] transition"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(product.id)}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onToggleShowHome(product.id, !product.showhome)}
                  className="flex items-center space-x-2 bg-[#FFE893] text-gray-700 px-4 py-2 rounded-lg hover:bg-[#FFE893]/80 transition"
                >
                  {product.showhome ? <FaEyeSlash /> : <FaEye />}
                  <span>{product.showhome ? 'Hide from Home' : 'Show on Home'}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 