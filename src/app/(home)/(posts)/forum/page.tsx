import dynamic from 'next/dynamic';
import BestForumPosts from '../_components/forum/BestForumPosts';
import ForumPostsWithCategoryAndSort from '../_components/forum/ForumPostsWithCategoryAndSort';

const ScrollToTopButton = dynamic(() => import('../_components/forum/ScrollToTopButton'), {
  ssr: false
});

const ForumPage = () => {
  return (
    <div className="flex">
      <div className="w-1/4 mt-10 z-10 best-forum-hidden">
        <BestForumPosts />
      </div>
      <div className="md:w-3/4 w-full min-w-[375px] max-w-[767px]">
        <ForumPostsWithCategoryAndSort />
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default ForumPage;
