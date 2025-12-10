import Link from "next/link";
import { Slackey } from "next/font/google";

export default function Hero() {
  return (
    <section className="bg-[#0138C9] text-white pt-32 pb-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-slackey text-4xl md:text-6xl font-bold leading-tight mb-4 uppercase">
          Tawar Duluan <br /> Menang Duluan
        </h1>

        <p className="text-base md:text-lg mb-8">
          Fast bid. Real deals. Zero drama.
        </p>

        <Link
          href="/cars"
          className="inline-block bg-[#D8FF4B] text-[#0138C9] font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[#c0e63e] transition duration-300 transform hover:scale-105"
        >
          Lihat Lelang
        </Link>
      </div>
    </section>
  );
}
