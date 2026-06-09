import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { createSnapToken } from '@/lib/midtrans';

export const runtime = 'nodejs';

// POST: Buat transaksi deposit jaminan + dapatkan Midtrans Snap token
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const orderId = `DEP-${user.id.slice(-8)}-${Date.now()}`;
        const amount = 500_000;

        // Simpan transaksi ke DB dulu
        await prisma.transaction.create({
            data: {
                userId: user.id,
                amount,
                orderId,
                type: 'DEPOSIT',
                status: 'pending',
            },
        });

        // Buat Snap token dari Midtrans
        const snap = await createSnapToken({
            orderId,
            grossAmount: amount,
            firstName: user.name || 'Penawar',
            email: user.email || '',
            itemName: 'Uang Jaminan Lelang - Tawar Duluan',
            itemId: 'DEPOSIT',
        });

        return NextResponse.json({
            success: true,
            orderId,
            snapToken: snap.token,
            redirectUrl: snap.redirectUrl,
        });
    } catch (error: any) {
        console.error('[POST /api/payment/deposit]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH: Midtrans callback / manual confirm — update status deposit
export async function PATCH(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { orderId } = await request.json();

        const updatedTransaction = await prisma.transaction.update({
            where: { orderId },
            data: { status: 'settlement' },
        });


        await prisma.notification.create({
            data: {
                userId: user.id,
                title: 'Deposit Berhasil! 🎉',
                message: `Uang jaminan sebesar Rp ${updatedTransaction.amount.toLocaleString('id-ID')} telah diterima. Selamat menawar!`,
                type: 'deposit',
                link: '/jelajahi',
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[PATCH /api/payment/deposit]', error);
        return NextResponse.json({ error: 'Failed to confirm' }, { status: 500 });
    }
}
