import React from 'react'
import { useEffect, useState } from 'react';

const Menu = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchMenu=async()=>{
            const token=localStorage.getItem('admin_token');
            const blob=await fetch('http://localhost:3000/api/menu',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`,
                },
            });
            const data=await blob.json();
            setMenu(data.data);
            setLoading(false);
        }
        fetchMenu();
    },[])
    console.log(menu);
  return (
    <div>Menu</div>
  )
}

export default Menu