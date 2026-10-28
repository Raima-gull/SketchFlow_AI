import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FolderOpen, 
  Trash2, 
  Search, 
  X, 
  Sparkles,
  LayoutGrid,
  Clock
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    api.get('/projects').then((res) => {
      setProjects(res.data.data.projects || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setCreating(true);
    try {
      await api.post('/projects', { 
        name: newProjectName, 
        description: newProjectDesc,
        type: 'website'
      });
      setIsModalOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
      fetchProjects();
    } catch (err) {
      alert('Error creating project: ' + (err.response?.data?.message || err.message));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <main className="relative isolate mx-auto min-h-screen w-full max-w-[1600px] overflow-hidden px-4 py-7 text-white sm:px-6 sm:py-9 xl:px-8 ">
        
        {/* Ambient Background Glow */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#00E5FF]/[0.06] blur-[100px]"
          animate={{ x: [0, -18, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-[42%] h-72 w-72 rounded-full bg-[#38BDF8]/[0.04] blur-[100px]"
          animate={{ x: [0, 16, 0], y: [0, -14, 0], scale: [1.05, 1, 1.05] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative space-y-8">
          
          {/* ═══════════ HEADER ═══════════ */}
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.17em] text-[#00E5FF]">
                <LayoutGrid size={12} />
                YOUR WORKSPACE
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Projects
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Manage all your creative workspaces in one place.
              </p>
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] px-5 py-3 text-sm font-bold text-black shadow-[0_8px_30px_rgba(0,229,255,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,229,255,0.4)]"
            >
              <Plus size={18} className="transition-transform group-hover:rotate-90" /> 
              New Project
            </motion.button>
          </header>

          {/* ═══════════ SEARCH BAR ═══════════ */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-md group"
          >
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00E5FF] transition-colors" />
            <input
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-11 pr-4 py-3.5 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF]/50 focus:bg-[#0A0A0A] focus:shadow-[0_0_20px_rgba(0,229,255,0.08)] transition-all"
            />
          </motion.div>

          {/* ═══════════ PROJECTS GRID ═══════════ */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-60 rounded-3xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.01] p-16 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#00E5FF]/10 flex items-center justify-center mx-auto mb-6">
                <FolderOpen size={32} className="text-[#00E5FF]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
              <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                {search ? "No projects match your search." : "Create your first project to get started."}
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
              >
                <Plus size={18} /> Create Project
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/projects/${p._id}`)}
                  className="group relative cursor-pointer rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent p-[1px] hover:from-[#00E5FF]/50 transition-all duration-300"
                >
                  <div className="relative rounded-3xl bg-[#0A0A0A] p-6 h-full flex flex-col z-10 overflow-hidden">
                    {/* Hover Glow */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00E5FF]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00E5FF]/20 transition-all duration-300">
                        <FolderOpen size={24} className="text-[#00E5FF]" />
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }} 
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-[#00E5FF] transition-colors">{p.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">{p.description || 'No description provided.'}</p>
                    
                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-500 relative z-10">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={12} />
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="text-[#00E5FF] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2">
                        Open Project →
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ═══════════ CREATE PROJECT MODAL ═══════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0A0A0A] border border-white/[0.1] rounded-3xl p-8 relative overflow-hidden shadow-[0_20px_80px_-20px_rgba(0,229,255,0.2)]"
            >
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#00E5FF]/15 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-[#00E5FF]" size={24} /> Create Project
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Start a new creative workspace.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="relative z-10 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Project Name</label>
                  <input
                    type="text" 
                    required 
                    value={newProjectName} 
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. My AI Startup"
                    className="w-full h-12 px-4 rounded-xl bg-[#050505] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF]/50 focus:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description (Optional)</label>
                  <textarea
                    rows={3} 
                    value={newProjectDesc} 
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="Describe what you are building..."
                    className="w-full p-4 rounded-xl bg-[#050505] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF]/50 focus:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all resize-none"
                  />
                </div>
                <button
                  type="submit" 
                  disabled={creating}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-black font-bold hover:opacity-90 transition-all shadow-[0_0_25px_rgba(0,229,255,0.2)] disabled:opacity-50 mt-2"
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}