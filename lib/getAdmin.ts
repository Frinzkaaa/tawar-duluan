import { prisma } from "./prisma";
import { jwtVerify } from "jose";

export async function getAdmin(token: string | null) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    if (payload.role !== "admin") return null;

    const admin = await prisma.user.findUnique({
      where: { id: payload.uid as string },
    });

    return admin;
  } catch (err) {
    console.error("Gagal verifikasi token:", err);
    return null;
  }
}
