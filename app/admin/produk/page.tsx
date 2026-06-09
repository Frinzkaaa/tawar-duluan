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
    nomor_polisi?: string | null;
    warna?: string | null;
    bahan_bakar?: string | null;
    kapasitas_mesin?: string | null;
    status_dokumen?: string | null;
    lokasi_mobil?: string | null;
    kondisi?: string | null;
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
        nomor_polisi: null,
        warna: null,
        bahan_bakar: null,
        kapasitas_mesin: null,
        status_dokumen: null,
        lokasi_mobil: null,
        kondisi: null,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
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
            if (form.nomor_polisi) formData.append("nomor_polisi", form.nomor_polisi);
            if (form.warna) formData.append("warna", form.warna);
            if (form.bahan_bakar) formData.append("bahan_bakar", form.bahan_bakar);
            if (form.kapasitas_mesin) formData.append("kapasitas_mesin", form.kapasitas_mesin);
            if (form.status_dokumen) formData.append("status_dokumen", form.status_dokumen);
            if (form.lokasi_mobil) formData.append("lokasi_mobil", form.lokasi_mobil);
            if (form.kondisi) formData.append("kondisi", form.kondisi);
            if (selectedFile) formData.append("image", selectedFile);
            selectedGalleryFiles.forEach(f => formData.append("images", f));

            let res;
            if (editingId) {
                res = await fetch(`/api/produk/${editingId}`, { method: "PUT", body: formData });
            } else {
                res = await fetch("/api/produk", { method: "POST", body: formData });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Gagal menyimpan produk");
            }

            closeModal();
            alert("Produk berhasil disimpan!");
            fetchProduk();
        } catch (err: any) {
            console.error("Submit error:", err);
            setErrors({ submit: err.message || "Terjadi kesalahan saat menyimpan produk" });
            alert(err.message || "Terjadi kesalahan saat menyimpan produk");
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
            nomor_polisi: produk.nomor_polisi || null,
            warna: produk.warna || null,
            bahan_bakar: produk.bahan_bakar || null,
            kapasitas_mesin: produk.kapasitas_mesin || null,
            status_dokumen: produk.status_dokumen || null,
            lokasi_mobil: produk.lokasi_mobil || null,
            kondisi: produk.kondisi || null,
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
            nomor_polisi: null,
            warna: null,
            bahan_bakar: null,
            kapasitas_mesin: null,
            status_dokumen: null,
            lokasi_mobil: null,
            kondisi: null,
        });
        setSelectedFile(null);
        setSelectedGalleryFiles([]);
        setCoverPreview(null);
        setGalleryPreviews([]);
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
        else {
            const selectedDate = new Date(form.tanggal);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.tanggal = "Tanggal selesai tidak boleh hari kemarin";
            }
        }
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
                                        <input 
                                            type="date" 
                                            value={form.tanggal} 
                                            min={new Date().toLocaleDateString('en-CA')}
                                            onChange={e => handleInputChange('tanggal', e.target.value)} 
                                            className={`w-full bg-white/5 border ${errors.tanggal ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'} rounded-xl px-4 py-2.5 text-xs font-bold outline-none transition-all`} 
                                            required 
                                        />
                                        {errors.tanggal && (
                                            <p className="text-[10px] text-red-500 font-bold mt-1 tracking-wide">{errors.tanggal}</p>
                                        )}
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tahun</label>
                                        <input type="number" placeholder="Contoh: 2021" value={form.tahun || ""} onChange={e => handleInputChange('tahun', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold focus:border-blue-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kilometer</label>
                                        <input type="number" placeholder="Contoh: 45000" value={form.kilometer || ""} onChange={e => handleInputChange('kilometer', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold focus:border-blue-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nomor Polisi</label>
                                        <input type="text" placeholder="Contoh: B 1234 CD" value={form.nomor_polisi || ""} onChange={e => handleInputChange('nomor_polisi', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-blue-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Warna</label>
                                        <input type="text" placeholder="Contoh: Hitam Metalik" value={form.warna || ""} onChange={e => handleInputChange('warna', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-blue-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bahan Bakar</label>
                                        <input type="text" placeholder="Contoh: Bensin / Diesel" value={form.bahan_bakar || ""} onChange={e => handleInputChange('bahan_bakar', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-blue-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kapasitas Mesin</label>
                                        <input type="text" placeholder="Contoh: 2.2L Diesel" value={form.kapasitas_mesin || ""} onChange={e => handleInputChange('kapasitas_mesin', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-blue-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status Dokumen (STNK/BPKB)</label>
                                        <select value={form.status_dokumen || ""} onChange={e => handleInputChange('status_dokumen', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-blue-500 outline-none transition-all">
                                            <option value="" className="bg-slate-900">Pilih Status Dokumen</option>
                                            <option value="STNK" className="bg-slate-900">STNK</option>
                                            <option value="BPKB" className="bg-slate-900">BPKB</option>
                                            <option value="STNK & BPKB" className="bg-slate-900">STNK & BPKB</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kondisi</label>
                                        <select value={form.kondisi || ""} onChange={e => handleInputChange('kondisi', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-blue-500 outline-none transition-all">
                                            <option value="" className="bg-slate-900">Pilih Kondisi</option>
                                            <option value="Baik" className="bg-slate-900">Baik</option>
                                            <option value="Sedang" className="bg-slate-900">Sedang</option>
                                            <option value="Perlu Perbaikan" className="bg-slate-900">Perlu Perbaikan</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Lokasi Unit</label>
                                    <input type="text" placeholder="Contoh: Jakarta Utara" value={form.lokasi_mobil || ""} onChange={e => handleInputChange('lokasi_mobil', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-blue-500 outline-none transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Deskripsi</label>
                                    <textarea value={form.deskripsi} onChange={e => handleInputChange('deskripsi', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium h-32 focus:border-blue-500 outline-none transition-all resize-none" required />
                                </div>
                                {/* ─── FOTO COVER ─── */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Foto Cover</label>
                                        <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Rasio 16:9 · Landscape</span>
                                    </div>
                                    <p className="text-[9px] text-gray-500 font-medium">Foto utama yang tampil sebagai thumbnail di halaman jelajahi. Gunakan foto eksterior terbaik.</p>
                                    <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all overflow-hidden group">
                                        {coverPreview ? (
                                            <>
                                                <img src={coverPreview} alt="Cover preview" className="absolute inset-0 w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Ganti Foto</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Pilih Foto Cover</span>
                                                <span className="text-[9px]">JPG, PNG, WEBP · Maks 5MB</span>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" className="hidden" onChange={e => {
                                            const file = e.target.files?.[0] || null;
                                            setSelectedFile(file);
                                            if (file) setCoverPreview(URL.createObjectURL(file));
                                            else setCoverPreview(null);
                                        }} />
                                    </label>
                                    {form.image_url && !coverPreview && (
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                                            <img src={form.image_url} alt="Current cover" className="w-10 h-7 object-cover rounded" />
                                            <span className="text-[9px] text-gray-400 font-medium">Foto cover saat ini (akan diganti jika pilih foto baru)</span>
                                        </div>
                                    )}
                                </div>

                                {/* ─── FOTO GALERI (INTERIOR) ─── */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Foto Galeri Interior</label>
                                        <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">Rasio 16:9 · Maks 5 Foto</span>
                                    </div>
                                    <p className="text-[9px] text-gray-500 font-medium">Foto tambahan (dashboard, jok, bagasi, dll). Gunakan rasio 16:9 agar seragam dengan foto cover.</p>
                                    {galleryPreviews.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {galleryPreviews.map((src, idx) => (
                                                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                                                    <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newFiles = selectedGalleryFiles.filter((_, i) => i !== idx);
                                                            const newPreviews = galleryPreviews.filter((_, i) => i !== idx);
                                                            setSelectedGalleryFiles(newFiles);
                                                            setGalleryPreviews(newPreviews);
                                                        }}
                                                        className="absolute top-1 right-1 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3 text-white" />
                                                    </button>
                                                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                                        {idx === 0 ? 'Foto 1' : `Foto ${idx + 1}`}
                                                    </div>
                                                </div>
                                            ))}
                                            {galleryPreviews.length < 5 && (
                                                <label className="relative aspect-video rounded-lg border-2 border-dashed border-white/15 flex items-center justify-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all">
                                                    <div className="flex flex-col items-center gap-1 text-gray-600">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                                                        <span className="text-[8px] font-black uppercase">Tambah</span>
                                                    </div>
                                                    <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                                                        const files = Array.from(e.target.files || []);
                                                        const remaining = 5 - selectedGalleryFiles.length;
                                                        const toAdd = files.slice(0, remaining);
                                                        setSelectedGalleryFiles(prev => [...prev, ...toAdd]);
                                                        setGalleryPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))]);
                                                    }} />
                                                </label>
                                            )}
                                        </div>
                                    )}
                                    {galleryPreviews.length === 0 && (
                                        <label className="relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group">
                                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                                <div className="flex gap-1.5">
                                                    {[0,1,2].map(i => <div key={i} className="w-8 h-5 rounded bg-white/5 border border-white/10" />)}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Pilih Foto Galeri</span>
                                                <span className="text-[9px]">Pilih beberapa sekaligus · Maks 5 foto</span>
                                            </div>
                                            <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                                                const files = Array.from(e.target.files || []).slice(0, 5);
                                                setSelectedGalleryFiles(files);
                                                setGalleryPreviews(files.map(f => URL.createObjectURL(f)));
                                            }} />
                                        </label>
                                    )}
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
