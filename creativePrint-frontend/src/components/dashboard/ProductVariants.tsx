import { useState } from "react";
import { Plus, Trash, AlertCircle } from "lucide-react";

interface ProductVariant {
  size: string;
  color: string;
  priceAdjustment: number;
  stock: number;
}

interface VariantsProps {
  variants: ProductVariant[];
  basePrice: number;
  onChange: (variants: ProductVariant[]) => void;
  errors: { [key: string]: string };
}

// Predefined common sizes and colors for quick selection
const commonSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const commonColors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#008000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Purple", hex: "#800080" },
  { name: "Gray", hex: "#808080" },
  { name: "Navy", hex: "#000080" },
];

export default function ProductVariants({ variants, basePrice, onChange, errors }: VariantsProps) {
  const [showSizeOptions, setShowSizeOptions] = useState<number | null>(null);
  const [showColorOptions, setShowColorOptions] = useState<number | null>(null);
  
  const addVariant = () => {
    onChange([...variants, { size: "", color: "", priceAdjustment: 0, stock: 0 }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      // Show a toast or alert here: "You must have at least one variant"
      return;
    }
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    onChange(newVariants);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onChange(newVariants);
  };

  const getVariantError = (index: number, field: string) => {
    return errors[`variants.${index}.${field}`];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
        <button
          type="button"
          onClick={addVariant}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </button>
      </div>

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative"
          >
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove variant"
            >
              <Trash className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Size Field with Quick Selection */}
              <div className="relative">
                <label 
                  htmlFor={`variant-${index}-size`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Size*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={`variant-${index}-size`}
                    value={variant.size}
                    onChange={(e) => updateVariant(index, "size", e.target.value)}
                    onFocus={() => setShowSizeOptions(index)}
                    onBlur={() => setTimeout(() => setShowSizeOptions(null), 200)}
                    className={`block w-full text-sm rounded-md border ${
                      getVariantError(index, "size")
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    } px-3 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                    placeholder="Enter size or select below"
                  />
                  {showSizeOptions === index && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1">
                      <div className="grid grid-cols-4 gap-1 p-2">
                        {commonSizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            className={`py-1 px-2 text-sm rounded ${
                              variant.size === size
                                ? "bg-purple-100 text-purple-700 font-medium"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              updateVariant(index, "size", size);
                              setShowSizeOptions(null);
                            }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {getVariantError(index, "size") && (
                  <div className="mt-1 flex items-center text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {getVariantError(index, "size")}
                  </div>
                )}
              </div>

              {/* Color Field with Color Picker */}
              <div className="relative">
                <label
                  htmlFor={`variant-${index}-color`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Color*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={`variant-${index}-color`}
                    value={variant.color}
                    onChange={(e) => updateVariant(index, "color", e.target.value)}
                    onFocus={() => setShowColorOptions(index)}
                    onBlur={() => setTimeout(() => setShowColorOptions(null), 200)}
                    className={`block w-full text-sm rounded-md border ${
                      getVariantError(index, "color")
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    } px-3 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                    placeholder="Enter color or select below"
                  />
                  {showColorOptions === index && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 p-2">
                      <div className="grid grid-cols-3 gap-2">
                        {commonColors.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            className={`flex items-center py-1.5 px-2 text-sm rounded ${
                              variant.color === color.name
                                ? "bg-purple-100 text-purple-700"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              updateVariant(index, "color", color.name);
                              setShowColorOptions(null);
                            }}
                          >
                            <span 
                              className="h-4 w-4 rounded border border-gray-300 mr-2" 
                              style={{ backgroundColor: color.hex }}
                            ></span>
                            {color.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {getVariantError(index, "color") && (
                  <div className="mt-1 flex items-center text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {getVariantError(index, "color")}
                  </div>
                )}
              </div>

              {/* Price Adjustment */}
              <div>
                <label
                  htmlFor={`variant-${index}-priceAdjustment`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price Adjustment
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id={`variant-${index}-priceAdjustment`}
                    value={variant.priceAdjustment}
                    onChange={(e) => updateVariant(index, "priceAdjustment", parseFloat(e.target.value) || 0)}
                    step="0.01"
                    className="block w-full text-sm pl-8 rounded-md border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Additional cost for this variant
                </p>
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor={`variant-${index}-stock`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Stock*
                </label>
                <input
                  type="number"
                  id={`variant-${index}-stock`}
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                  min="0"
                  className={`block w-full text-sm rounded-md border ${
                    getVariantError(index, "stock")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                  } px-3 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                  placeholder="0"
                />
                {getVariantError(index, "stock") && (
                  <div className="mt-1 flex items-center text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {getVariantError(index, "stock")}
                  </div>
                )}
              </div>
            </div>

            {/* Final price display */}
            <div className="mt-4 py-2 px-3 bg-gray-50 rounded text-sm flex justify-between items-center">
              <span className="text-gray-700">Final price:</span>
              <span className="font-medium text-purple-700">
                ${(basePrice + variant.priceAdjustment).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}