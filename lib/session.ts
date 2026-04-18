import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser(request?: NextRequest) {
  let userId: string | null = null;

  // 1. Check NextAuth Session (Google/Credentials)
  const session = await getServerSession(authOptions);
  if (session?.user) {
    userId = (session.user as any).id;
  }

  // 2. Fallback to Custom JWT Cookie (Legacy)
  if (!userId && request) {
    const token = request.cookies.get("token")?.value;
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
        userId = payload.uid;
      } catch (error) {
        console.error("JWT Decode Error:", error);
      }
    }
  }

  if (!userId) return null;

  try {
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch (error) {
    console.error("Prisma Fetch User Error:", error);
    return null;
  }
}
