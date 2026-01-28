import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mendapatkan status lelang (buka/tutup)
export async function GET() {
  // Cek status lelang global (hanya satu baris di DB)
  let status = await prisma.setting.findUnique({ where: { key: 'lelang_status' } });
  if (!status) {
    // Default: tutup
    status = await prisma.setting.create({ data: { key: 'lelang_status', value: 'tutup' } });
  }
  return NextResponse.json({ status: status.value });
}

// POST: Ubah status lelang (buka/tutup)
export async function POST(request: NextRequest) {
  const { status } = await request.json();
  if (!['buka', 'tutup'].includes(status)) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
  }
  await prisma.setting.upsert({
    where: { key: 'lelang_status' },
    update: { value: status },
    create: { key: 'lelang_status', value: status },
  });

  // --- NOTIFICATION LOGIC: Winner Notification ---
  if (status === 'tutup') {
    try {
      const allProducts = await prisma.produk.findMany({
        include: {
          bids: {
            orderBy: { bidAmount: 'desc' },
            take: 1,
            include: { user: true }
          }
        }
      });

      for (const p of allProducts) {
        if (p.bids.length > 0) {
          const winner = p.bids[0];
          await prisma.notification.create({
            data: {
              userId: winner.userId,
              title: "Selamat! Anda Menang Lelang!",
              message: `Selamat! Anda memenangkan lelang untuk ${p.nama_barang} dengan tawaran Rp ${winner.bidAmount.toLocaleString('id-ID')}. Tim kami akan segera menghubungi Anda.`,
              type: "won",
              link: `/jelajahi/${p.id}`
            }
          });
        }
      }
    } catch (notifErr) {
      console.error('Error sending winner notifications:', notifErr);
    }
  }

  return NextResponse.json({ status });
}
