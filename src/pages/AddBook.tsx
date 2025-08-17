import React, { useState } from 'react';
import axios from 'axios';
import { ErrorMessage } from '../components/ErrorMessage';

interface BookForm {
  title: string;
  author: string;
  genre: string;
}

export const AddBook = () => {
  const [formData, setFormData] = useState<BookForm>({
    title: '',
    author: '',
    genre: ''
  });

  const [formErrors, setFormErrors] = useState({
    title: '',
    author: '',
    genre: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Success message

  const API_BASE_URL = 'http://localhost:6060/api'; // Replace with your backend URL

  const validateForm = () => {
    const errors = { title: '', author: '', genre: '' };
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }
    if (!formData.author.trim()) {
      errors.author = 'Author is required';
      isValid = false;
    }
    if (!formData.genre.trim()) {
      errors.genre = 'Genre is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dataToSend = { ...formData, status: 'available' }; // Default status
      const response = await axios.post(`${API_BASE_URL}/books`, dataToSend);
      console.log('Book added:', response.data);

      setSuccess('Book added successfully!'); // Show success message
      setFormData({ title: '', author: '', genre: '' }); // Clear form
    } catch (err: any) {
      console.error('Error adding book:', err);
      setError(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Book</h1>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Book title"
            />
            {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Author name"
            />
            {formErrors.author && <p className="text-red-500 text-xs mt-1">{formErrors.author}</p>}
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Book genre"
            />
            {formErrors.genre && <p className="text-red-500 text-xs mt-1">{formErrors.genre}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => setFormData({ title: '', author: '', genre: '' })}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};
