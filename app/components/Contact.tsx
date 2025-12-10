export default function ContactCTA() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto bg-[#D8FF4B] rounded-2xl flex flex-col md:flex-row items-center justify-between px-12 py-10 gap-6">
        
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-bold text-2xl mb-2 text-black">
            Masih bingung?
          </h2>
          <p className="text-xl text-black">
            Hubungi langsung dan diskusi langsung <br /> dengan tim kami.
          </p>
        </div>

        {/* Icon box */}
        <div className="flex items-center border border-black rounded-xl justify-center">
          <div className="rounded-xl p-6 flex items-center justify-center bg-[#D8FF4B]">
            <svg width="80" height="80" viewBox="0 0 117 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-1.35561e-05 106.941L13.3676 119.589L89.2549 39.3831L102.622 52.0309L115.27 38.6634L101.903 26.0155L114.551 12.6479L101.183 9.84975e-07L88.5352 13.3676L75.1676 0.719708L62.5197 14.0873L75.8873 26.7352L-1.35561e-05 106.941ZM36.5042 14.807L49.1521 1.43941L62.5197 14.0873L49.8718 27.4549L36.5042 14.807ZM36.5042 14.807L23.8563 28.1746L10.4887 15.5267L23.1366 2.15912L36.5042 14.807ZM103.342 78.0464L115.99 64.6788L102.622 52.0309L89.9746 65.3985L103.342 78.0464ZM103.342 78.0464L90.6943 91.414L104.062 104.062L116.71 90.6943L103.342 78.0464Z" fill="black"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
