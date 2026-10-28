import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Save,
  Code2,
  Download,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  FileCode2,
  Zap,
  ArrowRight,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { toast } from '../components/ui/Toast';
import api from '../services/api';

export default function CodeEditor() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(
    '// Prompt likho aur "Generate" dabao\n// Language prompt se detect hogi (python, html, js, react, etc.)'
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ---------- Generate via AI ----------
  const handleGenerate = async () => {
    if (prompt.trim().length < 5) {
      toast.error('Please write a clear prompt first.');
      return;
    }
    setLoading(true);
    setCopied(false);

    try {
      const payload = {
        prompt,
        projectId: projectId || undefined,
      };

      const res = await api.post('/ai/code/generate', payload);
      const data = res.data?.data || {};
      const generatedCode = data.code || '';
      const detectedLang = data.language || 'javascript';

      setLanguage(detectedLang);
      setCode(generatedCode);
      
      // ✅ FIX: Toast message se language ka naam hata diya
      toast.success('Code generated successfully!');
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate code.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Copy ----------
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Copy failed.');
    }
  };

  // ---------- Download ----------
  const handleDownload = () => {
    const extMap = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      react: 'jsx',
      node: 'js',
      sql: 'sql',
      text: 'txt',
    };
    const ext = extMap[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sketchflow-code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded.');
  };

  // ---------- Clear ----------
  const handleClear = () => {
    setCode('');
    toast.info('Editor cleared.');
  };

  // ---------- Save ----------
  const handleSave = async () => {
    if (!projectId) {
      toast.error('Open a project first to save.');
      return;
    }
    try {
      await api.post('/ai/code/save', {
        projectId,
        language,
        code,
      });
      toast.success('Saved to project!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    }
  };

  return (
    <DashboardLayout>
      <main className="relative isolate flex h-[calc(100vh-120px)] flex-col overflow-hidden text-white">
        
        {/* ═══════════ AMBIENT BACKGROUND ═══════════ */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#00E5FF]/[0.08] blur-[120px]" />
          <div className="absolute -left-20 top-1/2 h-72 w-72 rounded-full bg-[#38BDF8]/[0.05] blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        {/* ═══════════ HEADER ═══════════ */}
        <header className="flex items-center justify-between mb-5 px-1 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00E5FF] blur-md opacity-30 rounded-xl" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#38BDF8] shadow-lg shadow-[#00E5FF]/20">
                <Code2 size={22} className="text-black" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Code Studio
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Prompt likho — koi bhi language, koi bhi kaam.
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10 text-white font-semibold rounded-xl transition-all duration-300"
          >
            <Save size={16} className="text-gray-400 group-hover:text-[#00E5FF] transition-colors" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </header>

        {/* ═══════════ MAIN LAYOUT ═══════════ */}
        <div className="flex flex-1 min-h-0 gap-5 relative z-10">
          
          {/* ── LEFT: PROMPT PANEL ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-[400px] xl:w-[440px] shrink-0 flex flex-col rounded-2xl border border-white/[0.08] bg-[#0A0A0A]/80 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Prompt Header */}
            <div className="px-5 py-4 border-b border-white/[0.05] bg-white/[0.01] flex items-center gap-2">
              <Wand2 size={16} className="text-[#00E5FF]" />
              <span className="text-sm font-bold text-white">AI Assistant</span>
              <span className="ml-auto flex h-2 w-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
            </div>

            {/* Prompt Input Area */}
            <div className="flex-1 p-5 flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                Prompt / Instructions
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder={`e.g. "Python mein fibonacci likho"\n"HTML mein login form banao"\n"Ye JS code fix karo: ..."`}
                className="flex-1 w-full resize-none rounded-xl bg-[#050505] border border-white/[0.06] p-4 text-sm leading-relaxed text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/20 transition-all"
              />
              
              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {loading ? (
                    <RefreshCw size={18} className="animate-spin relative" />
                  ) : (
                    <Sparkles size={18} className="relative" />
                  )}
                  <span className="relative">{loading ? 'Generating...' : 'Generate Code'}</span>
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-sans">Enter</kbd> to generate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-sans">Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-sans">Enter</kbd> new line
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Tips / Footer */}
            <div className="p-4 bg-gradient-to-t from-[#00E5FF]/[0.03] to-transparent border-t border-white/[0.05]">
              <div className="flex items-start gap-3">
                <Zap size={16} className="text-[#00E5FF] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white mb-1">Pro Tip</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Be specific with your prompt. Mention the language (React, Python, HTML) and the exact goal for best results.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* ── RIGHT: MONACO EDITOR ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-1 flex flex-col rounded-2xl border border-white/[0.08] bg-[#1E1E1E] shadow-2xl overflow-hidden"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-black/40 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 transition-colors cursor-pointer" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 transition-colors cursor-pointer" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#27C93F]/80 transition-colors cursor-pointer" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 bg-black/20 rounded-lg p-0.5 border border-white/5">
                <button
                  onClick={handleCopy}
                  title="Copy code"
                  className="group flex items-center gap-2 px-2.5 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="group-hover:text-[#00E5FF]" />}
                  <span className="hidden sm:inline font-medium">{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <div className="w-px h-4 bg-white/10 mx-0.5" />
                <button
                  onClick={handleDownload}
                  title="Download file"
                  className="group flex items-center gap-2 px-2.5 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Download size={14} className="group-hover:text-[#00E5FF]" />
                  <span className="hidden sm:inline font-medium">Download</span>
                </button>
                <div className="w-px h-4 bg-white/10 mx-0.5" />
                <button
                  onClick={handleClear}
                  title="Clear editor"
                  className="group flex items-center gap-2 px-2.5 py-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={14} />
                  <span className="hidden sm:inline font-medium">Clear</span>
                </button>
              </div>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                  fontLigatures: true,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  padding: { top: 20, bottom: 20 },
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  automaticLayout: true,
                  tabSize: 2,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  scrollbar: {
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                  },
                }}
              />
            </div>

            {/* Footer Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-t border-black/40 text-[11px] font-medium text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[#00E5FF]/80">
                  <FileCode2 size={12} />
                  {language.toUpperCase()}
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span>{code.split('\n').length} lines</span>
                <span className="w-px h-3 bg-white/10" />
                <span>{code.length} chars</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Ready
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </DashboardLayout>
  );
}