
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  Timer
} from "lucide-react";

interface Bid {
  id: string;
  bidAmount: number;
  status: string; // pending, approved, rejected
  paymentStatus: string; // unpaid, paid
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

export default function MyBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [paymentStep, setPaymentStep] = useState('summary'); // summary, process, success
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [pickupOption, setPickupOption] = useState<string | null>(null);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const res = await fetch('/api/bids');
      if (res.ok) {
        const data = await res.json();
        setBids(data);
      } else if (res.status === 401) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
    setLoading(false);
  };

  const startPayment = async (bid: Bid) => {
    setSelectedBid(bid);
    setPaymentStep('summary');
    setShowPaymentModal(true);
  };

  const handlePayNow = async () => {
    if (!selectedBid) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payment/auction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId: selectedBid.id })
      });
      const data = await res.json();
      if (data.success) {
        setOrderId(data.orderId);
        setPaymentStep('process');
      }
    } catch (err) {
      alert("Gagal memulai pembayaran");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmPayment = async () => {
    if (!selectedBid || !orderId) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payment/auction', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, bidId: selectedBid.id })
      });
      if (res.ok) {
        setPaymentStep('success');
        fetchBids(); // Refresh status
      }
    } catch (err) {
      alert("Konfirmasi pembayaran gagal");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 mt-12 pt-20 pb-24">
        {/* Rich Header Section */}
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
            <p className="text-gray-500 font-black text-xl">Menghubungkan ke pusat data...</p>
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[48px] shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Timer className="w-16 h-16 text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Belum Ada Aktivitas</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-10 text-lg font-medium leading-relaxed">
              Anda belum pernah mengajukan penawaran. Ayo temukan mobil pertama Anda dan rasakan sensasi lelang sesungguhnya!
            </p>
            <Link
              href="/jelajahi"
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-black text-white font-black py-5 px-12 rounded-[24px] shadow-2xl shadow-blue-200 transition-all hover:scale-105 active:scale-95"
            >
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
                {/* Status Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${bid.status === 'approved' ? 'bg-emerald-500' :
                  bid.status === 'rejected' ? 'bg-red-500' : 'bg-orange-400'
                  }`} />

                <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">

                  {/* Left: Image */}
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

                  {/* Center: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${bid.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        bid.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                        {bid.status === 'approved' ? 'Sudah Disetujui' :
                          bid.status === 'rejected' ? 'Tawaran Gagal' : 'Menunggu Approval'}
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
                        <div className={`flex items-center gap-1.5 font-black text-xs ${bid.status === 'approved' ? 'text-emerald-600' :
                          bid.status === 'rejected' ? 'text-red-500' : 'text-orange-500'
                          }`}>
                          {bid.status === 'approved' ? <Trophy className="w-3 h-3" /> :
                            bid.status === 'rejected' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {bid.status === 'approved' ? 'MENANG' :
                            bid.status === 'rejected' ? 'KALAH' : 'DIPROSES'}
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

                  {/* Right: Actions */}
                  <div className="w-full lg:w-48 shrink-0 flex flex-col gap-2">
                    {bid.status === 'approved' && bid.paymentStatus === 'unpaid' && (
                      <button
                        onClick={() => startPayment(bid)}
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
                            <p className="text-[8px] font-black uppercase tracking-widest mb-0.5">Berhasil</p>
                            <p className="text-[10px] font-bold leading-tight">Unit ini milik Anda!</p>
                          </div>
                        </div>

                        {!pickupOption ? (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setPickupOption('self')}
                              className="flex flex-col items-center justify-center p-2.5 bg-gray-50 hover:bg-white hover:border-blue-600 border-2 border-transparent rounded-xl transition-all group/btn"
                            >
                              <MapPin className="w-4 h-4 text-blue-600 mb-1 group-hover/btn:scale-110 transition-transform" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Pickup</span>
                            </button>
                            <button
                              onClick={() => setPickupOption('delivery')}
                              className="flex flex-col items-center justify-center p-2.5 bg-gray-50 hover:bg-white hover:border-emerald-500 border-2 border-transparent rounded-xl transition-all group/btn"
                            >
                              <Truck className="w-4 h-4 text-emerald-500 mb-1 group-hover/btn:scale-110 transition-transform" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Delivery</span>
                            </button>
                          </div>
                        ) : pickupOption === 'self' ? (
                          <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-1.5 text-blue-700 font-black text-[9px] uppercase tracking-widest mb-2">
                              <MapPin className="w-3.5 h-3.5" />
                              Lokasi
                            </div>
                            <p className="text-[10px] font-bold text-gray-800 leading-normal mb-3">
                              {bid.produk.lokasi_mobil || "Showroom TDI Central, Bekasi."}
                            </p>
                            <button
                              onClick={() => setPickupOption(null)}
                              className="text-[9px] font-black text-blue-600 hover:underline uppercase tracking-widest"
                            >
                              Ganti
                            </button>
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-black text-[9px] uppercase tracking-widest mb-2">
                              <Truck className="w-3.5 h-3.5" />
                              Logistik
                            </div>
                            <button
                              onClick={() => {
                                const phone = SITE_CONFIG?.adminWhatsApp || "";
                                const msg = `Halo Admin Tawar Duluan, saya ingin koordinasi pengiriman untuk unit ${bid.produk.nama_barang} yang telah saya menangkan.`;
                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
                              }}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest transition-all shadow-md shadow-emerald-200 mb-3"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Hubungi
                            </button>
                            <button
                              onClick={() => setPickupOption(null)}
                              className="w-full text-[9px] font-black text-emerald-600 hover:underline uppercase tracking-widest text-center"
                            >
                              Ganti
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <Link
                      href={`/jelajahi/${bid.produk.id}`}
                      className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest"
                    >
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

      {/* Payment Modal */}
      {showPaymentModal && selectedBid && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !isProcessing && setShowPaymentModal(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              {paymentStep === 'summary' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-3">
                    <Trophy className="w-3.5 h-3.5" />
                    Final Check-out
                  </div>
                  <h2 className="text-2xl font-black mb-1.5 tracking-tighter">Pelunasan Lelang</h2>
                  <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">Selesaikan administrasi pembayaran untuk memproses kepemilikan unit Anda.</p>

                  <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-gray-400 font-black uppercase tracking-widest">Unit Lelang</p>
                      <p className="text-gray-900 font-black">{selectedBid.produk.nama_barang}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-gray-400 font-black uppercase tracking-widest">Tawaran Menang</p>
                      <p className="text-gray-900 font-black">Rp {selectedBid.bidAmount.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="flex justify-between items-end">
                      <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Total Bayar</p>
                      <p className="text-2xl font-black text-blue-700 tracking-tighter">Rp {selectedBid.bidAmount.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <button
                    onClick={handlePayNow}
                    disabled={isProcessing}
                    className="w-full bg-[#0138C9] hover:bg-black text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                    Lanjutkan Pembayaran
                  </button>
                </div>
              )}

              {paymentStep === 'process' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 text-center py-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <h2 className="text-2xl font-black mb-1.5 tracking-tighter text-gray-900">Menunggu Transfer</h2>
                  <p className="text-gray-400 font-bold mb-8 uppercase tracking-[0.2em] text-[9px]">Ref: {orderId}</p>

                  <div className="bg-slate-900 p-8 rounded-[32px] mb-8 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <CreditCard className="w-24 h-24" />
                    </div>
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">Virtual Account Number</p>
                    <p className="text-3xl font-black text-white tracking-widest mb-2">8801 0293 8847 221</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">BANK CENTRAL TOWER (BCT)</p>
                  </div>

                  <button
                    onClick={confirmPayment}
                    disabled={isProcessing}
                    className="w-full bg-[#0138C9] hover:bg-black text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest"
                  >
                    {isProcessing ? "Menautkan Data..." : "Konfirmasi Pembayaran"}
                  </button>
                  <button className="mt-4 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-gray-900 transition-colors" onClick={() => setPaymentStep('summary')}>Batalkan / Kembali</button>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 text-center py-6">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-black mb-3 tracking-tighter text-gray-900">Pembayaran Berhasil!</h2>
                  <p className="text-gray-500 text-sm font-medium mb-10 leading-relaxed">Unit **{selectedBid.produk.nama_barang}** resmi telah dilunasi. Logistik kami akan segera menghubungi Anda untuk proses selanjutnya.</p>

                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPickupOption(null);
                    }}
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
