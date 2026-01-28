"use client";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpen(open === index ? null : index);
  };

  const faqs = [
    {
      q: "Bagaimana cara kerja penawaran (bidding) di platform ini?",
      a: "Platform kami menggunakan sistem Penawaran Otomatis (Proxy Bidding). Ini dirancang agar penawaran Anda selalu optimal dan Anda tidak perlu terus-menerus memantau layar. Cukup tentukan harga maksimal Anda, dan sistem kami akan menawar secara bertahap."
    },
    {
      q: "Bagaimana saya bisa yakin dengan kondisi mobil yang dilelang?",
      a: "Setiap mobil tanpa terkecuali dilengkapi dengan laporan inspeksi menyeluruh oleh tim profesional kami. Kami menyediakan foto detail mesin, eksterior, dan interior, serta verifikasi riwayat kendaraan lengkap."
    },
    {
      q: "Apa itu penawaran otomatis (proxy bidding)?",
      a: "Proxy bidding adalah fitur di mana sistem secara otomatis mengajukan penawaran terkecil yang diperlukan untuk tetap menjadi penawar tertinggi, hingga mencapai batas maksimum yang telah Anda tentukan."
    },
    {
      q: "Apakah saya bisa mengatur strategi penawaran sendiri?",
      a: "Tentu. Anda memiliki kontrol penuh atas penawaran Anda. Anda dapat mengajukan penawaran secara manual atau menggunakan fitur otomatis untuk efisiensi waktu Anda."
    }
  ];

  return (
    <section className="bg-white py-16 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Side */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0138C9] px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-widest mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 text-gray-900 tracking-tighter leading-tight">
              Masih Ragu Dengan <br />
              <span className="text-[#0138C9]">Cara Kerjanya?</span>
            </h2>
            <p className="text-gray-500 font-medium text-xs md:text-sm mb-6 leading-relaxed">
              Kami memahami lelang adalah keputusan besar. Temukan jawaban paling lengkap mengenai pendaftaran hingga jaminan dokumen.
            </p>
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Butuh Bantuan?</p>
              <p className="text-gray-900 font-bold mb-3 text-xs leading-relaxed">Tim support kami siap membantu Anda 24/7 untuk setiap pertanyaan teknis.</p>
              <button className="text-[#0138C9] font-black text-[9px] uppercase tracking-widest hover:underline">Chat With Us &rarr;</button>
            </div>
          </div>

          {/* Right Side Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((item, index) => {
              const isOpen = open === index;
              return (
                <div
                  key={index}
                  className={`group rounded-[24px] border ${isOpen ? 'border-[#0138C9] bg-white shadow-lg' : 'border-gray-100 bg-gray-50 hover:bg-white'} transition-all duration-300 overflow-hidden`}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                  >
                    <span className={`text-xs md:text-sm font-black tracking-tight ${isOpen ? 'text-[#0138C9]' : 'text-gray-900'}`}>
                      {item.q}
                    </span>
                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#0138C9] text-white rotate-180' : 'bg-white text-gray-400 border border-gray-200'}`}>
                      <ChevronDown size={14} />
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                  >
                    <div className="p-5 md:p-6 pt-0 text-gray-500 text-[11px] md:text-xs font-medium leading-relaxed border-t border-gray-50">
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
