import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleAlert,
  Download,
  FolderOpen,
  Image as ImageIcon,
  Layers3,
  RefreshCw,
  Sparkles,
  Trash2,
  Video,
  MoreHorizontal,
  Maximize2,
  Play
} from 'lucide-react';

import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

function getMediaUrl(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;

  const apiBase = api?.defaults?.baseURL || window.location.origin;
  const apiOrigin = new URL(apiBase, window.location.origin).origin;

  return new URL(path, apiOrigin).toString();
}

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
}

function StatCard({ icon: Icon, label, value, tone, index, reduceMotion }) {
  const toneStyles = {
    lime: {
      color: 'text-[#00E5FF]',
      glow: 'bg-[#00E5FF]/[0.12]',
      border: 'hover:border-[#00E5FF]/30',
      iconBg: 'bg-[#00E5FF]/10 border-[#00E5FF]/20',
    },
    cyan: {
      color: 'text-[#38BDF8]',
      glow: 'bg-[#38BDF8]/[0.12]',
      border: 'hover:border-[#38BDF8]/30',
      iconBg: 'bg-[#38BDF8]/10 border-[#38BDF8]/20',
    },
    violet: {
      color: 'text-purple-400',
      glow: 'bg-purple-500/[0.12]',
      border: 'hover:border-purple-500/30',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
    },
  };

  const toneStyle = toneStyles[tone];

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 20, rotateX: -4 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -5, rotateX: 2, transition: { duration: 0.2 } }
      }
      style={{ transformPerspective: 900, transformStyle: 'preserve-3d' }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-5 transition-colors ${toneStyle.border}`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125 ${toneStyle.glow}`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-white">
            {value}
          </p>
        </div>

        <span className={`grid h-10 w-10 place-items-center rounded-xl border ${toneStyle.iconBg}`}>
          <Icon size={18} className={toneStyle.color} strokeWidth={2} />
        </span>
      </div>

      <div className="relative mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.13em] text-gray-500">
        <span className={`h-1.5 w-1.5 rounded-full ${toneStyle.glow}`} />
        In this view
      </div>
    </motion.article>
  );
}

