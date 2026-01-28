"use client";

import React, { useState, useEffect, Suspense } from 'react';
// Komponen Banner Status Lelang
function LelangStatusBanner() {
  const [status, setStatus] = useState<'buka' | 'tutup' | null>(null);
  useEffect(() => {
    fetch('/api/lelang')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus(null));
  }, []);

  if (!status) return null;

  return (
    <div className={`w-full max-w-4xl mx-auto backdrop-blur-md px-6 py-3 mb-8 rounded-2xl shadow-xl flex items-center justify-center gap-3 border animate-in fade-in slide-in-from-top-4 duration-700 ${status === 'buka'
      ? 'bg-emerald-50/80 border-emerald-100 text-emerald-700'
      : 'bg-rose-50/80 border-rose-100 text-rose-700'
      }`}>
      <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'buka' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      <p className="text-xs font-black uppercase tracking-widest">
        {status === 'buka' ? 'Lelang Sedang Dibuka • Ajukan Penawaran Anda Sekarang' : 'Lelang Sedang Ditutup • Nantikan Sesi Berikutnya'}
      </p>
    </div>
  );
}
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Car as CarIcon, Users, Settings, Calendar, Gauge, Search, Filter, TrendingUp, Clock, DollarSign, Sparkles, Heart } from 'lucide-react';

interface Product {
  id: string;
  nama_barang: string;
  deskripsi: string;
  harga_awal: number;
  tanggal: string;
  image_url?: string;
  merk_mobil?: string;
  tipe_mobil?: string;
  transmisi?: string;
  jumlah_seat?: number;
  tahun?: number;
  kilometer?: number;
  kategori?: string;
  createdAt?: string;
  isSold?: boolean;
  _count?: {
    bids: number;
  };
}

// --- CATEGORY HELPERS (harus di atas komponen!) ---

// Map dari enum value Prisma ke slug untuk UI
const ENUM_TO_SLUG: Record<string, string> = {
  "SEMUA": "semua-mobil",
  "RAMAI": "sedang-ramai",
  "SEGERA": "segera-berakhir",
  "DIBAWAH100": "dibawah-100-juta",
  "BARU": "baru-masuk",
};

// Map dari slug ke enum value Prisma
const SLUG_TO_ENUM: Record<string, string> = {
  "semua-mobil": "SEMUA",
  "sedang-ramai": "RAMAI",
  "segera-berakhir": "SEGERA",
  "dibawah-100-juta": "DIBAWAH100",
  "baru-masuk": "BARU",
};

// normalizer: ubah lowercase + hapus karakter aneh
function normalizeKey(s?: string): string {
  if (!s) return "";
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
}

// mengubah berbagai bentuk kategori → slug utama
export function formatKategori(input?: string): string {
  if (!input) return "semua-mobil";

  const upper = String(input).toUpperCase();

  // Jika input sudah enum value Prisma
  if (ENUM_TO_SLUG[upper]) {
    return ENUM_TO_SLUG[upper];
  }

  // Jika input adalah slug, kembalikan
  if (SLUG_TO_ENUM[String(input).toLowerCase()]) {
    return String(input).toLowerCase();
  }

  return "semua-mobil"; // default
}


