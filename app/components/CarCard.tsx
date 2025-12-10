// components/CarCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Car } from '../type';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="bg-[#DDDDDD]/50 rounded-3xl p-6 shadow-lg flex flex-col justify-between w-72 max-w-[350px] h-full mx-auto">
      {/* Thumbnail */}
      {car.image_url && (
        <Link href={`/cars/${car.slug}`} className="block mb-5">
          <Image
            src={car.image_url}
            alt={car.model}
            width={350}
            height={176} // h-44
            className="rounded-2xl object-cover shadow-sm hover:scale-[1.02] transition duration-300"
          />
        </Link>
      )}

      <div className="space-y-4 flex-grow">
        <div>
          <div className="text-base font-light text-[#222] leading-none tracking-wide">{car.brand}</div>
          <div className="text-xl font-semibold text-[#222] leading-tight">{car.model}</div>
        </div>

        <div className="space-y-3 text-[#222] text-sm">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 11h10a2 2 0 0 1 2 2v5h-2v-4H7v4H5v-5a2 2 0 0 1 2-2Zm5-2a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z"/>
            </svg>
            <span className="truncate">{car.seat} Penumpang</span>
          </div>

          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2h2v2h6V2h2v2h1a2 2 0 0 1 2 2v2H4V6a2 2 0 0 1 2-2h1Zm13 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8h16Z"/>
            </svg>
            <span className="truncate capitalize">{car.transmission}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-300 flex justify-between items-center gap-3">
        <div className="text-lg font-bold text-[#222] whitespace-nowrap">
          Rp {car.price.toLocaleString('id-ID')}
        </div>

        <Link href={`/cars/${car.slug}`} className="bg-[#D8FF4B] text-[#0138C9] font-bold px-3 py-2 rounded-full text-sm hover:bg-[#c0e63e] transition whitespace-nowrap">
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
