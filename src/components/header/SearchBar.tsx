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
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

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

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveSearchHistory = (newKeyword: string) => {
    setSearchHistory((prevHistory) => {
      const updatedHistory = [newKeyword, ...prevHistory.filter((item) => item !== newKeyword)].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (keyword === '') return;
      if (!isSearchValid(keyword)) {
        toast.error('검색할 수 없는 검색어입니다.', {
          autoClose: 2000
        });
        return;
      }

      setShowSuggestions(false);
      setIsFocused(false);

      saveSearchHistory(keyword);

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

  const handleHistoryClick = (item: string) => {
    setKeyword(item);
    if (item.startsWith('#')) {
      router.push(`/search?searchType=tag&keyword=${item.slice(1)}`);
    } else {
      router.push(`/search?searchType=title&keyword=${item}`);
    }
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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="mx-2 pr-4 w-[222px] font-bold focus:outline-none bg-transparent"
          />
          {!keyword || (
            <button className="my-4 mr-4" onClick={handleClearKeyword}>
              <X />
            </button>
          )}
        </div>
      </div>
      {isFocused && !showSuggestions && (
        <ul className="search-toggle-list">
          {searchHistory.map((item, index) => (
            <li key={index} className="search-toggle-item" onClick={() => handleHistoryClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
      {showSuggestions && filteredTags.length > 0 && (
        <ul className="search-toggle-list">
          {filteredTags.map((tag, index) => (
            <li key={index} className="search-toggle-item" onClick={() => handleTagClick(tag)}>
              # {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
