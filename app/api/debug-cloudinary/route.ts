import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

// GET: test koneksi cloudinary (upload sample 1x1 pixel PNG)
export async function GET() {
  try {
    // 1x1 pixel transparent PNG in base64
    const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const testFile = new File([bytes], "test.png", { type: "image/png" });

    const url = await uploadToCloudinary(testFile, "tawar-duluan-test");

    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      detail: String(err),
    }, { status: 500 });
  }
}
