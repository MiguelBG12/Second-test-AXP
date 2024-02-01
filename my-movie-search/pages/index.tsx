import React from 'react';
import SearchForm, { Movie } from '../components/SearchForm';
import { useMovies } from '../components/SearchForm';

const Home: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMovies('');

  console.log('Movies Data:', data);

  return (
    <div>
      <h1>Movie Search App</h1>
      <SearchForm />
      <ul>
        {data?.pages.map((page, index) => {
          console.log('Page Data:', page);
          return (
            <React.Fragment key={index}>
              {page.map((movie: Movie) => (
                <li key={movie.id}>{movie.title}</li>
              ))}
            </React.Fragment>
          );
        })}
      </ul>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default Home;
