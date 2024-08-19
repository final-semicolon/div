import X from '@/assets/images/common/X';
import { UserData } from '@/context/auth.context';
import Image from 'next/image';
import Link from 'next/link';

type SidebarTabletProps = {
  currentPage: string;
  userData: UserData | null;
  handleLogout: () => Promise<void>;
  handleClose: () => void;
};

const SidebarTablet = ({ currentPage, userData, handleLogout, handleClose }: SidebarTabletProps) => {
  return (
    <div className="absolute w-[286px] top-0 h-full border-r border-l border-neutral-50 shadow-custom bg-white p-[20px_24px]">
      <button className="flex justify-end" onClick={handleClose}>
        <X />
      </button>
      <div className="p-[36px_0px] bg-white">
        <div className="center-alignment">
          <div className="mb-[26px] relative w-[120px] h-[120px] border border-neutral-50 rounded-full overflow-hidden bg-white">
            {userData?.profile_image ? (
              <Image
                src={userData.profile_image}
                alt="프로필 이미지"
                fill
                priority
                className="w-full h-full object-cover bg-white"
                sizes="200px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          <p className="text-lg font-semibold mb-[40px]">{userData?.nickname || '로그인후 이용부탁드립니다.'}</p>
        </div>
        <nav>
          <ul>
            <li className="mb-[40px]">
              <Link
                href="/profile"
                className={
                  currentPage === 'profile' ? 'text-h5 font-bold text-main-400' : 'text-h5 font-bold text-sub-100'
                }
              >
                프로필
              </Link>
            </li>
            <li className="mb-[24px]">
              <Link
                href="/profile/activities"
                className={
                  currentPage === 'activities' ? 'text-h5 font-bold text-main-400' : 'text-h5 font-bold text-sub-100'
                }
              >
                내 활동
              </Link>
            </li>
            <p className="mb-[40px] border-b border-neutral-100" />
            <li>
              <button className="text-h5 font-bold text-sub-100 hover:text-main-400" onClick={handleLogout}>
                로그아웃
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SidebarTablet;
