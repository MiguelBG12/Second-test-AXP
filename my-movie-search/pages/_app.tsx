import { AppProps } from 'next/app';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { create, State } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the store structure
type Store = {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  tmdbApiKey: string;
};

// Create a Zustand store with persistence
export const useStoreInstance = create<Store>(
  persist<State<Store>>((set, get) => ({
    searchTerm: '',
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    tmdbApiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY || '',
  }), {
    name: 'movie-search-store',
  })
);

// Create a new instance of QueryClient
const queryClient = new QueryClient();

// Custom Next.js App component
function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Provide the QueryClient to the app
    <QueryClientProvider client={queryClient}>
      {/* Render the main application component */}
      <Component {...pageProps} />
      {/* Render ReactQueryDevtools in development environment */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export default MyApp;
