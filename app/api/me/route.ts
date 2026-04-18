
// app/api/me/route.ts
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  let userId: string | null = null;
  const token = req.cookies.get("token")?.value;

  if (token) {
    try {
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      userId = payload.uid;
    } catch (err) {
      console.error("Invalid token cookie");
    }
  }

  // Fallback to NextAuth session
  if (!userId) {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      userId = (session.user as any).id;
    }
  }

  // 3rd Fallback
  if (!userId) {
    const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (nextAuthToken?.id) {
      userId = nextAuthToken.id as string;
    }
  }

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token structure" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    if (!payload.uid) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { name, phone, address, password } = await req.json();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (password) updateData.password = password; // simple plain text for now as per project current state

    const user = await prisma.user.update({
      where: { id: payload.uid },
      data: updateData
    });

    return NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
