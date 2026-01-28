import { ShieldCheck, Clock, Zap, Star } from "lucide-react";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: Star,
      title: "Transparansi Data Penuh",
      desc: "Setiap mobil dilengkapi laporan inspeksi mendalam meliputi data riwayat kendaraan yang 100% akurat tanpa biaya tersembunyi."
    },
    {
      icon: ShieldCheck,
      title: "Dokumen Terjamin Aman",
      desc: "Garansi keabsahan surat kendaraan (BPKB & STNK). Proses serah terima dilakukan dengan standar legalitas tertinggi."
    },
    {
      icon: Zap,
      title: "Proses Cepat & Mudah",
      desc: "Penawaran dari mana saja melalui platform digital intuitif. Menangkan unit idaman Anda hanya dalam beberapa klik saja."
    },
    {
      icon: Clock,
      title: "Harga Paling Kompetitif",
      desc: "Dapatkan unit dengan harga awal jauh di bawah pasaran, memberikan margin keuntungan maksimal bagi setiap pembeli."
    }
  ];

  return (
    <section className="bg-white py-16 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0138C9] px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-widest mb-3">
          Keunggulan Kami
        </div>
        <h2 className="text-2xl md:text-3xl font-black mb-2 text-gray-900 tracking-tighter leading-tight">
          Mengapa Ribuan Pembeli <br />
          <span className="text-[#0138C9]">Memilih Tawar Duluan?</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {reasons.map((item, idx) => (
          <div key={idx} className="group p-6 rounded-[24px] bg-gray-50 border border-gray-100 hover:bg-[#0138C9] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#0138C9] mb-6 group-hover:scale-110 transition-transform">
              <item.icon size={20} />
            </div>
            <h3 className="font-black mb-2 text-gray-900 group-hover:text-white transition-colors tracking-tight text-base">{item.title}</h3>
            <p className="text-gray-500 text-[11px] group-hover:text-blue-100 transition-colors leading-relaxed font-medium">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
