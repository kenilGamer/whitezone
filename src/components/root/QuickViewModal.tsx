import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShoppingCart, FaSpinner, FaCheck, FaExclamationTriangle, FaStar, FaTruck, FaShieldAlt, FaUndo, FaShare, FaSearchPlus, FaSearchMinus, FaPrint, FaChevronLeft, FaChevronRight, FaFacebook, FaTwitter, FaPinterest, FaWhatsapp, FaImage, FaInfoCircle, FaRegHeart, FaHeart as FaSolidHeart } from 'react-icons/fa';
import Image from 'next/image';
import { Product } from '@/app/admin/types';
import { toast } from "sonner";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  // All hooks must be at the top, before any conditional returns
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping'>('description');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState<boolean[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);


  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFFF00'];

  // Helper function to validate image URL
  const isValidImageUrl = (url: string) => {
    return url && !url.startsWith('data:image') && (url.startsWith('http') || url.startsWith('/'));
  };

  // Get valid image URLs with null checks
  const validImages = product?.images?.filter(isValidImageUrl) || [];
  const currentImage = validImages[currentImageIndex] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5NGEzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : validImages.length - 1));
      if (e.key === 'ArrowRight') setCurrentImageIndex(prev => (prev < validImages.length - 1 ? prev + 1 : 0));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, validImages.length, onClose]);

  useEffect(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentImageIndex(prev => (prev < validImages.length - 1 ? prev + 1 : 0));
    }
    if (isRightSwipe) {
      setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : validImages.length - 1));
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, validImages.length]);

  // Early return if no product
  if (!product) {
    return null;
  }

  const handleImageError = () => {
    setIsLoading(false);
    console.error('Failed to load image');
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleThumbnailError = (index: number) => {
    setThumbnailErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) {
      setQuantityError('Minimum quantity is 1');
      return;
    }
    if (value > product.stock) {
      setQuantityError(`Only ${product.stock} items available`);
      return;
    }
    setQuantityError(null);
    setQuantity(value);
  };

  const handleWishlistClick = async () => {
    if (!product) return;
    
    setIsAddingToWishlist(true);
    try {
      // TODO: Replace with actual user ID from authentication
      const userId = 'current-user-id';
      
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to wishlist');
      }

      setIsWishlisted(true);
      toast.success('Added to wishlist!', {
        description: `${product.name} has been added to your wishlist.`,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    setIsAddingToCart(true);
    try {
      await onAddToCart(product);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: product.name,
        text: product.description,
        url: `${window.location.origin}/products/${product.id || encodeURIComponent(product.name)}`,
      };
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing product:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="relative">
            <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-20 border-b border-gray-100">
              <div className="flex items-center justify-between p-4">
                <h2 id="modal-title" className="text-xl font-semibold text-gray-900 truncate">{product.name}</h2>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrint}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                    title="Print product details"
                    aria-label="Print product details"
                  >
                    <FaPrint size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare()}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                    title="Share product"
                    aria-label="Share product"
                  >
                    <FaShare size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                  >
                    <FaTimes size={24} />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Image */}
              <div className="space-y-4">
                <div 
                  ref={imageRef}
                  className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-zoom-in"
                  onClick={() => setIsZoomed(!isZoomed)}
                  onTouchStart={e => setTouchStart(e.touches[0].clientX)}
                  onTouchMove={e => setTouchEnd(e.touches[0].clientX)}
                  onTouchEnd={() => {
                    if (!touchStart || !touchEnd) return;
                    const distance = touchStart - touchEnd;
                    const isLeftSwipe = distance > 50;
                    const isRightSwipe = distance < -50;

                    if (isLeftSwipe) {
                      setCurrentImageIndex(prev => (prev < validImages.length - 1 ? prev + 1 : 0));
                    }
                    if (isRightSwipe) {
                      setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : validImages.length - 1));
                    }

                    setTouchStart(null);
                    setTouchEnd(null);
                  }}
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                >
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                      <FaSpinner className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                  )}
                  {!imageError ? (
                    <div className={`relative w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                      <Image
                        src={currentImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={`object-contain transition-transform duration-300 ${
                          isZoomed ? 'scale-150' : 'scale-100'
                        }`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        priority
                        quality={90}
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                      <FaImage className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Failed to load image</span>
                    </div>
                  )}
                  <AnimatePresence>
                    {isHoveringImage && !isZoomed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center"
                      >
                        <span className="text-white text-sm font-medium">Click to zoom</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : validImages.length - 1));
                      }}
                      className="p-2 bg-white/80 rounded-full shadow-lg"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(prev => (prev < validImages.length - 1 ? prev + 1 : 0));
                      }}
                      className="p-2 bg-white/80 rounded-full shadow-lg"
                      aria-label="Next image"
                    >
                      <FaChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomed(true);
                      }}
                      className="p-2 bg-white/80 rounded-full shadow-lg"
                      aria-label="Zoom in"
                    >
                      <FaSearchPlus className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomed(false);
                      }}
                      className="p-2 bg-white/80 rounded-full shadow-lg"
                      aria-label="Zoom out"
                    >
                      <FaSearchMinus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {validImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setImageError(false);
                        setIsLoading(true);
                        setImageLoaded(false);
                      }}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                        currentImageIndex === index
                          ? 'ring-2 ring-blue-500 scale-105'
                          : 'ring-1 ring-gray-200 hover:ring-blue-300'
                      }`}
                    >
                      {!thumbnailErrors[index] ? (
                        <Image
                          src={image}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                          onError={() => handleThumbnailError(index)}
                          quality={50}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                          <FaImage className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(4.5/5)</span>
                  </div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {product.name}
                  </motion.h2>
                  <div className="mt-2 flex items-center gap-3">
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                    >
                      ${typeof product.price === 'string' ? Number(product.price).toFixed(2) : product.price.toFixed(2)}
                    </motion.p>
                    <span className="text-sm text-gray-500 line-through">$99.99</span>
                    <span className="text-sm font-medium text-green-600">Save 20%</span>
                  </div>
                </div>

                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'description'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('specifications')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'specifications'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'shipping'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Shipping
                  </button>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  {activeTab === 'description' && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Description</h3>
                        <p className="mt-2 text-gray-600 leading-relaxed">{product.description}</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-900">Size</h3>
                          <button
                            onClick={() => setShowSizeGuide(!showSizeGuide)}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <FaInfoCircle className="w-4 h-4" />
                            Size Guide
                          </button>
                        </div>
                        <AnimatePresence>
                          {showSizeGuide && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mb-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    <th className="py-2 text-left">Size</th>
                                    <th className="py-2 text-left">Chest (cm)</th>
                                    <th className="py-2 text-left">Waist (cm)</th>
                                    <th className="py-2 text-left">Hip (cm)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sizes.map((size) => (
                                    <tr key={size} className="border-b">
                                      <td className="py-2">{size}</td>
                                      <td className="py-2">{size === 'S' ? '86-91' : size === 'M' ? '91-96' : '96-101'}</td>
                                      <td className="py-2">{size === 'S' ? '71-76' : size === 'M' ? '76-81' : '81-86'}</td>
                                      <td className="py-2">{size === 'S' ? '91-96' : size === 'M' ? '96-101' : '101-106'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="flex gap-2">
                          {sizes.map((size) => (
                            <motion.button
                              key={size}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedSize(size)}
                              className={`px-4 py-2 rounded-lg border ${
                                selectedSize === size
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {size}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                        <div className="flex gap-2">
                          {colors.map((color) => (
                            <motion.button
                              key={color}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedColor(color)}
                              className={`w-8 h-8 rounded-full border-2 ${
                                selectedColor === color
                                  ? 'border-blue-500'
                                  : 'border-gray-200'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'specifications' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Material</h4>
                          <p className="mt-1 text-gray-600">100% Cotton</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Care</h4>
                          <p className="mt-1 text-gray-600">Machine wash cold</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Fit</h4>
                          <p className="mt-1 text-gray-600">Regular fit</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Style</h4>
                          <p className="mt-1 text-gray-600">Casual</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Shipping Options</h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FaTruck className="w-5 h-5 text-blue-500" />
                              <span className="text-sm">Standard Shipping</span>
                            </div>
                            <span className="text-sm font-medium">Free</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FaTruck className="w-5 h-5 text-blue-500" />
                              <span className="text-sm">Express Shipping</span>
                            </div>
                            <span className="text-sm font-medium">$9.99</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Estimated Delivery</h4>
                        <p className="mt-1 text-gray-600">3-5 business days</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Stock</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(product.stock / 100) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-green-500 rounded-full"
                        />
                      </div>
                      <span className={`text-sm font-medium ${
                        product.stock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                <div className="space-y-4 pt-4">
                  {product.stock > 0 && (
                    <div className="flex items-center gap-4">
                      <label htmlFor="quantity" className="text-sm font-medium text-gray-900">Quantity:</label>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id="quantity"
                          min="1"
                          max={product.stock}
                          value={quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              handleQuantityChange(value);
                            }
                          }}
                          className="w-16 text-center border-x border-gray-300 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Product quantity"
                        />
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      {quantityError && (
                        <motion.span
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600"
                        >
                          {quantityError}
                        </motion.span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0 || isAddingToCart || !selectedSize || !selectedColor}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                    >
                      {isAddingToCart ? (
                        <FaSpinner className="w-5 h-5 animate-spin" />
                      ) : (
                        <FaShoppingCart className="w-5 h-5" />
                      )}
                      {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleWishlistClick}
                      disabled={isAddingToWishlist}
                      className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                    >
                      {isAddingToWishlist ? (
                        <FaSpinner className="w-5 h-5 animate-spin" />
                      ) : isWishlisted ? (
                        <FaSolidHeart className="w-5 h-5 text-red-500" />
                      ) : (
                        <FaRegHeart className="w-5 h-5" />
                      )}
                      {isAddingToWishlist ? 'Adding...' : isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaTruck className="w-5 h-5 text-blue-500" />
                      <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaShieldAlt className="w-5 h-5 text-blue-500" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaUndo className="w-5 h-5 text-blue-500" />
                      <span>Easy Returns</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Share this product</h3>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleShare()}
                        className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-[#1877F2]/90 transition-colors"
                        aria-label="Share on Facebook"
                      >
                        <FaFacebook size={20} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleShare()}
                        className="p-2 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1DA1F2]/90 transition-colors"
                        aria-label="Share on Twitter"
                      >
                        <FaTwitter size={20} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleShare()}
                        className="p-2 bg-[#E60023] text-white rounded-full hover:bg-[#E60023]/90 transition-colors"
                        aria-label="Share on Pinterest"
                      >
                        <FaPinterest size={20} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleShare()}
                        className="p-2 bg-[#25D366] text-white rounded-full hover:bg-[#25D366]/90 transition-colors"
                        aria-label="Share on WhatsApp"
                      >
                        <FaWhatsapp size={20} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success/Error Notifications */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2"
            >
              <FaCheck className="w-5 h-5" />
              <span>Added successfully!</span>
            </motion.div>
          )}
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2"
            >
              <FaExclamationTriangle className="w-5 h-5" />
              <span>Please select size and color</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickViewModal; 