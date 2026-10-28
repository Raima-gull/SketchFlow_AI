import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Sparkles, PenTool, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  // If already logged in (e.g. cookie valid), skip the login page
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isInitialized, isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex relative overflow-hidden">
      {/* =========================================
          SKETCH BACKGROUND (The Wireframe Design)
          ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.15]">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Animated Sketch Lines (SVG) */}
        <svg
          className="absolute w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            d="M100,400 Q400,100 700,400 T400,700"
            stroke="#00E5FF"
            strokeWidth="2"
            strokeDasharray="10 10"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
            d="M200,200 L600,600 M600,200 L200,600"
            stroke="#38BDF8"
            strokeWidth="1"
            opacity="0.5"
          />
          <circle cx="400" cy="400" r="300" stroke="#00E5FF" strokeWidth="1" strokeDasharray="5 15" />
        </svg>

        {/* Floating Sketch Icons */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-[20%] left-[10%] text-[#00E5FF]"
        >
          <PenTool size={48} strokeWidth={1} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-[20%] right-[10%] text-[#38BDF8]"
        >
          <LayoutGrid size={56} strokeWidth={1} />
        </motion.div>
      </div>

      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00E5FF]/[0.05] rounded-full blur-[120px] pointer-events-none" />

      {/* =========================================
          MAIN CONTENT
          ========================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-6 py-12">
        {/* LEFT SIDE — HEADINGS & BRANDING */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block max-w-lg"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#38BDF8] flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.3)] group-hover:scale-105 transition-transform">
              <Sparkles size={24} className="text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              SketchFlow <span className="text-[#00E5FF]">AI</span>
            </span>
          </Link>

          <h1 className="text-6xl font-extrabold leading-[1.05] tracking-tight mb-6">
            Create. <br />
            Design. <br />
            <span className="bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] bg-clip-text text-transparent">
              Generate.
            </span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed mb-10">
            Your all-in-one AI creative studio for building websites, generating images and videos, and creating code from one powerful workspace.
          </p>

          <div className="flex items-center gap-6 border-t border-white/[0.08] pt-8">
            <div>
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Creators</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-3xl font-bold text-white">500K+</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Generations</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-3xl font-bold text-white">99.9%</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Uptime</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE — LOGIN FORM */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:ml-auto bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl relative"
        >
          {/* Decorative corner */}
          <div className="absolute -top-px -left-px w-20 h-20 border-t-2 border-l-2 border-[#00E5FF]/40 rounded-tl-3xl pointer-events-none" />
          <div className="absolute -bottom-px -right-px w-20 h-20 border-b-2 border-r-2 border-[#00E5FF]/40 rounded-br-3xl pointer-events-none" />

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">Welcome back</h2>
            <p className="text-gray-400 text-sm">Sign in to continue to your studio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-12 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs text-[#00E5FF] hover:text-[#38BDF8] transition">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-black font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,229,255,0.25)] disabled:opacity-70 mt-2"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#00E5FF] hover:underline font-medium">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}