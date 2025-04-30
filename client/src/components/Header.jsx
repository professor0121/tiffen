'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

function Food3D() {
  return (
    <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
      <torusGeometry args={[0.8, 0.3, 16, 100]} />
      <meshStandardMaterial color="#fb923c" />
    </mesh>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="flex flex-wrap items-center justify-between p-4 max-w-7xl mx-auto">
        
        {/* Logo with 3D Object */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="relative w-10 h-10">
            <Canvas camera={{ position: [2, 2, 2] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} />
              <Suspense fallback={null}>
                <OrbitControls enableZoom={false} enableRotate={true} autoRotate autoRotateSpeed={2} />
                <Food3D />
              </Suspense>
            </Canvas>
          </div>
          <Link href="/" className="text-2xl font-bold text-orange-600">
            TastyBites
          </Link>
        </motion.div>

        {/* Hamburger */}
        <div className="md:hidden">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-orange-600 focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu */}
        <nav className={`w-full md:w-auto ${menuOpen ? 'block' : 'hidden'} md:flex md:items-center mt-4 md:mt-0`}>
          <ul className="flex flex-col md:flex-row gap-6 text-center md:text-left">
            <li>
              <Link href="/" className="text-orange-600 hover:text-orange-800 font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link href="/menu" className="text-orange-600 hover:text-orange-800 font-medium">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-orange-600 hover:text-orange-800 font-medium">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-orange-600 hover:text-orange-800 font-medium">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/order" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold">
                Order Now
              </Link>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}
