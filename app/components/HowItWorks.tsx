import { Search, Handshake, Wallet, Car } from "lucide-react";
import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="grid justify-center text-center text-sm">
        <span>Bagaimana Cara Kerjanya?</span>
        <h2 className="text-xl md:text-2xl font-bold text-[#0138C9]">Lelang Mobil Jadi Mudah:</h2>
        <p className="text-[#8BC34A] text-lg md:text-xl font-semibold mb-10">Panduan Langkah Demi Langkah</p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-20">
        <Image
          src="/images/m-landing.png"
          width={500}
          height={500}
          alt="Mobil Hero"
          className="w-full md:w-1/2 mb-3 md:mb-0"
        />

        <ul className="w-full md:w-1/2 space-y-6">
          <li className="flex gap-3 items-start">
            <Search size={42} className="text-[#0138C9]" />
            <span>
              <span className="font-semibold">Temukan Mobil Impian Anda</span><br />
              Telusuri daftar lelang terbaru, lengkap dengan detail & laporan inspeksi.
            </span>
          </li>

          <li className="flex gap-3 items-start">
            <Handshake size={42} className="text-[#0138C9]" />
            <span>
              <span className="font-semibold">Daftar & Beri Penawaran</span><br />
              Buat akun, ambil nomor lelang, lalu ajukan tawaran terbaik.
            </span>
          </li>

          <li className="flex gap-3 items-start">
            <Wallet size={42} className="text-[#0138C9]" />
            <span>
              <span className="font-semibold">Selesaikan Pembayaran</span><br />
              Jika menang, selesaikan pembayaran sebelum tenggat waktu.
            </span>
          </li>

          <li className="flex gap-3 items-start">
            <Car size={42} className="text-[#0138C9]" />
            <span>
              <span className="font-semibold">Mobil Siap Dibawa Pulang</span><br />
              Ambil mobil atau gunakan layanan pengiriman ke rumah.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
