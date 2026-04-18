"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import {
    Calendar,
    Gauge,
    Settings,
    Users,
    History,
    ChevronRight,
    Clock,
    Trophy,
    ChevronLeft,
    AlertCircle,
    CheckCircle2,
    QrCode,
    Building2,
    X,
    Copy,
    FileText,
    Wrench,
    Armchair,
} from 'lucide-react';

interface Bid {
    id: string;
    bidAmount: number;
    createdAt: string;
    user: { name: string };
}

interface Product {
    id: string;
    nama_barang: string;
    deskripsi: string;
    harga_awal: number;
    tanggal: string;
    image_url?: string;
    images: string[];
    merk_mobil?: string;
    tipe_mobil?: string;
    transmisi?: string;
    jumlah_seat?: number;
    tahun?: number;
    kilometer?: number;
    mesin?: string;
    interior?: string;
    riwayat_servis?: string;
    bids: Bid[];
}

export default function DetailProdukPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'specs' | 'history' | 'desc'>('specs');
    const [activeImage, setActiveImage] = useState<string>('');
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);
    const [hasDeposit, setHasDeposit] = useState<boolean | null>(null);
    const [isPaying, setIsPaying] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'methods' | 'details' | 'success'>('methods');
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`/api/produk/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    setActiveImage(data.image_url || '');
                    setBidAmount(data.harga_awal + 1000000);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const checkDeposit = async () => {
            try {
                const res = await fetch('/api/payment/deposit/status');
                if (res.ok) {
                    const data = await res.json();
                    setHasDeposit(data.hasDeposit);
                }
            } catch { setHasDeposit(false); }
        };
        if (id) { fetchDetail(); checkDeposit(); }
    }, [id]);

    const handlePayDeposit = () => { setShowPaymentModal(true); setPaymentStep('methods'); };

    const initiatePayment = async (method: string) => {
        setIsPaying(true); setSelectedMethod(method);
        try {
            const res = await fetch('/api/payment/deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentMethod: method })
            });
            const data = await res.json();
            if (data.success) { setCurrentOrderId(data.orderId); setPaymentStep('details'); }
        } catch { alert("Gagal memulai pembayaran"); }
        finally { setIsPaying(false); }
    };

    const confirmPaymentSuccess = async () => {
        setIsPaying(true);
        try {
            const res = await fetch('/api/payment/deposit', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: currentOrderId })
            });
            if (res.ok) {
                setPaymentStep('success');
                setTimeout(() => { setHasDeposit(true); setShowPaymentModal(false); }, 2000);
            }
        } catch { alert("Gagal konfirmasi"); }
        finally { setIsPaying(false); }
    };

    const handleBid = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        if (bidAmount <= product.harga_awal) { alert('Tawaran harus lebih tinggi dari harga awal!'); return; }
        setSubmitting(true);
        try {
            const res = await fetch('/api/bids', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ produkId: product.id, bidAmount })
            });
            if (res.ok) { alert('Tawaran berhasil diajukan!'); window.location.reload(); }
            else {
                const err = await res.json();
                if (err.requireDeposit) { if (confirm(err.message)) handlePayDeposit(); }
                else alert(err.error || 'Gagal mengajukan tawaran');
            }
        } catch { alert('Terjadi kesalahan'); }
        finally { setSubmitting(false); }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-500 text-xs font-black uppercase tracking-widest">Memuat...</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <h1 className="text-xl font-black uppercase tracking-tighter text-foreground">Produk tidak ditemukan</h1>
                <button onClick={() => router.push('/jelajahi')} className="mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs">Kembali</button>
            </div>
        );
    }

    const allImages = [product.image_url, ...(product.images || [])].filter(Boolean) as string[];
    const highestBid = product.bids.length > 0 ? Math.max(...product.bids.map(b => b.bidAmount)) : product.harga_awal;

    const specs = [
        { icon: Gauge, label: 'KM', value: product.kilometer ? `${product.kilometer.toLocaleString()} km` : '-' },
        { icon: Settings, label: 'Transmisi', value: product.transmisi || '-' },
        { icon: Calendar, label: 'Tahun', value: product.tahun ? `${product.tahun}` : '-' },
        { icon: Users, label: 'Seat', value: product.jumlah_seat ? `${product.jumlah_seat}` : '-' },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background text-foreground pt-16 pb-16 transition-colors duration-200">
                <div className="max-w-6xl mx-auto px-4 pt-6">

                    {/* Breadcrumb */}
                    <button
                        onClick={() => router.push('/jelajahi')}
                        className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-5 group"
                    >
                        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        Kembali ke Jelajahi
                    </button>

                    {/* MAIN GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* LEFT — Images + Specs */}
                        <div className="lg:col-span-7 space-y-3">
                            <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                                {activeImage
                                    ? <img src={activeImage} alt={product.nama_barang} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase font-black tracking-widest">Tidak ada foto</div>
                                }
                                <div className="absolute top-3 left-3">
                                    <span className="bg-blue-600 text-[9px] text-white font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Unit Unggulan</span>
                                </div>
                            </div>

                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(img)}
                                            className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img ? 'border-blue-500 opacity-100' : 'border-black/5 dark:border-white/10 opacity-50 hover:opacity-80'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-4 gap-2">
                                {specs.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 rounded-xl p-3 flex flex-col items-center text-center gap-1.5 shadow-sm dark:shadow-none">
                                        <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                        <span className="text-[8px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider leading-none">{label}</span>
                                        <span className="text-[11px] font-black text-gray-900 dark:text-white leading-none">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                                <div className="flex border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-transparent">
                                    {(['specs', 'history', 'desc'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-transparent'
                                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                        >
                                            {tab === 'specs' ? 'Spesifikasi' : tab === 'history' ? 'Riwayat Bid' : 'Deskripsi'}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-4 md:p-6">
                                    {activeTab === 'specs' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Wrench className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                                                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Data Fisik</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {[
                                                        { label: 'Merk', value: product.merk_mobil },
                                                        { label: 'Model', value: product.tipe_mobil },
                                                        { label: 'Mesin', value: product.mesin },
                                                        { label: 'Transmisi', value: product.transmisi },
                                                        { label: 'KM', value: product.kilometer ? `${product.kilometer.toLocaleString()} km` : null },
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{item.label}</span>
                                                            <span className="text-xs font-black text-gray-900 dark:text-white uppercase">{item.value || '-'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Armchair className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                                                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Kondisi</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {[
                                                        { label: 'Interior', value: product.interior || 'Grade A (Mulus)' },
                                                        { label: 'Servis', value: product.riwayat_servis || 'Rutin Dealer' },
                                                        { label: 'Plat', value: 'B (Jakarta)' },
                                                        { label: 'Pajak', value: 'Aktif' },
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{item.label}</span>
                                                            <span className="text-xs font-black text-gray-900 dark:text-white uppercase">{item.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'history' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Log Penawaran</span>
                                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{product.bids.length} Total Bid</span>
                                            </div>
                                            {product.bids.length > 0 ? (
                                                <div className="space-y-2">
                                                    {product.bids.map((bid, i) => (
                                                        <div key={bid.id} className={`flex items-center justify-between p-3 rounded-xl border ${i === 0 ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20' : 'bg-white dark:bg-white/[0.02] border-gray-50 dark:border-white/5'}`}>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-400'}`}>
                                                                    {i === 0 ? <Trophy className="w-3.5 h-3.5" /> : i + 1}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{bid.user.name}</p>
                                                                    <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase">{new Date(bid.createdAt).toLocaleString('id-ID')}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className={`text-sm font-black tracking-tighter ${i === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300'}`}>
                                                                    Rp {bid.bidAmount.toLocaleString('id-ID')}
                                                                </p>
                                                                {i === 0 && <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-black uppercase">Tertinggi</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-16 text-center">
                                                    <History className="w-12 h-12 text-gray-100 dark:text-white/5 mx-auto mb-3" />
                                                    <p className="text-gray-400 dark:text-gray-600 uppercase font-black text-[10px] tracking-widest">Belum ada penawaran.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'desc' && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Catatan Unit</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{product.deskripsi}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — Bid card sticky */}
                        <div className="lg:col-span-5">
                            <div className="lg:sticky lg:top-24 bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-xl dark:shadow-none">
                                <div>
                                    <span className="text-blue-600 dark:text-blue-400 font-black text-[10px] tracking-[0.2em] uppercase block mb-1">
                                        {product.merk_mobil} {product.tipe_mobil}
                                    </span>
                                    <h1 className="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">{product.nama_barang}</h1>
                                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                                        <Clock className="w-3 h-3" />
                                        <span>Berakhir: {new Date(product.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-xl p-4">
                                    <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Harga Saat Ini</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                                            Rp {highestBid.toLocaleString('id-ID')}
                                        </span>
                                        <span className="bg-blue-600/5 dark:bg-blue-500/10 border border-blue-600/10 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                            {product.bids.length} Bid
                                        </span>
                                    </div>
                                </div>

                                {hasDeposit === false ? (
                                    <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl p-4 space-y-3 text-center">
                                        <div className="w-9 h-9 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                                            <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight">Butuh Aktivasi</h4>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Bayar jaminan Rp 5.000.000 untuk mulai bidding.</p>
                                        </div>
                                        <button
                                            onClick={handlePayDeposit}
                                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all"
                                        >
                                            Bayar Sekarang
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleBid} className="space-y-3">
                                        <div>
                                            <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1.5">
                                                Minimal: Rp {(product.harga_awal + 500000).toLocaleString('id-ID')}
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-black text-sm">Rp</span>
                                                <input
                                                    type="number"
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(parseInt(e.target.value))}
                                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white rounded-xl py-3 pl-10 pr-4 font-black text-base focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-blue-600 dark:focus:border-blue-500 outline-none transition-all shadow-inner"
                                                    placeholder="Masukkan angka..."
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-[#0138C9] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                        >
                                            {submitting ? 'Memproses...' : 'Ajukan Penawaran'}
                                            {!submitting && <ChevronRight className="w-4 h-4" />}
                                        </button>
                                    </form>
                                )}

                                {product.bids.length > 0 && (
                                    <div className="flex gap-2 pt-1 border-t border-gray-50 dark:border-white/5 pt-4">
                                        <div className="flex-1 bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3 text-center border border-gray-100 dark:border-transparent">
                                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">Penawar</p>
                                            <p className="text-sm font-black text-gray-900 dark:text-white mt-0.5">{product.bids.length}</p>
                                        </div>
                                        <div className="flex-1 bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3 text-center border border-gray-100 dark:border-transparent">
                                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">Bid Tertinggi</p>
                                            <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">Rp {(highestBid / 1000000).toFixed(0)}jt</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {/* PAYMENT MODAL */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm" onClick={() => !isPaying && setShowPaymentModal(false)} />
                    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-transparent">
                            <div>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Uang Jaminan</h3>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-tight mt-0.5">Deposit per akun</p>
                            </div>
                            <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6">
                            {paymentStep === 'methods' && (
                                <div className="space-y-5">
                                    <div className="bg-blue-600 p-5 rounded-xl text-center shadow-lg shadow-blue-500/20">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-100 block mb-1 opacity-70">Total Pembayaran</span>
                                        <span className="text-2xl font-black text-white tracking-tighter">Rp 5.000.000</span>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Pilih Metode</p>
                                        <button onClick={() => initiatePayment('QRIS')} className="w-full p-3.5 border border-gray-100 dark:border-white/10 rounded-xl flex items-center justify-between hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-purple-100 dark:bg-purple-500/10 p-2.5 rounded-xl"><QrCode className="w-4 h-4 text-purple-600 dark:text-purple-400" /></div>
                                                <div className="text-left">
                                                    <p className="font-black text-gray-900 dark:text-white text-xs uppercase">QRIS / E-Wallet</p>
                                                    <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase">GoPay, ShopeePay, OVO</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                        </button>
                                        <button onClick={() => initiatePayment('VA_BCA')} className="w-full p-3.5 border border-gray-100 dark:border-white/10 rounded-xl flex items-center justify-between hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-100 dark:bg-blue-500/10 p-2.5 rounded-xl"><Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>
                                                <div className="text-left">
                                                    <p className="font-black text-gray-900 dark:text-white text-xs uppercase">Virtual Account</p>
                                                    <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase">ATM, M-Banking (BCA)</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {paymentStep === 'details' && (
                                <div className="text-center space-y-6">
                                    {selectedMethod === 'QRIS' ? (
                                        <div className="space-y-4">
                                            <div className="mx-auto w-36 h-36 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center border border-gray-100 dark:border-white/10 font-bold text-gray-300">
                                                <QrCode className="w-24 h-24 opacity-20" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-widest">Scan untuk Bayar</p>
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase">Berlaku 15 menit</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-white/5 p-5 rounded-xl">
                                                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Virtual Account BCA</p>
                                                <div className="flex items-center justify-center gap-3">
                                                    <span className="text-2xl font-black text-gray-900 dark:text-white tracking-widest">8831 0982 7716</span>
                                                    <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"><Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" /></button>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50/50 dark:bg-white/5 p-4 rounded-xl text-left space-y-2 border border-blue-50 dark:border-transparent">
                                                <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Instruksi:</p>
                                                <div className="text-[10px] text-gray-400 dark:text-gray-500 space-y-1.5 uppercase font-medium">
                                                    <p>1. Menu m-Transfer → BCA Virtual Account</p>
                                                    <p>2. Paste nomor VA di atas</p>
                                                    <p>3. Konfirmasi nama akun TDI</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        onClick={confirmPaymentSuccess}
                                        disabled={isPaying}
                                        className="w-full bg-blue-600 hover:bg-black text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20"
                                    >
                                        {isPaying ? 'Memverifikasi...' : 'Saya Sudah Bayar'}
                                    </button>
                                </div>
                            )}

                            {paymentStep === 'success' && (
                                <div className="text-center py-10 space-y-4">
                                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Sukses!</h3>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed px-4 uppercase font-bold tracking-tight">Akun Anda telah teraktivasi. Jaminan tersimpan aman.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
