import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update bid status (admin approval/rejection)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { status } = await request.json();
    const { id } = await params;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const bid = await prisma.bid.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        produk: true,
      },
    });

    // Jika bid disetujui (Menang), deposit user "terkunci" ke mobil ini sebagai potongan pembayaran.
    // Otomatis status hasDeposit dikembalikan ke false agar harus bayar jaminan lagi jika ingin bid mobil lain.
    if (status === 'approved') {
      // Ubah status transaksi jaminan menjadi 'consumed' (sudah dipakai)
      await prisma.transaction.updateMany({
        where: { 
          userId: bid.userId,
          type: 'DEPOSIT',
          status: 'settlement'
        },
        data: { status: 'consumed' },
      });

      // Opsional: Buat notifikasi bahwa user menang
      await prisma.notification.create({
        data: {
          userId: bid.userId,
          title: 'Tawaran Disetujui! 🏆',
          message: `Selamat! Tawaran Anda untuk ${bid.produk.nama_barang} telah disetujui. Silakan lakukan pelunasan. Uang Jaminan Anda telah dipotong ke tagihan akhir.`,
          type: 'winner',
          link: '/koleksi-saya/bid-saya',
        }
      });

      // === AUTO-REJECT LOGIC ===
      // Tolak semua bid lain pada produk yang sama
      const otherBids = await prisma.bid.findMany({
        where: {
          produkId: bid.produkId,
          id: { not: bid.id },
          status: 'pending' // Hanya tolak yang masih pending (jaga-jaga)
        }
      });

      if (otherBids.length > 0) {
        // Update status semua bid lain menjadi 'rejected'
        await prisma.bid.updateMany({
          where: {
            produkId: bid.produkId,
            id: { not: bid.id }
          },
          data: { status: 'rejected' }
        });

        // Buat notifikasi kalah untuk mereka
        const loserNotifications = otherBids.map(loserBid => ({
          userId: loserBid.userId,
          title: 'Tawaran Ditolak ❌',
          message: `Mohon maaf, tawaran Anda untuk ${bid.produk.nama_barang} belum berhasil karena unit telah dimenangkan oleh penawar lain. Jangan menyerah, ayo cari unit lainnya!`,
          type: 'loser',
          link: '/jelajahi',
        }));

        await prisma.notification.createMany({
          data: loserNotifications
        });
      }
    }

    return NextResponse.json(bid);
  } catch (error) {
    console.error('Error updating bid:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
