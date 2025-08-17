import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookIcon, PlusCircleIcon, ClockIcon, LayoutDashboardIcon } from 'lucide-react';
export const Sidebar = () => {
  return <aside className="bg-indigo-800 text-white w-full md:w-64 p-6 md:min-h-screen">
      <div className="flex items-center mb-8">
        <BookIcon className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">Library Manager</h1>
      </div>
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={({
        isActive
      }) => `flex items-center px-4 py-3 rounded-lg transition ${isActive ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}>
          <LayoutDashboardIcon className="h-5 w-5 mr-3" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/" end className={({
        isActive
      }) => `flex items-center px-4 py-3 rounded-lg transition ${isActive ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}>
          <BookIcon className="h-5 w-5 mr-3" />
          <span>Book List</span>
        </NavLink>
        <NavLink to="/add-book" className={({
        isActive
      }) => `flex items-center px-4 py-3 rounded-lg transition ${isActive ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}>
          <PlusCircleIcon className="h-5 w-5 mr-3" />
          <span>Add Book</span>
        </NavLink>
        <NavLink to="/rentals" className={({
        isActive
      }) => `flex items-center px-4 py-3 rounded-lg transition ${isActive ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}>
          <ClockIcon className="h-5 w-5 mr-3" />
          <span>Rental History</span>
        </NavLink>
      </nav>
    </aside>;
};