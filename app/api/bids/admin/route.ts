import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to get current user from token
async function getCurrentUser(request: NextRequest) {
    const token = request.cookies.get("admin_token")?.value || request.cookies.get("token")?.value;
    if (!token) return null;

    try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
        const user = await prisma.user.findUnique({ where: { id: payload.uid } });
        return user;
    } catch (error) {
        return null;
    }
}

// GET: Get all bids (admin only)
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const bids = await prisma.bid.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                produk: {
                    select: {
                        id: true,
                        nama_barang: true,
                        harga_awal: true,
                    }
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(bids);
    } catch (error) {
        console.error('Error fetching bids:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