function EmptyMedia({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.01] px-5 py-12 text-center transition-colors hover:bg-white/[0.02]">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-gray-400">
        <Icon size={22} />
      </span>
      <h3 className="mt-4 text-sm font-bold text-white">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function MediaSkeleton({ video = false }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] ${
        video ? 'aspect-video' : 'aspect-square'
      }`}
    />
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [error, setError] = useState('');
  const [mediaError, setMediaError] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    setLoading(true);
    setMediaLoading(true);
    setError('');
    setMediaError(false);

    api.get(`/projects/${id}`)
      .then((response) => {
        if (isCurrent) setProject(response?.data?.data?.project || null);
      })
      .catch((requestError) => {
        if (isCurrent) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    Promise.allSettled([
      api.get(`/media?type=image&projectId=${encodeURIComponent(id)}&limit=20`),
      api.get(`/media?type=video&projectId=${encodeURIComponent(id)}&limit=20`),
    ]).then((results) => {
      if (!isCurrent) return;

      if (results[0].status === 'fulfilled') {
        setImages(results[0].value?.data?.data?.media || []);
      }
      if (results[1].status === 'fulfilled') {
        setVideos(results[1].value?.data?.data?.media || []);
      }

      setMediaError(results.some((result) => result.status === 'rejected'));
      setMediaLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [id, reloadKey]);

  const handleDelete = async () => {
    const projectName = project?.name || 'this project';
    const confirmed = window.confirm(`Delete "${projectName}"? This action cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    setDeleteError('');

    try {
      await api.delete(`/projects/${id}`);
      navigate('/projects');
    } catch (deleteRequestError) {
      setDeleteError(getErrorMessage(deleteRequestError));
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-4 w-32 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-48 animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.02]" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
            ))}
          </div>
        </main>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
            <FolderOpen size={28} />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-white">
            {error || 'Project not found'}
          </h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
            The project may have been removed, or it may not be available right now.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              <RefreshCw size={15} /> Try again
            </button>
            <Link
              to="/projects"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#00E5FF] px-4 text-sm font-bold text-black transition hover:bg-[#00D4EB]"
            >
              <ArrowLeft size={15} /> Back to projects
            </Link>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  const imageLink = `/image?projectId=${encodeURIComponent(id)}`;
  const videoLink = `/video?projectId=${encodeURIComponent(id)}`;

  return (
    <DashboardLayout>
      <main className="relative isolate mx-auto w-full max-w-7xl overflow-hidden px-4 py-7 text-white sm:px-6 sm:py-9 lg:px-8 ">
        
        {/* Background Ambient */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#00E5FF]/[0.06] blur-[100px]"
          animate={reduceMotion ? undefined : { x: [0, -18, 0], y: [0, 16, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 rounded-full bg-[#38BDF8]/[0.04] blur-[100px]"
          animate={reduceMotion ? undefined : { x: [0, 18, 0], y: [0, -16, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative space-y-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Back to all projects
          </Link>

          {/* ═══════════ PROJECT HEADER ═══════════ */}
          <motion.header
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-[#0A0A0A] via-[#050505] to-[#0A0A0A] p-6 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-8 -top-20 h-72 w-72 rounded-full bg-[#00E5FF]/[0.08] blur-[80px]" />
            <div className="pointer-events-none absolute bottom-0 right-1/3 h-px w-1/2 bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col sm:flex-row min-w-0 gap-5">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl border border-[#00E5FF]/20 bg-[#00E5FF]/10 text-[#00E5FF] shadow-[0_0_40px_rgba(0,229,255,0.15)]">
                  <FolderOpen size={28} />
                </span>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#00E5FF]">
                      Project Workspace
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <CalendarDays size={14} /> Created {formatDate(project.createdAt)}
                    </span>
                  </div>

                  <h1 className="break-words text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                    {project.name}
                  </h1>

                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-gray-400">
                    {project.description || 'No description added yet. Start building your creative vision.'}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  to={imageLink}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] px-5 text-sm font-bold text-black shadow-[0_8px_20px_rgba(0,229,255,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,229,255,0.4)]"
                >
                  <ImageIcon size={16} /> Create image
                </Link>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 text-sm font-semibold text-rose-400 transition hover:border-rose-500/40 hover:bg-rose-500/20 disabled:cursor-wait disabled:opacity-60"
                >
                  {deleting ? <RefreshCw size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>

            {deleteError && (
              <p className="relative mt-6 flex items-center gap-2 text-sm font-medium text-rose-400" role="alert">
                <CircleAlert size={16} /> {deleteError}
              </p>
            )}
          </motion.header>

          {/* ═══════════ PROJECT OVERVIEW ═══════════ */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-[#00E5FF]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                Project overview
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard icon={Layers3} label="Project type" value={project.type || 'Mixed'} tone="lime" index={0} reduceMotion={reduceMotion} />
              <StatCard icon={ImageIcon} label="Images loaded" value={mediaLoading ? '—' : images.length} tone="cyan" index={1} reduceMotion={reduceMotion} />
              <StatCard icon={Video} label="Videos loaded" value={mediaLoading ? '—' : videos.length} tone="violet" index={2} reduceMotion={reduceMotion} />
            </div>
          </section>

          {/* ═══════════ CREATE ACTIONS ═══════════ */}
          <section>
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">Keep creating</p>
              <h2 className="mt-1 text-xl font-bold text-white">Make something for this project</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Link to={imageLink}>
                <motion.article
                  whileHover={reduceMotion ? undefined : { y: -5, transition: { duration: 0.2 } }}
                  className="group relative h-full min-h-[200px] overflow-hidden rounded-3xl border border-[#00E5FF]/10 bg-[#0A0A0A] p-6 sm:p-7 transition-colors hover:border-[#00E5FF]/30"
                >
                  <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-[#00E5FF]/[0.08] blur-[60px] transition-transform duration-500 group-hover:scale-125" />
                  
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#00E5FF]/20 bg-[#00E5FF]/10 text-[#00E5FF] transition-transform duration-300 group-hover:rotate-[-7deg] group-hover:scale-110">
                        <ImageIcon size={22} />
                      </span>
                      <ArrowRight size={20} className="text-[#00E5FF]/60 transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className="mt-auto pt-8">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#00E5FF]/70">Image studio</p>
                      <h3 className="mt-1 text-lg font-bold text-white">Create a new visual</h3>
                      <p className="mt-1 text-sm text-gray-400">Generate an image and keep it with this project.</p>
                    </div>
                  </div>
                </motion.article>
              </Link>

              <Link to={videoLink}>
                <motion.article
                  whileHover={reduceMotion ? undefined : { y: -5, transition: { duration: 0.2 } }}
                  className="group relative h-full min-h-[200px] overflow-hidden rounded-3xl border border-[#38BDF8]/10 bg-[#0A0A0A] p-6 sm:p-7 transition-colors hover:border-[#38BDF8]/30"
                >
                  <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-[#38BDF8]/[0.08] blur-[60px] transition-transform duration-500 group-hover:scale-125" />
                  
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-[#38BDF8] transition-transform duration-300 group-hover:rotate-[7deg] group-hover:scale-110">
                        <Video size={22} />
                      </span>
                      <ArrowRight size={20} className="text-[#38BDF8]/60 transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className="mt-auto pt-8">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#38BDF8]/70">Video studio</p>
                      <h3 className="mt-1 text-lg font-bold text-white">Add motion to an idea</h3>
                      <p className="mt-1 text-sm text-gray-400">Generate a video and save it to this project.</p>
                    </div>
                  </div>
                </motion.article>
              </Link>
            </div>
          </section>

          {mediaError && (
            <div className="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 sm:flex-row sm:items-center sm:justify-between" role="status">
              <span className="inline-flex items-center gap-2 font-medium">
                <CircleAlert size={16} /> Some project media couldn’t load.
              </span>
              <button
                onClick={() => setReloadKey((key) => key + 1)}
                className="inline-flex items-center gap-2 self-start text-xs font-bold hover:text-white sm:self-auto"
              >
                <RefreshCw size={13} /> Try again
              </button>
            </div>
          )}

          {/* ═══════════ IMAGES LIBRARY ═══════════ */}
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">Visual library</p>
                <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-white">
                  <ImageIcon size={18} className="text-[#00E5FF]" />
                  Images
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-bold text-gray-400">
                    {mediaLoading ? '—' : images.length}
                  </span>
                </h2>
              </div>
            </div>

            {mediaLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {[0, 1, 2, 3].map((item) => <MediaSkeleton key={item} />)}
              </div>
            ) : images.length === 0 ? (
              <EmptyMedia
                icon={ImageIcon}
                title="No project images yet"
                description="Create an image and it will appear here with the rest of this project’s work."
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((image, index) => {
                  const imageUrl = getMediaUrl(image.url);

                  return (
                    <motion.article
                      key={image._id}
                      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: Math.min(index * 0.045, 0.25) }}
                      whileHover={reduceMotion ? undefined : { y: -4 }}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A]"
                    >
                      <img
                        src={imageUrl}
                        alt={image.prompt || 'Project image'}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-80 transition-opacity group-hover:opacity-100" />

                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="line-clamp-2 text-xs font-medium leading-relaxed text-white">
                          {image.prompt || 'Project image'}
                        </p>
                        <div className="flex shrink-0 gap-2">
                          <a
                            href={imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white backdrop-blur transition hover:bg-white hover:text-black"
                          >
                            <Maximize2 size={14} />
                          </a>
                          <a
                            href={imageUrl}
                            download
                            className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white backdrop-blur transition hover:bg-[#00E5FF] hover:text-black"
                          >
                            <Download size={14} />
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </section>

          {/* ═══════════ VIDEOS LIBRARY ═══════════ */}
          <section>
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">Motion library</p>
              <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-white">
                <Video size={18} className="text-[#38BDF8]" />
                Videos
                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-bold text-gray-400">
                  {mediaLoading ? '—' : videos.length}
                </span>
              </h2>
            </div>

            {mediaLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1].map((item) => <MediaSkeleton key={item} video />)}
              </div>
            ) : videos.length === 0 ? (
              <EmptyMedia
                icon={Video}
                title="No project videos yet"
                description="Create a video for this project and come back here to preview or download it."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {videos.map((video, index) => {
                  const videoUrl = getMediaUrl(video.url);

                  return (
                    <motion.article
                      key={video._id}
                      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.25) }}
                      className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-2 transition-colors hover:border-[#38BDF8]/30"
                    >
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        className="aspect-video w-full rounded-2xl bg-black object-contain"
                        src={videoUrl}
                      />

                      <div className="flex items-center justify-between gap-3 px-3 py-4">
                        <p className="line-clamp-2 text-sm font-medium text-gray-300">
                          {video.prompt || 'Project video'}
                        </p>
                        <a
                          href={videoUrl}
                          download
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-gray-300 transition hover:border-[#38BDF8]/30 hover:bg-[#38BDF8] hover:text-black"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}