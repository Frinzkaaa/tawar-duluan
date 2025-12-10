"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { User, MapPin, Lock, Bell, Upload, Save, Home, Edit, Trash2, Plus, Key, Mail, Gift } from "lucide-react";

export default function ProfilePage() {
 const [tab, setTab] = useState("info-pribadi");

  return (
    <>
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 mt-12 pt-20 pb-12">
        <div className="bg-gradient-to-r from-[#0138C9] to-[#0056b3] text-white p-6 rounded-2xl shadow-2xl mb-8">
          <h1 className="text-4xl font-extrabold mb-2 flex items-center">
            <User className="w-8 h-8 mr-3" />
            Profil Saya
          </h1>
          <p className="text-lg opacity-90">Kelola informasi dan pengaturan akun Anda</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* NAVIGATION */}
          <div className="md:w-1/4 w-full">
            <nav
              id="profile-nav"
              className="bg-gradient-to-b from-white to-gray-50 p-4 md:p-6 rounded-2xl shadow-2xl space-y-3 overflow-x-auto whitespace-nowrap backdrop-blur-sm"
            >
              <div className="flex md:block space-x-3 md:space-x-0">
                {[
                  { id: "info-pribadi", label: "Informasi Pribadi", icon: <User className="w-5 h-5" /> },
                  { id: "alamat", label: "Alamat Pengiriman", icon: <MapPin className="w-5 h-5" /> },
                  { id: "keamanan", label: "Keamanan Akun", icon: <Lock className="w-5 h-5" /> },
                  { id: "notifikasi", label: "Pengaturan Notifikasi", icon: <Bell className="w-5 h-5" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`inline-flex md:flex items-center p-4 text-sm md:text-base font-semibold rounded-xl transition-all duration-300 flex-shrink-0 md:flex-shrink shadow-md hover:shadow-lg transform hover:scale-105 ${
                      tab === item.id
                        ? "bg-gradient-to-r from-[#0138C9] to-[#0056b3] text-white font-bold shadow-xl"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* CONTENT */}
          <div
            id="profile-content-container"
            className="md:w-3/4 w-full bg-gradient-to-b from-white to-gray-50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm"
          >
            {/* TAB — INFORMASI PRIBADI */}
            {tab === "info-pribadi" && (
              <div>
                <h2 className="text-3xl font-bold text-[#0138C9] mb-8 flex items-center">
                  <User className="w-7 h-7 mr-3" />
                  Informasi Dasar
                </h2>
                <form className="space-y-8">
                  <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-6 sm:space-y-0 pb-6 border-b-2 border-gradient-to-r from-[#ABD905] to-[#8BC34A] bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl shadow-lg">
                    <Image
                      src="/images/user/avatar.jpg"
                      width={100}
                      height={100}
                      alt="Foto Profil"
                      className="rounded-full border-4 border-gradient-to-r from-[#ABD905] to-[#8BC34A] object-cover shadow-xl"
                    />
                    <div>
                      <p className="text-base text-gray-600 font-medium">Ganti Foto Profil Anda</p>
                      <button
                        type="button"
                        className="mt-3 bg-gradient-to-r from-[#ABD905] to-[#8BC34A] text-[#0138C9] text-base font-bold py-2 px-4 rounded-xl hover:from-[#8BC34A] hover:to-[#ABD905] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Unggah Foto
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-800">Nama Lengkap</label>
                    <input type="text" defaultValue="Rudi Hartono" className="mt-2 block w-full border-2 border-gray-300 rounded-xl shadow-sm p-4 focus:border-[#0138C9] focus:ring-2 focus:ring-[#0138C9] transition-all duration-300" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-800">Email</label>
                    <input
                      type="email"
                      defaultValue="rudi.hartono@example.com"
                      disabled
                      className="mt-2 block w-full bg-gray-100 border-2 border-gray-300 rounded-xl shadow-sm p-4 cursor-not-allowed"
                    />
                    <p className="mt-2 text-sm text-gray-500 font-medium">Email digunakan sebagai username utama.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-800">Nomor Telepon</label>
                    <input type="tel" defaultValue="081234567890" className="mt-2 block w-full border-2 border-gray-300 rounded-xl shadow-sm p-4 focus:border-[#0138C9] focus:ring-2 focus:ring-[#0138C9] transition-all duration-300" />
                  </div>

                  <button type="submit" className="bg-gradient-to-r from-[#0138C9] to-[#0056b3] text-white font-bold py-4 px-8 rounded-xl hover:from-[#0056b3] hover:to-[#0138C9] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center">
                    <Save className="w-5 h-5 mr-2" />
                    Simpan Perubahan
                  </button>
                </form>
              </div>
            )}

            {/* TAB — ALAMAT */}
            {tab === "alamat" && (
              <div>
                <h2 className="text-3xl font-bold text-[#0138C9] mb-8 flex items-center">
                  <MapPin className="w-7 h-7 mr-3" />
                  Daftar Alamat
                </h2>
                <div className="border-2 border-gradient-to-r from-[#ABD905] to-[#8BC34A] p-6 rounded-xl bg-gradient-to-r from-green-50 to-green-100 shadow-xl mb-6">
                  <h3 className="font-bold text-xl text-green-800 flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    Alamat Utama
                  </h3>
                  <p className="text-gray-700 mt-3 break-words text-base font-medium">
                    Jalan Merdeka No. 45, Kel. Sukamaju, Kec. Cilodong, Depok, Jawa Barat 16415.
                  </p>
                  <p className="text-sm text-gray-600 mt-2 font-medium">Penerima: Rudi Hartono (0812xxxxxx)</p>
                  <div className="mt-4 space-x-3">
                    <button className="text-[#0138C9] text-base font-semibold hover:text-blue-700 transition-all duration-300 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 flex items-center">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button className="text-red-500 text-base font-semibold hover:text-red-700 transition-all duration-300 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 flex items-center">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus
                    </button>
                  </div>
                </div>

                <button className="bg-gradient-to-r from-[#ABD905] to-[#8BC34A] text-[#0138C9] font-bold py-4 px-6 rounded-xl hover:from-[#8BC34A] hover:to-[#ABD905] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Tambah Alamat Baru
                </button>
              </div>
            )}

            {/* TAB — KEAMANAN */}
            {tab === "keamanan" && (
              <div>
                <h2 className="text-3xl font-bold text-[#0138C9] mb-8 flex items-center">
                  <Lock className="w-7 h-7 mr-3" />
                  Ganti Kata Sandi
                </h2>
                <form className="space-y-8 max-w-lg">
                  <input type="password" placeholder="Kata Sandi Lama" className="w-full border-2 border-gray-300 rounded-xl shadow-sm p-4 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300" />
                  <input type="password" placeholder="Kata Sandi Baru" className="w-full border-2 border-gray-300 rounded-xl shadow-sm p-4 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300" />
                  <input type="password" placeholder="Konfirmasi Kata Sandi Baru" className="w-full border-2 border-gray-300 rounded-xl shadow-sm p-4 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300" />

                  <button type="submit" className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 px-8 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    Ubah Kata Sandi
                  </button>
                </form>
              </div>
            )}

            {/* TAB — NOTIFIKASI */}
            {tab === "notifikasi" && (
              <div>
                <h2 className="text-3xl font-bold text-[#0138C9] mb-8 flex items-center">
                  <Bell className="w-7 h-7 mr-3" />
                  Pengaturan Notifikasi
                </h2>

                {/* ITEM */}
                <div className="space-y-6">
                  {/* SWITCH 1 */}
                  <div className="flex justify-between items-center border-b-2 pb-4 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl shadow-md">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 flex items-center">
                        <Mail className="w-5 h-5 mr-2" />
                        Email Notifikasi Lelang
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 font-medium">Dapatkan peringatan ketika Anda dikalahkan (Outbid).</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-6 h-6 text-[#0138C9] bg-gray-100 border-gray-300 rounded focus:ring-[#0138C9] focus:ring-2" />
                  </div>
                  {/* SWITCH 2 */}
                  <div className="flex justify-between items-center border-b-2 pb-4 bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl shadow-md">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 flex items-center">
                        <Gift className="w-5 h-5 mr-2" />
                        Email Promo & Diskon
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 font-medium">Dapatkan informasi mobil terbaru dan harga khusus.</p>
                    </div>
                    <input type="checkbox" className="w-6 h-6 text-[#0138C9] bg-gray-100 border-gray-300 rounded focus:ring-[#0138C9] focus:ring-2" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
