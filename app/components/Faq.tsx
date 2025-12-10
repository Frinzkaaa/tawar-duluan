"use client";
import { useState } from "react";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpen(open === index ? null : index);
  };

  const faqs = [
    {
      q: "Bagaimana cara kerja penawaran (bidding) di platform ini?",
      a: "Platform kami menggunakan sistem Penawaran Otomatis (Proxy Bidding). Ini dirancang agar penawaran Anda selalu optimal dan Anda tidak perlu terus-menerus memantau layar."
    },
    {
      q: "Bagaimana saya bisa yakin dengan kondisi mobil yang dilelang?",
      a: "Setiap mobil dilengkapi laporan inspeksi lengkap, foto detail, dan riwayat kendaraan sehingga Anda bisa yakin dengan kondisi mobil yang dilelang."
    },
    {
      q: "Apa itu penawaran otomatis (proxy bidding)?",
      a: "Penawaran Anda akan berjalan otomatis sesuai batas maksimal yang Anda tentukan, tanpa perlu memantau layar terus-menerus."
    },
    {
      q: "Apakah saya bisa mengatur strategi penawaran sendiri?",
      a: "Anda dapat mengatur strategi penawaran sesuai kebutuhan dan sistem akan menjalankan penawaran Anda secara otomatis."
    }
  ];

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#0138C9]">
            Masih Ragu Cara Kerjanya?
          </h2>
          <p className="text-2xl md:text-3xl font-semibold mb-4 text-[#ABD905] leading-tight">
            Baca Pertanyaan Yang Sering Diajukan
          </p>
          <p className="text-black text-base mb-6">
            Kami memahami bahwa lelang adalah keputusan besar. Temukan jawaban paling lengkap mengenai proses pendaftaran, mekanisme penawaran, hingga jaminan dokumen dan pengambilan unit.
          </p>
        </div>

        {/* Right FAQ */}
        <div className="space-y-6">
          {faqs.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between bg-white border-2 border-[#0138C9] rounded-full px-6 py-4 text-left font-semibold text-[#222] focus:outline-none transition"
              >
                <span>{item.q}</span>
                <span className="bg-[#0138C9] rounded-full p-2">
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      open === index ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D8FF4B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>

              {open === index && (
                <div className="bg-[#0138C9] text-white rounded-b-3xl px-6 py-6 mt-2 animate-fadeIn">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
