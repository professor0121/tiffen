import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const fetchUsers=async()=>{
      const token=localStorage.getItem('admin_token');
      const blob=await fetch('http://localhost:3000/api/admin/allusers',{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`,
        },
      });
      const data=await blob.json();
      setUsers(data.data);
      setLoading(false);
    }
    fetchUsers();
  },[])
  const sortedUsers = [...users].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  console.log(sortedUsers);
  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">📦 Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 text-[#191919]">User ID</th>
              <th className="px-4 py-2 text-[#191919]">User Name</th>
              <th className="px-4 py-2 text-[#191919]">Email</th>
              <th className="px-4 py-2 text-[#191919]">Phone</th>
              <th className="px-4 py-2 text-[#191919]">Address</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2 text-[#191919]">{user.id}</td>
                <td className="px-4 py-2 text-[#191919]">{user.name}</td>
                <td className="px-4 py-2 text-[#191919]">{user.email}</td>
                <td className="px-4 py-2 text-[#191919]">{user.phone}</td>
                <td className="px-4 py-2 text-[#191919]">{user.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users