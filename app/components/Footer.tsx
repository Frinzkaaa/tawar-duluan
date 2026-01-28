import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center justify-center bg-white py-12 mt-12 border-t border-gray-50">
      <div className="w-full max-w-5xl mx-auto px-6">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">

          {/* LOGO & ADDRESS */}
          <div className="flex flex-col items-start col-span-1">
            <img src="/images/logo2.png" alt="Tawar Duluan" className="w-24 mb-3" />
            <p className="text-[#0138C9] font-bold text-[11px] leading-relaxed mb-4 max-w-[180px] uppercase tracking-tight opacity-70">
              Gedung Lelang Utama, Lantai 5<br />
              Jl. Transparansi No. 18, Jakarta Selatan 12190
            </p>
          </div>

          {/* MENUS */}
          <div className="flex flex-col gap-2">
            <span className="font-black text-[#0138C9] text-[10px] uppercase tracking-widest mb-2 opacity-50">Jelajahi</span>
            <Link href="/jelajahi" className="text-gray-900 font-bold text-xs hover:text-[#0138C9] transition-colors">Semua Mobil</Link>
            <a href="#sedang-ramai" className="text-gray-900 font-bold text-xs hover:text-[#0138C9] transition-colors">Sedang Ramai</a>
            <a href="#segera-berakhir" className="text-gray-900 font-bold text-xs hover:text-[#0138C9] transition-colors">Segera Berakhir</a>
            <a href="#dibawah-100-juta" className="text-gray-900 font-bold text-xs hover:text-[#0138C9] transition-colors">Di Bawah 100 Juta</a>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-black text-[#0138C9] text-[10px] uppercase tracking-widest mb-2 opacity-50">Akun Kamu</span>
            <Link href="/koleksi-saya/watchlist" className="text-gray-900 font-bold text-xs hover:text-[#0138C9] transition-colors">Watchlist</Link>
            <Link href="/koleksi-saya/bid-saya" className="text-gray-900 font-bold text-xs hover:text-[#0138C9] transition-colors">Bid Saya</Link>
            <Link href="/koleksi-saya/profil" className="text-gray-900 font-bold text-xs hover:text-[#0138C9] transition-colors">Profil</Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-black text-[#0138C9] text-[10px] uppercase tracking-widest mb-2 opacity-50">Bantuan</span>
            <Link href="/bantuan/cara-kerja" className="text-gray-900 font-bold text-xs hover:text-[#0138C9] transition-colors">Cara Kerja</Link>
            <Link href="/bantuan/faq" className="text-gray-900 font-bold text-xs hover:text-[#0138C9] transition-colors">FAQ</Link>
            <Link href="/bantuan/pusat-bantuan" className="text-gray-900 font-bold text-xs hover:text-[#0138C9] transition-colors">Pusat Bantuan</Link>
          </div>
        </div>

        {/* COPYRIGHT */}
        <hr className="border-t border-gray-100 mt-12 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Tawar Duluan.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-[10px] font-black text-[#0138C9] uppercase tracking-widest">Privacy Policy</Link>
            <Link href="#" className="text-[10px] font-black text-[#0138C9] uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
