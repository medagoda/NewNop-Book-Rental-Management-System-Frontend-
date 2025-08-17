const API_URL = 'http://localhost:8080/api';
// Fetch all books
export const fetchBooks = async () => {
  const response = await fetch(`${API_URL}/books`);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return response.json();
};
// Add a new book
export const addBook = async book => {
  const response = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  });
  if (!response.ok) {
    throw new Error('Failed to add book');
  }
  return response.json();
};
// Fetch all rentals
export const fetchRentals = async () => {
  const response = await fetch(`${API_URL}/rentals`);
  if (!response.ok) {
    throw new Error('Failed to fetch rentals');
  }
  return response.json();
};
// Create a new rental
export const createRental = async rentalData => {
  const response = await fetch(`${API_URL}/rentals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rentalData)
  });
  if (!response.ok) {
    throw new Error('Failed to create rental');
  }
  return response.json();
};
// Return a book
export const returnBook = async rentalId => {
  const response = await fetch(`${API_URL}/rentals/${rentalId}/return`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to return book');
  }
  return response.json();
};