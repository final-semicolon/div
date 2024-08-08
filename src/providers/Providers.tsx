import { PropsWithChildren } from 'react';
import TanstackQueryProvider from './TanstackQueryProvider';
import { AuthProvider } from '@/context/auth.context';
import { BookmarkProvider } from './BookmarkProvider';
import LikeProvider from './LikeProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <TanstackQueryProvider>
      <AuthProvider>
        <BookmarkProvider>
          <LikeProvider>
            <ToastContainer
              position="bottom-center"
              autoClose={3000}
              limit={1}
              hideProgressBar
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
              theme="dark"
            />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </LikeProvider>
        </BookmarkProvider>
      </AuthProvider>
    </TanstackQueryProvider>
  );
};

export default Providers;
