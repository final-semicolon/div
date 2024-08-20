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

  // 현재 페이지 그룹 5개씩 1그룹으로 만들어버리기
  const currentGroup = Math.ceil(currentPage / maxPagesToShow);

  // 현재 그룹의 첫 페이지와 마지막 페이지 계산
  const startPage = (currentGroup - 1) * maxPagesToShow + 1;
  const endPage = Math.min(currentGroup * maxPagesToShow, totalPages);

  const handleClick = (page: number) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleFirstPage = () => {
    if (totalPages > 0) {
      onPageChange(1);
    }
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
    if (totalPages > 0) {
      onPageChange(totalPages);
    }
  };

  return (
    <div className="flex justify-center items-center mt-4 mx-3 md:gap-4 gap-3">
      <button
        onClick={handleFirstPage}
        disabled={currentPage === 1}
        className={`w-8 h-8 rounded ${
          currentPage === 1
            ? 'bg-neutral-50 stroke-neutral-100 '
            : 'bg-neutral-50 stroke-neutral-500 hover:stroke-main-400 hover:bg-main-50 active:bg-main-50 active:stroke-main-400'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
          <path
            d="M17.5 6L11.6414 11.8586C11.5633 11.9367 11.5633 12.0633 11.6414 12.1414L17.5 18"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M13.5 6L7.64142 11.8586C7.56332 11.9367 7.56332 12.0633 7.64142 12.1414L13.5 18"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`w-8 h-8 rounded ${
          currentPage === 1
            ? 'bg-neutral-50 stroke-neutral-100'
            : 'bg-neutral-50 stroke-neutral-500 hover:stroke-main-400 hover:bg-main-50 active:bg-main-50 active:stroke-main-400'
        }`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 6L9.14142 11.8586C9.06332 11.9367 9.06332 12.0633 9.14142 12.1414L15 18"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {totalPages > 0 &&
        Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => handleClick(startPage + index)}
            className={`w-8 h-8 rounded ${
              currentPage === startPage + index
                ? 'bg-main-50 stroke-main-400'
                : 'bg-neutral-50 stroke-neutral-500 hover:stroke-main-400 hover:bg-main-50 hover:text-main-400 active:bg-main-50 active:stroke-main-400'
            }`}
          >
            {startPage + index}
          </button>
        ))}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 rounded ${
          currentPage === totalPages
            ? 'bg-neutral-50 stroke-neutral-100'
            : 'bg-neutral-50 stroke-neutral-500 hover:stroke-main-400 hover:bg-main-50 active:bg-main-50 active:stroke-main-400'
        }`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 6L14.8586 11.8586C14.9367 11.9367 14.9367 12.0633 14.8586 12.1414L9 18"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 rounded ${
          currentPage === totalPages
            ? 'bg-neutral-50 stroke-neutral-100'
            : 'bg-neutral-50 stroke-neutral-500 hover:stroke-main-400 hover:bg-main-50 active:bg-main-50 active:stroke-main-400'
        }`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7 6L12.8586 11.8586C12.9367 11.9367 12.9367 12.0633 12.8586 12.1414L7 18"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11 6L16.8586 11.8586C16.9367 11.9367 16.9367 12.0633 16.8586 12.1414L11 18"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default CommentPageButton;
