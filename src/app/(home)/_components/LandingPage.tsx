'use client';

import Image from 'next/image';
import mainPageLanding from '/public/images/mainPageImages/mainPageLanding.webp';
import mobileLanding from '@/assets/images/main-page_image/mobileLanding.png';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

const LandingPage = () => {
  return (
    <div className=" relative  justify-center w-full md:h-60 h-[150px] my-10">
      <a href="https://nbcamp.spartacodingclub.kr/" target="_blank">
        <Default>
          <Image
            src={mainPageLanding}
            alt="Landing"
            width={2400}
            height={235}
            className=" rounded-2xl w-full h-auto  "
          />
        </Default>
        <Mobile>
          <Image src={mobileLanding} alt="Landing" width={700} height={235} className=" w-full h-auto  " />
        </Mobile>
      </a>
    </div>
  );
};

export default LandingPage;
