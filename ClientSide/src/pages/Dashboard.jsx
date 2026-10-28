import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  FolderKanban,
  ImagePlus,
  RefreshCw,
  Sparkles,
  Video,
  WandSparkles,
  Zap,
} from 'lucide-react';

import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const statItems = [
  {
    key: 'projects',
    label: 'Total projects',
    icon: FolderKanban,
    color: '#00E5FF',
    glow: 'rgba(0, 229, 255, 0.15)',
  },
  {
    key: 'images',
    label: 'Images generated',
    icon: ImagePlus,
    color: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.15)',
  },
  {
    key: 'videos',
    label: 'Videos created',
    icon: Video,
    color: '#E5E7EB',
    glow: 'rgba(229, 231, 235, 0.1)',
  },
];

const tools = [
  {
    title: 'Image studio',
    description: 'Turn your next idea into an image.',
    href: '/image',
    icon: ImagePlus,
    accent: 'cyan',
    number: '01',
    tag: 'VISUAL CREATION',
  },
  {
    title: 'Video studio',
    description: 'Give a still idea a little motion.',
    href: '/video',
    icon: Video,
    accent: 'blue',
    number: '02',
    tag: 'MOTION DESIGN',
  },
];

function getTotal(response) {
  const total = Number(response?.data?.data?.pagination?.total ?? 0);
  return Number.isFinite(total) ? total : 0;
}

