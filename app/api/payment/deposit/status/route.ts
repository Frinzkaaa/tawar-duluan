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

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) return NextResponse.json({ hasDeposit: false });

        const activeDeposit = await prisma.transaction.findFirst({
            where: {
                userId: user.id,
                type: 'DEPOSIT',
                status: 'settlement'
            }
        });

        return NextResponse.json({ hasDeposit: !!activeDeposit });
    } catch (error) {
        return NextResponse.json({ hasDeposit: false });
    }
}
