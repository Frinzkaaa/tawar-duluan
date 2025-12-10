"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    id: "faq-1",
    question: "Apa itu 'Outbid' dan bagaimana cara menghindarinya?",
    answer:
      "Outbid adalah ketika penawar lain menaikkan tawaran melewati jumlah tawaran Anda. Untuk menghindarinya, gunakan fitur Bid Maksimum (Auto Bid) agar sistem menawar otomatis hingga batas maksimum Anda.",
  },
  {
    id: "faq-2",
    question: "Apakah deposit lelang akan dikembalikan jika saya kalah?",
    answer:
      "Ya. Jika Anda kalah dalam lelang, deposit akan dikembalikan sepenuhnya ke saldo akun Anda. Anda dapat menggunakannya untuk lelang lain atau menarik ke rekening bank.",
  },
];

export default function FAQ() {

  const [active, setActive] = useState<string | null>(null);

  const toggle = (id: string) => {
    setActive((prev) => (prev === id ? null : id));
  };

  return (
    <>
    <Navbar />
    <div className="w-full max-w-4xl mx-auto px-4 mt-12">
      <h1 className="text-3xl font-extrabold text-[#0138C9] mb-8 border-b-2 border-[#ABD905] pb-2">
        ❓ Pertanyaan yang Sering Diajukan (FAQ)
      </h1>

      <div className="space-y-4">
        {faqData.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <button
              className="w-full text-left p-4 font-bold text-gray-700 hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggle(item.id)}
            >
              <span>{item.question}</span>
              <span className="text-xl font-bold">{active === item.id ? "-" : "+"}</span>
            </button>

            {active === item.id && (
              <div className="p-4 pt-0 text-gray-600 bg-gray-50 animate-fadeIn">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}

