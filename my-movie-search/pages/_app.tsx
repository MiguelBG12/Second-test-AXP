import React from 'react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import create from 'zustand'; // Import the create function from zustand
import { persist } from 'zustand/middleware'; // Import the persist middleware from zustand

// Define the shape of the store state
export interface StoreState {
  searchTerm: string; // Search term stored in the state
}

// Create the warehouse without persistence initially
export const useStore = create<StoreState>(() => ({
  searchTerm: '', // Initial state without persistence
}));

// Apply persistence middleware
export const persistedStore = persist(useStore, {
  name: 'search-storage', // Persistent store name
});


// MyApp component that wraps the Next.js App component
function MyApp({ Component, pageProps }: AppProps) {
  const queryClientRef = React.useRef<QueryClient>();
  
  // Initialize a QueryClient instance if not already initialized
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  // Render the QueryClientProvider and Hydrate components to provide React Query functionalities
  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} /> {/* Render the provided component */}
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp; // Export the MyApp component as the default export
