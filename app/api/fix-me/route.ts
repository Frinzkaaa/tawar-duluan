import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const email = "frinzkadesfrilia12@gmail.com";
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: "Frinzka Desfrilia",
          role: "masyarakat",
          password: ""
        }
      });
      return NextResponse.json({ success: true, message: "USER CREATED", user });
    }
    return NextResponse.json({ success: true, message: "USER ALREADY EXISTED", user });
  } catch(e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
