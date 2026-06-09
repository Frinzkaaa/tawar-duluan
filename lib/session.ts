import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser(request?: NextRequest) {
  let userId: string | null = null;
  let userEmail: string | null = null;

  // PRIORITY 1: getToken (request-based) — paling andal di Vercel API routes
  // karena langsung membaca cookie dari request object
  if (request) {
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (token?.id) {
        userId = token.id as string;
        userEmail = token.email as string;
        console.log("[getCurrentUser] getToken succeeded:", userEmail);
      } else if (token?.email) {
        // Token ada tapi id tidak ada — cari via email
        userEmail = token.email as string;
        console.log("[getCurrentUser] getToken has email but no id, will lookup:", userEmail);
      }
    } catch (err) {
      console.error("[getCurrentUser] getToken error:", err);
    }
  }

  // PRIORITY 2: Custom JWT Cookie (Legacy login system)
  if (!userId && request) {
    const legacyToken = request.cookies.get("token")?.value;
    if (legacyToken) {
      try {
        const payload = JSON.parse(Buffer.from(legacyToken.split(".")[1], "base64").toString());
        if (payload.uid) {
          userId = payload.uid;
          console.log("[getCurrentUser] Legacy JWT userId extracted:", userId);
        }
      } catch (error) {
        console.error("[getCurrentUser] Legacy JWT Decode Error:", error);
      }
    }
  }

  // PRIORITY 3: getServerSession fallback (hanya di server components, bukan API routes)
  if (!userId && !userEmail) {
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        userId = (session.user as any).id;
        userEmail = session.user.email ?? null;
        console.log("[getCurrentUser] getServerSession fallback succeeded:", userEmail);
      }
    } catch (err) {
      console.error("[getCurrentUser] getServerSession error:", err);
    }
  }

  // SELF-HEAL: Jika punya email tapi belum dapat userId, cari di DB
  if (!userId && userEmail) {
    console.log("[getCurrentUser] Self-healing via email lookup:", userEmail);
    try {
      const dbUser = await prisma.user.findUnique({ where: { email: userEmail } });
      if (dbUser) {
        userId = dbUser.id;
        console.log("[getCurrentUser] Self-healed userId:", userId);
        return dbUser;
      }
    } catch (err) {
      console.error("[getCurrentUser] Self-heal DB error:", err);
    }
  }

  if (!userId) {
    console.log("[getCurrentUser] Failed — no userId from any source");
    return null;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) console.log("[getCurrentUser] User not found in DB for ID:", userId);
    return user;
  } catch (error) {
    console.error("[getCurrentUser] Prisma Fetch User Error:", error);
    return null;
  }
}
