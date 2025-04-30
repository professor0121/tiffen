import React, { useEffect, useState } from 'react';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/admin/feedback', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setFeedback(data.data || []);
      } catch (err) {
        console.error('Error fetching feedback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const renderStars = (rating) => {
    const total = 5;
    return (
      <span className="text-yellow-500 text-sm">
        {'★'.repeat(rating)}{'☆'.repeat(total - rating)}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <h2 className="text-3xl font-extrabold text-[#191919] mb-8">🗣️ User Feedback</h2>

      {loading ? (
        <p className="text-gray-600 text-lg">Loading feedback...</p>
      ) : feedback.length === 0 ? (
        <p className="text-gray-600 text-lg">No feedback found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedback.map((fb, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {fb.user?.name || fb.user_name || 'Anonymous User'}
                </h3>
                <p className="text-sm text-gray-500">User ID: {fb.user_id || 'N/A'}</p>
              </div>

              <div className="mb-3">
                {renderStars(fb.rating)}
                <p className="text-gray-600 text-sm">Rating: {fb.rating}/5</p>
              </div>

              <p className="text-gray-700 mb-4">{fb.comments || 'No comment provided.'}</p>

              <p className="text-xs text-gray-400">
                {new Date(fb.created_at).toLocaleString() || 'Unknown date'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
