import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useInfiniteQuery } from 'react-query';
import { useStoreInstance } from '../pages/_app';

// Function to fetch movies from the TMDB API
const fetchMovies = async (key: string[], page: number) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${key[1]}&page=${page}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        },
      }
    );

    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

// Custom hook to handle the movie query
export const useMovies = (searchTerm: string) => {
  return useInfiniteQuery(['movies', searchTerm], ({ pageParam = 1 }) => fetchMovies(['movies', searchTerm], pageParam));
};

// Functional component SearchForm
const SearchForm: React.FC = () => {
  // Access the setSearchTerm function from the store using the custom hook useStoreInstance
  const setSearchTerm = useStoreInstance((state) => state.setSearchTerm);
  // Get the initial search term from the store state
  const initialSearchTerm = useStoreInstance.getState().searchTerm;

  // Form configuration using react-hook-form with Zod for validation
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(z.object({
      searchTerm: z.string().min(1).max(10),
    })),
    defaultValues: {
      searchTerm: initialSearchTerm,
    },
  });

  // Form submission handler function
  const onSubmit = (data: { searchTerm: string }) => {
    setSearchTerm(data.searchTerm);
  };

  return (
    // Render the form with input field, error handling, and search button
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('searchTerm')} placeholder="Search movies" />
      {formState.errors.searchTerm && (
        <p>Error: {formState.errors.searchTerm.message}</p>
      )}
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchForm;
