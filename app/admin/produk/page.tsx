"use client";
import React, { useEffect, useState } from "react";
import {
    Package,
    Plus,
    X,
    Edit2,
    Trash2,
    Save,
    DollarSign,
    Calendar,
    FileText,
    ShoppingBag,
    Loader2,
    Image,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import { useAdminData } from "@/app/hooks/useAdminData";

interface Produk {
    id: string;
    nama_barang: string;
    tanggal: string;
    harga_awal: number;
    deskripsi: string;
    image_url?: string | null;
    merk_mobil?: string | null;
    tipe_mobil?: string | null;
    transmisi?: string | null;
    jumlah_seat?: number | null;
    tahun?: number | null;
    kilometer?: number | null;
    kategori?: string | null;
}

// ==== Helper untuk format kategori ====
function formatKategori(raw: string | null | undefined): string {
    if (!raw) return "-";

    const key = raw.replace(/\s+/g, "").toUpperCase();

    const map: Record<string, string> = {
        SEMUA: "Semua Mobil",
        RAMAI: "Sedang Ramai",
        SEGERA: "Segera Berakhir",
        BARU: "Baru Masuk",
        DIBAWAH100: "Di Bawah 100 Juta",
    };

    return map[key] ?? raw;
}

export default function ProdukPage() {
    const [produkList, setProdukList] = useState<Produk[]>([]);
    const [kategoriList, setKategoriList] = useState<string[]>([]);
    const [filteredProdukList, setFilteredProdukList] = useState<Produk[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>("semua");
    const [form, setForm] = useState<Omit<Produk, "id">>({
        nama_barang: "",
        tanggal: "",
        harga_awal: 0,
        deskripsi: "",
        image_url: "",
        kategori: "",
        merk_mobil: null,
        tipe_mobil: null,
        transmisi: null,
        jumlah_seat: null,
        tahun: null,
        kilometer: null,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

    const { adminData, loading } = useAdminData();

    useEffect(() => {
        fetchProduk();
    }, []);

    useEffect(() => {
        let filtered = produkList;
        if (activeFilter === "semua") {
            filtered = produkList;
        } else {
            filtered = produkList.filter((p) => p.kategori === activeFilter);
        }
        setFilteredProdukList(filtered);
    }, [produkList, activeFilter]);

    useEffect(() => {
        const uniqueKategori = Array.from(
            new Set(
                produkList
                    .map((p) => p.kategori || "")
                    .filter((k) => k.trim() !== "")
            )
        );
        setKategoriList(uniqueKategori);
    }, [produkList]);

    async function fetchProduk() {
        try {
            const res = await fetch("/api/produk");
            if (!res.ok) throw new Error(res.statusText);
            const data = await res.json();
            setProdukList(data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("nama_barang", form.nama_barang);
            formData.append("tanggal", form.tanggal);
            formData.append("harga_awal", form.harga_awal.toString());
            formData.append("deskripsi", form.deskripsi);
            if (form.kategori) formData.append("kategori", form.kategori);
            if (form.merk_mobil) formData.append("merk_mobil", form.merk_mobil);
            if (form.tipe_mobil) formData.append("tipe_mobil", form.tipe_mobil);
            if (form.transmisi) formData.append("transmisi", form.transmisi);
            if (typeof form.jumlah_seat === 'number') formData.append("jumlah_seat", form.jumlah_seat.toString());
            if (typeof form.tahun === 'number') formData.append("tahun", form.tahun.toString());
            if (typeof form.kilometer === 'number') formData.append("kilometer", form.kilometer.toString());
            if (selectedFile) formData.append("image", selectedFile);

            let res;
            if (editingId) {
                res = await fetch(`/api/produk/${editingId}`, { method: "PUT", body: formData });
            } else {
                res = await fetch("/api/produk", { method: "POST", body: formData });
            }

            if (!res.ok) throw new Error("Gagal menyimpan produk");
            closeModal();
            alert("Produk berhasil disimpan!");
            fetchProduk();
        } catch (err) {
            console.error("Submit error:", err);
            setErrors({ submit: "Terjadi kesalahan saat menyimpan produk" });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;
        try {
            const res = await fetch(`/api/produk/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Gagal menghapus produk");
            alert("Produk berhasil dihapus!");
            fetchProduk();
        } catch (err) {
            console.error("Delete error:", err);
        }
    }

    function handleEdit(produk: Produk) {
        setForm({
            nama_barang: produk.nama_barang,
            tanggal: produk.tanggal.slice(0, 10),
            harga_awal: produk.harga_awal,
            deskripsi: produk.deskripsi,
            image_url: produk.image_url || "",
            kategori: produk.kategori || null,
            merk_mobil: produk.merk_mobil || null,
            tipe_mobil: produk.tipe_mobil || null,
            transmisi: produk.transmisi || null,
            jumlah_seat: produk.jumlah_seat ?? null,
            tahun: produk.tahun ?? null,
            kilometer: produk.kilometer ?? null,
        });
        setEditingId(produk.id);
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
        setEditingId(null);
        setForm({
            nama_barang: "",
            tanggal: "",
            harga_awal: 0,
            deskripsi: "",
            image_url: "",
            kategori: null,
            merk_mobil: null,
            tipe_mobil: null,
            transmisi: null,
            jumlah_seat: null,
            tahun: null,
            kilometer: null,
        });
        setSelectedFile(null);
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.nama_barang.trim()) newErrors.nama_barang = "Wajib diisi";
        if (!form.tanggal) newErrors.tanggal = "Wajib diisi";
        if (!form.harga_awal || form.harga_awal < 100000) newErrors.harga_awal = "Minimal Rp 100.000";
        if (!form.deskripsi.trim()) newErrors.deskripsi = "Wajib diisi";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: string, value: any) => {
        setForm({ ...form, [field]: value });
    };

    return (
        <main className="flex-1 p-4 lg:p-6 min-h-screen bg-[#0f172a] text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <h1 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Package className="w-5 h-5 text-blue-400" />
                        </div>
                        Daftar Produk Lelang
                    </h1>
                    <button
                        onClick={() => { setModalOpen(true); setEditingId(null); }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0138C9] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Unit
                    </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                    <button
                        onClick={() => setActiveFilter("semua")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === "semua" ? "bg-white text-blue-900" : "bg-white/5 text-white/60 hover:bg-white/10"
                            }`}
                    >
                        SEMUA
                    </button>
                    {kategoriList.map((kategori) => (
                        <button
                            key={kategori}
                            onClick={() => setActiveFilter(kategori)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === kategori ? "bg-white text-blue-900" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
                        >
                            {formatKategori(kategori)}
                        </button>
                    ))}
                </div>

                <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5 font-black text-[9px] text-gray-400 uppercase tracking-[0.2em]">
                                    <th className="py-4 px-4">Nama Produk</th>
                                    <th className="py-4 px-4">Spesifikasi</th>
                                    <th className="py-4 px-4">Tahun</th>
                                    <th className="py-4 px-4">Kilometer</th>
                                    <th className="py-4 px-4">Lelang Selesai</th>
                                    <th className="py-4 px-4">Harga Awal</th>
                                    <th className="py-4 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredProdukList.map((produk) => (
                                    <tr key={produk.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-3 px-4">
                                            <p className="text-xs font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{produk.nama_barang}</p>
                                            <p className="text-[9px] font-bold text-gray-500 mt-0.5 uppercase">{produk.kategori || 'Tanpa Kategori'}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tight">{produk.merk_mobil || '-'} {produk.tipe_mobil || ''}</p>
                                                <p className="text-[9px] text-gray-500 uppercase">{produk.transmisi || '-'} • {produk.jumlah_seat || '-'} Kursi</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-xs font-bold text-gray-400">{produk.tahun || '-'}</td>
                                        <td className="py-3 px-4 text-xs font-bold text-gray-400">{produk.kilometer ? `${produk.kilometer.toLocaleString()} KM` : '-'}</td>
                                        <td className="py-3 px-4 text-xs font-bold text-gray-400">{new Date(produk.tanggal).toLocaleDateString("id-ID")}</td>
                                        <td className="py-3 px-4">
                                            <p className="text-xs font-black text-green-400 tracking-tight">{formatRupiah(produk.harga_awal)}</p>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button onClick={() => handleEdit(produk)} className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(produk.id)} className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
                    <div className="w-full max-w-2xl max-h-[90vh] relative shadow-2xl bg-slate-900 border border-white/10 text-white rounded-3xl flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex-1 overflow-y-auto p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-xl font-black uppercase tracking-widest border-b border-white/5 pb-4">
                                    {editingId ? "Edit Unit" : "Tambah Unit Baru"}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Unit</label>
                                        <input type="text" value={form.nama_barang} onChange={e => handleInputChange('nama_barang', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-blue-500 outline-none transition-all" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Harga Awal</label>
                                        <input type="number" value={form.harga_awal} onChange={e => handleInputChange('harga_awal', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-blue-500 outline-none transition-all" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tanggal Selesai</label>
                                        <input type="date" value={form.tanggal} onChange={e => handleInputChange('tanggal', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-blue-500 outline-none transition-all" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kategori</label>
                                        <select value={form.kategori || ""} onChange={e => handleInputChange('kategori', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-blue-500 outline-none transition-all">
                                            <option value="" className="bg-slate-900">Pilih Kategori</option>
                                            <option value="SEMUA" className="bg-slate-900">Semua Mobil</option>
                                            <option value="RAMAI" className="bg-slate-900">Sedang Ramai</option>
                                            <option value="SEGERA" className="bg-slate-900">Segera Berakhir</option>
                                            <option value="DIBAWAH100" className="bg-slate-900">Di Bawah 100 Juta</option>
                                            <option value="BARU" className="bg-slate-900">Baru Masuk</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Merk</label>
                                        <input type="text" value={form.merk_mobil || ""} onChange={e => handleInputChange('merk_mobil', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tipe</label>
                                        <input type="text" value={form.tipe_mobil || ""} onChange={e => handleInputChange('tipe_mobil', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Transmisi</label>
                                        <select value={form.transmisi || ""} onChange={e => handleInputChange('transmisi', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold">
                                            <option value="" className="bg-slate-900">-</option>
                                            <option value="Matic" className="bg-slate-900">Matic</option>
                                            <option value="Manual" className="bg-slate-900">Manual</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Seat</label>
                                        <input type="number" value={form.jumlah_seat || ""} onChange={e => handleInputChange('jumlah_seat', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Deskripsi</label>
                                    <textarea value={form.deskripsi} onChange={e => handleInputChange('deskripsi', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium h-32 focus:border-blue-500 outline-none transition-all resize-none" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Foto Unit</label>
                                    <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-400 file:bg-blue-600 file:border-none file:text-white file:px-4 file:py-2 file:rounded-lg file:text-[10px] file:font-black file:uppercase file:mr-4 file:cursor-pointer" />
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-white/5">
                                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50">
                                        {isSubmitting ? "Memproses..." : editingId ? "Perbarui Unit" : "Simpan Unit"}
                                    </button>
                                    <button type="button" onClick={closeModal} className="px-6 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
