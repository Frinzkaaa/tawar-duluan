
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;
    
    if (token) {
        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(process.env.JWT_SECRET!)
            );

            const user = await prisma.user.findUnique({ where: { id: payload.uid as string } });
            if (user) {
                return NextResponse.json({
                    name: user.name,
                    email: user.email,
                    role: user.role
                });
            }
        } catch (err) {
            // Lanjut ke pengecekan NextAuth token
        }
    }

    try {
        const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (nextAuthToken && nextAuthToken.email) {
            const user = await prisma.user.findUnique({ where: { email: nextAuthToken.email } });
            if (user) {
                return NextResponse.json({
                    name: user.name,
                    email: user.email,
                    role: user.role
                });
            }
        }
    } catch (err) {
        // Lanjut ke error response
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
