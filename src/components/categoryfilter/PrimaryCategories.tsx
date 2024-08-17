import CategoryButton from './CategoryButton';
import ForumToggle from './ForumToggle';

type PrimaryCategoriesProps = {
  primaryCategory: 'all' | 'qna' | 'forum' | 'archive';
  primaryForumCategory: string | null;
  onCategoryChange: (category: 'all' | 'qna' | 'forum' | 'archive') => void;
  onForumCategoryChange: (category: string | null) => void;
};

const PrimaryCategories = ({
  primaryCategory,
  primaryForumCategory,
  onCategoryChange,
  onForumCategoryChange
}: PrimaryCategoriesProps) => {
  const handleCategoryClick = (category: 'all' | 'qna' | 'forum' | 'archive') => {
    onCategoryChange(category);
    onForumCategoryChange(null);
  };

  return (
    <div className="flex">
      <CategoryButton category="all" currentCategory={primaryCategory} onClick={() => handleCategoryClick('all')} />
      <ForumToggle
        primaryCategory={primaryCategory}
        primaryForumCategory={primaryForumCategory}
        onCategoryChange={onCategoryChange}
        onForumCategoryChange={onForumCategoryChange}
      />
      <CategoryButton category="qna" currentCategory={primaryCategory} onClick={() => handleCategoryClick('qna')} />
      <CategoryButton
        category="archive"
        currentCategory={primaryCategory}
        onClick={() => handleCategoryClick('archive')}
      />
    </div>
  );
};

export default PrimaryCategories;
