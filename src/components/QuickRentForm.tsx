import React, { useEffect, useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../context/LibraryContext';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast'; // we'll use react-hot-toast for notifications

export const QuickRentForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { rentBookToUser, loading } = useLibrary();
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState({
    bookId: '',
    userName: '',
    userEmail: '',
    userPhone: '',
    rentalDays: 7
  });
  const [formErrors, setFormErrors] = useState({
    bookId: '',
    userName: '',
    userEmail: '',
    userPhone: '',
    rentalDays: ''
  });

  const API_BASE_URL = 'http://localhost:6060/api';

  // Fetch books from backend
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/books`);
      setBooks(response.data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const validateForm = () => {
    const errors = { bookId: '', userName: '', userEmail: '', userPhone: '', rentalDays: '' };
    let isValid = true;

    if (!formData.bookId) { errors.bookId = 'Please select a book'; isValid = false; }
    if (!formData.userName.trim()) { errors.userName = 'Name is required'; isValid = false; }
    if (!formData.userEmail.trim()) { errors.userEmail = 'Email is required'; isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) { errors.userEmail = 'Email is invalid'; isValid = false; }
    if (!formData.userPhone.trim()) { errors.userPhone = 'Phone number is required'; isValid = false; }
    if (formData.rentalDays < 7 || formData.rentalDays > 30) { errors.rentalDays = 'Rental days must be between 7 and 30'; isValid = false; }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rentalDays' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Create rental record in backend
      await axios.post(`${API_BASE_URL}/rent`, {
        bookId: parseInt(formData.bookId),
        name: formData.userName,
        email: formData.userEmail,
        phone: formData.userPhone,
        rentalDays: formData.rentalDays
      });

      toast.success('Rental created successfully!'); // popup message

      setFormData({ bookId: '', userName: '', userEmail: '', userPhone: '', rentalDays: 7 });
      onSuccess();
      fetchBooks(); // refresh books
    } catch (err: any) {
      console.error('Error creating rental:', err);
      toast.error(err.response?.data?.message || 'Failed to create rental');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Toaster position="top-right" reverseOrder={false} /> {/* toast container */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Book Rental</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 mb-1">Select Book</label>
          <select
            id="bookId"
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">-- Select a book --</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
          {formErrors.bookId && <p className="text-red-500 text-xs mt-1">{formErrors.bookId}</p>}
        </div>

        {/* Rest of the form fields (Name, Email, Phone, Rental Days) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Full Name" />
            {formErrors.userName && <p className="text-red-500 text-xs mt-1">{formErrors.userName}</p>}
          </div>
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="email@example.com" />
            {formErrors.userEmail && <p className="text-red-500 text-xs mt-1">{formErrors.userEmail}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" id="userPhone" name="userPhone" value={formData.userPhone} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Phone Number" />
            {formErrors.userPhone && <p className="text-red-500 text-xs mt-1">{formErrors.userPhone}</p>}
          </div>
          <div>
            <label htmlFor="rentalDays" className="block text-sm font-medium text-gray-700 mb-1">Rental Days (7-30)</label>
            <input type="number" id="rentalDays" name="rentalDays" min={7} max={30} value={formData.rentalDays} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            {formErrors.rentalDays && <p className="text-red-500 text-xs mt-1">{formErrors.rentalDays}</p>}
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading.actions} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
            {loading.actions ? 'Processing...' : 'Rent Book'}
          </button>
        </div>
      </form>
    </div>
  );
};
