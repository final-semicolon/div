import { NavLinksProps } from '@/types/header/headerTypes';
import Link from 'next/link';
import { memo } from 'react';

const NavLinks = ({ getLinkClasses }: NavLinksProps) => {
  return (
    <div className="flex w-[417px] h-[56px] ml-5">
      <Link href={'/'}>
        <div className="mr-6 md:mx-10 md:my-3">
          <div className={`border-0 ${getLinkClasses('/')}`}>메인</div>
        </div>
      </Link>
      <Link href={'/forum'}>
        <div className="mr-6 md:mr-10 md:my-3">
          <div className={`border-0  ${getLinkClasses('/forum')}`}>포럼</div>
        </div>
      </Link>
      <Link href={'/qna'}>
        <div className="mr-6 md:mr-10 md:my-3">
          <div className={`border-0 ${getLinkClasses('/qna')}`}>Q&A</div>
        </div>
      </Link>
      <Link href={'/archive'}>
        <div className="mr-6 md:my-3">
          <div className={`border-0 ${getLinkClasses('/archive')}`}>라이브러리</div>
        </div>
      </Link>
    </div>
  );
};

export default memo(NavLinks);
