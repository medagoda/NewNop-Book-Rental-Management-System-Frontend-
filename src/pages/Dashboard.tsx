import React, { useEffect, useState } from 'react';
import { BookIcon, UsersIcon, BookOpenIcon, CheckCircleIcon } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { QuickRentForm } from '../components/QuickRentForm';
import { Book, Rental } from '../context/LibraryContext';

export const Dashboard = () => {
  const { books, rentals, loading, error, fetchAllRentals } = useLibrary();
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (books) {
      setAvailableBooks(books.filter(book => book.status === 'available'));
    }
  }, [books]);

  useEffect(() => {
    fetchAllRentals();
  }, []);

  const handleRentalSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Calculate statistics
  const totalBooks = books.length;
  const availableBookCount = books.filter(book => book.status === 'available').length;
  const activeRentals = rentals.filter(rental => !rental.returnDate).length;
  const totalRentals = rentals.length;

  // Get recent rentals
  const recentRentals = [...rentals]
    .sort((a, b) => new Date(b.rentalDate).getTime() - new Date(a.rentalDate).getTime())
    .slice(0, 5);

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {showSuccessMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">Book rented successfully!</p>
          </div>
        </div>
      )}

      {loading.books || loading.rentals ? (
        <Loading />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <BookIcon className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Books</h3>
                  <p className="text-2xl font-semibold text-gray-800">{totalBooks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <BookOpenIcon className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Available Books</h3>
                  <p className="text-2xl font-semibold text-gray-800">{availableBookCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <UsersIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Active Rentals</h3>
                  <p className="text-2xl font-semibold text-gray-800">{activeRentals}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <CheckCircleIcon className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Rentals</h3>
                  <p className="text-2xl font-semibold text-gray-800">{totalRentals}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Rent Form */}
            <QuickRentForm availableBooks={availableBooks} onSuccess={handleRentalSuccess} />

            {/* Recent Rentals */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Rentals</h3>
              {recentRentals.length === 0 ? (
                <p className="text-gray-500">No rental history found.</p>
              ) : (
                <div className="space-y-4">
                  {recentRentals.map((rental: Rental) => (
                    <div key={rental.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{rental.bookDto?.title || 'Unknown Book'}</h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            rental.returnDate ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {rental.returnDate ? 'Returned' : 'Active'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Rented by: {rental.userName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(rental.rentalDate).toLocaleDateString()}
                        {rental.returnDate ? ` to ${new Date(rental.returnDate).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
