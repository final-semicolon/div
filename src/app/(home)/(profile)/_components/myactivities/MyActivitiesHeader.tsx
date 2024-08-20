import useProfiletopTabStore from '@/store/useProfiletopTabStore';

type MyActivitiesHeaderProps = {
  setActiveTab: (tab: string) => void;
  activeTab: string;
};

const MyActivitiesHeader = ({ setActiveTab, activeTab }: MyActivitiesHeaderProps) => {
  const settopButtonTab = useProfiletopTabStore((state) => state.settopButtonTab);

  const handleTabClick = (tab: 'posts' | 'likes' | 'bookmarks') => {
    settopButtonTab(tab);
    setActiveTab(tab);
  };

  return (
    <header>
      <nav>
        <ul className=" h-[50px] flex justify-between items-center text-center ">
          <li
            className={`h-[50px] w-[283px] center-alignment ${activeTab === 'posts' ? 'text-main-400 border border-sub-50 bg-sub-50 rounded-t-2xl' : 'text-neutral-300'}`}
            onClick={() => handleTabClick('posts')}
          >
            내가 쓴 글
          </li>
          <li
            className={` h-[50px] w-[283px] center-alignment ${activeTab === 'likes' ? 'text-main-400 border border-sub-50 bg-sub-50 rounded-t-2xl' : 'text-neutral-300'}`}
            onClick={() => handleTabClick('likes')}
          >
            좋아요 한 글
          </li>
          <li
            className={` h-[50px] w-[283px] center-alignment ${activeTab === 'bookmarks' ? 'text-main-400 border border-sub-50 bg-sub-50 rounded-t-2xl' : 'text-neutral-300'}`}
            onClick={() => handleTabClick('bookmarks')}
          >
            북마크
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MyActivitiesHeader;
