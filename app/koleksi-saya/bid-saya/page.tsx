"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface Bid {
  id: string;
  bidAmount: number;
  status: string;
  createdAt: string;
  produk: {
    id: string;
    nama_barang: string;
    harga_awal: number;
    tanggal: string;
  };
}

export default function MyBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const res = await fetch('/api/bids');
      if (res.ok) {
        const data = await res.json();
        setBids(data);
      } else if (res.status === 401) {
        // User not authenticated, redirect to login
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
    setLoading(false);
  };
  return (
    <>
     <Navbar />

    <div className="w-full max-w-6xl mx-auto px-4 mt-12 pt-20 pb-12">
      <div className="bg-gradient-to-r from-[#0138C9] to-[#0056b3] text-white p-6 rounded-2xl shadow-2xl mb-8">
        <h1 className="text-4xl font-extrabold mb-2 flex items-center">
          💸 Bid Saya (My Bids)
        </h1>
        <p className="text-lg opacity-90">Kelola tawaran Anda dengan mudah</p>
      </div>

      {/* Header table */}
      <div className="hidden md:grid md:grid-cols-12 text-sm font-bold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-t-2xl shadow-lg border-b-2 border-gray-300">
        <div className="col-span-3">Detail Mobil</div>
        <div className="col-span-2 text-center">Bid Tertinggi Saat Ini</div>
        <div className="col-span-2 text-center">Bid Saya</div>
        <div className="col-span-3 text-center">Status & Sisa Waktu</div>
        <div className="col-span-2 text-right">Aksi</div>
      </div>

      <div className="space-y-6">

        {/* Card 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-105 border-l-8 border-green-500">
          <div className="col-span-3 flex items-center gap-4">
            <Image src="/images/products/car1.jpg" alt="Toyota Avanza" width={80} height={60} className="rounded-xl object-cover shadow-md" />
            <div>
              <h3 className="text-lg font-bold text-[#0138C9]">Toyota Avanza 2020</h3>
              <p className="text-sm text-gray-600 font-medium">Automatic</p>
            </div>
          </div>

          <div className="col-span-2 text-center">
            <p className="text-lg font-bold text-green-600">Rp 152.000.000</p>
          </div>

          <div className="col-span-2 text-center">
            <p className="text-lg font-bold text-[#0138C9]">Rp 152.000.000</p>
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full font-medium">Anda yang terakhir</span>
          </div>

          <div className="col-span-3 text-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-4 rounded-full text-sm inline-block animate-pulse shadow-md">
              Sisa 01:23:45
            </div>
            <p className="text-xs text-green-700 mt-2 font-semibold">Anda Memimpin! (Tertinggi)</p>
          </div>

          <div className="col-span-2 flex justify-end">
            <button className="bg-gray-300 text-gray-600 font-bold py-3 px-4 text-sm rounded-xl cursor-not-allowed shadow-md">
              Bid Tdk Perlu
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-105 border-l-8 border-red-500">
          <div className="col-span-3 flex items-center gap-4">
            <Image src="/images/products/car2.jpg" alt="Honda Brio" width={80} height={60} className="rounded-xl object-cover shadow-md" />
            <div>
              <h3 className="text-lg font-bold text-[#0138C9]">Honda Brio 2021</h3>
              <p className="text-sm text-gray-600 font-medium">Manual</p>
            </div>
          </div>

          <div className="col-span-2 text-center">
            <p className="text-lg font-bold text-red-600">Rp 125.000.000</p>
          </div>

          <div className="col-span-2 text-center">
            <p className="text-lg font-bold text-gray-600">Rp 120.000.000</p>
            <span className="text-xs text-red-600 font-bold bg-red-100 px-2 py-1 rounded-full">Anda Dikalahkan!</span>
          </div>

          <div className="col-span-3 text-center">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-2 px-4 rounded-full text-sm inline-block animate-pulse shadow-md">
              Sisa 00:45:12
            </div>
            <p className="text-xs text-red-700 mt-2 font-semibold">Tawaran Baru Dibutuhkan!</p>
          </div>

          <div className="col-span-2 flex justify-end">
            <button className="bg-gradient-to-r from-[#ABD905] to-[#8BC34A] text-[#0138C9] font-bold py-3 px-4 text-sm rounded-xl hover:from-[#8BC34A] hover:to-[#ABD905] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Naikkan Bid
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-105 border-l-8 border-green-700">
          <div className="col-span-3 flex items-center gap-4">
            <Image src="/images/products/car3.jpg" alt="Suzuki Ertiga" width={80} height={60} className="rounded-xl object-cover shadow-md" />
            <div>
              <h3 className="text-lg font-bold text-green-800">Suzuki Ertiga 2019</h3>
              <p className="text-sm text-gray-600 font-medium">Automatic</p>
            </div>
          </div>

          <div className="col-span-2 text-center">
            <p className="text-lg font-bold text-green-700">Rp 115.000.000</p>
          </div>

          <div className="col-span-2 text-center">
            <p className="text-lg font-bold text-green-700">Rp 115.000.000</p>
            <span className="text-xs text-green-700 font-bold bg-green-200 px-2 py-1 rounded-full">Bid Final Anda</span>
          </div>

          <div className="col-span-3 text-center">
            <div className="bg-gradient-to-r from-green-700 to-green-800 text-white font-bold py-2 px-4 rounded-full text-sm inline-block shadow-md">
              SELESAI
            </div>
            <p className="text-xs text-green-700 mt-2 font-bold">🎉 Anda Memenangkan Lelang!</p>
          </div>

          <div className="col-span-2 flex justify-end">
            <button className="bg-gradient-to-r from-[#0138C9] to-[#0056b3] text-white font-bold py-3 px-4 text-sm rounded-xl hover:from-[#0056b3] hover:to-[#0138C9] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Lanjutkan ke Pembayaran
            </button>
          </div>
        </div>

      </div>
    </div>

    <Footer />
    </>
  );
}
