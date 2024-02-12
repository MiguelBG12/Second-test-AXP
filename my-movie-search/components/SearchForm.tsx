import React from 'react';
import { SubmitHandler, FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../pages/_app';

// Define props for the SearchForm component
interface SearchFormProps {
  onSubmit: (searchTerm: string) => void; // Callback function triggered on form submission
}

// SearchForm component
const SearchForm: React.FC<SearchFormProps> = ({ onSubmit }) => {
  // Initialize form methods and state using useForm hook
  const { register, handleSubmit, formState } = useForm({
    // Use zodResolver to validate form inputs using Zod schema
    resolver: zodResolver(z.object({
      searchTerm: z.string().min(1).max(10), // Define validation rules for searchTerm
    })),
  });

  // Access searchTerm state from the global store
  const { searchTerm } = useStore.getState();

  // Define handler for form submission
  const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
    // Call onSubmit callback with the search term from form data
    onSubmit(data.searchTerm);
  };

  // Render the search form
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Input field for search term */}
      <input {...register('searchTerm')} defaultValue={searchTerm} placeholder="Search movies" />
      {/* Display error message if searchTerm validation fails */}
      {formState.errors.searchTerm && (
        <p>Error: {formState.errors.searchTerm.message}</p>
      )}
      {/* Submit button */}
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchForm;
