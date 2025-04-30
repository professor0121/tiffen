import React, { useEffect, useState } from 'react';

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [mealType, setMealType] = useState('');
  const [items, setItems] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchMenu = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const blob = await fetch('http://localhost:3000/api/menu', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await blob.json();
      setMenu(data.data || []);
    } catch (err) {
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage('');
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch('http://localhost:3000/api/admin/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          meal_type: mealType,
          items: items.split(',').map(item => item.trim()),
          date,
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Menu created successfully!');
        setMealType('');
        setItems('');
        setDate('');
        fetchMenu(); // Refresh list
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">🍽️ Create Menu</h2>
      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow space-y-4 mb-6 w-full">
        <div>
          <label className="block font-semibold text-[#191919]">Meal Type</label>
          <input
            type="text"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full p-2 border rounded text-[#191919]"
            placeholder="e.g. Lunch, Dinner"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-[#191919]">Items (comma separated)</label>
          <input
            type="text"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            className="w-full p-2 border rounded text-[#191919]"
            placeholder="e.g. Rice, Dal, Roti"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-[#191919]">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded text-[#191919]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {creating ? 'Creating...' : 'Create Menu'}
        </button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>

      <h2 className="text-xl font-semibold mb-4">📋 All Menus</h2>
      {loading ? (
        <p>Loading...</p>
      ) : menu.length === 0 ? (
        <p>No menus found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 text-[#191919]">Menu ID</th>
              <th className="px-4 py-2 text-[#191919]">Menu Items</th>
              <th className="px-4 py-2 text-[#191919]">Meal Type</th>
              <th className="px-4 py-2 text-[#191919]">Date</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((menu, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2 text-[#191919]">{menu.id}</td>
                <td className="px-4 py-2 text-[#191919]">{Array.isArray(menu.items) ? menu.items.join(', ') : menu.items}</td>
                <td className="px-4 py-2 text-[#191919]">{menu.meal_type}</td>
                <td className="px-4 py-2 text-[#191919]">{menu.date?.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Menu;
