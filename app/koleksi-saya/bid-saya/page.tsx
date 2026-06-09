
"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  CreditCard,
  MapPin,
  Truck,
  MessageCircle,
  AlertCircle,
  Loader2,
  Trophy,
  History,
  Timer,
  X,
} from "lucide-react";

interface Bid {
  id: string;
  bidAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  produk: {
    id: string;
    nama_barang: string;
    harga_awal: number;
    tanggal: string;
    image_url?: string;
    lokasi_mobil?: string;
  };
}

// Extend window for Midtrans Snap
declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess: (result: any) => void;
        onPending: (result: any) => void;
        onError: (result: any) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

export default function MyBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [paymentStep, setPaymentStep] = useState<'summary' | 'success' | 'pending'>('summary');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pickupOption, setPickupOption] = useState<string | null>(null);
  const [snapScriptLoaded, setSnapScriptLoaded] = useState(false);

  // Load Midtrans Snap.js script once
  useEffect(() => {
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
    const snapUrl = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';

    if (document.getElementById('midtrans-snap-script')) {
      setSnapScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'midtrans-snap-script';
    script.src = snapUrl;
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    script.onload = () => setSnapScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const res = await fetch('/api/bids');
      if (res.ok) {
        setBids(await res.json());
      } else if (res.status === 401) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
    setLoading(false);
  };

  const handlePayNow = async (bid: Bid) => {
    setSelectedBid(bid);
    setShowModal(true);
    setPaymentStep('summary');
  };

  const handleLaunchSnap = async () => {
    if (!selectedBid) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/payment/auction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId: selectedBid.id }),
      });

      const data = await res.json();

      if (!data.success || !data.snapToken) {
        alert(data.error || 'Gagal membuat sesi pembayaran');
        return;
      }

      // Tutup modal summary kita, buka Snap popup Midtrans
      setShowModal(false);

      if (!window.snap) {
        alert('Midtrans belum siap, coba refresh halaman.');
        return;
      }

      window.snap.pay(data.snapToken, {
        onSuccess: async (result) => {
          console.log('Midtrans payment success:', result);
          // PATCH untuk konfirmasi di DB kita
          await fetch('/api/payment/auction', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderId, bidId: selectedBid.id }),
          });
          setSelectedBid(selectedBid);
          setPaymentStep('success');
          setShowModal(true);
          fetchBids();
        },
        onPending: (result) => {
          console.log('Midtrans payment pending:', result);
          setPaymentStep('pending');
          setShowModal(true);
        },
        onError: (result) => {
          console.error('Midtrans payment error:', result);
          alert('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: () => {
          console.log('Snap closed without completing payment');
          // Biarkan user kembali ke daftar
        },
      });
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan, coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 mt-12 pt-20 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 text-white p-8 md:p-10 rounded-[32px] shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none rotate-12">
            <Trophy className="w-52 h-52 fill-white" />
          </div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-400/20 rounded-full blur-[100px]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 border border-white/20">
                <History className="w-3 h-3 text-blue-300" />
                Bid Management Console
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter">Riwayat Penawaran</h1>
              <p className="text-blue-100 text-base max-w-xl font-medium opacity-90 leading-relaxed">
                Pantau status bid Anda secara real-time.
              </p>
            </div>
            <div className="flex gap-3 md:flex-col lg:flex-row">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-[24px] border border-white/10 flex flex-col items-center justify-center min-w-[120px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 mb-0.5">Total Bid</p>
                <p className="text-2xl font-black">{bids.length}</p>
              </div>
              <div className="bg-emerald-500/20 backdrop-blur-md p-4 rounded-[24px] border border-emerald-500/20 flex flex-col items-center justify-center min-w-[120px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-300 mb-0.5">Dimenangkan</p>
                <p className="text-2xl font-black">{bids.filter(b => b.status === 'approved').length}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <p className="text-gray-500 font-black text-xl">Memuat data...</p>
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[48px] shadow-xl border border-gray-100">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Timer className="w-16 h-16 text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Belum Ada Aktivitas</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-10 text-lg font-medium leading-relaxed">
              Anda belum pernah mengajukan penawaran. Ayo temukan mobil pertama Anda!
            </p>
            <Link href="/jelajahi" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-black text-white font-black py-5 px-12 rounded-[24px] shadow-2xl shadow-blue-200 transition-all hover:scale-105 active:scale-95">
              Cari Unit Sekarang
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="group relative bg-white rounded-3xl p-4 md:p-5 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-2px] duration-500 overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${bid.status === 'approved' ? 'bg-emerald-500' : bid.status === 'rejected' ? 'bg-red-500' : 'bg-orange-400'}`} />

                <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
                  {/* Image */}
                  <div className="relative w-full lg:w-36 h-28 md:h-32 rounded-2xl overflow-hidden shadow-md border border-gray-100 shrink-0">
                    <img
                      src={bid.produk.image_url || '/images/cars/placeholder.jpg'}
                      alt={bid.produk.nama_barang}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-80 mb-0.5">ID UNIT</p>
                      <p className="text-[10px] font-bold font-mono">#{bid.produk.id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${bid.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : bid.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {bid.status === 'approved' ? 'Sudah Disetujui' : bid.status === 'rejected' ? 'Tawaran Gagal' : 'Menunggu Approval'}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400">•</span>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(bid.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <h2 className="text-base md:text-lg font-black text-gray-900 tracking-tight mb-3 group-hover:text-blue-600 transition-colors">
                      {bid.produk.nama_barang}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Tawaran Anda</p>
                        <p className="text-base font-black text-blue-600 tracking-tight">Rp {bid.bidAmount.toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Status Pemenang</p>
                        <div className={`flex items-center gap-1.5 font-black text-xs ${bid.status === 'approved' ? 'text-emerald-600' : bid.status === 'rejected' ? 'text-red-500' : 'text-orange-500'}`}>
                          {bid.status === 'approved' ? <Trophy className="w-3 h-3" /> : bid.status === 'rejected' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {bid.status === 'approved' ? 'MENANG' : bid.status === 'rejected' ? 'KALAH' : 'DIPROSES'}
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Status Pembayaran</p>
                        <p className={`font-black text-xs ${bid.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-gray-400'}`}>
                          {bid.paymentStatus === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-full lg:w-48 shrink-0 flex flex-col gap-2">
                    {bid.status === 'approved' && bid.paymentStatus === 'unpaid' && (
                      <button
                        onClick={() => handlePayNow(bid)}
                        className="w-full bg-blue-600 hover:bg-black text-white font-black py-2.5 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95 text-xs uppercase tracking-widest"
                      >
                        <CreditCard className="w-4 h-4" />
                        Bayar Sekarang
                      </button>
                    )}

                    {bid.status === 'approved' && bid.paymentStatus === 'paid' && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6 shrink-0" />
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest mb-0.5">Lunas</p>
                            <p className="text-[10px] font-bold leading-tight">Unit ini milik Anda!</p>
                          </div>
                        </div>
                        {!pickupOption ? (
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setPickupOption('self')} className="flex flex-col items-center justify-center p-2.5 bg-gray-50 hover:bg-white hover:border-blue-600 border-2 border-transparent rounded-xl transition-all group/btn">
                              <MapPin className="w-4 h-4 text-blue-600 mb-1 group-hover/btn:scale-110 transition-transform" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Pickup</span>
                            </button>
                            <button onClick={() => setPickupOption('delivery')} className="flex flex-col items-center justify-center p-2.5 bg-gray-50 hover:bg-white hover:border-emerald-500 border-2 border-transparent rounded-xl transition-all group/btn">
                              <Truck className="w-4 h-4 text-emerald-500 mb-1 group-hover/btn:scale-110 transition-transform" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Delivery</span>
                            </button>
                          </div>
                        ) : pickupOption === 'self' ? (
                          <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-1.5 text-blue-700 font-black text-[9px] uppercase tracking-widest mb-2">
                              <MapPin className="w-3.5 h-3.5" />Lokasi
                            </div>
                            <p className="text-[10px] font-bold text-gray-800 leading-normal mb-3">
                              {bid.produk.lokasi_mobil || "Showroom TDI Central, Bekasi."}
                            </p>
                            <button onClick={() => setPickupOption(null)} className="text-[9px] font-black text-blue-600 hover:underline uppercase tracking-widest">Ganti</button>
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-black text-[9px] uppercase tracking-widest mb-2">
                              <Truck className="w-3.5 h-3.5" />Logistik
                            </div>
                            <button
                              onClick={() => {
                                const phone = SITE_CONFIG?.adminWhatsApp || "";
                                const msg = `Halo Admin Tawar Duluan, saya ingin koordinasi pengiriman untuk unit ${bid.produk.nama_barang}.`;
                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
                              }}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest transition-all shadow-md shadow-emerald-200 mb-3"
                            >
                              <MessageCircle className="w-4 h-4" />Hubungi
                            </button>
                            <button onClick={() => setPickupOption(null)} className="w-full text-[9px] font-black text-emerald-600 hover:underline uppercase tracking-widest text-center">Ganti</button>
                          </div>
                        )}
                      </div>
                    )}

                    <Link href={`/jelajahi/${bid.produk.id}`} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest">
                      Detail
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Summary Modal */}
      {showModal && selectedBid && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !isProcessing && setShowModal(false)} />
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              {paymentStep === 'summary' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                  <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>

                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-3">
                    <Trophy className="w-3.5 h-3.5" />
                    Final Check-out
                  </div>
                  <h2 className="text-2xl font-black mb-1 tracking-tighter">Pelunasan Lelang</h2>
                  <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">
                    Klik lanjutkan untuk membuka halaman pembayaran Midtrans.
                  </p>

                  <div className="bg-gray-50 p-5 rounded-2xl mb-6 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-gray-400 font-black uppercase tracking-widest">Unit Lelang</p>
                      <p className="text-gray-900 font-black">{selectedBid.produk.nama_barang}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-gray-400 font-black uppercase tracking-widest">Tawaran Menang</p>
                      <p className="text-gray-900 font-black">Rp {selectedBid.bidAmount.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-emerald-500 font-black uppercase tracking-widest">Potongan Jaminan (DP)</p>
                      <p className="text-emerald-600 font-black">- Rp 500.000</p>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex justify-between items-end">
                      <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Total Pelunasan</p>
                      <p className="text-2xl font-black text-blue-700 tracking-tighter">Rp {(selectedBid.bidAmount - 500000).toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  {/* Payment method badges */}
                  <div className="flex items-center gap-2 mb-6 flex-wrap">
                    {['QRIS', 'Transfer Bank', 'GoPay', 'OVO', 'Dana', 'Kartu Kredit'].map(m => (
                      <span key={m} className="text-[9px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full uppercase tracking-wide">{m}</span>
                    ))}
                  </div>

                  <button
                    onClick={handleLaunchSnap}
                    disabled={isProcessing || !snapScriptLoaded}
                    className="w-full bg-[#0138C9] hover:bg-black text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                    {isProcessing ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                  </button>
                  <p className="text-center text-[9px] text-gray-400 font-bold mt-3">🔒 Pembayaran diproses aman oleh Midtrans</p>
                </div>
              )}

              {paymentStep === 'pending' && (
                <div className="text-center py-4 animate-in fade-in duration-500">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-black mb-2 tracking-tighter">Menunggu Pembayaran</h2>
                  <p className="text-gray-500 text-sm font-medium mb-6">Pembayaran Anda sedang diproses. Silakan selesaikan transaksi sesuai instruksi yang diberikan.</p>
                  <button onClick={() => { setShowModal(false); fetchBids(); }} className="w-full bg-slate-900 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all hover:bg-black">
                    Tutup & Pantau Status
                  </button>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center py-6 animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-black mb-3 tracking-tighter text-gray-900">Pembayaran Berhasil!</h2>
                  <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                    Unit <strong>{selectedBid.produk.nama_barang}</strong> resmi telah dilunasi. Tim kami segera menghubungi Anda.
                  </p>
                  <button
                    onClick={() => { setShowModal(false); setPickupOption(null); }}
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-widest"
                  >
                    Atur Pengambilan Unit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