function StatCard({ item, index, value, loading }) {
  const Icon = item.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, rotateX: -5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.55,
        delay: 0.12 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -7,
        rotateX: 3,
        rotateY: index === 1 ? 2 : -2,
        transition: { duration: 0.22 },
      }}
      style={{
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className="group relative min-h-[190px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0A0A0A] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.3)] transition-colors hover:border-[#00E5FF]/30 sm:p-6"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full opacity-70 blur-[55px] transition-all duration-500 group-hover:scale-125 group-hover:opacity-100"
        style={{ background: item.glow }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent" />

      <div
        className="relative flex h-full flex-col justify-between"
        style={{ transform: 'translateZ(20px)' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{item.label}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                Workspace total
              </span>
            </div>
          </div>

          <span
            className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.04] transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110"
            style={{ color: item.color }}
          >
            <Icon size={21} strokeWidth={1.8} />
          </span>
        </div>

        <div className="mt-7 flex items-end justify-between">
          <p className="text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
            {loading ? (
              <span
                className="inline-block h-10 w-16 animate-pulse rounded-lg bg-white/[0.08]"
                aria-label="Loading"
              />
            ) : value === null ? (
              '—'
            ) : (
              new Intl.NumberFormat().format(value)
            )}
          </p>

          <span
            className="mb-1 grid h-8 w-8 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-gray-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            aria-hidden="true"
          >
            <ArrowUpRight size={15} />
          </span>
        </div>

        <div
          className="absolute bottom-0 left-0 h-[2px] w-1/3 rounded-full opacity-70 transition-all duration-500 group-hover:w-full"
          style={{
            background: `linear-gradient(90deg, ${item.color}, transparent)`,
          }}
        />
      </div>
    </motion.article>
  );
}

function ToolCard({ tool, index }) {
  const Icon = tool.icon;
  const isCyan = tool.accent === 'cyan';

  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.55,
        delay: 0.2 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5 }}
    >
      <Link
        to={tool.href}
        className={`group relative flex min-h-[160px] overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
          isCyan
            ? 'border-[#00E5FF]/10 bg-[#00E5FF]/[0.02] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/[0.05]'
            : 'border-[#38BDF8]/10 bg-[#38BDF8]/[0.02] hover:border-[#38BDF8]/30 hover:bg-[#38BDF8]/[0.05]'
        }`}
      >
        <div
          className={`pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full blur-[55px] transition-opacity duration-300 ${
            isCyan
              ? 'bg-[#00E5FF]/10 group-hover:bg-[#00E5FF]/20'
              : 'bg-[#38BDF8]/10 group-hover:bg-[#38BDF8]/20'
          }`}
        />

        <div className="relative flex w-full items-start justify-between">
          <div className="flex flex-col">
            <span
              className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl border transition-transform duration-300 group-hover:rotate-[-7deg] group-hover:scale-110 ${
                isCyan
                  ? 'border-[#00E5FF]/20 bg-[#00E5FF]/10 text-[#00E5FF]'
                  : 'border-[#38BDF8]/20 bg-[#38BDF8]/10 text-[#38BDF8]'
              }`}
            >
              <Icon size={22} strokeWidth={1.8} />
            </span>

            <span className="text-lg font-bold tracking-tight text-white">
              {tool.title}
            </span>
            <span className="mt-1 text-sm text-gray-400">
              {tool.description}
            </span>
          </div>

          <span
            className={`text-[10px] font-mono tracking-[0.16em] ${
              isCyan ? 'text-[#00E5FF]/60' : 'text-[#38BDF8]/60'
            }`}
          >
            {tool.number}
          </span>
        </div>

        <span
          className={`absolute bottom-5 right-5 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.13em] ${
            isCyan ? 'text-[#00E5FF]' : 'text-[#38BDF8]'
          }`}
        >
          {tool.tag}
          <ArrowUpRight
            size={14}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </Link>
    </motion.div>
  );
}

export default function Dashboard({ onUpgrade }) {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || 'Creator';

  const [stats, setStats] = useState({
    projects: null,
    images: null,
    videos: null,
  });
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    setLoading(true);
    setHasError(false);

    Promise.allSettled([
      api.get('/projects'),
      api.get('/media?type=image'),
      api.get('/media?type=video'),
    ]).then((results) => {
      if (!isCurrent) return;

      setStats({
        projects:
          results[0].status === 'fulfilled'
            ? getTotal(results[0].value)
            : null,
        images:
          results[1].status === 'fulfilled'
            ? getTotal(results[1].value)
            : null,
        videos:
          results[2].status === 'fulfilled'
            ? getTotal(results[2].value)
            : null,
      });

      setHasError(results.some((result) => result.status === 'rejected'));
      setLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <DashboardLayout>
      <main className="relative isolate min-h-screen overflow-hidden bg-black text-white ">
        
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-[#00E5FF]/[0.08] blur-[110px]"
          animate={{ x: [0, -22, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-[42%] h-80 w-80 rounded-full bg-[#38BDF8]/[0.06] blur-[110px]"
          animate={{ x: [0, 20, 0], y: [0, -18, 0], scale: [1.05, 1, 1.05] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="relative mx-auto w-full max-w-7xl space-y-8 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          
          <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold tracking-[0.17em] text-gray-400">
                <Sparkles size={12} className="text-[#00E5FF]" />
                YOUR CREATIVE SPACE
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Welcome back,
                <br className="sm:hidden" />{' '}
                <span className="bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] bg-clip-text text-transparent">
                  {firstName}.
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                A fresh day, a blank canvas, and plenty of room for what’s next.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <span className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-xs text-gray-400">
                {dateLabel}
              </span>

              <Link
                to="/image"
                className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] px-4 text-sm font-bold text-black shadow-[0_8px_30px_rgba(0,229,255,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,229,255,0.4)]"
              >
                <WandSparkles size={16} />
                Create something
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </header>

          <section aria-label="Workspace statistics">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mb-4 flex items-end justify-between"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                  At a glance
                </p>
                <h2 className="mt-1 text-lg font-bold text-white">
                  Your workspace
                </h2>
              </div>
              <span className="hidden text-xs text-gray-500 sm:inline">
                Live account totals
              </span>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {statItems.map((item, index) => (
                <StatCard
                  key={item.key}
                  item={item}
                  index={index}
                  value={stats[item.key]}
                  loading={loading}
                />
              ))}
            </div>

            {hasError && !loading && (
              <div
                className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3 text-sm text-amber-200 sm:flex-row sm:items-center sm:justify-between"
                role="status"
              >
                <span className="flex items-center gap-2">
                  <CircleAlert size={16} />
                  Some metrics couldn’t load. Try refreshing them.
                </span>
                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  className="inline-flex items-center gap-2 self-start text-xs font-bold text-amber-200 transition hover:text-white sm:self-auto"
                >
                  <RefreshCw size={13} />
                  Retry
                </button>
              </div>
            )}
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(285px,0.75fr)]">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#0A0A0A] p-5 sm:p-7"
            >
              <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-[#00E5FF]/[0.06] blur-[85px]" />
              <div className="pointer-events-none absolute bottom-[-120px] left-[35%] h-64 w-64 rounded-full bg-[#38BDF8]/[0.04] blur-[85px]" />

              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#00E5FF]/20 bg-[#00E5FF]/10 text-[#00E5FF]">
                      <Zap size={20} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#00E5FF]/70">
                        Quick start
                      </p>
                      <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Your next idea starts here.
                      </h2>
                    </div>
                  </div>

                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[10px] text-gray-400">
                    PICK A CREATIVE TOOL
                  </span>
                </div>

                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
                  Start with a visual or a moving image. You can shape the idea as you go.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {tools.map((tool, index) => (
                    <ToolCard key={tool.href} tool={tool} index={index} />
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4 text-xs text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_9px_rgba(0,229,255,0.7)]" />
                  Your projects and creations stay together in one workspace.
                </div>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-[26px] border border-[#00E5FF]/20 bg-gradient-to-br from-[#00E5FF]/[0.08] via-[#0A0A0A] to-[#0A0A0A] p-6 sm:p-7"
            >
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full bg-[#00E5FF]/[0.15] blur-[65px]"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.95, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent" />

              <div className="relative flex h-full flex-1 flex-col">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#00E5FF]/30 bg-[#00E5FF]/15 text-[#00E5FF] shadow-[0_0_28px_rgba(0,229,255,0.15)]">
                  <Sparkles size={22} />
                </span>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.17em] text-[#00E5FF]/70">
                  Room to grow
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                  Go Pro
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">
                  Explore the plan options available for your account and find
                  the right fit for your creative workflow.
                </p>

                <div className="mt-auto pt-7">
                  {onUpgrade ? (
                    <button
                      type="button"
                      onClick={onUpgrade}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00E5FF] px-4 text-sm font-bold text-black transition hover:bg-[#00D4EB] hover:shadow-[0_8px_30px_rgba(0,229,255,0.3)]"
                    >
                      View upgrade options
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <Link
                      to="/image"
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00E5FF] px-4 text-sm font-bold text-black transition hover:bg-[#00D4EB] hover:shadow-[0_8px_30px_rgba(0,229,255,0.3)]"
                    >
                      Explore the studio
                      <ArrowRight size={16} />
                    </Link>
                  )}

                  <p className="mt-3 text-center text-[11px] text-gray-500">
                    Plan details appear in your account.
                  </p>
                </div>
              </div>
            </motion.aside>
          </section>

          <footer className="flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2">
              <Activity size={14} className="text-[#00E5FF]/70" />
              Your creative workspace is ready.
            </span>
            <span>SketchFlow AI</span>
          </footer>
        </div>
      </main>
    </DashboardLayout>
  );
}