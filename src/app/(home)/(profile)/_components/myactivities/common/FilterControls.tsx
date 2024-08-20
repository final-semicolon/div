import Reset from '@/assets/images/common/Reset';
import ContentFilters from '@/components/categoryfilter/ContentFilters';
import PrimaryCategories from '@/components/categoryfilter/PrimaryCategories';
import { useState } from 'react';

type FilterControlsProps = {
  primaryCategory: 'all' | 'qna' | 'forum' | 'archive';
  primaryForumCategory: string | null;
  contentType: 'all' | 'post' | 'comment';
  onCategoryChange: (category: 'all' | 'qna' | 'forum' | 'archive') => void;
  onForumCategoryChange: (category: string | null) => void;
  onTypeChange: (type: 'all' | 'post' | 'comment') => void;
};

const FilterControls = ({
  primaryCategory,
  primaryForumCategory,
  contentType,
  onCategoryChange,
  onForumCategoryChange,
  onTypeChange
}: FilterControlsProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showForumMenu, setShowForumMenu] = useState(false);

  const handleResetClick = () => {
    onTypeChange('all');
    setShowMenu(false);
    onCategoryChange('all');
    onForumCategoryChange(null);
  };

  return (
    <div>
      <div className="p-6 bg-sub-50 flex justify-between">
        <div className="order-2 md:order-1 ">
          <PrimaryCategories
            primaryCategory={primaryCategory}
            primaryForumCategory={primaryForumCategory}
            onCategoryChange={onCategoryChange}
            onForumCategoryChange={onForumCategoryChange}
            showForumMenu={showForumMenu}
            onShowForumMenu={setShowForumMenu}
          />
        </div>
        <div className="flex items-center order-1 md:order-2 ">
          {primaryCategory === 'all' && contentType === 'all' ? (
            <div className="order-2 mx-4 md:order-1 "></div>
          ) : (
            <div className="order-2 mx-4 md:order-1 " onClick={handleResetClick}>
              <Reset />
            </div>
          )}
          <div className="order-1 md:order-2 ">
            <ContentFilters
              contentType={contentType}
              onTypeChange={onTypeChange}
              showMenu={showMenu}
              onShowMenu={setShowMenu}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
