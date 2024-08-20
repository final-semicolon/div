import BestForum from './_components/BestForum';
import LandingPage from './_components/LandingPage';
import MainPageTag from './_components/MainPageTag';
import PostsLink from './_components/PostsLink';
import TodayQna from './_components/TodayQna';
import TopButton from '@/components/common/TopButton';

const HomePage = async () => {
  return (
    <div className={`flex flex-col justify-center items-center relative`}>
      <div className="w-full flex flex-col md:gap-20">
        <PostsLink />
        <BestForum />
        <TodayQna />
        <LandingPage />
        <MainPageTag />
        <div className=" hidden md:block">
          <TopButton />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
