import React from 'react';
import Image from 'next/image';

const ServicesContainer = () => {
  const services = [
    { name: 'Service 1', description: 'Description for service 1', imageUrl: 'https://placehold.co/300x300' },
    { name: 'Service 2', description: 'Description for service 2', imageUrl: 'https://placehold.co/300x300' },
    { name: 'Service 3', description: 'Description for service 3', imageUrl: 'https://placehold.co/300x300' },
  ];

  return (
    <section className="py-16 bg-[#FEFCE8]">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-12">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              style={{ height: '450px' }}
            >
              {/* Service Image */}
              <div className="absolute inset-0 z-10 rounded-t-lg overflow-hidden">
                <Image 
                  src={service.imageUrl}
                  alt={service.name}
                  width={500}
                  height={500}
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>

              {/* Service Details */}
              <div className="relative z-20 mt-6">
                <h3 className="text-2xl font-bold text-gray-800">{service.name}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesContainer;
