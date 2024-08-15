import { memo } from 'react';

const StatusTabs = ({ status, setStatus }: { status: string; setStatus: (status: string) => void }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <button
        onClick={() => setStatus('waiting')}
        className={`flex justify-center items-center flex-grow py-6 ${
          status === 'waiting' ? 'bg-sub-50 text-neutral-800' : 'bg-white text-neutral-300'
        } rounded-tl-3xl rounded-tr-3xl transition-colors duration-300`}
      >
        <p className="text-body1 font-bold"> 채택을 기다리는 질문글</p>
      </button>
      <button
        onClick={() => setStatus('selected')}
        className={`flex justify-center items-center flex-grow py-6 ${
          status === 'selected' ? 'bg-sub-50 text-neutral-700' : 'bg-white text-neutral-400'
        } rounded-tr-3xl rounded-tl-3xl transition-colors duration-300`}
      >
        <p className="text-body1 font-bold"> 채택을 완료한 질문글</p>
      </button>
    </div>
  );
};

export default memo(StatusTabs);
