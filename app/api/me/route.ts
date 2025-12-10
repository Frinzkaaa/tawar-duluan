// app/api/admin/me/route.ts
export const runtime = "nodejs"; // penting supaya Prisma jalan

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());

  const user = await prisma.user.findUnique({ where: { id: payload.uid } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ name: user.name, email: user.email, role: user.role });
}
