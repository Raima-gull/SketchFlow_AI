import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  FolderKanban,
  ImagePlus,
  Video,
  LogOut,
  Box,
  Settings,
  X,
  AlertCircle,
  Code2,
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // ❌ 'Settings' ko is list se hata diya gaya hai
  const links = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Image Studio', path: '/image', icon: ImagePlus },
    { name: 'Video Studio', path: '/video', icon: Video },
    { name: 'Code Studio', path: '/code', icon: Code2 },
  ];

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/', { replace: true });
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <aside className="w-[280px] fixed left-0 top-0 h-screen flex flex-col z-40 bg-[#050505] border-r border-white/[0.05]">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#38BDF8] flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
            <Box size={22} className="text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            SketchFlow
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm overflow-hidden group ${
                  active ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/20 to-transparent rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {!active && (
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                )}
                <Icon size={20} className={`relative z-10 ${active ? 'text-[#00E5FF]' : ''}`} />
                <span className="relative z-10">{link.name}</span>
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00E5FF] rounded-r-full shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 m-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          {/* ✅ User Info + Settings Icon (Same Line) */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#38BDF8] flex items-center justify-center text-black font-bold text-lg shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {/* Name & Plan */}
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.plan === 'pro' ? 'Pro Member' : 'Free Member'}
                </p>
              </div>
            </div>

            {/* ✅ Settings Icon shifted here (Top Right of Profile Card) */}
            <Link
              to="/settings"
              title="Settings"
              className={`shrink-0 p-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/settings'
                  ? 'bg-[#00E5FF]/10 text-[#00E5FF]'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings size={18} />
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ═══════════ LOGOUT CONFIRMATION MODAL ═══════════ */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => !loggingOut && setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm relative rounded-3xl bg-[#0A0A0A] border border-white/[0.08] p-6 overflow-hidden shadow-2xl"
            >
              {/* Ambient glow */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={() => !loggingOut && setShowLogoutModal(false)}
                disabled={loggingOut}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-50"
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div className="relative w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <AlertCircle size={26} className="text-red-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[#0A0A0A] animate-pulse" />
              </div>

              {/* Title */}
              <h3 className="relative text-xl font-bold text-white mb-2">
                Are you sure?
              </h3>
              <p className="relative text-sm text-gray-400 leading-relaxed mb-6">
                You're about to log out of your account. You'll need to sign in again to access your workspace.
              </p>

              {/* Buttons */}
              <div className="relative flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loggingOut}
                  className="flex-1 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-semibold text-sm hover:bg-white/[0.08] hover:border-white/[0.16] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  disabled={loggingOut}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm hover:shadow-[0_8px_24px_-6px_rgba(239,68,68,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loggingOut ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut size={15} />
                      Logout
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}