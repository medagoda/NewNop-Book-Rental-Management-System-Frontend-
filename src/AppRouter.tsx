import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { BookList } from './pages/BookList';
import { AddBook } from './pages/AddBook';
import { RentalHistory } from './pages/RentalHistory';
import { Dashboard } from './pages/Dashboard';
export function AppRouter() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<BookList />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-book" element={<AddBook />} />
          <Route path="rentals" element={<RentalHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>;
}