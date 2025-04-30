import React, { useEffect, useState } from 'react';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token=localStorage.getItem('admin_token');

  useEffect(() => {
  const fetchOrders = async () => {
    const blob = await fetch('http://localhost:3000/api/admin/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data=await blob.json();
    setOrders(data.data);
    setLoading(false);
  }
  
    fetchOrders();
  }, []);
console.log(orders);
const sortedOrders = [...orders].sort(
  (a, b) => new Date(a.created_at) - new Date(b.created_at)
);

  
return (
  <div className="p-4 overflow-x-auto">
    <h2 className="text-xl font-semibold mb-4">📦 Orders</h2>
    {loading ? (
      <p>Loading...</p>
    ) : orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      <table className="min-w-full bg-white border border-gray-200 rounded shadow">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2 text-[#191919]">Order ID</th>
            <th className="px-4 py-2 text-[#191919]">User ID</th>
            <th className="px-4 py-2 text-[#191919]">Meal Type</th>
            <th className="px-4 py-2 text-[#191919]">User Name</th>
            <th className="px-4 py-2 text-[#191919]">Phone</th>
            <th className="px-4 py-2 text-[#191919]">Quantity</th>
            <th className="px-4 py-2 text-[#191919]">Status</th>
            <th className="px-4 py-2 text-[#191919]">Created At</th>
            <th className="px-4 py-2 text-[#191919]">Delivery Time</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2 text-[#191919]">{order.id}</td>
              <td className="px-4 py-2 text-[#191919]">{order.user_id}</td>
              <td className="px-4 py-2 text-[#191919]">{order.meal_type}</td>
              <td className="px-4 py-2 text-[#191919]">{order.user_name}</td>
              <td className="px-4 py-2 text-[#191919]">{order.user_phone}</td>
              <td className="px-4 py-2 text-[#191919]">{order.quantity}</td>
              <td className="px-4 py-2 text-[#191919]">{order.status}</td>
              <td className="px-4 py-2 text-[#191919]">{order.created_at}</td>
              <td className="px-4 py-2 text-[#191919]">{order.delivery_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

};

export default Order;
