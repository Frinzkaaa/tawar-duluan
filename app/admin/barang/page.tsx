"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PendataanBarangPage() {
  const [namaBarang, setNamaBarang] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [hargaAwal, setHargaAwal] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addBarang = async () => {
    if (!namaBarang || !deskripsi || !hargaAwal || !tanggal) {
      return alert("Lengkapi semua form!");
    }

    setLoading(true);
    try {
      const response = await fetch("/api/produk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_barang: namaBarang,
          deskripsi,
          harga_awal: Number(hargaAwal),
          tanggal: new Date(tanggal).toISOString(),
        }),
      });

      if (response.ok) {
        alert("Barang berhasil ditambahkan");
        setNamaBarang("");
        setDeskripsi("");
        setHargaAwal("");
        setTanggal("");
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Gagal menambahkan barang"}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Terjadi kesalahan saat menambahkan barang");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">📦 Pendataan Barang</h1>

      <input
        type="text"
        placeholder="Nama Barang"
        className="border p-2 w-full"
        value={namaBarang}
        onChange={(e) => setNamaBarang(e.target.value)}
      />

      <textarea
        placeholder="Deskripsi"
        className="border p-2 w-full"
        value={deskripsi}
        onChange={(e) => setDeskripsi(e.target.value)}
      />

      <input
        type="number"
        placeholder="Harga Awal"
        className="border p-2 w-full"
        value={hargaAwal}
        onChange={(e) => setHargaAwal(e.target.value)}
      />

      <input
        type="datetime-local"
        placeholder="Tanggal Lelang"
        className="border p-2 w-full"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
      />

      <button
        onClick={addBarang}
        disabled={loading}
        className="bg-blue-600 text-white p-2 w-full rounded disabled:bg-gray-400"
      >
        {loading ? "Menyimpan..." : "Simpan Barang"}
      </button>
    </div>
  );
}
