import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useInfiniteQuery } from 'react-query';
import { useStoreInstance } from '../pages/_app';
import { debounce } from 'lodash';

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface ApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Function to fetch movies from the TMDB API
const fetchMovies = async (key: string[], page: number): Promise<Movie[]> => {
  try {
    const response = await axios.get<ApiResponse>(
      `https://api.themoviedb.org/3/search/movie?query=${key[1]}&page=${page}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        },
      }
    );

    console.log('Movie API Response:', response.data);

    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

// Custom hook for using infinite query to fetch movies
export const useMovies = (searchTerm: string) => {
  return useInfiniteQuery(['movies', searchTerm], ({ pageParam = 1 }) => {
    const movies = fetchMovies(['movies', searchTerm], pageParam);
    console.log('Fetched movies:', movies);
    return movies;
  });
};


// React functional component for the search form
const SearchForm: React.FC = () => {
  // Access the setSearchTerm function from the Zustand store
  const setSearchTerm = useStoreInstance((state) => state.setSearchTerm);

  // Get the initial search term from the Zustand store
  const initialSearchTerm = useStoreInstance.getState().searchTerm;

  // React Hook Form configuration
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(z.object({
      searchTerm: z.string().min(1).max(10),
    })),
    defaultValues: {
      searchTerm: initialSearchTerm,
    },
  });

  // Function to handle form submission
  const onSubmit = (data: { searchTerm: string }) => {
    console.log('Search Term:', data.searchTerm);
    setSearchTerm(data.searchTerm);
  };

  // Debounce the form submission to avoid frequent API calls
  const debouncedSubmit = debounce(onSubmit, 300);

  // Render the search form
  return (
    <form onSubmit={handleSubmit(debouncedSubmit)}>
      <input {...register('searchTerm')} placeholder="Search movies" />
      {formState.errors.searchTerm && (
        <p>Error: {formState.errors.searchTerm.message}</p>
      )}
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchForm;
