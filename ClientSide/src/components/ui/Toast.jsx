import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X, AlertTriangle } from 'lucide-react';
import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now() + Math.random();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4500); // 4.5 seconds
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export const toast = {
  success: (msg) => useToastStore.getState().addToast({ msg, type: 'success' }),
  error: (msg) => useToastStore.getState().addToast({ msg, type: 'error' }),
  info: (msg) => useToastStore.getState().addToast({ msg, type: 'info' }),
  warning: (msg) => useToastStore.getState().addToast({ msg, type: 'warning' }),
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />,
  };

  const styles = {
    success: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20',
    error: 'text-red-400 bg-red-500/10 border-red-500/20',
    info: 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/20',
    warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  };

  return (
    <div className="fixed top-6 right-6 z-[100] space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-xl border ${styles[t.type]} min-w-[300px] max-w-sm`}
          >
            <span className="flex-shrink-0">{icons[t.type]}</span>
            <span className="flex-1 text-sm font-medium text-white">{t.msg}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}