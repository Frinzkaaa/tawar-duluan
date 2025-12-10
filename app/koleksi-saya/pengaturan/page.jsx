"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("umum");

  const tabs = [
    { id: "umum", label: "⚙️ Umum & Preferensi", danger: false, icon: "⚙️" },
    { id: "notifikasi", label: "🔔 Aturan Notifikasi", danger: false, icon: "🔔" },
    { id: "keamanan", label: "🔒 Keamanan Lanjutan", danger: false, icon: "🔒" },
    { id: "pembayaran", label: "💳 Akun Pembayaran", danger: false, icon: "💳" },
    { id: "tindakan", label: "🚨 Kelola Akun", danger: true, icon: "🚨" },
  ];

  return (
    <>
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 mt-12 pt-20 pb-12">
        <div className="bg-gradient-to-r from-[#0138C9] to-[#0056b3] text-white p-6 rounded-2xl shadow-2xl mb-8">
          <h1 className="text-4xl font-extrabold mb-2 flex items-center">
            ⚙️ Pengaturan Aplikasi
          </h1>
          <p className="text-lg opacity-90">Sesuaikan pengalaman Anda dengan aplikasi kami</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT MENU */}
          <div className="md:w-1/4">
            <nav className="bg-gradient-to-b from-white to-gray-50 p-6 rounded-2xl shadow-2xl space-y-4 backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left flex items-center p-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#0138C9] to-[#0056b3] text-white font-bold shadow-xl"
                      : tab.danger
                      ? "text-red-600 font-semibold hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100"
                      : "text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200"
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label.replace(tab.icon + " ", "")}
                </button>
              ))}
            </nav>
          </div>

          {/* CONTENT */}
          <div className="md:w-3/4 bg-gradient-to-b from-white to-gray-50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
            {activeTab === "umum" && (
              <div>
                <h2 className="text-3xl font-bold text-[#0138C9] mb-8 flex items-center">
                  ⚙️ Preferensi Umum
                </h2>
                <form className="space-y-8">
                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-800">
                      🌐 Bahasa Antarmuka
                    </label>
                    <select className="mt-2 block w-full md:w-1/2 border-2 border-gray-300 rounded-xl shadow-sm p-4 focus:border-[#0138C9] focus:ring-2 focus:ring-[#0138C9] transition-all duration-300">
                      <option>🇮🇩 Bahasa Indonesia (ID)</option>
                      <option>🇺🇸 English (US)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-800">
                      🕒 Zona Waktu Lokal
                    </label>
                    <select className="mt-2 block w-full md:w-1/2 border-2 border-gray-300 rounded-xl shadow-sm p-4 focus:border-[#0138C9] focus:ring-2 focus:ring-[#0138C9] transition-all duration-300">
                      <option>🕒 WIB (Waktu Indonesia Barat)</option>
                      <option>🕒 WITA (Waktu Indonesia Tengah)</option>
                      <option>🕒 WIT (Waktu Indonesia Timur)</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                      Penting untuk akurasi waktu lelang.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-800">
                      📏 Satuan Jarak Tempuh
                    </label>
                    <select className="mt-2 block w-full md:w-1/2 border-2 border-gray-300 rounded-xl shadow-sm p-4 focus:border-[#0138C9] focus:ring-2 focus:ring-[#0138C9] transition-all duration-300">
                      <option>📏 Kilometer (KM)</option>
                      <option>📏 Miles</option>
                    </select>
                  </div>

                  <button className="bg-gradient-to-r from-[#0138C9] to-[#0056b3] text-white font-bold py-4 px-8 rounded-xl hover:from-[#0056b3] hover:to-[#0138C9] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    💾 Simpan Pengaturan
                  </button>
                </form>
              </div>
            )}

            {activeTab === "notifikasi" && (
              <div>
                <h2 className="text-3xl font-bold text-[#0138C9] mb-8 flex items-center">
                  ⚡ Aturan Notifikasi
                </h2>
                <p className="text-lg text-gray-600">Konfigurasi notifikasi akan segera hadir.</p>
              </div>
            )}

            {activeTab === "keamanan" && (
              <div>
                <h2 className="text-3xl font-bold text-[#0138C9] mb-8 flex items-center">
                  🔐 Keamanan Lanjutan
                </h2>
                <p className="text-lg text-gray-600">Fitur keamanan lanjutan akan segera hadir.</p>
              </div>
            )}

            {activeTab === "pembayaran" && (
              <div>
                <h2 className="text-3xl font-bold text-[#0138C9] mb-8 flex items-center">
                  💳 Pembayaran & Deposit
                </h2>
                <p className="text-lg text-gray-600">Pengaturan pembayaran akan segera hadir.</p>
              </div>
            )}

            {activeTab === "tindakan" && (
              <div>
                <h2 className="text-3xl font-bold text-red-600 mb-8 flex items-center">
                  ⚠️ Tindakan Berisiko Tinggi
                </h2>
                <p className="text-lg text-gray-600">Pengelolaan akun akan segera hadir.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
