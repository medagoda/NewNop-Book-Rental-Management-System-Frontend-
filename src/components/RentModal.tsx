import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Book } from '../context/LibraryContext';
import { useLibrary } from '../context/LibraryContext';

type RentModalProps = {
  book: Book;
  onClose: () => void;
  onRent: (rentalData: { userName: string; userEmail: string; userPhone: string; rentalDays: number }) => void;
};

export const RentModal: React.FC<RentModalProps> = ({ book, onClose }) => {
  const { rentBookToUser, loading } = useLibrary();

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    rentalDays: 7,
  });

  const [formErrors, setFormErrors] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    rentalDays: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const errors = { userName: '', userEmail: '', userPhone: '', rentalDays: '' };
    let isValid = true;

    if (!formData.userName.trim()) {
      errors.userName = 'Name is required';
      isValid = false;
    }

    if (!formData.userEmail.trim()) {
      errors.userEmail = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      errors.userEmail = 'Email is invalid';
      isValid = false;
    }

    if (!formData.userPhone.trim()) {
      errors.userPhone = 'Phone number is required';
      isValid = false;
    }

    if (formData.rentalDays < 7 || formData.rentalDays > 30) {
      errors.rentalDays = 'Rental days must be between 7 and 30';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rentalDays' ? parseInt(value) || 7 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await rentBookToUser({
        bookId: book.id,
        ...formData,
      });

      // Show success message
      setSuccessMessage(`Book "${book.title}" rented successfully to ${formData.userName}!`);

      // Reset form
      setFormData({ userName: '', userEmail: '', userPhone: '', rentalDays: 7 });
      setFormErrors({ userName: '', userEmail: '', userPhone: '', rentalDays: '' });

      // Optionally close modal after delay
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error renting book:', error);
      setSuccessMessage('Failed to rent book. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Rent Book: {book.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {successMessage && (
          <div className="m-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Full Name"
            />
            {formErrors.userName && <p className="text-red-500 text-xs mt-1">{formErrors.userName}</p>}
          </div>

          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="email@example.com"
            />
            {formErrors.userEmail && <p className="text-red-500 text-xs mt-1">{formErrors.userEmail}</p>}
          </div>

          <div>
            <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="userPhone"
              name="userPhone"
              value={formData.userPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Phone Number"
            />
            {formErrors.userPhone && <p className="text-red-500 text-xs mt-1">{formErrors.userPhone}</p>}
          </div>

          <div>
            <label htmlFor="rentalDays" className="block text-sm font-medium text-gray-700 mb-1">
              Rental Days (7-30)
            </label>
            <input
              type="number"
              id="rentalDays"
              name="rentalDays"
              min={7}
              max={30}
              value={formData.rentalDays}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {formErrors.rentalDays && <p className="text-red-500 text-xs mt-1">{formErrors.rentalDays}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading.actions}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading.actions ? 'Processing...' : 'Rent Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
