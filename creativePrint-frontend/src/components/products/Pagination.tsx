import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // If there's only one page or none, don't render pagination
  if (totalPages <= 1) return null;
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Show up to 5 page numbers
    const displayCount = 5; 
    const sidesCount = Math.floor((displayCount - 1) / 2);
    
    let startPage = Math.max(0, currentPage - sidesCount);
    let endPage = Math.min(totalPages - 1, currentPage + sidesCount);
    
    // Adjust when near the beginning
    if (currentPage < sidesCount) {
      endPage = Math.min(totalPages - 1, displayCount - 1);
    } 
    // Adjust when near the end
    else if (currentPage > totalPages - sidesCount - 1) {
      startPage = Math.max(0, totalPages - displayCount);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  const handlePageClick = (page: number) => {
    if (page >= 0 && page < totalPages) {
      // Call the passed onPageChange function when a page is clicked
      onPageChange(page);
      
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="flex justify-center items-center space-x-1 my-8">
      {/* Previous button */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 0}
        className={`px-3 py-2 rounded-md focus:outline-none ${
          currentPage === 0 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-1 rounded-md focus:outline-none ${
            currentPage === page
              ? 'bg-purple-600 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          aria-current={currentPage === page ? 'page' : undefined}
          aria-label={`Page ${page + 1}`}
        >
          {page + 1}
        </button>
      ))}
      
      {/* Next button */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`px-3 py-2 rounded-md focus:outline-none ${
          currentPage === totalPages - 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}