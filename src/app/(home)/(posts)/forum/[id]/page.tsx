import TopButton from '@/components/common/TopButton';
import ForumComments from '../../_components/forum-detail/ForumComments';
import ForumDetailPost from '../../_components/forum-detail/ForumDetailPost';
import InputComments from '../../_components/forum-detail/InputComment';
import BackClick from '@/components/common/BackClick';
import ForumDetailPostMobile from '../../_components/forum-detail/ForumDetailPostMobile';

const ForumDetailPage = async ({ params }: { params: { id: string } }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/forum-detail/${params.id}`, {
    next: { tags: [`forum-detail-${params.id}`], revalidate: 60 }
  });
  const data = await response.json();

  return (
    <div className="flex flex-col justify-center w-full  ">
      <div className=" hidden md:block">
        <BackClick />
      </div>
      <div className=" border md:rounded-xl md:p-6 ">
        <div className=" hidden md:block">
          <ForumDetailPost forumDetail={data} />
        </div>
        <div className=" block md:hidden">
          <ForumDetailPostMobile forumDetail={data} />
        </div>
        <InputComments />
      </div>
      <ForumComments post_user_id={data[0].user_id} />
      <TopButton />
    </div>
  );
};

export default ForumDetailPage;
