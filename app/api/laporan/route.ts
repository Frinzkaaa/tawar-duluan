import { NextResponse } from 'next/server';

interface Laporan {
  id: string;
  judul: string;
  status: "Menunggu" | "Diproses" | "Selesai";
  tanggal: string;
  user: string;
}

export async function GET() {
  try {
    // Mock data for demonstration
    const mockData: Laporan[] = [
      {
        id: "1",
        judul: "Laporan Kerusakan Jalan",
        status: "Menunggu",
        tanggal: "2024-12-01",
        user: "John Doe"
      },
      {
        id: "2",
        judul: "Laporan Pencemaran Sungai",
        status: "Diproses",
        tanggal: "2024-11-28",
        user: "Jane Smith"
      },
      {
        id: "3",
        judul: "Laporan Kebakaran Hutan",
        status: "Selesai",
        tanggal: "2024-11-25",
        user: "Bob Johnson"
      }
    ];

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching laporan data:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data laporan' },
      { status: 500 }
    );
  }
}
