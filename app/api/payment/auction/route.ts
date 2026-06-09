import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { createSnapToken } from '@/lib/midtrans';

export const runtime = 'nodejs';

// POST: Buat transaksi pelunasan lelang + dapatkan Midtrans Snap token
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { bidId } = await request.json();

        const bid = await prisma.bid.findUnique({
            where: { id: bidId },
            include: { produk: true },
        });

        if (!bid || bid.userId !== user.id || bid.status !== 'approved') {
            return NextResponse.json({ error: 'Bid tidak valid atau belum disetujui' }, { status: 400 });
        }

        if (bid.paymentStatus === 'paid') {
            return NextResponse.json({ error: 'Bid ini sudah dibayar' }, { status: 400 });
        }

        const orderId = `PAY-${bid.id.slice(-8)}-${Date.now()}`;

        // Simpan transaksi ke DB
        await prisma.transaction.create({
            data: {
                userId: user.id,
                amount: bid.bidAmount,
                orderId,
                type: 'PAYMENT',
                status: 'pending',
            },
        });

        // Buat Snap token dari Midtrans
        const snap = await createSnapToken({
            orderId,
            grossAmount: bid.bidAmount,
            firstName: user.name || 'Penawar',
            email: user.email || '',
            itemName: `Pelunasan: ${bid.produk.nama_barang}`,
            itemId: bid.produk.id,
        });

        return NextResponse.json({
            success: true,
            orderId,
            snapToken: snap.token,
            redirectUrl: snap.redirectUrl,
        });
    } catch (error: any) {
        console.error('[POST /api/payment/auction]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH: Konfirmasi manual atau dari callback webhook
export async function PATCH(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { orderId, bidId } = await request.json();

        await prisma.transaction.update({
            where: { orderId },
            data: { status: 'settlement' },
        });

        const updatedBid = await prisma.bid.update({
            where: { id: bidId },
            data: { paymentStatus: 'paid' },
            include: { produk: true },
        });

        await prisma.notification.create({
            data: {
                userId: user.id,
                title: 'Pembayaran Berhasil! 🏆',
                message: `Pelunasan untuk ${updatedBid.produk.nama_barang} telah berhasil. Tim kami akan segera menghubungi Anda.`,
                type: 'payment_success',
                link: '/koleksi-saya/bid-saya',
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[PATCH /api/payment/auction]', error);
        return NextResponse.json({ error: 'Failed to confirm' }, { status: 500 });
    }
}
