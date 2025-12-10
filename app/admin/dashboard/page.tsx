"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  BarChart2,
  ListChecks,
  Clock,
  Hourglass,
  CheckCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface Laporan {
  id: string;
  judul: string;
  status: "Menunggu" | "Diproses" | "Selesai";
  tanggal: string;
  user: string;
}

interface BidStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function HalamanLaporan() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [bidStats, setBidStats] = useState<BidStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch laporan data
      const res = await fetch("/api/laporan");
      if (!res.ok) throw new Error("Gagal mengambil data laporan dari server.");
      const data: Laporan[] = await res.json();
      setLaporan(data);

      // Fetch bid statistics
      const bidRes = await fetch("/api/bids/stats");
      if (bidRes.ok) {
        const bidData: BidStats = await bidRes.json();
        setBidStats(bidData);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setLaporan([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalLaporan = laporan.length;
  const laporanMenunggu = laporan.filter((l) => l.status === "Menunggu").length;
  const laporanProses = laporan.filter((l) => l.status === "Diproses").length;
  const laporanSelesai = laporan.filter((l) => l.status === "Selesai").length;

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
        <BarChart2 className="w-8 h-8 mr-3 text-indigo-600" />
        Dasbor Analitik Laporan & Tawaran
      </h1>

      {/* Laporan Stats */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Statistik Laporan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox
            title="Total Laporan"
            count={totalLaporan}
            color="bg-indigo-600"
            icon={ListChecks}
          />
          <StatBox
            title="Menunggu"
            count={laporanMenunggu}
            color="bg-yellow-500"
            icon={Clock}
          />
          <StatBox
            title="Diproses"
            count={laporanProses}
            color="bg-orange-500"
            icon={Hourglass}
          />
          <StatBox
            title="Selesai"
            count={laporanSelesai}
            color="bg-green-600"
            icon={CheckCircle}
          />
        </div>
      </div>

      {/* Bid Stats */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Statistik Tawaran (Bids)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox
            title="Total Tawaran"
            count={bidStats.total}
            color="bg-blue-600"
            icon={ListChecks}
          />
          <StatBox
            title="Menunggu Persetujuan"
            count={bidStats.pending}
            color="bg-yellow-500"
            icon={Clock}
          />
          <StatBox
            title="Disetujui"
            count={bidStats.approved}
            color="bg-green-600"
            icon={CheckCircle}
          />
          <StatBox
            title="Ditolak"
            count={bidStats.rejected}
            color="bg-red-600"
            icon={CheckCircle}
          />
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <h2 className="text-xl font-semibold p-4 border-b text-gray-800">Daftar Laporan Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6 text-left">Judul</th>
                <th className="py-3 px-6 text-left">Pelapor</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-left">Tanggal</th>
                <th className="py-3 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-indigo-500 font-medium">
                    <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" />
                    Mengambil data...
                  </td>
                </tr>
              ) : laporan.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    Tidak ditemukan laporan.
                  </td>
                </tr>
              ) : (
                laporan.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-b-0 hover:bg-indigo-50/50 transition duration-150 cursor-pointer"
                    onClick={() => router.push(`/admin/laporan/${item.id}`)}
                  >
                    <td className="py-4 px-6 font-medium text-gray-800">{item.judul}</td>
                    <td className="py-4 px-6">{item.user}</td>

                    <td className="py-4 px-6 text-center">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="py-4 px-6">
                      {new Date(item.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <ChevronRight className="w-5 h-5 text-gray-400 inline-block hover:text-indigo-600 transition" />
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

function StatBox({
  title,
  count,
  color,
  icon: Icon,
}: {
  title: string;
  count: number;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <div className={`${color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] flex items-center justify-between`}>
      <div>
        <span className="text-sm opacity-90 uppercase tracking-wider">{title}</span>
        <span className="text-4xl font-extrabold block mt-1">{count}</span>
      </div>
      <Icon className="w-8 h-8 opacity-70" />
    </div>
  );
}

function StatusBadge({ status }: { status: "Menunggu" | "Diproses" | "Selesai" }) {
  let colorClass = "";

  switch (status) {
    case "Menunggu":
      colorClass = "bg-yellow-100 text-yellow-700 ring-yellow-500/50";
      break;
    case "Diproses":
      colorClass = "bg-orange-100 text-orange-700 ring-orange-500/50";
      break;
    case "Selesai":
      colorClass = "bg-green-100 text-green-700 ring-green-500/50";
      break;
    default:
      colorClass = "bg-gray-100 text-gray-700 ring-gray-500/50";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ring-1 ${colorClass}`}
    >
      {status}
    </span>
  );
}
