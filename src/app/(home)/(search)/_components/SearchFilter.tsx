import Reset from '@/assets/images/common/Reset';
import PrimaryCategories from '@/components/categoryfilter/PrimaryCategories';
import SortingFilters from '@/components/categoryfilter/SortingFilters';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';
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

  const handleMobileResetClick = () => {
    onTypeChange('all');
    setShowMenu(false);
    onCategoryChange('all');
    onForumCategoryChange(null);
  };

  const handleWebResetClick = () => {
    onTypeChange('all');
    setShowMenu(false);
  };

  return (
    <div className="relative p-[28px_0px_36px] flex justify-between">
      <div className="order-2 md:order-1">
        <PrimaryCategories
          primaryCategory={primaryCategory}
          primaryForumCategory={primaryForumCategory}
          onCategoryChange={onCategoryChange}
          onForumCategoryChange={onForumCategoryChange}
        />
      </div>
      <div className="flex order-1 md:order-2 ">
        <Mobile>
          <div className="order-2 md:order-1" onClick={handleMobileResetClick}>
            <Reset />
          </div>
        </Mobile>
        <Default>
          <div className="order-2 md:order-1" onClick={handleWebResetClick}>
            <Reset />
          </div>
        </Default>
        <div className="order-1 md:order-2">
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
