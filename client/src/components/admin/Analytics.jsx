import React, { useEffect, useState } from 'react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/admin/stats', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAnalytics(data.data);    
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Admin Analytics Dashboard</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="space-y-8">

          {/* 👤 Users & Feedback */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">👥 Users & Feedback</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card title="Users" value={analytics.users || 0} />
              <Card title="Avg Feedback Rating" value={analytics.feedback?.avgRating || 0} />
            </div>
          </div>

          {/* 📦 Subscriptions */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">📦 Subscriptions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card title="Active Subscriptions" value={analytics.subscriptions?.activeSubscriptions || 0} />
              <Card title="Total Subscriptions" value={analytics.subscriptions?.totalSubscriptions || 0} />
            </div>
          </div>

          {/* 🚚 Orders */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">📦 Orders</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Card title="Total Orders" value={analytics.orders?.totalOrders || 0} />
              <Card title="Pending" value={analytics.orders?.pendingOrders || 0} />
              <Card title="In Transit" value={analytics.orders?.inTransitOrders || 0} />
              <Card title="Delivered" value={analytics.orders?.deliveredOrders || 0} />
              <Card title="Cancelled" value={analytics.orders?.cancelledOrders || 0} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Reusable card component
const Card = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow-md p-4 transition hover:shadow-lg border border-gray-200">
    <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default Analytics;
