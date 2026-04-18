import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser(request?: NextRequest) {
  let userId: string | null = null;
  console.log("[getCurrentUser] Started");

  // 1A. Check NextAuth Session (via global getServerSession)
  const session = await getServerSession(authOptions);
  console.log("[getCurrentUser] getServerSession user:", session?.user?.email);
  if (session?.user) {
    userId = (session.user as any).id;
  }

  // 1B. Fallback to direct token decryption (NextRequest based)
  if (!userId && request) {
    const nextAuthToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    console.log("[getCurrentUser] getToken fallback:", nextAuthToken?.email);
    if (nextAuthToken?.id) {
      userId = nextAuthToken.id as string;
    }
  }

  // 2. Fallback to Custom JWT Cookie (Legacy)
  if (!userId && request) {
    const token = request.cookies.get("token")?.value;
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
        userId = payload.uid;
        console.log("[getCurrentUser] Legacy JWT userId extracted:", userId);
      } catch (error) {
        console.error("[getCurrentUser] JWT Decode Error:", error);
      }
    } else {
      console.log("[getCurrentUser] No legacy token provided");
    }
  }

  if (!userId) {
    console.log("[getCurrentUser] Failed to find userId from any source");
    return null;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.log("[getCurrentUser] User not found in database for ID:", userId);
    }
    return user;
  } catch (error) {
    console.error("[getCurrentUser] Prisma Fetch User Error:", error);
    return null;
  }
}
