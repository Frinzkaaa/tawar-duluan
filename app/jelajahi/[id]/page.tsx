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
    Car,
    ShieldCheck,
    History,
    Info,
    ChevronRight,
    Clock,
    Trophy,
    ArrowLeft,
    ChevronLeft,
    AlertCircle,
    CreditCard,
    CheckCircle2,
    QrCode,
    Wallet,
    Building2,
    X,
    Copy,
    ExternalLink as LinkIcon
} from 'lucide-react';

interface Bid {
    id: string;
    bidAmount: number;
    createdAt: string;
    user: {
        name: string;
    };
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
            } catch (err) {
                setHasDeposit(false);
            }
        };

        if (id) {
            fetchDetail();
            checkDeposit();
        }
    }, [id]);

    const handlePayDeposit = async () => {
        setShowPaymentModal(true);
        setPaymentStep('methods');
    };

    const initiatePayment = async (method: string) => {
        setIsPaying(true);
        setSelectedMethod(method);
        try {
            const res = await fetch('/api/payment/deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentMethod: method })
            });
            const data = await res.json();
            if (data.success) {
                setCurrentOrderId(data.orderId);
                setPaymentStep('details');
            }
        } catch (err) {
            alert("Gagal memulai pembayaran");
        } finally {
            setIsPaying(false);
        }
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
                setTimeout(() => {
                    setHasDeposit(true);
                    setShowPaymentModal(false);
                }, 2000);
            }
        } catch (err) {
            alert("Gagal konfirmasi");
        } finally {
            setIsPaying(false);
        }
    };

    const handleBid = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        if (bidAmount <= product.harga_awal) {
            alert('Tawaran harus lebih tinggi dari harga awal!');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/bids', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ produkId: product.id, bidAmount })
            });

            if (res.ok) {
                alert('Tawaran berhasil diajukan!');
                window.location.reload();
            } else {
                const err = await res.json();
                if (err.requireDeposit) {
                    // Trigger deposit pay call automatically or show alert
                    if (confirm(err.message)) {
                        handlePayDeposit();
                    }
                } else {
                    alert(err.error || 'Gagal mengajukan tawaran');
                }
            }
        } catch (err) {
            alert('Terjadi kesalahan');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 uppercase tracking-widest text-sm font-bold text-blue-600">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading Experience...</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
                <button
                    onClick={() => router.push('/jelajahi')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                    Kembali ke Jelajahi
                </button>
            </div>
        );
    }

    const allImages = [product.image_url, ...(product.images || [])].filter(Boolean) as string[];



    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen pt-20 pb-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Breadcrumb & Navigation */}
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-4">
                        <button onClick={() => router.push('/jelajahi')} className="flex items-center hover:text-blue-600 transition-colors uppercase font-bold tracking-tight">
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Kembali</span>
                        </button>
                        <span>/</span>
                        <span className="text-gray-900 font-bold truncate uppercase tracking-tight">{product.nama_barang}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Column: Gallery */}
                        <div className="lg:col-span-7 space-y-3">
                            <div className="relative aspect-[16/9] bg-gray-200 rounded-2xl overflow-hidden shadow-lg group">
                                <img
                                    src={activeImage}
                                    alt={product.nama_barang}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-blue-600 text-[10px] text-white font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wider">
                                        HOT UNIT
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 shadow-sm ${activeImage === img ? 'border-blue-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="Spec" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Specification Summary Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                    <Gauge className="w-5 h-5 text-blue-600 mb-1.5" />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Kilometer</span>
                                    <span className="text-xs font-black text-gray-900 tracking-tight">{product.kilometer?.toLocaleString()} km</span>
                                </div>
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                    <Settings className="w-5 h-5 text-blue-600 mb-1.5" />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Transmisi</span>
                                    <span className="text-xs font-black text-gray-900 capitalize tracking-tight">{product.transmisi}</span>
                                </div>
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                    <Calendar className="w-5 h-5 text-blue-600 mb-1.5" />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Tahun</span>
                                    <span className="text-xs font-black text-gray-900 tracking-tight">{product.tahun}</span>
                                </div>
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                    <Users className="w-5 h-5 text-blue-600 mb-1.5" />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Kursi</span>
                                    <span className="text-xs font-black text-gray-900 tracking-tight">{product.jumlah_seat}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Information & Bidding */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="mb-4">
                                    <span className="text-blue-600 font-black text-[10px] tracking-widest uppercase mb-1.5 block">
                                        {product.merk_mobil} {product.tipe_mobil}
                                    </span>
                                    <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2 tracking-tighter">
                                        {product.nama_barang}
                                    </h1>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Lelang berakhir: {new Date(product.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 rounded-xl p-5 mb-6 border border-blue-50">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-wider">Harga Saat Ini</p>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
                                                Rp {product.harga_awal.toLocaleString('id-ID')}
                                            </h2>
                                        </div>
                                        <div className="text-right">
                                            <div className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-green-200 inline-block uppercase tracking-wider">
                                                {product.bids.length} Tawaran
                                            </div>
                                        </div>
                                    </div>

                                    {hasDeposit === false ? (
                                        <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-5 text-center space-y-3">
                                            <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto">
                                                <AlertCircle className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-sm tracking-tight">Aktivasi Akun Lelang</h4>
                                                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Deposit Rp 5.000.000 untuk menawar.</p>
                                            </div>
                                            <button
                                                onClick={handlePayDeposit}
                                                disabled={isPaying}
                                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-orange-900/10"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                {isPaying ? 'Memproses...' : 'Bayar Jaminan'}
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleBid} className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1.5 block tracking-widest">Minimal Rp {(product.harga_awal + 500000).toLocaleString('id-ID')}</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-sm">Rp</span>
                                                    <input
                                                        type="number"
                                                        value={bidAmount}
                                                        onChange={(e) => setBidAmount(parseInt(e.target.value))}
                                                        className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-11 pr-4 font-black text-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all shadow-sm"
                                                        placeholder="Harga..."
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full bg-[#0138C9] hover:bg-blue-700 text-white font-black py-3.5 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                                            >
                                                {submitting ? 'Mengirim...' : 'Ajukan Tawaran'}
                                                {!submitting && <ChevronRight className="w-4 h-4" />}
                                            </button>
                                        </form>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer group">
                                        <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Unit Terverifikasi</h4>
                                            <p className="text-xs text-gray-500">Telah melewati pengecekan 175+ titik inspeksi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Section (Tabs) */}
                    <div className="mt-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="flex border-b border-gray-100 p-2 gap-2 bg-gray-50/50">
                            <button
                                onClick={() => setActiveTab('specs')}
                                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'specs' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <Info className="w-4 h-4" />
                                Spesifikasi
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <History className="w-4 h-4" />
                                Riwayat Bid
                            </button>
                            <button
                                onClick={() => setActiveTab('desc')}
                                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'desc' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <Car className="w-4 h-4" />
                                Deskripsi
                            </button>
                        </div>

                        <div className="p-8">
                            {activeTab === 'specs' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                            Detail Teknis
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between py-3 border-b border-gray-50">
                                                <span className="text-gray-500">Merk</span>
                                                <span className="font-bold text-gray-900">{product.merk_mobil || '-'}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-50">
                                                <span className="text-gray-500">Model</span>
                                                <span className="font-bold text-gray-900">{product.tipe_mobil || '-'}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-50">
                                                <span className="text-gray-500">Mesin</span>
                                                <span className="font-bold text-gray-900">{product.mesin || 'Standard Engineering'}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-50">
                                                <span className="text-gray-500">Transmisi</span>
                                                <span className="font-bold text-gray-900 capitalize">{product.transmisi || '-'}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-50">
                                                <span className="text-gray-500">Kilometer</span>
                                                <span className="font-bold text-gray-900">{product.kilometer?.toLocaleString()} km</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                                            Kondisi & Interior
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between py-3 border-b border-gray-50">
                                                <span className="text-gray-500">Kondisi Interior</span>
                                                <span className="font-bold text-gray-900">{product.interior || 'Sangat Baik (Original)'}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-50">
                                                <span className="text-gray-500">Riwayat Servis</span>
                                                <span className="font-bold text-gray-900">{product.riwayat_servis || 'Servis Rutin Bengkel Resmi'}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-50">
                                                <span className="text-gray-500">Nomor Polisi</span>
                                                <span className="font-bold text-gray-900">Genap (WBP)</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-50">
                                                <span className="text-gray-500">Pajak Tahunan</span>
                                                <span className="font-bold text-gray-900">Hidup (Mei 2025)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">Log Penawaran Terkini</h3>
                                        <span className="text-sm text-gray-500">{product.bids.length} penawaran masuk</span>
                                    </div>

                                    {product.bids.length > 0 ? (
                                        <div className="space-y-3">
                                            {product.bids.map((bid, idx) => (
                                                <div key={bid.id} className={`flex items-center justify-between p-4 rounded-2xl border ${idx === 0 ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-100'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${idx === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                                            {idx === 0 ? <Trophy className="w-5 h-5" /> : idx + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{bid.user.name}</p>
                                                            <p className="text-xs text-gray-500">{new Date(bid.createdAt).toLocaleString('id-ID')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-lg font-extrabold ${idx === 0 ? 'text-blue-700' : 'text-gray-900'}`}>
                                                            Rp {bid.bidAmount.toLocaleString('id-ID')}
                                                        </p>
                                                        {idx === 0 && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">Tertinggi</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center">
                                            <History className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                            <p className="text-gray-500">Belum ada penawaran. Jadilah yang pertama!</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'desc' && (
                                <div className="prose prose-blue max-w-none">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ringkasan Produk</h3>
                                    <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {product.deskripsi}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {/* Custom Internal Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isPaying && setShowPaymentModal(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Uang Jaminan Lelang</h3>
                                <p className="text-xs text-gray-500">Deposit satu kali untuk akses bid selamanya</p>
                            </div>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8">
                            {paymentStep === 'methods' && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-2xl flex justify-between items-center">
                                        <span className="text-sm font-bold text-blue-700">Total Pembayaran</span>
                                        <span className="text-xl font-extrabold text-blue-800">Rp 5.000.000</span>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pilih Metode Pembayaran</p>
                                        <button
                                            onClick={() => initiatePayment('QRIS')}
                                            className="w-full p-4 border border-gray-100 rounded-2xl flex items-center justify-between hover:border-blue-600 hover:bg-blue-50/50 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-purple-100 p-3 rounded-xl">
                                                    <QrCode className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-gray-900">QRIS / E-Wallet</p>
                                                    <p className="text-xs text-gray-500">GoPay, OVO, ShopeePay</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600" />
                                        </button>

                                        <button
                                            onClick={() => initiatePayment('VA_BCA')}
                                            className="w-full p-4 border border-gray-100 rounded-2xl flex items-center justify-between hover:border-blue-600 hover:bg-blue-50/50 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-blue-100 p-3 rounded-xl">
                                                    <Building2 className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-gray-900">Bank Transfer (BCA)</p>
                                                    <p className="text-xs text-gray-500">Virtual Account</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {paymentStep === 'details' && (
                                <div className="text-center space-y-6">
                                    {selectedMethod === 'QRIS' ? (
                                        <>
                                            <div className="mx-auto w-48 h-48 bg-gray-50 rounded-2xl p-4 flex items-center justify-center border-2 border-dashed border-gray-200">
                                                <div className="text-center">
                                                    <QrCode className="w-32 h-32 text-gray-300 mx-auto" />
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">QR Code Generator</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Scan QRIS Untuk Membayar</h4>
                                                <p className="text-sm text-gray-500 mt-1">Berlaku untuk semua aplikasi pembayaran digital</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 p-6 rounded-2xl">
                                                <p className="text-xs text-blue-600 font-bold uppercase mb-2">Virtual Account Number (BCA)</p>
                                                <div className="flex items-center justify-center gap-3">
                                                    <span className="text-3xl font-black text-blue-900 tracking-wider">8831 0982 7716</span>
                                                    <button className="p-2 hover:bg-blue-100 rounded-full transition-colors">
                                                        <Copy className="w-5 h-5 text-blue-600" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-left text-sm text-gray-600 space-y-2">
                                                <p className="font-bold text-gray-900">Cara Bayar:</p>
                                                <p>1. Login ke M-BCA</p>
                                                <p>2. Pilih m-Transfer &gt; BCA Virtual Account</p>
                                                <p>3. Masukkan nomor VA di atas</p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={confirmPaymentSuccess}
                                        disabled={isPaying}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isPaying ? 'Memverifikasi...' : 'Saya Sudah Bayar'}
                                    </button>
                                </div>
                            )}

                            {paymentStep === 'success' && (
                                <div className="text-center py-10 space-y-6 animate-in zoom-in duration-500">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                        <CheckCircle2 className="w-16 h-16" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900">Pembayaran Berhasil!</h3>
                                        <p className="text-gray-500 mt-2">Akun Anda telah teraktivasi. Sekarang Anda bebas mengajukan penawaran pada semua unit!</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-400 font-medium">
                                        Mengalihkan dalam 2 detik...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {paymentStep !== 'success' && (
                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Pembayaran Aman & Terenkripsi 256-bit</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
