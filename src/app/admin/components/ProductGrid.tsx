import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  images: string[];
  category: string;
  showhome?: boolean;
  stock?: number;
}

interface ProductGridProps {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (id: string, checked: boolean) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductGrid({
  products,
  selectedProducts,
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  onViewDetails
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          selected={selectedProducts.includes(product.id)}
          onSelect={onSelectProduct}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
} 