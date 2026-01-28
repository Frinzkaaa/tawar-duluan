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

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { paymentMethod } = await request.json();

        const orderId = `DEP-${user.id}-${Date.now()}`;
        const amount = 5000000;

        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                amount,
                orderId,
                type: 'DEPOSIT',
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

// Simulated confirmation API
export async function PATCH(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { orderId } = await request.json();

        const updatedTransaction = await prisma.transaction.update({
            where: { orderId },
            data: { status: 'settlement' }
        });

        await prisma.notification.create({
            data: {
                userId: user.id,
                title: "Deposit Berhasil!",
                message: `Uang jaminan sebesar Rp ${updatedTransaction.amount.toLocaleString('id-ID')} telah diterima. Selamat menawar!`,
                type: "deposit",
                link: "/koleksi-saya/bid-saya"
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to confirm' }, { status: 500 });
    }
}
