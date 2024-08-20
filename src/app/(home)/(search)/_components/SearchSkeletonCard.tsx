const SearchSkeletonCard = () => {
  return (
    <div className="p-[20px_24px] w-full max-w-[335px] md:max-w-[592px] mx-auto md:h-[381px] h-auto border border-neutral-100 rounded-2xl flex flex-col animate-pulse">
      <div className="flex-1">
        <div className="mb-4 md:mb-5">
          <div className="flex items-center text-body3 md:text-body1 font-regular text-neutral-500">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-full h-6 bg-gray-200 rounded mt-2"></div>
        </div>
        <div className="mb-4 md:mb-5 overflow-hidden break-words whitespace-pre-wrap">
          <div className="w-full h-16 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center">
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between mt-1">
          <div className="flex items-center">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SearchSkeletonCard;
