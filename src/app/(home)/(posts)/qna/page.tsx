import Image from 'next/image';
// import ScrollToTopButton from '../_components/forum/ScrollToTopButton';
// import PopularQnaPosts from '../_components/qna/popular-qna/PopularQnaPosts';
// import ResentQnaPosts from '../_components/qna/resent-qna/ResentQnaPosts';

import dynamic from 'next/dynamic';
import GradCap from '@/assets/images/qna/GradCap';
import QnaBanner from '../_components/qna/banner/QnaBanner';

const PopularQnaPosts = dynamic(() => import('../_components/qna/popular-qna/PopularQnaPosts'));
const ResentQnaPosts = dynamic(() => import('../_components/qna/resent-qna/ResentQnaPosts'));
const ScrollToTopButton = dynamic(() => import('../_components/forum/ScrollToTopButton'));

const QnaPage = () => {
  return (
    <>
      <QnaBanner />
      <>
        <div className="flex md:justify-start items-center relative md:gap-1.5 md:mb-4 mb-6 ml-5 md:ml-0">
          <p className="flex items-center md:text-h4 text-subtitle1 font-bold text-left text-neutral-900">
            인기 QnA
            <div className="hidden md:block ml-[6px]">
              <GradCap />
            </div>
            <div className="md:hidden block ml-[6px]">
              <GradCap width={24} height={24} />
            </div>
          </p>
        </div>
        <PopularQnaPosts />
      </>
      <ResentQnaPosts />
      <ScrollToTopButton />
    </>
  );
};

export default QnaPage;
