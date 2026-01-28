
"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
  Heart,
  Trash2,
  ChevronRight,
  Clock,
  AlertCircle,
  Loader2,
  CreditCard,
  ExternalLink,
  Ban
} from "lucide-react";
import Link from "next/link";

interface WatchlistCar {
  id: string;
  produkId: string;
  img?: string;
  name: string;
  spec: string;
  price: number;
  category: string;
  isSold: boolean;
  endTime?: number;
}

export default function WatchlistPage() {
  const [cars, setCars] = useState<WatchlistCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist');
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((item: any) => ({
          id: item.id, // Watchlist entry ID (now using directly the product info as the API flattens it)
          produkId: item.id,
          img: item.image_url,
          name: item.nama_barang,
          spec: `${item.merk_mobil || ''} ${item.tipe_mobil || ''} ${item.tahun || ''}`.trim(),
          price: item.harga_awal,
          category: item.kategori,
          isSold: item.isSold,
          // We set a simulated end time for demo if not present, or keep undefined
          endTime: item.isSold ? undefined : Date.now() + (Math.random() * 86400000 * 2)
        }));
        setCars(mapped);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
    setLoading(false);
  };

  const handleRemove = async (produkId: string) => {
    setIsDeleting(produkId);
    try {
      const res = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produkId })
      });

      if (res.ok) {
        setCars(prev => prev.filter(c => c.produkId !== produkId));
      }
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
    setIsDeleting(null);
  };

  return (
    <>
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 mt-12 pt-20 pb-24">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-indigo-950 text-white p-6 md:p-10 rounded-[32px] shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Heart className="w-48 h-48 fill-white" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-white/20">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              Wishlist Terpilih
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter">Mobil Impian Anda</h1>
            <p className="text-blue-100 text-base max-w-xl font-medium opacity-80">
              Simpan unit yang Anda minati dan pantau pergerakan harganya.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <p className="text-gray-500 font-black text-xl">Menyiapkan koleksi Anda...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[48px] shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Ban className="w-16 h-16 text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Belum Ada Mobil Favorit</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-10 text-lg font-medium">
              Mulai jelajahi ribuan unit mobil berkualitas dan klik ikon hati untuk menyimpannya di sini.
            </p>
            <Link
              href="/jelajahi"
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-black text-white font-black py-5 px-12 rounded-[24px] shadow-2xl shadow-blue-200 transition-all hover:scale-105 active:scale-95"
            >
              Jelajahi Sekarang
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cars.map((car) => (
              <div
                key={car.id}
                className={`group relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-500 ${car.isSold ? 'opacity-75 grayscale-[0.5]' : ''}`}
              >
                {/* Image Container */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={car.img || '/images/cars/placeholder.jpg'}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Status Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    {car.isSold ? (
                      <span className="bg-gray-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Ban className="w-2.5 h-2.5 text-red-500" />
                        Terjual
                      </span>
                    ) : (
                      <span className="bg-blue-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-blue-900/40">
                        <Clock className="w-2.5 h-2.5" />
                        Aktif
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(car.produkId)}
                    disabled={isDeleting === car.produkId}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300 shadow-lg"
                  >
                    {isDeleting === car.produkId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-0.5">{car.category}</p>
                    <h3 className="text-lg font-black text-gray-900 truncate tracking-tight">{car.name}</h3>
                    <p className="text-gray-400 font-bold text-[10px] mt-0.5">{car.spec}</p>
                  </div>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Harga Awal</p>
                      <p className={`text-lg font-black ${car.isSold ? 'text-gray-400 line-through' : 'text-blue-600 tracking-tighter'}`}>
                        Rp {car.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={car.isSold ? '#' : `/jelajahi/${car.produkId}`}
                      className={`flex items-center justify-center gap-1.5 font-black py-2.5 px-2 rounded-lg text-[10px] transition-all ${car.isSold
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-900 text-white hover:bg-black shadow-md shadow-gray-200'
                        }`}
                    >
                      {car.isSold ? 'Sold' : 'Detail'}
                      {!car.isSold && <ExternalLink className="w-3 h-3" />}
                    </Link>

                    {!car.isSold && (
                      <button
                        className="bg-blue-50 text-blue-600 font-black py-2.5 px-2 rounded-lg text-[10px] hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
                      >
                        <CreditCard className="w-3 h-3" />
                        Bid
                      </button>
                    )}
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        {cars.length > 0 && (
          <div className="mt-16 p-8 bg-amber-50 rounded-[32px] border border-amber-100 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h4 className="text-lg font-black text-amber-900 mb-1">Informasi Penting</h4>
              <p className="text-amber-700/80 font-medium text-sm leading-relaxed">
                Daftar mobil di sini bersifat sementara. Unit dapat ditarik dari pelelangan sewaktu-waktu oleh pihak penyelenggara atau statusnya berubah menjadi terjual dengan cepat. Pastikan Anda menyalakan notifikasi untuk pembaruan status unit favorit Anda.
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
