import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const runtime = 'nodejs';

// Midtrans webhook notification handler
// Midtrans akan POST ke sini setiap kali ada update status transaksi
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            order_id,
            status_code,
            gross_amount,
            signature_key,
            transaction_status,
            fraud_status,
            payment_type,
        } = body;

        console.log('[Midtrans Callback]', { order_id, transaction_status, fraud_status });

        // Verifikasi signature key dari Midtrans
        const serverKey = process.env.MIDTRANS_SERVER_KEY!;
        const expected = crypto
            .createHash('sha512')
            .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
            .digest('hex');

        if (signature_key !== expected) {
            console.error('[Midtrans Callback] Invalid signature!');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        // Tentukan status transaksi
        const isSuccess =
            (transaction_status === 'capture' && fraud_status === 'accept') ||
            transaction_status === 'settlement';

        const isPending = transaction_status === 'pending';
        const isFailed =
            transaction_status === 'deny' ||
            transaction_status === 'expire' ||
            transaction_status === 'cancel';

        // Cari transaksi di DB
        const transaction = await prisma.transaction.findUnique({
            where: { orderId: order_id },
        });

        if (!transaction) {
            console.error('[Midtrans Callback] Transaction not found:', order_id);
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        if (isSuccess) {
            // Update status transaksi
            await prisma.transaction.update({
                where: { orderId: order_id },
                data: { status: 'settlement' },
            });

            if (transaction.type === 'DEPOSIT') {


                await prisma.notification.create({
                    data: {
                        userId: transaction.userId,
                        title: 'Deposit Berhasil! 🎉',
                        message: `Uang jaminan Rp ${Number(gross_amount).toLocaleString('id-ID')} telah diterima via ${payment_type}. Selamat menawar!`,
                        type: 'deposit',
                        link: '/jelajahi',
                    },
                });
            } else if (transaction.type === 'PAYMENT') {
                // Cari bid berdasarkan orderId pattern: PAY-{bidId_last8}-{timestamp}
                // orderId format: PAY-{bidIdLast8}-{timestamp}
                const bidIdSuffix = order_id.split('-')[1]; // bidId last 8 chars

                const bid = await prisma.bid.findFirst({
                    where: {
                        id: { endsWith: bidIdSuffix },
                        userId: transaction.userId,
                        status: 'approved',
                    },
                    include: { produk: true },
                });

                if (bid) {
                    await prisma.bid.update({
                        where: { id: bid.id },
                        data: { paymentStatus: 'paid' },
                    });

                    await prisma.notification.create({
                        data: {
                            userId: transaction.userId,
                            title: 'Pembayaran Berhasil! 🏆',
                            message: `Pelunasan ${bid.produk.nama_barang} (Rp ${bid.bidAmount.toLocaleString('id-ID')}) berhasil via ${payment_type}. Tim kami segera menghubungi Anda.`,
                            type: 'payment_success',
                            link: '/koleksi-saya/bid-saya',
                        },
                    });
                }
            }
        } else if (isFailed) {
            await prisma.transaction.update({
                where: { orderId: order_id },
                data: { status: 'failed' },
            });
        }
        // pending — tidak perlu update, biarkan tetap pending

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Midtrans Callback] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
