const SearchSkeletonCard = () => {
  return (
    <div className="p-[20px_24px] w-full max-w-[335px] md:max-w-[592px] mx-auto md:h-[381px] h-auto border border-neutral-100 rounded-2xl flex flex-col animate-pulse">
      <div className="flex-1">
        <div className="mb-4 md:mb-5">
          <div className="flex items-center text-body3 md:text-body1 font-regular text-neutral-500">
            <p className="w-24 h-4 bg-gray-200 rounded" />
          </div>
          <p className="w-full h-6 bg-gray-200 rounded mt-2" />
        </div>
        <div className="mb-4 md:mb-5 ">
          <p className="w-full h-[175px] bg-gray-200 rounded" />
        </div>
        <div className="mb-4 md:mb-5 flex">
          <p className="w-16 h-4 mr-2 bg-gray-200 rounded" />
          <p className="w-16 h-4 mr-2 bg-gray-200 rounded" />
          <p className="w-16 h-4 mr-2 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center">
          <p className="w-24 h-4 bg-gray-200 rounded" />
        </div>
        <div className="flex justify-between mt-1">
          <div className="flex items-center">
            <p className="w-16 h-4 bg-gray-200 rounded" />
          </div>
          <p className="w-16 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default SearchSkeletonCard;
