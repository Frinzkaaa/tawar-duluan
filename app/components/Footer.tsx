import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center justify-center bg-white py-10 mt-20">
      <div className="w-full max-w-5xl mx-auto px-6">
        
        {/* TOP SECTION */}
        <div className="flex flex-wrap justify-between items-start gap-y-8 md:gap-x-16">
          
          {/* LOGO & ADDRESS */}
          <div className="flex flex-col items-start w-full md:w-auto">
            <img src="/images/logo2.png" alt="Tawar Duluan" className="w-32 mb-2" />
            <p className="text-[#0138C9] font-medium leading-tight mb-4 max-w-xs">
              Gedung Lelang Utama, Lantai 5<br />
              Jl. Transparansi No. 18, Jakarta Selatan 12190
            </p>

            <div className="flex gap-4 mt-2">
              <a href="#" className="text-[#ABD905] hover:text-[#0138C9] transition" aria-label="Instagram">
                {/* Instagram Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13.028 2C...Z" /></svg>
              </a>
              <a href="#" className="text-[#ABD905] hover:text-[#0138C9] transition" aria-label="TikTok">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4.58334 0.916504C...Z" /></svg>
              </a>
              <a href="#" className="text-[#ABD905] hover:text-[#0138C9] transition" aria-label="YouTube">
                <svg width="28" height="28" viewBox="0 0 31 31" fill="currentColor"><path d="M30.3542 8.40495C...Z" /></svg>
              </a>
            </div>
          </div>

          {/* MENUS */}
          <div className="flex flex-wrap gap-y-8 gap-x-16 md:gap-x-12 md:flex-nowrap">
            
            {/* MENU 1 */}
            <div className="flex flex-col gap-2 w-1/2 sm:w-auto">
              <span className="font-bold text-[#0138C9] text-lg mb-1">Jelajahi</span>
              <Link href="/cars" className="text-gray-600 hover:text-[#0138C9] transition">Semua Mobil</Link>
              <a href="#sedang-ramai" className="text-gray-600 hover:text-[#0138C9] transition">Sedang Ramai</a>
              <a href="#segera-berakhir" className="text-gray-600 hover:text-[#0138C9] transition">Segera Berakhir</a>
              <a href="#dibawah-100-juta" className="text-gray-600 hover:text-[#0138C9] transition">Di Bawah 100 Juta</a>
              <a href="#baru-masuk" className="text-gray-600 hover:text-[#0138C9] transition">Baru Masuk</a>
            </div>

            {/* MENU 2 */}
            <div className="flex flex-col gap-2 w-1/2 sm:w-auto">
              <span className="font-bold text-[#0138C9] text-lg mb-1">Koleksi Kamu</span>
              <Link href="/watchlist" className="text-gray-600 hover:text-[#0138C9] transition">Watchlist</Link>
              <Link href="/bid" className="text-gray-600 hover:text-[#0138C9] transition">Bid Saya</Link>
              <Link href="/profile" className="text-gray-600 hover:text-[#0138C9] transition">Profil</Link>
              <Link href="/settings" className="text-gray-600 hover:text-[#0138C9] transition">Pengaturan</Link>
            </div>

            {/* MENU 3 */}
            <div className="flex flex-col gap-2 w-1/2 sm:w-auto">
              <span className="font-bold text-[#0138C9] text-lg mb-1">Bantuan</span>
              <Link href="/how-it-works" className="text-gray-600 hover:text-[#0138C9] transition">Cara Kerja</Link>
              <Link href="/faq" className="text-gray-600 hover:text-[#0138C9] transition">FAQ</Link>
              <Link href="/help" className="text-gray-600 hover:text-[#0138C9] transition">Pusat Bantuan</Link>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <hr className="border-t border-gray-200 mt-10 mb-4 w-full" />
        <div className="w-full text-center md:text-left">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Tawar Duluan. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
