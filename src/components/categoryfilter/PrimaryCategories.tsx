import { Dispatch, SetStateAction } from 'react';
import CategoryButton from './CategoryButton';
import ForumToggle from './ForumToggle';

type PrimaryCategoriesProps = {
  primaryCategory: 'all' | 'qna' | 'forum' | 'archive';
  primaryForumCategory: string | null;
  showForumMenu: boolean;
  onCategoryChange: (category: 'all' | 'qna' | 'forum' | 'archive') => void;
  onForumCategoryChange: (category: string | null) => void;
  onShowForumMenu: Dispatch<SetStateAction<boolean>>;
};

const PrimaryCategories = ({
  primaryCategory,
  primaryForumCategory,
  showForumMenu,
  onCategoryChange,
  onForumCategoryChange,
  onShowForumMenu
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
        showForumMenu={showForumMenu}
        onCategoryChange={onCategoryChange}
        onForumCategoryChange={onForumCategoryChange}
        onShowForumMenu={onShowForumMenu}
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
