import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Info, Check } from "lucide-react";
import { api } from "../../components/services/api/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import TShirt from "../../../public/assets/images/t-shirt.png";
import Hat from "../../../public/assets/images/hat.png";
import Mug from "../../../public/assets/images/mugs.png"; 
import ProductVariants from "../../components/dashboard/ProductVariants"; 
import { 
  Design, 
  Category, 
  ProductVariantRequest,
  ProductVariantFormData,
  ProductFormData
} from "../../types/product"; 

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const designIdFromQuery = queryParams.get("designId");

  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    basePrice: 0,
    categoryId: 0,
    designId: designIdFromQuery ? parseInt(designIdFromQuery) : 0,
    variants: [{ size: "", color: "", priceAdjustment: 0, stock: 0 }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const designsResponse = await api.get("/partner/designs");
        setDesigns(designsResponse.data.content || []);
        const categoriesResponse = await api.get("/categories");
        setCategories(categoriesResponse.data || []);
        if (!categoriesResponse.data?.length) {
          setCategories([
            { id: 1, name: "T-shirts", description: "Various T-shirts" },
            { id: 2, name: "Posters", description: "Decorative posters" },
            { id: 3, name: "Mugs", description: "Custom mugs" },
            { id: 4, name: "Phone Cases", description: "Phone cases" },
            { id: 5, name: "Hat", description: "Custom hats" }, 
          ]);
        }

        if (!designsResponse.data?.content?.length) {
          setDesigns([
            {
              id: 1,
              name: "Abstract Design",
              designUrl: "https://via.placeholder.com/300",
              description: "An abstract design",
              createdAt: new Date().toISOString(),
              partnerId: 1,
            },
            {
              id: 2,
              name: "Mountain Landscape",
              designUrl: "https://via.placeholder.com/300",
              description: "A beautiful mountain landscape",
              createdAt: new Date().toISOString(),
              partnerId: 1,
            },
          ]);
        }

        // If this is first category/design, preselect it
        if (!formData.categoryId && categoriesResponse.data?.length) {
          setFormData((prev) => ({
            ...prev,
            categoryId: categoriesResponse.data[0].id,
          }));
        }

        if (
          !formData.designId &&
          !designIdFromQuery &&
          designsResponse.data?.content?.length
        ) {
          setFormData((prev) => ({
            ...prev,
            designId: designsResponse.data.content[0].id,
          }));
        }
      } catch (error) {
        toast.error("Error loading required data");
      }
    };

    fetchData();
  }, [designIdFromQuery, formData.categoryId, formData.designId]);

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/partner/products/${id}`);
          const product = response.data;

          // Load the product data into form
          setFormData({
            name: product.name,
            description: product.description,
            basePrice: product.basePrice,
            categoryId: product.category.id,
            designId: product.design.id,
            variants: product.variants.map((v: any) => ({
              size: v.size,
              color: v.color,
              priceAdjustment: v.priceAdjustment,
              stock: v.stock,
            })),
          });

          if (product.design) {
            // Check if the design is already in the designs array
            const designExists = designs.some(
              (d) => d.id === product.design.id
            );

            // If the design isn't in our list yet, add it
            if (!designExists) {
              setDesigns((prev) => [
                ...prev,
                {
                  id: product.design.id,
                  name: product.design.name,
                  designUrl: product.design.designUrl,
                  description: product.design.description || "",
                  createdAt: product.design.createdAt || new Date().toISOString(),
                  partnerId: product.design.partnerId || 0,
                },
              ]);
            }
          }
        } catch (error) {
          toast.error("Failed to load product data");
          navigate("/dashboard/products");
        }
      };

      fetchProduct();
    }
  }, [id, isEditing, navigate, designs]);
  
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "basePrice" || name === "categoryId" || name === "designId"
          ? parseFloat(value)
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleVariantsChange = (newVariants: ProductVariantFormData[]) => {
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    // Price validation based on category
    const categoryName = getSelectedCategoryName().toLowerCase();
    
    if (categoryName.includes("t-shirt")) {
      if (formData.basePrice < 14) {
        newErrors.basePrice = "T-shirt base price must be at least $14";
      } else if (formData.basePrice > 40) {
        newErrors.basePrice = "T-shirt base price cannot exceed $40";
      }
    } else if (categoryName.includes("hat")) {
      if (formData.basePrice < 8) {
        newErrors.basePrice = "Hat base price must be at least $8";
      } else if (formData.basePrice > 30) {
        newErrors.basePrice = "Hat base price cannot exceed $30";
      }
    } else if (categoryName.includes("mug")) {
      if (formData.basePrice < 7) {
        newErrors.basePrice = "Mug base price must be at least $7";
      } else if (formData.basePrice > 25) {
        newErrors.basePrice = "Mug base price cannot exceed $25";
      }
    } else if (formData.basePrice <= 0) {
      newErrors.basePrice = "Base price must be greater than zero";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.designId) {
      newErrors.designId = "Design is required";
    }

    // Validate variants
    formData.variants.forEach((variant, index) => {
      if (!variant.size.trim()) {
        newErrors[`variants.${index}.size`] = "Size is required";
      }

      if (!variant.color.trim()) {
        newErrors[`variants.${index}.color`] = "Color is required";
      }

      if (variant.stock < 0) {
        newErrors[`variants.${index}.stock`] = "Stock cannot be negative";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Convert variants to ProductVariantRequest format if needed
      const variants: ProductVariantRequest[] = formData.variants.map(v => ({
        size: v.size,
        color: v.color,
        priceAdjustment: v.priceAdjustment,
        stock: v.stock
      }));

      const requestData = {
        name: formData.name,
        description: formData.description,
        basePrice: formData.basePrice,
        categoryId: formData.categoryId,
        designId: formData.designId,
        variants: variants
      };

      if (isEditing) {
        await api.put(`/partner/products/${id}`, requestData);
        Swal.fire({
          title: "Success!",
          text: "Product updated successfully",
          icon: "success",
          confirmButtonColor: "#9333ea",
        });
      } else {
        await api.post("/partner/products", requestData);
        Swal.fire({
          title: "Success!",
          text: "Product created successfully",
          icon: "success",
          confirmButtonColor: "#9333ea",
        });
      }

      navigate("/dashboard/products");
    } catch (error: any) {
      console.error("Error saving product:", error);

      if (error.response?.data) {
        // Handle validation errors from server
        const serverErrors = error.response.data;

        if (typeof serverErrors === "object") {
          setErrors(serverErrors);
        } else {
          Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "Failed to save product",
            icon: "error",
            confirmButtonColor: "#9333ea",
          });
        }
      } else {
        toast.error("Failed to save product. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedDesign = () => {
    if (!formData.designId) return null;
    const design = designs.find(d => d.id === formData.designId);
    if (design) return design;
    return null;
  };

  // Get the selected category name
  const getSelectedCategoryName = () => {
    if (!formData.categoryId) return "";
    const category = categories.find(c => c.id === formData.categoryId);
    return category ? category.name : "";
  };

  // Function to determine which mockup image to display
  const getMockupImage = () => {
    const categoryName = getSelectedCategoryName().toLowerCase();
    
    if (categoryName.includes("hat")) {
      return Hat;
    } else if (categoryName.includes("mug")) {
      return Mug;
    } else {
      // Default to T-shirt mockup
      return TShirt;
    }
  };

  return (
    <div>
      <div className='flex items-center mb-6'>
        <button
          onClick={() => navigate("/dashboard/products")}
          className='p-2 mr-4 rounded-full hover:bg-gray-100'>
          <ArrowLeft className='h-5 w-5 text-gray-600' />
        </button>
        <h1 className='text-2xl font-bold text-gray-900'>
          {isEditing ? "Edit Product" : "Create New Product"}
        </h1>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Left Column - Basic Info */}
            <div className='lg:col-span-2 space-y-6'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Product Name*
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder='Enter product name'
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Description
                </label>
                <textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='Enter product description (optional)'
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='basePrice'
                    className='block text-sm font-medium text-gray-700 mb-1'>
                    Base Price*
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <span className='text-gray-500'>$</span>
                    </div>
                    <input
                      type='number'
                      id='basePrice'
                      name='basePrice'
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      step='0.01'
                      min={
                        getSelectedCategoryName().toLowerCase().includes("t-shirt") ? 14 :
                        getSelectedCategoryName().toLowerCase().includes("hat") ? 8 :
                        getSelectedCategoryName().toLowerCase().includes("mug") ? 7 : 0
                      }
                      max={
                        getSelectedCategoryName().toLowerCase().includes("t-shirt") ? 40 :
                        getSelectedCategoryName().toLowerCase().includes("hat") ? 30 :
                        getSelectedCategoryName().toLowerCase().includes("mug") ? 25 : 999
                      }
                      className={`block w-full pl-8 rounded-md border ${
                        errors.basePrice ? "border-red-500" : "border-gray-300"
                      } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder='0.00'
                    />
                  </div>
                  {errors.basePrice && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.basePrice}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='categoryId'
                    className='block text-sm font-medium text-gray-700 mb-1'>
                    Category*
                  </label>
                  <select
                    id='categoryId'
                    name='categoryId'
                    value={formData.categoryId || ""}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border ${
                      errors.categoryId ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}>
                    <option value=''>Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.categoryId}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor='designId'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Design*
                </label>
                <select
                  id='designId'
                  name='designId'
                  value={formData.designId || ""}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border ${
                    errors.designId ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}>
                  <option value=''>Select Design</option>
                  {designs.map((design) => (
                    <option key={design.id} value={design.id}>
                      {design.name}
                    </option>
                  ))}
                </select>
                {errors.designId && (
                  <p className='mt-1 text-sm text-red-600'>{errors.designId}</p>
                )}
                {designs.length === 0 && (
                  <p className='mt-1 text-sm text-gray-500'>
                    No designs found.{" "}
                    <a
                      href='/dashboard/designs/new'
                      className='text-purple-600 hover:text-purple-800'>
                      Upload a design
                    </a>{" "}
                    first.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Product Design Preview */}
            <div className='lg:col-span-1'>
              <div className='border border-gray-200 rounded-lg p-4'>
                <h3 className='text-sm font-medium text-gray-700 mb-3'>
                  Design Preview - {getSelectedCategoryName()}
                </h3>
                {getSelectedDesign() ? (
                  <div className='relative flex justify-center bg-gray-100 rounded-md p-4'>
                    {/* Dynamic mockup base based on category */}
                    <div className='relative w-full max-w-sm'>
                      {/* Mockup base image - changes based on category */}
                      <img
                        src={getMockupImage()}
                        alt={`${getSelectedCategoryName()} mockup`}
                        className='w-full'
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/300/000000/FFFFFF?text=Mockup")
                        }
                      />

                      {/* Design overlay positioned on mockup - sized differently based on product category */}
                      <div className={`absolute ${
                        getSelectedCategoryName().toLowerCase().includes("hat") 
                          ? 'top-1/3 left-1/2 transform -translate-x-1/2 w-3/5' 
                        : getSelectedCategoryName().toLowerCase().includes("mug")
                          ? 'top-1/4 left-2/4 transform -translate-x-1/2 w-2/4' 
                          : 'top-1/4 left-1/2 transform -translate-x-1/2 w-2/5' 
                      }`}>
                        <img
                          src={
                            getSelectedDesign()?.designUrl ||
                            "https://via.placeholder.com/150"
                          }
                          alt={getSelectedDesign()?.name || "Selected design"}
                          className={`w-full object-contain ${
                            getSelectedCategoryName().toLowerCase().includes("hat")
                              ? 'h-16' 
                            : getSelectedCategoryName().toLowerCase().includes("mug")
                              ? 'h-24' 
                              : 'h-28' 
                          }`}
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/150")
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='bg-gray-100 rounded-md p-8 text-center text-gray-500'>
                    <div className='relative w-full max-w-sm mx-auto opacity-50'>
                      <img
                        src={getMockupImage()}
                        alt={`${getSelectedCategoryName() || 'Product'} mockup`}
                        className='w-full'
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/300/000000/FFFFFF?text=Mockup")
                        }
                      />
                    </div>
                    <p className='mt-4'>No design selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Variants Section - Using the new enhanced component */}
          <div className='mt-8 bg-gray-50 rounded-lg p-6'>
            <ProductVariants 
              variants={formData.variants}
              basePrice={formData.basePrice}
              onChange={handleVariantsChange}
              errors={errors}
            />
          </div>

          {/* Info Box */}
          <div className='bg-blue-50 border border-blue-200 rounded-md p-4 flex mt-6'>
            <Info className='h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 mr-3' />
            <div className='text-sm text-blue-700'>
              <p className='font-medium mb-1'>Pricing Tips:</p>
              <ul className='space-y-1 list-disc pl-5'>
                <li>
                  Set your base price to cover production costs and desired
                  profit margin
                </li>
                <li>
                  Use price adjustments for variants that cost more to produce
                  (e.g., larger sizes)
                </li>
                <li>
                  Monitor your competition to ensure your prices are competitive
                </li>
              </ul>
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={() => navigate("/dashboard/products")}
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center'
              disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2'></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className='h-4 w-4 mr-2' />
                  <span>{isEditing ? "Update Product" : "Create Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}