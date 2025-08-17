import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { fetchBooks, fetchRentals, addBook, createRental, returnBook } from '../services/api';

export type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  status: 'available' | 'rented';
};
export type Rental = {
  id: number;
  bookId: number;
  bookTitle: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  rentalDate: string;
  returnDate: string;
  rentalDays: number;
};
type LibraryContextType = {
  books: Book[];
  rentals: Rental[];
  loading: {
    books: boolean;
    rentals: boolean;
    actions: boolean;
  };
  error: string | null;
  fetchAllBooks: () => Promise<void>;
  fetchAllRentals: () => Promise<void>;
  addNewBook: (book: Omit<Book, 'id'>) => Promise<void>;
  rentBookToUser: (rentalData: {
    bookId: number;
    userName: string;
    userEmail: string;
    userPhone: string;
    rentalDays: number;
  }) => Promise<void>;
  returnBookFromRental: (rentalId: number) => Promise<void>;
};
const LibraryContext = createContext<LibraryContextType | undefined>(undefined);
export const LibraryProvider: React.FC<{
  children: ReactNode;
}> = ({
  children
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState({
    books: false,
    rentals: false,
    actions: false
  });
  const [error, setError] = useState<string | null>(null);
  const fetchAllBooks = async () => {
    setLoading(prev => ({
      ...prev,
      books: true
    }));
    setError(null);
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books. Please try again later.');
      console.error(err);
    } finally {
      setLoading(prev => ({
        ...prev,
        books: false
      }));
    }
  };
  const fetchAllRentals = async () => {
    setLoading(prev => ({
      ...prev,
      rentals: true
    }));
    setError(null);
    try {
      const data = await fetchRentals();
      setRentals(data);
    } catch (err) {
      
    } finally {
      setLoading(prev => ({
        ...prev,
        rentals: false
      }));
    }
  };
  const addNewBook = async (book: Omit<Book, 'id'>) => {
    setLoading(prev => ({
      ...prev,
      actions: true
    }));
    setError(null);
    try {
      await addBook(book);
      await fetchAllBooks();
    } catch (err) {
      setError('Failed to add book. Please try again.');
      console.error(err);
    } finally {
      setLoading(prev => ({
        ...prev,
        actions: false
      }));
    }
  };
  const rentBookToUser = async (rentalData: {
    bookId: number;
    userName: string;
    userEmail: string;
    userPhone: string;
    rentalDays: number;
  }) => {
    setLoading(prev => ({
      ...prev,
      actions: true
    }));
    setError(null);
    try {
      await createRental(rentalData);
      await Promise.all([fetchAllBooks(), fetchAllRentals()]);
    } catch (err) {
      setError('Failed to rent book. Please try again.');
      console.error(err);
    } finally {
      setLoading(prev => ({
        ...prev,
        actions: false
      }));
    }
  };
  const returnBookFromRental = async (rentalId: number) => {
    setLoading(prev => ({
      ...prev,
      actions: true
    }));
    setError(null);
    try {
      await returnBook(rentalId);
      await Promise.all([fetchAllBooks(), fetchAllRentals()]);
    } catch (err) {
      setError('Failed to return book. Please try again.');
      console.error(err);
    } finally {
      setLoading(prev => ({
        ...prev,
        actions: false
      }));
    }
  };
  useEffect(() => {
    fetchAllBooks();
    fetchAllRentals();
  }, []);
  const value = {
    books,
    rentals,
    loading,
    error,
    fetchAllBooks,
    fetchAllRentals,
    addNewBook,
    rentBookToUser,
    returnBookFromRental
  };
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};
export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};