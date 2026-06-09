import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';

// Helper function to get current user robustly
async function getCurrentUser(request: NextRequest) {
    // 1. Cek admin_token (custom JWT via jose)
    const adminToken = request.cookies.get("admin_token")?.value;
    if (adminToken) {
        try {
            const { payload } = await jwtVerify(
                adminToken,
                new TextEncoder().encode(process.env.JWT_SECRET!)
            );
            return await prisma.user.findUnique({ where: { id: payload.uid as string } });
        } catch (err) {}
    }

    // 2. Cek NextAuth token
    try {
        const nextAuthToken = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
        if (nextAuthToken && nextAuthToken.email) {
            return await prisma.user.findUnique({ where: { email: nextAuthToken.email } });
        }
    } catch (err) {}

    return null;
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
