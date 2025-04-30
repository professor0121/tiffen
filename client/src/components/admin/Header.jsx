import React from 'react';

const AdminHeader = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-4 bg-gray-800 text-white shadow-md z-50">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden block">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">🛠️ Admin Panel</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm">Welcome, Admin</span>
        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
