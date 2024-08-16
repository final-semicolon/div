import { Dispatch, SetStateAction } from 'react';

type ReplyPageBtnProps = {
  totalPage: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

const ReplyPageBtn = ({ totalPage, page, setPage }: ReplyPageBtnProps) => {
  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };
  return (
    <div className=" flex pt-6 gap-4 w-full justify-end">
      <button onClick={handlePrevPage} disabled={page === 1}>
        <svg
          className={`${totalPage <= 1 ? 'hidden' : ''} ${page === 1 ? 'stroke-neutral-100 ' : 'stroke-neutral-500 hover:stroke-main-400 hover:bg-main-50 active:bg-main-50 active:stroke-main-400'} bg-neutral-50  rounded    `}
          width="33"
          height="32"
          viewBox="0 0 33 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="0.5" width="31" height="31" rx="5.5" stroke="none" />
          <rect x="1" y="0.5" width="31" height="31" rx="5.5" stroke="none" />
          <path
            d="M19.5 10L13.6414 15.8586C13.5633 15.9367 13.5633 16.0633 13.6414 16.1414L19.5 22"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <button onClick={handleNextPage} disabled={totalPage === page}>
        <svg
          className={`${totalPage <= 1 ? 'hidden' : ''} ${totalPage === page ? 'stroke-neutral-100' : 'stroke-neutral-500 hover:stroke-main-400 hover:bg-main-50 active:bg-main-50 active:stroke-main-400'} bg-neutral-50 rounded  `}
          width="33"
          height="32"
          viewBox="0 0 33 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="0.5" width="31" height="31" rx="5.5" stroke="none" />
          <rect x="1" y="0.5" width="31" height="31" rx="5.5" stroke="none" />
          <path
            d="M13.5 10L19.3586 15.8586C19.4367 15.9367 19.4367 16.0633 19.3586 16.1414L13.5 22"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default ReplyPageBtn;
