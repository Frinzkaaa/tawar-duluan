
"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { SITE_CONFIG } from "@/lib/constants";
import { Plus, Minus, HelpCircle, MessageCircle, ChevronDown, Sparkles } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FaqItem[] = [
  {
    id: "faq-1",
    category: "Bidding",
    question: "Apa itu 'Outbid' dan bagaimana cara menghindarinya?",
    answer:
      "Outbid adalah kondisi di mana penawar lain memasukkan tawaran yang lebih tinggi dari Anda. Untuk menghindarinya tanpa harus memantau layar setiap detik, Anda disarankan untuk memasukkan tawaran maksimal Anda di awal atau menggunakan fitur bid bertahap saat mendekati waktu lelang berakhir.",
  },
  {
    id: "faq-2",
    category: "Transaksi",
    question: "Apakah deposit lelang akan dikembalikan jika saya kalah?",
    answer:
      "Tentu saja. Tawar Duluan menjamin pengembalian deposit 100% tanpa potongan jika Anda tidak memenangkan unit lelang manapun. Proses pengembalian (refund) biasanya memakan waktu 1-3 hari kerja setelah lelang ditutup.",
  },
  {
    id: "faq-3",
    category: "Unit",
    question: "Apakah saya bisa melakukan inspeksi fisik sebelum menawar?",
    answer:
      "Bisa. Kami menyediakan jadwal 'Open House' di setiap lokasi unit. Anda dapat melihat detail lokasi dan jadwal inspeksi di halaman detail masing-masing mobil. Kami sangat menyarankan Anda melakukan pengecekan fisik atau membawa mekanik kepercayaan.",
  },
  {
    id: "faq-4",
    category: "Pembayaran",
    question: "Berapa lama batas waktu pelunasan setelah menang?",
    answer:
      "Batas waktu pelunasan adalah 2x24 jam (hari kerja) setelah pengumuman pemenang lelang. Jika pelunasan tidak dilakukan dalam kurun waktu tersebut, kemenangan dianggap batal dan uang deposit akan dianggap hangus sebagai kompensasi.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setActive((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 pt-24 pb-16 min-h-screen">
        <div className="w-full max-w-4xl mx-auto px-4">

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4" />
              FAQ
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-3">
              Punya Pertanyaan?
            </h1>
            <p className="text-gray-500 font-medium text-base">
              Jawaban cepat untuk pertanyaan yang sering diajukan.
            </p>
          </div>

          <div className="space-y-3">
            {faqData.map((item) => (
              <div
                key={item.id}
                className={`group border border-transparent rounded-2xl overflow-hidden transition-all duration-300 ${active === item.id
                    ? "bg-white shadow-xl shadow-blue-100 border-blue-50"
                    : "bg-white/60 hover:bg-white shadow-sm hover:shadow-lg"
                  }`}
              >
                <button
                  className="w-full text-left p-5 md:p-6 flex justify-between items-center transition-all"
                  onClick={() => toggle(item.id)}
                >
                  <div className="pr-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#0138C9]/40 mb-1 block">
                      {item.category}
                    </span>
                    <h3 className={`text-base md:text-lg font-black transition-colors ${active === item.id ? "text-[#0138C9]" : "text-gray-800"}`}>
                      {item.question}
                    </h3>
                  </div>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${active === item.id ? "bg-[#0138C9] text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                    }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${active === item.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="p-5 md:p-6 pt-0 text-gray-500 font-medium leading-relaxed text-sm border-t border-gray-50 mx-5 md:mx-6">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Help Section */}
          <div className="mt-16 p-6 md:p-8 bg-[#0138C9] rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200">
            <div>
              <h3 className="text-xl font-black mb-1">Masih butuh bantuan?</h3>
              <p className="text-blue-100 font-medium text-sm">Tim kami siap membantu Anda secara personal.</p>
            </div>
            <button
              onClick={() => {
                const phone = SITE_CONFIG?.adminWhatsApp || "";
                const text = encodeURIComponent("Halo Admin Tawar Duluan, saya ingin bertanya mengenai FAQ ini.");
                window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
              }}
              className="bg-white text-[#0138C9] font-black px-6 py-3 rounded-xl hover:bg-[#ABD905] hover:text-gray-900 transition-all shadow-lg flex items-center gap-2 group text-sm"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Hubungi Support
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
