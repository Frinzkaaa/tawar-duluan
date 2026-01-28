import { MessageCircle, Phone, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative focus-within:z-10">
        <div className="bg-[#D8FF4B] rounded-[32px] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden shadow-xl">

          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-black/5 rounded-full blur-2xl -mr-24 -mt-24 pointer-events-none" />

          <div className="flex-1 text-center md:text-left relative z-10">
            <h2 className="font-black text-2xl md:text-3xl mb-3 text-black tracking-tighter leading-tight">
              Masih Bingung? <br />
              <span className="opacity-60 text-lg md:text-xl font-bold">Diskusi Langsung Dengan Tim Kami.</span>
            </h2>
            <p className="text-black/70 font-medium text-xs md:text-sm max-w-sm mb-6">
              Bantuan personal untuk pendaftaran, strategi penawaran, hingga serah terima unit secara detail.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link href="https://wa.me/123456789" className="bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#0138C9] transition-all hover:scale-105">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Link>
              <Link href="/bantuan/pusat-bantuan" className="bg-white/20 hover:bg-white/40 text-black border border-black/10 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105">
                Pusat Bantuan
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 hidden lg:block">
            <div className="w-32 h-32 bg-black rounded-[28px] flex items-center justify-center -rotate-12 shadow-xl">
              <Phone className="w-14 h-14 text-[#D8FF4B]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
