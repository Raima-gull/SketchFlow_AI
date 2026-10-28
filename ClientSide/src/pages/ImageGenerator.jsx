import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowRight,
  CircleAlert,
  Clock3,
  Download,
  Image as ImageIcon,
  Layers3,
  Maximize2,
  RefreshCw,
  Sparkles,
  WandSparkles,
} from 'lucide-react';

import DashboardLayout from '../components/layout/DashboardLayout';
import { toast } from '../components/ui/Toast';
import api from '../services/api';

const promptIdeas = [
  'Dreamy editorial portrait, soft sunset light',
  'A tiny greenhouse on a floating island',
  'Retro-futuristic city in the rain',
];

function getImageUrl(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;

  const apiBase = api?.defaults?.baseURL || window.location.origin;
  const apiOrigin = new URL(apiBase, window.location.origin).origin;

  return new URL(path, apiOrigin).toString();
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
}

function ImageTile({ image, selected, onSelect, index }) {
  const imageUrl = getImageUrl(image.url);

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.045, 0.25),
      }}
      whileHover={{ y: -4 }}
      onClick={onSelect}
      className={`group relative aspect-square overflow-hidden rounded-2xl border bg-[#0A0A0A] text-left transition ${
        selected
          ? 'border-[#00E5FF]/70 ring-2 ring-[#00E5FF]/20'
          : 'border-white/[0.08] hover:border-white/[0.2]'
      }`}
      aria-label={`Show image: ${image.prompt || 'Generated image'}`}
      aria-pressed={selected}
    >
      <img
        src={imageUrl}
        alt={image.prompt || 'Generated image'}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-100" />

      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
        <span className="line-clamp-2 text-xs leading-5 text-white/90">
          {image.prompt || 'Generated image'}
        </span>
        <Maximize2
          size={15}
          className="mb-0.5 shrink-0 text-white opacity-0 transition-opacity group-hover:opacity-100"
        />
      </span>
    </motion.button>
  );
}

