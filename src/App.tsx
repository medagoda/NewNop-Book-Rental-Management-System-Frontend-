import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { LibraryProvider } from './context/LibraryContext';
import { Toaster } from 'react-hot-toast';
export function App() {
  return <LibraryProvider>
    <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col md:flex-row h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </LibraryProvider>;
}