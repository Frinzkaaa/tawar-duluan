import Image from "next/image";
import { Star, Users, Gauge, ArrowRight, Timer, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function FeaturedCars() {
  const featured = [
    {
      id: "1",
      merk: "Toyota",
      tipe: "Yaris 1.5 S",
      rating: "4.8",
      passengers: "5",
      transmission: "Matic",
      price: "175.000.000",
      image: "/images/5.png",
      tag: "Best Seller"
    },
    {
      id: "2",
      merk: "Toyota",
      tipe: "Yaris 1.5 S",
      rating: "4.9",
      passengers: "5",
      transmission: "Matic",
      price: "185.000.000",
      image: "/images/8.png",
      tag: "Limited"
    }
  ];

  return (
    <section className="bg-[#0138C9] py-16 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-2.5 py-1 text-[#D8FF4B] rounded-full text-[9px] font-black uppercase tracking-widest mb-3 border border-white/10">
              <Star className="w-2.5 h-2.5 fill-current" />
              Handpicked Selection
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-1">
              Lelang Mobil <span className="text-[#D8FF4B]">Pilihan</span>
            </h2>
            <p className="text-blue-100/70 font-medium max-w-sm text-xs md:text-sm">
              Unit terbaik dengan inspeksi ketat dan harga kompetitif.
            </p>
          </div>

          <Link href="/jelajahi" className="flex items-center gap-2 text-[#D8FF4B] font-black uppercase text-[9px] tracking-widest group bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-[#D8FF4B] hover:text-[#0138C9] transition-all">
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {featured.map((car) => (
            <div key={car.id} className="group relative bg-white rounded-2xl p-6 shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col md:flex-row gap-6 overflow-hidden items-center">
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-[#0138C9] text-[#D8FF4B] px-4 py-1.5 rounded-bl-2xl font-black text-[9px] uppercase tracking-widest z-20">
                {car.tag}
              </div>

              {/* Left Side: Info */}
              <div className="flex-1 order-2 md:order-1 text-left">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{car.merk}</span>
                  <div className="flex items-center gap-1 bg-yellow-400/10 px-1.5 py-0.5 rounded text-[8px] font-black text-yellow-700">
                    <Star className="w-2 h-2 fill-current" />
                    {car.rating}
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 tracking-tighter mb-3">{car.tipe}</h3>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <Users size={14} />
                    </div>
                    <span className="text-[10px] font-bold">{car.passengers} Seats</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <Gauge size={14} />
                    </div>
                    <span className="text-[10px] font-bold">{car.transmission}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Starting Bid</p>
                  <p className="text-lg font-black text-[#0138C9]">Rp {car.price}</p>
                </div>
              </div>

              {/* Right Side: Image */}
              <div className="relative w-full md:w-1/2 order-1 md:order-2">
                <div className="absolute inset-0 bg-blue-50 rounded-full blur-2xl opacity-40 -z-10 group-hover:scale-125 transition-transform duration-700" />
                <Image
                  src={car.image}
                  alt={car.tipe}
                  width={280}
                  height={160}
                  className="w-full h-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
