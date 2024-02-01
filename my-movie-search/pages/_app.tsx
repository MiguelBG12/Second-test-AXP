import { AppProps } from 'next/app';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { create, State } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  tmdbApiKey: string;
};

// Create the store without persistence
export const useStoreInstance = create<Store>((set, get) => ({
  searchTerm: '',
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  tmdbApiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY || '',
}));

// Apply persistence middleware to the store
const persistedUseStoreInstance = persist<Store>(useStoreInstance, {
  name: 'movie-search-store',
});

export const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export default MyApp;
