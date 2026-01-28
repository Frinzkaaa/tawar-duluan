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
    ChevronLeft,
    AlertCircle,
    CreditCard,
    CheckCircle2,
    QrCode,
    Building2,
    X,
    Copy,
    ArrowLeft
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
                    if (confirm(err.message)) handlePayDeposit();
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
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-black uppercase tracking-tighter">Produk tidak ditemukan</h1>
                <button onClick={() => router.push('/jelajahi')} className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs">Kembali</button>
            </div>
        );
    }

    const allImages = [product.image_url, ...(product.images || [])].filter(Boolean) as string[];

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen pt-20 pb-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-4">
                        <button onClick={() => router.push('/jelajahi')} className="flex items-center hover:text-blue-600 transition-colors uppercase font-bold tracking-tight">
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Kembali</span>
                        </button>
                        <span>/</span>
                        <span className="text-gray-900 font-bold truncate uppercase tracking-tight">{product.nama_barang}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="relative aspect-[16/9] bg-gray-200 rounded-2xl overflow-hidden shadow-xl group">
                                <img src={activeImage} alt={product.nama_barang} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-blue-600 text-[10px] text-white font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">UNIT UNGGULAN</span>
                                </div>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <button key={idx} onClick={() => setActiveImage(img)} className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === img ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                        <img src={img} alt="Spec" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                    <Gauge className="w-6 h-6 text-blue-600 mb-2" />
                                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Kilometer</span>
                                    <span className="text-xs font-black text-gray-900 tracking-tight">{product.kilometer?.toLocaleString()} km</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                    <Settings className="w-6 h-6 text-blue-600 mb-2" />
                                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Transmisi</span>
                                    <span className="text-xs font-black text-gray-900 capitalize tracking-tight">{product.transmisi}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                    <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Tahun</span>
                                    <span className="text-xs font-black text-gray-900 tracking-tight">{product.tahun}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                    <Users className="w-6 h-6 text-blue-600 mb-2" />
                                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Kapasitas</span>
                                    <span className="text-xs font-black text-gray-900 tracking-tight">{product.jumlah_seat} Seat</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 space-y-4">
                            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 h-full">
                                <div className="mb-6">
                                    <span className="text-blue-600 font-black text-[11px] tracking-[0.2em] uppercase mb-2 block">{product.merk_mobil || 'Premium'} {product.tipe_mobil}</span>
                                    <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2 tracking-tighter">{product.nama_barang}</h1>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                                        <Clock className="w-4 h-4" />
                                        <span>Lelang berakhir: {new Date(product.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] rounded-2xl p-6 mb-6 text-white overflow-hidden relative">
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black text-blue-400 uppercase mb-2 tracking-[0.2em]">Harga Saat Ini</p>
                                        <div className="flex justify-between items-end">
                                            <h2 className="text-4xl font-black tracking-tighter text-white">Rp {product.harga_awal.toLocaleString('id-ID')}</h2>
                                            <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">{product.bids.length} BID</div>
                                        </div>
                                    </div>
                                </div>

                                {hasDeposit === false ? (
                                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center space-y-4">
                                        <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto"><AlertCircle className="w-6 h-6 text-orange-600" /></div>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Butuh Aktivasi</h4>
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Bayar jaminan Rp 5.000.000 untuk bidding unit ini.</p>
                                        </div>
                                        <button onClick={handlePayDeposit} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all">BAYAR SEKARANG</button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleBid} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Minimal Bid: Rp {(product.harga_awal + 500000).toLocaleString('id-ID')}</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-base">Rp</span>
                                                <input type="number" value={bidAmount} onChange={(e) => setBidAmount(parseInt(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 font-black text-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-inner" placeholder="Masukkan angka..." />
                                            </div>
                                        </div>
                                        <button type="submit" disabled={submitting} className="w-full bg-[#0138C9] hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                                            {submitting ? 'MEMPROSES...' : 'AJUKAN PENAWARAN'}
                                            {!submitting && <ChevronRight className="w-5 h-5" />}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100">
                        <div className="flex border-b border-gray-100 p-2 gap-2 bg-gray-50/50">
                            {(['specs', 'history', 'desc'] as const).map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:bg-gray-100'}`}>
                                    {tab === 'specs' ? 'Spesifikasi' : tab === 'history' ? 'Riwayat Bid' : 'Deskripsi'}
                                </button>
                            ))}
                        </div>
                        <div className="p-8">
                            {activeTab === 'specs' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-black text-gray-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">DATA FISIK</h3>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Merk', value: product.merk_mobil },
                                                { label: 'Model', value: product.tipe_mobil },
                                                { label: 'Mesin', value: product.mesin || 'Original Standard' },
                                                { label: 'Transmisi', value: product.transmisi },
                                                { label: 'KM', value: `${product.kilometer?.toLocaleString()} km` }
                                            ].map((item, i) => (
                                                <div key={i} className="flex justify-between py-3 border-b border-gray-50 text-sm">
                                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{item.label}</span>
                                                    <span className="font-black text-gray-900 uppercase tracking-tight">{item.value || '-'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-black text-gray-900 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">KONDISI</h3>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Interior', value: product.interior || 'Grade A (Mulus)' },
                                                { label: 'Servis', value: product.riwayat_servis || 'Rutinitas Dealer' },
                                                { label: 'Plat', value: 'B (Jakarta)' },
                                                { label: 'Pajak', value: 'Aktif (Maret 2025)' }
                                            ].map((item, i) => (
                                                <div key={i} className="flex justify-between py-3 border-b border-gray-50 text-sm">
                                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{item.label}</span>
                                                    <span className="font-black text-gray-900 uppercase tracking-tight">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'history' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between"><h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">LOG PENAWARAN</h3><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.bids.length} TOTAL BID</span></div>
                                    {product.bids.length > 0 ? (
                                        <div className="space-y-3">
                                            {product.bids.map((bid, i) => (
                                                <div key={bid.id} className={`flex items-center justify-between p-5 rounded-2xl border ${i === 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${i === 0 ? 'bg-blue-600 shadow-lg' : 'bg-gray-300'}`}>{i === 0 ? <Trophy className="w-5 h-5" /> : i + 1}</div>
                                                        <div><p className="font-black text-gray-900 uppercase text-xs tracking-tight">{bid.user.name}</p><p className="text-[10px] font-bold text-gray-500 uppercase">{new Date(bid.createdAt).toLocaleString('id-ID')}</p></div>
                                                    </div>
                                                    <div className="text-right"><p className={`text-lg font-black tracking-tighter ${i === 0 ? 'text-blue-700' : 'text-gray-900'}`}>Rp {bid.bidAmount.toLocaleString('id-ID')}</p>{i === 0 && <span className="text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">HIGHEST</span>}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center"><History className="w-16 h-16 text-gray-100 mx-auto mb-4" /><p className="text-gray-400 uppercase font-black text-[10px] tracking-widest">Belum ada penawaran.</p></div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'desc' && (
                                <div className="prose prose-blue max-w-none"><h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tighter border-l-4 border-slate-900 pl-4">CATATAN UNIT</h3><div className="text-gray-600 leading-relaxed whitespace-pre-wrap font-medium text-sm">{product.deskripsi}</div></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {showPaymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !isPaying && setShowPaymentModal(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div><h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Uang Jaminan</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Deposit per akun</p></div>
                            <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-white rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="p-8">
                            {paymentStep === 'methods' && (
                                <div className="space-y-6">
                                    <div className="bg-blue-600 p-6 rounded-2xl flex flex-col items-center text-white"><span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Pembayaran</span><span className="text-3xl font-black tracking-tighter">Rp 5.000.000</span></div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Metode Bayar</p>
                                        <button onClick={() => initiatePayment('QRIS')} className="w-full p-4 border border-gray-100 rounded-2xl flex items-center justify-between hover:border-blue-600 hover:bg-blue-50/50 transition-all group">
                                            <div className="flex items-center gap-4"><div className="bg-purple-100 p-3 rounded-xl"><QrCode className="w-5 h-5 text-purple-600" /></div><div className="text-left"><p className="font-black text-gray-900 text-xs uppercase tracking-tight">QRIS / E-WALLET</p><p className="text-[10px] text-gray-400 font-bold uppercase">GoPay, ShopeePay, OVO</p></div></div><ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600" />
                                        </button>
                                        <button onClick={() => initiatePayment('VA_BCA')} className="w-full p-4 border border-gray-100 rounded-2xl flex items-center justify-between hover:border-blue-600 hover:bg-blue-50/50 transition-all group">
                                            <div className="flex items-center gap-4"><div className="bg-blue-100 p-3 rounded-xl"><Building2 className="w-5 h-5 text-blue-600" /></div><div className="text-left"><p className="font-black text-gray-900 text-xs uppercase tracking-tight">VIRTUAL ACCOUNT</p><p className="text-[10px] text-gray-400 font-bold uppercase">ATM, M-Banking (BCA)</p></div></div><ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {paymentStep === 'details' && (
                                <div className="text-center space-y-8 py-4">
                                    {selectedMethod === 'QRIS' ? (
                                        <div className="space-y-6">
                                            <div className="mx-auto w-44 h-44 bg-gray-50 rounded-2xl p-4 flex items-center justify-center border-2 border-dashed border-gray-200"><QrCode className="w-32 h-32 text-gray-200" /></div>
                                            <div><h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">SCAN UNTUK BAYAR</h4><p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Berlaku s/d 15 menit ke depan</p></div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="bg-slate-900 p-8 rounded-2xl text-white">
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50 mb-4">VIRTUAL ACCOUNT (BCA)</p>
                                                <div className="flex items-center justify-center gap-3"><span className="text-3xl font-black tracking-widest">8831 0982 7716</span><button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Copy className="w-4 h-4 text-blue-400" /></button></div>
                                            </div>
                                            <div className="text-left bg-gray-50 p-6 rounded-2xl space-y-3">
                                                <p className="font-black text-[10px] text-gray-900 uppercase tracking-widest">Instruksi:</p>
                                                <div className="text-[10px] text-gray-500 font-bold space-y-2 uppercase leading-relaxed">
                                                    <p>1. Menu m-Transfer &gt; BCA Virtual Account</p>
                                                    <p>2. Paste Nomor VA di atas</p>
                                                    <p>3. Konfirmasi nama akun TDI</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <button onClick={confirmPaymentSuccess} disabled={isPaying} className="w-full bg-blue-600 hover:bg-black text-white font-black py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                                        {isPaying ? 'MEMVERIFIKASI...' : 'SAYA SUDAH BAYAR'}
                                    </button>
                                </div>
                            )}
                            {paymentStep === 'success' && (
                                <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-500">
                                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600"><CheckCircle2 className="w-12 h-12" /></div>
                                    <div><h3 className="text-2xl font-black text-gray-900 tracking-tighter">SUKSES!</h3><p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight mt-2 px-6 leading-relaxed">Akun Anda telah teraktivasi. Jaminan tersimpan aman dalam sistem.</p></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
