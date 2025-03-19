import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { enhancedProductService } from '../services/api/enhancedProduct.service';
import { Product, ProductWithVariants, ProductVariant } from '../../types/product';

interface AdvancedProductCustomizerProps {
  productId: string | number;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  onVariantSelect: (variant: ProductVariant) => void;
}

// Standard color options with hex values for display
const COLOR_OPTIONS = {
  "Black": "#000000",
  "White": "#FFFFFF",
  "Navy": "#000080",
  "Red": "#FF0000",
  "Gray": "#808080",
  "Green": "#008000",
  "Purple": "#800080",
  "Yellow": "#FFFF00",
  "Blue": "#0000FF",
  "Pink": "#FFC0CB",
};

const AdvancedProductCustomizer: React.FC<AdvancedProductCustomizerProps> = ({
  productId,
  onColorChange,
  onSizeChange,
  onVariantSelect,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  
  // State for selections
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  
  // Derived state for available options
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [sizesForSelectedColor, setSizesForSelectedColor] = useState<string[]>([]);
  
  // Fetch product with variants
  useEffect(() => {
    const fetchProductWithVariants = async () => {
      try {
        setLoading(true);
        const productData = await enhancedProductService.getProductWithVariants(productId);
        setProduct(productData);
        
        // Extract unique colors and sizes
        if (productData.variants && productData.variants.length > 0) {
          const uniqueColors = [...new Set(productData.variants.map(v => v.color))];
          const uniqueSizes = [...new Set(productData.variants.map(v => v.size))];
          
          setAvailableColors(uniqueColors);
          setAvailableSizes(uniqueSizes);
          
          // Set initial color
          if (uniqueColors.length > 0) {
            handleColorSelect(uniqueColors[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product variants:', err);
        setError('Failed to load product customization options');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductWithVariants();
  }, [productId]);
  
  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
    
    // Update available sizes for this color
    if (product && product.variants) {
      const sizesForColor = [...new Set(
        product.variants
          .filter(v => v.color === color && v.stock > 0)
          .map(v => v.size)
      )];
      
      setSizesForSelectedColor(sizesForColor);
      
      // Auto-select first size if the current selection is not available
      if (sizesForColor.length > 0 && !sizesForColor.includes(selectedSize)) {
        handleSizeSelect(sizesForColor[0]);
      }
    }
  };
  
  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    onSizeChange(size);
    
    // Find and set the selected variant
    if (product && product.variants) {
      const variant = product.variants.find(
        v => v.color === selectedColor && v.size === size
      );
      
      if (variant) {
        setSelectedVariant(variant);
        onVariantSelect(variant);
      }
    }
  };
  
  if (loading) {
    return <div className="mt-6 py-4">Loading customization options...</div>;
  }
  
  if (error || !product) {
    return <div className="mt-6 py-4 text-red-500">{error || 'Unable to load product options'}</div>;
  }
  
  // Don't show customizer if there are no variants
  if (!product.variants || product.variants.length === 0) {
    return (
      <div className="mt-6 space-y-2">
        <div className="text-sm">
          {product.stock > 0 ? (
            <p className="text-green-600">
              In Stock ({product.stock} available)
            </p>
          ) : (
            <p className="text-red-600">Out of Stock</p>
          )}
        </div>
        
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          ${product.price.toFixed(2)}
        </div>
      </div>
    );
  }

  // Calculate variant price
  const getVariantPrice = () => {
    if (!selectedVariant) return product.price;
    return product.price + (selectedVariant.priceAdjustment || 0);
  };
  
  // Get stock for selected variant
  const getVariantStock = () => {
    if (!selectedVariant) return 0;
    return selectedVariant.stock;
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Color</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`relative h-10 w-10 rounded-full border p-0.5 ${
                  selectedColor === color 
                    ? 'border-gray-900 dark:border-gray-100' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                style={{ backgroundColor: COLOR_OPTIONS[color] || color }}
                aria-label={`Color: ${color}`}
              >
                {selectedColor === color && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check 
                      className={`h-4 w-4 ${
                        color.toLowerCase() === 'white' || color.toLowerCase() === '#ffffff'
                          ? 'text-gray-900' 
                          : 'text-white'
                      }`} 
                    />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Size Selection */}
      {sizesForSelectedColor.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Size</h3>
            <a href="#size-guide" className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400">
              Size guide
            </a>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-6">
            {availableSizes.map((size) => {
              const isAvailable = sizesForSelectedColor.includes(size);
              
              return (
                <button
                  key={size}
                  onClick={() => isAvailable && handleSizeSelect(size)}
                  className={`flex items-center justify-center rounded-md border py-2 text-sm font-medium ${
                    !isAvailable 
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500' 
                      : selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-700'
                        : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
                  }`}
                  disabled={!isAvailable}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Stock Display */}
      {selectedVariant && (
        <div className="text-sm">
          {getVariantStock() > 0 ? (
            <p className="text-green-600">
              In Stock ({getVariantStock()} available)
            </p>
          ) : (
            <p className="text-red-600">Out of Stock</p>
          )}
        </div>
      )}
      
      {/* Price Display with variant adjustment */}
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        ${getVariantPrice().toFixed(2)}
      </div>
    </div>
  );
};

export default AdvancedProductCustomizer;