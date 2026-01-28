import Link from "next/link";
import { Slackey } from "next/font/google";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-[#0138C9] text-white pt-24 pb-16 px-4 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] -ml-24 -mb-24" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-[#D8FF4B]" />
          Indonesia's Digital Car Auction
        </div>

        <h1 className="font-[Slackey] text-3xl md:text-5xl font-bold leading-[1.1] mb-6 uppercase tracking-tighter">
          Tawar Duluan <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
            Dapatin Unit Idaman
          </span>
        </h1>

        <p className="text-base md:text-lg mb-8 max-w-xl mx-auto font-medium opacity-90 leading-relaxed">
          Fast bid. Real deals. Zero drama. Nikmati pengalaman lelang mobil transparan, aman, dan digital.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/jelajahi"
            className="group w-full sm:w-auto bg-[#D8FF4B] text-[#0138C9] font-black px-8 py-4 rounded-xl shadow-xl hover:bg-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest"
          >
            Mulai Menawar
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex flex-col items-start leading-none gap-1">
              <span className="text-[10px] font-black text-[#D8FF4B]">1.2k+</span>
              <span className="text-[8px] font-bold opacity-60 uppercase">Sold</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col items-start leading-none gap-1">
              <span className="text-[10px] font-black text-[#D8FF4B]">24/7</span>
              <span className="text-[8px] font-bold opacity-60 uppercase">Live</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
