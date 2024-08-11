import { NavLinksProps } from '@/types/header/headerTypes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLinks = ({ getLinkClasses }: NavLinksProps) => {
  const pathname = usePathname();
  return (
    <div className="flex w-[437px] h-[56px]">
      <Link href={'/'}>
        <div className="mx-10 my-3">
          <div className={`border-0 ${getLinkClasses('/')}`}>메인</div>
        </div>
      </Link>
      <Link href={'/forum'}>
        <div className="mr-10 my-3">
          <div className={`border-0  ${getLinkClasses('/forum')}`}>포럼</div>
        </div>
      </Link>
      <Link href={'/qna'}>
        <div className="mr-10 my-3">
          <div className={`border-0 ${getLinkClasses('/qna')}`}>Q&A</div>
        </div>
      </Link>
      <Link href={'/archive'}>
        <div className="mr-10 my-3">
          <div className={`border-0 ${getLinkClasses('/archive')}`}>라이브러리</div>
        </div>
      </Link>
    </div>
  );
};

export default NavLinks;
