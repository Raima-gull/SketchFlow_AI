import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register({ name, email, password });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex relative overflow-hidden">
      {/* =========================================
          SKETCH BACKGROUND (Same as Login)
          ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.15]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

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

        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-[20%] right-[10%] text-[#00E5FF]"
        >
          <Sparkles size={48} strokeWidth={1} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-[20%] left-[10%] text-[#38BDF8]"
        >
          <Shield size={56} strokeWidth={1} />
        </motion.div>
      </div>

      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00E5FF]/[0.05] rounded-full blur-[120px] pointer-events-none" />

      {/* =========================================
          MAIN CONTENT
          ========================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-6 py-12">
        {/* LEFT SIDE — HEADINGS & BENEFITS */}
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

          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Start creating <br />
            <span className="bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] bg-clip-text text-transparent">
              with AI today.
            </span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed mb-10">
            Join the next generation of creators. No credit card required. Unlimited possibilities.
          </p>

          <div className="space-y-5">
            {[
              { icon: CheckCircle2, text: "Unlimited AI generations" },
              { icon: Zap, text: "Lightning-fast image & video models" },
              { icon: Shield, text: "Private, secure workspace" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} className="text-[#00E5FF]" />
                </div>
                <span className="text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE — REGISTER FORM */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:ml-auto bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl relative"
        >
          <div className="absolute -top-px -left-px w-20 h-20 border-t-2 border-l-2 border-[#00E5FF]/40 rounded-tl-3xl pointer-events-none" />
          <div className="absolute -bottom-px -right-px w-20 h-20 border-b-2 border-r-2 border-[#00E5FF]/40 rounded-br-3xl pointer-events-none" />

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">Create account</h2>
            <p className="text-gray-400 text-sm">Start your creative journey today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-12 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all"
              />
            </div>

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
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
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
                "Creating..."
              ) : (
                <>
                  Create account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#00E5FF] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}