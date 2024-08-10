import Image from 'next/image';
import ScrollToTopButton from '../_components/forum/ScrollToTopButton';
import PopularQnaPosts from '../_components/qna/PopularQnaPosts';
import ResentQnaPosts from '../_components/qna/ResentQnaPosts';
import qnaBanner from '../../../../../public/images/qna/QnaPostsBanner.jpg';

const QnaPage = () => {
  return (
    <>
      <div className="mb-20 min-w-[1204px] min-h-[288px] max-w-[1204px] max-h-[288px] rounded-[40px] overflow-hidden">
        <Image src={qnaBanner} alt="QnA Banner" layout="responsive" width={4816} height={1152} objectFit="cover" />
      </div>
      <div className="mb-[120px]">
        <PopularQnaPosts />
      </div>
      <ResentQnaPosts />
      <ScrollToTopButton />
    </>
  );
};

export default QnaPage;
