'use client';

import Top from '@/assets/images/common/Top';
import TopHover from '@/assets/images/common/TopHover';
import { useEffect, useState } from 'react';

const TopButton = () => {
  const [topScroll, setTopScroll] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 50) {
        setTopScroll(true);
      } else {
        setTopScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const MoveTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className=" fixed right-5 md:right-[190px] bottom-5 z-50 ">
      {topScroll && (
        <div
          onClick={MoveTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className=" w-10 h-10 md:w-[68px] md:h-[68px] flex justify-center items-center  rounded-full bg-neutral-50 shadow-button hover:bg-neutral-100 "
        >
          {isHovered ? <TopHover /> : <Top />}
        </div>
      )}
    </div>
  );
};

export default TopButton;
