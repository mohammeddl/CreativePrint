import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Upload, Search, X, Trash, Eye, Plus, Edit } from "lucide-react";
import { productService } from "../../components/services/api/product.service";
import { Design } from "../../types/product";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function PartnerDesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);


  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoading(true);
        const response = await productService.getDesigns(page, 12, searchQuery);
        setDesigns(response.content || []);
        setTotalPages(response.totalPages || 0);
      } catch (error) {
        console.error("Error fetching designs:", error);
        toast.error("Failed to load designs");
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [page, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0); 
  };

  const handleDeleteDesign = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9333ea', 
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (result.isConfirmed) {
      try {
        await productService.deleteDesign(id);
        setDesigns(designs.filter((design) => design.id !== id));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Design has been deleted.',
          icon: 'success',
          confirmButtonColor: '#9333ea'
        });
      } catch (error) {
        console.error("Error deleting design:", error);
        
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete design.',
          icon: 'error',
          confirmButtonColor: '#9333ea'
        });
      }
    }
  };

  const openPreview = (design: Design) => {
    setSelectedDesign(design);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedDesign(null);
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <h1 className='text-2xl font-bold text-gray-900'>My Designs</h1>
        <div className='flex gap-2'>
          <Link
            to='/dashboard/designs/editor'
            className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
            <Edit className='w-4 h-4 mr-2' />
            Design Editor
          </Link>
          <Link
            to='/dashboard/designs/new'
            className='inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'>
            <Upload className='w-4 h-4 mr-2' />
            Upload Design
          </Link>
        </div>
      </div>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
          placeholder='Search designs...'
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <button
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
            onClick={() => setSearchQuery("")}>
            <X className='h-5 w-5 text-gray-400 hover:text-gray-600' />
          </button>
        )}
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700'></div>
        </div>
      ) : designs.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {designs.map((design) => (
            <div
              key={design.id}
              className='bg-white rounded-lg shadow-sm overflow-hidden'>
              <div className='h-48 overflow-hidden relative group'>
                <img
                  src={design.designUrl || "https://via.placeholder.com/300"}
                  alt={design.name}
                  className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300")
                  }
                />
                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100'>
                  <button
                    onClick={() => openPreview(design)}
                    className='p-2 bg-white rounded-full mx-1 hover:bg-gray-100'>
                    <Eye className='h-5 w-5 text-gray-700' />
                  </button>
                  <button
                    onClick={() => handleDeleteDesign(design.id)}
                    className='p-2 bg-white rounded-full mx-1 hover:bg-gray-100'>
                    <Trash className='h-5 w-5 text-red-500' />
                  </button>
                </div>
              </div>
              <div className='p-4'>
                <h3 className='font-medium text-gray-900 truncate'>
                  {design.name}
                </h3>
                <p className='text-sm text-gray-500 mt-1 line-clamp-2'>
                  {design.description || "No description"}
                </p>
                <div className='text-xs text-gray-400 mt-2'>
                  {new Date(design.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='bg-white border border-gray-200 rounded-lg p-12 text-center'>
          <div className='mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
            <Plus className='h-8 w-8 text-purple-600' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No designs found
          </h3>
          <p className='text-sm text-gray-500 mb-6'>
            Upload your first design to start creating products
          </p>
          <Link
            to='/dashboard/designs/new'
            className='inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'>
            <Upload className='w-4 h-4 mr-2' />
            Upload Design
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className='flex justify-center mt-6'>
          <nav className='flex items-center space-x-2'>
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className={`px-3 py-1 rounded-md ${
                page === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1 rounded-md ${
                  page === i
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}>
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className={`px-3 py-1 rounded-md ${
                page === totalPages - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Design Preview Modal */}
      {isPreviewOpen && selectedDesign && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col'>
            <div className='p-4 border-b flex justify-between items-center'>
              <h3 className='text-lg font-medium text-gray-900'>
                {selectedDesign.name}
              </h3>
              <button
                onClick={closePreview}
                className='p-1 rounded-full hover:bg-gray-100'>
                <X className='h-6 w-6 text-gray-500' />
              </button>
            </div>
            <div className='overflow-auto p-6 flex-1'>
              <div className='bg-gray-100 rounded-lg p-4 flex justify-center'>
                <img
                  src={
                    selectedDesign.designUrl ||
                    "https://via.placeholder.com/600"
                  }
                  alt={selectedDesign.name}
                  className='max-w-full max-h-[60vh] object-contain'
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/600")
                  }
                />
              </div>
              <div className='mt-6'>
                <h4 className='font-medium text-gray-900 mb-2'>Description</h4>
                <p className='text-gray-600'>
                  {selectedDesign.description || "No description available."}
                </p>
              </div>
              <div className='mt-6'>
                <h4 className='font-medium text-gray-900 mb-2'>Details</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Design ID</p>
                    <p className='text-gray-900'>{selectedDesign.id}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Created On</p>
                    <p className='text-gray-900'>
                      {new Date(selectedDesign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='p-4 border-t flex justify-end space-x-3'>
              <button
                onClick={closePreview}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'>
                Close
              </button>
              <Link
                to={`/dashboard/products/new?designId=${selectedDesign.id}`}
                className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700'>
                Create Product
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
