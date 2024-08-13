import Image from 'next/image';
import ScrollToTopButton from '../_components/forum/ScrollToTopButton';
import PopularQnaPosts from '../_components/qna/PopularQnaPosts';
import ResentQnaPosts from '../_components/qna/ResentQnaPosts';
import qnaBanner from '../../../../../public/images/qna/QnaPostsBanner.jpg';

const QnaPage = () => {
  return (
    <>
      <div className="mb-20 relative rounded-[40px] overflow-hidden" style={{ width: '1204px', height: '288px' }}>
        <Image
          src={qnaBanner}
          alt="QnA Banner"
          fill
          priority
          sizes="(max-width: 1204px) 100vw, 1204px"
          style={{ objectFit: 'cover' }}
        />
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
