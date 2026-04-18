import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const produk = await prisma.produk.findUnique({
      where: { id },
      include: {
        bids: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!produk) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(produk);
  } catch (err: any) {
    console.error("GET /api/produk/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const formData = await req.formData();

    const nama_barang = formData.get("nama_barang") as string;
    const tanggal = formData.get("tanggal") as string;
    const harga_awal_str = formData.get("harga_awal") as string;
    const harga_awal = parseInt(harga_awal_str);
    const deskripsi = formData.get("deskripsi") as string;
    const kategori = formData.get("kategori") as string | null;
    const image = formData.get("image") as File | null;

    // Car-specific fields
    const merk_mobil = formData.get("merk_mobil") as string | null;
    const tipe_mobil = formData.get("tipe_mobil") as string | null;
    const transmisi = formData.get("transmisi") as string | null;
    const jumlah_seat_str = formData.get("jumlah_seat") as string | null;
    const jumlah_seat = jumlah_seat_str ? parseInt(jumlah_seat_str) : null;
    const tahun_str = formData.get("tahun") as string | null;
    const tahun = tahun_str ? parseInt(tahun_str) : null;
    const kilometer_str = formData.get("kilometer") as string | null;
    const kilometer = kilometer_str ? parseInt(kilometer_str) : null;

    // Advanced specs
    const mesin = formData.get("mesin") as string | null;
    const interior = formData.get("interior") as string | null;
    const riwayat_servis = formData.get("riwayat_servis") as string | null;
    const lokasi_mobil = formData.get("lokasi_mobil") as string | null;

    const imagesFiles = formData.getAll("images") as File[];

    console.log("PUT data:", { id, nama_barang, tanggal, harga_awal, hasImage: !!image });

    if (!nama_barang || !tanggal || isNaN(harga_awal) || !deskripsi) {
      return NextResponse.json({ error: "Invalid form data: missing required fields" }, { status: 400 });
    }

    const dateObj = new Date(tanggal);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Upload gambar utama ke Cloudinary (jika ada)
    let image_url: string | undefined = undefined;
    if (image instanceof File && image.size > 0) {
      try {
        console.log(`Uploading main image to Cloudinary for product ${id}...`);
        image_url = await uploadToCloudinary(image);
        console.log("Main image uploaded:", image_url);
      } catch (uploadErr: any) {
        console.error("Cloudinary upload error:", uploadErr);
        return NextResponse.json({ error: `Gagal mengunggah gambar: ${uploadErr.message}` }, { status: 500 });
      }
    }

    // Upload additional images ke Cloudinary
    let additionalImages: string[] = [];
    for (const img of imagesFiles) {
      if (!(img instanceof File) || img.size === 0) continue;
      try {
        const url = await uploadToCloudinary(img);
        additionalImages.push(url);
      } catch (uploadErr: any) {
        console.error("Cloudinary additional image upload error:", uploadErr);
      }
    }

    const updateData: any = {
      nama_barang,
      tanggal: new Date(tanggal),
      harga_awal,
      deskripsi,
      kategori: kategori && kategori.trim() ? kategori : null,
      merk_mobil: merk_mobil && merk_mobil.trim() ? merk_mobil : null,
      tipe_mobil: tipe_mobil && tipe_mobil.trim() ? tipe_mobil : null,
      transmisi: transmisi && transmisi.trim() ? transmisi : null,
      jumlah_seat: jumlah_seat || null,
      tahun: tahun || null,
      kilometer: kilometer || null,
      lokasi_mobil: lokasi_mobil || null,
      mesin: mesin || null,
      interior: interior || null,
      riwayat_servis: riwayat_servis || null,
    };

    if (image_url !== undefined) {
      updateData.image_url = image_url;
    }

    if (additionalImages.length > 0) {
      updateData.images = additionalImages;
    }

    const produk = await prisma.produk.update({
      where: { id },
      data: updateData,
    });

    console.log("Produk updated successfully:", produk.id);
    return NextResponse.json(produk);
  } catch (err: any) {
    console.error("PUT /api/produk error:", err);
    const message = err.message || "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.produk.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
