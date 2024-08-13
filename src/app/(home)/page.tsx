import BestForum from './_components/BestForum';
import LandingPage from './_components/LandingPage';
import MainPageTag from './_components/MainPageTag';
import PostsLink from './_components/PostsLink';
import TodayQna from './_components/TodayQna';
import TopButton from '@/components/common/TopButton';

const HomePage = async () => {
  return (
    <div className={`flex flex-col justify-center items-center relative`}>
      <div className="w-[1204px] flex flex-col gap-20">
        <PostsLink />
        <BestForum />
        <TodayQna />
        <LandingPage />
        <MainPageTag />
        <TopButton />
      </div>
    </div>
  );
};

export default HomePage;
