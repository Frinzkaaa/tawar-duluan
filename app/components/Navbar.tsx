"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, ExternalLink } from "lucide-react";


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Handler untuk logout
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.name) setUser({ name: data.name });
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, []);

  const fetchNotifications = async () => {
    const res = await fetch('/api/notifications');
    if (res.ok) {
      const data = await res.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.isRead).length);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (id?: string) => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchNotifications();
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="bg-[#0138C9] w-full py-3.5 px-6 flex items-center justify-between fixed top-0 z-50 shadow-lg">

      <div className="flex items-center flex-1">
        <img src="/images/logo.png" alt="Logo TDI" className="h-7" />
      </div>

      <div className="hidden md:flex justify-center flex-grow">
        <ul className="flex items-center gap-8 text-white font-bold text-[13px]">
          <li><Link href="/" className="hover:text-[#D8FF4B] transition-colors">BERANDA</Link></li>

          <li className="relative group min-h-10 flex items-center">
            <span className="flex items-center gap-1.5 hover:text-[#D8FF4B] cursor-pointer transition-colors uppercase tracking-tight">
              Jelajahi
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <ul className="absolute left-0 top-full w-44 bg-white text-[#0138C9] rounded-xl shadow-xl invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 z-10 py-2.5 border border-blue-50">
              <li><Link href="/jelajahi" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">Semua Mobil</Link></li>
              <li><a href="#sedang-ramai" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">Sedang Ramai</a></li>
              <li><a href="#segera-berakhir" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">Segera Berakhir</a></li>
              <li><a href="#dibawah-100-juta" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">Di Bawah 100 Juta</a></li>
              <li><a href="#baru-masuk" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">Baru Masuk</a></li>
            </ul>
          </li>

          {/* Dropdown 2 */}
          <li className="relative group min-h-12 flex items-center">
            <span className="flex items-center gap-1.5 hover:text-[#D8FF4B] cursor-pointer transition-colors uppercase tracking-tight">
              Koleksi Saya
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <ul className="absolute left-0 top-full w-44 bg-white text-[#0138C9] rounded-xl shadow-xl invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 z-10 py-2.5 border border-blue-50">
              <li><Link href="/koleksi-saya/watchlist" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">Watchlist</Link></li>
              <li><Link href="/koleksi-saya/bid-saya" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">Bid Saya</Link></li>
              <li><Link href="/koleksi-saya/profil" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">Profil</Link></li>
              <li><Link href="/koleksi-saya/pengaturan" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">Pengaturan</Link></li>
            </ul>
          </li>

          {/* Dropdown 3 */}
          <li className="relative group min-h-12 flex items-center">
            <span className="flex items-center gap-1.5 hover:text-[#D8FF4B] cursor-pointer transition-colors uppercase tracking-tight">
              Bantuan
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <ul className="absolute left-0 top-full w-44 bg-white text-[#0138C9] rounded-xl shadow-xl invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 z-10 py-2.5 border border-blue-50">
              <li><Link href="/bantuan/cara-kerja" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">Cara Kerja</Link></li>
              <li><Link href="/bantuan/faq" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">FAQ</Link></li>
              <li><Link href="/bantuan/pusat-bantuan" className="block px-6 py-2 hover:bg-[#f0f4ff] tracking-tight">Pusat Bantuan</Link></li>
            </ul>
          </li>
        </ul>
      </div>

      {/* USER GREETING or DAFTAR BUTTON (DESKTOP) */}
      <div className="hidden md:flex items-center">
        {user ? (
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative p-2 text-white hover:bg-white/10 rounded-full transition"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#0138C9]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-[#0138C9]">Notifikasi</h3>
                    <button
                      onClick={() => markAsRead()}
                      className="text-[10px] font-bold text-gray-400 hover:text-[#0138C9] uppercase tracking-wider"
                    >
                      Tandai Semua Dibaca
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition relative group ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex justify-between gap-2">
                            <h4 className={`text-xs font-bold ${!n.isRead ? 'text-[#0138C9]' : 'text-gray-700'}`}>
                              {n.title}
                            </h4>
                            {!n.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 shrink-0"></div>}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[9px] text-gray-400 uppercase font-medium">
                              {new Date(n.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {n.link && (
                              <Link
                                href={n.link}
                                onClick={() => markAsRead(n.id)}
                                className="text-[10px] font-bold text-[#0138C9] flex items-center gap-1 hover:underline"
                              >
                                Lihat Detail <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <Bell className="w-10 h-10 text-gray-100 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Belum ada notifikasi baru</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="text-white font-black text-[13px] px-2 uppercase tracking-tight">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="text-white border border-white/20 bg-white/10 rounded-xl px-4 py-1.5 font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-[#0138C9] transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/register" className="text-white border border-white/20 bg-white/10 rounded-xl px-6 py-2 font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-[#0138C9] transition-all">
            Daftar
          </Link>
        )}
      </div>

      {/* MOBILE BUTTON */}
      <button className="md:hidden ml-4 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[64px] left-0 w-full bg-[#0138C9] shadow-lg py-2 z-40">
          <ul className="flex flex-col text-white font-medium">
            <li><Link href="/" className="block px-6 py-3 hover:bg-blue-800">Beranda</Link></li>

            {/* Mobile Dropdowns */}
            <li>
              <button onClick={() => toggleDropdown("jelajahi")} className="flex justify-between items-center w-full px-6 py-3 hover:bg-blue-800">
                Jelajahi
                <span className={`${openDropdown === "jelajahi" ? "rotate-180" : ""} transition`}>⌄</span>
              </button>
              {openDropdown === "jelajahi" && (
                <ul className="bg-blue-900/50">
                  <li><Link href="/jelajahi" className="block px-10 py-2 hover:bg-blue-900">Semua Mobil</Link></li>
                  <li><a href="#sedang-ramai" className="block px-10 py-2 hover:bg-blue-900">Sedang Ramai</a></li>
                  <li><a href="#segera-berakhir" className="block px-10 py-2 hover:bg-blue-900">Segera Berakhir</a></li>
                  <li><a href="#dibawah-100-juta" className="block px-10 py-2 hover:bg-blue-900">Di Bawah 100 Juta</a></li>
                  <li><a href="#baru-masuk" className="block px-10 py-2 hover:bg-blue-900">Baru Masuk</a></li>
                </ul>
              )}
            </li>

            <li>
              <button onClick={() => toggleDropdown("koleksi")} className="flex justify-between items-center w-full px-6 py-3 hover:bg-blue-800">
                Koleksi Saya
                <span className={`${openDropdown === "koleksi" ? "rotate-180" : ""} transition`}>⌄</span>
              </button>
              {openDropdown === "koleksi" && (
                <ul className="bg-blue-900/50">
                  <li><Link href="/koleksi-saya/watchlist" className="block px-10 py-2 hover:bg-blue-900">Watchlist</Link></li>
                  <li><Link href="/koleksi-saya/bid-saya" className="block px-10 py-2 hover:bg-blue-900">Bid Saya</Link></li>
                  <li><Link href="/koleksi-saya/profil" className="block px-10 py-2 hover:bg-blue-900">Profil</Link></li>
                  <li><Link href="/koleksi-saya/pengaturan" className="block px-10 py-2 hover:bg-blue-900">Pengaturan</Link></li>
                </ul>
              )}
            </li>

            <li>
              <button onClick={() => toggleDropdown("help")} className="flex justify-between items-center w-full px-6 py-3 hover:bg-blue-800">
                Bantuan
                <span className={`${openDropdown === "help" ? "rotate-180" : ""} transition`}>⌄</span>
              </button>
              {openDropdown === "help" && (
                <ul className="bg-blue-900/50">
                  <li><Link href="/how-it-works" className="block px-10 py-2 hover:bg-blue-900">Cara Kerja</Link></li>
                  <li><Link href="/faq" className="block px-10 py-2 hover:bg-blue-900">FAQ</Link></li>
                  <li><Link href="/help" className="block px-10 py-2 hover:bg-blue-900">Pusat Bantuan</Link></li>
                </ul>
              )}
            </li>

            {/* USER GREETING or DAFTAR/MASUK/LOGOUT (MOBILE) */}
            <li className="p-4">
              {user ? (
                <div className="flex flex-col gap-2">
                  <span className="block text-center bg-white/10 text-white font-bold rounded-full py-2">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center bg-white text-[#0138C9] font-bold rounded-full py-2 mt-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/register" className="block text-center bg-white text-[#0138C9] font-bold rounded-full py-2">
                  Daftar / Masuk
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
