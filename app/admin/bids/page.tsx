"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

interface Bid {
  id: string;
  bidAmount: number;
  status: string;
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

export default function AdminBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const res = await fetch("/api/bids/admin"); // We'll need to create this endpoint
      if (res.ok) {
        const data = await res.json();
        setBids(data);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
    setLoading(false);
  };

  const updateBidStatus = async (bidId: string, status: string) => {
    try {
      const res = await fetch(`/api/bids/${bidId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchBids(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating bid:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
        <Clock className="w-8 h-8 mr-3 text-indigo-600" />
        Kelola Tawaran (Bid Management)
      </h1>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <h2 className="text-xl font-semibold p-4 border-b text-gray-800">Daftar Tawaran Pending</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6 text-left">Produk</th>
                <th className="py-3 px-6 text-left">Pembeli</th>
                <th className="py-3 px-6 text-center">Jumlah Tawaran</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-left">Tanggal</th>
                <th className="py-3 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-indigo-500 font-medium">
                    <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" />
                    Mengambil data tawaran...
                  </td>
                </tr>
              ) : bids.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    Tidak ada tawaran pending.
                  </td>
                </tr>
              ) : (
                bids.map((bid) => (
                  <tr
                    key={bid.id}
                    className="border-b last:border-b-0 hover:bg-indigo-50/50 transition duration-150"
                  >
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {bid.produk.nama_barang}
                      <br />
                      <span className="text-xs text-gray-500">
                        Harga awal: Rp {bid.produk.harga_awal.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {bid.user.name}
                      <br />
                      <span className="text-xs text-gray-500">{bid.user.email}</span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-indigo-600">
                      Rp {bid.bidAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          bid.status
                        )}`}
                      >
                        {bid.status === "pending" && <Clock className="w-3 h-3 inline mr-1" />}
                        {bid.status === "approved" && <CheckCircle className="w-3 h-3 inline mr-1" />}
                        {bid.status === "rejected" && <XCircle className="w-3 h-3 inline mr-1" />}
                        {bid.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {new Date(bid.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {bid.status === "pending" && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => updateBidStatus(bid.id, "approved")}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => updateBidStatus(bid.id, "rejected")}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
