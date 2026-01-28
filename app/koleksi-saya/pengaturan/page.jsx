
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
  Settings,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Clock,
  LogOut,
  Trash2,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lock
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("umum");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [fetchingTransactions, setFetchingTransactions] = useState(false);

  const tabs = [
    { id: "umum", label: "Umum", icon: <Settings className="w-5 h-5" /> },
    { id: "notifikasi", label: "Notifikasi", icon: <Bell className="w-5 h-5" /> },
    { id: "pembayaran", label: "Pembayaran", icon: <CreditCard className="w-5 h-5" /> },
    { id: "keamanan", label: "Keamanan", icon: <Shield className="w-5 h-5" /> },
    { id: "tindakan", label: "Bahaya", icon: <AlertTriangle className="w-5 h-5" />, danger: true },
  ];

  const fetchTransactions = async () => {
    setFetchingTransactions(true);
    try {
      // For now we use a generic fetch since we don't have a specific transaction list API
      // But in a real app, this would be /api/payment/history
      const res = await fetch('/api/notifications'); // Temporary use notifications to show "activity" if needed
      // Actually, let's just simulate for now since the transaction model is simple
      setTimeout(() => setFetchingTransactions(false), 8000);
    } catch (err) {
      setFetchingTransactions(false);
    }
  };

  useEffect(() => {
    if (activeTab === "pembayaran") {
      fetchTransactions();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    if (confirm("Anda yakin ingin keluar?")) {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    }
  };

  return (
    <>
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 mt-12 pt-20 pb-12">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 rounded-3xl shadow-2xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Settings className="w-48 h-48" />
          </div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <Settings className="w-10 h-10" />
            Pengaturan
          </h1>
          <p className="text-lg text-blue-100 max-w-xl">Kustomisasi akun dan preferensi Anda untuk pengalaman lelang yang lebih baik.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT SIDEBAR */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Menu Navigasi</p>
              </div>
              <nav className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : tab.danger
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${activeTab === tab.id ? "text-white" : ""}`}>
                        {tab.icon}
                      </span>
                      <span className="font-bold text-sm">{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === tab.id ? "hidden" : ""}`} />
                  </button>
                ))}

                <div className="h-px bg-gray-100 mx-4 my-2" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all font-bold text-sm"
                >
                  <LogOut className="w-5 h-5" />
                  Keluar / Logout
                </button>
              </nav>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:w-3/4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 min-h-[600px] relative overflow-hidden">

              {/* TAB — UMUM */}
              {activeTab === "umum" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-blue-50 rounded-2xl">
                      <Globe className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">Preferensi Umum</h2>
                      <p className="text-gray-500 text-sm">Atur tampilan dan bahasa aplikasi.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-black text-gray-700 uppercase tracking-wider">
                        <Globe className="w-4 h-4" />
                        Bahasa
                      </label>
                      <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none font-medium">
                        <option value="id">🇮🇩 Bahasa Indonesia</option>
                        <option value="en">🇺🇸 English (Coming Soon)</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-black text-gray-700 uppercase tracking-wider">
                        <Clock className="w-4 h-4" />
                        Zona Waktu
                      </label>
                      <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none font-medium">
                        <option value="wib">GMT+7 (WIB - Jakarta)</option>
                        <option value="wita">GMT+8 (WITA - Bali)</option>
                        <option value="wit">GMT+9 (WIT - Jayapura)</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-black text-gray-700 uppercase tracking-wider">
                        Mata Uang
                      </label>
                      <div className="p-4 bg-gray-100 rounded-2xl text-gray-500 font-bold flex items-center justify-between">
                        IDR (Rupiah)
                        <span className="text-[10px] bg-gray-200 px-2 py-1 rounded text-gray-400">DEFAULT</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                    <Info className="w-6 h-6 text-blue-600 shrink-0" />
                    <p className="text-sm text-blue-800 leading-relaxed">
                      Pengaturan bahasa dan zona waktu akan mempengaruhi tampilan tanggal lelang di seluruh aplikasi. Pastikan zona waktu sesuai dengan lokasi Anda saat ini.
                    </p>
                  </div>

                  <button className="mt-12 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95">
                    Simpan Perubahan
                  </button>
                </div>
              )}

              {/* TAB — NOTIFIKASI */}
              {activeTab === "notifikasi" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-purple-50 rounded-2xl">
                      <Bell className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">Aturan Notifikasi</h2>
                      <p className="text-gray-500 text-sm">Control kapan Anda ingin dihubungi.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: "Push Notification Mobil Baru", desc: "Dapatkan info instan saat mobil baru masuk ke platform.", checked: true },
                      { title: "Status Bid Approved", desc: "Beri tahu saya jika admin menyetujui tawaran saya.", checked: true },
                      { title: "Status Bid Dilewati (Outbid)", desc: "Segera beri tahu jika ada yang menawar lebih tinggi.", checked: true },
                      { title: "Ringkasan Mingguan", desc: "Email ringkasan aktivitas lelang setiap minggu.", checked: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:border-purple-200 transition-colors">
                        <div>
                          <h4 className="font-bold text-gray-900">{item.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                          <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB — PEMBAYARAN */}
              {activeTab === "pembayaran" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-emerald-50 rounded-2xl">
                      <CreditCard className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">Pembayaran & Saldo</h2>
                      <p className="text-gray-500 text-sm">Kelola deposit lelang dan metode pembayaran.</p>
                    </div>
                  </div>

                  <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-[32px] shadow-2xl relative overflow-hidden mb-10">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Status Jaminan</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black">Rp 5.000.000</span>
                          <span className="text-xs text-gray-400">/ Unit (Deposit)</span>
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1.5 rounded-full w-fit text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          Deposit Aktif
                        </div>
                      </div>
                      <button className="bg-white text-gray-900 font-black py-4 px-8 rounded-2xl shadow-xl hover:bg-gray-100 transition whitespace-nowrap">
                        Tarik Saldo
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    Aktivitas Terakhir
                  </h3>

                  {fetchingTransactions ? (
                    <div className="flex items-center justify-center p-20">
                      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {[
                        { title: "Deposit Lelang", date: "28 Jan 2026", amount: "+Rp 5.000.000", status: "Berhasil" },
                        { title: "Registrasi Member", date: "20 Jan 2026", amount: "GRATIS", status: "Selesai" },
                      ].map((tx, idx) => (
                        <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 font-bold">
                              Rp
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">{tx.title}</h4>
                              <p className="text-[10px] text-gray-400 uppercase font-black">{tx.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-sm text-gray-900">{tx.amount}</p>
                            <p className="text-[10px] text-emerald-600 font-bold">{tx.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB — KEAMANAN */}
              {activeTab === "keamanan" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-red-50 rounded-2xl">
                      <Shield className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">Keamanan Lanjutan</h2>
                      <p className="text-gray-500 text-sm">Perkuat perlindungan akun Anda.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-[32px] text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 scale-110">
                        <Lock className="w-10 h-10 text-gray-300" />
                      </div>
                      <h4 className="text-xl font-black text-gray-900 mb-2">Two-Factor Authentication (2FA)</h4>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8">Tambahkan lapisan keamanan ekstra dengan kode OTP setiap kali Anda melakukan penawaran besar.</p>
                      <button className="bg-gray-900 text-white font-black py-4 px-10 rounded-2xl hover:bg-black transition-all">
                        Aktifkan 2FA Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB — BAHAYA */}
              {activeTab === "tindakan" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-red-600 rounded-2xl">
                      <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-red-600 uppercase tracking-tighter">Zona Berbahaya</h2>
                      <p className="text-gray-500 text-sm">Hati-hati, tindakan di sini bersifat permanen.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 border-2 border-red-100 bg-red-50/30 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h4 className="font-black text-gray-900 text-lg">Hapus Akun Permanen</h4>
                        <p className="text-sm text-gray-500 mt-2 max-w-md">Semua data lelang, deposit, dan bid Anda akan dihapus selamanya. Pastikan Anda sudah menarik semua saldo sisa.</p>
                      </div>
                      <button className="bg-white border-2 border-red-600 text-red-600 font-black py-4 px-8 rounded-2xl hover:bg-red-600 hover:text-white transition shadow-lg shadow-red-100">
                        <Trash2 className="w-5 h-5" />
                        Hapus Akun
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
