import Sidebar from './Sidebar';
import { ToastContainer } from '../ui/Toast';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#030303] flex relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00E5FF]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#38BDF8]/[0.02] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <Sidebar />

      <main className="flex-1 ml-[280px] p-8 relative z-10">
        <ToastContainer />
        {children}
      </main>
    </div>
  );
}