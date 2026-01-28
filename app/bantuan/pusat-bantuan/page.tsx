
"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import {
  Search,
  BookOpen,
  HelpCircle,
  MessageSquare,
  User,
  CreditCard,
  ShieldCheck,
  Truck,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Inbox
} from "lucide-react";

export default function BantuanPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { title: "Akun & Profil", icon: <User className="w-5 h-5" />, color: "blue" },
    { title: "Deposit & Bayar", icon: <CreditCard className="w-5 h-5" />, color: "emerald" },
    { title: "Verifikasi KYC", icon: <ShieldCheck className="w-5 h-5" />, color: "amber" },
    { title: "Cara Bid", icon: <TrendingUp className="w-5 h-5" />, color: "purple" },
    { title: "Logistik", icon: <Truck className="w-5 h-5" />, color: "orange" },
    { title: "Lainnya", icon: <HelpCircle className="w-5 h-5" />, color: "gray" },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-[#0138C9] pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <HelpCircle className="w-96 h-96 absolute -top-20 -left-20 text-white" />
          <Inbox className="w-96 h-96 absolute -bottom-20 -right-20 text-white" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
            Ada yang bisa kami bantu?
          </h1>
          <p className="text-blue-100 text-base md:text-lg mb-8 max-w-2xl mx-auto font-medium opacity-90">
            Temukan panduan lengkap, FAQ, atau hubungi tim dukungan kami.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kendala Anda (misal: 'cara deposit')"
              className="w-full pl-14 pr-8 py-4 rounded-2xl text-base font-bold shadow-2xl focus:ring-4 focus:ring-blue-400/20 outline-none transition-all placeholder:text-gray-400"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-black text-white px-6 py-2.5 rounded-xl font-black transition-all text-sm">
              Cari
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 -mt-12 pb-24 relative z-20">

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            href="/bantuan/cara-kerja"
            className="group p-6 bg-white rounded-2xl shadow-xl hover:translate-y-[-4px] transition-all duration-500 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-blue-900">
              <BookOpen className="w-16 h-16" />
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-6 h-6 font-black" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Panduan Lelang</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-5">
              Mulai dari pendaftaran hingga memenangkan unit pertama Anda.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
              Baca Panduan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/bantuan/faq"
            className="group p-6 bg-white rounded-2xl shadow-xl hover:translate-y-[-4px] transition-all duration-500 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-amber-900">
              <HelpCircle className="w-16 h-16" />
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-5 group-hover:scale-110 transition-transform duration-300">
              <HelpCircle className="w-6 h-6 font-black" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Jawaban Cepat</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-5">
              Kumpulan pertanyaan yang paling sering diajukan.
            </p>
            <div className="flex items-center gap-2 text-amber-600 font-black text-xs uppercase tracking-widest">
              Lihat FAQ
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <div
            onClick={() => {
              const phone = SITE_CONFIG?.adminWhatsApp || "";
              const text = encodeURIComponent("Halo Admin Tawar Duluan, saya butuh bantuan.");
              window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
            }}
            className="group p-6 bg-white rounded-2xl shadow-xl hover:translate-y-[-4px] transition-all duration-500 border border-gray-100 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-emerald-900">
              <MessageSquare className="w-16 h-16" />
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-6 h-6 font-black" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Hubungi Kami</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-5">
              Butuh bantuan mendesak? Chat langsung dengan tim support via WhatsApp.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
              Chat Sekarang
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* CATEGORIES GRID */}
        <div className="mt-16">
          <h2 className="text-2xl font-black text-gray-900 mb-1">Telusuri Berdasarkan Kategori</h2>
          <p className="text-gray-500 mb-8 font-medium text-sm">Pilih topik spesifik untuk solusi cepat.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="group p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer text-center">
                <div className={`w-10 h-10 rounded-xl bg-${cat.color}-50 text-${cat.color}-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h4 className="text-xs font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{cat.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* POPULAR ARTICLES */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-black text-gray-900 mb-8 border-l-8 border-blue-600 pl-4">Topik Terpopuler</h3>
            <div className="space-y-4">
              {[
                "Bagaimana cara verifikasi KTP yang gagal terus?",
                "Apakah saldo deposit bisa dicairkan kapan saja?",
                "Ketentuan denda jika membatalkan kemenangan lelang",
                "Estimasi waktu pengiriman mobil antar pulau",
              ].map((text, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
                  <span className="font-bold text-gray-700">{text}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-[48px] p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <ShieldCheck className="w-40 h-40" />
            </div>
            <h3 className="text-3xl font-black mb-4">Lelang Aman & Transparan</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Tawar Duluan menjamin keamanan data pribadi dan validitas unit lelang. Setiap mobil telah melewati inspeksi teknis di 120 titik pengecekan.
            </p>
            <button className="bg-white text-gray-900 font-black px-8 py-4 rounded-2xl hover:bg-blue-100 transition shadow-xl">
              Baca Kebijakan Keamanan
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
