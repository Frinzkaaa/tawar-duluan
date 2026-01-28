import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function getCurrentUser(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;

    try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
        const user = await prisma.user.findUnique({ where: { id: payload.uid } });
        return user;
    } catch (error) {
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const notifications = await prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return NextResponse.json(notifications);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await request.json();

        if (id) {
            await prisma.notification.update({
                where: { id, userId: user.id },
                data: { isRead: true }
            });
        } else {
            await prisma.notification.updateMany({
                where: { userId: user.id, isRead: false },
                data: { isRead: true }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
