import Link from 'next/link';

const NotFound = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-2xl text-gray-600 mb-8">페이지를 찾을 수 없습니다.</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700 transition">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
