const PopularQnaPagination = ({
  totalPages,
  currentPage,
  onPageChange
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const buttonClass = (index: number) => {
    return `w-[33px] h-[32px] flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-3 py-1 rounded-md ${
      index === currentPage ? 'bg-main-50 text-main-500' : 'bg-neutral-100 text-neutral-500 border border-neutral-100'
    }`;
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          disabled={index === currentPage}
          className={buttonClass(index)}
        >
          <p className="flex-grow-0 flex-shrink-0 text-body1 font-medium text-left">{index + 1}</p>
        </button>
      ))}
    </div>
  );
};

export default PopularQnaPagination;
