import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // Cek apakah env variables ada tanpa expose nilainya
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return NextResponse.json({
    CLOUDINARY_CLOUD_NAME: cloudName ? `SET (${cloudName})` : "MISSING",
    CLOUDINARY_API_KEY: apiKey ? `SET (${apiKey.slice(0, 6)}...)` : "MISSING",
    CLOUDINARY_API_SECRET: apiSecret ? `SET (${apiSecret.slice(0, 4)}...)` : "MISSING",
    nodeEnv: process.env.NODE_ENV,
  });
}
