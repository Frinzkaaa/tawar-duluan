
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
  UserPlus,
  Wallet,
  Gavel,
  Trophy,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function CaraKerjaLelang() {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8 text-blue-600" />,
      title: "Daftar & Lengkapi Profil",
      desc: "Buat akun Tawar Duluan dalam hitungan menit. Lengkapi verifikasi identitas (KYC) agar Anda dipercaya untuk melakukan penawaran besar.",
      badge: "Langkah 01"
    },
    {
      icon: <Wallet className="w-8 h-8 text-emerald-600" />,
      title: "Setor Uang Jaminan",
      desc: "Lakukan deposit sebesar Rp 5.000.000 sebagai tanda keseriusan. Saldo ini bersifat refundable (bisa ditarik kembali) jika Anda belum memenangkan lelang.",
      badge: "Langkah 02"
    },
    {
      icon: <Gavel className="w-8 h-8 text-purple-600" />,
      title: "Mulai Menawar (Bidding)",
      desc: "Cari mobil impian Anda dan masukkan penawaran terbaik. Pantau status tawaran Anda melalui notifikasi real-time agar tidak terlampaui orang lain.",
      badge: "Langkah 03"
    },
    {
      icon: <Trophy className="w-8 h-8 text-amber-600" />,
      title: "Menang & Pelunasan",
      desc: "Jika menang, selamat! Segera lakukan pelunasan dalam waktu 2x24 jam. Anda dapat memilih metode jemput sendiri atau kirim unit ke rumah.",
      badge: "Langkah 04"
    }
  ];

  return (
    <>
      <Navbar />

      <div className="bg-white pt-24 pb-16">
        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest mb-3 inline-block">
              Panduan Platform
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Bagaimana Cara Kerja <span className="text-[#0138C9]">Tawar Duluan</span>?
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed opacity-80">
              Proses lelang yang transparan, aman, dan digital. Ikuti 4 langkah mudah berikut.
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="group relative flex flex-col md:flex-row gap-6 p-6 bg-white border border-gray-100 rounded-2xl hover:border-blue-100 hover:shadow-xl transition-all duration-500">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6 shadow-sm">
                    {step.icon}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">
                      {step.title}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ABD905] bg-gray-900 px-4 py-1.5 rounded-full w-fit">
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed text-sm border-l-4 border-gray-100 group-hover:border-blue-200 pl-4 transition-colors">
                    {step.desc}
                  </p>
                </div>

                {idx !== steps.length - 1 && (
                  <div className="hidden lg:block absolute -bottom-10 left-10 text-gray-100">
                    <ArrowRight className="w-8 h-8 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <ShieldCheck className="w-96 h-96 absolute -top-20 -right-20" />
            </div>

            <h2 className="text-3xl font-black mb-6 relative z-10">Sudah Paham Caranya?</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg relative z-10">
              Ribuan unit mobil berkualitas sedang menunggu penawaran terbaik Anda. Mulai cari sekarang dan jadilah pemenang!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/jelajahi" className="w-full sm:w-auto bg-[#0138C9] hover:bg-blue-600 text-white font-black px-10 py-5 rounded-[24px] shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-2">
                Jelajahi Mobil
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/register" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-black px-10 py-5 rounded-[24px] backdrop-blur-sm transition-all">
                Daftar Sekarang
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex gap-6 p-8 bg-blue-50/50 rounded-[32px] border border-blue-100">
              <Smartphone className="w-12 h-12 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-black text-gray-900 text-lg mb-2">Penawaran di Mana Saja</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Nikmati kemudahan bidding langsung dari smartphone Anda. Kami menjamin akses 24/7 tanpa kendala teknis.
                </p>
              </div>
            </div>
            <div className="flex gap-6 p-8 bg-emerald-50/50 rounded-[32px] border border-emerald-100">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-black text-gray-900 text-lg mb-2">Keamanan Transaksi</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Setiap transaksi menggunakan enkripsi tingkat tinggi dan jaminan keamanan deposit 100% kembali.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
