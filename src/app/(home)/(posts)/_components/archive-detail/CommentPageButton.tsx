import React from 'react';

type CommentPageButtonProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const CommentPageButton = ({ totalItems, itemsPerPage, currentPage, onPageChange }: CommentPageButtonProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  const handleClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  return (
    <div className="flex justify-center items-center mt-4 space-x-2 gap-4">
      <button
        onClick={handleFirstPage}
        disabled={currentPage === 1}
        className={`w-8 h-8 rounded ${currentPage === 1 ? 'bg-neutral-50 text-neutral-100' : 'bg-neutral-50 text-neutral-500 hover:text-main-400 hover:bg-main-50'}`}
      >
        &laquo;
      </button>
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`w-8 h-8 rounded ${currentPage === 1 ? 'bg-neutral-50 text-neutral-100' : 'bg-gray-50 text-neutral-500 hover:text-main-400 hover:bg-main-50'}`}
      >
        &lsaquo;
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
        <button
          key={index}
          onClick={() => handleClick(startPage + index)}
          className={`w-8 h-8 rounded ${currentPage === startPage + index ? 'bg-main-50 text-main-400' : 'bg-neutral-50 text-neutral-500 hover:text-main-400 hover:bg-main-50'}`}
        >
          {startPage + index}
        </button>
      ))}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 rounded ${currentPage === totalPages ? 'bg-neutral-50 text-neutral-100' : 'bg-neutral-50 text-neutral-500 hover:text-main-400 hover:bg-main-50'}`}
      >
        &rsaquo;
      </button>
      <button
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 rounded ${currentPage === totalPages ? 'bg-neutral-50 text-neutral-100' : 'bg-neutral-50 text-neutral-500 hover:text-main-400 hover:bg-main-50'}`}
      >
        &raquo;
      </button>
    </div>
  );
};

export default CommentPageButton;
