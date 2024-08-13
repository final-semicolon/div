import { memo } from 'react';

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex justify-center items-center gap-4 mt-4">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => onPageChange(index)}
        disabled={index === currentPage}
        className={`w-[33px] h-[32px] flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-2 py-1 rounded-md ${
          index === currentPage ? 'bg-main-50' : 'bg-neutral-100 border border-neutral-100'
        }`}
      >
        <p
          className={`flex-grow-0 flex-shrink-0 text-body1 font-medium text-center ${
            index === currentPage ? 'text-main-500' : 'text-neutral-500'
          }`}
        >
          {index + 1}
        </p>
      </button>
    ))}
  </div>
);

export default memo(Pagination);
