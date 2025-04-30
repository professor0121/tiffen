import React from 'react';

const Home = () => {
  return (
    <div className="text-black p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
        🍱 Welcome to Tiffen Services Admin Dashboard
      </h2>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <h3 className="text-sm text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">1,250</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <h3 className="text-sm text-gray-500">Active Customers</h3>
          <p className="text-2xl font-bold">320</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <h3 className="text-sm text-gray-500">Today's Deliveries</h3>
          <p className="text-2xl font-bold">75</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <h3 className="text-sm text-gray-500">Pending Requests</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
          Recent Orders
        </h3>
        <p className="text-gray-600 text-sm">
          This section will list the latest orders and activities by users.
        </p>
        {/* Add map loop here for dynamic recent order list */}
      </div>
    </div>
  );
};

export default Home;
