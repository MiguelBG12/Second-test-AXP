import React, { useState } from 'react';
import SearchForm from '../components/SearchForm'; // Import the SearchForm component
import MovieList from '../components/MovieList'; // Import the MovieList component

// Define the Home component as a functional component
const Home: React.FC = () => {
  // Define state to hold the search term
  const [searchTerm, setSearchTerm] = useState('');

  // Define a function to handle the search term submission
  const handleSearch = (term: string) => {
    setSearchTerm(term); // Update the search term state
  };

  // Render the components: SearchForm and MovieList
  return (
    <div>
      <h1>Movie Search App</h1> {/* Render a heading for the app */}
      <SearchForm onSubmit={handleSearch} /> {/* Render the SearchForm component */}
      {/* Render the MovieList component only if searchTerm is not empty */}
      {searchTerm && <MovieList searchTerm={searchTerm} />}
    </div>
  );
};

export default Home;
