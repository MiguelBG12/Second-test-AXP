import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Movie } from './types';

// Function to fetch movies from the TMDB API
const fetchMovies = async (searchTerm: string) => {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY; // Get the TMDB API key from environment variables
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`; // API endpoint URL
  
  // Fetch movies data from the API
  const response = await axios.get<{ results: Movie[] }>(url); // Fetch data and extract results
  return response.data.results; // Return the results array
};

// Define props for the MovieList component
interface MovieListProps {
  searchTerm: string; // Search term to fetch movies
}

// MovieList component
const MovieList: React.FC<MovieListProps> = ({ searchTerm }) => {
  // Use useQuery hook to fetch movies data
  const { data, isLoading, isError } = useQuery<Movie[], Error>(
    ['movies', searchTerm], // Unique query key based on searchTerm
    () => fetchMovies(searchTerm), // Function to fetch movies data
    { enabled: !!searchTerm } // Fetch data only when searchTerm is truthy
  );

  // If data is loading, show loading message
  if (isLoading) return <p>Loading...</p>;
  // If there is an error fetching data, show error message
  if (isError) return <p>Error fetching movies!</p>;

  // Render the list of movies
  return (
    <ul>
      {data?.map((movie) => (
        <li key={movie.id}>{movie.title}</li> // Render each movie title as a list item
      ))}
    </ul>
  );
};

export default MovieList;