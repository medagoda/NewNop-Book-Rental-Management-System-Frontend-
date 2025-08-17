import React, { useEffect, useState } from 'react';
import { SearchIcon, RefreshCwIcon } from 'lucide-react';
import axios from 'axios';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import toast from 'react-hot-toast';

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  availabilityStatus: string; // backend field
  status: 'available' | 'rented'; // computed field for UI
}

export const BookList = () => {
  const API_BASE_URL = 'http://localhost:6060/api'; // backend URL
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState({ books: false, actions: false });
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [updateForm, setUpdateForm] = useState({ title: '', author: '', genre: '' });

  const fetchAllBooks = async () => {
    setLoading({ books: true, actions: false });
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/books`);
      const booksFromApi: Book[] = response.data.map((b: any) => ({
        ...b,
        status: b.availabilityStatus?.toLowerCase() === 'available' ? 'available' : 'rented',
      }));
      setBooks(booksFromApi);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading({ books: false, actions: false });
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  useEffect(() => {
    setFilteredBooks(
      books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [books, searchTerm]);

  const handleUpdateBook = (book: Book) => {
    setSelectedBook(book);
    setUpdateForm({ title: book.title, author: book.author, genre: book.genre });
  };

  const handleDeleteBook = async (book: Book) => {
    if (!window.confirm('Are you sure you want to delete this book?')) 
      return;
  
    try {
      await axios.delete(`${API_BASE_URL}/books/${book.id}`);
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
      toast.success('Book deleted successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete book');
    }
  };
  

  const handleUpdateSubmit = async () => {
    if (!selectedBook) return;
    setLoading((prev) => ({ ...prev, actions: true }));
    try {
      await axios.put(`${API_BASE_URL}/books/${selectedBook.id}`, updateForm);
      setBooks((prev) =>
        prev.map((b) =>
          b.id === selectedBook.id ? { ...b, ...updateForm } : b
        )
      );
      setSelectedBook(null);
      toast.success('Book updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update book');
    } finally {
      setLoading((prev) => ({ ...prev, actions: false }));
    }
  };

  const closeModal = () => setSelectedBook(null);

  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Library Books</h1>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => fetchAllBooks()}
            className="p-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
            title="Refresh books"
          >
            <RefreshCwIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading.books ? (
        <Loading />
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found. Try adjusting your search or add new books.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      book.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {book.status === 'available' ? 'Available' : 'Rented'}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{book.author}</p>
                <p className="text-gray-500 text-sm mt-2">Genre: {book.genre}</p>
                <div className="mt-4 flex gap-2">
                  {/* Update Button */}
                  <button
                    onClick={() => handleUpdateBook(book)}
                    className="w-1/2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Update
                  </button>

                  {/* Delete Button */}
                  <button onClick={() => handleDeleteBook(book)} disabled={book.status === 'rented'} // disable if rented
                  className={`w-1/2 px-4 py-2 rounded-md text-white ${book.status === 'rented' ? 'bg-gray-400 cursor-not-allowed': 'bg-red-600 hover:bg-red-700' }`}
                   title={book.status === 'rented' ? 'Cannot delete a rented book' : 'Delete book'}
                   >
  Delete
</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Update Book</h2>
            
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={updateForm.title}
                onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                placeholder="Title"
                className="border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={updateForm.author}
                onChange={(e) => setUpdateForm({ ...updateForm, author: e.target.value })}
                placeholder="Author"
                className="border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={updateForm.genre}
                onChange={(e) => setUpdateForm({ ...updateForm, genre: e.target.value })}
                placeholder="Genre"
                className="border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                disabled={loading.actions}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
