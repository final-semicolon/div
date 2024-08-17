'use client';

import Image from 'next/image';
import qnaBanner from '../../../../../../../public/images/qna/QnaPostsBanner.webp';
import mobileQnaBanner from '../../../../../../../public/images/qna/MobileQnaBanner.webp';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

const QnaBanner = () => {
  return (
    <>
      <Default>
        <div className="mb-20 relative rounded-[40px] overflow-hidden">
          <Image
            src={qnaBanner}
            alt="QnA Banner"
            priority
            placeholder="blur"
            width={1204}
            height={288}
            loading="eager"
          />
        </div>
      </Default>
      <Mobile>
        <div className="mb-10 mx-5 relative rounded-[16px] overflow-hidden">
          <Image
            src={mobileQnaBanner}
            alt="QnA Banner"
            priority
            placeholder="blur"
            width={670}
            height={204}
            loading="eager"
          />
        </div>
      </Mobile>
    </>
  );
};

export default QnaBanner;
