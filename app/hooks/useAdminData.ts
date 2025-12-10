"use client";
import { useState, useEffect } from "react";

interface AdminData {
  name: string;
  email: string;
  role: string;
}

export function useAdminData() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdmin() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Gagal mengambil data admin");
        const data = await res.json();
        setAdminData(data);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data admin");
      } finally {
        setLoading(false);
      }
    }

    fetchAdmin();
  }, []);

  return { adminData, loading, error };
}
