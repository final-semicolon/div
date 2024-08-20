const ActivitiesSkeletonCard = () => {
  return (
    <div className="min-w-[375px] max-w-[850px] border-b p-4 animate-pulse">
      <div className="flex">
        <div className="mr-4">
          <div className="w-[18px] h-[18px] bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1 ">
          <div className="flex items-center mb-2">
            <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
            <div className="flex items-center ml-3">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-12 h-4 bg-gray-300 rounded ml-1"></div>
            </div>
          </div>
          <div className="w-full h-12 md:h-6 bg-gray-300 rounded mb-2"></div>
          <div className="w-1/12 h-4 bg-gray-300 rounded mb-2"></div>
          <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
          <div className="mt-2 flex space-x-2">
            <div className="w-12 h-4 bg-gray-300 rounded"></div>
            <div className="w-12 h-4 bg-gray-300 rounded"></div>
            <div className="w-12 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesSkeletonCard;
