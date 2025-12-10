"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "masyarakat" }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMsg({ type: "success", text: "Akun berhasil dibuat! Mengalihkan ke login..." });

        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
      } else {
        setMsg({ type: "error", text: data.error || "Gagal mendaftar" });
      }
    } catch {
      setMsg({ type: "error", text: "Terjadi kesalahan server" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_left,#0138C9,40%,#001f7a,70%,#D8FF4B)] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md p-10 rounded-3xl backdrop-blur-2xl border border-white/20 shadow-[0_0_45px_rgba(1,56,201,0.35)] bg-white/10 overflow-hidden"
      >
        <h1 className="text-4xl font-extrabold text-center mb-8 text-white">Daftar Akun</h1>

        <form onSubmit={handleRegister} className="space-y-6 relative z-10">
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Lengkap"
            className="w-full p-3 rounded-xl bg-white/15 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#D8FF4B]"
          />
          
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-white/15 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#D8FF4B]"
          />

          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/15 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#D8FF4B]"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-[#0138C9] hover:bg-[#012fa3]"
            } text-white`}
          >
            {loading ? "Memproses..." : "Daftar"}
          </motion.button>

          {msg && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center text-sm mt-2 ${
                msg.type === "error" ? "text-yellow-300" : "text-green-300"
              }`}
            >
              {msg.text}
            </motion.p>
          )}
        </form>

        <p className="text-center mt-6 text-white/90">
          Sudah punya akun?{" "}
          <a href="/login" className="text-[#D8FF4B] font-semibold">
            Masuk
          </a>
        </p>
      </motion.div>
    </div>
  );
}
