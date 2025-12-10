import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function CaraKerjaLelang() {
  return (
    <>
      <Navbar />

      <div className="w-full max-w-4xl mx-auto px-4 mt-12">
        <h1 className="text-3xl font-extrabold text-[#0138C9] mb-8 border-b-2 border-[#ABD905] pb-2">
          💡 Cara Kerja Lelang Kami
        </h1>

        <ol className="relative border-l border-[#ABD905] space-y-12 ml-4">
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white">
              <span className="font-bold text-[#0138C9]">1</span>
            </span>
            <h3 className="font-bold text-xl text-gray-900 mb-1">
              Daftar & Verifikasi Akun
            </h3>
            <p className="text-base font-normal text-gray-600">
              Buat akun, lengkapi data profil, dan selesaikan proses verifikasi identitas (KYC) agar Anda dapat melakukan penawaran.
            </p>
          </li>

          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white">
              <span className="font-bold text-[#0138C9]">2</span>
            </span>
            <h3 className="font-bold text-xl text-gray-900 mb-1">
              Siapkan Deposit Lelang
            </h3>
            <p className="text-base font-normal text-gray-600">
              Lakukan deposit ke saldo akun Anda. Deposit ini akan digunakan sebagai jaminan penawaran dan dikembalikan jika Anda tidak menang.
            </p>
          </li>

          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white">
              <span className="font-bold text-[#0138C9]">3</span>
            </span>
            <h3 className="font-bold text-xl text-gray-900 mb-1">
              Lakukan Penawaran (Bid)
            </h3>
            <p className="text-base font-normal text-gray-600">
              Temukan mobil yang Anda suka, pantau waktu yang tersisa, dan masukkan jumlah tawaran Anda. Gunakan fitur "Bid Maksimum" agar Anda tidak ter-outbid di menit terakhir.
            </p>
          </li>

          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white">
              <span className="font-bold text-[#0138C9]">4</span>
            </span>
            <h3 className="font-bold text-xl text-gray-900 mb-1">
              Menang & Transaksi
            </h3>
            <p className="text-base font-normal text-gray-600">
              Jika Anda menjadi penawar tertinggi saat waktu berakhir, Selamat! Lanjutkan ke pembayaran penuh dan atur pengiriman mobil Anda.
            </p>
          </li>
        </ol>
      </div>

      <Footer />
    </>
  );
}