function ProductCard({ product, onBid, isLoved, onToggleLove }: {
  product: Product;
  onBid: (productId: string, bidAmount: number) => void;
  isLoved: boolean;
  onToggleLove: (produkId: string) => void;
}) {
  const router = useRouter();
  const [bidAmount, setBidAmount] = useState(product.harga_awal + 1000000);
  const [submitting, setSubmitting] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);

  const handleBid = async () => {
    if (bidAmount <= product.harga_awal) {
      alert('Jumlah tawaran harus lebih tinggi dari harga awal!');
      return;
    }

    setSubmitting(true);
    await onBid(product.id, bidAmount);
    setSubmitting(false);
    setShowBidForm(false);
  };

  return (
    <div
      onClick={() => !product.isSold && router.push(`/jelajahi/${product.id}`)}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-500 ${product.isSold ? 'opacity-75 grayscale' : 'cursor-pointer'}`}
    >
      {/* Image section */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={product.image_url || '/images/cars/placeholder.jpg'}
          alt={product.nama_barang}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isSold ? (
            <span className="bg-gray-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
              Sold
            </span>
          ) : (
            <>
              <span className="bg-blue-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-blue-900/40">
                Lelang
              </span>
              {(product._count?.bids || 0) >= 2 && (
                <span className="bg-rose-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-rose-900/40">
                  <TrendingUp className="w-2.5 h-2.5" />
                  Hot
                </span>
              )}
            </>
          )}
        </div>

        {/* Love Button */}
        {!product.isSold && (
          <button
            onClick={e => { e.stopPropagation(); onToggleLove(product.id); }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 ${isLoved ? 'text-rose-500' : 'text-white'}`}
          >
            <Heart fill={isLoved ? 'currentColor' : 'none'} className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4">
        {/* Info Area */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest line-clamp-1">
              {product.merk_mobil || 'Unknown'} • {product.kategori?.replace(/_/g, ' ') || 'Mobil'}
            </p>
          </div>
          <h4 className="text-sm font-black text-gray-900 truncate tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
            {product.nama_barang}
          </h4>
          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {product.tahun || '-'}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {product.jumlah_seat || '-'} Seat
            </div>
          </div>
        </div>

        {/* Price & Bid Stats */}
        <div className="flex items-end justify-between mb-4 pb-3 border-b border-gray-50">
          <div>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Bid Mulai</p>
            <p className="text-base font-black text-blue-600 tracking-tighter leading-none">
              Rp {product.harga_awal.toLocaleString('id-ID')}
            </p>
          </div>
          {product._count && product._count.bids > 0 && (
            <div className="text-right">
              <p className="text-[8px] font-black text-emerald-500 px-2 py-0.5 bg-emerald-50 rounded-full inline-block">
                {product._count.bids} Bids active
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-1">
          {product.isSold ? (
            <div className="w-full bg-gray-100 text-gray-400 font-black py-2.5 rounded-xl text-[10px] text-center uppercase tracking-widest">
              Unit Terjual
            </div>
          ) : !showBidForm ? (
            <button
              onClick={(e) => { e.stopPropagation(); setShowBidForm(true); }}
              className="w-full bg-gray-900 border border-transparent text-white font-black py-2.5 rounded-xl text-[10px] hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95 uppercase tracking-widest"
            >
              Ajukan Bid
            </button>
          ) : (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-600" />
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  onClick={e => e.stopPropagation()}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-xs font-black text-blue-600"
                  min={product.harga_awal + 1}
                />
              </div>
              <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                <button
                  onClick={handleBid}
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white font-black py-2 rounded-lg text-[10px] transition-all hover:bg-blue-700 active:scale-95 uppercase tracking-widest"
                >
                  {submitting ? '...' : 'Kirim'}
                </button>
                <button
                  onClick={() => setShowBidForm(false)}
                  className="px-3 bg-gray-100 text-gray-500 font-black py-2 rounded-lg text-[10px] transition-all hover:bg-gray-200 uppercase tracking-widest"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JelajahiContent() {
  // Watchlist state
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Fetch watchlist produkId[]
  useEffect(() => {
    fetch('/api/watchlist')
      .then(res => res.ok ? res.json() : [])
      .then((data: Product[]) => setWatchlist(data.map(p => p.id)))
      .catch(() => setWatchlist([]));
  }, []);

  // Toggle love
  const handleToggleLove = async (produkId: string) => {
    if (watchlist.includes(produkId)) {
      await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produkId }),
      });
      setWatchlist(watchlist.filter(id => id !== produkId));
    } else {
      await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produkId }),
      });
      setWatchlist([...watchlist, produkId]);
    }
  };
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    formatKategori(searchParams.get("category") || "semua-mobil")
  );
  const [sortBy, setSortBy] = useState<string>('terbaru');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMerk, setFilterMerk] = useState<string>('');
  const [filterHarga, setFilterHarga] = useState<string>('');

  const getFilteredProducts = (category: string) => {
    // Convert slug to enum value if needed
    const enumValue = SLUG_TO_ENUM[category.toLowerCase()];

    let filtered = products;

    // Filter by category (Dynamic Logic)
    if (category === "sedang-ramai") {
      // Logic for Trending: Based on bid count (e.g., >= 2 bids) OR static category
      filtered = filtered.filter(product => (product._count?.bids || 0) >= 2 || product.kategori === "RAMAI");
    } else if (category === "dibawah-100-juta") {
      // Logic for Budget: Dynamic price check
      filtered = filtered.filter(product => product.harga_awal < 100000000 || product.kategori === "DIBAWAH100");
    } else if (category === "segera-berakhir") {
      // Logic for Ending Soon: Next 3 days
      const soon = new Date();
      soon.setDate(soon.getDate() + 3);
      filtered = filtered.filter(product =>
        (new Date(product.tanggal) <= soon && new Date(product.tanggal) >= new Date()) ||
        product.kategori === "SEGERA"
      );
    } else if (category === "baru-masuk") {
      // Logic for New Arrival: Last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(product =>
        (new Date(product.createdAt || "") >= weekAgo) ||
        product.kategori === "BARU"
      );
    } else if (category !== "semua-mobil" && enumValue) {
      filtered = filtered.filter(product => product.kategori === enumValue);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.nama_barang.toLowerCase().includes(query) ||
        product.merk_mobil?.toLowerCase().includes(query) ||
        product.tipe_mobil?.toLowerCase().includes(query) ||
        product.deskripsi.toLowerCase().includes(query)
      );
    }

    // Filter by merk
    if (filterMerk && filterMerk !== '') {
      filtered = filtered.filter(product =>
        product.merk_mobil?.toLowerCase() === filterMerk.toLowerCase()
      );
    }

    // Filter by harga
    if (filterHarga && filterHarga !== '') {
      filtered = filtered.filter(product => {
        switch (filterHarga) {
          case 'dibawah100':
            return product.harga_awal < 100000000;
          case '100-200':
            return product.harga_awal >= 100000000 && product.harga_awal < 200000000;
          case '200-300':
            return product.harga_awal >= 200000000 && product.harga_awal < 300000000;
          case 'diatas300':
            return product.harga_awal >= 300000000;
          default:
            return true;
        }
      });
    }

    // Sort
    if (sortBy === 'terbaru') {
      filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    } else if (sortBy === 'termurah') {
      filtered.sort((a, b) => a.harga_awal - b.harga_awal);
    } else if (sortBy === 'termahal') {
      filtered.sort((a, b) => b.harga_awal - a.harga_awal);
    }

    return filtered;
  };

  // Get unique merk from products
  const getMerks = () => {
    const merks = new Set(products.map(p => p.merk_mobil).filter(Boolean));
    return Array.from(merks).sort();
  };

  const getProductsByCategory = (category: string) => {
    return getFilteredProducts(category);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/produk');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();

    // scroll otomatis ke kategori jika ada query param
    const initialCategory = formatKategori(searchParams.get("category") || "semua-mobil");
    if (initialCategory) {
      setTimeout(() => {
        const el = document.getElementById(initialCategory);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 600);
    }
  }, []);

  const submitBid = async (productId: string, bidAmount: number) => {
    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produkId: productId,
          bidAmount: bidAmount,
        }),
      });

      if (response.ok) {
        alert('Bid berhasil diajukan!');
        // You might want to refresh the page or update the UI
      } else if (response.status === 401) {
        alert('Silakan login terlebih dahulu untuk mengajukan tawaran');
        window.location.href = '/login';
      } else {
        try {
          const error = await response.json();
          alert(`Error: ${error.error || 'Gagal mengajukan bid'}`);
        } catch (parseError) {
          alert('Terjadi kesalahan saat mengajukan bid');
        }
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Terjadi kesalahan saat mengajukan bid');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <LelangStatusBanner />
      </div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-blue-900 to-blue-800"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>

        {/* Decorative Light Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] -ml-32 -mb-32" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-white/20 text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Premium Auction Collection
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
            Temukan Unit <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-100">
              Terbaik Hari Ini
            </span>
          </h1>

          <p className="text-blue-100 text-base md:text-lg mb-12 max-w-xl mx-auto font-medium opacity-80 leading-relaxed">
            Berbagai pilihan mobil berkualitas dengan sistem lelang yang transparan dan aman.
          </p>

          {/* Search Box */}
          <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl p-6 rounded-[32px] border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Nama unit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/90 pl-11 pr-4 py-3.5 rounded-xl text-xs font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 uppercase tracking-tight"
                />
              </div>

              <select
                value={filterMerk}
                onChange={(e) => setFilterMerk(e.target.value)}
                className="w-full bg-white/90 px-4 py-3.5 rounded-xl text-xs font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/20 transition-all uppercase tracking-tight appearance-none"
              >
                <option value="">Semua Merk</option>
                {getMerks().map((merk) => (
                  <option key={merk} value={merk}>{merk}</option>
                ))}
              </select>

              <select
                value={filterHarga}
                onChange={(e) => setFilterHarga(e.target.value)}
                className="w-full bg-white/90 px-4 py-3.5 rounded-xl text-xs font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/20 transition-all uppercase tracking-tight appearance-none"
              >
                <option value="">Harga (Semua)</option>
                <option value="dibawah100">{'< 100jt'}</option>
                <option value="100-200">100jt - 200jt</option>
                <option value="200-300">200jt - 300jt</option>
                <option value="diatas300">{'> 300jt'}</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-blue-600 text-white px-4 py-3.5 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-blue-500/20 transition-all uppercase tracking-tight"
              >
                <option value="terbaru">Urut: Terbaru</option>
                <option value="termurah">Urut: Termurah</option>
                <option value="termahal">Urut: Termahal</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-12">
        <LelangStatusBanner />
      </div>

      <main className="container mx-auto p-4 relative z-10 mt-[-2rem]">

        {/* Categories Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            Featured Categories
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tighter">Unit Pilihan Terbaru</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm font-medium">Jelajahi berbagai kategori mobil yang sedang diminati.</p>
        </div>

        {/* section semua mobil */}
        <section id="semua-mobil" className="py-12 border-t border-gray-50">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                  <CarIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Semua Unit</h3>
              </div>
              <p className="text-gray-500 text-xs font-medium">Koleksi lengkap armada berkualitas Tawar Duluan.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <span className="text-blue-600">{getProductsByCategory('semua-mobil').length}</span> Units Available
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Collection...</p>
              </div>
            </div>
          ) : getProductsByCategory('semua-mobil').length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <CarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-black text-gray-900 mb-1 uppercase tracking-tight">Tidak Ada Unit</h3>
              <p className="text-gray-500 text-xs">Cek kembali nanti untuk koleksi terbaru kami.</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {getProductsByCategory('semua-mobil').map((product) => (
                <div key={product.id} className="min-w-[260px] max-w-xs w-full sm:min-w-0 sm:max-w-none">
                  <ProductCard
                    product={product}
                    onBid={submitBid}
                    isLoved={watchlist.includes(product.id)}
                    onToggleLove={handleToggleLove}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Section Divider */}
        <div className="py-16">

          {/* section sedang ramai */}
          <section id="sedang-ramai" className="py-12 border-t border-gray-50">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-100">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Sedang Ramai</h3>
                  <p className="text-gray-500 text-xs font-medium">Unit dengan aktivitas tawaran tertinggi saat ini.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                Found <span className="text-rose-500">{getProductsByCategory('sedang-ramai').length}</span> High-Interest Units
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
              </div>
            ) : getProductsByCategory('sedang-ramai').length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <CarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-black text-gray-900 mb-1">No Hot Deals</h3>
                <p className="text-gray-500 text-xs">Belum ada unit yang sedang ramai saat ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {getProductsByCategory('sedang-ramai').map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBid={submitBid}
                    isLoved={watchlist.includes(product.id)}
                    onToggleLove={handleToggleLove}
                  />
                ))}
              </div>
            )}
          </section>

          {/* segera berakhir */}
          <section id="segera-berakhir" className="py-12 border-t border-gray-50">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Segera Berakhir</h3>
                  <p className="text-gray-500 text-xs font-medium">Jangan sampai ketinggalan, lelang segera ditutup.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <span className="text-orange-500">{getProductsByCategory('segera-berakhir').length}</span> Units Expiring
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
            ) : getProductsByCategory('segera-berakhir').length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <CarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-black text-gray-900 mb-1">Time's Up</h3>
                <p className="text-gray-500 text-xs">Semua lelang masih memiliki waktu yang cukup.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {getProductsByCategory('segera-berakhir').map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBid={submitBid}
                    isLoved={watchlist.includes(product.id)}
                    onToggleLove={handleToggleLove}
                  />
                ))}
              </div>
            )}
          </section>

          {/* dibawah 100 juta */}
          <section id="dibawah-100-juta" className="py-12 border-t border-gray-50">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Budget Friendly</h3>
                  <p className="text-gray-500 text-xs font-medium">Pilihan ekonomis di bawah 100 Juta.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <span className="text-emerald-500">{getProductsByCategory('dibawah-100-juta').length}</span> Affordable Units
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            ) : getProductsByCategory('dibawah-100-juta').length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <CarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-black text-gray-900 mb-1">Out of Stock</h3>
                <p className="text-gray-500 text-xs">Belum ada unit di kategori ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {getProductsByCategory('dibawah-100-juta').map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBid={submitBid}
                    isLoved={watchlist.includes(product.id)}
                    onToggleLove={handleToggleLove}
                  />
                ))}
              </div>
            )}
          </section>

          {/* baru masuk */}
          <section id="baru-masuk" className="py-12 border-t border-gray-50">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Baru Masuk</h3>
                  <p className="text-gray-500 text-xs font-medium">Koleksi armada terbaru minggu ini.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <span className="text-indigo-600">{getProductsByCategory('baru-masuk').length}</span> New Arrivals
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            ) : getProductsByCategory('baru-masuk').length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <CarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-black text-gray-900 mb-1">Nothing New</h3>
                <p className="text-gray-500 text-xs">Belum ada unit baru untuk minggu ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {getProductsByCategory('baru-masuk').map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBid={submitBid}
                    isLoved={watchlist.includes(product.id)}
                    onToggleLove={handleToggleLove}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main >
      <Footer />
    </>
  );
}

export default function JelajahiPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Memuat halaman...</p>
      </div>
    </div>}>
      <JelajahiContent />
    </Suspense>
  );
}


