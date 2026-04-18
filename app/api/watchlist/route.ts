// app/api/watchlist/route.ts
export const runtime = "nodejs"; // ✅ PENTING

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { getCurrentUser } from "@/lib/session";

// =====================
// GET: List watchlist
// =====================
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const watchlist = await prisma.watchlist.findMany({
    where: { userId: user.id },
    include: {
      produk: {
        include: {
          bids: {
            where: { status: 'approved' },
            select: { id: true },
            take: 1
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  const results = watchlist.map((w) => ({
    ...w.produk,
    isSold: w.produk.bids.length > 0
  }));

  return NextResponse.json(results);
}

// =====================
// POST: Add to watchlist
// =====================
export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { produkId?: string };

  if (!body.produkId) {
    return NextResponse.json(
      { error: "Missing produkId" },
      { status: 400 }
    );
  }

  await prisma.watchlist.upsert({
    where: {
      userId_produkId: {
        userId: user.id,
        produkId: body.produkId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      produkId: body.produkId,
    },
  });

  return NextResponse.json({ success: true });
}

// =====================
// DELETE: Remove from watchlist
// =====================
export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { produkId?: string };

  if (!body.produkId) {
    return NextResponse.json(
      { error: "Missing produkId" },
      { status: 400 }
    );
  }

  await prisma.watchlist.deleteMany({
    where: {
      userId: user.id,
      produkId: body.produkId,
    },
  });

  return NextResponse.json({ success: true });
}
