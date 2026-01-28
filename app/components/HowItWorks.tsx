import { Search, Handshake, Wallet, Car, ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Added Link import
import { Slackey } from "next/font/google"; // Added Slackey import

// Initialize Slackey font
const slackey = Slackey({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-slackey",
});

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0138C9] px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-widest mb-3">
            Proses Platform
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter mb-2">
            Lelang Mobil Jadi <span className="text-[#0138C9]">Sangat Mudah</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-md mx-auto text-xs md:text-sm">
            Kami menyederhanakan proses rumit menjadi 4 langkah digital yang transparan dan aman.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="relative w-full lg:w-1/2">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-[60px] opacity-20 -z-10" />
            <Image
              src="/images/m-landing.png"
              width={450}
              height={450}
              alt="Mobil Hero"
              className="w-full h-auto drop-shadow-xl"
            />
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-1 gap-3">
            {[
              { icon: Search, title: "Temukan Mobil Impian", desc: "Telusuri daftar lelang terbaru lengkap dengan laporan inspeksi mendalam." },
              { icon: Handshake, title: "Daftar & Beri Penawaran", desc: "Berikan penawaran terbaik Anda secara real-time melalui sistem kami." },
              { icon: Wallet, title: "Selesaikan Pembayaran", desc: "Proses transaksi aman dan cepat setelah Anda memenangkan lelang." },
              { icon: Car, title: "Ambil Unit Anda", desc: "Mobil siap dijemput atau kami kirimkan langsung ke pintu rumah Anda." }
            ].map((step, idx) => (
              <div key={idx} className="group flex gap-4 p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#0138C9] group-hover:bg-[#0138C9] group-hover:text-white transition-all">
                  <step.icon size={20} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm mb-0.5 tracking-tight">{step.title}</h4>
                  <p className="text-gray-500 text-[11px] font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
