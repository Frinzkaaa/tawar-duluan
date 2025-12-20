import Image from "next/image";
import { Star, Users, Gauge } from "lucide-react";

export default function FeaturedCars() {
  return (
    <section className="bg-[#0138C9] py-12 px-4">
      <div className="max-w-5xl mx-auto text-center text-white mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Lelang Mobil Pilihan</h2>
        <p className="text-lg">Mobil Terbaik, Harga Terbaik</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Card 1 */}
        <div className="bg-[#DDDDDD]/50 rounded-3xl p-6 shadow-lg flex flex-col justify-between h-[420px] w-full max-w-[340px] mx-auto">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-lg font-thin text-[#222]">Toyota</div>
                <div className="text-xl font-semibold text-[#222] leading-tight">Yaris 1.5 S</div>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <Star size={16} className="text-black" fill="black" />
                <span className="font-thin text-black">4.5</span>
              </div>
            </div>

            <div className="grid mt-5 space-y-2 text-[#222] text-sm">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>5 Penumpang</span>
              </div>

              <div className="flex items-center gap-2">
                <Gauge size={20} />
                <span>Matic</span>
              </div>
            </div>

            <div className="flex justify-center items-center mb-2 mt-5">
              <Image
                src="/images/5.png"
                alt="Toyota Yaris"
                width={250}
                height={150}
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div className="text-base text-[#222]">
              Harga Awal Lelang:<br />
              <span className="font-bold text-lg">Rp 175.000.000</span>
            </div>
          </div>
        </div>
        

        <div className="bg-[#DDDDDD]/50 rounded-3xl p-6 shadow-lg flex flex-col justify-between h-[420px] w-full max-w-[340px] mx-auto">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-lg font-thin text-[#222]">Toyota</div>
                <div className="text-xl font-semibold text-[#222] leading-tight">Yaris 1.5 S</div>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <Star size={16} className="text-black" fill="black" />
                <span className="font-thin text-black">4.5</span>
              </div>
            </div>

            <div className="grid mt-5 space-y-2 text-[#222] text-sm">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>5 Penumpang</span>
              </div>

              <div className="flex items-center gap-2">
                <Gauge size={20} />
                <span>Matic</span>
              </div>
            </div>

            <div className="flex justify-center items-center mb-2 mt-5">
              <Image
                src="/images/8.png"
                alt="Toyota Yaris"
                width={250}
                height={150}
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div className="text-base text-[#222]">
              Harga Awal Lelang:<br />
              <span className="font-bold text-lg">Rp 175.000.000</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
