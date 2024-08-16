'use client';

import GoToTop from '@/assets/images/common/GoToTop';
import GoToTopHover from '@/assets/images/common/GoToTopHover';
import { throttle } from 'lodash';
import { useEffect, useState } from 'react';

const ScrollToTopButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  return scrollY > 300 ? (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-20 transition-transform duration-500 ease-in-out transform translate-y-0 opacity-100"
    >
      {isHovered ? <GoToTopHover /> : <GoToTop />}
    </button>
  ) : null;
};

export default ScrollToTopButton;
