const SettingItemSkeleton = () => {
  return (
    <div className="flex justify-between p-[16px_0] border-b border-neutral-100 animate-pulse">
      <div className="w-1/3 h-6 bg-gray-200 rounded"></div>
      <div className="flex items-center ">
        <div className="w-14 h-6 mr-3 bg-gray-200 rounded"></div>
        <div className="w-4 h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default SettingItemSkeleton;
