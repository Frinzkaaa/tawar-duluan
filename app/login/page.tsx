"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (!email || !password) {
        setErrorMsg("Email dan password harus diisi");
        setLoading(false);
        return;
      }

      // Gunakan NextAuth untuk login credentials
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error("Email atau password salah");
      }

      // Ambil data user/role dari session setelah login berhasil
      const sessionRes = await fetch("/api/me");
      const user = await sessionRes.json();
      
      if (user.role === "admin") {
        router.push("/admin/laporan");
      } else if (user.role === "petugas") {
        router.push("/petugas/dashboard");
      } else {
        router.push("/"); 
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_left,#0138C9,40%,#001f7a,70%,#D8FF4B)] p-6">
      <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-2xl border border-white/20 shadow-[0_0_45px_rgba(1,56,201,0.35)] bg-white/10">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-white">
          Tawar Duluan
        </h1>

        {errorMsg && (
          <p className="p-3 text-center text-yellow-300 text-sm mb-4 bg-white/10 rounded">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-white/15 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#D8FF4B]"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 rounded-xl bg-white/15 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#D8FF4B]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold transition text-white uppercase tracking-widest text-xs ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-[#0138C9] hover:bg-[#012fa3]"
            }`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-white/50">Atau masuk dengan</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-xl font-bold transition bg-white text-gray-900 flex items-center justify-center gap-3 hover:bg-gray-100 uppercase tracking-widest text-xs shadow-lg"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Google
        </button>

        <p className="text-center mt-8 text-white/90 text-[11px] uppercase tracking-widest font-bold">
          Belum punya akun?{" "}
          <a href="/register" className="text-[#D8FF4B] hover:underline">
            Daftar Gratis
          </a>
        </p>
      </div>
    </div>
  );
}
