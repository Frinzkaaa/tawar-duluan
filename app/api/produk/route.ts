
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Kategori } from "@/lib/generated";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const produk = await prisma.produk.findMany({
      include: {
        _count: {
          select: { bids: true }
        },
        bids: {
          where: {
            status: 'approved'
          },
          select: {
            id: true
          },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to add isSold flag
    const mappedProduk = produk.map(item => ({
      ...item,
      isSold: item.bids.length > 0
    }));

    console.log("Fetched produk successfully:", mappedProduk.length, "items");
    return NextResponse.json(mappedProduk);
  } catch (err: any) {
    console.error("GET /api/produk error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
    const lokasi_mobil = formData.get("lokasi_mobil") as string | null;

    console.log("Received form data:", {
      nama_barang,
      tanggal,
      harga_awal,
      deskripsi,
      kategori,
      hasImage: !!image,
      imageSize: image instanceof File ? image.size : 0,
    });

    if (!nama_barang || !tanggal || isNaN(harga_awal) || !deskripsi) {
      return NextResponse.json({ error: "Invalid form data: missing required fields" }, { status: 400 });
    }

    const dateObj = new Date(tanggal);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Upload gambar ke Cloudinary (jika ada)
    let image_url: string | null = null;
    if (image instanceof File && image.size > 0) {
      try {
        console.log("Uploading image to Cloudinary...");
        image_url = await uploadToCloudinary(image);
        console.log("Image uploaded:", image_url);
      } catch (uploadErr: any) {
        console.error("Cloudinary upload error:", uploadErr);
        return NextResponse.json({ error: `Gagal mengunggah gambar: ${uploadErr.message}` }, { status: 500 });
      }
    }

    const produk = await prisma.produk.create({
      data: {
        nama_barang,
        tanggal: new Date(tanggal),
        harga_awal,
        deskripsi,
        image_url,
        kategori: kategori && kategori.trim() ? (kategori as Kategori) : undefined,
        merk_mobil: merk_mobil && merk_mobil.trim() ? merk_mobil : null,
        tipe_mobil: tipe_mobil && tipe_mobil.trim() ? tipe_mobil : null,
        transmisi: transmisi && transmisi.trim() ? transmisi : null,
        jumlah_seat: jumlah_seat || null,
        tahun: tahun || null,
        kilometer: kilometer || null,
        lokasi_mobil: lokasi_mobil || null,
      },
    });

    console.log("Produk created successfully:", produk.id);

    // --- NOTIFICATION LOGIC: New Product Interest ---
    try {
      if (merk_mobil) {
        const interestedUsers = await prisma.watchlist.findMany({
          where: {
            produk: {
              merk_mobil: {
                equals: merk_mobil,
                mode: 'insensitive'
              }
            }
          },
          select: { userId: true },
          distinct: ['userId']
        });

        if (interestedUsers.length > 0) {
          await prisma.notification.createMany({
            data: interestedUsers.map(u => ({
              userId: u.userId,
              title: "Mobil Baru Sesuai Minat!",
              message: `Ada ${nama_barang} (${merk_mobil}) baru saja masuk! Cek sekarang sebelum terlambat.`,
              type: "new_product",
              link: `/jelajahi/${produk.id}`
            }))
          });
        }
      }
    } catch (notifErr) {
      console.error('Error sending new product notifications:', notifErr);
    }

    return NextResponse.json(produk);
  } catch (err: any) {
    console.error("POST /api/produk error:", err);
    const message = err.message || "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
