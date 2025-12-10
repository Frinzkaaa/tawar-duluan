export default function WhyChooseUs() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#0138C9]">
          Mengapa banyak pembeli <br />
          <span className="text-[#ABD905]">memilih lelang kami?</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">

        <div className="bg-[#0138C9] rounded-xl p-6 shadow text-left">
          <h3 className="font-bold mb-2 text-white">Transparansi Data Penuh</h3>
          <p className="text-white text-sm">
            Setiap mobil dilengkapi laporan inspeksi meliputi data riwayat kendaraan yang akurat.
            Tidak ada biaya tersembunyi atau kejutan.
          </p>
        </div>

        <div className="bg-[#0138C9] rounded-xl p-6 shadow text-left">
          <h3 className="font-bold mb-2 text-white">Dokumen Terjamin Aman</h3>
          <p className="text-white text-sm">
            Kami menjamin keabsahan dan kelengkapan semua surat kendaraan (BPKB & STNK).
            Proses serah terima dokumen dilakukan cepat dan legal.
          </p>
        </div>

        <div className="bg-[#0138C9] rounded-xl p-6 shadow text-left">
          <h3 className="font-bold mb-2 text-white">Proses Cepat & Mudah</h3>
          <p className="text-white text-sm">
            Beri penawaran dari mana saja, kapan saja, melalui platform digital kami yang intuitif.
            Hasil cepat, dapatkan mobil Anda.
          </p>
        </div>

        <div className="bg-[#0138C9] rounded-xl p-6 shadow text-left">
          <h3 className="font-bold mb-2 text-white">Harga Paling Kompetitif</h3>
          <p className="text-white text-sm">
            Temukan berbagai mobil dengan harga awal yang jauh lebih rendah dari pasaran,
            maksimalkan keuntungan pembelian Anda.
          </p>
        </div>

      </div>
    </section>
  );
}
