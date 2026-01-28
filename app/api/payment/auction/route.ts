
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function getCurrentUser(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;
    try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
        return await prisma.user.findUnique({ where: { id: payload.uid } });
    } catch (error) {
        return null;
    }
}

// POST: Initiate auction payment
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { bidId } = await request.json();

        const bid = await prisma.bid.findUnique({
            where: { id: bidId },
            include: { produk: true }
        });

        if (!bid || bid.userId !== user.id || bid.status !== 'approved') {
            return NextResponse.json({ error: 'Invalid bid or unauthorized' }, { status: 400 });
        }

        const orderId = `PAY-${bid.id}-${Date.now()}`;

        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                amount: bid.bidAmount,
                orderId,
                type: 'PAYMENT',
                status: 'pending'
            }
        });

        return NextResponse.json({
            success: true,
            orderId: transaction.orderId,
            amount: transaction.amount
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH: Confirm auction payment
export async function PATCH(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { orderId, bidId } = await request.json();

        // Update transaction status
        const updatedTransaction = await prisma.transaction.update({
            where: { orderId },
            data: { status: 'settlement' }
        });

        // Update bid payment status
        await prisma.bid.update({
            where: { id: bidId },
            data: { paymentStatus: 'paid' }
        });

        const bid = await prisma.bid.findUnique({
            where: { id: bidId },
            include: { produk: true }
        });

        await prisma.notification.create({
            data: {
                userId: user.id,
                title: "Pembayaran Berhasil!",
                message: `Pembayaran untuk ${bid?.produk.nama_barang} telah berhasil. Silakan pilih metode penjemputan mobil Anda.`,
                type: "payment_success",
                link: "/koleksi-saya/bid-saya"
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Payment confirmation error:", error);
        return NextResponse.json({ error: 'Failed to confirm' }, { status: 500 });
    }
}