export default function ImageGenerator() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const reduceMotion = useReducedMotion();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationId, setGenerationId] = useState(null);
  const [latestImage, setLatestImage] = useState(null);
  const [images, setImages] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(false);
  const [historyReloadKey, setHistoryReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    setHistoryLoading(true);
    setHistoryError(false);

    const safeProjectId =
      projectId && projectId !== 'undefined' ? projectId : null;

    const url = safeProjectId
      ? `/media?type=image&projectId=${encodeURIComponent(safeProjectId)}&limit=50`
      : '/media?type=image&limit=50';

    api
      .get(url)
      .then((response) => {
        if (!isCurrent) return;
        setImages(response?.data?.data?.media || []);
      })
      .catch(() => {
        if (isCurrent) setHistoryError(true);
      })
      .finally(() => {
        if (isCurrent) setHistoryLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [projectId, historyReloadKey]);

  useEffect(() => {
    if (!generationId) return undefined;

    let isCurrent = true;
    let timeoutId;
    let attempts = 0;

    const pollStatus = async () => {
      if (attempts >= 60) {
        if (isCurrent) {
          setLoading(false);
          setGenerationId(null);
          toast.error('Generation is taking longer than expected. Check your history shortly.');
        }
        return;
      }

      attempts += 1;

      try {
        const response = await api.get(`/ai/image/${generationId}/status`);
        if (!isCurrent) return;

        const generation = response?.data?.data?.generation;

        if (generation?.status === 'completed') {
          const newMedia = response?.data?.data?.media?.[0];

          if (newMedia) {
            setLatestImage(newMedia);
            setImages((current) => [
              newMedia,
              ...current.filter((image) => image._id !== newMedia._id),
            ]);
            toast.success('Image generated successfully!');
          } else {
            toast.error('The image finished generating, but no image was returned.');
          }

          setLoading(false);
          setGenerationId(null);
          return;
        }

        if (generation?.status === 'failed') {
          throw new Error(generation?.error || 'Image generation failed.');
        }

        timeoutId = window.setTimeout(pollStatus, 5000);
      } catch (error) {
        if (!isCurrent) return;

        setLoading(false);
        setGenerationId(null);
        toast.error(getErrorMessage(error));
      }
    };

    timeoutId = window.setTimeout(pollStatus, 1500);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeoutId);
    };
  }, [generationId]);

  const handleGenerate = async (event) => {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length < 3 || loading) return;

    setLoading(true);
    setLatestImage(null);

    const payload = {
      prompt: trimmedPrompt,
      provider: 'magic-hour',
    };

    if (projectId && projectId !== 'undefined') {
      payload.projectId = projectId;
    }

    try {
      const response = await api.post('/ai/image/generate', payload);
      const nextGenerationId = response?.data?.data?.generation?._id;

      if (!nextGenerationId) {
        throw new Error('The generation request did not return an ID.');
      }

      setGenerationId(nextGenerationId);
    } catch (error) {
      const message = getErrorMessage(error);

      if (message.toLowerCase().includes('credit')) {
        toast.error('Credit limit reached. Please check your plan.');
      } else {
        toast.error(message);
      }

      setLoading(false);
    }
  };

  const addPromptIdea = (idea) => {
    setPrompt((current) =>
      current.trim()
        ? `${current.trimEnd()} ${idea}`
        : idea,
    );
  };

  const selectImage = (image) => {
    setLatestImage(image);
  };

  const latestImageUrl = getImageUrl(latestImage?.url);

  return (
    <DashboardLayout>
     <main className="relative isolate mx-auto min-h-screen w-full max-w-[1600px] overflow-hidden bg-black px-4 py-7 text-white sm:px-6 sm:py-9 xl:px-8">
        {/* Ambient light */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#00E5FF]/[0.06] blur-[100px]"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -18, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-[40%] h-72 w-72 rounded-full bg-[#38BDF8]/[0.05] blur-[100px]"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 16, 0], y: [0, -14, 0], scale: [1.05, 1, 1.05] }
          }
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative space-y-7">
          {/* Page heading */}
          <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.17em] text-[#00E5FF]">
                <Sparkles size={13} />
                MAGIC HOUR · AI IMAGE STUDIO
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Imagine it.
                <br className="sm:hidden" />{' '}
                <span className="bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] bg-clip-text text-transparent">
                  See it.
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                Describe the scene in your head. Start with a few words and
                shape the details as you go.
              </p>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex items-center gap-2 self-start rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-xs text-gray-400 lg:self-auto"
            >
              <Layers3 size={15} className="text-[#00E5FF]" />
              {projectId && projectId !== 'undefined'
                ? 'Project images'
                : 'Your creative library'}
            </motion.div>
          </header>

          {/* Generator and preview */}
          <section className="grid gap-5 xl:grid-cols-[minmax(330px,0.78fr)_minmax(0,1.22fr)]">
            {/* Prompt panel */}
            <motion.section
              initial={reduceMotion ? false : { opacity: 0, x: -26 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -3, transition: { duration: 0.2 } }
              }
              className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#0A0A0A] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:p-7"
            >
              <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#00E5FF]/[0.08] blur-[75px]" />

              <form
                onSubmit={handleGenerate}
                className="relative flex h-full flex-col"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#00E5FF]/20 bg-[#00E5FF]/10 text-[#00E5FF]">
                    <WandSparkles size={20} />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#00E5FF]/70">
                      Prompt canvas
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-white">
                      What do you want to see?
                    </h2>
                  </div>
                </div>

                <label htmlFor="image-prompt" className="sr-only">
                  Describe the image you want to generate
                </label>
                <textarea
                  id="image-prompt"
                  rows={7}
                  maxLength={2000}
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="A cinematic portrait in a quiet glasshouse, soft morning light, delicate reflections, editorial photography..."
                  className="mt-6 min-h-[190px] w-full resize-y rounded-2xl border border-white/[0.08] bg-[#050505]/80 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-[#00E5FF]/45 focus:bg-[#0A0A0A] focus:ring-4 focus:ring-[#00E5FF]/[0.06]"
                />

                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={13} />
                    Add details for a more specific result
                  </span>
                  <span>{prompt.length}/2000</span>
                </div>

                <div className="mt-6">
                  <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    Need a starting point?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {promptIdeas.map((idea) => (
                      <button
                        key={idea}
                        type="button"
                        onClick={() => addPromptIdea(idea)}
                        className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-left text-[11px] leading-4 text-gray-400 transition hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/[0.06] hover:text-[#00E5FF] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/30"
                      >
                        {idea}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-7">
                  <div className="mb-3 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
                    <span className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                      Magic Hour
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.13em] text-gray-500">
                      Image model
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || prompt.trim().length < 3}
                    className="group relative inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] px-5 text-sm font-bold text-black shadow-[0_10px_30px_rgba(0,229,255,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,229,255,0.3)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative inline-flex items-center gap-2">
                      {loading ? (
                        <>
                          <RefreshCw size={17} className="animate-spin" />
                          Creating your image…
                        </>
                      ) : (
                        <>
                          <ImageIcon size={17} />
                          Generate image
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </span>
                  </button>

                  <p className="mt-3 text-center text-[10px] text-gray-500">
                    Generation may take a few moments.
                  </p>
                </div>
              </form>
            </motion.section>

            {/* Preview canvas */}
            <motion.section
              initial={reduceMotion ? false : { opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative min-h-[390px] overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#0A0A0A] shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:min-h-[480px]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(0,229,255,0.08),transparent_45%),radial-gradient(ellipse_at_85%_15%,rgba(56,189,248,0.06),transparent_35%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:38px_38px]" />

              <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between sm:left-5 sm:right-5 sm:top-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#050505]/75 px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] text-gray-300 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />
                  CANVAS PREVIEW
                </span>
                {latestImage && (
                  <span className="rounded-full border border-white/[0.08] bg-[#050505]/75 px-3 py-1.5 text-[10px] text-gray-400 backdrop-blur">
                    Generated image
                  </span>
                )}
              </div>

              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050505]/75 px-6 text-center backdrop-blur-md"
                    role="status"
                  >
                    <motion.div
                      className="relative grid h-24 w-24 place-items-center rounded-full border border-[#00E5FF]/15 bg-[#00E5FF]/[0.04]"
                      animate={
                        reduceMotion
                          ? undefined
                          : { scale: [1, 1.06, 1], rotate: [0, 8, 0] }
                      }
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <span className="absolute inset-2 rounded-full border border-dashed border-[#00E5FF]/30" />
                      <Sparkles size={28} className="text-[#00E5FF]" />
                    </motion.div>

                    <p className="mt-6 text-base font-bold text-white">
                      Bringing your idea to life
                    </p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
                      The image will appear here as soon as it’s ready.
                    </p>
                    <div className="mt-5 flex gap-1.5">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]"
                          animate={
                            reduceMotion
                              ? undefined
                              : { opacity: [0.3, 1, 0.3], y: [0, -3, 0] }
                          }
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: dot * 0.16,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {latestImage ? (
                  <motion.div
                    key={latestImage._id}
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45 }}
                    className="group absolute inset-0 p-3 pt-16 sm:p-5 sm:pt-16"
                  >
                    <img
                      src={latestImageUrl}
                      alt={latestImage.prompt || 'Generated image'}
                      className="h-full w-full rounded-2xl object-contain"
                    />

                    <div className="pointer-events-none absolute inset-3 top-16 rounded-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:inset-5 sm:top-16" />

                    <div className="absolute bottom-6 right-6 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <a
                        href={latestImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-white hover:text-black"
                        aria-label="Open image in a new tab"
                      >
                        <Maximize2 size={17} />
                      </a>
                      <a
                        href={latestImageUrl}
                        download
                        className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-white hover:text-black"
                        aria-label="Download image"
                      >
                        <Download size={17} />
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-4 pt-16 text-center"
                  >
                    <div className="relative grid h-28 w-28 place-items-center">
                      <motion.span
                        className="absolute inset-0 rounded-full border border-[#00E5FF]/15"
                        animate={
                          reduceMotion
                            ? undefined
                            : { rotate: 360, scale: [1, 1.06, 1] }
                        }
                        transition={{
                          rotate: {
                            duration: 24,
                            repeat: Infinity,
                            ease: 'linear',
                          },
                          scale: {
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          },
                        }}
                      />
                      <span className="absolute inset-3 rounded-full border border-dashed border-[#38BDF8]/20" />
                      <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-gray-400 shadow-[0_0_45px_rgba(0,229,255,0.08)]">
                        <ImageIcon size={27} strokeWidth={1.5} />
                      </span>
                      <span className="absolute right-1 top-2 text-[#00E5FF]">
                        <Sparkles size={15} />
                      </span>
                    </div>

                    <h2 className="mt-6 text-lg font-bold text-white">
                      Your canvas is ready
                    </h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
                      Write a prompt and generate an image. Your result will
                      appear here.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-4 left-5 z-10 hidden items-center gap-2 text-[10px] uppercase tracking-[0.13em] text-gray-500 sm:flex">
                <span className="h-1 w-1 rounded-full bg-[#00E5FF]" />
                Your creative canvas
              </div>
            </motion.section>
          </section>

          {/* Image history */}
          <section aria-label="Image history">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-gray-500">
                  Your creations
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">
                    Image history
                  </h2>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] text-gray-400">
                    {images.length}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Select an image to preview it on your canvas.
              </p>
            </div>

            {historyError && (
              <div
                className="mb-4 flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3 text-sm text-amber-200 sm:flex-row sm:items-center sm:justify-between"
                role="status"
              >
                <span className="inline-flex items-center gap-2">
                  <CircleAlert size={16} />
                  Image history couldn’t load.
                </span>
                <button
                  type="button"
                  onClick={() => setHistoryReloadKey((key) => key + 1)}
                  className="inline-flex items-center gap-2 self-start text-xs font-bold hover:text-white sm:self-auto"
                >
                  <RefreshCw size={13} />
                  Try again
                </button>
              </div>
            )}

            {historyLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
                {[0, 1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="aspect-square animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]"
                  />
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] px-5 py-12 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-gray-400">
                  <ImageIcon size={21} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-white">
                  No images here yet
                </h3>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-500">
                  Your generated images will be collected here for easy access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
                {images.map((image, index) => (
                  <ImageTile
                    key={image._id}
                    image={image}
                    index={index}
                    selected={latestImage?._id === image._id}
                    onSelect={() => selectImage(image)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}