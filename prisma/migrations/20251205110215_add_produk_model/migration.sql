-- CreateTable
CREATE TABLE "Produk" (
    "id" TEXT NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "harga_awal" INTEGER NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("id")
);
