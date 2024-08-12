import SearchButton from '@/assets/images/header/SearchButton';
import { isSearchValid } from '@/utils/validateBannedWords';
import { useRouter } from 'next/navigation';
import { KeyboardEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TAG_LIST } from '@/constants/tags';
import X from '@/assets/images/header/X';

const SearchBar = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  useEffect(() => {
    if (keyword.startsWith('#')) {
      setShowSuggestions(true);
      const tagSearch = keyword.slice(1).toLowerCase();
      const filtered = TAG_LIST.filter((tag) => tag.name.includes(tagSearch)).map((tag) => tag.name);
      setFilteredTags(filtered);
    } else {
      setShowSuggestions(false);
    }
  }, [keyword]);

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (keyword === '') return;
      if (!isSearchValid(keyword)) {
        toast.error('검색할 수 없는 검색어입니다.', {
          autoClose: 2000
        });
        return;
      }
      if (keyword.startsWith('#')) {
        router.push(`/search?searchType=tag&keyword=${keyword.slice(1)}`);
      } else {
        router.push(`/search?searchType=title&keyword=${keyword}`);
      }
    }
  };

  const handleTagClick = (tag: string) => {
    const newKeyword = `#${tag}`;
    setKeyword(newKeyword);
    router.push(`/search?searchType=tag&keyword=${newKeyword.slice(1)}`);
    setShowSuggestions(false);
  };

  const handleClearKeyword = () => {
    setKeyword('');
  };

  return (
    <div className="relative flex flex-col items-center text-neutral-400">
      <div className="flex items-center border border-neutral-200 rounded-md w-[318px] h-[56px]">
        <div className="flex items-center ml-4">
          <SearchButton />
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearch}
            className="mx-2 pr-4 w-[222px] font-bold focus:outline-none bg-transparent"
          />
          {!keyword || (
            <button className="my-4 mr-4" onClick={handleClearKeyword}>
              <X />
            </button>
          )}
        </div>
      </div>
      {showSuggestions && filteredTags.length > 0 && (
        <ul className="absolute top-[40px] z-[1000] max-h-52 mt-1 w-64 border border-neutral-200 bg-transparent rounded-md shadow-lg overflow-y-auto">
          {filteredTags.map((tag, index) => (
            <li key={index} className="p-2 cursor-pointer hover:bg-main-50" onClick={() => handleTagClick(tag)}>
              #{tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
