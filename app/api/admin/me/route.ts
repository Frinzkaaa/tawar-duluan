
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET!)
        );

        const user = await prisma.user.findUnique({ where: { id: payload.uid as string } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
