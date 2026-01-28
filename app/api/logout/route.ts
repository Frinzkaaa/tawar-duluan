
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Clear user token
  res.headers.set(
    "Set-Cookie",
    "token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );

  // Clear admin token
  res.headers.append(
    "Set-Cookie",
    "admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );

  return res;
}
