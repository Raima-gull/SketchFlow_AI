import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import useAuthStore from "../store/authStore";

/* ═══════════════════════════════════════════════════
   BANNER
   ═══════════════════════════════════════════════════ */
function Banner({ type, message }) {
  if (!message) return null;
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -6, height: 0 }}
      className="overflow-hidden mb-6"
    >
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm backdrop-blur-sm ${
          isSuccess
            ? "bg-emerald-500/[0.08] border-emerald-400/30 text-emerald-300"
            : "bg-red-500/[0.08] border-red-400/30 text-red-300"
        }`}
      >
        <Icon size={16} className="flex-shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   PASSWORD FIELD
   ═══════════════════════════════════════════════════ */
function PasswordField({ label, hint, value, onChange, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative group">
        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00E5FF] transition-colors duration-200 pointer-events-none"
        />
        <input
          {...props}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full h-12 pl-11 pr-12 rounded-xl bg-[#0D0D0D] border border-white/[0.08] text-[15px] text-white placeholder:text-gray-600 transition-all duration-200 hover:border-white/[0.16] focus:outline-none focus:border-[#00E5FF]/60 focus:bg-[#00E5FF]/[0.02] focus:shadow-[0_0_0_4px_rgba(0,229,255,0.06)]"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && <p className="text-xs text-gray-500 mt-2">{hint}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FIELD
   ═══════════════════════════════════════════════════ */
function Field({ label, icon: Icon, hint, ...props }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00E5FF] transition-colors duration-200 pointer-events-none"
          />
        )}
        <input
          {...props}
          className={`w-full h-12 ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 rounded-xl bg-[#0D0D0D] border text-[15px] text-white placeholder:text-gray-600 transition-all duration-200 ${
            props.disabled
              ? "border-white/[0.04] opacity-60 cursor-not-allowed"
              : "border-white/[0.08] hover:border-white/[0.16] focus:outline-none focus:border-[#00E5FF]/60 focus:bg-[#00E5FF]/[0.02] focus:shadow-[0_0_0_4px_rgba(0,229,255,0.06)]"
          }`}
        />
      </div>
      {hint && <p className="text-xs text-gray-500 mt-2">{hint}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PASSWORD STRENGTH
   ═══════════════════════════════════════════════════ */
function PasswordStrength({ password }) {
  if (!password) return null;

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;

  const levels = [
    { label: "Very weak", color: "bg-red-500", text: "text-red-400" },
    { label: "Weak", color: "bg-orange-500", text: "text-orange-400" },
    { label: "Fair", color: "bg-yellow-500", text: "text-yellow-400" },
    { label: "Good", color: "bg-emerald-500", text: "text-emerald-400" },
    { label: "Strong", color: "bg-emerald-400", text: "text-emerald-300" },
  ];
  const level = levels[Math.min(score, 4)];

  return (
    <div className="mt-2.5">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? level.color : "bg-white/[0.08]"
            }`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-medium ${level.text}`}>{level.label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const changePassword = useAuthStore((s) => s.changePassword);

  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  const tabs = [
    { id: "profile", label: "Profile", icon: User, desc: "Personal information" },
    { id: "security", label: "Security", icon: Shield, desc: "Password & access" },
  ];

  /* ── Handlers ─────────────────────────── */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    if (!name.trim() || name.trim().length < 2) {
      return setProfileMsg({ type: "error", text: "Name must be at least 2 characters." });
    }
    setSavingProfile(true);
    try {
      await updateProfile({ name: name.trim() });
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });
    if (newPassword.length < 8) {
      return setPasswordMsg({ type: "error", text: "Password must be at least 8 characters." });
    }
    if (newPassword !== confirmPassword) {
      return setPasswordMsg({ type: "error", text: "Passwords do not match." });
    }
    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMsg({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const initials = user?.name?.charAt(0).toUpperCase() || "U";
  const passwordMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  return (
    <DashboardLayout>
      {/* ═══════════ HERO HEADER ═══════════ */}
      <div className="mb-10 relative">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#00E5FF]/[0.06] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-20 right-0 w-72 h-72 bg-[#38BDF8]/[0.04] rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#00E5FF] blur-xl opacity-40 rounded-2xl" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#38BDF8] flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(0,229,255,0.5)]">
                  <Sparkles size={22} className="text-black" />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#00E5FF] uppercase tracking-[0.18em]">
                  Account
                </p>
                <h1 className="text-[28px] font-bold text-white leading-tight tracking-tight">
                  Settings
                </h1>
              </div>
            </div>
            <p className="text-[15px] text-gray-400 max-w-lg leading-relaxed">
              Manage your profile and secure your account.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#38BDF8] flex items-center justify-center text-black font-bold text-sm">
                {initials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#050505]" />
            </div>
            <div className="pr-1">
              <p className="text-[13px] font-semibold text-white leading-tight">
                {user?.name?.split(" ")[0] || "User"}
              </p>
              <p className="text-[10px] text-[#00E5FF] font-semibold leading-tight uppercase tracking-wider">
                {user?.plan === "pro" ? "Pro plan" : "Free plan"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* ═══════════ SIDEBAR ═══════════ */}
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:sticky lg:top-6 lg:self-start"
        >
          <div className="relative rounded-2xl bg-gradient-to-b from-[#0C0C0C] to-[#080808] border border-white/[0.06] overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-[#00E5FF]/[0.06] rounded-full blur-[60px] pointer-events-none" />

            <div className="relative p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left overflow-hidden ${
                        active
                          ? "bg-gradient-to-r from-[#00E5FF]/[0.14] via-[#00E5FF]/[0.04] to-transparent"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeBar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-9 rounded-r-full bg-[#00E5FF] shadow-[0_0_14px_rgba(0,229,255,0.9)]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <div
                        className={`relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          active
                            ? "bg-gradient-to-br from-[#00E5FF] to-[#38BDF8] text-black shadow-[0_4px_16px_-2px_rgba(0,229,255,0.5)]"
                            : "bg-white/[0.04] text-gray-400 group-hover:bg-white/[0.08] group-hover:text-white"
                        }`}
                      >
                        <Icon size={17} strokeWidth={active ? 2.4 : 2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-[13.5px] font-semibold leading-tight transition-colors ${
                            active ? "text-white" : "text-gray-300 group-hover:text-white"
                          }`}
                        >
                          {tab.label}
                        </p>
                        <p
                          className={`text-[11px] mt-0.5 leading-tight transition-colors ${
                            active ? "text-[#00E5FF]/80" : "text-gray-500"
                          }`}
                        >
                          {tab.desc}
                        </p>
                      </div>
                      <div
                        className={`flex-shrink-0 transition-all duration-200 ${
                          active
                            ? "opacity-100 translate-x-0 text-[#00E5FF]"
                            : "opacity-0 -translate-x-1 text-gray-500 group-hover:opacity-100 group-hover:translate-x-0"
                        }`}
                      >
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Secure tip card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="relative mt-4 rounded-2xl overflow-hidden border border-emerald-400/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.1] via-emerald-500/[0.02] to-transparent" />
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/[0.15] rounded-full blur-2xl pointer-events-none" />

            <div className="relative p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-white leading-tight">
                    End-to-end encrypted
                  </p>
                  <p className="text-[10px] text-emerald-400/80 font-medium leading-tight mt-0.5">
                    Your account is secure
                  </p>
                </div>
              </div>

              <div className="h-px bg-emerald-400/10 mb-2.5" />

              <div className="space-y-1.5">
                {["256-bit AES encryption", "Zero-knowledge storage"].map((tip, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 size={10} className="text-emerald-400 flex-shrink-0" />
                    <p className="text-[10.5px] text-gray-400 leading-tight">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.aside>

        {/* ═══════════ CONTENT PANEL ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl bg-gradient-to-b from-[#0C0C0C] via-[#0A0A0A] to-[#080808] border border-white/[0.06] overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent" />
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#00E5FF]/[0.07] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#38BDF8]/[0.05] rounded-full blur-[100px] pointer-events-none" />

          <div className="relative p-6 sm:p-9">
            <AnimatePresence mode="wait">
              {/* ═══════════ PROFILE ═══════════ */}
              {activeTab === "profile" && (
                <motion.form
                  key="profile"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSaveProfile}
                  className="max-w-xl"
                >
                  <div className="mb-7">
                    <h2 className="text-xl font-bold text-white mb-1.5">
                      Profile Information
                    </h2>
                    <p className="text-sm text-gray-500">
                      Update your personal details.
                    </p>
                  </div>

                  <div className="relative flex items-center gap-4 p-5 mb-8 rounded-xl overflow-hidden bg-gradient-to-br from-[#00E5FF]/[0.08] via-white/[0.02] to-transparent border border-[#00E5FF]/[0.15]">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00E5FF]/[0.1] rounded-full blur-2xl pointer-events-none" />
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#38BDF8] flex items-center justify-center text-black font-extrabold text-xl shadow-[0_8px_28px_-6px_rgba(0,229,255,0.55)]">
                        {initials}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0C0C0C] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    </div>
                    <div className="relative flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-white truncate">
                        {user?.name || "Your Name"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                        <CheckCircle2 size={10} />
                        Active account
                      </p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {profileMsg.text && (
                      <Banner type={profileMsg.type} message={profileMsg.text} />
                    )}
                  </AnimatePresence>

                  <div className="space-y-5">
                    <Field
                      label="Full Name"
                      icon={User}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                    <Field
                      label="Email Address"
                      icon={Mail}
                      type="email"
                      value={user?.email || ""}
                      disabled
                      hint="Email is linked to your account and cannot be changed."
                    />

                    <div className="flex items-center gap-3 pt-3">
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="group relative inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-black font-bold text-sm overflow-hidden transition-all duration-200 hover:shadow-[0_8px_28px_-6px_rgba(0,229,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {savingProfile ? (
                          <>
                            <Loader2 size={16} className="animate-spin relative" />
                            <span className="relative">Saving...</span>
                          </>
                        ) : (
                          <>
                            <span className="relative">Save Changes</span>
                            <ArrowRight
                              size={16}
                              className="relative group-hover:translate-x-0.5 transition-transform"
                            />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}

              {/* ═══════════ SECURITY ═══════════ */}
              {activeTab === "security" && (
                <motion.form
                  key="security"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleChangePassword}
                  className="max-w-xl"
                >
                  <div className="mb-7">
                    <h2 className="text-xl font-bold text-white mb-1.5">
                      Security
                    </h2>
                    <p className="text-sm text-gray-500">
                      Keep your account protected with a strong password.
                    </p>
                  </div>

                  <div className="relative flex items-start gap-3 p-4 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500/[0.1] via-emerald-500/[0.02] to-transparent border border-emerald-400/25">
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/[0.15] rounded-full blur-2xl pointer-events-none" />
                    <div className="relative w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={17} className="text-emerald-400" />
                    </div>
                    <div className="relative flex-1">
                      <p className="text-sm font-semibold text-white mb-0.5">
                        Account is protected
                      </p>
                      <p className="text-xs text-gray-400">
                        Last password change:{" "}
                        <span className="text-emerald-400 font-medium">
                          {user?.updatedAt
                            ? new Date(user.updatedAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recently"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <KeyRound size={15} className="text-[#00E5FF]" />
                      <h3 className="text-sm font-semibold text-white">
                        Change Password
                      </h3>
                    </div>

                    <AnimatePresence>
                      {passwordMsg.text && (
                        <Banner type={passwordMsg.type} message={passwordMsg.text} />
                      )}
                    </AnimatePresence>

                    <div className="space-y-4">
                      <PasswordField
                        label="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                      />
                      <PasswordField
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        required
                        minLength={8}
                      />
                      <PasswordStrength password={newPassword} />
                      <PasswordField
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                      />
                      {confirmPassword.length > 0 && (
                        <div className="flex items-center gap-1.5 -mt-1">
                          {passwordMatch ? (
                            <>
                              <CheckCircle2 size={12} className="text-emerald-400" />
                              <p className="text-[11px] text-emerald-400 font-medium">
                                Passwords match
                              </p>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={12} className="text-red-400" />
                              <p className="text-[11px] text-red-400 font-medium">
                                Passwords do not match
                              </p>
                            </>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={savingPassword}
                          className="group relative inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-white text-black font-bold text-sm overflow-hidden transition-all duration-200 hover:bg-gray-100 hover:shadow-[0_8px_28px_-6px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingPassword ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              Update Password
                              <ArrowRight
                                size={16}
                                className="group-hover:translate-x-0.5 transition-transform"
                              />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield size={13} className="text-gray-400" />
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Security Tips
                      </p>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { text: "Use at least 12 characters for stronger security", ok: newPassword.length >= 12 },
                        { text: "Mix uppercase and lowercase letters", ok: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) },
                        { text: "Include at least one number", ok: /[0-9]/.test(newPassword) },
                        { text: "Add a special character", ok: /[^A-Za-z0-9]/.test(newPassword) },
                      ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div
                            className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                              tip.ok ? "bg-emerald-500/15" : "bg-white/[0.04]"
                            }`}
                          >
                            {tip.ok ? (
                              <Check size={10} className="text-emerald-400" strokeWidth={3} />
                            ) : (
                              <div className="w-1 h-1 rounded-full bg-gray-500" />
                            )}
                          </div>
                          <p
                            className={`text-[12px] leading-tight ${
                              tip.ok ? "text-gray-400 line-through" : "text-gray-400"
                            }`}
                          >
                            {tip.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}