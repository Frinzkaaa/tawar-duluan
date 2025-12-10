"use client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function BantuanPage() {
  return (
    <>
      <Navbar />

      <div className="w-full max-w-5xl mx-auto px-4 mt-12">
        <h1 className="text-3xl font-extrabold text-[#0138C9] mb-4">
          📚 Pusat Bantuan
        </h1>
        <p className="text-gray-600 mb-8">
          Temukan jawaban cepat mengenai lelang, akun, dan transaksi Anda.
        </p>

        {/* Search Box */}
        <div className="mb-10 p-6 bg-blue-50 rounded-xl shadow-lg border-l-4 border-[#ABD905]">
          <h2 className="text-xl font-bold text-[#0138C9] mb-3">Cari Bantuan</h2>
          <div className="flex">
            <input
              type="text"
              placeholder="Ketik kata kunci (misal: 'outbid', 'deposit', 'verifikasi')"
              className="flex-grow border border-gray-300 rounded-l-lg shadow-sm p-3 focus:ring-[#ABD905] focus:border-[#ABD905]"
            />
            <button className="bg-[#0138C9] text-white font-bold py-3 px-6 rounded-r-lg hover:bg-blue-700 transition duration-150">
              Cari
            </button>
          </div>
        </div>

        {/* FEATURE BOXES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/bantuan/carakerja"
            className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 border-t-4 border-[#0138C9]"
          >
            <h3 className="text-xl font-bold text-[#0138C9] group-hover:underline">
              Cara Kerja Lelang 💡
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Pelajari panduan langkah demi langkah tentang proses bidding,
              deposit, dan kemenangan lelang.
            </p>
            <span className="text-[#ABD905] font-semibold text-sm mt-3 inline-block">
              Lihat Panduan →
            </span>
          </Link>

          <Link
            href="/bantuan/faq"
            className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 border-t-4 border-[#ABD905]"
          >
            <h3 className="text-xl font-bold text-[#0138C9] group-hover:underline">
              FAQ (Pertanyaan Umum) ❓
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Temukan jawaban instan untuk pertanyaan yang sering diajukan oleh
              pengguna lain.
            </p>
            <span className="text-[#ABD905] font-semibold text-sm mt-3 inline-block">
              Lihat Semua Jawaban →
            </span>
          </Link>

          <Link
            href="/bantuan/kontak"
            className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 border-t-4 border-gray-400"
          >
            <h3 className="text-xl font-bold text-[#0138C9] group-hover:underline">
              Hubungi Kami 📞
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Perlu bantuan pribadi? Kirimkan tiket dukungan atau hubungi tim
              kami.
            </p>
            <span className="text-[#ABD905] font-semibold text-sm mt-3 inline-block">
              Mulai Obrolan →
            </span>
          </Link>
        </div>

        <hr className="my-10 border-gray-200" />

        {/* POPULAR CATEGORIES */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#0138C9] mb-5">
            Kategori Populer
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a className="text-gray-700 hover:text-[#ABD905] font-medium text-sm" href="#">
              Akun & Profil
            </a>
            <a className="text-gray-700 hover:text-[#ABD905] font-medium text-sm" href="#">
              Deposit & Pembayaran
            </a>
            <a className="text-gray-700 hover:text-[#ABD905] font-medium text-sm" href="#">
              Verifikasi Dokumen
            </a>
            <a className="text-gray-700 hover:text-[#ABD905] font-medium text-sm" href="#">
              Masalah Teknis
            </a>
            <a className="text-gray-700 hover:text-[#ABD905] font-medium text-sm" href="#">
              Pengiriman Mobil
            </a>
            <a className="text-gray-700 hover:text-[#ABD905] font-medium text-sm" href="#">
              Aturan Bidding
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
