"use client";

import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Bid {
  id: string;
  bidAmount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  produk: {
    id: string;
    nama_barang: string;
    harga_awal: number;
  };
}

export default function AdminBidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"semua" | "pending" | "approved" | "rejected">("pending");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const res = await fetch("/api/bids/admin");
      if (!res.ok) throw new Error("Gagal mengambil data bid");
      const data = await res.json();
      setBids(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching bids:", error);
      setMessage({ type: "error", text: "Gagal memuat data bid" });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bidId: string) => {
    setIsProcessing(bidId);
    try {
      const res = await fetch(`/api/bids/${bidId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      if (!res.ok) throw new Error("Gagal approve bid");

      setMessage({ type: "success", text: "Bid berhasil di-approve!" });
      fetchBids();
    } catch (error) {
      console.error("Error approving bid:", error);
      setMessage({ type: "error", text: "Gagal approve bid" });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (bidId: string) => {
    setIsProcessing(bidId);
    try {
      const res = await fetch(`/api/bids/${bidId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (!res.ok) throw new Error("Gagal reject bid");

      setMessage({ type: "success", text: "Bid berhasil di-reject!" });
      fetchBids();
    } catch (error) {
      console.error("Error rejecting bid:", error);
      setMessage({ type: "error", text: "Gagal reject bid" });
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredBids = activeFilter === "semua"
    ? bids
    : bids.filter(b => b.status === activeFilter);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return { bg: "bg-green-300", text: "text-green-900", label: "Disetujui" };
      case "rejected":
        return { bg: "bg-red-300", text: "text-red-900", label: "Ditolak" };
      case "pending":
      default:
        return { bg: "bg-yellow-300", text: "text-yellow-900", label: "Menunggu" };
    }
  };

  return (
    <main className="flex-1 p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-tighter">Manajemen Bid</h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest opacity-60">Kelola tawaran lelang dari user</p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-xl flex items-center gap-3 ${message.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-[11px] font-bold uppercase tracking-tight">{message.text}</p>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(["semua", "pending", "approved", "rejected"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === filter
                  ? "bg-white text-blue-900"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
            >
              {filter === "semua" ? "SEMUA" : filter === "pending" ? "MENUNGGU" : filter === "approved" ? "DISETUJUI" : "DITOLAK"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 font-black text-[9px] text-gray-400 uppercase tracking-[0.2em]">
                  <th className="py-4 px-4">User</th>
                  <th className="py-4 px-4">Produk</th>
                  <th className="py-4 px-4 text-right">Harga Awal</th>
                  <th className="py-4 px-4 text-right">Nilai Bid</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4">Tanggal</th>
                  <th className="py-4 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-300 mb-2" />
                      <p className="text-blue-300">Memuat data bid...</p>
                    </td>
                  </tr>
                ) : filteredBids.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">Tidak ada bid.</td>
                  </tr>
                ) : (
                  filteredBids.map((bid) => {
                    const statusColor = getStatusColor(bid.status);
                    return (
                      <tr key={bid.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <p className="text-xs font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{bid.user.name}</p>
                            <p className="text-[9px] font-bold text-gray-500 uppercase">{bid.user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tight">{bid.produk.nama_barang}</p>
                        </td>
                        <td className="py-3 px-4 text-right text-xs font-medium text-gray-400">{formatRupiah(bid.produk.harga_awal)}</td>
                        <td className="py-3 px-4 text-right text-xs font-black text-green-400 tracking-tight">{formatRupiah(bid.bidAmount)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${statusColor.bg} ${statusColor.text} ${statusColor.bg.replace('bg-', 'border-').replace('300', '400')}`}>
                            {statusColor.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase">
                          {new Date(bid.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {bid.status === "pending" ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleApprove(bid.id)}
                                disabled={isProcessing === bid.id}
                                className="p-1.5 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm active:scale-90"
                                title="Approve"
                              >
                                {isProcessing === bid.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(bid.id)}
                                disabled={isProcessing === bid.id}
                                className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                                title="Reject"
                              >
                                {isProcessing === bid.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
