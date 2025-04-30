import React from 'react';

const Sidebar = ({ currentView, setCurrentView, isOpen }) => {
    const links = ['Home', 'Users','Reports', 'Analytics','Orders', 'Products','Menu','Feedback', 'Settings'];


  return (
    <aside
      className={`fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-100 shadow transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <nav className="p-4 space-y-3">
        {links.map((link) => (
          <button
            key={link}
            onClick={() => setCurrentView(link)}
            className={`block text-left text-[#191919] w-full px-2 py-1 rounded hover:bg-gray-200 ${
              currentView === link ? 'bg-gray-300 font-semibold' : ''
            }`}
          >
            {link}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
