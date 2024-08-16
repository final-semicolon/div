type CategoryButtonProps = {
  category: 'all' | 'qna' | 'forum' | 'archive';
  currentCategory: 'all' | 'qna' | 'forum' | 'archive';
  onClick: () => void;
};

const CategoryButton = ({ category, currentCategory, onClick }: CategoryButtonProps) => (
  <button
    onClick={onClick}
    className={`h-[40px] py-2 px-3 mr-6 text-subtitle1 font-medium ${category === 'archive' ? 'w-[118px] ' : 'w-[87px]'} ${
      currentCategory === category ? 'filter-active' : 'filter-inactive'
    } ${category === 'archive' ? 'max-w-[118px]' : ''}`}
  >
    {category === 'all' ? '전체' : category === 'qna' ? 'Q&A' : category === 'archive' ? ' 라이브러리 ' : '포럼'}
  </button>
);

export default CategoryButton;
