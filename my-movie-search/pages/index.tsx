import React from 'react';
import SearchForm from '../components/SearchForm';
import { useMovies } from '../components/SearchForm';

// Home component for the main page
const Home: React.FC = () => {
  // Fetch movies using the useMovies hook
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMovies('');

  return (
    <div>
      <h1>Movie Search App</h1>
      {/* Render the SearchForm component */}
      <SearchForm />
      {/* Display the list of movies */}
      <ul>
        {/* Map through each page and render movie titles */}
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.map((movie: any) => (
              <li key={movie.id}>{movie.title}</li>
            ))}
          </React.Fragment>
        ))}
      </ul>
      {/* Render a button for loading more movies */}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default Home;
