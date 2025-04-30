import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

const AdminIndex = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
        <div><h1>wellcome Admin</h1></div>
    </div>
  )
}

export default AdminIndex