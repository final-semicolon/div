import Image from 'next/image';
// import ScrollToTopButton from '../_components/forum/ScrollToTopButton';
// import PopularQnaPosts from '../_components/qna/popular-qna/PopularQnaPosts';
// import ResentQnaPosts from '../_components/qna/resent-qna/ResentQnaPosts';
import qnaBanner from '../../../../../public/images/qna/QnaPostsBanner.webp';
import dynamic from 'next/dynamic';
import GradCap from '@/assets/images/qna/GradCap';

const PopularQnaPosts = dynamic(() => import('../_components/qna/popular-qna/PopularQnaPosts'));
const ResentQnaPosts = dynamic(() => import('../_components/qna/resent-qna/ResentQnaPosts'));
const ScrollToTopButton = dynamic(() => import('../_components/forum/ScrollToTopButton'));

const QnaPage = () => {
  return (
    <>
      <div className="mb-20 relative rounded-[40px] overflow-hidden">
        <Image src={qnaBanner} alt="QnA Banner" priority placeholder="blur" width={1204} height={288} loading="eager" />
      </div>
      <div className="mb-[120px]">
        <div className="flex justify-start items-center relative gap-1.5 mb-4">
          <p className="flex items-center text-h4 font-bold text-left text-neutral-900">
            인기 QnA
            <div className="ml-1">
              <GradCap />
            </div>
          </p>
        </div>
        <PopularQnaPosts />
      </div>
      <ResentQnaPosts />
      <ScrollToTopButton />
    </>
  );
};

export default QnaPage;
