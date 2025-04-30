'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function FloatingFood() {
  return (
    <mesh rotation={[0, 0, 0]}>
      <torusGeometry args={[2, 0.5, 16, 100]} />
      <meshStandardMaterial color="#f97316" />
    </mesh>
  );
}

export default function FoodHero() {
  return (
    <section className="relative w-full h-screen flex md:flex-row flex-col items-center dm justify-center overflow-hidden bg-yellow-50">
      
      {/* 3D Background */}
      <Canvas className="absolute inset-0 z-0">
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
          <FloatingFood />
        </Suspense>
      </Canvas>

      {/* Foreground Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-orange-700 mb-6 animate-fade-in">
          Welcome to Tasty Bites 🍔
        </h1>
        <p className="text-lg text-orange-500 max-w-md mb-8 animate-fade-in delay-200">
          Fresh burgers, pizzas, and more! Delivered hot and delicious to your doorstep.
        </p>
        <Link href="/menu" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold text-lg animate-bounce">
          View Menu
        </Link>

        {/* Food Image */}
        <div className="mt-10 w-40 h-40 md:w-60 md:h-60 rounded-full overflow-hidden shadow-2xl border-4 border-white animate-float">
          <Image 
            src="https://placehold.co/300x300" 
            alt="Food" 
            width={300} 
            height={300} 
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
