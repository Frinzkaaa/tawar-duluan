import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ⬅️ WAJIB await
    const formData = await req.formData();
    const nama_barang = formData.get("nama_barang") as string;
    const tanggal = formData.get("tanggal") as string;
    const harga_awal_str = formData.get("harga_awal") as string;
    const harga_awal = parseInt(harga_awal_str);
    const deskripsi = formData.get("deskripsi") as string;
    const image = formData.get("image") as File | null;

    console.log("PUT data:", { id, nama_barang, tanggal, harga_awal_str, harga_awal, deskripsi, hasImage: !!image });

    if (!nama_barang || !tanggal || isNaN(harga_awal) || !deskripsi) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    let image_url = undefined;

    if (image) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), "public", "uploads");
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }

      // Generate unique filename
      const fileExtension = image.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = join(uploadsDir, fileName);

      // Convert file to buffer and save
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      image_url = `/uploads/${fileName}`;
    }

    const updateData: any = {
      nama_barang,
      tanggal: new Date(tanggal),
      harga_awal,
      deskripsi,
    };

    if (image_url !== undefined) {
      updateData.image_url = image_url;
    }

    console.log("About to update produk with data:", updateData);
    const produk = await prisma.produk.update({
      where: { id },
      data: updateData,
    });
    console.log("Produk updated successfully:", produk);

    return NextResponse.json(produk);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ⬅️ WAJIB await
    await prisma.produk.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
