import { motion } from 'framer-motion';
import { FaEdit, FaEye } from 'react-icons/fa';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  showhome?: boolean;
  stock?: number;
  images: string[];
}

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, selected, onSelect, onEdit, onDelete, onViewDetails }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition"
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={selected}
          onChange={e => onSelect(product.id, e.target.checked)}
          className="absolute top-2 left-2 h-5 w-5 text-[#FB9EC6] focus:ring-[#FB9EC6] border-gray-300 rounded z-10"
        />
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={product.images?.[0] || product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {(product.stock ?? 0) <= 5 && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Low Stock
              </Badge>
            </div>
          )}
        </div>
        {product.showhome && (
          <div className="absolute top-2 right-2 bg-[#FB9EC6] text-white px-2 py-1 rounded-full text-sm">
            Featured
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-[#FB9EC6] font-bold mb-2">${product.price}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Stock: {product.stock}</span>
          <span className="text-sm text-gray-600">{product.category}</span>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewDetails(product)}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#FFE893] text-gray-700 px-4 py-2 rounded-lg hover:bg-[#FFE893]/80 transition"
          >
            <FaEye />
            <span>View Details</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#FB9EC6] text-white px-4 py-2 rounded-lg hover:bg-[#FBB4A5] transition"
          >
            <FaEdit />
            <span>Edit</span>
          </motion.button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => onDelete(product.id)}
                  aria-label={`Delete ${product.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Product</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
} 