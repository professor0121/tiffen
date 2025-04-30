import React, { useState } from 'react'
import Header from '@/components/admin/Header'
import Sidebar from '@/components/admin/Sidebar'
import Home from '@/components/admin/Home'
import Users from '@/components/admin/Users'
import Settings from '@/components/admin/Settings'
import Orders from '@/components/admin/Order'
import Menu from '@/components/admin/Menu'
import Analytics from '@/components/admin/Analytics'
import Feedback from '@/components/admin/Feedback'

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('Home')

  const renderView = () => {
    switch (currentView) {
      case 'Home': return <Home />
      case 'Users': return <Users />
      case 'Settings': return <Settings />
      case 'Orders': return <Orders />
      case 'Menu': return <Menu />
      case 'Analytics': return <Analytics />
      case 'Feedback': return <Feedback />  
      default: return <Home />
    }
  }

  return (
    <div>
      <Header />
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="md:ml-64 ml-0 pt-16 p-6">{renderView()}</main>
    </div>
  )
}

export default Dashboard
