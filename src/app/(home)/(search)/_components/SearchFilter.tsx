import PrimaryCategories from '@/components/categoryfilter/PrimaryCategories';
import SortingFilters from '@/components/categoryfilter/SortingFilters';

type SearchFilterProps = {
  primaryCategory: 'all' | 'qna' | 'forum' | 'archive';
  primaryForumCategory: string | null;
  sortingType: 'time' | 'like' | 'comment';
  onCategoryChange: (category: 'all' | 'qna' | 'forum' | 'archive') => void;
  onForumCategoryChange: (category: string | null) => void;
  onTypeChange: (type: 'time' | 'like' | 'comment') => void;
};

const SearchFilter = ({
  primaryCategory,
  primaryForumCategory,
  sortingType,
  onCategoryChange,
  onForumCategoryChange,
  onTypeChange
}: SearchFilterProps) => {
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
      <div className="order-1 md:order-2">
        <SortingFilters sortingType={sortingType} onTypeChange={onTypeChange} />
      </div>
    </div>
  );
};

export default SearchFilter;
