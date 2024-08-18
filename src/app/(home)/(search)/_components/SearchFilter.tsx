import Reset from '@/assets/images/common/Reset';
import PrimaryCategories from '@/components/categoryfilter/PrimaryCategories';
import SortingFilters from '@/components/categoryfilter/SortingFilters';
import { useState } from 'react';

type SearchFilterProps = {
  primaryCategory: 'all' | 'qna' | 'forum' | 'archive';
  primaryForumCategory: string | null;
  sortingType: 'all' | 'time' | 'like' | 'comment';
  onCategoryChange: (category: 'all' | 'qna' | 'forum' | 'archive') => void;
  onForumCategoryChange: (category: string | null) => void;
  onTypeChange: (type: 'all' | 'time' | 'like' | 'comment') => void;
};

const SearchFilter = ({
  primaryCategory,
  primaryForumCategory,
  sortingType,
  onCategoryChange,
  onForumCategoryChange,
  onTypeChange
}: SearchFilterProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleResetClick = () => {
    onTypeChange('all');
    setShowMenu(false);
    onCategoryChange('all');
    onForumCategoryChange(null);
  };

  return (
    <div className="p-[24px_0px] md:p-[28px_0px_36px] flex justify-between overflow-x-auto">
      <div className="order-2 md:order-1 ">
        <PrimaryCategories
          primaryCategory={primaryCategory}
          primaryForumCategory={primaryForumCategory}
          onCategoryChange={onCategoryChange}
          onForumCategoryChange={onForumCategoryChange}
        />
      </div>
      <div className="flex items-center order-1 md:order-2 ">
        {primaryCategory === 'all' && sortingType === 'all' ? (
          <div className="order-2 mx-4 md:order-1 "></div>
        ) : (
          <div className="order-2 mx-4 md:order-1 " onClick={handleResetClick}>
            <Reset />
          </div>
        )}
        <div className="order-1 md:order-2 ">
          <SortingFilters
            sortingType={sortingType}
            onTypeChange={onTypeChange}
            showMenu={showMenu}
            onShowMenu={setShowMenu}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
