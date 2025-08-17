import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCwIcon } from 'lucide-react';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';

type Rental = {
  id: number;
  bookDto: {
    id: number;
    title: string;
    author: string;
    genre: string;
    availabilityStatus: 'AVAILABLE' | 'RENTED';
    borrowed: boolean;
  };
  rentalDate: string;
  returnDate?: string;
  returned: boolean;
  name: string;
  email: string;
  phone: string;
  rentalDays: number;
};

export const RentalHistory = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState({ rentals: false, actions: false });
  const [error, setError] = useState('');
  const API_BASE_URL = 'http://localhost:6060/api';

  const fetchAllRentals = async () => {
    setLoading(prev => ({ ...prev, rentals: true }));
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/rent`);
      setRentals(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch rentals');
    } finally {
      setLoading(prev => ({ ...prev, rentals: false }));
    }
  };

  const returnBookFromRental = async (rentalId: number) => {
    setLoading(prev => ({ ...prev, actions: true }));
    try {
      await axios.put(`${API_BASE_URL}/rent/${rentalId}/return`);
      fetchAllRentals();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to return the book');
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  useEffect(() => {
    fetchAllRentals();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rental History</h1>
        <button
          onClick={fetchAllRentals}
          className="p-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 flex items-center gap-1"
          title="Refresh rentals"
        >
          <RefreshCwIcon className="h-5 w-5" />
          Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading.rentals ? (
        <Loading />
      ) : rentals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No rental history found.</p>
        </div>
      ) : (
        <div className="w-full">
          <table className="w-full table-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {['Book Title', 'Author', 'Genre', 'Status', 'Name', 'Email', 'Phone', 'Rental Date', 'Return Date', 'Rental Days', 'Action'].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider break-words"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {rentals
    .filter((rental) => rental.bookDto.availabilityStatus !== 'AVAILABLE')
    .map((rental, idx) => (
      <tr
        key={rental.id}
        className={`transition-colors duration-200 hover:bg-gray-50 ${
          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
        }`}
      >
        <td className="px-4 py-2 text-sm font-medium text-gray-900 break-words">
          {rental.bookDto.title}
        </td>
        <td className="px-4 py-2 text-sm text-gray-700 break-words">
          {rental.bookDto.author}
        </td>
        <td className="px-4 py-2 text-sm text-gray-700 break-words">
          {rental.bookDto.genre}
        </td>
        <td className="px-4 py-2 text-sm">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Rented
          </span>
        </td>
        <td className="px-4 py-2 text-sm text-gray-700 break-words">
          {rental.name}
        </td>
        <td className="px-4 py-2 text-sm text-gray-700 break-words">
          {rental.email}
        </td>
        <td className="px-4 py-2 text-sm text-gray-700 break-words">
          {rental.phone}
        </td>
        <td className="px-4 py-2 text-sm text-gray-700">
          {formatDate(rental.rentalDate)}
        </td>
        <td className="px-4 py-2 text-sm text-gray-700">
          {rental.returnDate ? formatDate(rental.returnDate) : '-'}
        </td>
        <td className="px-4 py-2 text-sm text-gray-700">{rental.rentalDays}</td>
        <td className="px-4 py-2 text-sm">
          {!rental.returned && (
            <button
              onClick={() => returnBookFromRental(rental.id)}
              disabled={loading.actions}
              className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Return
            </button>
          )}
        </td>
      </tr>
    ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
