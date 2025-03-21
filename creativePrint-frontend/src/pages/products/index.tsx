import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchProducts, setCurrentPage } from "../../store/slices/productSlice";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductGrid from "../../components/products/ProductGrid";
import FilterSidebar from "../../components/products/FilterSidebar";
import HotProducts from "../../components/products/HotProducts";
import Pagination from "../../components/products/Pagination";
import type { RootState } from "../../store/store";
import { AppDispatch } from "../../store/store";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    filteredItems,
    loading,
    error,
    selectedCategory,
    currentPage,
    totalPages,
  } = useSelector((state: RootState) => state.products);

  console.log("Pagination values:", {
    currentPage,
    totalPages,
    itemCount: filteredItems.length,
  });
  // Add a debug state to help troubleshoot
  const [debug, setDebug] = useState({
    lastFetchTime: "",
    fetchCount: 0,
  });

  // This effect runs when the component mounts and when currentPage or selectedCategory changes
  useEffect(() => {
    // Log for debugging
    console.log(
      `Effect triggered - Page: ${currentPage}, Category: ${
        selectedCategory || "All"
      }`
    );

    // Fetch products with the current page and selected category
    dispatch(fetchProducts({ page: currentPage, category: selectedCategory }));

    // Update debug info
    setDebug((prev) => ({
      lastFetchTime: new Date().toLocaleTimeString(),
      fetchCount: prev.fetchCount + 1,
    }));
  }, [dispatch, currentPage, selectedCategory]);

  // Handler for page change
  const handlePageChange = (newPage: number) => {
    console.log(`Changing page from ${currentPage} to ${newPage}`);

    // Update the current page in the Redux store
    dispatch(setCurrentPage(newPage));

    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // For development - press 'd' to show debug info
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "d") {
        console.log("Debug Info:", {
          currentPage,
          totalPages,
          selectedCategory,
          itemsCount: filteredItems.length,
          ...debug,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, selectedCategory, filteredItems, debug]);

  if (loading && filteredItems.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold text-red-600 dark:text-red-400 mb-4'>
            Error
          </h2>
          <p className='text-gray-700 dark:text-gray-300'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Our Products</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4">
              <FilterSidebar />
            </aside>
            <div className="md:w-3/4">
              {filteredItems.length > 0 ? (
                <>
                  <ProductGrid products={filteredItems} />
                  
                  {/* Pagination Component */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange} 
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your filters or check back later for new products.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Hot Products section - placed outside the pagination-affected area */}
        <div className="mt-12">
          <HotProducts />
        </div>
      </main>
      <Footer />
    </div>
  )
}
