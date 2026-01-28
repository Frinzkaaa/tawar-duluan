
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { User, MapPin, Lock, Bell, Upload, Save, Home, Edit, Trash2, Plus, Key, Mail, Gift, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [tab, setTab] = useState("info-pribadi");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: ""
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUserData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          role: data.role || ""
        });
      }
    } catch (err) {
      console.error("Gagal mengambil profil:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          address: userData.address
        })
      });
      if (res.ok) {
        alert("Profil berhasil diperbarui!");
        // Refresh to get latest
        fetchProfile();
      } else {
        const err = await res.json();
        alert("Gagal: " + err.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Konfirmasi password tidak cocok");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: passwordData.newPassword
        })
      });
      if (res.ok) {
        alert("Password berhasil diubah!");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const err = await res.json();
        alert("Gagal: " + err.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

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
              className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-100 flex md:flex-col gap-2 overflow-x-auto"
            >
              {[
                { id: "info-pribadi", label: "Info Pribadi", icon: <User className="w-5 h-5" /> },
                { id: "alamat", label: "Alamat", icon: <MapPin className="w-5 h-5" /> },
                { id: "keamanan", label: "Keamanan", icon: <Lock className="w-5 h-5" /> },
                { id: "notifikasi", label: "Notifikasi", icon: <Bell className="w-5 h-5" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-3 p-4 text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap ${tab === item.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* CONTENT */}
          <div className="md:w-3/4 w-full bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100">
            {/* TAB — INFORMASI PRIBADI */}
            {tab === "info-pribadi" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Informasi Pribadi</h2>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                        <User className="w-12 h-12 text-blue-400" />
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition border border-gray-100">
                        <Upload className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Foto Profil</h4>
                      <p className="text-sm text-gray-500">Gunakan foto asli untuk memudahkan verifikasi</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Nama Anda"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                      <input
                        type="email"
                        value={userData.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Nomor Telepon</label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="08xx..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Role Akun</label>
                      <input
                        type="text"
                        value={userData.role.toUpperCase()}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-bold text-[10px] tracking-widest outline-none"
                      />
                    </div>
                  </div>

                  <button
                    disabled={saving}
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Simpan Perubahan
                  </button>
                </form>
              </div>
            )}

            {/* TAB — ALAMAT */}
            {tab === "alamat" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-orange-50 rounded-2xl">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Alamat Pengiriman</h2>
                </div>

                <div className="p-6 bg-white border-2 border-orange-100 rounded-2xl shadow-sm relative group">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition"><Edit className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider mb-2">
                    <Home className="w-4 h-4" />
                    Alamat Utama
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {userData.address || "Belum ada alamat yang disimpan."}
                  </p>

                  {userData.address && (
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Penerima: <b className="text-gray-900">{userData.name}</b></span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleUpdateProfile} className="mt-8 space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Ubah Alamat</label>
                  <textarea
                    value={userData.address}
                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Masukkan alamat lengkap Anda..."
                  />
                  <button
                    disabled={saving}
                    type="submit"
                    className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition shadow-lg disabled:opacity-50"
                  >
                    Update Alamat
                  </button>
                </form>
              </div>
            )}

            {/* TAB — KEAMANAN */}
            {tab === "keamanan" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-red-50 rounded-2xl">
                    <Lock className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Keamanan Akun</h2>
                </div>

                <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Password Baru</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Konfirmasi Password Baru</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    disabled={saving}
                    type="submit"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-red-100 disabled:opacity-50"
                  >
                    <Key className="w-5 h-5" />
                    Ubah Password
                  </button>
                </form>
              </div>
            )}

            {/* TAB — NOTIFIKASI */}
            {tab === "notifikasi" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-purple-50 rounded-2xl">
                    <Bell className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Pengaturan Notifikasi</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "Notifikasi Lelang", desc: "Dapatkan info saat tawaran Anda dilampaui orang lain", icon: <Mail className="w-5 h-5" />, color: "blue" },
                    { title: "Promo & Update", desc: "Dapatkan info mobil baru dan diskon eksklusif", icon: <Gift className="w-5 h-5" />, color: "green" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 bg-${item.color}-100 rounded-lg text-${item.color}-600`}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                          <p className="text-gray-500 text-xs">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={idx === 0} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
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
