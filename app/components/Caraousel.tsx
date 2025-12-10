// components/Caraousel.tsx

"use client";

import { useRef } from 'react';
import { Car } from '../type';

interface CarouselProps {
  cars: Car[];
}

// Modern card component for carousel sections
function ModernCarCard({ car }: { car: Car }) {
  return (
    <div className="group relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 border border-white/30 hover:border-white/50 hover:scale-[1.02] flex flex-col h-full overflow-hidden cursor-pointer min-w-[280px]">
      {/* Image section */}
      {car.image_url && (
        <div className="relative mb-3 overflow-hidden rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
          <img
            src={car.image_url}
            alt={car.model}
            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-0.5 rounded-md text-xs font-bold shadow-sm">
              Lelang
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 flex-grow">
        {/* Title */}
        <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {car.brand} {car.model}
        </h4>

        {/* Brand and specs */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium text-blue-600">{car.brand}</span>
          <span>{car.seat} Seat</span>
        </div>

        {/* Transmission */}
        <div className="text-xs text-gray-500 capitalize">
          {car.transmission}
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm font-bold text-gray-900">Rp {car.price.toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
}

export default function Carousel({ cars }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'next' | 'prev') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth / 3;
      containerRef.current.scrollLeft += direction === 'next' ? scrollAmount : -scrollAmount;
    }
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex flex-nowrap gap-5 transition-transform duration-500 ease-in-out overflow-x-scroll scrollbar-hide"
        >
          {cars.map((car) => (
            <ModernCarCard key={car.id} car={car} />
          ))}
        </div>
      </div>

      <button
        onClick={() => scroll('prev')}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 md:p-3 rounded-full shadow-xl z-20 opacity-75 hover:opacity-100 transition duration-300 ml-1 md:ml-4"
      >
        &#8249;
      </button>

      <button
        onClick={() => scroll('next')}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 md:p-3 rounded-full shadow-xl z-20 opacity-75 hover:opacity-100 transition duration-300 mr-1 md:mr-4"
      >
        &#8250;
      </button>
    </div>
  );
}
